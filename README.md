# Azure Voice Live API - Mobile Friendly UI

A modern, real-time web interface for Azure Voice Live API with voice conversations and live chat display.

## 📋 Table of Contents
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Configuration](#️-configuration)
- [How to Use](#-how-to-use)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [Docker Deployment](#-docker-deployment)
- [Requirements](#️-requirements)
- [Troubleshooting](#-troubleshooting)
- [Customization](#-customization)
- [Security Best Practices](#-security-best-practices)
- [Technical Details](#-technical-details)

> 📘 **For detailed Docker instructions**, see [DOCKER_GUIDE.md](DOCKER_GUIDE.md)

---

## 🌟 Features

### Core Functionality
- 🎤 **Voice Conversations**: Start/stop voice interactions with AI agents
- 💬 **Real-time Chat Display**: See transcripts instantly in chat bubbles
- 🎨 **Modern UI**: Clean, responsive design for desktop and mobile
- 🔄 **Live Status**: Visual feedback showing conversation state
- ⚙️ **Model Selection**: Configure which AI model to use
- 🔄 **Loading Indicator**: Visual feedback when waiting for responses
- 📝 **Automatic Logging**: All conversations saved to `logs/` directory
- 🔐 **Secure Authentication**: Azure DefaultAzureCredential support

### Chat Interface
- **Real-time Updates**: Messages appear instantly using WebSocket
- **Chat Bubbles**: User messages (blue, right) and AI responses (white, left)
- **Timestamps**: Each message shows exact time
- **Auto-scroll**: Automatically shows latest messages
- **Clear Chat**: Button to clear conversation history

### Docker Support
- 🐳 **Containerized**: Docker and Docker Compose support
- ☁️ **Azure Ready**: Deploy to Azure Container Apps
- 📦 **Portable**: Runs anywhere Docker is available

---

## 🚀 Quick Start

### Option 1: Direct Python (Development)

```powershell
# Activate virtual environment
.\myenv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Configure .env file (see Configuration section)

# Start the server
python app.py
```

Open browser to: **http://localhost:5000**

### Option 2: Docker (Recommended)

```bash
# Using Docker Compose
docker-compose up -d

# Or using Docker directly
docker build -t voicelive-api .
docker run -p 5000:5000 --env-file .env voicelive-api
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Azure Voice Live API Configuration
AZURE_VOICE_LIVE_ENDPOINT=https://your-endpoint.azure.com/
AZURE_VOICE_LIVE_MODEL=gpt-realtime
AZURE_VOICE_LIVE_API_VERSION=2025-10-01
AZURE_VOICE_LIVE_API_KEY=your-api-key

# AI Foundry Configuration
AI_FOUNDRY_PROJECT_NAME=your-project-name
AI_FOUNDRY_AGENT_ID=your-agent-id
```

### Azure Authentication

The application supports multiple authentication methods:
1. **API Key** (recommended for Azure Container Apps) - Set `AZURE_VOICE_LIVE_API_KEY`
2. **Azure CLI** - Run `az login` before starting
3. **Managed Identity** - Automatically works when deployed to Azure
4. **Environment Variables** - For service principal authentication

---

## 📖 How to Use

### 1. Start Conversation
- Enter or confirm the model name (default: `gpt-realtime`)
- Click the green **"Start Conversation"** button
- Grant microphone permissions if prompted
- Status changes to "Conversation Active" (green dot)

### 2. Speak
- Talk into your microphone
- Your speech appears in **blue bubbles** on the right
- AI responses appear in **white bubbles** on the left
- Loading spinner shows when waiting for AI response

### 3. Monitor Chat
- Messages appear in real-time
- Timestamps show when each message was sent
- Chat auto-scrolls to latest message
- Click 🗑️ icon to clear chat display

### 4. Stop Conversation
- Click the red **"Stop Conversation"** button
- Connection closes gracefully
- Status returns to "Ready" (gray dot)

### 5. View Logs
- All conversations saved to `logs/` directory
- Files named: `YYYY-MM-DD_HH-MM-SS_conversation.log`
- Includes session details, model used, and full transcripts

---

## 📁 Project Structure

```
VoiceLiveAPI-UI/
├── app.py                      # Flask web server with Socket.IO
├── voice_live_agents.py        # Core Azure Voice Live API logic
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (not in repo)
├── Dockerfile                  # Docker container definition
├── docker-compose.yml          # Docker Compose configuration
├── .dockerignore              # Docker build exclusions
├── templates/
│   └── index.html             # Web UI template
├── static/
│   ├── style.css              # UI styling
│   └── script.js              # Client-side JavaScript + Socket.IO
├── logs/                       # Conversation logs (auto-created)
└── myenv/                      # Python virtual environment
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Main web UI page |
| `POST` | `/api/start` | Start voice conversation (accepts model parameter) |
| `POST` | `/api/stop` | Stop active conversation |
| `GET` | `/api/status` | Get conversation status |

### WebSocket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `transcript` | Server → Client | Sends user/agent transcripts in real-time |

---

## 🐳 Docker Deployment

### Local Docker

```bash
# Build image
docker build -t voicelive-api .

# Run with environment file
docker run -p 5000:5000 --env-file .env voicelive-api

# Or use Docker Compose
docker-compose up -d
docker-compose logs -f  # View logs
docker-compose down     # Stop
```

### Azure Container Apps

```bash
# Quick deploy
az containerapp up \
  --resource-group vz-tpd-voicelive-rg \
  --name vz-tpd-voicelive-aca \
  --ingress external \
  --target-port 5000 \
  --source .

# Set environment variables
az containerapp update \
  --name vz-tpd-voicelive-aca \
  --resource-group vz-tpd-voicelive-rg \
  --set-env-vars \
    AZURE_VOICE_LIVE_ENDPOINT="https://your-endpoint.azure.com/" \
    AZURE_VOICE_LIVE_API_KEY="your-api-key" \
    AZURE_VOICE_LIVE_MODEL="gpt-realtime" \
    AZURE_VOICE_LIVE_API_VERSION="2025-10-01" \
    AI_FOUNDRY_PROJECT_NAME="your-project-name" \
    AI_FOUNDRY_AGENT_ID="your-agent-id"
```

### Docker Image Management

```bash
# View images
docker images | grep voicelive-api

# Tag for registry
docker tag voicelive-api myregistry.azurecr.io/voicelive-api:latest

# Push to Azure Container Registry
az acr login --name <your-acr-name>
docker push <your-acr-name>.azurecr.io/voicelive-api:latest
```

---

## 🛠️ Requirements

### System Requirements
- **Python 3.8+** for local development
- **Docker 20.10+** for containerized deployment
- **Microphone** for voice input
- **Speakers/Headphones** for audio output
- **Modern Browser** with WebSocket support

### Python Dependencies
```
flask==3.1.0
flask-cors==5.0.0
flask-socketio==5.5.1
python-socketio==5.14.1
azure-identity==1.22.0
python-dotenv==1.1.0
sounddevice==0.5.1
numpy==2.2.5
websocket-client==1.8.0
```

Install all: `pip install -r requirements.txt`

---

## 🐛 Troubleshooting

## 🐛 Troubleshooting

### Microphone Not Working
- Check browser permissions for microphone access
- Ensure microphone is set as default recording device in Windows
- Test microphone in Windows Sound settings
- Grant microphone permissions when browser prompts

### Connection Errors
- Verify `.env` file has correct Azure endpoint and credentials
- Ensure authenticated with Azure: `az login`
- Check Azure Voice Live API endpoint is accessible
- Verify firewall/network allows WebSocket connections

### Audio Playback Issues
- Verify speakers/headphones connected and working
- Check Windows audio output device settings
- Ensure no other application has exclusive audio control
- Try adjusting volume in Windows and browser

### Chat Messages Not Appearing
- Check browser console for Socket.IO connection errors
- Verify Flask-SocketIO is installed: `pip show flask-socketio`
- Hard refresh browser (Ctrl+Shift+R)
- Ensure firewall allows WebSocket connections

### Port Already in Use
If port 5000 is busy, change it in `app.py`:
```python
socketio.run(app, debug=True, host='0.0.0.0', port=5001, use_reloader=False)
```

### Module Import Errors
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version: `python --version` (requires 3.8+)

### Docker Container Won't Start
```bash
# Check logs
docker logs voicelive-api

# Check if port is in use
netstat -ano | findstr :5000  # Windows

# Verify environment variables
docker inspect voicelive-api
```

### Azure Container Apps Authentication Error
If getting "DefaultAzureCredential failed" error:
- Set `AZURE_VOICE_LIVE_API_KEY` in environment variables
- Or enable managed identity on the Container App
- See deployment section for proper environment variable setup

---

## 🎨 Customization

### Change AI Voice Model

Edit `.env`:
```env
AZURE_VOICE_LIVE_MODEL=gpt-4o  # Or any supported model
```

Or change in UI before starting conversation.

### Modify Voice Settings

Edit `app.py` in the `start_conversation()` function:
```python
"voice": {
    "name": "en-US-Ava:DragonHDLatestNeural",  # Change voice
    "type": "azure-standard",
    "temperature": 0.8,  # Adjust creativity
}
```

### Adjust VAD (Voice Activity Detection)

In `app.py` session configuration:
```python
"turn_detection": {
    "threshold": 0.3,  # Sensitivity
    "silence_duration_ms": 200,  # Silence before stopping
    "prefix_padding_ms": 200,  # Pre-speech padding
}
```

### Change Chat Colors

Edit `static/style.css`:
```css
/* User message background */
.message-bubble.user {
    background: #0078d4;  /* Change to any color */
}

/* Agent message background */
.message-bubble.agent {
    background: #ffffff;
    border: 1px solid #e1e1e1;
}
```

### Modify Chat Height

```css
.chat-messages {
    max-height: 500px;  /* Adjust as needed */
}
```

### Change Loading Spinner

```css
.spinner {
    border-top-color: #0078d4;  /* Change color */
    animation: spin 0.8s linear infinite;  /* Adjust speed */
}
```

---

## 🔒 Security Best Practices

### For Development
- Never commit `.env` file to repository
- Use `.gitignore` to exclude sensitive files
- Keep Azure credentials secure

### For Production
- Use **Azure Key Vault** for secrets
- Enable **Managed Identity** for Container Apps
- Rotate API keys regularly
- Use HTTPS for all connections
- Set up proper CORS policies

### Docker Security
```bash
# Don't commit .env file
# Use secrets for sensitive data
docker run -d \
  --name voicelive-api \
  -e AZURE_VOICE_LIVE_API_KEY=$(cat secret.txt) \
  voicelive-api

# Scan image for vulnerabilities
docker scan voicelive-api
```

---

## 📊 What Gets Logged

Conversation logs in `logs/` directory contain:
```
Model: gpt-realtime
Session Config: {...voice settings...}
SessionID: sess_abc123xyz
User Input: Hello, how are you?
Agent Audio Response: I'm doing well, thank you!
Agent Audio Transcription: I'm doing well, thank you!
```

Log files are named: `YYYY-MM-DD_HH-MM-SS_conversation.log`

---

## 🔧 Development

### Running Tests
```powershell
# Activate environment
.\myenv\Scripts\Activate.ps1

# Run tests (if available)
python -m pytest
```

### Code Structure

**app.py** - Flask server with Socket.IO
- Routes for web UI and API endpoints
- WebSocket event handlers
- Conversation state management

**voice_live_agents.py** - Azure Voice Live integration
- Azure connection management
- Audio capture and playback
- WebSocket communication with Azure

**templates/index.html** - Frontend HTML
- UI structure and layout
- Socket.IO client initialization

**static/script.js** - Client logic
- Button event handlers
- Socket.IO message handling
- Chat display functions

**static/style.css** - Styling
- Responsive design
- Chat bubble styles
- Animations and transitions

---

## 📚 Technical Details

### WebSocket Events

**Client → Server:**
- `connect` - Initial connection
- User interactions via HTTP POST

**Server → Client:**
```javascript
{
  "type": "user" | "agent",
  "text": "Transcript text",
  "timestamp": "2025-10-03T10:30:15.123Z"
}
```

### Session Configuration

The application configures:
- **Voice Activity Detection (VAD)**: Azure Semantic VAD
- **Audio Format**: PCM 24kHz, 16-bit, mono
- **Turn Detection**: Semantic detection with configurable thresholds
- **Voice Model**: Configurable via UI or environment variable

### Audio Processing
- **Input**: Microphone via `sounddevice` library
- **Format**: Base64-encoded PCM audio
- **Output**: Asynchronous audio playback
- **Buffer**: Queue-based audio streaming

---

## 🌟 Features in Detail

### Real-time Chat Interface
- **WebSocket-based**: Instant message delivery
- **Chat Bubbles**: User (right, blue) vs Agent (left, white)
- **Timestamps**: Formatted as "HH:MM:SS AM/PM"
- **Auto-scroll**: Always shows latest message
- **Clear Function**: Reset chat display (logs preserved)

### Model Selection
- **Input Field**: Change model before starting conversation
- **Default Value**: From `AZURE_VOICE_LIVE_MODEL` env variable
- **Logged**: Model name saved to conversation log
- **Disabled**: During active conversation

### Loading Indicator
- **Shows**: When waiting for AI response
- **Hides**: When agent responds
- **Location**: In chat header area
- **Animation**: Spinning wheel with fade effect

### Status Indicator
- **Gray Dot**: Ready/Idle state
- **Green Dot**: Active conversation
- **Text**: "Ready" or "Conversation Active"
- **Updates**: Real-time via JavaScript

---

## 📦 Deployment Checklist

### Pre-deployment
- [ ] `.env` file configured with all required variables
- [ ] Azure credentials valid and tested
- [ ] Dependencies installed and tested locally
- [ ] Microphone and audio working

### Docker Deployment
- [ ] `Dockerfile` reviewed
- [ ] `.dockerignore` configured
- [ ] `docker-compose.yml` set up
- [ ] Environment variables in `.env` file
- [ ] Image built and tested locally

### Azure Container Apps
- [ ] Resource group created
- [ ] Environment variables set in Container App
- [ ] Ingress configured for external access
- [ ] Target port set to 5000
- [ ] Container App tested and accessible

### Production
- [ ] HTTPS enabled
- [ ] Secrets in Azure Key Vault
- [ ] Managed Identity configured
- [ ] Monitoring and logging enabled
- [ ] Resource limits set
- [ ] Backup strategy defined

---

## 🚦 Status

✅ **Fully Functional** - All features working
- Web UI with start/stop controls
- Real-time chat display with WebSocket
- Model selection and configuration
- Loading indicators and status updates
- Docker containerization
- Azure Container Apps deployment
- Comprehensive logging

---

## 🤝 Contributing

To modify or enhance the application:

1. Fork/clone the repository
2. Create virtual environment: `python -m venv myenv`
3. Install dependencies: `pip install -r requirements.txt`
4. Make your changes
5. Test locally: `python app.py`
6. Test with Docker: `docker-compose up`

---

## 📄 License

This project uses Azure Voice Live API. Please refer to Microsoft's licensing terms for Azure services.

---

## 🎉 Getting Started Summary

**Quickest way to run:**

```powershell
# 1. Configure .env file with your Azure credentials
# 2. Choose one:

# Option A: Python (Development)
.\myenv\Scripts\Activate.ps1
python app.py

# Option B: Docker (Production)
docker-compose up -d

# 3. Open browser to http://localhost:5000
# 4. Click "Start Conversation" and speak!
```

**Next steps:**
- Test microphone and audio
- Try different AI models
- Review conversation logs
- Deploy to Azure Container Apps

Enjoy your voice AI conversation interface! 🚀
