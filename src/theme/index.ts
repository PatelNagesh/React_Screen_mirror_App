import { colors } from './colors';
import { radii, spacing } from './spacing';
import { shadows } from './shadows';
import { typography } from './typography';

export const theme = {
  colors,
  spacing,
  radii,
  shadows,
  typography,
};

export type Theme = typeof theme;

export { colors, spacing, radii, shadows, typography };

