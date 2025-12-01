import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, typography, radii, shadows } from '../../theme';
import { useUserStore } from '../../state';
import { Button, Card, Input } from '../../components';
import type { RootStackParamList } from '../../navigation/types';

type Field = 'email' | 'password' | null;

export const AuthScreen = (): React.ReactElement => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');

  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    continueAsGuest,
    isLoading,
    error,
    clearError,
  } = useUserStore();

  const handleSignInPress = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      clearError();
      if (isSignUp) {
        await signUp(email.trim(), password, name.trim() || undefined);
      } else {
        await signIn(email.trim(), password);
      }
      navigation.navigate('Home');
    } catch (error) {
      // Error is handled by the store
      Alert.alert('Authentication Failed', error instanceof Error ? error.message : 'Please try again');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      await signInWithGoogle();
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Google Sign In Failed', 'Please try again');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      clearError();
      await signInWithApple();
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Apple Sign In Failed', 'Please try again');
    }
  };

  const handleGuestPress = () => {
    continueAsGuest();
    navigation.navigate('Home');
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setName('');
    clearError();
  };

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
          <Text style={styles.heading}>
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </Text>
          <Text style={styles.subheading}>
            {isSignUp ? 'Sign up to start using BeamSync' : 'Sign in to continue to BeamSync'}
          </Text>
        </View>

        <Card style={styles.formSection}>
          {isSignUp && (
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              placeholder="John Doe"
              autoCapitalize="words"
              leftIcon="user"
              textContentType="name"
              accessibilityLabel="Full name"
            />
          )}

          <Input
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            placeholder="name@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon="envelope"
            textContentType="emailAddress"
            accessibilityLabel="Email address"
          />

          <View style={styles.passwordGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Password</Text>
              <Pressable style={styles.linkButton} hitSlop={8} onPress={() => {}}>
                <Text style={styles.linkText}>Forgot?</Text>
              </Pressable>
            </View>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!isPasswordVisible}
              autoCapitalize="none"
              leftIcon="lock"
              rightIcon={isPasswordVisible ? 'eye-off' : 'eye'}
              onRightIconPress={() => setIsPasswordVisible(prev => !prev)}
              textContentType="password"
              accessibilityLabel="Password"
              error={error || undefined}
            />
          </View>

          <Button
            title={isLoading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Sign In')}
            onPress={handleSignInPress}
            disabled={isLoading}
            loading={isLoading}
            icon="arrow-right"
            iconPosition="right"
            size="lg"
            style={styles.signInButton}
          />
        </Card>
        </View>

        <View style={styles.dividerBlock}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <Button
            title="Google"
            onPress={handleGoogleSignIn}
            disabled={isLoading}
            variant="outline"
            icon="google"
            style={styles.socialButton}
          />
          <Button
            title="Apple"
            onPress={handleAppleSignIn}
            disabled={isLoading}
            variant="outline"
            icon="apple1"
            style={styles.socialButton}
          />
        </View>

        <Button
          title="Continue as Guest"
          onPress={handleGuestPress}
          variant="secondary"
          size="lg"
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </Text>
          <Pressable onPress={toggleMode} hitSlop={8}>
            <Text style={styles.footerLink}>
              {isSignUp ? 'Sign in' : 'Sign up'}
            </Text>
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
  passwordGroup: {
    marginBottom: spacing.lg,
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
  },
  signInButton: {
    marginBottom: spacing.lg,
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

