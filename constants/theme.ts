export const THEME = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    round: 9999,
  },
  typography: {
    heroTemp: {
      fontSize: 96,
      fontWeight: '200' as const,
      letterSpacing: -3,
    },
    h1: {
      fontSize: 28,
      fontWeight: '700' as const,
    },
    h2: {
      fontSize: 22,
      fontWeight: '600' as const,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500' as const,
    },
  },
  card: {
    padding: 16,
    borderRadius: 20,
  }
};
