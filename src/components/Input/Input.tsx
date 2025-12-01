import React, { useState, forwardRef } from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';

import { colors, spacing, typography, radii } from '../../theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: string;
  rightIcon?: string;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      onRightIconPress,
      containerStyle,
      inputStyle,
      ...textInputProps
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
      setIsFocused(true);
      textInputProps.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      textInputProps.onBlur?.(e);
    };

    const containerStyles = [
      styles.container,
      isFocused && styles.containerFocused,
      error && styles.containerError,
      containerStyle,
    ];

    const inputStyles = [
      styles.input,
      leftIcon && styles.inputWithLeftIcon,
      rightIcon && styles.inputWithRightIcon,
      inputStyle,
    ];

    return (
      <View style={styles.wrapper}>
        {label && <Text style={styles.label}>{label}</Text>}
        <View style={containerStyles}>
          {leftIcon && (
            <FontAwesome5
              name={leftIcon}
              size={16}
              color={
                error
                  ? colors.error
                  : isFocused
                  ? colors.primary
                  : colors.slate400
              }
              style={styles.leftIcon}
            />
          )}
          <TextInput
            ref={ref}
            style={inputStyles}
            placeholderTextColor={colors.slate400}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...textInputProps}
          />
          {rightIcon && (
            <Feather
              name={rightIcon}
              size={18}
              color={colors.slate400}
              style={styles.rightIcon}
              onPress={onRightIconPress}
            />
          )}
        </View>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.md,
  },
  label: {
    ...typography.caption,
    color: colors.slate700,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    paddingHorizontal: spacing.md,
  },
  containerFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  containerError: {
    borderColor: colors.error,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.slate900,
    paddingVertical: spacing.md,
  },
  inputWithLeftIcon: {
    paddingLeft: spacing.sm,
  },
  inputWithRightIcon: {
    paddingRight: spacing.sm,
  },
  leftIcon: {
    marginRight: spacing.sm,
  },
  rightIcon: {
    marginLeft: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
