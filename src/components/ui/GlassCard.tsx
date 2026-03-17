import React from 'react';
import { View, Platform } from 'react-native';
import { SHADOWS, GLASS_WEB } from '../../constants/theme';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export function GlassCard({ children, className = '' }: Props) {
    return (
        <View
            className={`bg-white/85 rounded-3xl p-6 ${className}`}
            style={{
                ...SHADOWS.card,
                ...Platform.select({ web: GLASS_WEB, default: {} }),
            }}
        >
            {children}
        </View>
    );
}
