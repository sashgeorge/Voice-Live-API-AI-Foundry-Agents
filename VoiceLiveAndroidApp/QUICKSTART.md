# Quick Start Guide - Voice Live Android App

## ⚡ For Complete Beginners

### What You Need

1. **A Computer** (Windows, Mac, or Linux)
2. **Internet Connection** (for downloading tools and connecting to Azure)
3. **Azure Account** with AI Foundry project setup

---

## 🎯 Step-by-Step Setup (30-45 minutes)

### Part 1: Install Android Studio (15 minutes)

1. **Go to:** https://developer.android.com/studio
2. **Click:** Download Android Studio button
3. **Run the installer** you just downloaded
4. **During installation:**
   - ✅ Check "Android SDK"
   - ✅ Check "Android Virtual Device"
   - ✅ Click "Next" through all screens
5. **Wait** for installation to complete (10-15 minutes)
6. **Launch Android Studio** when done

### Part 2: Create Your Virtual Phone (10 minutes)

1. In Android Studio welcome screen:
   - Click **"More Actions"** → **"Virtual Device Manager"**
   
2. Click **"Create Device"** button

3. Select a phone:
   - Choose **"Pixel 6"** (recommended)
   - Click **"Next"**

4. Download Android System:
   - Select **"UpsideDownCake"** (API 34) or latest available
   - Click **"Download"** next to it
   - Wait for download (5-10 minutes)
   - Click **"Finish"** when done

5. Create the virtual device:
   - Click **"Next"**
   - Click **"Finish"**
   - You now have a virtual phone! 📱

### Part 3: Open the Android App Project (5 minutes)

1. In Android Studio welcome screen:
   - Click **"Open"**

2. Navigate to your project:
   - Find: `C:\Users\sashk\Desktop\AI\Verizon\Voice-Live-API-AI-Foundry-Agents-main\VoiceLiveAndroidApp`
   - Click **"OK"**

3. Wait for project to load:
   - You'll see "Gradle Sync" running at the bottom
   - This takes 3-5 minutes first time
   - When done, you'll see "Gradle Build Finished" ✅

### Part 4: Run the App (5 minutes)

1. **Start your virtual phone:**
   - Look for device dropdown at top (near green ▶️ button)
   - Select your "Pixel 6" device
   - Wait 30-60 seconds for phone to start

2. **Run the app:**
   - Click the green ▶️ **Run** button at top
   - Or press `Shift + F10`
   - Wait 1-2 minutes for app to build and install

3. **App launches!** You should see the Voice Live interface 🎉

### Part 5: Configure Azure (5 minutes)

1. **In the app, tap the gear icon** (⚙️) at top right

2. **Fill in these fields:**
   - **Azure Endpoint:** 
     - Find this in your `.env` file
     - Looks like: `https://your-project.ai.azure.com`
   
   - **Agent ID:**
     - Also in your `.env` file
     - Looks like: `agent-xxxxxx`
   
   - **Project Name:**
     - Also in your `.env` file
     - Your AI Foundry project name
   
   - **API Version:**
     - Leave as: `2025-10-01`

3. **Tap "Save Configuration"**

4. **Tap the back arrow** to return to main screen

### Part 6: Test Voice Conversation! (2 minutes)

1. **Grant Microphone Permission:**
   - When prompted, click **"Allow"**
   - This lets the app use your computer's microphone

2. **Start Conversation:**
   - Tap the green **"Start Conversation"** button
   - Wait for status to change to "Active"

3. **Talk to the AI:**
   - Speak into your computer's microphone
   - Say: "Hello, can you help me?"
   - You'll see your speech transcribed in blue
   - The AI will respond with voice and text in gray

4. **Stop when done:**
   - Tap the red **"Stop Conversation"** button

---

## 🎊 Congratulations!

You've successfully:
- ✅ Installed Android Studio
- ✅ Created a virtual Android device
- ✅ Built and ran the Voice Live app
- ✅ Connected to Azure AI
- ✅ Had a voice conversation with the AI assistant

---

## 🆘 Quick Fixes

### "Gradle Sync Failed"
→ Go to **File** → **Invalidate Caches** → **Invalidate and Restart**

### "Emulator is too slow"
→ Close other programs, especially browsers and heavy apps

### "No sound from AI"
→ Check your computer's volume, ensure it's not muted

### "Can't connect to Azure"
→ Double-check your Azure credentials in Settings

### "Build Failed"
→ Go to **Build** → **Clean Project**, then try running again

---

## 📱 Using a Real Phone Instead?

1. **On your Android phone:**
   - Settings → About Phone
   - Tap "Build Number" 7 times (enables Developer Mode)
   - Go back → System → Developer Options
   - Turn on "USB Debugging"

2. **Connect phone to computer with USB cable**

3. **In Android Studio:**
   - Your phone will appear in device list
   - Select it and click Run

4. **On phone, tap "Allow" when prompted**

---

## 🎯 What's Next?

Now that you have the app running, you can:
- Customize the greeting message
- Modify the UI colors
- Add new features
- Test different scenarios

---

## 📚 Need More Help?

- **Full Documentation:** See `README.md` in the VoiceLiveAndroidApp folder
- **Android Studio Help:** Help → Help Topics
- **Video Tutorials:** Search YouTube for "Android Studio beginner tutorial"

---

**You're ready to go! 🚀**

Enjoy your AI voice assistant app!
