export const theme = {
  colors: {
    // Primary colors
    primary: '#6366f1',      // Indigo
    primaryDark: '#4f46e5',
    primaryLight: '#818cf8',
    
    // Semantic colors
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Amber
    danger: '#ef4444',       // Red
    info: '#3b82f6',         // Blue
    
    // Neutral colors (light mode)
    background: '#ffffff',
    surface: '#f8fafc',
    card: '#ffffff',
    border: '#e2e8f0',
    
    // Text colors
    text: '#0f172a',
    textMuted: '#64748b',
    textLight: '#94a3b8',
    
    // Special colors
    peach: '#fda4af',
    
    // Dark mode (for future)
    backgroundDark: '#0f172a',
    surfaceDark: '#1e293b',
  },
  
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
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
  },
  
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    fontWeight: {
      normal: '400' as const,
      medium: '500' as const,
      semibold: '600' as const,
      bold: '700' as const,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
