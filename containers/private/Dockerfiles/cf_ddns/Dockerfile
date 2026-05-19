FROM python:3-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    iproute2 \
    curl \
    dnsutils \
    bash \
    bash-completion \
    && rm -rf /var/lib/apt/lists/*

# Copy the script
COPY main.py requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Unbuffer python logs so they show up in docker logs immediately
ENV PYTHONUNBUFFERED=1

CMD ["python", "main.py"]
