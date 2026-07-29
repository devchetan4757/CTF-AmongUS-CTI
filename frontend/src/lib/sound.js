import { useSyncExternalStore } from "react";

/**
 * Lightweight, dependency-free sound effects.
 *
 * Every sound here is synthesized with the Web Audio API rather than
 * loaded from an audio file -- consistent with the rest of the game
 * using original, hand-built assets instead of anything sourced from
 * elsewhere. Tones are short and quiet by design (this is meant to add
 * a little tactile "juice" to key moments, not to be a soundtrack).
 *
 * Mute state is a tiny external store (not React state) so it can be
 * read and flipped from anywhere -- including plain event handlers
 * outside a component -- and is persisted so a muted player stays
 * muted across visits.
 */
const STORAGE_KEY = "imposter-ctf-muted";

let audioCtx = null;
function getContext() {
  if (typeof window === "undefined") return null;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) audioCtx = new AudioContextClass();
  if (audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}

function readMuted() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

let muted = typeof window !== "undefined" ? readMuted() : false;
const listeners = new Set();

function setMuted(next) {
  muted = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
  } catch {
    // Storage unavailable (private browsing, etc.) -- mute still
    // works for the current session, it just won't persist.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return muted;
}

/** React hook: re-renders the component whenever mute state changes. */
export function useMuted() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

export function toggleMute() {
  setMuted(!muted);
}

function tone({ freq, duration = 0.12, type = "sine", startAt = 0, gain = 0.05 }) {
  if (muted) return;
  const ctx = getContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;

  const now = ctx.currentTime + startAt;
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(gain, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gainNode).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}

/** Soft tick for navigation / selection. */
export function playClick() {
  tone({ freq: 720, duration: 0.06, type: "square", gain: 0.03 });
}

/** Two-note rising chime for a correct answer. */
export function playSuccess() {
  tone({ freq: 660, duration: 0.12, type: "sine" });
  tone({ freq: 880, duration: 0.16, startAt: 0.1, type: "sine" });
}

/** Two-note falling buzz for a wrong answer. */
export function playError() {
  tone({ freq: 220, duration: 0.18, type: "sawtooth", gain: 0.04 });
  tone({ freq: 160, duration: 0.22, startAt: 0.09, type: "sawtooth", gain: 0.04 });
}

/** Four-note ascending fanfare, reserved for the Victory screen. */
export function playFanfare() {
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) =>
    tone({ freq, duration: 0.22, startAt: i * 0.12, type: "triangle", gain: 0.05 })
  );
}
