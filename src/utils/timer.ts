type TimerCallback = (seconds: number) => void;

class Timer {
  private seconds: number = 0;
  private intervalId: number | null = null;
  private isPaused: boolean = false;
  private onTick: TimerCallback | null = null;
  private onStop: TimerCallback | null = null;

  start(onTick?: TimerCallback, onStop?: TimerCallback): void {
    this.seconds = 0;
    this.isPaused = false;
    this.onTick = onTick || null;
    this.onStop = onStop || null;

    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
    }

    this.intervalId = window.setInterval(() => {
      if (!this.isPaused) {
        this.seconds++;
        if (this.onTick) {
          this.onTick(this.seconds);
        }
      }
    }, 1000);
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }

  toggle(): void {
    this.isPaused = !this.isPaused;
  }

  stop(): void {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.onStop) {
      this.onStop(this.seconds);
    }
  }

  reset(): void {
    this.stop();
    this.seconds = 0;
    this.isPaused = false;
  }

  getSeconds(): number {
    return this.seconds;
  }

  isRunning(): boolean {
    return this.intervalId !== null && !this.isPaused;
  }

  isPausedState(): boolean {
    return this.isPaused;
  }

  formatTime(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
}

export const timer = new Timer();
export default Timer;
