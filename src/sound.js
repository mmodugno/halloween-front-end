// Tiny game sound effects synthesized with WebAudio (no audio files).
// Browsers only allow audio after the first tap, so the context is created lazily.
const KEY = "halloween-sound";
let ctx = null;
let enabled = true;
try {
  enabled = localStorage.getItem(KEY) !== "off";
} catch {}

const listeners = new Set();

export const isSoundOn = () => enabled;

export function setSoundOn(on) {
  enabled = on;
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {}
  listeners.forEach((fn) => fn(on));
  if (on) play("select");
}

export function onSoundChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

// One square-wave note. `at` is seconds from now.
function tone(ac, freq, { at = 0, length = 0.06, volume = 0.05, type = "square" } = {}) {
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  const start = ac.currentTime + at;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(ac.destination);
  osc.start(start);
  osc.stop(start + length + 0.02);
}

const SOUNDS = {
  // Text typing blip, slightly random so it doesn't sound robotic.
  blip: (ac) => tone(ac, 520 + Math.random() * 60, { length: 0.035, volume: 0.025 }),
  select: (ac) => tone(ac, 660, { length: 0.05 }),
  back: (ac) => tone(ac, 440, { length: 0.06 }),
  confirm: (ac) => {
    tone(ac, 523, { length: 0.07 });
    tone(ac, 784, { at: 0.07, length: 0.09 });
  },
  vote: (ac) => [523, 659, 784, 1047].forEach((f, i) => tone(ac, f, { at: i * 0.07, length: 0.12 })),
  encounter: (ac) => [196, 247, 196, 247].forEach((f, i) => tone(ac, f, { at: i * 0.06, length: 0.05, volume: 0.04 })),
  error: (ac) => tone(ac, 110, { length: 0.22, volume: 0.06, type: "sawtooth" }),
  win: (ac) => [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(ac, f, { at: i * 0.11, length: 0.16 })),
};

export function play(name) {
  if (!enabled) return;
  try {
    const ac = audio();
    if (ac) SOUNDS[name]?.(ac);
  } catch {}
}
