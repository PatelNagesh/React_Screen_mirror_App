export type ScreenCaptureResolution = '480p' | '720p' | '1080p' | 'max';

export interface ScreenCaptureOptions {
  audio?: boolean;
  resolution?: ScreenCaptureResolution;
  bitrate?: number;
}

export interface ScreenCaptureResult {
  status?: 'success' | 'cancelled' | 'error';
  videoFileURL?: string;
}

export interface CaptureEvent {
  type: 'started' | 'stopped' | 'error';
  payload?: unknown;
}

