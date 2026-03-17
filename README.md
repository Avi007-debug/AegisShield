# AegisShield

AegisShield is an AI-assisted misinformation defense platform that combines content analysis, propagation intelligence, and explainable threat operations in one dashboard.

It is designed as a practical demo system for identifying suspicious narratives, mapping potential spread, and simulating containment with an auditable trail.

## What This Project Does

- Ingests user content (text and OCR text from images)
- Computes content fingerprint and infection probability signals
- Simulates organic and coordinated propagation behavior
- Classifies propagation pattern (`organic` vs `coordinated`)
- Surfaces high-risk nodes and superspreaders
- Applies containment actions and logs compliance-grade audit entries

## High-Level Architecture

### Frontend

- React + TypeScript + Vite app
- Screens: Detection, Analytics, Threats, Audit
- Data fetching/caching via TanStack Query
- Network graph visualization via Cytoscape

### Backend

- FastAPI service
- Graph engine for simulation, feature extraction, and containment
- Propagation classifier model loaded from `backend/models/`
- OCR module for uploaded images

### Data Layer

- `data/datasets/` raw datasets
- `data/processed/` generated/combined datasets
- Source attribution in [data/README.md](data/README.md)

## Repository Structure

- `backend/` API and simulation logic
- `frontend/` web dashboard
- `data/` datasets and samples
- `tests/` utility checks and scripts
- [SETUP.md](SETUP.md) complete setup guide

## Quick Start

### 1. Start Backend

```bash
python -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\Activate.ps1  # Windows PowerShell

pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

Backend URL: `http://localhost:8000`

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

If backend runs on another host/port, set `VITE_API_URL` before `npm run dev`.

For full platform setup details, see [SETUP.md](SETUP.md).

## Core User Flow

1. Open Detection page and submit content.
2. Backend runs `/analyze` and returns graph + propagation inference.
3. Analytics and Threats pages reflect updated topology and rankings.
4. Execute containment on risky nodes.
5. Review resulting actions in Audit log.

## API Overview

- `GET /health` liveness/version
- `POST /classify` quick deterministic text classification
- `POST /analyze` full analysis (content hash, infection score, propagation, graph)
- `GET /graph` current graph snapshot
- `POST /contain/{node_id}` containment simulation + audit insertion
- `GET /threat-scores` ranked threat output
- `GET /cluster-info` campaign/cluster metadata
- `GET /audit-log` audit timeline
- `POST /extract-text` OCR endpoint (`multipart/form-data`)

API docs: `http://localhost:8000/docs`

## Deterministic Analysis Behavior

Repeated `POST /analyze` calls with identical input text return stable propagation values.

Reason: simulation seeds are derived from content hash, ensuring reproducible output for demos and testing.

## Validation And Health Check

After backend startup:

```bash
python backend/scripts/health_check.py
```

Custom target:

```bash
python backend/scripts/health_check.py --base-url http://127.0.0.1:8001 --sample-image data/samples/sample_image.png
```

## Development Commands

### Backend

- `python -m uvicorn backend.main:app --reload`

### Frontend

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## Troubleshooting

- Browser shows CORS/network error:
	check backend logs first; a backend 500 often appears as CORS/network failure in frontend.
- Frontend cannot connect to API:
	verify `VITE_API_URL` and backend port.
- OCR dependency issues:
	ensure compatible `torch`, `torchvision`, and `easyocr` versions for your system.

## Contributing

1. Create a feature branch.
2. Make focused changes with clear commit messages.
3. Run backend health check and frontend build/lint.
4. Open a pull request with a concise summary and testing notes.

## License

See [LICENSE](LICENSE).