from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

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
async def get_graph(): return STATIC_GRAPH  
@app.post('/contain/{node_id}')
async def contain(node_id: int):
    return {'node_id':node_id,'reach_before':43,'reach_after':11,
            'reduction_pct':74.4,'removed_edges':8,'grayed_nodes':[3,7,12,20]}

@app.get('/threat-scores')
async def threat_scores():
    return {'scores':[{'node_id':1,'threat_score':0.91,'bc_score':0.88,
        'pr_score':0.95,'rank':1,'type':'superspreader'}],
        'superspreader_id':1,'formula':'0.6 * bc_normalized + 0.4 * pr_normalized'}

@app.get('/cluster-info')
async def cluster_info():
    return {'clusters':[{'cluster_id':'Campaign_A','node_count':15,
        'nodes':[20,21,22,23,24,25,26,27,28,29,30,31,32,33,34],
        'sync_window_ms':2000,'detection_method':'time-window synchronization'}],
        'total_clustered_nodes':15,'unclustered_nodes':35}

@app.get('/audit-log')
async def audit_log():
    return {'log':[{'timestamp':'2024-03-16T09:14:22Z',
        'action':'containment_applied','node_id':1,'operator':'analyst_01',
        'reach_reduction_pct':74.4,'approved':True}]}
