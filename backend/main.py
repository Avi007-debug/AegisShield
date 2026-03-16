from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from graph.engine import G, SCORES, SUPERSPREADER_ID, simulate_containment, serialize_graph

app = FastAPI(title='AegisShield API')
app.add_middleware(CORSMiddleware, allow_origins=['*'],
    allow_methods=['*'], allow_headers=['*'])

class ClassifyRequest(BaseModel):
    text: str

class AnalyzeRequest(BaseModel):
    text: Optional[str] = None
    use_cached_graph: bool = True


STATIC_NLP = {'label':'fake','fake_probability':0.91,
              'true_probability':0.09,'confidence':'high'}

STATIC_GRAPH = {'nodes':[{'id':0,'type':'patient_zero','fake_score':0.0,
    'threat_score':0.82,'bc_score':0.74,'pr_score':0.91,
    'cluster_id':None,'label':'Node 0'}],
    'edges':[{'source':0,'target':1,'id':'e0'}],
    'superspreader_id':1,'cluster_nodes':[20,21,22],
    'node_count':50,'edge_count':141}

@app.get('/health')
async def health(): 
    return {'status':'ok','version':'1.0.0'}

@app.post('/classify')
async def classify_endpoint(req: ClassifyRequest):
    return STATIC_NLP   

@app.post('/extract-text')
async def extract_text(file: UploadFile = File(...)):
    return {'extracted_text':'placeholder text','word_count':2,'ocr_confidence':'low'}

@app.post('/analyze')
async def analyze(req: AnalyzeRequest):
    return {'nlp': STATIC_NLP, 'graph': STATIC_GRAPH}  

@app.get('/graph')
async def get_graph():
    return serialize_graph(G, SUPERSPREADER_ID)
@app.post('/contain/{node_id}')
async def contain(node_id: int):
    return simulate_containment(G, node_id)

@app.get('/threat-scores')
async def threat_scores():
    ranked = sorted(SCORES.items(), key=lambda x: x[1]['threat_score'], reverse=True)
    scores_list = [
        {
            'node_id':      node,
            'threat_score': data['threat_score'],
            'bc_score':     data['bc_score'],
            'pr_score':     data['pr_score'],
            'rank':         i + 1,
            'type':         G.nodes[node].get('type', 'genuine')
        }
        for i, (node, data) in enumerate(ranked)
    ]
    return {
        'scores':           scores_list,
        'superspreader_id': SUPERSPREADER_ID,
        'formula':          '0.6 * bc_normalized + 0.4 * pr_normalized'
    }

@app.get('/cluster-info')
async def cluster_info():
    cluster_nodes = [n for n in G.nodes() if G.nodes[n].get('cluster_id') == 'Campaign_A']
    return {
        'clusters': [{
            'cluster_id':       'Campaign_A',
            'node_count':       len(cluster_nodes),
            'nodes':            cluster_nodes,
            'sync_window_ms':   2000,
            'detection_method': 'time-window synchronization'
        }],
        'total_clustered_nodes': len(cluster_nodes),
        'unclustered_nodes':     50 - len(cluster_nodes)
    }

@app.get('/audit-log')
async def audit_log():
    return {'log':[{'timestamp':'2024-03-16T09:14:22Z',
        'action':'containment_applied','node_id':1,'operator':'analyst_01',
        'reach_reduction_pct':74.4,'approved':True}]}
