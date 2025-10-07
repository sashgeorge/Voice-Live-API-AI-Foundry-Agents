# Azure Voice Live API with AI Foundry Agents

A production-ready, browser-based real-time voice conversation application using Azure Voice Live API and AI Foundry Agents. Features WebSocket-based audio streaming, speech interruption, and containerized deployment support.

[![GitHub](https://img.shields.io/badge/GitHub-sashgeorge%2FVoice--Live--API--AI--Foundry--Agents-blue)](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📋 Table of Contents
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Environment Variables](#-environment-variables)
- [Azure Roles & Permissions](#-azure-roles--permissions)
- [Local Development](#-local-development)
- [Docker Deployment](#-docker-deployment)
- [Azure Container Apps Deployment](#-azure-container-apps-deployment)
- [Audio System](#-audio-system)
- [Project Structure](#-project-structure)
- [Security Best Practices](#-security-best-practices)
- [Troubleshooting](#-troubleshooting)
- [References](#-references)

---

## 🌟 Features

### Core Functionality
- 🎤 **Real-time Voice Conversations**: Browser-based audio capture and playback
- 🤖 **AI Foundry Agent Integration**: Connect to AI agents with custom instructions
- 💬 **Live Chat Display**: Real-time transcription in chat interface
- 🛑 **Speech Interruption**: Stop AI response when user starts speaking
- 🔐 **Azure Authentication**: DefaultAzureCredential with managed identity support
- 📝 **Conversation Logging**: Automatic logging to `logs/` directory
- 🎨 **Modern Responsive UI**: Works on desktop, tablet, and mobile

### Audio Features
- **Web Audio API**: Browser-based microphone capture (no server-side audio devices)
- **Sequential Playback**: Audio chunks play in order without overlap
- **Smart Interruption**: Active audio sources stop when user speaks
- **VAD Integration**: Voice Activity Detection from Azure
- **Auto-cleanup**: Proper resource management and memory cleanup

### Deployment Options
- 🐳 **Docker**: Containerized with Docker Compose support
- ☁️ **Azure Container Apps**: Production-ready cloud deployment
- 🔧 **Local Development**: Run with Python Flask for testing

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      User Browser                           │
│                                                             │
│  ┌──────────────┐         ┌─────────────────┐             │
│  │ Web Audio API │ ◄─────► │ Socket.IO Client │             │
│  │ (Microphone) │         │  (WebSocket)     │             │
│  └──────────────┘         └─────────┬───────┘             │
│                                      │                      │
└──────────────────────────────────────┼──────────────────────┘
                                       │
                    audio_input, speech_started events
                                       │
                                       ↓
┌──────────────────────────────────────────────────────────────┐
│              Flask Server (Azure Container Apps)             │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  Socket.IO Event Handlers                          │     │
│  │  • audio_input  • start_conversation               │     │
│  │  • stop_conversation                               │     │
│  └────────────────┬───────────────────────────────────┘     │
│                   │                                          │
│                   ↓                                          │
│  ┌────────────────────────────────────────────────────┐     │
│  │  AzureVoiceLive Client                             │     │
│  │  • DefaultAzureCredential                          │     │
│  │  • Token scope: https://ai.azure.com/.default      │     │
│  │  • WebSocket connection to Azure                   │     │
│  └────────────────┬───────────────────────────────────┘     │
└───────────────────┼──────────────────────────────────────────┘
                    │
         Bearer token Authorization
                    │
                    ↓
┌──────────────────────────────────────────────────────────────┐
│         Azure Voice Live API (AI Foundry)                    │
│                                                              │
│  wss://{endpoint}/voice-live/realtime                        │
│    ?api-version=2025-10-01                                   │
│    &agent-project-name={project}                             │
│    &agent-id={agent}                                         │
│    &agent-access-token={token}                               │
│                                                              │
│  ┌────────────────────────────────────────────────────┐     │
│  │  AI Foundry Agent                                  │     │
│  │  • Custom instructions & knowledge                 │     │
│  │  • Voice Activity Detection (VAD)                  │     │
│  │  • Real-time audio synthesis                       │     │
│  │  • Conversational AI                               │     │
│  └────────────────────────────────────────────────────┘     │
└──────────────────────────────────────────────────────────────┘
                    │
      audio_chunk, transcript, speech_started
                    │
                    ↓
             Browser plays audio
```

### Authentication Flow

```
Application Start
       ↓
DefaultAzureCredential()
  • Managed Identity (in Azure)
  • Azure CLI (local dev)
       ↓
Get token for scope:
  "https://ai.azure.com/.default"
       ↓
Azure AD validates:
  • Role: Azure AI Developer
  • Role: Cognitive Services User
       ↓
Returns access token
       ↓
Connect to Voice Live API
  Authorization: Bearer {token}
```

### Audio Processing Flow

```
User speaks
    ↓
Browser: getUserMedia() captures microphone
    ↓
AudioContext processes audio
    ↓
Convert to PCM 16-bit mono 24kHz
    ↓
Socket.IO emit('audio_input', audioData)
    ↓
Flask receives audio chunk
    ↓
Forward to Azure Voice Live API via WebSocket
    ↓
Azure AI Agent processes
    ↓
Azure sends back:
  • audio_chunk (PCM audio)
  • transcript (text)
  • speech_started (VAD event)
    ↓
Flask emits to browser:
  • 'audio_chunk' → playAudioOutput()
  • 'transcript' → addMessage()
  • 'speech_started' → stopAudioPlayback()
    ↓
Browser: Sequential playback with interruption support
```

### Speech Interruption System

The application uses a sophisticated multi-layer interruption system:

```
AI is speaking (audio scheduled in browser)
    ↓
User starts speaking (detected by Azure VAD)
    ↓
Azure sends 'speech_started' event to Flask
    ↓
Flask: speech_started_callback() triggered
    ↓
Flask emits Socket.IO event: 'speech_started'
    ↓
Browser receives 'speech_started'
    ↓
JavaScript: stopAudioPlayback()
    ↓
Loop through activeAudioSources[] array
    ↓
For each AudioBufferSourceNode:
  • Call source.stop() (cancel scheduled audio)
  • Remove from activeAudioSources[]
    ↓
Reset nextPlayTime to current time
    ↓
Clear audio context
    ↓
AI stops speaking, ready for user input
```

**Key Implementation Details**:
- **activeAudioSources[]**: Tracks all playing AudioBufferSourceNodes
- **nextPlayTime**: Schedules sequential audio without overlap
- **source.stop()**: Explicitly cancels scheduled audio (not just variables)
- **Auto-cleanup**: onended handler removes sources from array
- **VAD Integration**: Azure detects speech, not client-side processing

---

## 🚀 Quick Start

### Prerequisites

1. **Azure Resources**:
   - Azure AI Foundry project with an AI agent
   - Azure AI Services account
   - Azure subscription with appropriate permissions

2. **Local Development**:
   - Python 3.8+ installed
   - Azure CLI installed and logged in (`az login`)
   - Git (for cloning the repository)

3. **For Docker Deployment**:
   - Docker Desktop or Docker Engine
   - Docker Compose (optional)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents.git
cd Voice-Live-API-AI-Foundry-Agents

# 2. Create virtual environment
python -m venv myenv

# Windows
myenv\Scripts\activate

# Linux/Mac
# source myenv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
# Create .env file with your Azure credentials (see Environment Variables section)

# 5. Login to Azure CLI (for local development)
az login

# 6. Run the application
python app.py
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

### First Time Usage

1. Click **"Start Conversation"** button
2. Browser will prompt for microphone permission → **Allow**
3. AI agent will greet you with a voice message
4. Start speaking naturally
5. See real-time transcription in chat
6. AI interrupts automatically when you speak

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

### Required Variables

```bash
# Azure Voice Live API Configuration
AZURE_VOICE_LIVE_ENDPOINT=https://your-foundry-project.azure.com
AZURE_VOICE_LIVE_API_VERSION=2025-10-01

# AI Foundry Agent Configuration
AI_FOUNDRY_PROJECT_NAME=your-project-name
AI_FOUNDRY_AGENT_ID=your-agent-id
```

### Optional Variables

```bash
# Flask Configuration
FLASK_SECRET_KEY=your-secret-key-here
FLASK_ENV=production  # or 'development'

# Logging
LOG_LEVEL=INFO  # DEBUG, INFO, WARNING, ERROR, CRITICAL
LOG_DIR=./logs

# Azure Authentication (if not using DefaultAzureCredential)
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret

# Alternative: API Key Authentication
AZURE_VOICE_LIVE_API_KEY=your-api-key
```

### Environment Variable Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `AZURE_VOICE_LIVE_ENDPOINT` | AI Foundry endpoint URL | ✅ Yes | None |
| `AZURE_VOICE_LIVE_API_VERSION` | API version | ✅ Yes | `2025-10-01` |
| `AI_FOUNDRY_PROJECT_NAME` | AI Foundry project name | ✅ Yes | None |
| `AI_FOUNDRY_AGENT_ID` | AI agent identifier | ✅ Yes | None |
| `FLASK_SECRET_KEY` | Session encryption key | ⚠️ Recommended | Random |
| `FLASK_ENV` | Environment mode | ❌ No | `production` |
| `LOG_LEVEL` | Logging verbosity | ❌ No | `INFO` |
| `AZURE_TENANT_ID` | Azure AD tenant (optional) | ❌ No | Auto-detected |
| `AZURE_CLIENT_ID` | Service principal ID | ❌ No | Auto-detected |
| `AZURE_CLIENT_SECRET` | Service principal secret | ❌ No | Auto-detected |
| `AZURE_VOICE_LIVE_API_KEY` | API key (alternative auth) | ❌ No | None |

### Finding Your Azure Values

#### 1. AI Foundry Endpoint

**Option A: Azure Portal**
- Go to [Azure AI Foundry Portal](https://ai.azure.com)
- Select your project
- Go to **Settings** → **Properties**
- Copy the **Endpoint URL**

**Option B: Azure CLI**
```bash
az ml workspace show \
  --name <project-name> \
  --resource-group <resource-group> \
  --query discoveryUrl -o tsv
```

#### 2. Project Name and Agent ID

- Go to [Azure AI Foundry Portal](https://ai.azure.com)
- Navigate to your project
- Select **"Agents"** from the left menu
- Find your agent
- Copy the **Project Name** (top of page)
- Copy the **Agent ID** (in agent details)

#### 3. API Version

Use `2025-10-01` (current stable version)

Check [Azure Voice Live API documentation](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-quickstart) for latest versions.

---

## 🔐 Azure Roles & Permissions

### Authentication Method

This application uses **DefaultAzureCredential** which tries these authentication methods in order:

1. **Managed Identity** (when running in Azure)
2. **Azure CLI** (for local development after `az login`)
3. **Environment Variables** (AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET)
4. **Visual Studio** / **Visual Studio Code** credentials

### Required Azure RBAC Roles

Your identity (user account or managed identity) needs these roles:

#### 1. Azure AI Developer

**Role ID**: `64702f94-c441-49e6-a78b-ef80e0188fee`

**Permissions**:
- ✅ Read/write access to AI Foundry projects
- ✅ Access to AI agents and deployments
- ✅ Invoke AI services and realtime APIs
- ✅ Manage AI Foundry resources

**Scope**: Assign at **AI Foundry Project** level

**How to assign**:
```bash
# Get your user ID
USER_ID=$(az ad signed-in-user show --query id -o tsv)

# Get AI Foundry project resource ID
PROJECT_ID=$(az ml workspace show \
  --name <project-name> \
  --resource-group <resource-group> \
  --query id -o tsv)

# Assign role
az role assignment create \
  --role "Azure AI Developer" \
  --assignee $USER_ID \
  --scope $PROJECT_ID
```

**Documentation**: [Azure AI Developer Role](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#azure-ai-developer)

---

#### 2. Cognitive Services User

**Role ID**: `a97b65f3-24c7-4388-baec-2e87135dc908`

**Permissions**:
- ✅ Access to Cognitive Services endpoints
- ✅ Call Azure AI APIs
- ✅ Token-based authentication
- ✅ Read AI Services resources

**Scope**: Assign at **AI Services Account** level

**How to assign**:
```bash
# Get AI Services account resource ID
AI_SERVICES_ID=$(az cognitiveservices account show \
  --name <ai-services-account-name> \
  --resource-group <resource-group> \
  --query id -o tsv)

# Assign role
az role assignment create \
  --role "Cognitive Services User" \
  --assignee $USER_ID \
  --scope $AI_SERVICES_ID
```

**Documentation**: [Cognitive Services User Role](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#cognitive-services-user)

---

### Quick Setup Script (Local Development)

```bash
#!/bin/bash

# Configuration
SUBSCRIPTION_ID="<your-subscription-id>"
RESOURCE_GROUP="<your-resource-group>"
AI_FOUNDRY_PROJECT="<your-ai-foundry-project>"
AI_SERVICES_ACCOUNT="<your-ai-services-account>"

# Get your user ID
USER_ID=$(az ad signed-in-user show --query id -o tsv)
echo "User ID: $USER_ID"

# Get resource IDs
PROJECT_ID=$(az ml workspace show \
  --name $AI_FOUNDRY_PROJECT \
  --resource-group $RESOURCE_GROUP \
  --query id -o tsv)
echo "Project ID: $PROJECT_ID"

AI_SERVICES_ID=$(az cognitiveservices account show \
  --name $AI_SERVICES_ACCOUNT \
  --resource-group $RESOURCE_GROUP \
  --query id -o tsv)
echo "AI Services ID: $AI_SERVICES_ID"

# Assign Azure AI Developer role
echo "Assigning Azure AI Developer role..."
az role assignment create \
  --role "Azure AI Developer" \
  --assignee $USER_ID \
  --scope $PROJECT_ID

# Assign Cognitive Services User role
echo "Assigning Cognitive Services User role..."
az role assignment create \
  --role "Cognitive Services User" \
  --assignee $USER_ID \
  --scope $AI_SERVICES_ID

echo "✅ Role assignments complete!"
echo "⏳ Wait 5 minutes for role propagation..."
```

### Verify Role Assignments

```bash
# Check your assigned roles
az role assignment list \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --all \
  --output table
```

### For Production (Managed Identity)

When deploying to Azure Container Apps, use a **managed identity**:

```bash
# 1. Create user-assigned managed identity
az identity create \
  --name voicelive-app-identity \
  --resource-group <resource-group>

# 2. Get managed identity principal ID
IDENTITY_ID=$(az identity show \
  --name voicelive-app-identity \
  --resource-group <resource-group> \
  --query principalId -o tsv)

echo "Managed Identity ID: $IDENTITY_ID"

# 3. Assign Azure AI Developer role to managed identity
az role assignment create \
  --role "Azure AI Developer" \
  --assignee $IDENTITY_ID \
  --scope $PROJECT_ID

# 4. Assign Cognitive Services User role to managed identity
az role assignment create \
  --role "Cognitive Services User" \
  --assignee $IDENTITY_ID \
  --scope $AI_SERVICES_ID

# 5. Wait for role propagation (5 minutes)
echo "⏳ Waiting for role propagation..."
sleep 300

echo "✅ Managed identity roles assigned!"
```

### Role Propagation

**Important**: Role assignments can take **up to 5 minutes** to propagate. If you get authentication errors immediately after assigning roles, wait a few minutes and try again.

```bash
# Clear Azure token cache
az account clear

# Re-login
az login

# Test authentication
python -c "from azure.identity import DefaultAzureCredential; \
  cred = DefaultAzureCredential(); \
  token = cred.get_token('https://ai.azure.com/.default'); \
  print('✅ Authentication successful!')"
```

---

## 💻 Local Development

### Step 1: Setup Python Environment

```bash
# Create virtual environment
python -m venv myenv

# Activate environment
# Windows PowerShell:
.\myenv\Scripts\Activate.ps1

# Windows CMD:
myenv\Scripts\activate.bat

# Linux/Mac:
source myenv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
# Create .env file
# Copy from template and fill in your values
```

Example `.env`:
```bash
AZURE_VOICE_LIVE_ENDPOINT=https://myproject-eastus.azure.com
AZURE_VOICE_LIVE_API_VERSION=2025-10-01
AI_FOUNDRY_PROJECT_NAME=my-voice-project
AI_FOUNDRY_AGENT_ID=agent-12345
FLASK_ENV=development
LOG_LEVEL=DEBUG
```

### Step 3: Authenticate with Azure

```bash
# Login to Azure CLI
az login

# Verify login
az account show

# Check your role assignments
az role assignment list \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --output table
```

### Step 4: Run the Application

```bash
# Start Flask server
python app.py
```

You should see:
```
 * Serving Flask app 'app'
 * Debug mode: on
WARNING: This is a development server.
 * Running on http://127.0.0.1:5000
```

### Step 5: Test in Browser

1. Open http://localhost:5000
2. Click **"Start Conversation"**
3. Allow microphone access
4. Speak and verify:
   - ✅ Transcription appears in chat
   - ✅ AI voice response plays
   - ✅ Interruption works (AI stops when you speak)

### Development Tips

**Enable Debug Logging**:
```bash
# In .env
LOG_LEVEL=DEBUG
FLASK_ENV=development
```

**View Conversation Logs**:
```bash
# Logs are saved to logs/ directory
ls logs/
cat logs/conversation_*.log
```

**Check for Errors**:
```bash
# View Flask console output for errors
# Check browser console (F12) for JavaScript errors
```

---

## 🐳 Docker Deployment

### Method 1: Docker Compose (Recommended)

**docker-compose.yml** (included in repository):

```yaml
version: '3.8'

services:
  voicelive-app:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env
    restart: unless-stopped
    volumes:
      - ./logs:/app/logs
    environment:
      - FLASK_ENV=production
```

**Commands**:

```bash
# Start application
docker-compose up -d

# View logs
docker-compose logs -f

# Stop application
docker-compose down

# Rebuild and restart
docker-compose up -d --build
```

### Method 2: Docker CLI

```bash
# Build image
docker build -t voicelive-api:latest .

# Run container
docker run -d \
  --name voicelive-app \
  -p 5000:5000 \
  --env-file .env \
  -v $(pwd)/logs:/app/logs \
  voicelive-api:latest

# View logs
docker logs -f voicelive-app

# Stop container
docker stop voicelive-app
docker rm voicelive-app
```

### Dockerfile Overview

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 5000

# Run application
CMD ["python", "app.py"]
```

### Docker Best Practices

1. **Use .dockerignore**:
```
myenv/
__pycache__/
*.pyc
.env
logs/
.git/
*.md
```

2. **Multi-stage builds** (for smaller images):
```dockerfile
FROM python:3.11-slim as builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

FROM python:3.11-slim
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY . .
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "app.py"]
```

3. **Health checks**:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1
```

---

## ☁️ Azure Container Apps Deployment

### Prerequisites

1. Azure CLI installed and logged in
2. Azure Container Apps extension:
   ```bash
   az extension add --name containerapp --upgrade
   ```
3. Resource group created
4. Managed identity configured with roles (see [Azure Roles section](#-azure-roles--permissions))

### Method 1: Azure CLI (Quickstart)

```bash
# Set variables
RESOURCE_GROUP="vz-tpd-voicelive-rg1"
CONTAINER_APP_NAME="vz-tpd-voicelive-aca1"
LOCATION="eastus"

# Deploy application
az containerapp up \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION \
  --environment voicelive-env \
  --ingress external \
  --target-port 5000 \
  --source .
```

### Method 2: Step-by-Step Deployment

#### Step 1: Create Container Apps Environment

```bash
az containerapp env create \
  --name voicelive-env \
  --resource-group $RESOURCE_GROUP \
  --location $LOCATION
```

#### Step 2: Create Managed Identity (if not exists)

```bash
# Create user-assigned managed identity
az identity create \
  --name voicelive-app-identity \
  --resource-group $RESOURCE_GROUP

# Get identity resource ID
IDENTITY_RESOURCE_ID=$(az identity show \
  --name voicelive-app-identity \
  --resource-group $RESOURCE_GROUP \
  --query id -o tsv)

# Get identity principal ID (for role assignments)
IDENTITY_PRINCIPAL_ID=$(az identity show \
  --name voicelive-app-identity \
  --resource-group $RESOURCE_GROUP \
  --query principalId -o tsv)

echo "Identity Resource ID: $IDENTITY_RESOURCE_ID"
echo "Identity Principal ID: $IDENTITY_PRINCIPAL_ID"
```

#### Step 3: Assign Roles to Managed Identity

```bash
# Get AI Foundry project ID
PROJECT_ID=$(az ml workspace show \
  --name <your-project-name> \
  --resource-group <project-resource-group> \
  --query id -o tsv)

# Get AI Services account ID
AI_SERVICES_ID=$(az cognitiveservices account show \
  --name <your-ai-services-account> \
  --resource-group <project-resource-group> \
  --query id -o tsv)

# Assign Azure AI Developer role
az role assignment create \
  --role "Azure AI Developer" \
  --assignee $IDENTITY_PRINCIPAL_ID \
  --scope $PROJECT_ID

# Assign Cognitive Services User role
az role assignment create \
  --role "Cognitive Services User" \
  --assignee $IDENTITY_PRINCIPAL_ID \
  --scope $AI_SERVICES_ID

echo "⏳ Waiting 5 minutes for role propagation..."
sleep 300
echo "✅ Role assignments complete!"
```

#### Step 4: Build and Push Docker Image

**Option A: Build locally and push to ACR**

```bash
# Create Azure Container Registry
ACR_NAME="voiceliveacr"
az acr create \
  --resource-group $RESOURCE_GROUP \
  --name $ACR_NAME \
  --sku Basic

# Login to ACR
az acr login --name $ACR_NAME

# Build and push image
docker build -t $ACR_NAME.azurecr.io/voicelive-api:latest .
docker push $ACR_NAME.azurecr.io/voicelive-api:latest
```

**Option B: Use Azure Container Apps build**

Container Apps can build from source (used in `az containerapp up` command above).

#### Step 5: Create Container App with Managed Identity

```bash
az containerapp create \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --environment voicelive-env \
  --image $ACR_NAME.azurecr.io/voicelive-api:latest \
  --target-port 5000 \
  --ingress external \
  --registry-server $ACR_NAME.azurecr.io \
  --user-assigned $IDENTITY_RESOURCE_ID \
  --env-vars \
    AZURE_VOICE_LIVE_ENDPOINT="https://your-foundry.azure.com" \
    AZURE_VOICE_LIVE_API_VERSION="2025-10-01" \
    AI_FOUNDRY_PROJECT_NAME="your-project-name" \
    AI_FOUNDRY_AGENT_ID="your-agent-id" \
    FLASK_ENV="production" \
    LOG_LEVEL="INFO"
```

#### Step 6: Configure Additional Settings

**Set CPU and Memory**:
```bash
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --cpu 0.5 \
  --memory 1.0Gi
```

**Set Min/Max Replicas**:
```bash
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --min-replicas 1 \
  --max-replicas 3
```

**Enable HTTP/2 and WebSocket**:
```bash
az containerapp ingress update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --transport http2 \
  --allow-insecure false
```

#### Step 7: Get Application URL

```bash
# Get fully qualified domain name (FQDN)
APP_URL=$(az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.configuration.ingress.fqdn -o tsv)

echo "Application URL: https://$APP_URL"
```

### Verify Deployment

```bash
# Check application status
az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.runningStatus -o tsv

# View logs
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow

# View recent logs
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --tail 50
```

### Update Deployed Application

```bash
# Update environment variables
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars \
    AI_FOUNDRY_AGENT_ID="new-agent-id"

# Update image
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --image $ACR_NAME.azurecr.io/voicelive-api:v2

# Restart app (no downtime)
az containerapp revision restart \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP
```

### Deployment Checklist

- [ ] Resource group created
- [ ] Container Apps environment created
- [ ] Managed identity created
- [ ] **Azure AI Developer** role assigned to managed identity
- [ ] **Cognitive Services User** role assigned to managed identity
- [ ] Wait 5 minutes for role propagation
- [ ] Docker image built and pushed to ACR (if using ACR)
- [ ] Container App created with managed identity
- [ ] Environment variables configured
- [ ] Ingress configured (external, port 5000)
- [ ] Application logs checked for errors
- [ ] Application URL tested in browser
- [ ] Microphone permission granted in browser
- [ ] Voice conversation tested end-to-end

---

## 🎤 Audio System

### Browser-Based Architecture

The application uses **browser-based audio** instead of server-side audio devices. This is critical for containerized deployments (Azure Container Apps) where audio hardware is not available.

```
┌──────────────────────────────────────────────┐
│  Browser (User's Device)                     │
│                                              │
│  ┌────────────────────────────────────┐     │
│  │  Web Audio API                     │     │
│  │                                    │     │
│  │  navigator.mediaDevices            │     │
│  │    .getUserMedia()                 │     │
│  │      ↓                             │     │
│  │  MediaStream → AudioContext        │     │
│  │      ↓                             │     │
│  │  ScriptProcessorNode               │     │
│  │      ↓                             │     │
│  │  PCM 16-bit mono 24kHz             │     │
│  └────────────────────────────────────┘     │
│                  ↓                           │
│  Socket.IO emit('audio_input', data)        │
└──────────────────┼───────────────────────────┘
                   │
                   ↓ WebSocket
┌──────────────────┼───────────────────────────┐
│  Flask Server    ↓                           │
│  Forward to Azure Voice Live API             │
└──────────────────────────────────────────────┘
```

### Audio Capture (JavaScript)

**File**: `static/script.js`

```javascript
async function startAudioCapture() {
    // Request microphone access
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
            channelCount: 1,
            sampleRate: 24000,
            echoCancellation: true,
            noiseSuppression: true
        }
    });
    
    // Create audio context
    audioContext = new (window.AudioContext || window.webkitAudioContext)({
        sampleRate: 24000
    });
    
    // Create media stream source
    const source = audioContext.createMediaStreamSource(stream);
    
    // Create script processor for audio chunks
    audioProcessor = audioContext.createScriptProcessor(4096, 1, 1);
    
    audioProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        
        // Convert Float32 to Int16 PCM
        const pcmData = new Int16Array(inputData.length);
        for (let i = 0; i < inputData.length; i++) {
            pcmData[i] = Math.max(-32768, Math.min(32767, inputData[i] * 32768));
        }
        
        // Send to server via WebSocket
        socket.emit('audio_input', pcmData.buffer);
    };
    
    source.connect(audioProcessor);
    audioProcessor.connect(audioContext.destination);
}
```

### Audio Playback (JavaScript)

**Sequential Playback System**:

```javascript
let activeAudioSources = [];  // Track all playing sources
let nextPlayTime = 0;         // Schedule sequential playback

async function playAudioOutput(audioData) {
    // Decode PCM audio
    const audioBuffer = await audioContext.decodeAudioData(audioData);
    
    // Create audio source
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    
    // Track active source
    activeAudioSources.push(source);
    
    // Schedule sequential playback
    const currentTime = audioContext.currentTime;
    const startTime = Math.max(currentTime, nextPlayTime);
    
    source.start(startTime);
    
    // Update next play time
    nextPlayTime = startTime + audioBuffer.duration;
    
    // Auto-cleanup when finished
    source.onended = () => {
        const index = activeAudioSources.indexOf(source);
        if (index > -1) {
            activeAudioSources.splice(index, 1);
        }
    };
}
```

### Speech Interruption (JavaScript)

**Stop all active audio when user speaks**:

```javascript
function stopAudioPlayback() {
    // Stop all active audio sources
    activeAudioSources.forEach(source => {
        try {
            source.stop();  // Cancel scheduled audio
        } catch (e) {
            // Source already stopped
        }
    });
    
    // Clear array
    activeAudioSources = [];
    
    // Reset play time to current time
    if (audioContext) {
        nextPlayTime = audioContext.currentTime;
    }
}

// Listen for speech_started event from server
socket.on('speech_started', () => {
    console.log('User started speaking - stopping AI audio');
    stopAudioPlayback();
});
```

### Server-Side Audio Handling (Python)

**File**: `app.py`

```python
@socketio.on('audio_input')
def handle_audio_input(audio_data):
    """Receive audio from browser and forward to Azure"""
    if audio_connection:
        # Send audio to Azure Voice Live API
        audio_connection.send_audio_chunk_to_azure(audio_data)

def audio_output_callback(audio_chunk):
    """Receive audio from Azure and send to browser"""
    socketio.emit('audio_chunk', audio_chunk)

def transcript_callback(text, is_final):
    """Receive transcript from Azure"""
    socketio.emit('transcript', {
        'text': text,
        'is_final': is_final
    })

def speech_started_callback():
    """Receive VAD event from Azure (user started speaking)"""
    socketio.emit('speech_started')  # Trigger browser interruption
```

### Audio Specifications

| Parameter | Value | Notes |
|-----------|-------|-------|
| **Format** | PCM | Raw audio data |
| **Sample Rate** | 24,000 Hz | Azure Voice Live API requirement |
| **Bit Depth** | 16-bit | Int16 PCM |
| **Channels** | Mono (1) | Single channel |
| **Byte Order** | Little-endian | Standard for PCM |
| **Chunk Size** | 4096 samples | ~170ms at 24kHz |
| **Latency** | ~200-300ms | End-to-end |

### Why Browser-Based Audio?

**Advantages**:
- ✅ Works in containerized environments (no audio hardware needed)
- ✅ Direct access to user's microphone and speakers
- ✅ Lower latency (no server audio processing)
- ✅ Better for web applications
- ✅ Cross-platform compatibility

**Previous Approach (Server-Side)**:
- ❌ Required `sounddevice` library
- ❌ Needed server audio devices (not available in containers)
- ❌ PortAudioError in Azure Container Apps
- ❌ Can't access user's physical microphone from server

---

## 📂 Project Structure

```
Voice-Live-API-AI-Foundry-Agents/
│
├── app.py                          # Flask server with Socket.IO
├── voice_live_agents.py            # Azure Voice Live API client
├── requirements.txt                # Python dependencies
├── Dockerfile                      # Docker container configuration
├── docker-compose.yml              # Docker Compose configuration
├── .env                            # Environment variables (not in repo)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── README.md                       # This file
│
├── static/                         # Static web assets
│   ├── script.js                   # Browser audio + WebSocket client
│   └── styles.css                  # UI styles
│
├── templates/                      # HTML templates
│   └── index.html                  # Main web interface
│
├── logs/                           # Conversation logs (auto-created)
│   └── conversation_*.log
│
└── myenv/                          # Python virtual environment (not in repo)
```

### Key Files

#### `app.py`
Flask application with Socket.IO WebSocket server.

**Key Functions**:
- `start_conversation()`: Initialize Voice Live API connection
- `handle_audio_input()`: Receive audio from browser
- `receive_audio_and_playback_with_emit()`: Process Azure audio/events
- `audio_output_callback()`: Send audio to browser
- `speech_started_callback()`: Trigger interruption

#### `voice_live_agents.py`
Azure Voice Live API client library.

**Key Classes/Functions**:
- `AzureVoiceLive`: Main client class
- `connect()`: Establish WebSocket connection to Azure
- `send_audio_chunk_to_azure()`: Send audio to Azure
- `receive_audio_for_browser()`: Receive audio/events with callbacks

#### `static/script.js`
Browser-side audio capture and playback.

**Key Functions**:
- `startAudioCapture()`: Capture microphone with Web Audio API
- `stopAudioCapture()`: Clean up audio resources
- `playAudioOutput()`: Play audio with sequential scheduling
- `stopAudioPlayback()`: Interrupt active audio sources
- `addMessage()`: Display chat messages

#### `templates/index.html`
Main web interface with:
- Chat display area
- Start/Stop conversation buttons
- Real-time status indicator
- Responsive mobile-friendly layout

---

## 🔒 Security Best Practices

### 1. Use Managed Identities in Production

**✅ Recommended (Production)**:
```python
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
token = credential.get_token("https://ai.azure.com/.default")
```

**❌ Not Recommended**:
```python
# Hardcoded API keys in code
api_key = "abc123..."  # Never do this!

# Credentials in source control
# Don't commit .env files to Git
```

### 2. Secure Environment Variables

**In Azure Container Apps**:
- Use **Container Apps secrets** for sensitive values
- Reference secrets in environment variables
- Never expose secrets in logs

```bash
# Create secret
az containerapp secret set \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --secrets azure-api-key="your-secret-key"

# Reference secret in env var
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars AZURE_VOICE_LIVE_API_KEY=secretref:azure-api-key
```

### 3. Principle of Least Privilege

**Assign roles at the most specific scope**:
- ✅ AI Foundry Project level (best)
- ⚠️ Resource Group level (ok for multiple projects)
- ❌ Subscription level (too broad)

### 4. Enable HTTPS Only

```bash
# Disable insecure HTTP in Container Apps
az containerapp ingress update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --allow-insecure false
```

### 5. Implement Rate Limiting

Consider adding rate limiting middleware to prevent abuse:

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["100 per hour"]
)

@app.route('/start')
@limiter.limit("10 per minute")
def start_conversation():
    # ...
```

### 6. Validate Input

```python
# Validate environment variables on startup
required_vars = [
    'AZURE_VOICE_LIVE_ENDPOINT',
    'AI_FOUNDRY_PROJECT_NAME',
    'AI_FOUNDRY_AGENT_ID'
]

for var in required_vars:
    if not os.getenv(var):
        raise ValueError(f"Missing required environment variable: {var}")
```

### 7. Sanitize Logs

```python
# Don't log sensitive data
# ❌ Bad:
logger.info(f"Token: {token}")

# ✅ Good:
logger.info("Token acquired successfully")
```

### 8. Use Content Security Policy

Add CSP headers in Flask:

```python
@app.after_request
def set_security_headers(response):
    response.headers['Content-Security-Policy'] = "default-src 'self'"
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    return response
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. "PortAudioError: Error querying device"

**Cause**: Trying to use server-side audio (sounddevice) in a containerized environment.

**Solution**: This is already fixed in the current version. The application uses browser-based audio (Web Audio API). If you see this error, make sure you're using the latest code and `sounddevice` is commented out in `requirements.txt`.

---

#### 2. "Unauthorized" or "403 Forbidden" from Azure

**Cause**: Missing role assignments or authentication issues.

**Solutions**:

**Check role assignments**:
```bash
az role assignment list \
  --assignee $(az ad signed-in-user show --query id -o tsv) \
  --output table
```

**Verify you have both roles**:
- Azure AI Developer (on AI Foundry Project)
- Cognitive Services User (on AI Services Account)

**Wait for role propagation**:
```bash
# Roles can take up to 5 minutes to propagate
# Clear cache and re-login
az account clear
az login
```

**Test authentication**:
```bash
python -c "from azure.identity import DefaultAzureCredential; \
  cred = DefaultAzureCredential(); \
  token = cred.get_token('https://ai.azure.com/.default'); \
  print('✅ Authentication successful!' if token else '❌ Failed')"
```

---

#### 3. "DefaultAzureCredential failed to retrieve a token"

**Cause**: No valid authentication method available.

**Solutions**:

**Local Development**:
```bash
# Login to Azure CLI
az login

# Verify account
az account show
```

**Azure Container Apps**:
- Ensure managed identity is assigned to the container app
- Verify managed identity has required roles
- Check identity configuration:
```bash
az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query identity
```

**Alternative**: Use environment variables:
```bash
export AZURE_TENANT_ID="your-tenant-id"
export AZURE_CLIENT_ID="your-client-id"
export AZURE_CLIENT_SECRET="your-client-secret"
```

---

#### 4. Audio Not Playing in Browser

**Cause**: Multiple possible causes.

**Solutions**:

**Check microphone permission**:
- Browser should prompt for microphone access
- Check browser settings → Privacy → Microphone
- Ensure site has permission

**Check browser console**:
- Open DevTools (F12)
- Look for JavaScript errors
- Check Network tab for WebSocket connection

**Check audio context state**:
```javascript
// In browser console
console.log('Audio Context State:', audioContext.state);
// Should be 'running'

// If 'suspended', resume it:
audioContext.resume();
```

**Check WebSocket connection**:
```javascript
// In browser console
console.log('Socket connected:', socket.connected);
// Should be true
```

---

#### 5. Audio Continues Playing When User Speaks

**Cause**: Speech interruption not working properly.

**Solution**: This is already fixed in the current version. The application uses:
- `activeAudioSources[]` array to track sources
- `source.stop()` to cancel scheduled audio
- `speech_started` event from Azure VAD

**Verify fix**:
```javascript
// In browser console, check:
console.log('Active sources:', activeAudioSources.length);
// Should be 0 when not playing

// After AI speaks:
console.log('Active sources:', activeAudioSources.length);
// Should show number of playing chunks

// After you speak:
console.log('Active sources:', activeAudioSources.length);
// Should immediately go to 0
```

---

#### 6. Multiple Overlapping Audio Tracks

**Cause**: Audio chunks playing simultaneously instead of sequentially.

**Solution**: This is already fixed with `nextPlayTime` scheduling.

**Verify fix**:
```javascript
// In browser console:
console.log('Next play time:', nextPlayTime);
console.log('Current time:', audioContext.currentTime);
// nextPlayTime should be >= currentTime
```

---

#### 7. Container App Fails to Start

**Cause**: Environment variables missing or incorrect.

**Solutions**:

**Check container app logs**:
```bash
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --tail 100
```

**Verify environment variables**:
```bash
az containerapp show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query properties.template.containers[0].env
```

**Update environment variables**:
```bash
az containerapp update \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --set-env-vars \
    AZURE_VOICE_LIVE_ENDPOINT="https://your-endpoint.azure.com" \
    AI_FOUNDRY_PROJECT_NAME="your-project" \
    AI_FOUNDRY_AGENT_ID="your-agent-id"
```

---

#### 8. WebSocket Connection Drops

**Cause**: Network issues or server timeout.

**Solutions**:

**Check Flask server logs**:
```bash
# Local:
# Check console output

# Azure Container Apps:
az containerapp logs show \
  --name $CONTAINER_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --follow
```

**Implement reconnection logic** (already in `script.js`):
```javascript
socket.on('disconnect', () => {
    console.log('WebSocket disconnected');
    // Auto-reconnect handled by Socket.IO
});

socket.on('connect', () => {
    console.log('WebSocket connected');
});
```

---

#### 9. High Latency in Audio Responses

**Causes**:
- Network latency to Azure
- Audio chunk size too large
- Server processing time

**Solutions**:

**Use Azure region closest to users**:
```bash
# Check available regions
az account list-locations --output table

# Deploy to closest region
LOCATION="eastus"  # Change to your region
```

**Optimize audio chunk size**:
```javascript
// In script.js, adjust buffer size
audioProcessor = audioContext.createScriptProcessor(
    2048,  // Smaller = lower latency, more CPU
    1, 1
);
```

**Monitor latency**:
```javascript
// Add timing to script.js
const startTime = Date.now();
socket.emit('audio_input', pcmData.buffer);

socket.on('audio_chunk', (data) => {
    const latency = Date.now() - startTime;
    console.log(`Audio latency: ${latency}ms`);
});
```

---

### Debugging Tips

**Enable verbose logging**:
```bash
# In .env
LOG_LEVEL=DEBUG
FLASK_ENV=development
```

**Check Flask logs**:
```bash
# Local:
python app.py
# Watch console output

# Docker:
docker-compose logs -f

# Azure:
az containerapp logs show --follow
```

**Check browser console**:
- Open DevTools (F12)
- Console tab: JavaScript errors
- Network tab: WebSocket connection
- Application tab: Cookies, storage

**Test Azure connection directly**:
```python
from azure.identity import DefaultAzureCredential

# Test authentication
credential = DefaultAzureCredential()
token = credential.get_token("https://ai.azure.com/.default")

if token:
    print(f"✅ Token acquired")
    print(f"Expires: {token.expires_on}")
else:
    print("❌ Failed to acquire token")
```

---

## 📚 References

### Official Documentation

1. **Azure AI Foundry**
   - [What is Azure AI Foundry?](https://learn.microsoft.com/azure/ai-studio/what-is-ai-studio)
   - [AI Foundry Portal](https://ai.azure.com)

2. **Azure Voice Live API**
   - [Realtime Audio Quickstart](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-quickstart)
   - [API Reference](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-reference)

3. **Authentication**
   - [DefaultAzureCredential](https://learn.microsoft.com/python/api/azure-identity/azure.identity.defaultazurecredential)
   - [Managed Identities](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview)

4. **Azure RBAC**
   - [Azure AI Developer Role](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#azure-ai-developer)
   - [Cognitive Services User Role](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#cognitive-services-user)
   - [RBAC in AI Foundry](https://learn.microsoft.com/azure/ai-studio/concepts/rbac-ai-studio)
   - [RBAC Best Practices](https://learn.microsoft.com/azure/role-based-access-control/best-practices)

5. **Azure Container Apps**
   - [Container Apps Overview](https://learn.microsoft.com/azure/container-apps/overview)
   - [Managed Identities in Container Apps](https://learn.microsoft.com/azure/container-apps/managed-identity)
   - [Container Apps Deployment](https://learn.microsoft.com/azure/container-apps/deploy-artifact)

6. **Web Audio API**
   - [MDN Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
   - [getUserMedia()](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
   - [AudioContext](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext)

### Related Technologies

- **Flask**: [https://flask.palletsprojects.com/](https://flask.palletsprojects.com/)
- **Flask-SocketIO**: [https://flask-socketio.readthedocs.io/](https://flask-socketio.readthedocs.io/)
- **Socket.IO**: [https://socket.io/docs/](https://socket.io/docs/)
- **Docker**: [https://docs.docker.com/](https://docs.docker.com/)
- **Azure CLI**: [https://learn.microsoft.com/cli/azure/](https://learn.microsoft.com/cli/azure/)

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📧 Support

For issues and questions:
- **GitHub Issues**: [Create an issue](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents/issues)
- **Azure Support**: [Azure Support Portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)

---

## 🎯 Quick Reference Card

### Local Development
```bash
python -m venv myenv
myenv\Scripts\activate
pip install -r requirements.txt
# Configure .env
python app.py
# Open http://localhost:5000
```

### Docker
```bash
docker-compose up -d
docker-compose logs -f
```

### Azure Deployment
```bash
az containerapp up \
  --name voicelive-app \
  --resource-group mygroup \
  --location eastus \
  --ingress external \
  --target-port 5000 \
  --source .
```

### Required Environment Variables
```
AZURE_VOICE_LIVE_ENDPOINT=https://...
AI_FOUNDRY_PROJECT_NAME=...
AI_FOUNDRY_AGENT_ID=...
```

### Required Azure Roles
- Azure AI Developer
- Cognitive Services User

---

**Last Updated**: October 7, 2025  
**Version**: 2.0  
**Author**: Sash George  
**Repository**: [Voice-Live-API-AI-Foundry-Agents](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents)
