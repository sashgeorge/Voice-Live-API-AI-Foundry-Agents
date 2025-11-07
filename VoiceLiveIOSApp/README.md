# Voice Live iOS App

Native iOS application for real-time voice conversations with Azure Voice Live API and AI Foundry Agents.

## 📱 Features

- ✅ Real-time voice conversations with AI assistant
- ✅ Live transcript display
- ✅ Speech interruption support
- ✅ Native iOS design with SwiftUI
- ✅ AVAudioEngine for recording (24kHz PCM16)
- ✅ Real-time audio playback
- ✅ URLSession WebSocket communication
- ✅ Secure UserDefaults storage

## 🔧 Prerequisites

### **IMPORTANT: You Need a Mac Computer**

**iOS development REQUIRES macOS.** You cannot develop iOS apps on Windows.

- **Mac computer** running macOS 12.0 (Monterey) or later
- **Xcode 14.0 or later** (free from Mac App Store)
- **Apple ID** (free, required for Xcode)
- **iOS device** (iPhone/iPad) OR **iOS Simulator** (included with Xcode)

### Azure Requirements

- Azure AI Foundry project with an AI agent
- Azure Voice Live API endpoint
- Valid Azure credentials

## 🚀 Setup Instructions

### Step 1: Install Xcode (Mac Only - 30-60 minutes)

**⚠️ WARNING: You MUST have a Mac computer to develop iOS apps!**

1. **Open Mac App Store** on your Mac
2. **Search for "Xcode"**
3. **Click "Get"** or "Install" (it's free!)
4. **Wait for download** (~12-15 GB, takes 30-60 minutes)
5. **Open Xcode** from Applications folder
6. **Accept license agreement** when prompted
7. **Install additional components** if prompted
8. **Wait for "Command Line Tools"** installation

**Alternative:** Download from https://developer.apple.com/xcode/

### Step 2: Verify Xcode Installation

1. Open **Terminal** app on your Mac
2. Type: `xcode-select --version`
3. You should see version information
4. If not installed, run: `xcode-select --install`

### Step 3: Open the iOS Project

1. **Launch Xcode**
2. **Click "Open a project or file"**
3. **Navigate to:**
   ```
   VoiceLiveIOSApp/VoiceLiveApp.xcodeproj
   ```
4. **Click "Open"**
5. **Wait for project to load** (first time takes 2-3 minutes)
6. **Trust the project** if prompted

### Step 4: Choose Your Testing Device

#### Option A: iOS Simulator (Easier, No Device Needed)

1. At the top of Xcode, click the **device selector** (next to "VoiceLiveApp")
2. Select **"iPhone 15 Pro"** or any iPhone simulator
3. Click **"Product" → "Destination" → "Add Additional Simulators..."** if you need more

#### Option B: Physical iPhone/iPad

1. **Connect your iPhone/iPad** to Mac with USB cable
2. **On your device:** Settings → General → VPN & Device Management
3. **Trust your computer** when prompted
4. **In Xcode:** Click device selector at top
5. **Select your device** from the list
6. **Configure signing:** (see Step 5)

### Step 5: Configure Code Signing (Required for Physical Device)

1. In Xcode, click on **"VoiceLiveApp"** (blue icon) in left panel
2. Select **"VoiceLiveApp"** target
3. Go to **"Signing & Capabilities"** tab
4. Check **"Automatically manage signing"**
5. Select your **Team** (your Apple ID)
   - If no team, click "Add Account..." and sign in with Apple ID
6. A valid **Bundle Identifier** will be generated
7. You should see "✓ Signing Certificate" with your name

### Step 6: Build and Run

1. **Click the ▶️ Play button** at top left (or press `⌘ + R`)
2. **Wait for build** (first time takes 3-5 minutes)
3. **Watch build progress** at top of Xcode
4. **App will launch** automatically on simulator/device

**On Physical Device First Time:**
- Device will show "Untrusted Developer" message
- Go to: Settings → General → VPN & Device Management
- Tap your developer profile
- Tap "Trust [Your Name]"
- Return to app and launch again

### Step 7: Configure Azure Credentials

1. **Tap gear icon** (⚙️) in top right of app
2. **Enter your Azure credentials** from `.env` file:
   - **Azure Endpoint**: Your AI Foundry endpoint
   - **Agent ID**: Your AI Foundry agent ID
   - **Project Name**: Your AI Foundry project name
   - **API Version**: Keep default `2025-10-01`
3. **Tap "Save Configuration"**
4. **Tap "Done"**

## 🧪 Testing the Application

### Using iOS Simulator (Mac Only)

1. **Select simulator** from device menu (e.g., "iPhone 15 Pro")
2. **Click Run** (▶️ button)
3. **Simulator launches** (takes 30-60 seconds first time)
4. **App installs and opens** automatically
5. **Configure Azure settings** (gear icon)
6. **Tap "Start Conversation"**
7. **Grant microphone permission**
8. **Speak into your Mac's microphone**
9. **AI responds** with voice and text

**Simulator Tips:**
- Use your Mac's built-in microphone
- Adjust Mac's volume for audio output
- Press `⌘ + Shift + H` for home screen
- Press `⌘ + Shift + H` twice for app switcher

### Using Physical iPhone/iPad

1. **Connect device** to Mac with cable
2. **Select your device** from device menu
3. **Click Run** (▶️ button)
4. **Trust app** on device (first time only)
5. **App launches** on your device
6. **Configure Azure settings**
7. **Tap "Start Conversation"**
8. **Grant microphone permission**
9. **Speak naturally**
10. **AI responds** via device speaker

## 🐛 Troubleshooting

### "No signing certificate found"

**Solution:**
1. Xcode → Preferences → Accounts
2. Click "+" to add Apple ID
3. Sign in with your Apple ID
4. Close and reopen project
5. Select your team in Signing & Capabilities

### "Failed to code sign"

**Solution:**
1. Click project in left panel
2. Go to "Signing & Capabilities"
3. Change Bundle Identifier to something unique (e.g., add your initials)
4. Try building again

### "Xcode command line tools not installed"

**Solution:**
1. Open Terminal
2. Run: `xcode-select --install`
3. Click "Install" in popup
4. Wait for completion
5. Restart Xcode

### "Cannot run on device - version too old"

**Solution:**
1. Update your iOS device to latest version
2. OR change Deployment Target:
   - Project Settings → Deployment Info
   - Change minimum iOS version to match your device

### "Microphone not working in Simulator"

**Solution:**
1. Simulator uses your Mac's microphone
2. System Preferences → Security & Privacy → Microphone
3. Ensure "Simulator" or "Xcode" has permission
4. Restart simulator

### "Build failed with errors"

**Solution:**
1. Product → Clean Build Folder (`⌘ + Shift + K`)
2. Try building again
3. Check error messages in Issue Navigator (left panel)
4. Ensure all Swift files are added to target

### "App crashes on launch"

**Solution:**
1. Check crash logs in Xcode console (bottom panel)
2. Verify all files are properly added to target
3. Clean build folder and rebuild
4. Try on different simulator/device

## 📱 App Usage Guide

### First Time Setup

1. **Launch App** → Settings screen if no config
2. **Tap Gear Icon** → Enter Azure credentials
3. **Save Configuration**
4. **Grant Microphone Permission** when prompted

### Starting a Conversation

1. Tap green **"Start Conversation"** button
2. Wait for "Connected" status
3. Speak into your device microphone
4. AI assistant responds with voice

### During Conversation

- **Your speech** appears in blue bubbles (right side)
- **Assistant speech** appears in gray bubbles (left side)
- **Interrupt assistant** by speaking (audio stops)
- Transcripts update in real-time

### Stopping a Conversation

1. Tap red **"Stop Conversation"** button
2. Transcripts remain visible
3. Audio stops immediately

## 🔒 Security & Privacy

- Azure credentials stored in UserDefaults
- No third-party data collection
- Microphone permission required
- Network permission for Azure connection
- All data encrypted in transit (WSS)

## 📊 App Architecture

```
VoiceLiveApp (SwiftUI)
├── Views
│   ├── ContentView (Main screen)
│   ├── SettingsView (Configuration)
│   └── Components (UI components)
├── Managers
│   ├── AudioManager (Recording & Playback)
│   ├── WebSocketManager (Azure API)
│   └── ConfigManager (Settings storage)
└── Models
    ├── ChatMessage
    ├── AzureConfig
    └── MessageSender
```

## 🎯 Key Technologies

- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **Audio:** AVFoundation (AVAudioEngine, AVAudioPlayer)
- **Networking:** URLSession WebSocket
- **Storage:** UserDefaults
- **Architecture:** MVVM with ObservableObject

## 📦 Dependencies

**None!** This app uses only native iOS frameworks:
- SwiftUI (UI)
- AVFoundation (Audio)
- Foundation (Core)
- Combine (Reactive)

No third-party packages required!

## 🔧 Build Configuration

- **Min iOS Version:** 16.0
- **Target iOS Version:** 17.0
- **Xcode Version:** 14.0+
- **Swift Version:** 5.9+
- **Supported Devices:** iPhone, iPad
- **Orientations:** Portrait (primary)

## 📝 Important Notes for Windows Users

**❌ YOU CANNOT BUILD THIS APP ON WINDOWS!**

iOS development requires:
- **macOS** operating system
- **Xcode** (Mac-only software)
- **Apple Developer tools** (Mac-only)

### Options if You Don't Have a Mac:

1. **Use a Mac at school/library/work**
2. **Rent a Mac in the Cloud:**
   - MacStadium: https://www.macstadium.com/
   - MacinCloud: https://www.macincloud.com/
   - AWS EC2 Mac instances
3. **Buy a Mac:**
   - Mac Mini (cheapest option, ~$599)
   - MacBook Air (portable, ~$999)
4. **Use Hackintosh** (not recommended, against Apple TOS)
5. **Use Cross-Platform Alternative:**
   - React Native (can develop on Windows)
   - Flutter (can develop on Windows)
   - But these require different codebase

## 🆘 Getting Help

### Apple Resources
- [Xcode Documentation](https://developer.apple.com/documentation/xcode)
- [SwiftUI Tutorials](https://developer.apple.com/tutorials/swiftui)
- [Apple Developer Forums](https://developer.apple.com/forums/)

### Learning Resources
- [Swift Playgrounds](https://www.apple.com/swift/playgrounds/) (iPad app for learning)
- [Hacking with Swift](https://www.hackingwithswift.com/) (free tutorials)
- [Swift.org](https://swift.org/documentation/)

### Video Tutorials
- Search YouTube: "Xcode for beginners"
- Search YouTube: "SwiftUI tutorial"
- Apple's WWDC videos

## 📄 License

This project is based on the Voice Live API AI Foundry Agents web application.

---

**Ready to start! 🚀**

**Remember: You MUST use a Mac computer with Xcode installed!**

For complete beginners, see: `QUICKSTART_IOS.md`
