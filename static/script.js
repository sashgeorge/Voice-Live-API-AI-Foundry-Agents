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
            showMessage('Conversation started! You can now speak.', 'success');
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
