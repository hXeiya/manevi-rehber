export const colors = {
  background: '#0F1419',
  surface: '#1B2838',
  surfaceLight: '#243447',
  card: '#1E2D3D',
  cardBorder: '#2E4057',
  text: '#F4F1EA',
  textSecondary: '#A8B5C4',
  textMuted: '#6B7C8F',
  accent: '#C9A227',
  accentDark: '#9A7B1A',
  accentSoft: 'rgba(201, 162, 39, 0.15)',
  userBubble: '#2A4A6B',
  aiBubble: '#1E2D3D',
  error: '#E74C3C',
  success: '#27AE60',
  white: '#FFFFFF',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  body: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  caption: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  small: {
    fontSize: 12,
    color: colors.textMuted,
  },
};

import { Platform } from 'react-native';

export const shadows = {
  card: Platform.select({
    web: {
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.25)',
    },
    default: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 6,
    },
  }),
};
