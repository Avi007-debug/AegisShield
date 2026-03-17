# AegisShield Setup Guide

This guide provides a clean setup for local development (backend + frontend).

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- Git

Optional for OCR-heavy usage:

- GPU-compatible PyTorch stack (if you want acceleration)

## 1. Clone And Enter Repo

```bash
git clone <your-repo-url>
cd AegisShield
```

## 2. Backend Setup

### Windows (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

### Linux/macOS

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn backend.main:app --reload
```

Backend base URL: `http://localhost:8000`

## 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

To point frontend at a different backend URL:

### Windows (PowerShell)

```powershell
$env:VITE_API_URL="http://localhost:8000"
npm run dev
```

### Linux/macOS

```bash
export VITE_API_URL="http://localhost:8000"
npm run dev
```

## 4. Verify Setup

Backend health:

```bash
curl http://localhost:8000/health
```

or run the script:

```bash
python backend/scripts/health_check.py
```

## 5. Optional: Build Frontend

```bash
cd frontend
npm run build
```

## 6. Dataset Notes

Raw and processed datasets live in `data/`.

- `data/datasets/` raw sources
- `data/processed/` prepared outputs

Source links and attribution are documented in [data/README.md](data/README.md).

## 7. Common Issues

- `ModuleNotFoundError` in backend:
	activate `.venv` and reinstall `requirements.txt`.
- CORS error in browser:
	usually backend threw a 500; check backend terminal logs.
- OCR import/runtime issues:
	verify `torch`, `torchvision`, and `easyocr` install correctly for your platform.

## 8. Developer Shortcuts

- Backend API docs: `http://localhost:8000/docs`
- Frontend lint: `cd frontend && npm run lint`
- Frontend preview build: `cd frontend && npm run preview`
