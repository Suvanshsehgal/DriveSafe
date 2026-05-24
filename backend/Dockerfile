FROM pytorch/pytorch:2.5.1-cuda12.1-cudnn8-runtime

WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

COPY requirements-hf.txt requirements.txt
RUN pip install --no-cache-dir -r requirements-hf.txt

COPY . .

RUN mkdir -p weights app/weights && python download_weights.py

EXPOSE 7860

CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}
