import { Howl, Howler } from "howler";
import { AUDIO_TRACK_PRESETS } from "@/lib/templates/presets";
import { EventDesignData } from "@/types/invitation";

class InvitovixAudioEngine {
  private currentHowl: Howl | null = null;
  private currentSrc: string | null = null;
  private isMutedState = false;
  private targetVolume = 0.6;
  private fallbackChimePlayed = false;

  public resolveSource(audio: EventDesignData["audio"]): string | null {
    if (!audio.enabled) return null;
    if (audio.trackId === "custom" && audio.customUrl) {
      return audio.customUrl;
    }
    const preset = AUDIO_TRACK_PRESETS.find((t) => t.id === audio.trackId);
    return preset?.src ?? AUDIO_TRACK_PRESETS[0].src;
  }

  /**
   * Must be invoked inside a synchronous user interaction (tap/click)
   * so iOS Safari and Chrome autoplay policies unlock WebAudio cleanly.
   */
  public unlockAndPlay(src: string, volume = 0.6): boolean {
    if (typeof window === "undefined") return false;
    this.targetVolume = Math.max(0, Math.min(1, volume));

    try {
      const ctx = Howler.ctx;
      if (ctx && ctx.state === "suspended") {
        void ctx.resume();
      }
    } catch {
      // Ignore if AudioContext not yet initialized
    }

    if (this.currentHowl && this.currentSrc === src) {
      if (!this.currentHowl.playing()) {
        this.currentHowl.volume(0);
        this.currentHowl.play();
        if (!this.isMutedState) {
          this.currentHowl.fade(0, this.targetVolume, 1200);
        }
      }
      return true;
    }

    this.stopAndUnload();

    const useHtml5 = src.startsWith("http") && !src.endsWith(".wav");
    this.currentSrc = src;

    const howl = new Howl({
      src: [src],
      loop: true,
      volume: 0,
      html5: useHtml5,
      onloaderror: () => {
        // Gentle chime fallback so user still hears tactile feedback if custom URL fails
        this.playSubtleChime();
      },
      onplayerror: () => {
        howl.once("unlock", () => {
          howl.play();
          if (!this.isMutedState) {
            howl.fade(0, this.targetVolume, 1200);
          }
        });
      },
    });

    this.currentHowl = howl;
    howl.mute(this.isMutedState);
    howl.play();
    if (!this.isMutedState) {
      howl.fade(0, this.targetVolume, 1200);
    }

    if (!this.fallbackChimePlayed) {
      this.playSubtleChime();
      this.fallbackChimePlayed = true;
    }

    return true;
  }

  /**
   * Plays a delicate, instantaneous acoustic unseal chime via Web Audio API
   * inside the tap gesture while the main loop fades in.
   */
  public playSubtleChime() {
    if (typeof window === "undefined" || this.isMutedState) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = Howler.ctx ?? new AudioCtx();
      if (ctx.state === "suspended") {
        void ctx.resume();
      }
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5 - E5 - G5 soft arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.0001, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.06, now + idx * 0.08 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.7);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.75);
      });
    } catch {
      // Non-critical chime
    }
  }

  public setMuted(muted: boolean) {
    this.isMutedState = muted;
    if (this.currentHowl) {
      this.currentHowl.mute(muted);
      if (!muted && this.currentHowl.playing()) {
        this.currentHowl.volume(this.targetVolume);
      }
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMutedState);
    return this.isMutedState;
  }

  public setVolume(volume: number) {
    this.targetVolume = Math.max(0, Math.min(1, volume));
    if (this.currentHowl && !this.isMutedState) {
      this.currentHowl.volume(this.targetVolume);
    }
  }

  public isMuted(): boolean {
    return this.isMutedState;
  }

  public stopAndUnload() {
    if (this.currentHowl) {
      try {
        this.currentHowl.stop();
        this.currentHowl.unload();
      } catch {
        // Ignore cleanup errors
      }
      this.currentHowl = null;
      this.currentSrc = null;
    }
    this.fallbackChimePlayed = false;
  }
}

export const audioEngine = new InvitovixAudioEngine();

