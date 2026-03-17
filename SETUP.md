# AegisShield Model Setup

This guide explains how to set up and run the AI model pipeline end-to-end.

## 1. Prerequisites

- Python 3.10+
- pip
- Optional: virtual environment tool (`venv`)

## 2. Project Structure (AI-relevant)

- `data/datasets/`: raw dataset files
- `data/processed/`: generated processed files
- `backend/models/`: trained model artifacts (`.pkl`)
- `backend/scripts/`: preprocessing, training, and prediction scripts
- `backend/ocr/`: OCR module

## 3. Create and Activate Virtual Environment

From repository root:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

## 4. Install Dependencies

It is recommended to install all Python dependencies from the repository `requirements.txt` so the environment matches the project.

From repository root (inside the activated virtual environment):

```powershell
pip install -r requirements.txt
```

Notes:
- `requirements.txt` includes `torch` and `torchvision` which EasyOCR requires; if you need a specific CUDA build, install the matching `torch`/`torchvision` from the official PyTorch instructions before installing the rest of the requirements.
- On Windows you may need to run PowerShell as Administrator when installing some binary packages.

## 5. Download/Place Datasets

Put the following files into `data/datasets/`:

- `Fake.csv`
- `True.csv`
- `train.tsv`
- `valid.tsv`
- `test.tsv`

Sources and credits: see `data/README.md`.

## 6. Run Data Processing Pipeline

From repository root, run:

```powershell
python backend/scripts/process_news_dataset.py
python backend/scripts/process_liar_dataset.py
python backend/scripts/combine_datasets.py
```

This generates:

- `data/processed/news_processed.csv`
- `data/processed/liar_processed.csv`
- `data/processed/combined_dataset.csv`

## 7. Train the Model

```powershell
python backend/scripts/train_model.py
```

This generates model artifacts in `backend/models/`:

- `misinformation_model.pkl`
- `tfidf_vectorizer.pkl`

## 8. Run Prediction Test

```powershell
python backend/scripts/predict.py
```

## 9. OCR + Detection Test (Optional)

Use sample image in `data/samples/sample_image.png`:

```powershell
python backend/scripts/detect_from_image.py
```

## 10. Run Backend API (Optional)

Install API dependencies if needed:

```powershell
pip install fastapi uvicorn python-multipart
```

Start API:

```powershell
uvicorn backend.main:app --reload
```

Health check:

- `GET http://127.0.0.1:8001/health`
