import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { playAlarm, getAudioContext, resetAudioContext } from './audio';

describe('audio', () => {
  let mockOscillator: {
    connect: ReturnType<typeof vi.fn>;
    start: ReturnType<typeof vi.fn>;
    stop: ReturnType<typeof vi.fn>;
    type: string;
    frequency: { value: number };
  };

  let mockGainNode: {
    connect: ReturnType<typeof vi.fn>;
    gain: { value: number };
  };

  let mockAudioContext: {
    createOscillator: ReturnType<typeof vi.fn>;
    createGain: ReturnType<typeof vi.fn>;
    destination: {};
    currentTime: number;
  };

  beforeEach(() => {
    resetAudioContext();

    mockOscillator = {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      type: '',
      frequency: { value: 0 }
    };

    mockGainNode = {
      connect: vi.fn(),
      gain: { value: 0 }
    };

    mockAudioContext = {
      createOscillator: vi.fn(() => mockOscillator),
      createGain: vi.fn(() => mockGainNode),
      destination: {},
      currentTime: 0
    };

    // Use class syntax for proper constructor mocking
    class MockAudioContext {
      createOscillator = mockAudioContext.createOscillator;
      createGain = mockAudioContext.createGain;
      destination = mockAudioContext.destination;
      currentTime = mockAudioContext.currentTime;
    }

    vi.stubGlobal('AudioContext', MockAudioContext);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('getAudioContext', () => {
    it('AudioContextのインスタンスを返す', () => {
      const ctx = getAudioContext();

      expect(ctx).toBeDefined();
      expect(ctx.createOscillator).toBe(mockAudioContext.createOscillator);
    });

    it('同じインスタンスを再利用する（シングルトン）', () => {
      const ctx1 = getAudioContext();
      const ctx2 = getAudioContext();

      expect(ctx1).toBe(ctx2);
    });
  });

  describe('playAlarm', () => {
    it('Oscillatorを作成して接続する', () => {
      playAlarm();

      expect(mockAudioContext.createOscillator).toHaveBeenCalled();
      expect(mockAudioContext.createGain).toHaveBeenCalled();
      expect(mockOscillator.connect).toHaveBeenCalledWith(mockGainNode);
      expect(mockGainNode.connect).toHaveBeenCalledWith(mockAudioContext.destination);
    });

    it('デフォルトのパラメータで再生する', () => {
      playAlarm();

      expect(mockOscillator.type).toBe('sine');
      expect(mockOscillator.frequency.value).toBe(800);
      expect(mockGainNode.gain.value).toBe(0.5);
      expect(mockOscillator.start).toHaveBeenCalled();
      expect(mockOscillator.stop).toHaveBeenCalledWith(0.5); // 500ms = 0.5s
    });

    it('カスタムパラメータで再生できる', () => {
      playAlarm({ duration: 1000, frequency: 440, volume: 0.8 });

      expect(mockOscillator.frequency.value).toBe(440);
      expect(mockGainNode.gain.value).toBe(0.8);
      expect(mockOscillator.stop).toHaveBeenCalledWith(1); // 1000ms = 1s
    });

    it('音量が0-1の範囲に制限される', () => {
      playAlarm({ volume: 1.5 });
      expect(mockGainNode.gain.value).toBe(1);

      resetAudioContext();
      playAlarm({ volume: -0.5 });
      expect(mockGainNode.gain.value).toBe(0);
    });
  });
});
