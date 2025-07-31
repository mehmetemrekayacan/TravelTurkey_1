import { createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';

// TravelTurkey Custom Theme Colors
const travelTurkeyTokens = {
  color: {
    // Primary - Türk Kırmızısının Soft Versiyonu
    primary: '#D62828',
    primaryLight: '#E85A5A',
    primaryDark: '#B71C1C',
    primaryAlpha: '#D6282880',

    // Secondary - Osmanlı Lacivertinin Pastel Tonu
    secondary: '#264653',
    secondaryLight: '#4A6741',
    secondaryDark: '#1B3239',
    secondaryAlpha: '#26465380',

    // Accent Colors
    accentGold: '#E9C46A',
    accentMint: '#2A9D8F',
    accentGoldLight: '#F1D18A',
    accentMintLight: '#52B2A6',

    // Background & Surface
    backgroundLight: '#FAFAFA',
    backgroundDark: '#1A1A1A',
    backgroundWarm: '#F8F4E3',

    surfaceLight: '#FFFFFF',
    surfaceDark: '#2C2C2C',
    surfaceElevated: '#F5F5F5',

    // Text Colors
    textPrimary: '#212121',
    textSecondary: '#757575',
    textTertiary: '#9E9E9E',
    textInverse: '#FFFFFF',

    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',

    // Border & Divider
    border: '#E0E0E0',
    borderDark: '#424242',
    divider: '#F0F0F0',

    // Special
    overlay: '#00000066',
    shadow: '#0000001A',

    // Turkish Pattern Colors (for subtle backgrounds)
    patternRed: '#D6282810',
    patternBlue: '#26465310',
    patternGold: '#E9C46A15',
  },
  size: {
    // Spacing System
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,

    // Component Sizes
    buttonHeight: 48,
    inputHeight: 48,
    cardPadding: 16,
    screenPadding: 20,
    headerHeight: 56,
    tabBarHeight: 60,

    // Border Radius
    radiusXs: 4,
    radiusSm: 8,
    radiusMd: 12,
    radiusLg: 16,
    radiusXl: 24,
    radiusFull: 9999,
  },
  space: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  zIndex: {
    tooltip: 1000,
    modal: 2000,
    overlay: 3000,
    max: 9999,
  },
};

// Light Theme
const lightTheme = {
  background: travelTurkeyTokens.color.backgroundLight,
  backgroundWarm: travelTurkeyTokens.color.backgroundWarm,
  backgroundFocus: travelTurkeyTokens.color.surfaceElevated,
  backgroundHover: travelTurkeyTokens.color.surfaceElevated,
  backgroundPress: travelTurkeyTokens.color.border,
  backgroundStrong: travelTurkeyTokens.color.surfaceLight,
  backgroundTransparent: 'transparent',

  color: travelTurkeyTokens.color.textPrimary,
  colorFocus: travelTurkeyTokens.color.primary,
  colorHover: travelTurkeyTokens.color.textSecondary,
  colorPress: travelTurkeyTokens.color.textTertiary,
  colorTransparent: 'transparent',

  borderColor: travelTurkeyTokens.color.border,
  borderColorFocus: travelTurkeyTokens.color.primary,
  borderColorHover: travelTurkeyTokens.color.textSecondary,
  borderColorPress: travelTurkeyTokens.color.textTertiary,

  shadowColor: travelTurkeyTokens.color.shadow,
  shadowColorFocus: travelTurkeyTokens.color.shadow,
  shadowColorHover: travelTurkeyTokens.color.shadow,
  shadowColorPress: travelTurkeyTokens.color.shadow,
};

// Dark Theme
const darkTheme = {
  background: travelTurkeyTokens.color.backgroundDark,
  backgroundWarm: '#2A2520',
  backgroundFocus: travelTurkeyTokens.color.surfaceDark,
  backgroundHover: travelTurkeyTokens.color.surfaceDark,
  backgroundPress: travelTurkeyTokens.color.borderDark,
  backgroundStrong: '#3A3A3A',
  backgroundTransparent: 'transparent',

  color: travelTurkeyTokens.color.textInverse,
  colorFocus: travelTurkeyTokens.color.primaryLight,
  colorHover: '#B0B0B0',
  colorPress: '#808080',
  colorTransparent: 'transparent',

  borderColor: travelTurkeyTokens.color.borderDark,
  borderColorFocus: travelTurkeyTokens.color.primaryLight,
  borderColorHover: '#606060',
  borderColorPress: '#404040',

  shadowColor: '#000000CC',
  shadowColorFocus: '#000000CC',
  shadowColorHover: '#000000CC',
  shadowColorPress: '#000000CC',
};

// Create Tamagui Configuration
export const travelTurkeyConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    ...travelTurkeyTokens,
  },
  themes: {
    ...config.themes,
    light: {
      ...config.themes.light,
      ...lightTheme,
    },
    dark: {
      ...config.themes.dark,
      ...darkTheme,
    },
  },
  fonts: {
    ...config.fonts,
    heading: {
      family: 'System',
      size: {
        1: 12,
        2: 14,
        3: 15,
        4: 16,
        5: 18,
        6: 20,
        7: 24,
        8: 28,
        9: 32,
        10: 36,
        11: 42,
        12: 48,
      },
      lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 22,
        5: 24,
        6: 26,
        7: 30,
        8: 34,
        9: 38,
        10: 42,
        11: 48,
        12: 54,
      },
      weight: {
        1: '400',
        2: '500',
        3: '600',
        4: '700',
        5: '800',
        6: '900',
      },
    },
    body: {
      family: 'System',
      size: {
        1: 11,
        2: 12,
        3: 13,
        4: 14,
        5: 16,
        6: 18,
        7: 20,
        8: 22,
        9: 24,
        10: 26,
      },
      lineHeight: {
        1: 14,
        2: 16,
        3: 18,
        4: 20,
        5: 22,
        6: 24,
        7: 26,
        8: 28,
        9: 30,
        10: 32,
      },
      weight: {
        1: '300',
        2: '400',
        3: '500',
        4: '600',
        5: '700',
      },
    },
  },
});

export type TravelTurkeyConfig = typeof travelTurkeyConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends TravelTurkeyConfig {}
}

export default travelTurkeyConfig;
