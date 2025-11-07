import Foundation
import Combine

class WebSocketManager: NSObject, ObservableObject, URLSessionWebSocketDelegate {
    @Published var isConnected = false
    
    private var webSocketTask: URLSessionWebSocketTask?
    private var urlSession: URLSession?
    
    var onAudioReceived: ((String) -> Void)?
    var onTranscriptReceived: ((String, String) -> Void)?
    var onSpeechStarted: (() -> Void)?
    var onResponseStarted: (() -> Void)?
    var onResponseCompleted: (() -> Void)?
    var onError: ((String) -> Void)?
    
    private var assistantTranscriptBuilder = ""
    
    override init() {
        super.init()
        let configuration = URLSessionConfiguration.default
        urlSession = URLSession(configuration: configuration, delegate: self, delegateQueue: OperationQueue())
    }
    
    func connect(config: AzureConfig, completion: @escaping (Bool) -> Void) {
        // TODO: Implement proper Azure authentication
        // For now, using placeholder token
        let token = "placeholder_token"
        
        var wsEndpoint = config.endpoint
            .replacingOccurrences(of: "https://", with: "wss://")
            .trimmingCharacters(in: CharacterSet(charactersIn: "/"))
        
        let urlString = "\(wsEndpoint)/voice-live/realtime?api-version=\(config.apiVersion)&agent-project-name=\(config.projectName)&agent-id=\(config.agentId)&agent-access-token=\(token)"
        
        guard let url = URL(string: urlString) else {
            completion(false)
            return
        }
        
        webSocketTask = urlSession?.webSocketTask(with: url)
        webSocketTask?.resume()
        
        receiveMessage()
        
        // Send session configuration
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.sendSessionConfig()
            self.isConnected = true
            completion(true)
        }
    }
    
    func disconnect() {
        webSocketTask?.cancel(with: .goingAway, reason: nil)
        webSocketTask = nil
        isConnected = false
    }
    
    func sendAudioChunk(_ audioBase64: String) {
        let message: [String: Any] = [
            "type": "input_audio_buffer.append",
            "audio": audioBase64,
            "event_id": ""
        ]
        
        sendMessage(message)
    }
    
    private func sendSessionConfig() {
        let sessionUpdate: [String: Any] = [
            "type": "session.update",
            "session": [
                "turn_detection": [
                    "type": "azure_semantic_vad",
                    "threshold": 0.3,
                    "prefix_padding_ms": 200,
                    "silence_duration_ms": 200,
                    "remove_filler_words": false,
                    "end_of_utterance_detection": [
                        "model": "semantic_detection_v1",
                        "threshold": 0.01,
                        "timeout": 2
                    ]
                ],
                "input_audio_noise_reduction": [
                    "type": "azure_deep_noise_suppression"
                ],
                "input_audio_echo_cancellation": [
                    "type": "server_echo_cancellation"
                ],
                "voice": [
                    "name": "en-US-Ava:DragonHDLatestNeural",
                    "type": "azure-standard",
                    "temperature": 0.8
                ]
            ],
            "event_id": ""
        ]
        
        sendMessage(sessionUpdate)
        
        // Send greeting
        let greeting: [String: Any] = [
            "type": "response.create",
            "response": [
                "modalities": ["text", "audio"],
                "instructions": "Greet the user with this message: 'Hello. I am Wendy. Helpful Verizon assistant who can help with your Verizon home equipments.'"
            ],
            "event_id": ""
        ]
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
            self.sendMessage(greeting)
        }
    }
    
    private func sendMessage(_ message: [String: Any]) {
        guard let jsonData = try? JSONSerialization.data(withJSONObject: message),
              let jsonString = String(data: jsonData, encoding: .utf8) else {
            return
        }
        
        let message = URLSessionWebSocketTask.Message.string(jsonString)
        webSocketTask?.send(message) { error in
            if let error = error {
                print("WebSocket send error: \(error)")
            }
        }
    }
    
    private func receiveMessage() {
        webSocketTask?.receive { [weak self] result in
            switch result {
            case .success(let message):
                switch message {
                case .string(let text):
                    self?.handleMessage(text)
                case .data(let data):
                    if let text = String(data: data, encoding: .utf8) {
                        self?.handleMessage(text)
                    }
                @unknown default:
                    break
                }
                
                // Continue receiving
                self?.receiveMessage()
                
            case .failure(let error):
                print("WebSocket receive error: \(error)")
                DispatchQueue.main.async {
                    self?.onError?(error.localizedDescription)
                }
            }
        }
    }
    
    private func handleMessage(_ text: String) {
        guard let data = text.data(using: .utf8),
              let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
              let type = json["type"] as? String else {
            return
        }
        
        DispatchQueue.main.async {
            switch type {
            case "response.audio.delta":
                if let delta = json["delta"] as? String, !delta.isEmpty {
                    self.onAudioReceived?(delta)
                }
                
            case "conversation.item.input_audio_transcription.completed":
                if let transcript = json["transcript"] as? String {
                    self.onTranscriptReceived?("user", transcript)
                }
                
            case "response.audio_transcript.delta":
                if let delta = json["delta"] as? String {
                    self.assistantTranscriptBuilder += delta
                    self.onTranscriptReceived?("assistant", delta)
                }
                
            case "input_audio_buffer.speech_started":
                self.onSpeechStarted?()
                
            case "response.created":
                self.assistantTranscriptBuilder = ""
                self.onResponseStarted?()
                
            case "response.done":
                self.onResponseCompleted?()
                
            default:
                if type.contains("error") {
                    if let error = json["error"] as? [String: Any],
                       let message = error["message"] as? String {
                        self.onError?(message)
                    }
                }
            }
        }
    }
    
    // URLSessionWebSocketDelegate
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didOpenWithProtocol protocol: String?) {
        print("WebSocket connected")
    }
    
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didCloseWith closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
        print("WebSocket disconnected")
        DispatchQueue.main.async {
            self.isConnected = false
        }
    }
}
