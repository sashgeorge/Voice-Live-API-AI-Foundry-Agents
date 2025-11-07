# Voice Live Android App

Android application for real-time voice conversations with Azure Voice Live API and AI Foundry Agents.

## 📱 Features

- ✅ Real-time voice conversations with AI assistant
- ✅ Live transcript display
- ✅ Speech interruption support
- ✅ Modern Material Design 3 UI
- ✅ Microphone audio capture (24kHz PCM16)
- ✅ Real-time audio playback
- ✅ WebSocket communication with Azure
- ✅ Secure configuration storage

## 🔧 Prerequisites

### Required Software

1. **Android Studio** (Latest version recommended)
   - Download from: https://developer.android.com/studio
   - Minimum version: Android Studio Hedgehog (2023.1.1) or newer

2. **Java Development Kit (JDK) 17**
   - Included with Android Studio
   - Or download from: https://adoptium.net/

3. **Android SDK**
   - API Level 26 (Android 8.0) or higher
   - Installed automatically with Android Studio

### Azure Requirements

- Azure AI Foundry project with an AI agent
- Azure Voice Live API endpoint
- Valid Azure credentials

## 🚀 Setup Instructions

### Step 1: Install Android Studio

1. Download Android Studio from https://developer.android.com/studio
2. Run the installer
3. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (for emulator)
4. Complete the setup wizard

### Step 2: Configure Android SDK

1. Open Android Studio
2. Go to **Tools** → **SDK Manager**
3. In **SDK Platforms** tab, ensure these are installed:
   - Android 14.0 (API 34) ✓ (recommended)
   - Android 8.0 (API 26) ✓ (minimum required)
4. In **SDK Tools** tab, ensure these are installed:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools
5. Click **Apply** to install missing components

### Step 3: Create Android Virtual Device (Emulator)

1. In Android Studio, go to **Tools** → **Device Manager**
2. Click **Create Device** button
3. Select a device definition (recommended: **Pixel 6**)
4. Click **Next**
5. Select a system image:
   - **Recommended:** API 34 (Android 14.0)
   - Download if not already installed
6. Click **Next**, then **Finish**
7. Your emulator is now ready!

### Step 4: Open the Android Project

1. Launch Android Studio
2. Select **Open** from the welcome screen
3. Navigate to: `VoiceLiveAndroidApp` folder
4. Click **OK**
5. Wait for Gradle sync to complete (this may take a few minutes first time)
6. If prompted, accept any SDK licenses

### Step 5: Configure Your Azure Credentials

You have two options:

#### Option A: Configure in the App (Recommended)

1. Run the app (see Step 6)
2. When app launches, it will prompt you to configure settings
3. Click **Settings** button
4. Enter your Azure credentials:
   - **Azure Endpoint**: Your AI Foundry endpoint (e.g., `https://your-project.ai.azure.com`)
   - **Agent ID**: Your AI Foundry agent ID
   - **Project Name**: Your AI Foundry project name
   - **API Version**: Keep default `2025-10-01`
5. Click **Save Configuration**

#### Option B: Use .env File (for local reference)

Create a file `.env` in the project root with:
```
AZURE_VOICE_LIVE_ENDPOINT=https://your-endpoint.ai.azure.com
AI_FOUNDRY_AGENT_ID=your-agent-id
AI_FOUNDRY_PROJECT_NAME=your-project-name
AZURE_VOICE_LIVE_API_VERSION=2025-10-01
```

## 🧪 Testing the Application

### Method 1: Using Android Emulator (Recommended for Beginners)

1. **Start the Emulator:**
   - In Android Studio, click the **Device Manager** icon
   - Click the ▶️ (play) button next to your virtual device
   - Wait for the emulator to boot up (takes 30-60 seconds)

2. **Run the App:**
   - In Android Studio, click the green ▶️ **Run** button (or press `Shift+F10`)
   - Select your running emulator from the device list
   - Click **OK**
   - The app will build and install (first time takes 2-3 minutes)

3. **Test Voice Conversation:**
   - When app opens, tap **Settings** (gear icon)
   - Enter your Azure credentials
   - Tap **Save Configuration**
   - Tap **Start Conversation** button
   - Grant microphone permission when prompted
   - Speak into your computer's microphone
   - The AI assistant will respond with voice and text

### Method 2: Using Physical Android Device

1. **Enable Developer Mode on Your Phone:**
   - Go to **Settings** → **About Phone**
   - Tap **Build Number** 7 times
   - Developer options are now enabled!

2. **Enable USB Debugging:**
   - Go to **Settings** → **System** → **Developer Options**
   - Turn on **USB Debugging**
   - Turn on **Install via USB**

3. **Connect Your Phone:**
   - Connect phone to computer via USB cable
   - On phone, allow USB debugging when prompted
   - Select **File Transfer** or **PTP** mode

4. **Run the App:**
   - In Android Studio, your phone should appear in device list
   - Click green ▶️ **Run** button
   - Select your phone
   - App will install and launch

5. **Test Voice:**
   - Configure Azure settings
   - Tap **Start Conversation**
   - Speak to test voice interaction

### Method 3: Using Wireless Debugging (Android 11+)

1. **Connect Phone to Same WiFi as Computer**

2. **Enable Wireless Debugging:**
   - Settings → Developer Options → Wireless Debugging
   - Turn on **Wireless Debugging**
   - Tap **Pair device with pairing code**

3. **Pair in Android Studio:**
   - Go to **Tools** → **Device Manager**
   - Click **Pair using Wi-Fi**
   - Enter the pairing code from your phone
   - Device will connect

4. **Run the App** (same as Method 2, step 4-5)

## 🐛 Troubleshooting

### Issue: Gradle Sync Failed

**Solution:**
1. Go to **File** → **Invalidate Caches** → **Invalidate and Restart**
2. Wait for Android Studio to restart
3. Try opening the project again

### Issue: Emulator is Slow

**Solution:**
1. Close other heavy applications
2. Increase emulator RAM:
   - Tools → Device Manager
   - Edit your virtual device (pencil icon)
   - Show Advanced Settings → RAM: 2048 MB or more
3. Enable Hardware Acceleration:
   - Tools → SDK Manager → SDK Tools
   - Install "Intel x86 Emulator Accelerator (HAXM)" or "Android Emulator Hypervisor Driver"

### Issue: App Crashes on Start

**Solution:**
1. Check Logcat (bottom panel in Android Studio)
2. Look for red error messages
3. Common fixes:
   - Clean project: **Build** → **Clean Project**
   - Rebuild: **Build** → **Rebuild Project**
   - Sync Gradle: **File** → **Sync Project with Gradle Files**

### Issue: Microphone Permission Denied

**Solution:**
1. Uninstall the app from emulator/device
2. Reinstall and test again
3. On emulator, microphone uses your computer's mic

### Issue: No Audio Playback

**Solution:**
1. On emulator: Check computer's volume
2. On device: Check phone's volume
3. Make sure app has microphone permission
4. Verify Azure credentials are correct

### Issue: Cannot Connect to Azure

**Solution:**
1. Verify your Azure endpoint is correct
2. Check internet connection
3. Ensure Azure agent is running
4. Verify Agent ID and Project Name are correct
5. Check Azure authentication token (may need to implement proper auth)

## 📱 App Usage Guide

### First Time Setup

1. **Launch App** → Settings prompt appears
2. **Tap Settings** → Enter Azure credentials
3. **Save Configuration**
4. **Grant Microphone Permission** when prompted

### Starting a Conversation

1. Tap green **"Start Conversation"** button
2. Wait for "Connected" status
3. Speak naturally into the microphone
4. AI assistant will respond with voice

### During Conversation

- **Your speech** appears in blue bubbles (right side)
- **Assistant speech** appears in gray bubbles (left side)
- **Interrupt the assistant** by speaking (audio playback stops)
- Transcripts update in real-time

### Stopping a Conversation

1. Tap red **"Stop Conversation"** button
2. All transcripts remain visible
3. Audio recording and playback stop

## 🔒 Security Notes

- Azure credentials are stored locally in encrypted SharedPreferences
- No credentials are sent to third parties
- Microphone permission is required for voice input
- Internet permission is required for Azure connection

## 📊 App Architecture

```
VoiceLiveAndroidApp/
├── app/
│   ├── src/main/
│   │   ├── java/com/verizon/voiceliveapp/
│   │   │   ├── MainActivity.kt              # Main UI and logic
│   │   │   ├── ConfigActivity.kt            # Settings screen
│   │   │   ├── models/
│   │   │   │   ├── ChatMessage.kt           # Message data model
│   │   │   │   └── AzureConfig.kt           # Config data model
│   │   │   ├── network/
│   │   │   │   └── VoiceLiveWebSocketClient.kt  # WebSocket client
│   │   │   ├── audio/
│   │   │   │   ├── AudioRecorder.kt         # Microphone capture
│   │   │   │   └── AudioPlayer.kt           # Audio playback
│   │   │   ├── ui/
│   │   │   │   └── MessagesAdapter.kt       # Chat UI adapter
│   │   │   └── utils/
│   │   │       └── ConfigManager.kt         # Config storage
│   │   ├── res/
│   │   │   ├── layout/                      # UI layouts
│   │   │   ├── values/                      # Strings, colors
│   │   │   └── drawable/                    # Icons
│   │   └── AndroidManifest.xml
│   └── build.gradle
├── build.gradle
└── settings.gradle
```

## 🎯 Key Technologies

- **Language:** Kotlin
- **UI Framework:** Material Design 3
- **Audio:** Android AudioRecord/AudioTrack
- **Networking:** OkHttp WebSocket
- **Async:** Kotlin Coroutines
- **Architecture:** MVVM-like pattern

## 📦 Dependencies

- androidx.core:core-ktx:1.12.0
- androidx.appcompat:appcompat:1.6.1
- com.google.android.material:material:1.11.0
- androidx.constraintlayout:constraintlayout:2.1.4
- org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3
- com.squareup.okhttp3:okhttp:4.12.0
- com.google.code.gson:gson:2.10.1
- com.azure:azure-identity:1.11.1

## 🔧 Build Configuration

- **Min SDK:** 26 (Android 8.0)
- **Target SDK:** 34 (Android 14)
- **Compile SDK:** 34
- **JDK Version:** 17
- **Kotlin Version:** 1.9.20
- **Gradle Version:** 8.1.4

## 📝 Additional Resources

### Android Development

- [Android Studio User Guide](https://developer.android.com/studio/intro)
- [Android Developers Documentation](https://developer.android.com/docs)
- [Kotlin Documentation](https://kotlinlang.org/docs/home.html)

### Azure Integration

- [Azure AI Foundry Documentation](https://learn.microsoft.com/azure/ai-studio/)
- [Azure Voice Live API](https://learn.microsoft.com/azure/ai-services/speech-service/)

### Troubleshooting

- [Android Studio Troubleshooting](https://developer.android.com/studio/troubleshoot)
- [Emulator Issues](https://developer.android.com/studio/run/emulator-troubleshooting)

## 🤝 Support

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Review Android Studio's **Logcat** for error messages
3. Verify your Azure configuration
4. Ensure all prerequisites are installed

## 📄 License

This project is based on the Voice Live API AI Foundry Agents web application and adapted for Android.

---

**Happy Testing! 🎉**

For questions about the parent web application, visit: https://github.com/sashgeorge/Voice-Live-API-AI-Foundry-Agents
