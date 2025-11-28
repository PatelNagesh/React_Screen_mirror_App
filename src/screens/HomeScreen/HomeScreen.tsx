import React, { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
} from 'react-native';
import { RTCView } from 'react-native-webrtc';

import { useWebRtcDemo } from '../../modules';
import { appConfig, SignalRole } from '../../services';
import { colors, spacing, typography, radii } from '../../theme';
import { useCaptureStore } from '../../state';

export const HomeScreen = (): React.ReactElement => {
  const [sessionId, setSessionId] = useState('demo-room');
  const [role, setRole] = useState<SignalRole>('sender');
  const [endpoint, setEndpoint] = useState(appConfig.signalingUrl);
  const { status, localStream, remoteStream, startSession, endSession } =
    useWebRtcDemo();
  const {
    isCapturing,
    startCapture,
    stopCapture,
    lastRecordingPath,
    error: captureError,
  } = useCaptureStore();

  const isActive = status === 'connected' || status === 'connecting';
  const localStreamUrl = useMemo(
    () => localStream?.toURL() ?? '',
    [localStream],
  );
  const remoteStreamUrl = useMemo(
    () => remoteStream?.toURL() ?? '',
    [remoteStream],
  );
  const statusColor = useMemo(() => {
    switch (status) {
      case 'connected':
        return colors.success;
      case 'connecting':
        return colors.warning;
      case 'error':
        return colors.error;
      default:
        return colors.border;
    }
  }, [status]);

  const handleSessionToggle = async () => {
    if (isActive) {
      endSession();
      return;
    }
    if (!sessionId.trim()) {
      return;
    }
    await startSession({
      sessionId: sessionId.trim(),
      role,
      endpoint: endpoint.trim() || appConfig.signalingUrl,
    });
  };

  const handleCaptureToggle = async () => {
    if (isCapturing) {
      await stopCapture();
      return;
    }
    await startCapture({ audio: true, resolution: '720p' });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Realtime Demo</Text>
      <Text style={styles.subtitle}>
        Use this space to validate Socket.IO signaling + WebRTC plumbing before
        wiring up UI flows.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Session parameters</Text>
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Session ID</Text>
          <TextInput
            value={sessionId}
            onChangeText={setSessionId}
            style={styles.input}
            placeholder="demo-room"
            placeholderTextColor={colors.slate400}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Signaling URL</Text>
          <TextInput
            value={endpoint}
            onChangeText={setEndpoint}
            style={styles.input}
            placeholder={appConfig.signalingUrl}
            placeholderTextColor={colors.slate400}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.roleRow}>
          {(['sender', 'receiver'] as SignalRole[]).map(item => (
            <Pressable
              key={item}
              onPress={() => setRole(item)}
              style={[
                styles.roleButton,
                role === item && styles.roleButtonSelected,
              ]}>
              <Text
                style={[
                  styles.roleButtonText,
                  role === item && styles.roleButtonTextSelected,
                ]}>
                {item === 'sender' ? 'Sender' : 'Receiver'}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable
          onPress={handleSessionToggle}
          style={[
            styles.primaryButton,
            isActive && styles.primaryButtonActive,
          ]}>
          <Text style={styles.primaryButtonLabel}>
            {isActive ? 'End Session' : 'Start Session'}
          </Text>
        </Pressable>

        <View style={styles.statusRow}>
          <Text style={styles.statusLabel}>Status</Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={styles.statusValue}>{status}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Capture controls</Text>
        <Text style={styles.helperBody}>
          Native modules will eventually own MediaProjection/ReplayKit, but this
          shim keeps RN wiring ready.
        </Text>
        <Pressable
          onPress={handleCaptureToggle}
          style={[
            styles.primaryButton,
            isCapturing && styles.primaryButtonActive,
          ]}>
          <Text style={styles.primaryButtonLabel}>
            {isCapturing ? 'Stop Capture' : 'Start Capture'}
          </Text>
        </Pressable>
        {lastRecordingPath ? (
          <View style={styles.chip}>
            <Text style={styles.chipLabel} numberOfLines={1}>
              Saved: {lastRecordingPath}
            </Text>
          </View>
        ) : null}
        {captureError ? (
          <Text style={styles.errorText}>{captureError}</Text>
        ) : null}
      </View>

      <View style={styles.previewRow}>
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Local Preview</Text>
          {localStreamUrl ? (
            <RTCView streamURL={localStreamUrl} style={styles.video} />
          ) : (
            <Text style={styles.previewPlaceholder}>
              Starts when session is active.
            </Text>
          )}
        </View>
        <View style={styles.previewCard}>
          <Text style={styles.previewTitle}>Remote Preview</Text>
          {remoteStreamUrl ? (
            <RTCView streamURL={remoteStreamUrl} style={styles.video} />
          ) : (
            <Text style={styles.previewPlaceholder}>
              Waiting for a peer to join room.
            </Text>
          )}
        </View>
      </View>

      <Text style={styles.helperText}>
        Tip: run `npm install && npm run dev` inside `/server` to bring the
        Socket.IO relay online.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  title: {
    ...typography.headingL,
    color: colors.slate900,
  },
  subtitle: {
    ...typography.body,
    color: colors.slate600,
  },
  card: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    borderRadius: radii.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.headingM,
    color: colors.slate900,
  },
  helperBody: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    color: colors.slate600,
    textTransform: 'uppercase',
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceMuted,
    ...typography.body,
    color: colors.slate900,
  },
  roleRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  roleButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  roleButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTransparent,
  },
  roleButtonText: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  roleButtonTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  primaryButtonActive: {
    backgroundColor: colors.error,
  },
  primaryButtonLabel: {
    ...typography.button,
    color: colors.background,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statusLabel: {
    ...typography.bodySmall,
    color: colors.slate600,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusValue: {
    ...typography.bodySmall,
    color: colors.slate700,
    textTransform: 'capitalize',
  },
  previewRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  previewCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.sm,
    minHeight: 200,
  },
  previewTitle: {
    ...typography.bodySmall,
    color: colors.slate600,
    textTransform: 'uppercase',
  },
  video: {
    flex: 1,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
  },
  previewPlaceholder: {
    ...typography.bodySmall,
    color: colors.slate500,
  },
  helperText: {
    ...typography.caption,
    color: colors.slate500,
    textAlign: 'center',
  },
  chip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    alignSelf: 'stretch',
  },
  chipLabel: {
    ...typography.caption,
    color: colors.slate600,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
});

