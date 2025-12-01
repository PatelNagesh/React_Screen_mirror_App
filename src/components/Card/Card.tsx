import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { colors, spacing, radii } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof spacing;
  shadow?: boolean;
}

export const Card = ({
  children,
  style,
  padding = 'lg',
  shadow = true,
}: CardProps): React.ReactElement => {
  return (
    <View
      style={[
        styles.card,
        { padding: spacing[padding] },
        shadow && styles.shadow,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  shadow: {
    shadowColor: colors.slate900,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
