import { NativeEventEmitter, NativeModules, Platform } from 'react-native';
import RecordScreen from 'react-native-record-screen';

import type {
  CaptureEvent,
  ScreenCaptureOptions,
  ScreenCaptureResult,
} from './types';

type ScreenCaptureNativeModule = {
  requestPermission?: () => Promise<boolean>;
  startCapture?: (options?: ScreenCaptureOptions) => Promise<ScreenCaptureResult>;
  stopCapture?: () => Promise<ScreenCaptureResult>;
  isCapturing?: () => Promise<boolean>;
};

const { ScreenCaptureModule } = NativeModules as {
  ScreenCaptureModule?: ScreenCaptureNativeModule;
};

const captureEmitter = ScreenCaptureModule
  ? new NativeEventEmitter(ScreenCaptureModule)
  : null;

export const requestScreenCapturePermission = async (): Promise<boolean> => {
  if (ScreenCaptureModule?.requestPermission) {
    return ScreenCaptureModule.requestPermission();
  }
  if (Platform.OS === 'android') {
    // Permissions are handled when invoking RecordScreen.
    return true;
  }
  return true;
};

export const startScreenCapture = async (
  options: ScreenCaptureOptions = {},
): Promise<ScreenCaptureResult | void> => {
  if (ScreenCaptureModule?.startCapture) {
    return ScreenCaptureModule.startCapture(options);
  }

  return RecordScreen.startRecording({ mic: options.audio ?? false });
};

export const stopScreenCapture = async (): Promise<
  ScreenCaptureResult | void
> => {
  if (ScreenCaptureModule?.stopCapture) {
    return ScreenCaptureModule.stopCapture();
  }

  return RecordScreen.stopRecording();
};

export const isScreenCaptureActive = async (): Promise<boolean> => {
  if (ScreenCaptureModule?.isCapturing) {
    return ScreenCaptureModule.isCapturing();
  }
  return false;
};

export const addScreenCaptureListener = (
  listener: (event: CaptureEvent) => void,
) => {
  if (!captureEmitter) {
    return { remove: () => undefined };
  }

  return captureEmitter.addListener('ScreenCaptureEvent', listener);
};

export { ScreenCaptureOptions, ScreenCaptureResult } from './types';

