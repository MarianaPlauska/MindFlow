import React from 'react';
import { View, Animated, ViewStyle } from 'react-native';

interface Props {
    percent: number;
    height?: number;
    color?: string;
    bgColor?: string;
    animated?: Animated.Value;
    style?: ViewStyle;
}

export function ProgressBar({
    percent,
    height = 12,
    color = '#3b82f6',
    bgColor = '#eff6ff',
    animated,
    style,
}: Props) {
    return (
        <View
            style={[{ backgroundColor: bgColor, borderRadius: height / 2, height, width: '100%', overflow: 'hidden' }, style]}
        >
            {animated ? (
                <Animated.View
                    style={{
                        backgroundColor: color,
                        borderRadius: height / 2,
                        height,
                        width: animated.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0%', '100%'],
                        }),
                    }}
                />
            ) : (
                <View
                    style={{
                        backgroundColor: color,
                        borderRadius: height / 2,
                        height,
                        width: `${Math.min(percent, 100)}%`,
                    }}
                />
            )}
        </View>
    );
}
