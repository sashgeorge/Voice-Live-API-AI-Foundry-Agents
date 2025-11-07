import Foundation

struct ChatMessage: Identifiable, Codable {
    let id: UUID
    var sender: MessageSender
    var text: String
    let timestamp: Date
    
    init(id: UUID = UUID(), sender: MessageSender, text: String, timestamp: Date = Date()) {
        self.id = id
        self.sender = sender
        self.text = text
        self.timestamp = timestamp
    }
}

enum MessageSender: String, Codable {
    case user
    case assistant
    case system
    
    var displayName: String {
        switch self {
        case .user: return "You"
        case .assistant: return "Assistant"
        case .system: return "System"
        }
    }
    
    var backgroundColor: Color {
        switch self {
        case .user: return Color.blue
        case .assistant: return Color(red: 0.17, green: 0.17, blue: 0.18)
        case .system: return Color(red: 0.11, green: 0.11, blue: 0.12)
        }
    }
}

struct AzureConfig: Codable {
    let endpoint: String
    let agentId: String
    let projectName: String
    let apiVersion: String
    
    var isValid: Bool {
        return !endpoint.isEmpty && !agentId.isEmpty && !projectName.isEmpty
    }
}
