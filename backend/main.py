from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import shutil
import uuid
import os

# NLP + OCR
from backend.nlp.classifier import predict
from backend.ocr.ocr_module import extract_text

# Graph engine
from backend.graph.engine import (
    G,
    SCORES,
    SUPERSPREADER_ID,
    simulate_containment,
    serialize_graph,
    simulate_spread
)

# Propagation classifier
from backend.propagation_classifier.prop_classifier import classify_propagation_pattern

app = FastAPI(title="AegisShield API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------- Request Models --------

class ClassifyRequest(BaseModel):
    text: str


class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    use_cached_graph: bool = True


class PropagationTimelineRequest(BaseModel):
    timeline: list  # [(node_id, step), ...]


# -------- Static Fallback Data --------

STATIC_NLP = {
    "label": "fake",
    "fake_probability": 0.91,
    "true_probability": 0.09,
    "confidence": "high"
}


# -------- Health Check --------

@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0.0"}


# -------- NLP Classification --------

@app.post("/classify")
async def classify_endpoint(req: ClassifyRequest):

    result = predict(req.text)

    return result


# -------- OCR Endpoint --------

@app.post("/extract-text")
async def extract_text_endpoint(file: UploadFile):

    temp_path = f"temp_{uuid.uuid4()}.png"

    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    extracted = extract_text(temp_path)

    os.remove(temp_path)

    return {"extracted_text": extracted}


# -------- Combined Analysis --------

@app.post("/analyze")
async def analyze(req: AnalyzeRequest):

    if req.text:
        nlp_result = predict(req.text)
    else:
        nlp_result = STATIC_NLP

    graph_data = serialize_graph(G, SUPERSPREADER_ID)

    return {
        "nlp": nlp_result,
        "graph": graph_data
    }


# -------- Propagation Classification --------

@app.post("/classify-propagation")
async def classify_propagation(req: PropagationTimelineRequest):
    """
    Classify a propagation timeline as either organic or coordinated.
    
    Input: timeline as list of [node_id, step] pairs
    Output: verdict (organic/coordinated), confidence, and extracted features
    """
    result = classify_propagation_pattern(req.timeline)
    return result


# -------- Graph Visualization --------

@app.get("/graph")
async def get_graph():

    return serialize_graph(G, SUPERSPREADER_ID)


# -------- Containment Simulation --------

@app.post("/contain/{node_id}")
async def contain(node_id: int):

    return simulate_containment(G, node_id)


# -------- Threat Scores --------

@app.get("/threat-scores")
async def threat_scores():

    ranked = sorted(
        SCORES.items(),
        key=lambda x: x[1]["threat_score"],
        reverse=True
    )

    scores_list = [
        {
            "node_id": node,
            "threat_score": data["threat_score"],
            "bc_score": data["bc_score"],
            "pr_score": data["pr_score"],
            "rank": i + 1,
            "type": G.nodes[node].get("type", "genuine")
        }
        for i, (node, data) in enumerate(ranked)
    ]

    return {
        "scores": scores_list,
        "superspreader_id": SUPERSPREADER_ID,
        "formula": "0.6 * bc_normalized + 0.4 * pr_normalized"
    }


# -------- Cluster Detection --------

@app.get("/cluster-info")
async def cluster_info():

    cluster_nodes = [
        n for n in G.nodes()
        if G.nodes[n].get("cluster_id") == "Campaign_A"
    ]

    return {
        "clusters": [
            {
                "cluster_id": "Campaign_A",
                "node_count": len(cluster_nodes),
                "nodes": cluster_nodes,
                "sync_window_ms": 2000,
                "detection_method": "time-window synchronization"
            }
        ],
        "total_clustered_nodes": len(cluster_nodes),
        "unclustered_nodes": 50 - len(cluster_nodes)
    }


# -------- Audit Log --------

@app.get("/audit-log")
async def audit_log():

    return {
        "log": [
            {
                "timestamp": "2024-03-16T09:14:22Z",
                "action": "containment_applied",
                "node_id": 1,
                "operator": "analyst_01",
                "reach_reduction_pct": 74.4,
                "approved": True
            }
        ]
    }

@app.get("/debug/training-stats")
async def training_stats():
    """Show sample features from training data"""
    from backend.graph.engine import simulate_spread, extract_features, G
    
    samples = {
        'organic': [],
        'coordinated': []
    }
    
    for i in range(5):
        org_timeline = simulate_spread(G, is_coordinated=False, seed=i)
        coord_timeline = simulate_spread(G, is_coordinated=True, seed=i + 500)
        
        samples['organic'].append(extract_features(org_timeline))
        samples['coordinated'].append(extract_features(coord_timeline))
    
    return samples