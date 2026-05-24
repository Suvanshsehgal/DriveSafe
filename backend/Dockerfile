FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libgomp1 \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN pip install --no-cache-dir --timeout 900 requests

CMD python -c "print('apt and pip work')"
