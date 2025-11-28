import { create } from 'zustand';

import {
  requestScreenCapturePermission,
  startScreenCapture,
  stopScreenCapture,
  type ScreenCaptureOptions,
} from '../modules/capture/screenCapture';

interface CaptureState {
  isCapturing: boolean;
  lastRecordingPath?: string;
  error?: string;
  startCapture: (options?: ScreenCaptureOptions) => Promise<void>;
  stopCapture: () => Promise<void>;
}

export const useCaptureStore = create<CaptureState>(set => ({
  isCapturing: false,
  lastRecordingPath: undefined,
  error: undefined,
  startCapture: async (options?: ScreenCaptureOptions) => {
    try {
      const granted = await requestScreenCapturePermission();
      if (!granted) {
        set({ error: 'Screen capture permission denied' });
        return;
      }
      await startScreenCapture(options);
      set({ isCapturing: true, error: undefined });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to start screen capture',
      });
    }
  },
  stopCapture: async () => {
    try {
      const result = await stopScreenCapture();
      set({
        isCapturing: false,
        lastRecordingPath: result?.videoFileURL,
        error: undefined,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : 'Unable to stop screen capture',
      });
    }
  },
}));

