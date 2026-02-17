/**
 * Lightweight sound effect system for WarpBnB.
 *
 * Sounds are off by default and only play after user interaction
 * (satisfying browser autoplay policies). Respects a global mute toggle
 * persisted in sessionStorage so it resets each visit — no nagging.
 */

const SOUNDS = {
  warpWhoosh: '/sounds/warp-whoosh.mp3',
} as const;

type SoundName = keyof typeof SOUNDS;

// Pre-loaded audio elements (created lazily on first play)
const audioCache: Partial<Record<SoundName, HTMLAudioElement>> = {};

/** Whether sounds are globally muted */
let isMuted = false;

// Restore mute state from session
if (typeof window !== 'undefined') {
  isMuted = sessionStorage.getItem('warpbnb-muted') === 'true';
}

function getAudio(name: SoundName): HTMLAudioElement {
  if (!audioCache[name]) {
    const audio = new Audio(SOUNDS[name]);
    audio.preload = 'auto';
    audio.volume = 0.35; // subtle default
    audioCache[name] = audio;
  }
  return audioCache[name]!;
}

/**
 * Play a named sound effect.
 * Silently no-ops if muted or if browser blocks autoplay.
 */
export function playSound(name: SoundName, volume?: number) {
  if (isMuted) return;
  try {
    const audio = getAudio(name);
    audio.currentTime = 0;
    if (volume !== undefined) audio.volume = Math.min(1, Math.max(0, volume));
    audio.play().catch(() => {
      // Browser blocked autoplay — silently ignore
    });
  } catch {
    // Audio not available — silently ignore
  }
}

/** Toggle global mute. Returns new muted state. */
export function toggleMute(): boolean {
  isMuted = !isMuted;
  if (typeof window !== 'undefined') {
    sessionStorage.setItem('warpbnb-muted', String(isMuted));
  }
  return isMuted;
}

/** Check current mute state */
export function getMuteState(): boolean {
  return isMuted;
}
