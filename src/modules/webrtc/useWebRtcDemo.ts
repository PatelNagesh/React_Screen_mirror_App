import { useCallback, useRef, useState } from 'react';
import {
  mediaDevices,
  MediaStream,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCPeerConnection,
} from 'react-native-webrtc';

import { appConfig } from '../../services/config';
import { signalingClient } from '../../services/signaling/signalingClient';
import type { SignalPayload, SignalRole } from '../../services/signaling/types';
import RTCTrackEvent from 'react-native-webrtc/lib/typescript/RTCTrackEvent';

const ICE_SERVERS = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
];

type SessionStatus = 'idle' | 'connecting' | 'connected' | 'error';

interface StartSessionParams {
  sessionId: string;
  role: SignalRole;
  endpoint?: string;
}

interface UseWebRtcDemoResult {
  status: SessionStatus;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  startSession: (params: StartSessionParams) => Promise<void>;
  endSession: () => void;
}

export const useWebRtcDemo = (): UseWebRtcDemoResult => {
  const [status, setStatus] = useState<SessionStatus>('idle');
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const signalHandlerRef = useRef<((payload: SignalPayload) => void) | null>(
    null,
  );

  const cleanup = useCallback(() => {
    signalHandlerRef.current &&
      signalingClient.offSignal(signalHandlerRef.current);
    signalHandlerRef.current = null;

    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;

    localStream?.getTracks().forEach(track => track.stop());
    remoteStream?.getTracks().forEach(track => track.stop());

    setLocalStream(null);
    setRemoteStream(null);
    signalingClient.disconnect();
    setStatus('idle');
  }, [localStream, remoteStream]);

  const startSession = useCallback(
    async ({
      sessionId,
      role,
      endpoint = appConfig.signalingUrl,
    }: StartSessionParams) => {
      try {
        setStatus('connecting');
        signalingClient.connect(endpoint);
        signalingClient.joinSession({ sessionId, role });

        const peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });
        peerConnectionRef.current = peerConnection;

        // Override addIceCandidate to match original signature (Promise-based)
        peerConnection.addIceCandidate = async (candidate: RTCIceCandidate) => {
          signalingClient.emitSignal({
            sessionId,
            type: 'candidate',
            candidate,
          });
          // Method is expected to return Promise<void>
          return Promise.resolve();
        };

        // @ts-ignore - react-native-webrtc uses ontrack property
        peerConnection.ontrack = (event: RTCTrackEvent<'track'>) => {
          const [stream] = event.streams;
          if (stream) {
            setRemoteStream(stream);
          }
        };

        const mediaStream = await mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        setLocalStream(mediaStream);
        mediaStream.getTracks().forEach(track => {
          peerConnection.addTrack(track, mediaStream);
        });

        const handleSignal = async (payload: SignalPayload) => {
          if (!peerConnectionRef.current) {
            return;
          }
          if (payload.type === 'offer' && role === 'receiver') {
            const offerDescription = new RTCSessionDescription({
              type: 'offer',
              sdp: payload.sdp ?? '',
            });
            await peerConnectionRef.current.setRemoteDescription(
              offerDescription,
            );
            const answer = await peerConnectionRef.current.createAnswer();
            await peerConnectionRef.current.setLocalDescription(answer);
            signalingClient.emitSignal({
              sessionId,
              type: 'answer',
              sdp: answer.sdp ?? '',
            });
          } else if (payload.type === 'answer' && role === 'sender') {
            const answerDescription = new RTCSessionDescription({
              type: 'answer',
              sdp: payload.sdp ?? '',
            });
            await peerConnectionRef.current.setRemoteDescription(
              answerDescription,
            );
          } else if (payload.type === 'candidate' && payload.candidate) {
            try {
              await peerConnectionRef.current.addIceCandidate(
                new RTCIceCandidate(payload.candidate),
              );
            } catch (error) {
              console.warn('Failed to add ICE candidate', error);
            }
          }
        };

        signalingClient.onSignal(handleSignal);
        signalHandlerRef.current = handleSignal;

        if (role === 'sender') {
          const offer = await peerConnection.createOffer({});
          await peerConnection.setLocalDescription(offer);
          signalingClient.emitSignal({
            sessionId,
            type: 'offer',
            sdp: offer.sdp ?? '',
          });
        }

        setStatus('connected');
      } catch (error) {
        console.error('Unable to start WebRTC session', error);
        setStatus('error');
      }
    },
    [],
  );

  const endSession = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return {
    status,
    localStream,
    remoteStream,
    startSession,
    endSession,
  };
};

