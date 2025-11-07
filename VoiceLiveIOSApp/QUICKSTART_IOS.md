# Quick Start Guide - Voice Live iOS App

## ⚠️ **CRITICAL: Mac Computer Required!**

**You CANNOT develop iOS apps on Windows!**

### What You Absolutely Need:
1. ✅ **Mac computer** (MacBook, iMac, Mac Mini, Mac Pro)
2. ✅ **macOS 12.0 or later**
3. ✅ **Xcode** (free from Mac App Store)
4. ✅ **Apple ID** (free)
5. ✅ **Internet connection**

### If You Don't Have a Mac:
- ❌ **Windows cannot run Xcode**
- ❌ **Linux cannot run Xcode**
- ⚠️ See README.md for alternatives (cloud Mac rental, etc.)

---

## 🎯 Complete Setup (60-90 minutes)

### Part 1: Install Xcode (60 minutes)

**⚠️ First Time Only - Large Download!**

1. **Open Mac App Store** on your Mac
   - Click the Apple menu → App Store
   - Or click App Store icon in Dock

2. **Search for "Xcode"**
   - Type "Xcode" in search box
   - Click on "Xcode" (by Apple)

3. **Download & Install**
   - Click "Get" or "Install" button
   - Enter your Apple ID password if prompted
   - ☕ **Wait 30-60 minutes** (12-15 GB download)
   - Let it finish completely

4. **First Launch**
   - Open "Xcode" from Applications folder
   - **Click "Accept"** on license agreement
   - **Click "Agree"**
   - **Enter your password** to install components
   - ☕ **Wait 10-15 minutes** for additional tools

5. **Verify Installation**
   - Open **Terminal** app (Applications → Utilities → Terminal)
   - Type: `xcode-select --version`
   - Press Enter
   - You should see: `xcode-select version 2XXX` or similar

✅ **Xcode is now installed!**

---

### Part 2: Open the iOS Project (5 minutes)

1. **Launch Xcode** from Applications folder

2. **Welcome Screen appears**
   - Click **"Open a project or file"**

3. **Navigate to project:**
   - Find: `VoiceLiveIOSApp` folder
   - Open: `VoiceLiveApp.xcodeproj` file
   - Click **"Open"**

4. **Wait for project to load**
   - You'll see files appear in left panel
   - Wait for indexing to complete (bottom status bar)
   - ☕ **First time takes 2-3 minutes**

✅ **Project is now open!**

---

### Part 3: Set Up Your Apple ID (5 minutes)

**Required for running on real devices**

1. **Open Xcode Preferences**
   - Click **"Xcode"** menu → **"Settings..."** (or Preferences)
   - Or press `⌘ + ,` (Command + Comma)

2. **Go to Accounts Tab**
   - Click **"Accounts"** at the top

3. **Add Your Apple ID**
   - Click **"+"** button at bottom left
   - Select **"Apple ID"**
   - Enter your Apple ID email
   - Enter your password
   - Click **"Next"**

4. **Verify Account**
   - Your account appears in list
   - Shows "Personal Team" or your name
   - Click "Download Manual Profiles" if shown

✅ **Apple ID configured!**

---

### Part 4: Choose Testing Method (Pick ONE)

#### **Option A: iOS Simulator (Easier)**

**✅ Best for beginners - No device needed!**

1. **At top of Xcode window:**
   - Look for device selector (next to "VoiceLiveApp")
   - Click it

2. **Select a Simulator:**
   - Choose **"iPhone 15 Pro"** (recommended)
   - Or **"iPhone 14"**
   - Or any iPhone model you prefer

3. **Done!** You're ready to run

#### **Option B: Real iPhone/iPad**

**✅ Better performance, uses real microphone**

1. **Connect your iPhone/iPad to Mac**
   - Use Lightning or USB-C cable
   - Unlock your device

2. **Trust your Mac (on device):**
   - Popup appears: **"Trust This Computer?"**
   - Tap **"Trust"**
   - Enter device passcode if asked

3. **Select device in Xcode:**
   - Click device selector at top
   - Your device appears in list
   - Select it (shows your device name)

4. **Configure Code Signing:**
   - In Xcode left panel, click blue **"VoiceLiveApp"** icon
   - Click **"VoiceLiveApp"** under TARGETS
   - Click **"Signing & Capabilities"** tab
   - ✅ Check **"Automatically manage signing"**
   - **Team:** Select your Apple ID
   - Should show "✓ Signing Certificate"

5. **First Run on Device:**
   - App will install
   - Device shows "Untrusted Developer"
   - **On device:** Settings → General → VPN & Device Management
   - Tap your developer profile
   - Tap **"Trust [Your Name]"**
   - Return to app

✅ **Device configured!**

---

### Part 5: Run the App (5 minutes)

1. **Click the Play Button ▶️**
   - Big triangle button at top left
   - Or press `⌘ + R` (Command + R)

2. **Watch Build Progress**
   - Top of Xcode shows progress
   - "Building VoiceLiveApp..."
   - ☕ **First build: 3-5 minutes**
   - **Next builds: 30-60 seconds**

3. **App Launches!**
   - **Simulator:** Window pops up with iPhone
   - **Device:** App opens on your device
   - You should see the Voice Live interface

✅ **App is running!**

---

### Part 6: Configure Azure (5 minutes)

1. **In the app, tap the gear icon ⚙️**
   - Top right corner

2. **Enter Azure Credentials:**

   Open your `.env` file and copy these values:

   - **Azure Endpoint:**
     - From `.env`: `AZURE_VOICE_LIVE_ENDPOINT`
     - Example: `https://your-project.ai.azure.com`

   - **Agent ID:**
     - From `.env`: `AI_FOUNDRY_AGENT_ID`
     - Example: `agent-xxxxx`

   - **Project Name:**
     - From `.env`: `AI_FOUNDRY_PROJECT_NAME`
     - Example: `my-project`

   - **API Version:**
     - Leave as: `2025-10-01`

3. **Tap "Save Configuration"**

4. **Tap "Done"**

✅ **Configuration saved!**

---

### Part 7: Test Voice Conversation (2 minutes)

1. **Grant Microphone Permission**
   - Popup appears: "Would like to access the microphone"
   - Tap **"Allow"**

2. **Start Conversation**
   - Tap green **"Start Conversation"** button
   - Status changes to "Connecting..."
   - Then "Active"

3. **Talk to the AI**
   - **Say:** "Hello, can you help me?"
   - Your speech appears in blue bubble
   - AI responds with voice and text in gray bubble

4. **Stop When Done**
   - Tap red **"Stop Conversation"** button

✅ **Success! You're talking to AI! 🎉**

---

## 🎊 Congratulations!

You've successfully:
- ✅ Installed Xcode on your Mac
- ✅ Opened the iOS project
- ✅ Set up your Apple ID
- ✅ Built and ran the app
- ✅ Connected to Azure AI
- ✅ Had a voice conversation with the AI assistant

---

## 🆘 Quick Fixes

### "No signing certificate"
→ Xcode → Settings → Accounts → Add your Apple ID

### "Build failed"
→ Product menu → Clean Build Folder → Try again

### "Simulator won't start"
→ Xcode menu → Open Developer Tool → Simulator
→ Then run app again from Xcode

### "Can't hear AI voice"
→ Check Mac/iPhone volume
→ Ensure not muted
→ Check Mac System Preferences → Sound

### "Microphone not working"
→ Mac System Preferences → Security → Microphone
→ Enable for Xcode and Simulator

### "App not on device"
→ Trust developer profile in Settings
→ Settings → General → VPN & Device Management

---

## 🎯 What's Next?

Now that you have the app running, you can:
- Customize the greeting message
- Modify the UI colors and design  
- Add new features
- Test different conversation scenarios

---

## 📚 Need More Help?

- **Full Documentation:** See `README.md` in VoiceLiveIOSApp folder
- **Xcode Help:** Xcode menu → Help → Xcode Help
- **Video Tutorials:** Search YouTube for "Xcode for beginners"
- **Apple Tutorials:** https://developer.apple.com/tutorials/swiftui

---

## ⏱️ Time Summary

- Xcode installation: 60 minutes (first time only)
- Project setup: 15 minutes (first time only)
- Testing: 5 minutes
- **Total first time:** 80 minutes
- **Subsequent runs:** 5 minutes

---

## 📱 Using Simulator vs Real Device

### iOS Simulator:
- ✅ Free, no device needed
- ✅ Fast switching between devices
- ✅ Uses Mac's microphone
- ⚠️ Slightly slower than real device
- ⚠️ Some features limited

### Real iPhone/iPad:
- ✅ True performance
- ✅ Real microphone quality
- ✅ Better audio playback
- ✅ Test exact user experience
- ⚠️ Requires cable connection (first time)
- ⚠️ Need to trust developer profile

**Recommendation:** Start with simulator, test on real device later!

---

## 🔄 Running the App Again (After First Setup)

Next time it's much faster:

1. **Open Xcode** (already installed ✅)
2. **Open recent project** (shows in welcome screen)
3. **Select device/simulator**
4. **Click Run ▶️**
5. **Wait ~30 seconds** for build
6. **App launches!**

That's it! No setup needed again! 🎉

---

## 💡 Pro Tips

1. **Xcode Shortcuts:**
   - `⌘ + R` = Run app
   - `⌘ + .` = Stop app
   - `⌘ + Shift + K` = Clean build
   - `⌘ + B` = Build only

2. **Simulator Shortcuts:**
   - `⌘ + Shift + H` = Home button
   - `⌘ + Shift + H` twice = App switcher
   - `⌘ + ←/→` = Rotate device
   - `⌘ + S` = Screenshot

3. **Debugging:**
   - Click bottom panel to see console logs
   - Errors show in left panel with red icon
   - Build progress shows at top

---

**You're all set! Happy iOS development! 🚀📱**

Remember: iOS development requires a Mac - no way around it!
