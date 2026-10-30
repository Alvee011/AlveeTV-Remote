# AlveeTV Remote

### Turn your phone, tablet, or computer into a remote control for your AlveeTV Box.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-AlveeTV%20Remote-7C4DFF?style=for-the-badge)](https://alveetv-remote.vercel.app/)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20PWA-blue.svg)](#installation)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Streaming](https://img.shields.io/badge/Streaming-H.264-orange.svg)](#live-screen-monitor)

**AlveeTV Remote** is a modern, mobile-friendly Progressive Web App (PWA) designed to control compatible AlveeTV Android TV boxes directly from a web browser.

It combines a familiar physical remote-control layout, an interactive mouse trackpad, direct keyboard input, quick app launching, and a live TV screen monitor with click-to-touch interaction.

No separate mobile application is required.

**Live Web App:** https://alveetv-remote.vercel.app/

---

## Screenshots

### Desktop Dashboard

A dual-pane dashboard with live screen monitoring, remote controls, and keyboard interaction.

<p align="center">
  <img src="https://res.cloudinary.com/alvee/image/upload/v1793357081/Screenshot_2026-10-30_at_4.40.02_PM_oku1ke.png" alt="AlveeTV Remote Desktop Dashboard" width="950">
</p>

### Mobile Remote Control

| Remote D-Pad & Live Screen | Mouse Trackpad & Quick Launchers |
|:---:|:---:|
| <img src="https://res.cloudinary.com/alvee/image/upload/v1793357554/IMG_7524_kyk7uv.png" alt="Mobile Remote D-Pad" width="320"> | <img src="https://res.cloudinary.com/alvee/image/upload/v1793357555/IMG_7525_zdikbb.png" alt="Mobile Remote Trackpad" width="320"> |

### AlveeTV Home Screen

<p align="center">
  <img src="https://res.cloudinary.com/alvee/image/upload/v1793357893/AlveeTV-Home_vsucnm.jpg" alt="AlveeTV Launcher Home Screen" width="850">
</p>

---

## Features

### 1. Live Screen Monitor

View your TV screen directly from your phone or computer.

- Live H.264 video streaming.
- Hardware-accelerated screen capture on supported devices.
- Media Source Extensions (MSE) playback using JMuxer.
- Adaptive buffering for smoother playback.
- Direct click-to-touch interaction: tap anywhere on the video to send a touch event to the corresponding screen position.

Streaming performance and frame rate depend on the TV hardware, network connection, and browser.

### 2. Physical Remote Control Layout

A familiar remote interface designed for phones and tablets.

| Control | Action |
|---|---|
| Power | Sleep or wake the TV |
| Menu | Open the Android menu |
| Home | Return to AlveeTV Home |
| Purple D-Pad | Navigate up, down, left, and right |
| Center OK | Select an item |
| Back | Go back |
| Volume - / + | Control TV volume |
| Mouse Mode | Switch to touchpad navigation |

### 3. Interactive Mouse Trackpad

Control your TV using your phone's touchscreen.

- Smooth pointer movement.
- Tap for left click.
- Right click for Android Menu.
- Vertical scrolling.
- Responsive drag navigation.
- Cursor acceleration.

Useful for navigating browsers, file managers, and applications that are difficult to operate with a traditional remote.

### 4. Direct Keyboard Input

Type using your phone or computer keyboard.

- Enter search queries.
- Type into compatible text fields.
- Send text directly to the TV.
- Avoid navigating long on-screen keyboards.

### 5. Quick App Launchers

Open frequently used applications with one tap.

Supported shortcuts can include:

- YouTube
- SmartTube
- Brave Browser
- TV APP
- MX Player
- Android Settings

These are shortcuts to applications available on your TV. AlveeTV Remote does not install or bundle these applications.

### 6. One-Tap Recent Apps & RAM Cleaner

Dedicated red action button to instantly close all running background activity stacks, purge cached processes, and free up TV box RAM in < 200ms.

### 7. Automatic TV Discovery

Your router may assign a different IP address to your TV box after restarting.

Use **Auto-Detect TV on Network** to search your local network for an AlveeTV device.

Alternatively, enter the TV box's current IP address manually.

Once discovered, the remote can reconnect using the TV's port 8080.

### 8. Desktop Keyboard Shortcuts

Control your TV from a computer using your physical keyboard.

| Keyboard key | TV action |
|---|---|
| Arrow keys | D-Pad navigation |
| Enter | OK / Select |
| Escape | Back |
| H | Home |
| M | Menu |
| + | Volume Up |
| - | Volume Down |

### 8. Progressive Web App (PWA)

Install AlveeTV Remote directly on your phone.

- No traditional app-store installation required.
- Mobile-friendly interface.
- Add to Home Screen support.
- Standalone app-style experience.
- Responsive desktop and mobile layouts.

---

## Installation and Access

### Option 1: Use the Live Web App (Recommended)

Open:

**https://alveetv-remote.vercel.app/**

Make sure your phone, tablet, or computer and TV box are connected to the same local Wi-Fi network or LAN.

### Option 2: Connect Directly to Your TV Box

AlveeTV also serves the remote interface directly from the TV box when its Web Remote server is enabled.

Open:

```text
http://<YOUR_TV_IP>:8080/
```

For example:

```text
http://192.168.0.54:8080/
```

Replace the example IP with your TV box's actual IP address.

The direct local interface does not require a separate Vercel deployment.

---

## How to Connect

1. Turn on your AlveeTV Box.
2. Open AlveeTV Options.
3. Find **Web Remote Control**.
4. Switch the feature to **On**.
5. Connect your phone and TV to the same Wi-Fi or LAN network.
6. Open [alveetv-remote.vercel.app](https://alveetv-remote.vercel.app/).
7. Enter your TV box's IP address if it is not detected automatically.
8. Wait for the connection indicator to confirm the connection.

When connected, the status indicator turns green and displays connection information.

If the connection fails, check that the TV's Web Remote server is running and that both devices can communicate over the local network.

---

## How to Host on Vercel

You can host your own copy of AlveeTV Remote using Vercel.

### Method 1: Vercel Dashboard

1. Push the remote application source code to GitHub.
2. Visit [Vercel](https://vercel.com/).
3. Select **Add New Project**.
4. Import your GitHub repository.
5. Set the Root Directory to `AlveeTV Remote` if the application is inside that folder.
6. Configure the project according to its existing build settings.
7. Click **Deploy**.

Vercel will provide an HTTPS URL for your remote application.

### Method 2: Vercel CLI

From your terminal:

```bash
cd "AlveeTV Remote"
npx vercel
```

Follow the deployment instructions.

**Note:** A hosted HTTPS client communicating with a TV's local HTTP server may encounter browser security or local-network access restrictions. Depending on your browser, you may need to grant local-network access or use the directly hosted TV interface instead.

---

## Install as a Phone App (PWA)

### iPhone (Safari)

1. Open [alveetv-remote.vercel.app](https://alveetv-remote.vercel.app/) in Safari.
2. Tap the Share icon.
3. Select **Add to Home Screen**.
4. Tap **Add** in the top-right corner.

AlveeTV Remote will appear on your iPhone's Home Screen.

### Android (Chrome / Brave)

1. Open the Vercel URL in Chrome or Brave.
2. Tap the three-dot menu.
3. Select **Install app** or **Add to Home screen**.
4. Complete the installation.

You can now open AlveeTV Remote like a regular mobile application.

---

## TV-Side Requirements

AlveeTV Remote requires a compatible AlveeTV installation on the television.

The TV box must have:

- AlveeTV Home installed.
- Web Remote Control enabled.
- A working local network connection.
- The TV-side remote server running on port `8080`.
- Compatible screen-streaming and input-control functionality for advanced features.

Not every feature is guaranteed to work on every Android TV box.

---

## Security & Privacy

AlveeTV Remote communicates with the TV through its local network.

Please follow these precautions:

- Use the remote on a trusted private network.
- Keep the TV-side Web Remote server disabled when it is not needed.
- Do not expose port `8080` directly to the public internet.
- Do not configure router port forwarding for remote access.
- Do not use an unauthenticated remote server on an untrusted network.
- Protect access to screen streaming, keyboard input, and device-control functions.

The web client does not need your Google account or TV account credentials.

The exact authentication and data-handling behavior depends on the TV-side server implementation.

---

## Troubleshooting

| Problem | Recommended action |
|---|---|
| TV not detected | Check that both devices are on the same network. |
| Connection refused | Enable Web Remote Control on the TV. |
| IP address changed | Use Auto-Detect TV on Network. |
| Live screen not loading | Check browser compatibility and the TV streaming server. |
| Buttons do not work | Confirm that the TV-side server is running. |
| Text is not appearing | Make sure a compatible text input field is active. |
| Remote disconnects | Check Wi-Fi signal and restart the connection. |
| Vercel client cannot connect | Check browser local-network permissions and HTTP/HTTPS restrictions. |

---

## Author

**Developed by Faruque Azam Alvee**

- Website: [alvee.bio.link](https://alvee.bio.link/)
- GitHub: [@Alvee011](https://github.com/Alvee011)
- Live Remote: [alveetv-remote.vercel.app](https://alveetv-remote.vercel.app/)

---

## License

This project is licensed under the [MIT License](LICENSE).

Copyright © Faruque Azam Alvee.

---

<p align="center">
  ## 👤 Author & Credits
  <strong>AlveeTV Remote</strong><br>
  Your TV. Your Control. Your Experience.
</p>
