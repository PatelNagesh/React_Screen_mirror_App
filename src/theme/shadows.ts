import { Platform } from 'react-native';

const iosCardShadow = {
  shadowColor: 'rgba(15, 23, 42, 0.2)',
  shadowOffset: { width: 0, height: 12 },
  shadowOpacity: 0.18,
  shadowRadius: 24,
};

const androidCardShadow = {
  elevation: 8,
};

export const shadows = {
  card: Platform.select({
    ios: iosCardShadow,
    android: androidCardShadow,
    default: {},
  }),
} as const;

export type ShadowTokens = typeof shadows;

