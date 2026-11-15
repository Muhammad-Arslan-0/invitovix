import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { InvitovixAudioEngine } from "@/lib/audio/audioEngine";

// Mock howler
const mockHowlInstance = {
  play: vi.fn(),
  pause: vi.fn(),
  stop: vi.fn(),
  unload: vi.fn(),
  mute: vi.fn(),
  volume: vi.fn(),
  fade: vi.fn(),
  playing: vi.fn(() => false),
  once: vi.fn(),
  on: vi.fn(),
};

vi.mock("howler", () => {
  return {
    Howl: vi.fn().mockImplementation((config) => {
      // Store config to simulate callbacks if needed
      (mockHowlInstance as Record<string, unknown>)._config = config;
      return mockHowlInstance;
    }),
    Howler: {
      ctx: {
        state: "suspended",
        resume: vi.fn(),
        currentTime: 0,
        createOscillator: vi.fn(() => ({
          type: "sine",
          frequency: { setValueAtTime: vi.fn() },
          connect: vi.fn(),
          start: vi.fn(),
          stop: vi.fn(),
        })),
        createGain: vi.fn(() => ({
          gain: {
            setValueAtTime: vi.fn(),
            exponentialRampToValueAtTime: vi.fn(),
          },
          connect: vi.fn(),
        })),
        destination: {},
      },
    },
  };
});

describe("InvitovixAudioEngine Background Visibility Lifecycle", () => {
  let engine: InvitovixAudioEngine;
  let originalHidden: PropertyDescriptor | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    mockHowlInstance.playing.mockReturnValue(false);
    originalHidden = Object.getOwnPropertyDescriptor(document, "hidden");

    // Default document.hidden to false
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });

    engine = new InvitovixAudioEngine();
  });

  afterEach(() => {
    engine.destroy();
    if (originalHidden) {
      Object.defineProperty(document, "hidden", originalHidden);
    }
  });

  it("unlocks and plays audio track cleanly", () => {
    const started = engine.unlockAndPlay("/audio/preset-1.mp3", 0.7);
    expect(started).toBe(true);
    expect(mockHowlInstance.play).toHaveBeenCalled();
    expect(mockHowlInstance.fade).toHaveBeenCalledWith(0, 0.7, 1200);
    expect(engine.isPausedByVisibility()).toBe(false);
  });

  it("pauses background music when document visibility changes to hidden", () => {
    engine.unlockAndPlay("/audio/preset-1.mp3", 0.6);
    mockHowlInstance.playing.mockReturnValue(true);

    // Simulate tab going to background
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });

    document.dispatchEvent(new Event("visibilitychange"));

    expect(mockHowlInstance.pause).toHaveBeenCalledTimes(1);
    expect(engine.isPausedByVisibility()).toBe(true);
  });

  it("resumes background music smoothly when returning from background", () => {
    engine.unlockAndPlay("/audio/preset-1.mp3", 0.6);
    mockHowlInstance.playing.mockReturnValue(true);

    // Step 1: Hide document
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(mockHowlInstance.pause).toHaveBeenCalled();
    expect(engine.isPausedByVisibility()).toBe(true);

    // Step 2: Now it's paused
    mockHowlInstance.playing.mockReturnValue(false);

    // Step 3: Bring document back to foreground
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(mockHowlInstance.play).toHaveBeenCalledTimes(2); // once initial, once on resume
    expect(mockHowlInstance.fade).toHaveBeenCalledWith(0, 0.6, 800);
    expect(engine.isPausedByVisibility()).toBe(false);
  });

  it("does NOT resume if audio was not playing before document was hidden", () => {
    // Engine created but never played
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(engine.isPausedByVisibility()).toBe(false);

    // Return to foreground
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(mockHowlInstance.play).not.toHaveBeenCalled();
  });

  it("does NOT resume playback on foreground if user muted audio", () => {
    engine.unlockAndPlay("/audio/preset-1.mp3", 0.6);
    mockHowlInstance.playing.mockReturnValue(true);

    // Tab goes into background
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(engine.isPausedByVisibility()).toBe(true);

    // User mutes
    engine.setMuted(true);
    expect(engine.isPausedByVisibility()).toBe(false);

    // Return to foreground
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));

    // play should not have been called a second time
    expect(mockHowlInstance.play).toHaveBeenCalledTimes(1);
  });

  it("pauses active music on pagehide event", () => {
    engine.unlockAndPlay("/audio/preset-1.mp3", 0.6);
    mockHowlInstance.playing.mockReturnValue(true);

    window.dispatchEvent(new Event("pagehide"));

    expect(mockHowlInstance.pause).toHaveBeenCalled();
    expect(engine.isPausedByVisibility()).toBe(true);
  });

  it("clears visibility tracking on stopAndUnload", () => {
    engine.unlockAndPlay("/audio/preset-1.mp3", 0.6);
    mockHowlInstance.playing.mockReturnValue(true);

    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(engine.isPausedByVisibility()).toBe(true);

    engine.stopAndUnload();
    expect(engine.isPausedByVisibility()).toBe(false);

    // Foregrounding now should do nothing
    Object.defineProperty(document, "hidden", {
      configurable: true,
      get: () => false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
    expect(mockHowlInstance.play).toHaveBeenCalledTimes(1);
  });
});
