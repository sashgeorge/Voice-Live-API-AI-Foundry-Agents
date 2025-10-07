const socket = io();
const chatMessages = document.getElementById('chatMessages');
const toggleConversationBtn = document.getElementById('toggleConversationBtn');
const conversationIcon = document.getElementById('conversationIcon');
const conversationText = document.getElementById('conversationText');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const modelDisplay = document.getElementById('modelDisplay');

let isConversationActive = false;
let audioContext;
let mediaStream;
let audioWorkletNode;
let scriptProcessor;
let audioQueue = [];
let isPlayingAudio = false;
let nextPlayTime = 0;
let activeAudioSources = [];
let loadingMessageElement = null;

toggleConversationBtn.addEventListener('click', toggleConversation);

async function toggleConversation() {
    if (!isConversationActive) {
        await startConversation();
    } else {
        await stopConversation();
    }
}

async function startConversation() {
    const model = modelDisplay.textContent;
    try {
        toggleConversationBtn.disabled = true;
        addMessage('system', 'Initializing conversation...');
        const response = await fetch('/api/start', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ model: model })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to start session');
        }
        const data = await response.json();
        console.log('Session started:', data);
        await initAudio();
        isConversationActive = true;
        updateUI();
        addMessage('system', 'Conversation started. Speak naturally!');
    } catch (error) {
        console.error('Error starting conversation:', error);
        addMessage('system', `Error: ${error.message}`);
        toggleConversationBtn.disabled = false;
    }
}

async function stopConversation() {
    try {
        toggleConversationBtn.disabled = true;
        addMessage('system', 'Ending conversation...');
        removeLoadingIndicator();
        if (mediaStream) {
            mediaStream.getTracks().forEach(track => track.stop());
        }
        if (audioWorkletNode) audioWorkletNode.disconnect();
        if (scriptProcessor) scriptProcessor.disconnect();
        if (audioContext) await audioContext.close();
        stopAllAudio();
        const response = await fetch('/api/stop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to end session');
        isConversationActive = false;
        updateUI();
        addMessage('system', 'Conversation ended.');
    } catch (error) {
        console.error('Error stopping conversation:', error);
        addMessage('system', `Error: ${error.message}`);
    } finally {
        toggleConversationBtn.disabled = false;
    }
}

async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(mediaStream);
        try {
            await audioContext.audioWorklet.addModule('/static/audio-processor.js');
            audioWorkletNode = new AudioWorkletNode(audioContext, 'audio-processor');
            source.connect(audioWorkletNode);
            audioWorkletNode.port.onmessage = (event) => {
                if (event.data.audio) {
                    const audioArray = Array.from(event.data.audio);
                    const base64Audio = btoa(String.fromCharCode.apply(null, new Uint8Array(new Int16Array(audioArray).buffer)));
                    socket.emit('audio_input', { audio: base64Audio });
                }
            };
        } catch (error) {
            console.log('AudioWorklet not available, using ScriptProcessor');
            scriptProcessor = audioContext.createScriptProcessor(4096, 1, 1);
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContext.destination);
            scriptProcessor.onaudioprocess = (event) => {
                const inputData = event.inputBuffer.getChannelData(0);
                const pcm16 = convertFloat32ToInt16(inputData);
                const base64Audio = btoa(String.fromCharCode.apply(null, new Uint8Array(pcm16.buffer)));
                socket.emit('audio_input', { audio: base64Audio });
            };
        }
        console.log('Audio initialized');
    } catch (error) {
        console.error('Error initializing audio:', error);
        throw error;
    }
}

function convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16Array;
}

function stopAllAudio() {
    activeAudioSources.forEach(source => {
        try { source.stop(); } catch (e) {}
    });
    activeAudioSources = [];
    audioQueue = [];
    isPlayingAudio = false;
    nextPlayTime = 0;
}
function updateUI() {
    if (isConversationActive) {
        toggleConversationBtn.classList.add('active');
        toggleConversationBtn.classList.remove('primary');
        conversationText.textContent = 'Stop Conversation';
        conversationIcon.innerHTML = `<rect x="6" y="6" width="12" height="12" stroke="currentColor" stroke-width="2" fill="none"/>`;
        statusDot.classList.add('active');
        statusText.textContent = 'Active';
        toggleConversationBtn.disabled = false;
    } else {
        toggleConversationBtn.classList.remove('active');
        toggleConversationBtn.classList.add('primary');
        conversationText.textContent = 'Start Conversation';
        conversationIcon.innerHTML = `<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"/>`;
        statusDot.classList.remove('active');
        statusText.textContent = 'Ready';
        toggleConversationBtn.disabled = false;
    }
}

function addMessage(type, text) {
    // Remove loading indicator when new message arrives
    removeLoadingIndicator();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Format text for better readability
    if (type === 'assistant' || type === 'user') {
        // Preserve line breaks and format text
        messageDiv.textContent = text.trim();
    } else {
        messageDiv.textContent = text;
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoadingIndicator() {
    // Don't show multiple loading indicators
    if (loadingMessageElement) return;
    
    loadingMessageElement = document.createElement('div');
    loadingMessageElement.className = 'loading-message';
    loadingMessageElement.innerHTML = `
        <div class="spinner"></div>
        <span class="loading-text">Assistant is thinking...</span>
    `;
    chatMessages.appendChild(loadingMessageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoadingIndicator() {
    if (loadingMessageElement) {
        loadingMessageElement.remove();
        loadingMessageElement = null;
    }
}

socket.on('connect', () => console.log('Connected to server'));
socket.on('disconnect', () => {
    console.log('Disconnected from server');
    if (isConversationActive) stopConversation();
});

socket.on('audio_output', (data) => {
    if (data.audio) {
        // Decode base64 audio to Int16Array
        const binaryString = atob(data.audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const int16Array = new Int16Array(bytes.buffer);
        playAudioChunk(int16Array);
    }
});

socket.on('transcript', (data) => {
    console.log('Received transcript:', data);
    if (data.text) {
        const messageType = data.type === 'user' ? 'user' : 'assistant';
        
        // Show loading indicator when user finishes speaking
        if (messageType === 'user') {
            addMessage(messageType, data.text);
            showLoadingIndicator();
        } else {
            // Assistant message - remove loading and show response
            addMessage(messageType, data.text);
        }
    }
});

socket.on('speech_started', () => {
    console.log('User started speaking - stopping audio playback');
    stopAllAudio();
    removeLoadingIndicator();
});

socket.on('error', (data) => {
    console.error('Server error:', data.error);
    addMessage('system', `Error: ${data.error}`);
});

function playAudioChunk(int16Array) {
    if (!audioContext || audioContext.state === 'closed') return;
    audioQueue.push(int16Array);
    if (!isPlayingAudio) processAudioQueue();
}

async function processAudioQueue() {
    if (audioQueue.length === 0) {
        isPlayingAudio = false;
        return;
    }
    isPlayingAudio = true;
    const int16Array = audioQueue.shift();
    try {
        const float32Array = new Float32Array(int16Array.length);
        for (let i = 0; i < int16Array.length; i++) {
            float32Array[i] = int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7FFF);
        }
        const audioBuffer = audioContext.createBuffer(1, float32Array.length, 24000);
        audioBuffer.getChannelData(0).set(float32Array);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        const currentTime = audioContext.currentTime;
        const startTime = Math.max(currentTime, nextPlayTime);
        source.start(startTime);
        activeAudioSources.push(source);
        nextPlayTime = startTime + audioBuffer.duration;
        source.onended = () => {
            const index = activeAudioSources.indexOf(source);
            if (index > -1) activeAudioSources.splice(index, 1);
            processAudioQueue();
        };
    } catch (error) {
        console.error('Error playing audio:', error);
        processAudioQueue();
    }
}

updateUI();
