import SwiftUI

struct ContentView: View {
    @EnvironmentObject var audioManager: AudioManager
    @EnvironmentObject var webSocketManager: WebSocketManager
    @EnvironmentObject var configManager: ConfigManager
    
    @State private var messages: [ChatMessage] = []
    @State private var showSettings = false
    @State private var isRecording = false
    @State private var connectionStatus: ConnectionStatus = .disconnected
    @State private var showPermissionAlert = false
    
    var body: some View {
        NavigationView {
            ZStack {
                Color.black.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    // Status Bar
                    StatusBarView(status: connectionStatus)
                    
                    // Chat Container
                    if messages.isEmpty {
                        EmptyStateView()
                    } else {
                        MessageListView(messages: messages)
                    }
                    
                    // Control Panel
                    ControlPanelView(
                        isRecording: $isRecording,
                        connectionStatus: $connectionStatus,
                        onStartStop: handleStartStop
                    )
                }
            }
            .navigationBarItems(trailing: Button(action: {
                showSettings = true
            }) {
                Image(systemName: "gearshape.fill")
                    .foregroundColor(.gray)
            })
            .sheet(isPresented: $showSettings) {
                SettingsView()
                    .environmentObject(configManager)
            }
            .alert("Microphone Permission Required", isPresented: $showPermissionAlert) {
                Button("Settings", action: openSettings)
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("Please enable microphone access in Settings to use voice conversations.")
            }
        }
        .navigationViewStyle(StackNavigationViewStyle())
        .onAppear {
            setupWebSocketCallbacks()
        }
    }
    
    private func handleStartStop() {
        if isRecording {
            stopConversation()
        } else {
            startConversation()
        }
    }
    
    private func startConversation() {
        // Check config
        guard configManager.hasValidConfig else {
            showSettings = true
            return
        }
        
        // Check microphone permission
        audioManager.requestMicrophonePermission { granted in
            if granted {
                connectionStatus = .connecting
                
                // Get config
                if let config = configManager.loadConfig() {
                    // Connect WebSocket
                    webSocketManager.connect(config: config) { success in
                        if success {
                            isRecording = true
                            connectionStatus = .connected
                            
                            // Start audio recording
                            audioManager.startRecording { audioData in
                                webSocketManager.sendAudioChunk(audioData)
                            }
                            
                            // Start audio playback
                            audioManager.startPlayback()
                        } else {
                            connectionStatus = .disconnected
                        }
                    }
                }
            } else {
                showPermissionAlert = true
            }
        }
    }
    
    private func stopConversation() {
        isRecording = false
        connectionStatus = .disconnected
        
        audioManager.stopRecording()
        audioManager.stopPlayback()
        webSocketManager.disconnect()
    }
    
    private func setupWebSocketCallbacks() {
        webSocketManager.onAudioReceived = { audioData in
            audioManager.playAudio(audioData)
        }
        
        webSocketManager.onTranscriptReceived = { type, text in
            DispatchQueue.main.async {
                if type == "user" {
                    messages.append(ChatMessage(sender: .user, text: text))
                } else if type == "assistant" {
                    if let lastMessage = messages.last, lastMessage.sender == .assistant {
                        messages[messages.count - 1].text += text
                    } else {
                        messages.append(ChatMessage(sender: .assistant, text: text))
                    }
                }
            }
        }
        
        webSocketManager.onSpeechStarted = {
            audioManager.clearAudioQueue()
        }
        
        webSocketManager.onError = { error in
            DispatchQueue.main.async {
                connectionStatus = .disconnected
                isRecording = false
                messages.append(ChatMessage(sender: .system, text: "Error: \(error)"))
            }
        }
    }
    
    private func openSettings() {
        if let url = URL(string: UIApplication.openSettingsURLString) {
            UIApplication.shared.open(url)
        }
    }
}

enum ConnectionStatus {
    case disconnected
    case connecting
    case connected
    
    var text: String {
        switch self {
        case .disconnected: return "Ready"
        case .connecting: return "Connecting..."
        case .connected: return "Active"
        }
    }
    
    var color: Color {
        switch self {
        case .disconnected: return .green
        case .connecting: return .orange
        case .connected: return .red
        }
    }
}
