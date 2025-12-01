import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

import { colors, spacing, typography, radii, shadows } from '../../theme';
import { useUserStore } from '../../state';
import type { RootStackParamList } from '../../navigation/types';

export const ProfileScreen = (): React.ReactElement => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user, signOut, continueAsGuest } = useUserStore();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            signOut();
            navigation.navigate('Auth');
          },
        },
      ]
    );
  };

  const handleContinueAsGuest = () => {
    Alert.alert(
      'Continue as Guest',
      'Are you sure you want to continue as a guest? Your current session will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            continueAsGuest();
            navigation.navigate('Auth');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Manage your account settings</Text>
      </View>

      {user ? (
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user.avatar ? (
              <Text style={styles.avatarText}>
                {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
              </Text>
            ) : (
              <FontAwesome5 name="user-circle" size={60} color={colors.primary} />
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name || 'User'}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>
      ) : (
        <View style={styles.guestSection}>
          <FontAwesome5 name="user-circle" size={48} color={colors.slate400} />
          <Text style={styles.guestText}>You're browsing as a guest</Text>
          <Text style={styles.guestSubtext}>
            Sign in to access all features and save your preferences
          </Text>
        </View>
      )}

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Account</Text>

        {user ? (
          <>
            <Pressable style={styles.menuItem}>
              <FontAwesome5 name="user-edit" size={20} color={colors.slate600} />
              <Text style={styles.menuItemText}>Edit Profile</Text>
              <Feather name="chevron-right" size={20} color={colors.slate400} />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <FontAwesome5 name="shield-alt" size={20} color={colors.slate600} />
              <Text style={styles.menuItemText}>Privacy & Security</Text>
              <Feather name="chevron-right" size={20} color={colors.slate400} />
            </Pressable>

            <Pressable style={styles.menuItem}>
              <FontAwesome5 name="bell" size={20} color={colors.slate600} />
              <Text style={styles.menuItemText}>Notifications</Text>
              <Feather name="chevron-right" size={20} color={colors.slate400} />
            </Pressable>

            <View style={styles.divider} />

            <Pressable style={[styles.menuItem, styles.signOutItem]} onPress={handleSignOut}>
              <FontAwesome5 name="sign-out-alt" size={20} color={colors.error} />
              <Text style={[styles.menuItemText, styles.signOutText]}>Sign Out</Text>
            </Pressable>
          </>
        ) : (
          <>
            <Pressable
              style={styles.menuItem}
              onPress={() => navigation.navigate('Auth')}
            >
              <FontAwesome5 name="sign-in-alt" size={20} color={colors.primary} />
              <Text style={[styles.menuItemText, styles.primaryText]}>Sign In</Text>
              <Feather name="chevron-right" size={20} color={colors.slate400} />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
              style={[styles.menuItem, styles.signOutItem]}
              onPress={handleContinueAsGuest}
            >
              <FontAwesome5 name="user-circle" size={20} color={colors.slate600} />
              <Text style={styles.menuItemText}>Continue as Guest</Text>
            </Pressable>
          </>
        )}
      </View>

      <View style={styles.menuSection}>
        <Text style={styles.sectionTitle}>Support</Text>

        <Pressable style={styles.menuItem}>
          <FontAwesome5 name="question-circle" size={20} color={colors.slate600} />
          <Text style={styles.menuItemText}>Help & Support</Text>
          <Feather name="chevron-right" size={20} color={colors.slate400} />
        </Pressable>

        <Pressable style={styles.menuItem}>
          <FontAwesome5 name="info-circle" size={20} color={colors.slate600} />
          <Text style={styles.menuItemText}>About BeamSync</Text>
          <Feather name="chevron-right" size={20} color={colors.slate400} />
        </Pressable>
      </View>

      <View style={styles.versionSection}>
        <Text style={styles.versionText}>BeamSync v0.0.1</Text>
      </View>
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
    paddingTop: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.headingL,
    color: colors.slate900,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.slate500,
  },
  profileSection: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryTransparent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarText: {
    ...typography.headingL,
    color: colors.primary,
    fontSize: 32,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    ...typography.headingM,
    color: colors.slate900,
    marginBottom: spacing.xs,
  },
  userEmail: {
    ...typography.body,
    color: colors.slate600,
  },
  guestSection: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  guestText: {
    ...typography.body,
    color: colors.slate900,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  guestSubtext: {
    ...typography.caption,
    color: colors.slate500,
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  sectionTitle: {
    ...typography.caption,
    color: colors.slate600,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surfaceMuted,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemText: {
    ...typography.body,
    color: colors.slate900,
    flex: 1,
    marginLeft: spacing.md,
  },
  primaryText: {
    color: colors.primary,
  },
  signOutItem: {
    borderBottomWidth: 0,
  },
  signOutText: {
    color: colors.error,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  versionSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  versionText: {
    ...typography.caption,
    color: colors.slate500,
  },
});
