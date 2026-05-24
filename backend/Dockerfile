FROM python:3.11-slim
RUN apt-get update && apt-get install -y --no-install-recommends libgl1 libglib2.0-0 libgomp1 wget ca-certificates && rm -rf /var/lib/apt/lists/*
CMD python -c "print('hello')"
