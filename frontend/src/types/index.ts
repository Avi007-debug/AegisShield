// ============ Propagation Types ============
export interface PropagationResult {
  verdict: 'organic' | 'coordinated'
  confidence: number
  coordination_prob: number
  features: Record<string, number>
}

// ============ Analyze Types ============
export interface AnalyzeRequest {
  text?: string
  use_cached_graph?: boolean
}

export interface AnalyzeResult {
  content_hash: string
  patient_zero: number
  infection_prob: number
  propagation: PropagationResult
  graph: GraphData
}

// ============ Graph Types ============
export interface GraphNode {
  id: number
  type: string
  label: string
}

export interface GraphEdge {
  source: number
  target: number
  id: string
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
  superspreader_id: number
  cluster_nodes: number[]
  node_count: number
  edge_count: number
}

// ============ Threat Types ============
export interface ThreatScore {
  node_id: number
  threat_score: number
  bc_score: number
  pr_score: number
  rank: number
  type: string
}

export interface ThreatScoresResponse {
  scores: ThreatScore[]
  superspreader_id: number
  formula: string
}

// ============ Cluster Types ============
export interface ClusterEntry {
  cluster_id: string
  node_count: number
  nodes: number[]
  sync_window_ms: number
  detection_method: string
}

export interface ClusterInfoResponse {
  clusters: ClusterEntry[]
  total_clustered_nodes: number
  unclustered_nodes: number
}

// ============ Audit Types ============
export interface AuditEntry {
  timestamp: string
  action: string
  node_id: number
  operator: string
  reach_reduction_pct: number
  approved: boolean
}

export interface AuditLogResponse {
  log: AuditEntry[]
}

// ============ Containment Types ============
export interface ContainmentResult {
  node_id: number
  reach_before: number
  reach_after: number
  reach_reduction_pct: number
  cut_edges: Array<[number, number]>
  bridge_bc_scores: Array<[Array<number>, number]>
}
