import { useGlobalRecording } from 'react-native-nitro-screen-recorder';

const { isRecording } = useGlobalRecording({
  onRecordingStarted: () => console.log('started'),
  onRecordingFinished: (file) => {
    if (file) {
      console.log('finished:', file.path);
    }
  },
  // onBroadcastPickerShown: () => {
  //   console.log('Perform some action');
  // },
  // onBroadcastPickerDismissed: () => {
  //   console.log('Perform some other action');
  // },
  ignoreRecordingsInitiatedElsewhere: false,
  settledTimeMs: 600,
});