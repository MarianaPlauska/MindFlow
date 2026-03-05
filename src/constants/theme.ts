import { Platform } from 'react-native';

// ─── Color Tokens ───────────────────────────────────────
export const COLORS = {
    calm: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
    },
    serene: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
    },
    warmth: {
        50: '#fffbeb',
        600: '#ca8a04',
    },
    blush: {
        50: '#fdf2f8',
        600: '#db2777',
        700: '#be185d',
    },
    neutral: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
    },
} as const;

// ─── Shadow Presets ─────────────────────────────────────
export const SHADOWS = {
    card: {
        shadowColor: '#1e3a5f',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 4,
    },
    cardSm: {
        shadowColor: '#1e3a5f',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    glass: {
        shadowColor: '#1e3a5f',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 12,
    },
    coloredCard: (color: string) => ({
        shadowColor: color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
        elevation: 8,
    }),
} as const;

// ─── Glass Effect (web) ─────────────────────────────────
export const GLASS_WEB = Platform.select({
    web: {
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 -4px 30px rgba(30, 58, 95, 0.08)',
    },
    default: {},
});

// ─── Spacing ────────────────────────────────────────────
export const SPACING = {
    screenPaddingX: 24,
    cardRadius: 24,
    cardPadding: 24,
    sectionGap: 16,
} as const;
