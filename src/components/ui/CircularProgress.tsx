import React from 'react';
import { View } from 'react-native';
import { SHADOWS } from '../../constants/theme';

interface Props {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    bgColor?: string;
    children?: React.ReactNode;
}

export function CircularProgress({
    progress,
    size = 80,
    strokeWidth = 8,
    color = '#3b82f6',
    bgColor = '#eff6ff',
    children,
}: Props) {
    const clamped = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
            <View
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: bgColor,
                }}
            />
            <View
                style={{
                    position: 'absolute',
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderWidth: strokeWidth,
                    borderColor: 'transparent',
                    borderTopColor: color,
                    borderRightColor: clamped > 25 ? color : 'transparent',
                    borderBottomColor: clamped > 50 ? color : 'transparent',
                    borderLeftColor: clamped > 75 ? color : 'transparent',
                    transform: [{ rotate: '-45deg' }],
                }}
            />
            {children}
        </View>
    );
}
