import SwiftUI

@main
struct VoiceLiveApp: App {
    @StateObject private var audioManager = AudioManager()
    @StateObject private var webSocketManager = WebSocketManager()
    @StateObject private var configManager = ConfigManager()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(audioManager)
                .environmentObject(webSocketManager)
                .environmentObject(configManager)
        }
    }
}
