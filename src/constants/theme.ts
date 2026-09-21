export const colors = {
  // Brand Pink (Signature Accent)
  brandPink: '#E83E8C',
  pinkDark: '#C72F73',
  pinkSoft: '#FCE7F3',
  pinkVerySoft: '#FFF4F9',
  pinkBorder: '#F7C4DB',

  // Primary Blue (Structure, Search, Links)
  primaryBlue: '#3B5BDB',
  blueDeep: '#263B8F',
  blueSoft: '#EEF4FF',
  blueVerySoft: '#F6F8FF',
  blueBorder: '#D8E2FF',

  // Aliases for compatibility
  primary: '#E83E8C', // Brand signature
  primaryDark: '#C72F73',
  primaryLight: '#FFF4F9',
  primaryBorder: '#F7C4DB',
  secondary: '#3B5BDB',
  secondaryLight: '#EEF4FF',

  // Surfaces & Backgrounds
  background: '#F8FAFC',
  card: '#FFFFFF',
  cardSubtle: '#F6F8FF',
  surfaceSoftBlue: '#EEF4FF',
  surfaceSoftPink: '#FFF4F9',
  surfaceMuted: '#F1F5F9',
  border: '#E6EAF0',
  borderLight: '#EEF1F5',
  divider: '#EEF1F5',

  // Text Hierarchy
  textPrimary: '#172033',
  textSecondary: '#667085',
  textMuted: '#98A2B3',
  white: '#FFFFFF',

  // Semantic Status
  success: '#16A34A',
  successLight: '#DCFCE7',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  info: '#3B5BDB',
  infoLight: '#EEF4FF',

  // Gradient definitions (Pink -> Blue)
  gradients: {
    brand: ['#E83E8C', '#3B5BDB'] as const,
    brandReverse: ['#3B5BDB', '#E83E8C'] as const,
    contextual: ['#FFF4F9', '#EEF4FF'] as const,
    subtleCard: ['#FFFFFF', '#F8FAFC'] as const,
    pinkGlow: ['#FFF4F9', '#FCE7F3'] as const,
    blueGlow: ['#F6F8FF', '#EEF4FF'] as const,
  },

  // Category Badges
  categories: {
    College: {
      bg: '#EEF4FF',
      text: '#263B8F',
      border: '#D8E2FF',
    },
    Development: {
      bg: '#ECFDF5',
      text: '#065F46',
      border: '#A7F3D0',
    },
    Learning: {
      bg: '#FFF4F9',
      text: '#C72F73',
      border: '#F7C4DB',
    },
    Work: {
      bg: '#F3E8FF',
      text: '#6B21A8',
      border: '#DDD6FE',
    },
    Personal: {
      bg: '#FCE7F3',
      text: '#9D174D',
      border: '#FBCFE8',
    },
    All: {
      bg: '#F1F5F9',
      text: '#334155',
      border: '#E2E8F0',
    },
  },
};

export const typography = {
  fontFamily: 'System',
  sizes: {
    caption: 11,
    xs: 11,
    secondary: 13,
    sm: 13,
    body: 15,
    base: 15,
    primary: 15,
    section: 18,
    md: 18,
    lg: 20,
    screenTitle: 26,
    xl: 26,
    display: 30,
    xxl: 30,
    title: 26,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  huge: 40,
};

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 16,
  full: 999,
  pill: 999,
};
