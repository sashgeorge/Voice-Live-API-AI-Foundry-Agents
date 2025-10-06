# 🐳 Docker Deployment Guide

## Quick Start

### Build and Run with Docker

```bash
# Build the Docker image
docker build -t voicelive-api .

# Run the container
docker run -p 5000:5000 --env-file .env voicelive-api
```

### Or use Docker Compose

```bash
# Start the application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

## 📋 Prerequisites

- Docker installed (version 20.10+)
- Docker Compose (optional, version 1.29+)
- `.env` file configured with your Azure credentials

## 🏗️ Build Options

### Standard Build
```bash
docker build -t voicelive-api:latest .
```

### Build with specific tag
```bash
docker build -t voicelive-api:v1.0 .
```

### Build without cache
```bash
docker build --no-cache -t voicelive-api .
```

## 🚀 Running the Container

### Basic Run
```bash
docker run -d \
  --name voicelive-api \
  -p 5000:5000 \
  --env-file .env \
  voicelive-api
```

### Run with volume for logs
```bash
docker run -d \
  --name voicelive-api \
  -p 5000:5000 \
  -v $(pwd)/logs:/app/logs \
  --env-file .env \
  voicelive-api
```

### Run with custom port
```bash
docker run -d \
  --name voicelive-api \
  -p 8080:5000 \
  --env-file .env \
  voicelive-api
```

## 🔧 Environment Variables

The application requires these environment variables (set in `.env`):

```env
AZURE_VOICE_LIVE_ENDPOINT=https://your-endpoint.azure.com/
AZURE_VOICE_LIVE_MODEL=gpt-realtime
AZURE_VOICE_LIVE_API_VERSION=2025-10-01
AZURE_VOICE_LIVE_API_KEY=your-api-key
AI_FOUNDRY_PROJECT_NAME=your-project-name
AI_FOUNDRY_AGENT_ID=your-agent-id
```

## 📊 Container Management

### View logs
```bash
docker logs voicelive-api
docker logs -f voicelive-api  # Follow logs
```

### Stop container
```bash
docker stop voicelive-api
```

### Start container
```bash
docker start voicelive-api
```

### Restart container
```bash
docker restart voicelive-api
```

### Remove container
```bash
docker rm voicelive-api
docker rm -f voicelive-api  # Force remove
```

### Execute commands in container
```bash
docker exec -it voicelive-api bash
docker exec -it voicelive-api python --version
```

## 🌐 Accessing the Application

Once running, access the application at:
- Local: http://localhost:5000
- Container IP: Check with `docker inspect voicelive-api`

## 🏢 Azure Container Apps Deployment

### Prerequisites
- Azure CLI installed
- Logged in: `az login`
- Resource group created

### Deploy to Azure Container Apps

```bash
# Build and push to Azure Container Registry (ACR)
az acr build --registry <your-acr-name> --image voicelive-api:latest .

# Create Container App
az containerapp create \
  --name vz-tpd-voicelive-aca \
  --resource-group vz-tpd-voicelive-rg \
  --image <your-acr-name>.azurecr.io/voicelive-api:latest \
  --target-port 5000 \
  --ingress external \
  --environment-variables \
    AZURE_VOICE_LIVE_ENDPOINT=<endpoint> \
    AZURE_VOICE_LIVE_MODEL=gpt-realtime \
    AZURE_VOICE_LIVE_API_VERSION=2025-10-01 \
    AZURE_VOICE_LIVE_API_KEY=<key> \
    AI_FOUNDRY_PROJECT_NAME=<project> \
    AI_FOUNDRY_AGENT_ID=<agent-id>
```

### Or use the simple command (from your terminal history)
```bash
az containerapp up \
  --resource-group vz-tpd-voicelive-rg \
  --name vz-tpd-voicelive-aca \
  --ingress external \
  --target-port 5000 \
  --source .
```

### Update existing Container App
```bash
az containerapp update \
  --name vz-tpd-voicelive-aca \
  --resource-group vz-tpd-voicelive-rg \
  --image <your-acr-name>.azurecr.io/voicelive-api:latest
```

## 🔍 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs voicelive-api

# Check if port is already in use
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac
```

### Audio issues in container
The container includes portaudio19-dev for audio support. If issues occur:
```bash
# Check installed packages
docker exec -it voicelive-api dpkg -l | grep portaudio
```

### Permission issues with logs
```bash
# Fix permissions for log directory
docker exec -it voicelive-api chmod -R 777 /app/logs
```

### Check container health
```bash
# Get container details
docker inspect voicelive-api

# Check if application is responding
curl http://localhost:5000
```

## 📦 Image Management

### View images
```bash
docker images | grep voicelive-api
```

### Remove image
```bash
docker rmi voicelive-api
docker rmi voicelive-api:v1.0
```

### Tag image
```bash
docker tag voicelive-api voicelive-api:v1.0
docker tag voicelive-api myregistry.azurecr.io/voicelive-api:latest
```

### Push to registry
```bash
# Azure Container Registry
az acr login --name <your-acr-name>
docker push <your-acr-name>.azurecr.io/voicelive-api:latest

# Docker Hub
docker login
docker push username/voicelive-api:latest
```

## 🔐 Security Best Practices

1. **Don't commit .env file**
   - Already in `.gitignore`
   - Use secrets management in production

2. **Use secrets for sensitive data**
   ```bash
   docker run -d \
     --name voicelive-api \
     -e AZURE_VOICE_LIVE_API_KEY=$(cat secret.txt) \
     voicelive-api
   ```

3. **Run as non-root user** (add to Dockerfile)
   ```dockerfile
   RUN useradd -m appuser
   USER appuser
   ```

4. **Scan image for vulnerabilities**
   ```bash
   docker scan voicelive-api
   ```

## 📈 Performance Optimization

### Multi-stage build (optional)
For smaller image size, modify Dockerfile:
```dockerfile
FROM python:3.12-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM python:3.12-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
```

### Resource limits
```bash
docker run -d \
  --name voicelive-api \
  --memory="512m" \
  --cpus="1.0" \
  -p 5000:5000 \
  --env-file .env \
  voicelive-api
```

## 📝 Docker Compose Details

### Start in foreground
```bash
docker-compose up
```

### View service status
```bash
docker-compose ps
```

### Rebuild after code changes
```bash
docker-compose up --build
```

### Scale services
```bash
docker-compose up -d --scale voicelive-api=3
```

## 🎯 Production Checklist

- ✅ Dockerfile created
- ✅ .dockerignore configured
- ✅ docker-compose.yml for local testing
- ✅ Environment variables secured
- ✅ Logs directory configured
- ✅ Health checks implemented
- ✅ Resource limits set (in production)
- ✅ Image scanned for vulnerabilities
- ✅ Deployed to Azure Container Apps

## 🌟 Next Steps

1. **Local Testing**: `docker-compose up`
2. **Build Image**: `docker build -t voicelive-api .`
3. **Test Container**: `docker run -p 5000:5000 --env-file .env voicelive-api`
4. **Push to Registry**: `docker push <registry>/voicelive-api`
5. **Deploy to Azure**: `az containerapp up ...`

Your application is now containerized and ready for deployment! 🚀
