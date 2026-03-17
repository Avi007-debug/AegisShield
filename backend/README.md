# AegisShield Backend

FastAPI service for graph simulation, propagation classification, OCR extraction, and threat operations.

## Run

From repository root:

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

API base URL: `http://localhost:8000`

## Main Endpoints

- `GET /health` API health/version
- `POST /classify` lightweight text-level fake/true classification
- `POST /analyze` full deterministic analysis (hash, propagation, graph)
- `GET /graph` graph snapshot
- `POST /contain/{node_id}` containment simulation and audit log append
- `GET /threat-scores` ranking based on threat score formula
- `GET /cluster-info` cluster metadata
- `GET /audit-log` audit records
- `POST /extract-text` OCR endpoint (`multipart/form-data`)

## Dev Utilities

- `GET /debug/training-stats` sampled feature snapshots for quick verification
- `python backend/scripts/health_check.py` endpoint smoke test

## Architecture

- `graph/engine.py`: graph creation, spread simulation, feature extraction, containment
- `graph/content_ingestor.py`: content hashing and infection probability scoring
- `propagation_classifier/prop_classifier.py`: loads and executes propagation classifier model
- `ocr/ocr_module.py`: OCR text extraction
- `main.py`: API composition and endpoint orchestration

## Reproducibility

`/analyze` uses deterministic seeds derived from content hash. Repeating analysis for identical text returns stable propagation output.
