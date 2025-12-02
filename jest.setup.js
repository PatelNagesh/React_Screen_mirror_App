/* eslint-env jest */

require('react-native-gesture-handler/jestSetup');

jest.mock('react-native-webrtc', () => {
  const mockStream = {
    getTracks: () => [],
    toURL: () => '',
  };

  const RTCPeerConnection = jest.fn().mockImplementation(() => ({
    addTrack: jest.fn(),
    createOffer: jest.fn().mockResolvedValue({ type: 'offer', sdp: 'mock' }),
    createAnswer: jest.fn().mockResolvedValue({ type: 'answer', sdp: 'mock' }),
    setLocalDescription: jest.fn().mockResolvedValue(undefined),
    setRemoteDescription: jest.fn().mockResolvedValue(undefined),
    addIceCandidate: jest.fn().mockResolvedValue(undefined),
    close: jest.fn(),
    onicecandidate: null,
    ontrack: null,
  }));

  const RTCView = () => null;

  return {
    RTCPeerConnection,
    RTCSessionDescription: jest.fn(),
    RTCIceCandidate: jest.fn(),
    mediaDevices: {
      getUserMedia: jest.fn().mockResolvedValue(mockStream),
    },
    RTCView,
  };
});

// ⛔ REMOVE this old mock:
// jest.mock('react-native-record-screen', () => ({
//   startRecording: jest.fn().mockResolvedValue({ status: 'success' }),
//   stopRecording: jest.fn().mockResolvedValue({ status: 'success' }),
//   clean: jest.fn(),
//   default: {
//     startRecording: jest.fn().mockResolvedValue({ status: 'success' }),
//     stopRecording: jest.fn().mockResolvedValue({ status: 'success' }),
//     clean: jest.fn(),
//   },
// }));

// ✅ NEW MOCK FOR Nitro Screen Recorder
jest.mock('react-native-nitro-screen-recorder', () => ({
  requestPermission: jest.fn().mockResolvedValue(true),
  startRecording: jest.fn().mockResolvedValue({ status: 'success', filePath: '/tmp/demo.mp4' }),
  stopRecording: jest.fn().mockResolvedValue({ status: 'success', filePath: '/tmp/demo.mp4' }),
  checkRecording: jest.fn().mockResolvedValue(false),
  default: {
    requestPermission: jest.fn().mockResolvedValue(true),
    startRecording: jest.fn().mockResolvedValue({ status: 'success', filePath: '/tmp/demo.mp4' }),
    stopRecording: jest.fn().mockResolvedValue({ status: 'success', filePath: '/tmp/demo.mp4' }),
    checkRecording: jest.fn().mockResolvedValue(false),
  },
}));
