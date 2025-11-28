import { io, Socket } from 'socket.io-client';

import type { SignalPayload, SignalRole } from './types';

class SignalingClient {
  private socket: Socket | null = null;
  private endpoint?: string;

  connect(baseUrl: string) {
    if (this.socket && this.endpoint === baseUrl) {
      return;
    }
    this.disconnect();
    this.endpoint = baseUrl;
    this.socket = io(baseUrl, {
      transports: ['websocket'],
    });
  }

  joinSession(params: { sessionId: string; role: SignalRole }) {
    this.socket?.emit('join-session', params);
  }

  emitSignal(payload: SignalPayload) {
    this.socket?.emit('signal', payload);
  }

  onSignal(listener: (payload: SignalPayload) => void) {
    this.socket?.on('signal', listener);
  }

  offSignal(listener: (payload: SignalPayload) => void) {
    this.socket?.off('signal', listener);
  }

  disconnect() {
    this.socket?.removeAllListeners();
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const signalingClient = new SignalingClient();

