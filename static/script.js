// DOM Elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const messageBox = document.getElementById('messageBox');
const messageText = document.getElementById('messageText');
const chatMessages = document.getElementById('chatMessages');
const clearChatBtn = document.getElementById('clearChatBtn');
const modelInput = document.getElementById('modelInput');
const loadingSpinner = document.getElementById('loadingSpinner');

// State
let isConversationActive = false;
let statusCheckInterval = null;
let socket = null;
let waitingForResponse = false;

// Audio state
let audioContext = null;
let mediaStream = null;
let audioWorkletNode = null;
let scriptProcessor = null;
let isRecording = false;
let audioQueue = [];
let isPlayingAudio = false;
let nextPlayTime = 0;  // Track when next audio should play
let activeAudioSources = [];  // Track all active audio sources for stopping

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('Voice Live API UI loaded');
    checkStatus();
    
    // Set up event listeners
    startBtn.addEventListener('click', startConversation);
    stopBtn.addEventListener('click', stopConversation);
    clearChatBtn.addEventListener('click', clearChat);
    
    // Initialize Socket.IO
    initializeSocket();
});

// Initialize Socket.IO connection
function initializeSocket() {
    socket = io();
    
    socket.on('connect', () => {
        console.log('Socket.IO connected');
    });
    
    socket.on('disconnect', () => {
        console.log('Socket.IO disconnected');
    });
    
    socket.on('transcript', (data) => {
        console.log('Received transcript:', data);
        addMessageToChat(data);
        
        // Hide spinner when we get agent response
        if (data.type === 'agent') {
            hideSpinner();
            waitingForResponse = false;
        }
    });
    
    socket.on('audio_output', (data) => {
        console.log('Received audio output');
        playAudioOutput(data.audio);
    });
    
    socket.on('speech_started', () => {
        console.log('User started speaking - stopping audio playback');
        stopAudioPlayback();
    });
}

// Check conversation status
async function checkStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        updateUI(data.active);
    } catch (error) {
        console.error('Error checking status:', error);
        showMessage('Error checking status', 'error');
    }
}

// Start conversation
async function startConversation() {
    try {
        startBtn.disabled = true;
        modelInput.disabled = true;
        showMessage('Starting conversation...', 'info');
        
        // Get model name from input
        const modelName = modelInput.value.trim() || 'gpt-realtime';
        
        const response = await fetch('/api/start', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: modelName
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Start audio capture
            try {
                await startAudioCapture();
                showMessage('Conversation started! You can now speak.', 'success');
            } catch (audioError) {
                console.error('Failed to start audio capture:', audioError);
                showMessage('Conversation started but microphone failed. Check permissions.', 'warning');
            }
            
            updateUI(true);
            
            // Clear chat window
            clearChat();
            
            // Start periodic status checks
            statusCheckInterval = setInterval(checkStatus, 5000);
        } else {
            showMessage(`Error: ${data.message}`, 'error');
            startBtn.disabled = false;
            modelInput.disabled = false;
        }
    } catch (error) {
        console.error('Error starting conversation:', error);
        showMessage('Failed to start conversation. Please check console for details.', 'error');
        startBtn.disabled = false;
        modelInput.disabled = false;
    }
}

// Stop conversation
async function stopConversation() {
    try {
        stopBtn.disabled = true;
        showMessage('Stopping conversation...', 'info');
        hideSpinner();
        
        // Stop audio capture and playback
        stopAudioCapture();
        stopAudioPlayback();
        
        const response = await fetch('/api/stop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showMessage('Conversation stopped.', 'success');
            updateUI(false);
            modelInput.disabled = false;
            
            // Stop status checks
            if (statusCheckInterval) {
                clearInterval(statusCheckInterval);
                statusCheckInterval = null;
            }
        } else {
            showMessage(`Error: ${data.message}`, 'error');
            stopBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error stopping conversation:', error);
        showMessage('Failed to stop conversation. Please check console for details.', 'error');
        stopBtn.disabled = false;
    }
}

// Update UI based on conversation state
function updateUI(active) {
    isConversationActive = active;
    
    if (active) {
        // Conversation is active
        statusDot.classList.add('active');
        statusText.textContent = 'Conversation Active';
        startBtn.disabled = true;
        stopBtn.disabled = false;
    } else {
        // Conversation is not active
        statusDot.classList.remove('active');
        statusText.textContent = 'Ready';
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
}

// Show message to user
function showMessage(message, type = 'info') {
    messageText.textContent = message;
    messageBox.className = 'message-box ' + type;
    messageBox.style.display = 'block';
    
    // Auto-hide after 5 seconds for success/info messages
    if (type !== 'error') {
        setTimeout(() => {
            messageBox.style.display = 'none';
        }, 5000);
    }
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (statusCheckInterval) {
        clearInterval(statusCheckInterval);
    }
    
    // Stop audio capture if active
    stopAudioCapture();
});

// Add message to chat
function addMessageToChat(data) {
    // Remove placeholder if exists
    const placeholder = chatMessages.querySelector('.chat-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    // Hide spinner when we get any message
    hideSpinner();
    
    // Show spinner when user speaks (will hide when agent responds)
    if (data.type === 'user' && !waitingForResponse) {
        showSpinner();
        waitingForResponse = true;
    }
    
    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${data.type}`;
    
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${data.type}`;
    
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = data.type === 'user' ? 'You' : 'AI Agent';
    
    const content = document.createElement('p');
    content.className = 'message-content';
    
    // Format text with line breaks and preserve whitespace
    const formattedText = data.text
        .replace(/\n/g, '<br>')  // Convert newlines to <br>
        .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');  // Convert tabs to spaces
    
    content.innerHTML = formattedText;
    
    const timestamp = document.createElement('span');
    timestamp.className = 'message-timestamp';
    timestamp.textContent = formatTime(data.timestamp);
    
    bubble.appendChild(label);
    bubble.appendChild(content);
    bubble.appendChild(timestamp);
    messageDiv.appendChild(bubble);
    
    chatMessages.appendChild(messageDiv);
    
    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Reset waiting state when agent responds
    if (data.type === 'agent') {
        waitingForResponse = false;
    }
}

// Clear chat
function clearChat() {
    chatMessages.innerHTML = '<div class="chat-placeholder"><p>Start a conversation to see messages here...</p></div>';
}

// Format timestamp
function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    });
}

// Audio Functions

/**
 * Start capturing audio from the user's microphone
 */
async function startAudioCapture() {
    try {
        console.log('Requesting microphone access...');
        
        // Request microphone permission with optimal settings for voice
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
                sampleRate: 24000,  // Azure expects 24kHz
                channelCount: 1,    // Mono
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true
            } 
        });
        
        console.log('Microphone access granted');
        
        // Create audio context with 24kHz sample rate (Azure requirement)
        audioContext = new (window.AudioContext || window.webkitAudioContext)({ 
            sampleRate: 24000 
        });
        
        const source = audioContext.createMediaStreamSource(mediaStream);
        
        // Create script processor for audio chunks (4096 samples = ~170ms at 24kHz)
        scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
        
        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
            if (!isRecording) return;
            
            const inputBuffer = audioProcessingEvent.inputBuffer;
            const audioData = inputBuffer.getChannelData(0); // Get mono channel
            
            // Convert Float32Array (-1 to 1) to Int16Array (-32768 to 32767)
            const int16Data = new Int16Array(audioData.length);
            for (let i = 0; i < audioData.length; i++) {
                const s = Math.max(-1, Math.min(1, audioData[i]));
                int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }
            
            // Convert to base64 for transmission
            const uint8Data = new Uint8Array(int16Data.buffer);
            const base64Audio = btoa(String.fromCharCode.apply(null, uint8Data));
            
            // Send audio to server via WebSocket
            if (socket && socket.connected) {
                socket.emit('audio_input', { audio: base64Audio });
            }
        };
        
        // Connect the audio processing pipeline
        source.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);
        
        isRecording = true;
        console.log('Audio capture started');
        
    } catch (error) {
        console.error('Error accessing microphone:', error);
        showMessage('Microphone access denied. Please allow microphone access and try again.', 'error');
        throw error;
    }
}

/**
 * Stop capturing audio from the microphone
 */
function stopAudioCapture() {
    isRecording = false;
    
    if (scriptProcessor) {
        scriptProcessor.disconnect();
        scriptProcessor = null;
    }
    
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }
    
    if (audioContext && audioContext.state !== 'closed') {
        // Stop all active audio sources before closing
        activeAudioSources.forEach(source => {
            try {
                source.stop();
            } catch (e) {
                // Ignore errors for already stopped sources
            }
        });
        activeAudioSources = [];
        
        // Reset play time when stopping
        nextPlayTime = 0;
        audioContext.close();
        audioContext = null;
    }
    
    console.log('Audio capture stopped');
}

/**
 * Stop all currently playing audio
 */
function stopAudioPlayback() {
    // Stop all active audio sources
    activeAudioSources.forEach(source => {
        try {
            source.stop();  // Stop each audio source immediately
        } catch (e) {
            // Source might already be stopped, ignore error
        }
    });
    
    // Clear the active sources array
    activeAudioSources = [];
    
    // Clear the audio queue
    audioQueue = [];
    
    // Reset the next play time to current time (prevents scheduled audio from playing)
    if (audioContext && audioContext.state !== 'closed') {
        nextPlayTime = audioContext.currentTime;
    } else {
        nextPlayTime = 0;
    }
    
    // Stop playing flag
    isPlayingAudio = false;
    
    console.log('Audio playback stopped - all sources stopped and queue cleared');
}

/**
 * Play audio received from the server
 * @param {string} base64Audio - Base64-encoded PCM16 audio data
 */
async function playAudioOutput(base64Audio) {
    try {
        // Ensure audio context exists
        if (!audioContext || audioContext.state === 'closed') {
            audioContext = new (window.AudioContext || window.webkitAudioContext)({ 
                sampleRate: 24000 
            });
            nextPlayTime = audioContext.currentTime; // Initialize play time
        }
        
        // Resume audio context if suspended (browser autoplay policy)
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        // Decode base64 to ArrayBuffer
        const binaryString = atob(base64Audio);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Convert Int16Array to Float32Array for Web Audio API
        const int16Array = new Int16Array(bytes.buffer);
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF);
        }
        
        // Create audio buffer
        const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
        audioBuffer.getChannelData(0).set(float32Array);
        
        // Calculate duration of this chunk
        const duration = audioBuffer.duration;
        
        // Schedule playback at the correct time
        const currentTime = audioContext.currentTime;
        
        // If nextPlayTime is in the past, reset it to now
        if (nextPlayTime < currentTime) {
            nextPlayTime = currentTime;
        }
        
        // Create buffer source and schedule playback
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        // Add to active sources array for tracking
        activeAudioSources.push(source);
        
        // Remove from active sources when it finishes playing
        source.onended = () => {
            const index = activeAudioSources.indexOf(source);
            if (index > -1) {
                activeAudioSources.splice(index, 1);
            }
            console.log(`Audio chunk finished, ${activeAudioSources.length} sources still active`);
        };
        
        // Start playback at scheduled time
        source.start(nextPlayTime);
        
        // Update next play time for the next chunk
        nextPlayTime += duration;
        
        console.log(`Scheduled audio chunk: duration=${duration.toFixed(3)}s, playTime=${nextPlayTime.toFixed(3)}s, active sources: ${activeAudioSources.length}`);
        
    } catch (error) {
        console.error('Error playing audio:', error);
    }
}

// Show loading spinner
function showSpinner() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'flex';
    }
}

// Hide loading spinner
function hideSpinner() {
    if (loadingSpinner) {
        loadingSpinner.style.display = 'none';
    }
}
