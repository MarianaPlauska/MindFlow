import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing } from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect } from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

interface Props {
    percent: number;
    size?: number;
    color?: string;
    bgColor?: string;
}

export function WaterWave({ percent, size = 120, color = '#3b82f6', bgColor = '#eff6ff' }: Props) {
    const waveAnim = useRef(new Animated.Value(0)).current;
    const fillAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Continuous wave animation
        Animated.loop(
            Animated.timing(waveAnim, {
                toValue: 1,
                duration: 2500,
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();
    }, []);

    useEffect(() => {
        Animated.timing(fillAnim, {
            toValue: Math.min(percent / 100, 1),
            duration: 800,
            useNativeDriver: false,
        }).start();
    }, [percent]);

    const waveHeight = 8;
    const containerR = size / 2;

    // Interpolate wave offset
    const waveOffset = waveAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, size],
    });

    // Interpolate fill level
    const fillLevel = fillAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [size, 0],
    });

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: containerR,
                backgroundColor: bgColor,
                overflow: 'hidden',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Animated.View
                style={{
                    position: 'absolute',
                    width: size * 3,
                    height: size,
                    bottom: 0,
                    transform: [
                        {
                            translateY: fillLevel,
                        },
                        {
                            translateX: Animated.multiply(waveOffset, -1),
                        },
                    ],
                }}
            >
                <Svg width={size * 3} height={size} viewBox={`0 0 ${size * 3} ${size}`}>
                    <Path
                        d={generateWavePath(size * 3, size, waveHeight)}
                        fill={color}
                        opacity={0.6}
                    />
                    <Path
                        d={generateWavePath(size * 3, size, waveHeight, size * 0.3)}
                        fill={color}
                        opacity={0.4}
                    />
                </Svg>
            </Animated.View>
        </View>
    );
}

function generateWavePath(w: number, h: number, amp: number, offset = 0): string {
    const points: string[] = [];
    const segments = 40;
    const step = w / segments;

    points.push(`M 0 ${amp}`);
    for (let i = 0; i <= segments; i++) {
        const x = i * step;
        const y = amp * Math.sin((i / segments) * Math.PI * 4 + offset / 10) + amp;
        points.push(`L ${x} ${y}`);
    }
    points.push(`L ${w} ${h} L 0 ${h} Z`);
    return points.join(' ');
}
