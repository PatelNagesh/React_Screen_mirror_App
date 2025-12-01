import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  PressableStateCallbackType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, typography, radii, shadows } from '../../theme';
import type { RootStackParamList } from '../../navigation/types';

type Field = 'email' | 'password' | null;

export const AuthScreen = (): React.ReactElement => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedField, setFocusedField] = useState<Field>(null);

  const inputState = useMemo(
    () => ({
      email: focusedField === 'email',
      password: focusedField === 'password',
    }),
    [focusedField],
  );

  const handleSignInPress = () => {
    // TODO: Replace placeholder navigation with actual auth logic.
    navigation.navigate('Home');
  };

  const handleGuestPress = () => {
    navigation.navigate('Home');
  };

  const renderPressableStyle =
    (baseStyle: object, pressedStyle: object = {}) =>
    ({ pressed }: PressableStateCallbackType) => [
      baseStyle,
      pressed && pressedStyle,
    ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.flex}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View style={styles.logo}>
            <FontAwesome5 name="bolt" size={26} color={colors.primary} />
          </View>
          <Text style={styles.heading}>Welcome Back</Text>
          <Text style={styles.subheading}>
            Sign in to continue to BeamSync
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View
              style={[
                styles.inputWrapper,
                inputState.email && styles.inputFocused,
              ]}>
              <FontAwesome5
                name="envelope"
                size={16}
                color={inputState.email ? colors.primary : colors.slate400}
                style={styles.leftIcon}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                placeholder="name@example.com"
                placeholderTextColor={colors.slate400}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                textContentType="emailAddress"
                accessibilityLabel="Email address"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <Pressable
                style={styles.linkButton}
                hitSlop={8}
                onPress={() => {}}>
                <Text style={styles.linkText}>Forgot?</Text>
              </Pressable>
            </View>
            <View
              style={[
                styles.inputWrapper,
                inputState.password && styles.inputFocused,
              ]}>
              <FontAwesome5
                name="lock"
                size={16}
                color={inputState.password ? colors.primary : colors.slate400}
                style={styles.leftIcon}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                placeholder="••••••••"
                placeholderTextColor={colors.slate400}
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                style={styles.input}
                textContentType="password"
                accessibilityLabel="Password"
              />
              <Pressable
                onPress={() => setIsPasswordVisible(prev => !prev)}
                style={styles.eyeButton}
                hitSlop={8}>
                <Feather
                  name={isPasswordVisible ? 'eye-off' : 'eye'}
                  size={18}
                  color={colors.slate400}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleSignInPress}
            style={renderPressableStyle(
              styles.primaryButton,
              styles.primaryButtonPressed,
            )}>
            <Text style={styles.primaryButtonText}>Sign In</Text>
            <Feather name="arrow-right" size={16} color={colors.background} />
          </Pressable>
        </View>

        <View style={styles.dividerBlock}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Pressable
            style={renderPressableStyle(
              styles.socialButton,
              styles.socialButtonPressed,
            )}>
            <AntDesign name="google" size={18} color={colors.slate700} />
            <Text style={styles.socialLabel}>Google</Text>
          </Pressable>
          <Pressable
            style={renderPressableStyle(
              styles.socialButton,
              styles.socialButtonPressed,
            )}>
            <AntDesign name="apple1" size={20} color={colors.slate900} />
            <Text style={styles.socialLabel}>Apple</Text>
          </Pressable>
        </View>

        <Pressable
          onPress={handleGuestPress}
          style={renderPressableStyle(
            styles.secondaryButton,
            styles.secondaryButtonPressed,
          )}>
          <Text style={styles.secondaryButtonText}>Continue as Guest</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account?</Text>
          <Pressable onPress={() => {}} hitSlop={8}>
            <Text style={styles.footerLink}>Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    minHeight: '100%',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.primaryTransparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heading: {
    ...typography.headingL,
    color: colors.slate900,
  },
  subheading: {
    ...typography.bodySmall,
    color: colors.slate500,
    marginTop: spacing.xs,
  },
  formSection: {
    rowGap: spacing.lg,
    marginBottom: spacing.xl,
  },
  formGroup: {
    rowGap: spacing.sm,
  },
  label: {
    ...typography.caption,
    color: colors.slate700,
    textTransform: 'uppercase',
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  linkButton: {
    paddingHorizontal: spacing.xs,
    paddingVertical: spacing.xs / 2,
  },
  linkText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.slate800 ?? colors.slate700,
    paddingVertical: spacing.md,
  },
  eyeButton: {
    paddingLeft: spacing.sm,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    ...shadows.card,
  },
  primaryButtonPressed: {
    transform: [{ scale: 0.98 }],
    backgroundColor: colors.primaryDark,
  },
  primaryButtonText: {
    ...typography.button,
    color: colors.background,
  },
  dividerBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: spacing.sm,
    marginBottom: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    ...typography.caption,
    color: colors.slate400,
    textTransform: 'uppercase',
  },
  socialRow: {
    flexDirection: 'row',
    columnGap: spacing.md,
    marginBottom: spacing.lg,
  },
  socialButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: spacing.sm,
    backgroundColor: colors.background,
  },
  socialButtonPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  socialLabel: {
    ...typography.bodySmall,
    color: colors.slate700,
    fontWeight: '600',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  secondaryButtonPressed: {
    backgroundColor: colors.primaryTransparent,
  },
  secondaryButtonText: {
    ...typography.button,
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    columnGap: spacing.xs,
  },
  footerText: {
    ...typography.bodySmall,
    color: colors.slate500,
  },
  footerLink: {
    ...typography.bodySmall,
    color: colors.primary,
    fontWeight: '700',
  },
});

