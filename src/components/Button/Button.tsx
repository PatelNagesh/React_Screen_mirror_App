import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableStateCallbackType,
  ActivityIndicator,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { colors, spacing, typography, radii, shadows } from '../../theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  style?: any;
}

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
}: ButtonProps): React.ReactElement => {
  const isDisabled = disabled || loading;

  const getButtonStyle = ({ pressed }: PressableStateCallbackType) => [
    styles.button,
    styles[variant],
    styles[size],
    isDisabled && styles.disabled,
    pressed && !isDisabled && styles[`${variant}Pressed`],
    style,
  ];

  const getTextStyle = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
  ];

  const renderIcon = () => {
    if (!icon) return null;

    const iconColor = isDisabled
      ? colors.slate400
      : variant === 'primary'
      ? colors.background
      : colors.primary;

    return (
      <Feather
        name={icon}
        size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16}
        color={iconColor}
        style={iconPosition === 'left' ? styles.iconLeft : styles.iconRight}
      />
    );
  };

  return (
    <Pressable
      onPress={isDisabled ? undefined : onPress}
      style={getButtonStyle}
      disabled={isDisabled}
    >
      {loading && <ActivityIndicator size="small" color={colors.primary} style={styles.loader} />}
      {icon && iconPosition === 'left' && renderIcon()}
      <Text style={getTextStyle}>{title}</Text>
      {icon && iconPosition === 'right' && renderIcon()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
    ...shadows.card,
  },

  // Variants
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.primaryDark,
    transform: [{ scale: 0.98 }],
  },

  secondary: {
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  secondaryPressed: {
    backgroundColor: colors.primaryTransparent,
  },

  outline: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlinePressed: {
    backgroundColor: colors.surfaceMuted,
  },

  ghost: {
    backgroundColor: 'transparent',
    shadowOpacity: 0,
  },
  ghostPressed: {
    backgroundColor: colors.surfaceMuted,
  },

  // Sizes
  sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  md: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  lg: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  // States
  disabled: {
    opacity: 0.6,
  },

  // Text styles
  text: {
    textAlign: 'center',
  },

  primaryText: {
    ...typography.button,
    color: colors.background,
  },

  secondaryText: {
    ...typography.button,
    color: colors.primary,
  },

  outlineText: {
    ...typography.button,
    color: colors.slate900,
  },

  ghostText: {
    ...typography.body,
    color: colors.primary,
  },

  smText: {
    fontSize: 14,
  },

  mdText: {
    fontSize: 16,
  },

  lgText: {
    fontSize: 18,
  },

  disabledText: {
    color: colors.slate400,
  },

  // Icons
  iconLeft: {
    marginRight: spacing.sm,
  },
  iconRight: {
    marginLeft: spacing.sm,
  },

  loader: {
    marginRight: spacing.sm,
  },
});
