import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import { startGlobalRecording, stopGlobalRecording } from 'react-native-nitro-screen-recorder';

import type {
  CaptureEvent,
  ScreenCaptureOptions,
  ScreenCaptureResult,
} from './types';

// Nitro module
const { NitroScreenRecorder } = NativeModules;

// Event Emitter
const captureEmitter = NitroScreenRecorder
  ? new NativeEventEmitter(NitroScreenRecorder)
  : null;

// ---------------------------------------------------------------------
// PERMISSION (Android only)
// Nitro handles permissions internally (MediaProjection)
// ---------------------------------------------------------------------
export const requestScreenCapturePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    const granted = await NitroScreenRecorder.requestPermission();
    return granted;
  }
  return true;
};

// ---------------------------------------------------------------------
// START RECORDING
// ---------------------------------------------------------------------
export const startScreenCapture = async (
  options: ScreenCaptureOptions = {
    fps: 0,
    filePath: null
  },
): Promise<ScreenCaptureResult | void> => {
  if (!NitroScreenRecorder) return;

  return NitroScreenRecorder.startRecording({
    audio: options.audio ?? false,
    filepath: options.filePath ?? null,  
    fps: options.fps ?? 30,
    bitrate: options.bitrate ?? 8000000,
  });
};

// ---------------------------------------------------------------------
// STOP RECORDING
// ---------------------------------------------------------------------
export const stopScreenCapture = async (): Promise<ScreenCaptureResult | void> => {
  if (!NitroScreenRecorder) return;
  return NitroScreenRecorder.stopRecording();
};

// ---------------------------------------------------------------------
// CHECK IF RECORDING
// ---------------------------------------------------------------------
export const isScreenCaptureActive = async (): Promise<boolean> => {
  if (!NitroScreenRecorder) return false;
  return NitroScreenRecorder.checkRecording();
};

// ---------------------------------------------------------------------
// ADD EVENT LISTENER (pause/resume/status updates)
// ---------------------------------------------------------------------
export const addScreenCaptureListener = (
  listener: (event: CaptureEvent) => void,
) => {
  if (!captureEmitter) {
    return { remove: () => undefined };
  }

  return captureEmitter.addListener('onRecordingEvent', listener);
};

export type { ScreenCaptureOptions, ScreenCaptureResult } from './types';

