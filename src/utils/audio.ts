type SoundType = 'select' | 'input' | 'error' | 'success';

class AudioManager {
  private audioContext: AudioContext | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;
  private bgmOscillator: OscillatorNode | null = null;
  private isBgmPlaying: boolean = false;
  private isMuted: boolean = false;
  private isBgmMuted: boolean = false;

  private getContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.audioContext;
  }

  private createGain(value: number): GainNode {
    const ctx = this.getContext();
    const gain = ctx.createGain();
    gain.gain.value = value;
    gain.connect(ctx.destination);
    return gain;
  }

  playSound(type: SoundType): void {
    if (this.isMuted || this.isBgmMuted) return;

    const ctx = this.getContext();
    const now = ctx.currentTime;

    switch (type) {
      case 'select':
        this.playSelectSound(now);
        break;
      case 'input':
        this.playInputSound(now);
        break;
      case 'error':
        this.playErrorSound(now);
        break;
      case 'success':
        this.playSuccessSound(now);
        break;
    }
  }

  private playSelectSound(time: number): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, time);
    osc.frequency.exponentialRampToValueAtTime(1000, time + 0.05);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  private playInputSound(time: number): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, time);
    osc.frequency.setValueAtTime(800, time + 0.05);

    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.15);
  }

  private playErrorSound(time: number): void {
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(200, time);
    osc.frequency.setValueAtTime(150, time + 0.1);

    gain.gain.setValueAtTime(0.1, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.3);
  }

  private playSuccessSound(time: number): void {
    const ctx = this.getContext();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      const startTime = time + i * 0.15;
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  playBGM(): void {
    if (this.isBgmPlaying || this.isBgmMuted) return;

    const ctx = this.getContext();
    this.bgmGain = ctx.createGain();
    this.bgmGain.gain.value = 0.08;
    this.bgmGain.connect(ctx.destination);

    // 简单的轻快儿童音乐旋律
    const melody = [
      { freq: 523.25, duration: 0.2 },  // C5
      { freq: 587.33, duration: 0.2 },  // D5
      { freq: 659.25, duration: 0.2 },  // E5
      { freq: 698.46, duration: 0.2 },  // F5
      { freq: 783.99, duration: 0.2 },  // G5
      { freq: 698.46, duration: 0.2 },  // F5
      { freq: 659.25, duration: 0.2 },  // E5
      { freq: 587.33, duration: 0.2 },  // D5
      { freq: 523.25, duration: 0.4 },  // C5
      { freq: 0, duration: 0.2 },        // 休止
      { freq: 659.25, duration: 0.2 },  // E5
      { freq: 783.99, duration: 0.2 },  // G5
      { freq: 880.00, duration: 0.4 },  // A5
      { freq: 783.99, duration: 0.2 },  // G5
      { freq: 659.25, duration: 0.2 },  // E5
      { freq: 523.25, duration: 0.4 },  // C5
    ];

    let currentTime = ctx.currentTime;
    const playNextNote = () => {
      if (!this.isBgmPlaying || this.isBgmMuted) return;

      melody.forEach(({ freq, duration }) => {
        if (freq === 0) {
          currentTime += duration;
          return;
        }

        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        osc.connect(this.bgmGain!);
        osc.start(currentTime);
        osc.stop(currentTime + duration * 0.9);
        currentTime += duration;
      });

      // 循环播放
      setTimeout(() => {
        if (this.isBgmPlaying && !this.isBgmMuted) {
          currentTime = ctx.currentTime;
          playNextNote();
        }
      }, currentTime * 1000 - ctx.currentTime * 1000 + 100);
    };

    this.isBgmPlaying = true;
    playNextNote();
  }

  stopBGM(): void {
    this.isBgmPlaying = false;
    if (this.bgmGain) {
      this.bgmGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.5);
      setTimeout(() => {
        this.bgmGain = null;
      }, 500);
    }
  }

  pauseBGM(): void {
    this.isBgmMuted = true;
    if (this.bgmGain) {
      this.bgmGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext!.currentTime + 0.3);
    }
  }

  resumeBGM(): void {
    if (this.isBgmMuted && !this.isMuted) {
      this.isBgmMuted = false;
      if (!this.isBgmPlaying) {
        this.playBGM();
      } else if (this.bgmGain) {
        this.bgmGain.gain.exponentialRampToValueAtTime(0.08, this.audioContext!.currentTime + 0.3);
      }
    }
  }

  toggleBgm(): void {
    if (this.isBgmMuted) {
      this.resumeBGM();
    } else {
      this.pauseBGM();
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    }
  }

  isMutedState(): boolean {
    return this.isMuted;
  }

  isBgmMutedState(): boolean {
    return this.isBgmMuted;
  }
}

export const audio = new AudioManager();
export default AudioManager;
