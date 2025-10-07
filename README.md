# Azure Voice Live API with AI Foundry Agents# Azure Voice Live API with AI Foundry Agents# Azure Voice Live API with AI Foundry Agents



A production-ready, browser-based real-time voice conversation application using Azure Voice Live API and AI Foundry Agents.



[![GitHub](https://img.shields.io/badge/GitHub-sashgeorge%2FVoice--Live--API--AI--Foundry--Agents-blue)](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents)A production-ready, browser-based real-time voice conversation application using Azure Voice Live API and AI Foundry Agents.A production-ready, browser-based real-time voice conversation application using Azure Voice Live API and AI Foundry Agents. Features WebSocket-based audio streaming, speech interruption, and containerized deployment support.

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)



---

[![GitHub](https://img.shields.io/badge/GitHub-sashgeorge%2FVoice--Live--API--AI--Foundry--Agents-blue)](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents)[![GitHub](https://img.shields.io/badge/GitHub-sashgeorge%2FVoice--Live--API--AI--Foundry--Agents-blue)](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents)

## 🌟 Features

[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

- 🎤 Real-time voice conversations with AI agents

- 💬 Live chat transcription display

- 🛑 Smart speech interruption (AI stops when you speak)

- 🌐 Browser-based audio (Web Audio API)---## 📋 Table of Contents

- 🔐 Secure Azure authentication with managed identities

- 🐳 Docker and Azure Container Apps deployment ready- [Features](#-features)



---## 🌟 Features- [Architecture](#-architecture)



## 🚀 Quick Start- [Quick Start](#-quick-start)



### Prerequisites- 🎤 Real-time voice conversations with AI agents- [Environment Variables](#-environment-variables)



1. **Azure Resources**- 💬 Live chat transcription display- [Azure Roles & Permissions](#-azure-roles--permissions)

   - Azure AI Foundry project with an AI agent ([Create one](https://ai.azure.com))

   - Azure subscription with permissions- 🛑 Smart speech interruption (AI stops when you speak)- [Local Development](#-local-development)



2. **Local Development**- 🌐 Browser-based audio (Web Audio API)- [Docker Deployment](#-docker-deployment)

   - Python 3.8+

   - Azure CLI (`az login`)- 🔐 Secure Azure authentication with managed identities- [Azure Container Apps Deployment](#-azure-container-apps-deployment)



### Installation- 🐳 Docker and Azure Container Apps deployment ready- [Audio System](#-audio-system)



```bash- [Project Structure](#-project-structure)

# Clone repository

git clone https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents.git---- [Security Best Practices](#-security-best-practices)

cd Voice-Live-API-AI-Foundry-Agents

- [Troubleshooting](#-troubleshooting)

# Create virtual environment

python -m venv myenv## 🚀 Quick Start- [References](#-references)

myenv\Scripts\activate  # Windows

# source myenv/bin/activate  # Linux/Mac



# Install dependencies### Prerequisites---

pip install -r requirements.txt



# Configure environment

# Create .env file with your Azure credentials (see below)1. **Azure Resources**## 🌟 Features



# Login to Azure   - Azure AI Foundry project with an AI agent ([Create one](https://ai.azure.com))

az login

   - Azure subscription with permissions### Core Functionality

# Run application

python app.py- 🎤 **Real-time Voice Conversations**: Browser-based audio capture and playback

```

2. **Local Development**- 🤖 **AI Foundry Agent Integration**: Connect to AI agents with custom instructions

Open http://localhost:5000 in your browser.

   - Python 3.8+- 💬 **Live Chat Display**: Real-time transcription in chat interface

---

   - Azure CLI (`az login`)- 🛑 **Speech Interruption**: Stop AI response when user starts speaking

## ⚙️ Configuration

- 🔐 **Azure Authentication**: DefaultAzureCredential with managed identity support

Create a `.env` file:

### Installation- 📝 **Conversation Logging**: Automatic logging to `logs/` directory

```bash

# Required- 🎨 **Modern Responsive UI**: Works on desktop, tablet, and mobile

AZURE_VOICE_LIVE_ENDPOINT=https://your-foundry-project.azure.com

AZURE_VOICE_LIVE_API_VERSION=2025-10-01```bash

AI_FOUNDRY_PROJECT_NAME=your-project-name

AI_FOUNDRY_AGENT_ID=your-agent-id# Clone repository### Audio Features



# Optionalgit clone https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents.git- **Web Audio API**: Browser-based microphone capture (no server-side audio devices)

FLASK_ENV=production

LOG_LEVEL=INFOcd Voice-Live-API-AI-Foundry-Agents- **Sequential Playback**: Audio chunks play in order without overlap

```

- **Smart Interruption**: Active audio sources stop when user speaks

**Finding your values:**

- Go to [Azure AI Foundry Portal](https://ai.azure.com)# Create virtual environment- **VAD Integration**: Voice Activity Detection from Azure

- Select your project → Settings → Properties → Copy endpoint

- Navigate to Agents → Select your agent → Copy Agent IDpython -m venv myenv- **Auto-cleanup**: Proper resource management and memory cleanup



---myenv\Scripts\activate  # Windows



## 🔐 Azure Roles & Permissions# source myenv/bin/activate  # Linux/Mac### Deployment Options



Your identity (user or managed identity) needs these roles:- 🐳 **Docker**: Containerized with Docker Compose support



1. **Azure AI Developer** - On AI Foundry Project# Install dependencies- ☁️ **Azure Container Apps**: Production-ready cloud deployment

2. **Cognitive Services User** - On AI Services Account

pip install -r requirements.txt- 🔧 **Local Development**: Run with Python Flask for testing

**Quick setup:**

```bash

# Get your user ID

USER_ID=$(az ad signed-in-user show --query id -o tsv)# Configure environment---



# Assign roles (replace with your resource names)# Create .env file with your Azure credentials (see below)

az role assignment create \

  --role "Azure AI Developer" \## 🏗️ Architecture

  --assignee $USER_ID \

  --scope /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.MachineLearningServices/workspaces/{project}# Login to Azure



az role assignment create \az login### System Architecture

  --role "Cognitive Services User" \

  --assignee $USER_ID \

  --scope /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.CognitiveServices/accounts/{account}

```# Run application```



**⏳ Wait 5 minutes for role propagation before testing.**python app.py┌─────────────────────────────────────────────────────────────┐



📖 [Detailed Role Setup Guide →](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#azure-ai-developer)```│                      User Browser                           │



---│                                                             │



## 🐳 Docker DeploymentOpen http://localhost:5000 in your browser.│  ┌──────────────┐         ┌─────────────────┐             │



### Using Docker Compose│  │ Web Audio API │ ◄─────► │ Socket.IO Client │             │



```bash---│  │ (Microphone) │         │  (WebSocket)     │             │

docker-compose up -d

docker-compose logs -f  # View logs│  └──────────────┘         └─────────┬───────┘             │

```

## ⚙️ Configuration│                                      │                      │

### Using Docker CLI

└──────────────────────────────────────┼──────────────────────┘

```bash

docker build -t voicelive-api .Create a `.env` file:                                       │

docker run -d -p 5000:5000 --env-file .env voicelive-api

```                    audio_input, speech_started events



---```bash                                       │



## ☁️ Azure Container Apps Deployment# Required                                       ↓



```bashAZURE_VOICE_LIVE_ENDPOINT=https://your-foundry-project.azure.com┌──────────────────────────────────────────────────────────────┐

# Deploy to Azure

az containerapp up \AZURE_VOICE_LIVE_API_VERSION=2025-10-01│              Flask Server (Azure Container Apps)             │

  --name voicelive-app \

  --resource-group mygroup \AI_FOUNDRY_PROJECT_NAME=your-project-name│                                                              │

  --location eastus \

  --ingress external \AI_FOUNDRY_AGENT_ID=your-agent-id│  ┌────────────────────────────────────────────────────┐     │

  --target-port 5000 \

  --source .│  │  Socket.IO Event Handlers                          │     │



# Configure environment variables# Optional│  │  • audio_input  • start_conversation               │     │

az containerapp update \

  --name voicelive-app \FLASK_ENV=production│  │  • stop_conversation                               │     │

  --resource-group mygroup \

  --set-env-vars \LOG_LEVEL=INFO│  └────────────────┬───────────────────────────────────┘     │

    AZURE_VOICE_LIVE_ENDPOINT="https://..." \

    AI_FOUNDRY_PROJECT_NAME="..." \```│                   │                                          │

    AI_FOUNDRY_AGENT_ID="..."

```│                   ↓                                          │



**For production:** Use managed identity instead of API keys.**Finding your values:**│  ┌────────────────────────────────────────────────────┐     │



📖 [Complete Deployment Guide →](https://learn.microsoft.com/azure/container-apps/deploy-artifact)- Go to [Azure AI Foundry Portal](https://ai.azure.com)│  │  AzureVoiceLive Client                             │     │



---- Select your project → Settings → Properties → Copy endpoint│  │  • DefaultAzureCredential                          │     │



## 📂 Project Structure- Navigate to Agents → Select your agent → Copy Agent ID│  │  • Token scope: https://ai.azure.com/.default      │     │



```│  │  • WebSocket connection to Azure                   │     │

Voice-Live-API-AI-Foundry-Agents/

├── app.py                      # Flask server with Socket.IO---│  └────────────────┬───────────────────────────────────┘     │

├── voice_live_agents.py        # Azure Voice Live API client

├── requirements.txt            # Python dependencies└───────────────────┼──────────────────────────────────────────┘

├── Dockerfile                  # Container configuration

├── docker-compose.yml          # Docker Compose setup## 🔐 Azure Roles & Permissions                    │

├── .env                        # Environment variables (create this)

├── static/         Bearer token Authorization

│   ├── script.js               # Browser audio + WebSocket

│   └── styles.css              # UI stylesYour identity (user or managed identity) needs these roles:                    │

├── templates/

│   └── index.html              # Web interface                    ↓

└── logs/                       # Conversation logs (auto-created)

```1. **Azure AI Developer** - On AI Foundry Project┌──────────────────────────────────────────────────────────────┐



---2. **Cognitive Services User** - On AI Services Account│         Azure Voice Live API (AI Foundry)                    │



## 🏗️ Architecture Overview│                                                              │



```**Quick setup:**│  wss://{endpoint}/voice-live/realtime                        │

Browser (Web Audio API) ──WebSocket──> Flask Server ──WebSocket──> Azure Voice Live API

    ↓                                      ↓                              ↓```bash│    ?api-version=2025-10-01                                   │

Microphone Input                    Socket.IO Events              AI Foundry Agent

Audio Playback                      Audio Processing              Voice Synthesis# Get your user ID│    &agent-project-name={project}                             │

```

USER_ID=$(az ad signed-in-user show --query id -o tsv)│    &agent-id={agent}                                         │

**Key Technologies:**

- **Frontend**: Web Audio API, Socket.IO client, JavaScript│    &agent-access-token={token}                               │

- **Backend**: Flask, Flask-SocketIO, Azure SDK

- **Azure**: Voice Live API, AI Foundry Agents, DefaultAzureCredential# Assign roles (replace with your resource names)│                                                              │

- **Audio**: PCM 16-bit, 24kHz, Mono

az role assignment create \│  ┌────────────────────────────────────────────────────┐     │

📖 [Detailed Architecture Docs →](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-quickstart)

  --role "Azure AI Developer" \│  │  AI Foundry Agent                                  │     │

---

  --assignee $USER_ID \│  │  • Custom instructions & knowledge                 │     │

## 🔧 Troubleshooting

  --scope /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.MachineLearningServices/workspaces/{project}│  │  • Voice Activity Detection (VAD)                  │     │

### Common Issues

│  │  • Real-time audio synthesis                       │     │

| Issue | Solution |

|-------|----------|az role assignment create \│  │  • Conversational AI                               │     │

| **"Unauthorized" / 403** | Check role assignments, wait 5 min for propagation, run `az login` |

| **Audio not playing** | Check browser microphone permissions, open DevTools (F12) console |  --role "Cognitive Services User" \│  └────────────────────────────────────────────────────┘     │

| **WebSocket disconnects** | Check network, verify endpoint URL, check server logs |

| **Container fails to start** | Verify environment variables are set correctly |  --assignee $USER_ID \└──────────────────────────────────────────────────────────────┘



### Getting Help  --scope /subscriptions/{sub}/resourceGroups/{rg}/providers/Microsoft.CognitiveServices/accounts/{account}                    │



```bash```      audio_chunk, transcript, speech_started

# Check application logs

docker-compose logs -f                    │



# Azure Container Apps logs**⏳ Wait 5 minutes for role propagation before testing.**                    ↓

az containerapp logs show --name voicelive-app --resource-group mygroup --follow

             Browser plays audio

# Test authentication

python -c "from azure.identity import DefaultAzureCredential; \📖 [Detailed Role Setup Guide →](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#azure-ai-developer)```

  cred = DefaultAzureCredential(); \

  token = cred.get_token('https://ai.azure.com/.default'); \

  print('✅ Auth OK' if token else '❌ Failed')"

```---### Authentication Flow



---



## 📚 Documentation & Resources## 🐳 Docker Deployment```



### Official Microsoft DocsApplication Start

- [Azure AI Foundry](https://learn.microsoft.com/azure/ai-studio/what-is-ai-studio)

- [Voice Live API Quickstart](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-quickstart)### Using Docker Compose       ↓

- [Azure RBAC Roles](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles)

- [Container Apps Deployment](https://learn.microsoft.com/azure/container-apps/overview)DefaultAzureCredential()

- [Managed Identities](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview)

```bash  • Managed Identity (in Azure)

### Related Technologies

- [Flask Documentation](https://flask.palletsprojects.com/)docker-compose up -d  • Azure CLI (local dev)

- [Socket.IO Documentation](https://socket.io/docs/)

- [Web Audio API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)docker-compose logs -f  # View logs       ↓

- [Docker Documentation](https://docs.docker.com/)

```Get token for scope:

---

  "https://ai.azure.com/.default"

## 🔒 Security Best Practices

### Using Docker CLI       ↓

- ✅ Use managed identities in production (not API keys)

- ✅ Store secrets in Azure Key Vault or Container Apps secretsAzure AD validates:

- ✅ Enable HTTPS only (`--allow-insecure false`)

- ✅ Assign roles at the most specific scope```bash  • Role: Azure AI Developer

- ✅ Never commit `.env` files to Git

- ✅ Implement rate limiting for productiondocker build -t voicelive-api .  • Role: Cognitive Services User

- ✅ Regularly rotate credentials

docker run -d -p 5000:5000 --env-file .env voicelive-api       ↓

📖 [Azure Security Best Practices →](https://learn.microsoft.com/azure/security/fundamentals/best-practices-and-patterns)

```Returns access token

---

       ↓

## 🤝 Contributing

---Connect to Voice Live API

Contributions welcome! Please:

1. Fork the repository  Authorization: Bearer {token}

2. Create a feature branch (`git checkout -b feature/AmazingFeature`)

3. Commit changes (`git commit -m 'Add AmazingFeature'`)## ☁️ Azure Container Apps Deployment```

4. Push to branch (`git push origin feature/AmazingFeature`)

5. Open a Pull Request



---```bash### Audio Processing Flow



## 📄 License# Deploy to Azure



This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.az containerapp up \```



---  --name voicelive-app \User speaks



## 📧 Support  --resource-group mygroup \    ↓



- **Issues**: [GitHub Issues](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents/issues)  --location eastus \Browser: getUserMedia() captures microphone

- **Azure Support**: [Azure Portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)

  --ingress external \    ↓

---

  --target-port 5000 \AudioContext processes audio

**Version**: 2.0  

**Last Updated**: October 7, 2025    --source .    ↓

**Author**: Sash George  

**Repository**: [Voice-Live-API-AI-Foundry-Agents](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents)Convert to PCM 16-bit mono 24kHz


# Configure environment variables    ↓

az containerapp update \Socket.IO emit('audio_input', audioData)

  --name voicelive-app \    ↓

  --resource-group mygroup \Flask receives audio chunk

  --set-env-vars \    ↓

    AZURE_VOICE_LIVE_ENDPOINT="https://..." \Forward to Azure Voice Live API via WebSocket

    AI_FOUNDRY_PROJECT_NAME="..." \    ↓

    AI_FOUNDRY_AGENT_ID="..."Azure AI Agent processes

```    ↓

Azure sends back:

**For production:** Use managed identity instead of API keys.  • audio_chunk (PCM audio)

  • transcript (text)

📖 [Complete Deployment Guide →](https://learn.microsoft.com/azure/container-apps/deploy-artifact)  • speech_started (VAD event)

    ↓

---Flask emits to browser:

  • 'audio_chunk' → playAudioOutput()

## 📂 Project Structure  • 'transcript' → addMessage()

  • 'speech_started' → stopAudioPlayback()

```    ↓

Voice-Live-API-AI-Foundry-Agents/Browser: Sequential playback with interruption support

├── app.py                      # Flask server with Socket.IO```

├── voice_live_agents.py        # Azure Voice Live API client

├── requirements.txt            # Python dependencies### Speech Interruption System

├── Dockerfile                  # Container configuration

├── docker-compose.yml          # Docker Compose setupThe application uses a sophisticated multi-layer interruption system:

├── .env                        # Environment variables (create this)

├── static/```

│   ├── script.js               # Browser audio + WebSocketAI is speaking (audio scheduled in browser)

│   └── styles.css              # UI styles    ↓

├── templates/User starts speaking (detected by Azure VAD)

│   └── index.html              # Web interface    ↓

└── logs/                       # Conversation logs (auto-created)Azure sends 'speech_started' event to Flask

```    ↓

Flask: speech_started_callback() triggered

---    ↓

Flask emits Socket.IO event: 'speech_started'

## 🏗️ Architecture Overview    ↓

Browser receives 'speech_started'

```    ↓

Browser (Web Audio API) ──WebSocket──> Flask Server ──WebSocket──> Azure Voice Live APIJavaScript: stopAudioPlayback()

    ↓                                      ↓                              ↓    ↓

Microphone Input                    Socket.IO Events              AI Foundry AgentLoop through activeAudioSources[] array

Audio Playback                      Audio Processing              Voice Synthesis    ↓

```For each AudioBufferSourceNode:

  • Call source.stop() (cancel scheduled audio)

**Key Technologies:**  • Remove from activeAudioSources[]

- **Frontend**: Web Audio API, Socket.IO client, JavaScript    ↓

- **Backend**: Flask, Flask-SocketIO, Azure SDKReset nextPlayTime to current time

- **Azure**: Voice Live API, AI Foundry Agents, DefaultAzureCredential    ↓

- **Audio**: PCM 16-bit, 24kHz, MonoClear audio context

    ↓

📖 [Detailed Architecture Docs →](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-quickstart)AI stops speaking, ready for user input

```

---

**Key Implementation Details**:

## 🔧 Troubleshooting- **activeAudioSources[]**: Tracks all playing AudioBufferSourceNodes

- **nextPlayTime**: Schedules sequential audio without overlap

### Common Issues- **source.stop()**: Explicitly cancels scheduled audio (not just variables)

- **Auto-cleanup**: onended handler removes sources from array

| Issue | Solution |- **VAD Integration**: Azure detects speech, not client-side processing

|-------|----------|

| **"Unauthorized" / 403** | Check role assignments, wait 5 min for propagation, run `az login` |---

| **Audio not playing** | Check browser microphone permissions, open DevTools (F12) console |

| **WebSocket disconnects** | Check network, verify endpoint URL, check server logs |## 🚀 Quick Start

| **Container fails to start** | Verify environment variables are set correctly |

### Prerequisites

### Getting Help

1. **Azure Resources**:

```bash   - Azure AI Foundry project with an AI agent

# Check application logs   - Azure AI Services account

docker-compose logs -f   - Azure subscription with appropriate permissions



# Azure Container Apps logs2. **Local Development**:

az containerapp logs show --name voicelive-app --resource-group mygroup --follow   - Python 3.8+ installed

   - Azure CLI installed and logged in (`az login`)

# Test authentication   - Git (for cloning the repository)

python -c "from azure.identity import DefaultAzureCredential; \

  cred = DefaultAzureCredential(); \3. **For Docker Deployment**:

  token = cred.get_token('https://ai.azure.com/.default'); \   - Docker Desktop or Docker Engine

  print('✅ Auth OK' if token else '❌ Failed')"   - Docker Compose (optional)

```

### Installation

---

```bash

## 📚 Documentation & Resources# 1. Clone the repository

git clone https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents.git

### Official Microsoft Docscd Voice-Live-API-AI-Foundry-Agents

- [Azure AI Foundry](https://learn.microsoft.com/azure/ai-studio/what-is-ai-studio)

- [Voice Live API Quickstart](https://learn.microsoft.com/azure/ai-services/openai/realtime-audio-quickstart)# 2. Create virtual environment

- [Azure RBAC Roles](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles)python -m venv myenv

- [Container Apps Deployment](https://learn.microsoft.com/azure/container-apps/overview)

- [Managed Identities](https://learn.microsoft.com/entra/identity/managed-identities-azure-resources/overview)# Windows

myenv\Scripts\activate

### Related Technologies

- [Flask Documentation](https://flask.palletsprojects.com/)# Linux/Mac

- [Socket.IO Documentation](https://socket.io/docs/)# source myenv/bin/activate

- [Web Audio API (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

- [Docker Documentation](https://docs.docker.com/)# 3. Install dependencies

pip install -r requirements.txt

---

# 4. Create .env file

## 🔒 Security Best Practices# Create .env file with your Azure credentials (see Environment Variables section)



- ✅ Use managed identities in production (not API keys)# 5. Login to Azure CLI (for local development)

- ✅ Store secrets in Azure Key Vault or Container Apps secretsaz login

- ✅ Enable HTTPS only (`--allow-insecure false`)

- ✅ Assign roles at the most specific scope# 6. Run the application

- ✅ Never commit `.env` files to Gitpython app.py

- ✅ Implement rate limiting for production```

- ✅ Regularly rotate credentials

### Access the Application

📖 [Azure Security Best Practices →](https://learn.microsoft.com/azure/security/fundamentals/best-practices-and-patterns)

Open your browser and navigate to:

---```

http://localhost:5000

## 🤝 Contributing```



Contributions welcome! Please:### First Time Usage

1. Fork the repository

2. Create a feature branch (`git checkout -b feature/AmazingFeature`)1. Click **"Start Conversation"** button

3. Commit changes (`git commit -m 'Add AmazingFeature'`)2. Browser will prompt for microphone permission → **Allow**

4. Push to branch (`git push origin feature/AmazingFeature`)3. AI agent will greet you with a voice message

5. Open a Pull Request4. Start speaking naturally

5. See real-time transcription in chat

---6. AI interrupts automatically when you speak



## 📄 License---



This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.## ⚙️ Environment Variables



---Create a `.env` file in the root directory:



## 📧 Support### Required Variables



- **Issues**: [GitHub Issues](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents/issues)```bash

- **Azure Support**: [Azure Portal](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade)# Azure Voice Live API Configuration

AZURE_VOICE_LIVE_ENDPOINT=https://your-foundry-project.azure.com

---AZURE_VOICE_LIVE_API_VERSION=2025-10-01



**Version**: 2.0  # AI Foundry Agent Configuration

**Last Updated**: October 7, 2025  AI_FOUNDRY_PROJECT_NAME=your-project-name

**Author**: Sash George  AI_FOUNDRY_AGENT_ID=your-agent-id

**Repository**: [Voice-Live-API-AI-Foundry-Agents](https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents)```



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

**Permissions**:
- ✅ Read/write access to AI Foundry projects
- ✅ Access to AI agents and deployments
- ✅ Invoke AI services and realtime APIs
- ✅ Manage AI Foundry resources

**Scope**: Assign at **AI Foundry Project** level

**Documentation**: [Azure AI Developer Role](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#azure-ai-developer)

---

#### 2. Cognitive Services User

**Permissions**:
- ✅ Access to Cognitive Services endpoints
- ✅ Call Azure AI APIs
- ✅ Token-based authentication
- ✅ Read AI Services resources

**Scope**: Assign at **AI Services Account** level


**Documentation**: [Cognitive Services User Role](https://learn.microsoft.com/azure/role-based-access-control/built-in-roles#cognitive-services-user)

---

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
