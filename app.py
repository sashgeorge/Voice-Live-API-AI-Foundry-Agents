"""
Flask Web UI for Azure Voice Live API
Provides a web interface to start and stop voice conversations
"""
import os
import json
import threading
import logging
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from dotenv import load_dotenv
from voice_live_agents import (
    AzureVoiceLive,
    listen_and_send_audio,
    send_audio_chunk_to_azure,
    receive_audio_for_browser,
    stop_event,
    write_conversation_log,
    logfilename as voice_logfilename
)
import voice_live_agents
from azure.identity import DefaultAzureCredential
from datetime import datetime
import base64
import queue

# Load environment variables
load_dotenv("./.env", override=True)

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

greeting_message = "Hello. I am Wendy. Helpful Verizon assistant who can help with your Verizon home equipments."

# Global state management
conversation_state = {
    'active': False,
    'connection': None,
    'threads': [],
    'client': None
}

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s:%(name)s:%(levelname)s:%(message)s'
)
logger = logging.getLogger(__name__)


def receive_audio_and_playback_with_emit(connection) -> None:
    """Modified version of receive_audio_for_browser that emits audio and transcripts to frontend"""
    
    def audio_callback(audio_base64):
        """Send audio chunks to browser via WebSocket"""
        try:
            socketio.emit('audio_output', {'audio': audio_base64})
        except Exception as e:
            logger.error(f"Error emitting audio to browser: {e}")
    
    def transcript_callback(data):
        """Send transcripts to browser via WebSocket"""
        try:
            socketio.emit('transcript', {
                'type': data['type'],
                'text': data['text'],
                'timestamp': datetime.now().isoformat()
            })
        except Exception as e:
            logger.error(f"Error emitting transcript to browser: {e}")
    
    def speech_started_callback():
        """Notify browser that user started speaking (to interrupt audio playback)"""
        try:
            socketio.emit('speech_started', {})
            logger.info("Speech started - notifying browser to stop playback")
        except Exception as e:
            logger.error(f"Error emitting speech_started to browser: {e}")
    
    def response_started_callback():
        """Notify browser that assistant is generating a response"""
        try:
            socketio.emit('response_started', {})
            logger.info("Response generation started")
        except Exception as e:
            logger.error(f"Error emitting response_started to browser: {e}")
    
    def response_completed_callback():
        """Notify browser that assistant finished generating response"""
        try:
            socketio.emit('response_completed', {})
            logger.info("Response generation completed")
        except Exception as e:
            logger.error(f"Error emitting response_completed to browser: {e}")
    
    # Use the new browser-compatible receive function with enhanced callbacks
    from voice_live_agents import receive_audio_for_browser_enhanced
    receive_audio_for_browser_enhanced(
        connection, 
        audio_callback, 
        transcript_callback, 
        speech_started_callback,
        response_started_callback,
        response_completed_callback
    )



@app.route('/')
def index():
    """Render the main UI page"""
    # Get default model from environment
    default_model = os.environ.get("AZURE_VOICE_LIVE_MODEL", "gpt-realtime")
    return render_template('index.html', default_model=default_model)


@app.route('/api/start', methods=['POST'])
def start_conversation():
    """Start a new voice conversation"""
    global conversation_state
    
    if conversation_state['active']:
        return jsonify({'status': 'error', 'message': 'Conversation already active'}), 400
    
    try:
        # Clear stop event from previous sessions
        stop_event.clear()
        
        # Get model from request, fallback to environment variable
        data = request.get_json() or {}
        model_name = data.get('model') or os.environ.get("AZURE_VOICE_LIVE_MODEL", "gpt-realtime")
        
        logger.info(f"Starting conversation with model: {model_name}")
        
        # Get configuration from environment
        endpoint = os.environ.get("AZURE_VOICE_LIVE_ENDPOINT")
        agent_id = os.environ.get("AI_FOUNDRY_AGENT_ID")
        project_name = os.environ.get("AI_FOUNDRY_PROJECT_NAME")
        api_version = os.environ.get("AZURE_VOICE_LIVE_API_VERSION", "2025-10-01")
        
        if not all([endpoint, agent_id, project_name]):
            return jsonify({
                'status': 'error',
                'message': 'Missing required environment variables'
            }), 500
        
        # Get authentication token
        credential = DefaultAzureCredential()
        scopes = "https://ai.azure.com/.default"
        token = credential.get_token(scopes)
        # print("Token: " + token.token)
        
        # Create client and connection
        client = AzureVoiceLive(
            azure_endpoint=endpoint,
            api_version=api_version,
            token=token.token,
        )


        
        connection = client.connect(
            project_name=project_name,
            agent_id=agent_id,
            agent_access_token=token.token
        )
        
        # Configure session
        session_update = {
            "type": "session.update",
            "session": {
                "turn_detection": {
                    "type": "azure_semantic_vad",
                    "threshold": 0.3,
                    "prefix_padding_ms": 200,
                    "silence_duration_ms": 200,
                    "remove_filler_words": False,
                    "end_of_utterance_detection": {
                        "model": "semantic_detection_v1",
                        "threshold": 0.01,
                        "timeout": 2,
                    },
                },
                "input_audio_noise_reduction": {
                    "type": "azure_deep_noise_suppression"
                },
                "input_audio_echo_cancellation": {
                    "type": "server_echo_cancellation"
                },
                "voice": {
                    "name": "en-US-Ava:DragonHDLatestNeural",
                    "type": "azure-standard",
                    "temperature": 0.8,
                },
            },
            "event_id": ""
        }
        connection.send(json.dumps(session_update))
        
        # Create log directory if it doesn't exist
        if not os.path.exists('logs'):
            os.makedirs('logs')
        
        # Log session configuration
        timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        voice_live_agents.logfilename = f"{timestamp}_conversation.log"
        write_conversation_log(f'Model: {model_name}')
        write_conversation_log(f'Session Config: {json.dumps(session_update)}')
        
        # Start receive thread only (audio input comes from browser via WebSocket)
        # Note: We don't start listen_and_send_audio because audio comes from browser
        receive_thread = threading.Thread(target=receive_audio_and_playback_with_emit, args=(connection,))
        
        receive_thread.daemon = True
        receive_thread.start()
        
        # Update state
        conversation_state['active'] = True
        conversation_state['connection'] = connection
        conversation_state['threads'] = [receive_thread]  # Only receive thread
        conversation_state['client'] = client
        
        logger.info("Voice conversation started (browser-based audio)")
        
        # Send greeting message as soon as session is created
        greeting_param = {
            "type": "response.create",
            "response": {
                "modalities": ["text", "audio"],
                "instructions": f"Greet the user with this message: '{greeting_message}'",
            },
            "event_id": ""
        }
        connection.send(json.dumps(greeting_param))
        logger.info("Greeting message sent to Azure")
        
        return jsonify({'status': 'success', 'message': 'Conversation started'})
        
    except Exception as e:
        logger.error(f"Error starting conversation: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/stop', methods=['POST'])
def stop_conversation():
    """Stop the active voice conversation"""
    global conversation_state
    
    if not conversation_state['active']:
        return jsonify({'status': 'error', 'message': 'No active conversation'}), 400
    
    try:
        # Signal threads to stop
        stop_event.set()
        
        # Wait for threads to complete (with timeout)
        for thread in conversation_state['threads']:
            thread.join(timeout=2)
        
        # Close connection
        if conversation_state['connection']:
            conversation_state['connection'].close()
        
        # Reset state
        conversation_state['active'] = False
        conversation_state['connection'] = None
        conversation_state['threads'] = []
        conversation_state['client'] = None
        
        logger.info("Voice conversation stopped")
        return jsonify({'status': 'success', 'message': 'Conversation stopped'})
        
    except Exception as e:
        logger.error(f"Error stopping conversation: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


@app.route('/api/status', methods=['GET'])
def get_status():
    """Get current conversation status"""
    return jsonify({
        'active': conversation_state['active']
    })


# Socket.IO event handlers for audio streaming
@socketio.on('audio_input')
def handle_audio_input(data):
    """
    Receive audio from browser and forward to Azure Voice Live API
    Expected data format: {'audio': base64_encoded_pcm16_audio}
    """
    if not conversation_state['active']:
        logger.warning("Received audio input but no active conversation")
        return
    
    try:
        audio_base64 = data.get('audio')
        if not audio_base64:
            logger.error("No audio data in audio_input event")
            return
        
        connection = conversation_state['connection']
        if connection:
            send_audio_chunk_to_azure(connection, audio_base64)
        else:
            logger.error("No active connection to send audio")
    except Exception as e:
        logger.error(f"Error handling audio input: {e}")


@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info(f"Client connected: {request.sid}")


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f"Client disconnected: {request.sid}")


if __name__ == '__main__':
    # Ensure we're in the correct directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("Starting Flask server...")
    print("Open http://localhost:5000 in your browser")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
