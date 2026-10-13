const MODES = {
  work:  { label: '专注',   phase: '保持专注',    min: 25 },
  short: { label: '短休息', phase: '短暂休息一下', min: 5 },
  long:  { label: '长休息', phase: '好好休息',    min: 15 },
};

const CIRCUMFERENCE = 2 * Math.PI * 120;

const els = {
  time: document.getElementById('time'),
  phase: document.getElementById('phase'),
  ring: document.querySelector('.ring-progress'),
  startPause: document.getElementById('startPause'),
  reset: document.getElementById('reset'),
  skip: document.getElementById('skip'),
  dots: document.getElementById('dots'),
  counter: document.getElementById('counter'),
  modes: document.querySelectorAll('.mode'),
  setWork: document.getElementById('setWork'),
  setShort: document.getElementById('setShort'),
  setLong: document.getElementById('setLong'),
};

const STORAGE_KEY = 'pomodoro-settings-v1';
const COUNT_KEY = 'pomodoro-count-v1';

let settings = loadSettings();
let mode = 'work';
let total = settings[mode] * 60;
let remaining = total;
let timerId = null;
let endAt = 0;
let running = false;
let completedToday = loadCount();

function loadSettings() {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  return {
    work: saved.work ?? 25,
    short: saved.short ?? 5,
    long: saved.long ?? 15,
  };
}
function saveSettings() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
function loadCount() {
  const data = JSON.parse(localStorage.getItem(COUNT_KEY) || '{}');
  const today = new Date().toDateString();
  return data.date === today ? data.count : 0;
}
function saveCount() {
  localStorage.setItem(COUNT_KEY, JSON.stringify({
    date: new Date().toDateString(),
    count: completedToday,
  }));
}

function format(s) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

function render() {
  els.time.textContent = format(remaining);
  els.phase.textContent = MODES[mode].phase;
  document.body.dataset.mode = mode;

  const offset = CIRCUMFERENCE * (1 - remaining / total);
  els.ring.style.strokeDasharray = CIRCUMFERENCE;
  els.ring.style.strokeDashoffset = offset;

  document.title = running
    ? `${format(remaining)} · ${MODES[mode].label}`
    : '番茄钟';
  els.startPause.textContent = running ? '暂停' : '开始';
}

function setMode(next) {
  mode = next;
  stopTicking();
  total = settings[mode] * 60;
  remaining = total;
  els.modes.forEach((b) => {
    const active = b.dataset.mode === mode;
    b.classList.toggle('is-active', active);
    b.setAttribute('aria-selected', String(active));
  });
  render();
}

function start() {
  if (running) { stopTicking(); render(); return; }
  running = true;
  endAt = Date.now() + remaining * 1000;
  timerId = setInterval(tick, 250);
  render();
}

function stopTicking() {
  running = false;
  if (timerId) { clearInterval(timerId); timerId = null; }
}

function tick() {
  remaining = Math.max(0, Math.round((endAt - Date.now()) / 1000));
  render();
  if (remaining <= 0) complete();
}

function complete() {
  stopTicking();
  playChime();
  notify();
  if (mode === 'work') {
    completedToday += 1;
    saveCount();
    renderDots();
    setMode('short');
  } else {
    setMode('work');
  }
}

function reset() {
  stopTicking();
  total = settings[mode] * 60;
  remaining = total;
  render();
}

function skip() {
  setMode(mode === 'work' ? 'short' : 'work');
}

// 提示音（Web Audio 合成，无需外部音频文件）
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [880, 1174.66];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.18;
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  } catch (e) { /* 忽略音频错误 */ }
}

function notify() {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const next = mode === 'work' ? '短休息' : '专注';
  new Notification('番茄钟', { body: `时间到！接下来：${next}` });
}

function renderDots() {
  const MAX = 12;
  els.dots.innerHTML = '';
  for (let i = 0; i < Math.min(completedToday, MAX); i++) {
    const d = document.createElement('span');
    d.className = 'dot filled';
    els.dots.appendChild(d);
  }
  els.counter.textContent = `今日已完成 ${completedToday} 个番茄`;
}

function updateSetting(key, input) {
  let v = parseInt(input.value, 10);
  if (Number.isNaN(v)) v = MODES[key].min;
  v = Math.min(120, Math.max(1, v));
  input.value = v;
  settings[key] = v;
  saveSettings();
  if (!running && mode === key) {
    total = settings[mode] * 60;
    remaining = total;
    render();
  }
}

function bindEvents() {
  els.startPause.addEventListener('click', () => {
    if (!running && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    start();
  });
  els.reset.addEventListener('click', reset);
  els.skip.addEventListener('click', skip);
  els.modes.forEach((b) => b.addEventListener('click', () => setMode(b.dataset.mode)));
  els.setWork.addEventListener('change', () => updateSetting('work', els.setWork));
  els.setShort.addEventListener('change', () => updateSetting('short', els.setShort));
  els.setLong.addEventListener('change', () => updateSetting('long', els.setLong));
}

// 初始化
els.ring.style.strokeDasharray = CIRCUMFERENCE;
els.ring.style.strokeDashoffset = 0;
els.setWork.value = settings.work;
els.setShort.value = settings.short;
els.setLong.value = settings.long;
bindEvents();
render();
renderDots();
