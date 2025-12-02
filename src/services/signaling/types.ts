import type { RTCIceCandidate } from 'react-native-webrtc';

export type SignalRole = 'sender' | 'receiver';

export type SignalType = 'offer' | 'answer' | 'candidate';

export interface SignalPayload {
  sessionId: string;
  type: SignalType;
  sdp?: string;
  candidate?: RTCIceCandidate;
}

