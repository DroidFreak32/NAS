FROM python:3-slim

WORKDIR /app

# Copy the script
COPY main.py requirements.txt /app/

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Unbuffer python logs so they show up in docker logs immediately
ENV PYTHONUNBUFFERED=1

CMD ["python", "main.py"]
