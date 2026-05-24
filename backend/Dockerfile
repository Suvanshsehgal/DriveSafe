FROM python:3.11-slim
RUN apt-get update && apt-get install -y libgl1-mesa-glx && rm -rf /var/lib/apt/lists/*
CMD python -c "print('hello')"
