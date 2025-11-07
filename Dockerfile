# Use Python 3.12 slim image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Install system dependencies for audio
RUN apt-get update && apt-get install -y \
    portaudio19-dev \
    libsndfile1 \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application files
COPY app.py .
COPY voice_live_agents.py .
COPY templates/ templates/
COPY static/ static/
COPY .env .env

# Create logs directory
RUN mkdir -p logs

# Expose port 5000
EXPOSE 5000

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py

# Run the application
CMD ["python", "app.py"]
