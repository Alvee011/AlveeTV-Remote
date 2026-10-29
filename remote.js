/**
 * AlveeTV Remote Controller
 * Zero-dependency client communicating directly with AlveeTV on port 8080.
 */

// State
let tvIp = localStorage.getItem('alveetv_ip') || '192.168.0.54';
const PORT = 8080;
let hapticEnabled = localStorage.getItem('alveetv_haptic') !== 'false';
let isConnected = false;
let pingTimer = null;
let currentMode = 'dpad';

// Elements
const statusBadge = document.getElementById('statusBadge');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const latencyBadge = document.getElementById('latencyBadge');
const tvIpInput = document.getElementById('tvIpInput');
const hapticToggle = document.getElementById('hapticToggle');
const settingsModal = document.getElementById('settingsModal');
const scanStatus = document.getElementById('scanStatus');
const btnScan = document.getElementById('btnScan');
const remoteView = document.getElementById('remoteView');
const trackpadView = document.getElementById('trackpadView');
const tabDpad = document.getElementById('tabDpad');
const tabTrackpad = document.getElementById('tabTrackpad');
const touchpad = document.getElementById('touchpad');
const scrollStrip = document.getElementById('scrollStrip');

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  if (tvIpInput) tvIpInput.value = tvIp;
  if (hapticToggle) hapticToggle.checked = hapticEnabled;

  initTouchpad();
  initScrollStrip();
  checkConnection();

  // Periodic health check
  pingTimer = setInterval(checkConnection, 5000);

  // Register service worker for PWA offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});

// Vibration feedback
function vibrate(ms = 15) {
  if (hapticEnabled && 'vibrate' in navigator) {
    try {
      navigator.vibrate(ms);
    } catch (e) {}
  }
}

// Connection check with latency measurement
async function checkConnection() {
  const url = `http://${tvIp}:${PORT}/ping`;
  const t0 = performance.now();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000);

  try {
    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      const latency = Math.round(performance.now() - t0);
      setConnectedState(true, latency);
      return true;
    }
    throw new Error('Not OK');
  } catch (err) {
    clearTimeout(timeoutId);
    setConnectedState(false);
    return false;
  }
}

function setConnectedState(online, latency = 0) {
  isConnected = online;
  if (online) {
    statusDot.className = 'status-dot connected';
    statusText.textContent = tvIp;
    latencyBadge.textContent = `${latency}ms`;
  } else {
    statusDot.className = 'status-dot disconnected';
    statusText.textContent = 'Disconnected';
    latencyBadge.textContent = '';
  }
}

// Low-latency Key Sender
async function sendKey(code) {
  vibrate(18);
  const url = `http://${tvIp}:${PORT}/key?code=${encodeURIComponent(code)}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);
    const res = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (res.ok) {
      if (!isConnected) setConnectedState(true);
    }
  } catch (e) {
    // Fallback to GET
    try {
      fetch(url, { method: 'GET', mode: 'no-cors' });
    } catch (err) {}
  }
}

// Mouse Touchpad Implementation
let lastTouchX = null;
let lastTouchY = null;
let touchStartTime = 0;
let touchMoved = false;
let pendingDx = 0;
let pendingDy = 0;
let mouseSendTimeout = null;

function initTouchpad() {
  if (!touchpad) return;

  touchpad.addEventListener('pointerdown', (e) => {
    touchpad.setPointerCapture(e.pointerId);
    touchpad.classList.add('active');
    lastTouchX = e.clientX;
    lastTouchY = e.clientY;
    touchStartTime = Date.now();
    touchMoved = false;
  });

  touchpad.addEventListener('pointermove', (e) => {
    if (lastTouchX === null || lastTouchY === null) return;

    const dx = Math.round((e.clientX - lastTouchX) * 1.6);
    const dy = Math.round((e.clientY - lastTouchY) * 1.6);

    lastTouchX = e.clientX;
    lastTouchY = e.clientY;

    if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
      touchMoved = true;
      pendingDx += dx;
      pendingDy += dy;

      if (!mouseSendTimeout) {
        mouseSendTimeout = setTimeout(flushMouseMove, 20);
      }
    }
  });

  const handlePointerEnd = (e) => {
    touchpad.classList.remove('active');
    if (lastTouchX !== null) {
      const duration = Date.now() - touchStartTime;
      // If it was a short tap without drag, trigger Left Click
      if (!touchMoved && duration < 280) {
        sendMouseClick('left');
      }
    }
    lastTouchX = null;
    lastTouchY = null;
    flushMouseMove();
  };

  touchpad.addEventListener('pointerup', handlePointerEnd);
  touchpad.addEventListener('pointercancel', handlePointerEnd);
}

function flushMouseMove() {
  if (mouseSendTimeout) {
    clearTimeout(mouseSendTimeout);
    mouseSendTimeout = null;
  }
  if (pendingDx === 0 && pendingDy === 0) return;

  const dx = pendingDx;
  const dy = pendingDy;
  pendingDx = 0;
  pendingDy = 0;

  const url = `http://${tvIp}:${PORT}/mouse?dx=${dx}&dy=${dy}`;
  fetch(url, { method: 'POST', mode: 'cors' }).catch(() => {});
}

// Scroll strip gestures
let lastScrollY = null;
function initScrollStrip() {
  if (!scrollStrip) return;

  scrollStrip.addEventListener('pointerdown', (e) => {
    scrollStrip.setPointerCapture(e.pointerId);
    scrollStrip.classList.add('active');
    lastScrollY = e.clientY;
    vibrate(10);
  });

  scrollStrip.addEventListener('pointermove', (e) => {
    if (lastScrollY === null) return;
    const dy = e.clientY - lastScrollY;
    if (Math.abs(dy) > 12) {
      const scrollStep = dy > 0 ? -1 : 1;
      sendScroll(scrollStep);
      lastScrollY = e.clientY;
      vibrate(8);
    }
  });

  const handleEnd = () => {
    scrollStrip.classList.remove('active');
    lastScrollY = null;
  };
  scrollStrip.addEventListener('pointerup', handleEnd);
  scrollStrip.addEventListener('pointercancel', handleEnd);
}

function sendScroll(step) {
  const url = `http://${tvIp}:${PORT}/mouse?scroll=${step}`;
  fetch(url, { method: 'POST', mode: 'cors' }).catch(() => {});
}

// Mouse Click Sender
async function sendMouseClick(type = 'left') {
  vibrate(22);
  const url = `http://${tvIp}:${PORT}/mouse?click=${type}`;
  try {
    await fetch(url, { method: 'POST', mode: 'cors' });
  } catch (e) {}
}

// Text Input Handler
async function handleSendText(e) {
  e.preventDefault();
  const input = document.getElementById('keyboardInput');
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;

  vibrate(20);
  const url = `http://${tvIp}:${PORT}/text?text=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url, { method: 'POST', mode: 'cors' });
    if (res.ok) {
      input.value = '';
    }
  } catch (err) {}
}

// App Launch Handler
async function launchApp(pkg) {
  vibrate(25);
  const url = `http://${tvIp}:${PORT}/launch?pkg=${encodeURIComponent(pkg)}`;
  try {
    await fetch(url, { method: 'POST', mode: 'cors' });
  } catch (err) {}
}

// Switch Mode
function setMode(mode) {
  currentMode = mode;
  vibrate(12);
  if (mode === 'dpad') {
    tabDpad.classList.add('active');
    tabTrackpad.classList.remove('active');
    remoteView.classList.remove('hidden');
    trackpadView.classList.add('hidden');
  } else {
    tabDpad.classList.remove('active');
    tabTrackpad.classList.add('active');
    remoteView.classList.add('hidden');
    trackpadView.classList.remove('hidden');
  }
}

// Modal handlers
function openSettingsModal() {
  vibrate(10);
  if (tvIpInput) tvIpInput.value = tvIp;
  scanStatus.textContent = '';
  settingsModal.classList.remove('hidden');
}

function closeSettingsModal() {
  settingsModal.classList.add('hidden');
}

function closeModalOnOverlay(e) {
  if (e.target === settingsModal) {
    closeSettingsModal();
  }
}

function saveTvIp() {
  const val = tvIpInput.value.trim();
  if (val) {
    tvIp = val;
    localStorage.setItem('alveetv_ip', tvIp);
    vibrate(20);
    closeSettingsModal();
    checkConnection();
  }
}

function toggleHaptics(e) {
  hapticEnabled = e.target.checked;
  localStorage.setItem('alveetv_haptic', hapticEnabled ? 'true' : 'false');
  if (hapticEnabled) vibrate(30);
}

// Subnet Auto-Scanner: Scans local subnet if IP changes
let isScanning = false;
async function startSubnetScan() {
  if (isScanning) return;
  isScanning = true;
  btnScan.disabled = true;
  statusDot.className = 'status-dot scanning';
  statusText.textContent = 'Scanning...';
  scanStatus.textContent = 'Searching network for AlveeTV...';

  // Determine base subnet from current IP (default to 192.168.0.)
  const ipParts = tvIp.split('.');
  const baseSubnet = (ipParts.length === 4) ? `${ipParts[0]}.${ipParts[1]}.${ipParts[2]}.` : '192.168.0.';

  let foundIp = null;
  const batchSize = 25;

  for (let start = 1; start <= 254; start += batchSize) {
    scanStatus.textContent = `Scanning ${baseSubnet}${start} - ${baseSubnet}${Math.min(start + batchSize - 1, 254)}...`;
    const batch = [];

    for (let i = start; i < start + batchSize && i <= 254; i++) {
      const targetIp = `${baseSubnet}${i}`;
      batch.push(probeIp(targetIp));
    }

    const results = await Promise.all(batch);
    const hit = results.find(r => r !== null);
    if (hit) {
      foundIp = hit;
      break;
    }
  }

  isScanning = false;
  btnScan.disabled = false;

  if (foundIp) {
    tvIp = foundIp;
    localStorage.setItem('alveetv_ip', tvIp);
    if (tvIpInput) tvIpInput.value = tvIp;
    scanStatus.textContent = `Found AlveeTV at ${foundIp}!`;
    vibrate(50);
    setTimeout(() => {
      closeSettingsModal();
      checkConnection();
    }, 1200);
  } else {
    scanStatus.textContent = 'TV not found. Ensure TV & phone are on the same Wi-Fi.';
    setConnectedState(false);
  }
}

async function probeIp(ip) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 1200);

  try {
    const res = await fetch(`http://${ip}:${PORT}/ping`, {
      method: 'GET',
      mode: 'cors',
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.app === 'AlveeTV') {
        return ip;
      }
    }
  } catch (e) {
    clearTimeout(timeoutId);
  }
  return null;
}

