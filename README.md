# HubSpot Chat App — Setup Guide

## What This App Does
- Login screen captures: Name, Email, Restaurant Name
- Automatically passes all details to HubSpot before chat opens
- Agent sees full customer context instantly
- Uses HubSpot's official Mobile Chat SDK (no WebView)

## HubSpot Config
- Portal ID: 244508708
- Hublet: na2
- Environment: prod
- Chat Flow: wer3tgyhjiuk

---

## How to Build (No Local Tools Needed — Uses GitHub Codespaces)

### Step 1 — Push to GitHub
1. Create a new repo on github.com
2. Upload ALL files from this folder

### Step 2 — Open GitHub Codespaces
1. In your repo click the green "Code" button
2. Click "Codespaces" tab
3. Click "Create codespace on main"
4. Wait for it to load (takes ~1 min)

### Step 3 — Install Dependencies
In the Codespaces terminal run:
```
npm install
npm install -g eas-cli
eas login
```

### Step 4 — Build Android APK
```
eas build --platform android --profile preview
```
This builds in the cloud and gives you a download link for the APK.
Send the APK to Android testers — they install it directly.

### Step 5 — Build iOS IPA
```
eas build --platform ios --profile preview
```
This builds in the cloud.
For iOS testing without App Store, testers need to be added to your Apple Developer account.

---

## How to Test
1. Install the app on your phone
2. Enter your name, email, and restaurant name on the login screen
3. Tap "Open Support Chat"
4. HubSpot chat opens natively
5. In HubSpot Help Desk, the agent will see:
   - Your name
   - Your email  
   - Your restaurant name
   — all automatically, before you say a word

---

## Files in This Project
- App.js — Main app with login + chat screens
- app.json — Expo config with HubSpot SDK plugin
- package.json — Dependencies
- eas.json — Cloud build configuration
