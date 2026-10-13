const CHARSETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  number: '0123456789',
  symbol: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};
const AMBIGUOUS = /[0O1lI|`'"]/g;

const els = {
  password: document.getElementById('password'),
  copy: document.getElementById('copy'),
  length: document.getElementById('length'),
  lenVal: document.getElementById('lenVal'),
  upper: document.getElementById('upper'),
  lower: document.getElementById('lower'),
  number: document.getElementById('number'),
  symbol: document.getElementById('symbol'),
  exclude: document.getElementById('exclude'),
  strengthFill: document.getElementById('strengthFill'),
  strengthLabel: document.getElementById('strengthLabel'),
  entropy: document.getElementById('entropy'),
  generate: document.getElementById('generate'),
};

// 无偏差的均匀随机整数 [0, max)（拒绝采样）
function randomInt(max) {
  const limit = Math.floor(0x100000000 / max) * max;
  const buf = new Uint32Array(1);
  let x;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % max;
}
function pick(chars) {
  return chars[randomInt(chars.length)];
}

function activeCharsets() {
  const sets = [];
  for (const key of ['upper', 'lower', 'number', 'symbol']) {
    if (els[key].checked) {
      let chars = CHARSETS[key];
      if (els.exclude.checked) chars = chars.replace(AMBIGUOUS, '');
      if (chars.length) sets.push(chars);
    }
  }
  return sets;
}

function generate() {
  const sets = activeCharsets();
  const length = parseInt(els.length.value, 10);

  if (!sets.length) {
    els.password.value = '';
    updateStrength(0, 0);
    return;
  }

  const pool = sets.join('');
  const chars = Array.from({ length }, () => pick(pool));

  // 保证每个选中的字符集至少出现一次
  for (let i = 0; i < sets.length; i++) {
    chars[i] = pick(sets[i]);
  }
  // Fisher–Yates 洗牌，打乱固定位置
  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  const password = chars.join('');
  els.password.value = password;

  const poolSize = pool.length;
  const entropy = length * Math.log2(poolSize);
  updateStrength(entropy, poolSize);
}

function updateStrength(entropy, poolSize) {
  let label, color;
  if (entropy >= 100) { label = '很强'; color = '#059669'; }
  else if (entropy >= 70) { label = '强'; color = '#10b981'; }
  else if (entropy >= 45) { label = '一般'; color = '#f59e0b'; }
  else if (entropy > 0) { label = '弱'; color = '#ef4444'; }
  else { label = '—'; color = 'var(--accent)'; }

  els.strengthLabel.textContent = label;
  els.strengthLabel.style.color = color;
  els.strengthFill.style.width = `${Math.min(100, (entropy / 120) * 100)}%`;
  els.strengthFill.style.background = color;
  els.entropy.textContent = entropy > 0
    ? `约 ${Math.round(entropy)} 位熵 · 字符池 ${poolSize}`
    : '';
}

async function copy() {
  const text = els.password.value;
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    fallbackCopy(text);
  }
  els.copy.textContent = '✓';
  setTimeout(() => { els.copy.textContent = '⧉'; }, 1200);
}
function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
}

function bindEvents() {
  els.generate.addEventListener('click', generate);
  els.copy.addEventListener('click', copy);
  els.length.addEventListener('input', () => {
    els.lenVal.textContent = els.length.value;
    generate();
  });
  ['upper', 'lower', 'number', 'symbol', 'exclude'].forEach((id) => {
    els[id].addEventListener('change', generate);
  });
}

bindEvents();
generate();
