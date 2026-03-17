import networkx as nx
import numpy as np
import random
import pandas as pd
from collections import Counter

# ── Graph Construction ─────────────────────────────────────────────────────────

def build_graph(n=50, m=3, seed=42) -> nx.DiGraph:
    # Build BA social network on nodes 1..n-1 (real accounts).
    # Node 0 is patient zero — it sits OUTSIDE the main hub structure so that
    # the composite BC+PageRank score naturally crowns a different node as
    # superspreader, making simulate_containment produce meaningful reach reduction.
    G_ba = nx.barabasi_albert_graph(n - 1, m, seed=seed)
    DG = nx.DiGraph()
    DG.add_nodes_from(range(n))
    for u, v in G_ba.edges():
        DG.add_edge(u + 1, v + 1)  # relabel 0..n-2 → 1..n-1, hub -> follower

    # Connect zero to exactly one hub: the highest out-degree node in
    # the BA subgraph.  One unknown account → one mega-amplifier → the network.
    top_hub = max(range(1, n), key=lambda x: DG.out_degree(x))
    DG.add_edge(0, top_hub)

    cluster_nodes = list(range(20, 35))  # nodes 20-34 = bot cluster

    for node in DG.nodes():
        if node == 0:
            DG.nodes[node]['type'] = 'patient_zero'
        elif node in cluster_nodes:
            DG.nodes[node]['type'] = 'bot'
        else:
            DG.nodes[node]['type'] = 'genuine'

        DG.nodes[node]['cluster_id'] = 'Campaign_A' if node in cluster_nodes else None
        DG.nodes[node]['fake_score'] = 0.0  # Only Node 0 gets updated by /analyze;
                                            # 0.0 is the correct default for all other nodes
                                            # (they represent accounts, not posts)
        DG.nodes[node]['label'] = f'Node {node}'

    return DG


# ── Composite Threat Score ─────────────────────────────────────────────────────

def compute_threat_scores(DG) -> tuple[dict, int]:
    """
    Returns (scores_dict, superspreader_id).
    scores_dict: {node_id: {threat_score, bc_score, pr_score}}
    Also writes threat_score, bc_score, pr_score back onto DG node attributes.
    Tags the top-scoring node's type as 'superspreader' in DG.
    """
    bc = nx.betweenness_centrality(DG, normalized=True)
    pr = nx.pagerank(DG, alpha=0.85)

    bc_vals = list(bc.values())
    pr_vals = list(pr.values())

    bc_min, bc_max = min(bc_vals), max(bc_vals)
    pr_min, pr_max = min(pr_vals), max(pr_vals)

    scores = {}
    for node in DG.nodes():
        bc_n = (bc[node] - bc_min) / (bc_max - bc_min + 1e-9)
        pr_n = (pr[node] - pr_min) / (pr_max - pr_min + 1e-9)
        scores[node] = {
            'threat_score': round(0.6 * bc_n + 0.4 * pr_n, 4),
            'bc_score':     round(bc_n, 4),
            'pr_score':     round(pr_n, 4)
        }

    # Reset any previous superspreader tag to avoid two nodes showing as orange
    # if this function is called more than once (e.g. repeated /analyze calls)
    for node in DG.nodes():
        if DG.nodes[node].get('type') == 'superspreader':
            DG.nodes[node]['type'] = 'genuine'

    # Exclude Node 0 — Patient Zero is the misinformation source, not the amplifier.
    # If Node 0 were selected, simulate_containment would remove its own outbound edges,
    # reach_before would drop to 0, and the dashboard would show 0% reduction.
    ss_id = max(
        (n for n in scores if n != 0),
        key=lambda n: scores[n]['threat_score']
    )
    DG.nodes[ss_id]['type'] = 'superspreader'

    for node in DG.nodes():
        DG.nodes[node].update(scores[node])

    return scores, ss_id


# ── Containment Simulation ─────────────────────────────────────────────────────

def simulate_containment(DG, node_id: int) -> dict:
    """
    Simulates removal of all outbound edges from node_id.
    NEVER mutates the global DG — always works on a copy.
    Safe to call repeatedly during the demo.
    """
    reach_before = len(nx.descendants(DG, 0))

    DG_copy = DG.copy()
    DG_copy.remove_edges_from(list(DG_copy.out_edges(node_id)))

    reach_after  = len(nx.descendants(DG_copy, 0))
    grayed       = list(nx.descendants(DG, node_id))
    removed      = len(list(DG.out_edges(node_id)))
    reduction    = round((reach_before - reach_after) / max(reach_before, 1) * 100, 1)

    return {
        'node_id':       node_id,
        'reach_before':  reach_before,
        'reach_after':   reach_after,
        'reduction_pct': reduction,
        'removed_edges': removed,
        'grayed_nodes':  grayed
    }


# ── Graph Serialization ────────────────────────────────────────────────────────

def serialize_graph(DG, ss_id) -> dict:
    """
    Converts DG to a Cytoscape-ready JSON dict.
    Used by both GET /graph and the Lead's POST /analyze.
    """
    nodes = [{'id': n, **DG.nodes[n]} for n in DG.nodes()]
    edges = [{'source': u, 'target': v, 'id': f'e{i}'}
             for i, (u, v) in enumerate(DG.edges())]
    cluster_nodes = [n for n in DG.nodes() if DG.nodes[n].get('cluster_id')]

    return {
        'nodes':            nodes,
        'edges':            edges,
        'superspreader_id': ss_id,
        'cluster_nodes':    cluster_nodes,
        'node_count':       len(nodes),
        'edge_count':       len(edges)
    }

# ── Simulation functions ──────────────────────────────────────────────────── 
def simulate_spread(DG, is_coordinated=False, steps=15, seed=None):
    """
    Improved spread simulation with clear organic vs coordinated distinction.
    """
    if seed: random.seed(seed)
    
    # Key difference: infection probability gap
    if is_coordinated:
        infection_prob = random.uniform(0.40, 0.60)  # Aggressive spread
        # 10-20 nodes pre-activated (strong bot signal)
        preseed_count = random.randint(10, 20)
        preseed_nodes = random.sample(list(DG.nodes())[1:], k=preseed_count)
    else:
        infection_prob = random.uniform(0.25, 0.35)  # Medium spread (increased from 16-28%)
        preseed_nodes = []
    
    infected = {0} | set(preseed_nodes)
    timeline = [(node, 0) for node in infected]
    
    for step in range(1, steps + 1):
        newly_infected = set()
        for node in infected:
            for neighbour in DG.successors(node):
                if neighbour not in infected:
                    if random.random() < infection_prob:
                        newly_infected.add(neighbour)
                        timeline.append((neighbour, step))
        
        infected |= newly_infected
        if not newly_infected:
            break
    
    # Observe 60-80% of nodes (more complete data)
    observability = random.uniform(0.6, 0.8)
    observed = [(n, s) for n, s in timeline if random.random() < observability]
    
    return observed if observed else [(0, 0)]

def extract_features(timeline: list) -> dict:
    if not timeline:
        return {
            'velocity_ratio': 0,
            'simultaneous_activation_count': 0,
            'activation_variance': 0,
            'depth_width_ratio': 0,
            'gini_coefficient': 0,      # new
            'cascade_depth': 0          # new
        }
    
    from collections import Counter
    steps = [t[1] for t in timeline]
    total = len(timeline)
    step_counts = Counter(steps)
    
    # ── Bot Detection proxy ───────────────────────────────────────────
    # Simultaneous activation: how many nodes fired at the earliest step?
    # Real bots activate in tight time windows — this is the core bot signal
    min_step = min(steps)
    simultaneous_activation_count = step_counts[min_step]
    
    # ── Anomaly Detection: velocity ───────────────────────────────────
    # What fraction of total spread happened in the first 20% of steps?
    max_step = max(steps) if steps else 1
    early_cutoff = max(1, int(max_step * 0.2))
    early_activations = sum(v for k, v in step_counts.items() if k <= early_cutoff)
    velocity_ratio = early_activations / max(total, 1)
    
    # ── Anomaly Detection: temporal variance ──────────────────────────
    # Low variance = burst pattern (coordinated)
    # High variance = slow trickle (organic)
    activation_variance = float(np.var(steps)) if len(steps) > 1 else 0
    
    # ── Network Threat Intelligence: cascade shape ────────────────────
    # depth_width_ratio: max nodes in any single step / total unique steps
    # Coordinated = wide bursts. Organic = narrow consistent steps
    max_step_count = max(step_counts.values())
    depth_width_ratio = max_step_count / max(len(step_counts), 1)
    
    # ── Network Threat Intelligence: Gini coefficient ─────────────────
    # Measures inequality of activation distribution across steps
    # High Gini = one step dominates (coordinated burst)
    # Low Gini = even spread across steps (organic)
    counts = sorted(step_counts.values())
    n = len(counts)
    if n > 1:
        cumulative = np.cumsum(counts)
        gini = (2 * np.sum((i + 1) * counts[i] for i in range(n)) 
                / (n * np.sum(counts)) - (n + 1) / n)
        gini = round(float(abs(gini)), 4)
    else:
        gini = 0.0
    
    # ── Bot Detection: cascade depth ─────────────────────────────────
    # How many propagation steps total?
    # Coordinated campaigns are wide but shallow (bots don't chain)
    # Organic virality is deep (person tells person tells person)
    cascade_depth = max_step - min_step if steps else 0
    
    return {
        'velocity_ratio':               round(velocity_ratio, 4),
        'simultaneous_activation_count': simultaneous_activation_count,
        'activation_variance':           round(activation_variance, 4),
        'depth_width_ratio':             round(depth_width_ratio, 4),
        'gini_coefficient':              gini,
        'cascade_depth':                 cascade_depth
    }

# ── Generate synthetic Training data  ──────────────────────────

def generate_training_data(n_samples=500) -> pd.DataFrame:
    rows = []
    
    for i in range(n_samples):
        # ~5% of labels are flipped (realistic label noise from annotation errors)
        is_mislabeled = random.random() < 0.05
        
        # Organic sample
        timeline = simulate_spread(G, is_coordinated=False, seed=i)
        features = extract_features(timeline)
        features['label'] = 1 if is_mislabeled else 0  # flipped if mislabeled
        rows.append(features)
        
        # Coordinated sample
        timeline = simulate_spread(G, is_coordinated=True, seed=i + 500)
        features = extract_features(timeline)
        features['label'] = 0 if is_mislabeled else 1  # flipped if mislabeled
        rows.append(features)
    
    return pd.DataFrame(rows)

# ── Module-Level Globals (built once at import time) ──────────────────────────

G = build_graph()
SCORES, SUPERSPREADER_ID = compute_threat_scores(G)

