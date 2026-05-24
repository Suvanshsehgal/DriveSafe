FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    wget \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-hf.txt .

RUN pip install --no-cache-dir --timeout 300 --retries 5 \
    fastapi uvicorn[standard] websockets python-multipart \
    opencv-python numpy pillow scipy imutils \
    mediapipe \
    pydantic python-dotenv \
    matplotlib pandas \
    aiofiles asyncio \
    requests

RUN pip install --no-cache-dir --timeout 600 --retries 5 ultralytics timm

COPY . .

RUN mkdir -p weights app/weights && python download_weights.py

EXPOSE 7860

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}
