import SwiftUI

struct StatusBarView: View {
    let status: ConnectionStatus
    
    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "mic.fill")
                .font(.system(size: 24))
                .foregroundColor(.white)
            
            VStack(alignment: .leading, spacing: 4) {
                Text("Voice Assistant")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.white)
                
                HStack(spacing: 6) {
                    Circle()
                        .fill(status.color)
                        .frame(width: 8, height: 8)
                    
                    Text(status.text)
                        .font(.system(size: 12))
                        .foregroundColor(.gray)
                }
            }
            
            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(Color(red: 0.11, green: 0.11, blue: 0.12))
    }
}

struct EmptyStateView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "mic.circle.fill")
                .font(.system(size: 80))
                .foregroundColor(.blue)
                .opacity(0.6)
            
            Text("Ready to Chat")
                .font(.system(size: 24, weight: .bold))
                .foregroundColor(.white)
            
            Text("Tap the button below to start your\nvoice conversation with the AI assistant")
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
    }
}

struct MessageListView: View {
    let messages: [ChatMessage]
    
    var body: some View {
        ScrollViewReader { proxy in
            ScrollView {
                LazyVStack(spacing: 8) {
                    ForEach(messages) { message in
                        MessageBubbleView(message: message)
                            .id(message.id)
                    }
                }
                .padding()
            }
            .onChange(of: messages.count) { _ in
                if let lastMessage = messages.last {
                    withAnimation {
                        proxy.scrollTo(lastMessage.id, anchor: .bottom)
                    }
                }
            }
        }
    }
}

struct MessageBubbleView: View {
    let message: ChatMessage
    
    var body: some View {
        HStack {
            if message.sender == .user {
                Spacer(minLength: 60)
            }
            
            VStack(alignment: message.sender == .user ? .trailing : .leading, spacing: 4) {
                Text(message.sender.displayName)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.gray)
                
                Text(message.text)
                    .font(.system(size: 15))
                    .foregroundColor(.white)
                    .padding(12)
                    .background(message.sender.backgroundColor)
                    .cornerRadius(18)
                
                Text(message.timestamp, style: .time)
                    .font(.system(size: 10))
                    .foregroundColor(.gray)
            }
            
            if message.sender == .assistant || message.sender == .system {
                Spacer(minLength: 60)
            }
        }
    }
}

struct ControlPanelView: View {
    @Binding var isRecording: Bool
    @Binding var connectionStatus: ConnectionStatus
    let onStartStop: () -> Void
    
    var body: some View {
        VStack(spacing: 16) {
            // Status Indicator
            HStack(spacing: 8) {
                Circle()
                    .fill(connectionStatus.color)
                    .frame(width: 8, height: 8)
                
                Text(connectionStatus.text)
                    .font(.system(size: 12))
                    .foregroundColor(.gray)
            }
            
            // Main Button
            Button(action: onStartStop) {
                HStack(spacing: 12) {
                    Image(systemName: isRecording ? "stop.fill" : "mic.fill")
                        .font(.system(size: 20))
                    
                    Text(isRecording ? "Stop Conversation" : "Start Conversation")
                        .font(.system(size: 16, weight: .medium))
                }
                .frame(maxWidth: .infinity)
                .frame(height: 56)
                .background(isRecording ? Color.red : Color.green)
                .foregroundColor(.white)
                .cornerRadius(14)
            }
            .disabled(connectionStatus == .connecting)
            
            // Progress Bar
            if connectionStatus == .connecting {
                ProgressView()
                    .progressViewStyle(LinearProgressViewStyle())
                    .tint(.blue)
            }
        }
        .padding(20)
        .background(Color(red: 0.11, green: 0.11, blue: 0.12))
        .cornerRadius(16)
        .padding()
    }
}
