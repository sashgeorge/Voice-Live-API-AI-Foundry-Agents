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
    """Modified version of receive_audio_and_playback that emits transcripts to frontend"""
    from voice_live_agents import AudioPlayerAsync
    
    last_audio_item_id = None
    audio_player = AudioPlayerAsync()

    logger.info("Starting audio playback with UI updates...")
    try:
        while not stop_event.is_set():
            raw_event = connection.recv()
            if raw_event is None:
                continue

            try:
                event = json.loads(raw_event)
                event_type = event.get("type")
                print(f"Received event:", {event_type})

                if event_type == "session.created":
                    session = event.get("session")
                    logger.info(f"Session created: {session.get('id')}")
                    write_conversation_log(f"SessionID: {session.get('id')}")

                elif event_type == "conversation.item.input_audio_transcription.completed":
                    user_transcript = event.get("transcript", "")
                    print(f'\n\tUser Input:\t{user_transcript}\n')
                    write_conversation_log(f'User Input:\t{user_transcript}')
                    
                    # Emit to frontend
                    socketio.emit('transcript', {
                        'type': 'user',
                        'text': user_transcript,
                        'timestamp': datetime.now().isoformat()
                    })

                elif event_type == "response.text.done":
                    agent_text = event.get("text", "")
                    print(f'\n\tAgent Text Response:\t{agent_text}\n')
                    write_conversation_log(f'Agent Text Response:\t{agent_text}')

                elif event_type == "response.audio_transcript.done":
                    agent_audio = event.get("transcript", "")
                    print(f'\n\tAgent Audio Response:\t{agent_audio}\n')
                    write_conversation_log(f'Agent Audio Response:\t{agent_audio}')
                    
                    # Emit to frontend
                    socketio.emit('transcript', {
                        'type': 'agent',
                        'text': agent_audio,
                        'timestamp': datetime.now().isoformat()
                    })

                elif event_type == "response.audio.delta":
                    if event.get("item_id") != last_audio_item_id:
                        last_audio_item_id = event.get("item_id")

                    bytes_data = base64.b64decode(event.get("delta", ""))
                    if bytes_data:
                        logger.debug(f"Received audio data of length: {len(bytes_data)}")   
                    audio_player.add_data(bytes_data)

                elif event.get("type") == "input_audio_buffer.speech_started":
                    print("Speech started")
                    audio_player.stop()

                elif event.get("type") == "error":
                    error_details = event.get("error", {})
                    error_type = error_details.get("type", "Unknown")
                    error_code = error_details.get("code", "Unknown")
                    error_message = error_details.get("message", "No message provided")
                    raise ValueError(f"Error received: Type={error_type}, Code={error_code}, Message={error_message}")
            except json.JSONDecodeError as e:
                logger.error(f"Failed to parse JSON event: {e}")
                continue

    except Exception as e:
        logger.error(f"Error in audio playback: {e}")
    finally:
        audio_player.terminate()
        logger.info("Playback done.")


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
        
        # Start audio threads
        send_thread = threading.Thread(target=listen_and_send_audio, args=(connection,))
        receive_thread = threading.Thread(target=receive_audio_and_playback_with_emit, args=(connection,))
        
        send_thread.daemon = True
        receive_thread.daemon = True
        
        send_thread.start()
        receive_thread.start()
        
        # Update state
        conversation_state['active'] = True
        conversation_state['connection'] = connection
        conversation_state['threads'] = [send_thread, receive_thread]
        conversation_state['client'] = client
        
        logger.info("Voice conversation started")
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


if __name__ == '__main__':
    # Ensure we're in the correct directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    print("Starting Flask server...")
    print("Open http://localhost:5000 in your browser")
    socketio.run(app, debug=True, host='0.0.0.0', port=5000, allow_unsafe_werkzeug=True)
