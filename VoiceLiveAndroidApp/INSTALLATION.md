# Voice Live Android App - Missing Components Installer

## 🔍 What You Need to Install

This guide helps you install any missing components for Android development.

---

## ✅ Checklist: Do You Have These Installed?

### 1. Android Studio
- **Status:** ⬜ Not Installed / ✅ Installed
- **Download:** https://developer.android.com/studio
- **Size:** ~1 GB download
- **Installation Time:** 10-15 minutes
- **Required:** ✅ YES - This is essential

### 2. Java Development Kit (JDK) 17
- **Status:** Usually included with Android Studio
- **Download (if needed):** https://adoptium.net/
- **Required:** ✅ YES - But Android Studio includes it

### 3. Android SDK
- **Status:** Installed with Android Studio
- **Location:** Tools → SDK Manager in Android Studio
- **Required:** ✅ YES - Auto-installed

### 4. Android Emulator (Virtual Device)
- **Status:** Created in Android Studio
- **Setup:** Tools → Device Manager → Create Device
- **Required:** ⚠️ OPTIONAL - But recommended for testing

---

## 📥 Installation Instructions

### Installing Android Studio

#### Windows:
1. Visit: https://developer.android.com/studio
2. Click green "Download Android Studio" button
3. Accept terms and click Download
4. Run the `.exe` file
5. Follow installation wizard
6. Default options are fine - just keep clicking "Next"
7. Installation takes 10-15 minutes

#### Mac:
1. Visit: https://developer.android.com/studio
2. Click "Download Android Studio" button
3. Open the downloaded `.dmg` file
4. Drag Android Studio to Applications folder
5. Open Android Studio from Applications
6. Follow first-time setup wizard

#### Linux (Ubuntu/Debian):
```bash
# Download from website or use snap
sudo snap install android-studio --classic

# Or download .tar.gz and extract
# Then run: ./android-studio/bin/studio.sh
```

---

## 🔧 Setting Up Android SDK

After installing Android Studio:

1. **Open Android Studio**
2. Click **"More Actions"** → **"SDK Manager"**
3. In **"SDK Platforms"** tab:
   - ✅ Check "Android 14.0 (UpsideDownCake)" - API 34
   - ✅ Check "Android 8.0 (Oreo)" - API 26
   - Click **"Apply"** to install
   
4. In **"SDK Tools"** tab:
   - ✅ Check "Android SDK Build-Tools"
   - ✅ Check "Android Emulator"
   - ✅ Check "Android SDK Platform-Tools"
   - ✅ Check "Intel x86 Emulator Accelerator (HAXM)" (Windows/Mac Intel)
   - Click **"Apply"** to install

5. Wait for downloads to complete (10-20 minutes)

---

## 📱 Creating Android Emulator

1. **Open Android Studio**
2. Click **"More Actions"** → **"Device Manager"**
3. Click **"Create Device"** button
4. **Phone Selection:**
   - Choose **"Pixel 6"** (recommended)
   - Or **"Pixel 5"** for slower computers
   - Click **"Next"**

5. **System Image:**
   - Select **"UpsideDownCake"** (API 34) or **"Tiramisu"** (API 33)
   - Click **"Download"** if not already downloaded
   - Wait for download (5-10 minutes)
   - Click **"Next"**

6. **AVD Configuration:**
   - Name: Keep default or name it "Test Phone"
   - Click **"Show Advanced Settings"** if you want to:
     - Increase RAM (2048 MB recommended)
     - Enable hardware keyboard
   - Click **"Finish"**

---

## 🔌 Optional: Using Physical Android Device

If you don't want to use an emulator, you can use your real Android phone:

### Requirements:
- Android 8.0 or newer
- USB cable
- USB debugging enabled

### Setup Steps:

1. **On Your Phone:**
   - Go to **Settings** → **About Phone**
   - Tap **"Build Number"** 7 times
   - You'll see "You are now a developer!"
   - Go back to **Settings** → **System** → **Developer Options**
   - Turn on **"USB Debugging"**
   - Turn on **"Install via USB"** (if available)

2. **Connect to Computer:**
   - Plug phone into computer via USB
   - On phone, tap **"Allow"** when prompted about USB debugging
   - Select **"File Transfer"** or **"PTP"** mode

3. **Verify in Android Studio:**
   - In Android Studio, look at device dropdown (near Run button)
   - Your phone should appear in the list
   - If not, try:
     - Unplugging and replugging USB cable
     - Restarting Android Studio
     - Installing phone's USB driver (Windows only)

---

## 🌐 Internet Requirements

### Required for:
- ✅ Downloading Android Studio
- ✅ Downloading Android SDK components
- ✅ Gradle sync (first time)
- ✅ Running the Voice Live app (connects to Azure)

### Downloads Summary:
- Android Studio: ~1 GB
- Android SDK: ~3-4 GB
- Gradle dependencies: ~500 MB
- **Total:** ~5-6 GB

### Bandwidth Tips:
- Use a stable WiFi connection
- Downloads take 30-60 minutes on average connection
- Some downloads can be paused and resumed

---

## ❓ Frequently Asked Questions

### Q: Do I need to install anything else besides Android Studio?
**A:** No! Android Studio includes everything you need (JDK, SDK, Gradle).

### Q: Can I use an older version of Android Studio?
**A:** We recommend the latest version, but Android Studio 2023.1.1 or newer should work.

### Q: My computer is slow. Can I still develop Android apps?
**A:** Yes, but:
- Use a physical device instead of emulator
- Close other heavy applications
- Increase computer RAM if possible (8GB minimum, 16GB recommended)

### Q: Do I need to install Kotlin separately?
**A:** No! Kotlin is built into Android Studio.

### Q: Can I develop on a Chromebook?
**A:** Limited support. Android Studio on Chrome OS requires:
- Chromebook with Linux (Beta) enabled
- At least 8GB RAM
- Intel/AMD processor (not ARM)

### Q: The emulator is very slow. What can I do?
**A:**
1. Use a physical device instead
2. Reduce emulator screen resolution
3. Reduce emulator RAM allocation
4. Enable Hardware Acceleration (HAXM)
5. Close other applications

---

## 🔍 Verifying Your Installation

Run this checklist after installation:

```
✅ Android Studio opens without errors
✅ SDK Manager shows installed SDKs
✅ Device Manager shows at least one device (virtual or physical)
✅ Can create a new "Empty Activity" project
✅ Can run the new project on emulator/device
```

---

## 🆘 Installation Problems?

### "Android Studio won't start"
- **Windows:** Run as Administrator
- **Mac:** Allow in Security & Privacy settings
- **All:** Check if JDK is installed (should be auto-included)

### "SDK download fails"
- Check internet connection
- Try changing SDK download proxy: File → Settings → Appearance & Behavior → System Settings → HTTP Proxy

### "Emulator won't start"
- Check if virtualization is enabled in BIOS (VT-x/AMD-V)
- Install HAXM (Intel) or Hypervisor (AMD)
- Try reducing emulator performance settings

### "Gradle sync fails"
- Check internet connection (Gradle needs to download dependencies)
- Try: File → Invalidate Caches → Restart
- Delete `.gradle` folder in project and sync again

---

## 📞 Getting Help

### Official Resources:
- **Android Studio Setup:** https://developer.android.com/studio/install
- **Troubleshooting:** https://developer.android.com/studio/troubleshoot
- **Community Forum:** https://stackoverflow.com/questions/tagged/android-studio

### YouTube Tutorials:
- Search: "Android Studio installation [YOUR_OS]"
- Search: "Setting up Android emulator"

---

## ✅ Final Checklist

Before opening the Voice Live Android project, ensure:

- [ ] Android Studio is installed and opens successfully
- [ ] SDK Manager shows Android SDK 26 and 34 installed
- [ ] At least one Android Virtual Device is created OR physical device is connected
- [ ] Gradle is working (test with new empty project)
- [ ] Internet connection is available

**All checked?** You're ready to open the Voice Live Android App! 🎉

Proceed to `QUICKSTART.md` for next steps.

---

**Installation Time Estimate:**
- Fast computer + good internet: 30-45 minutes
- Average computer/internet: 1-2 hours
- First-time users: Allow 2-3 hours for learning

**Disk Space Required:**
- Android Studio: 1 GB
- Android SDK: 4-5 GB
- Project + Dependencies: 1 GB
- **Total:** 6-7 GB free space needed
