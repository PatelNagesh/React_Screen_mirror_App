import { TextStyle } from 'react-native';

type TypographyScale = Record<string, TextStyle>;

export const typography: TypographyScale = {
  headingXL: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 38,
  },
  headingL: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  headingM: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  body: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
};

export type TypographyTokens = typeof typography;

