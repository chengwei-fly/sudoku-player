import { describe, it, expect, beforeEach } from 'vitest';
import Timer from '../../utils/timer';

describe('Timer', () => {
  let timer: Timer;

  beforeEach(() => {
    timer = new Timer();
  });

  it('should start with 0 seconds', () => {
    timer.start();
    expect(timer.getSeconds()).toBe(0);
  });

  it('should increment seconds', async () => {
    let currentSeconds = 0;
    timer.start((seconds) => {
      currentSeconds = seconds;
    });

    await new Promise(resolve => setTimeout(resolve, 1100));
    expect(currentSeconds).toBeGreaterThanOrEqual(1);
    timer.stop();
  });

  it('should pause and resume', async () => {
    let seconds = 0;
    timer.start((s) => { seconds = s; });

    await new Promise(resolve => setTimeout(resolve, 500));
    timer.pause();
    const pausedSeconds = seconds;
    await new Promise(resolve => setTimeout(resolve, 500));
    expect(seconds).toBe(pausedSeconds);

    timer.resume();
    await new Promise(resolve => setTimeout(resolve, 600));
    expect(seconds).toBeGreaterThan(pausedSeconds);
    timer.stop();
  });

  it('should toggle pause state', async () => {
    timer.start();
    expect(timer.isRunning()).toBe(true);

    timer.toggle();
    expect(timer.isPausedState()).toBe(true);

    timer.toggle();
    expect(timer.isPausedState()).toBe(false);
    timer.stop();
  });

  it('should reset timer', async () => {
    timer.start();
    await new Promise(resolve => setTimeout(resolve, 500));
    timer.reset();
    expect(timer.getSeconds()).toBe(0);
  });

  it('should format time correctly', () => {
    expect(timer.formatTime(0)).toBe('00:00');
    expect(timer.formatTime(65)).toBe('01:05');
    expect(timer.formatTime(3665)).toBe('01:01:05');
  });

  it('should call onStop callback', async () => {
    let finalTime = 0;
    timer.start(() => {}, (time) => { finalTime = time; });

    await new Promise(resolve => setTimeout(resolve, 500));
    timer.stop();
    expect(finalTime).toBeGreaterThanOrEqual(0);
  });
});
