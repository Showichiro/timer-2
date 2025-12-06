import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, cleanup } from '@testing-library/svelte';
import TimeInput from './TimeInput.svelte';

describe('TimeInput', () => {
  afterEach(() => {
    cleanup();
  });

  describe('入力フィールド表示', () => {
    it('時・分・秒の入力フィールドを表示する', () => {
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange: () => {}
        }
      });

      expect(getByTestId('hours-input')).toBeTruthy();
      expect(getByTestId('minutes-input')).toBeTruthy();
      expect(getByTestId('seconds-input')).toBeTruthy();
    });

    it('初期値を正しく表示する', () => {
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 1,
          minutes: 30,
          seconds: 45,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange: () => {}
        }
      });

      expect((getByTestId('hours-input') as HTMLInputElement).value).toBe('1');
      expect((getByTestId('minutes-input') as HTMLInputElement).value).toBe('30');
      expect((getByTestId('seconds-input') as HTMLInputElement).value).toBe('45');
    });
  });

  describe('無効化', () => {
    it('disabled=trueのとき入力フィールドが無効になる', () => {
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: true,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange: () => {}
        }
      });

      expect((getByTestId('hours-input') as HTMLInputElement).disabled).toBe(true);
      expect((getByTestId('minutes-input') as HTMLInputElement).disabled).toBe(true);
      expect((getByTestId('seconds-input') as HTMLInputElement).disabled).toBe(true);
    });
  });

  describe('値変更コールバック', () => {
    it('時間入力でonHoursChangeが呼ばれる', async () => {
      const onHoursChange = vi.fn();
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange,
          onMinutesChange: () => {},
          onSecondsChange: () => {}
        }
      });

      const hoursInput = getByTestId('hours-input');
      await fireEvent.input(hoursInput, { target: { value: '2' } });
      expect(onHoursChange).toHaveBeenCalledWith(2);
    });

    it('分入力でonMinutesChangeが呼ばれる', async () => {
      const onMinutesChange = vi.fn();
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange,
          onSecondsChange: () => {}
        }
      });

      const minutesInput = getByTestId('minutes-input');
      await fireEvent.input(minutesInput, { target: { value: '15' } });
      expect(onMinutesChange).toHaveBeenCalledWith(15);
    });

    it('秒入力でonSecondsChangeが呼ばれる', async () => {
      const onSecondsChange = vi.fn();
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange
        }
      });

      const secondsInput = getByTestId('seconds-input');
      await fireEvent.input(secondsInput, { target: { value: '30' } });
      expect(onSecondsChange).toHaveBeenCalledWith(30);
    });
  });

  describe('値の補正（blur時）', () => {
    it('時間が99を超えるとblur時に99に補正される', async () => {
      const onHoursChange = vi.fn();
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 100,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange,
          onMinutesChange: () => {},
          onSecondsChange: () => {}
        }
      });

      const hoursInput = getByTestId('hours-input');
      await fireEvent.blur(hoursInput);
      expect(onHoursChange).toHaveBeenCalledWith(99);
    });

    it('分が59を超えるとblur時に59に補正される', async () => {
      const onMinutesChange = vi.fn();
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 0,
          minutes: 65,
          seconds: 0,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange,
          onSecondsChange: () => {}
        }
      });

      const minutesInput = getByTestId('minutes-input');
      await fireEvent.blur(minutesInput);
      expect(onMinutesChange).toHaveBeenCalledWith(59);
    });

    it('秒が59を超えるとblur時に59に補正される', async () => {
      const onSecondsChange = vi.fn();
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: 0,
          minutes: 5,
          seconds: 70,
          disabled: false,
          onHoursChange: () => {},
          onMinutesChange: () => {},
          onSecondsChange
        }
      });

      const secondsInput = getByTestId('seconds-input');
      await fireEvent.blur(secondsInput);
      expect(onSecondsChange).toHaveBeenCalledWith(59);
    });

    it('負の値はblur時に0に補正される', async () => {
      const onHoursChange = vi.fn();
      const { getByTestId } = render(TimeInput, {
        props: {
          hours: -5,
          minutes: 5,
          seconds: 0,
          disabled: false,
          onHoursChange,
          onMinutesChange: () => {},
          onSecondsChange: () => {}
        }
      });

      const hoursInput = getByTestId('hours-input');
      await fireEvent.blur(hoursInput);
      expect(onHoursChange).toHaveBeenCalledWith(0);
    });
  });
});
