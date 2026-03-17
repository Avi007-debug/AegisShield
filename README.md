# AegisShield

## Backend quick health check

1. Start API server:

```bash
python -m uvicorn backend.main:app --reload
```

2. In another terminal, run endpoint checks for `/health`, `/classify`, and `/extract-text`:

```bash
python backend/scripts/health_check.py
```

Optional:

```bash
python backend/scripts/health_check.py --base-url http://127.0.0.1:8001 --sample-image data/samples/sample_image.png
```