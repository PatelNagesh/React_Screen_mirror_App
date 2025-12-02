// declare module 'react-native-record-screen' {
//   export interface RecordingResponse {
//     status: 'success' | 'cancelled' | 'error';
//     videoFileURL?: string;
//   }

//   export interface StartRecordingOptions {
//     mic?: boolean;
//   }

//   export function startRecording(
//     options?: StartRecordingOptions,
//   ): Promise<RecordingResponse>;

//   export function stopRecording(): Promise<RecordingResponse>;

//   export function clean(): void;

//   const RecordScreen: {
//     startRecording: typeof startRecording;
//     stopRecording: typeof stopRecording;
//     clean: typeof clean;
//   };

//   export default RecordScreen;
// }

