import React, { useEffect } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withRepeat,
    withTiming,
    Easing,
    interpolate,
} from 'react-native-reanimated';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface Props {
    /** 0–100 fill percentage */
    percent: number;
    /** Container size in px */
    size?: number;
    /** Primary wave color */
    color?: string;
    /** Secondary (back) wave color */
    colorBack?: string;
    /** Background circle color */
    bgColor?: string;
}

/**
 * Premium water-wave component.
 * Uses react-native-reanimated shared values to animate two
 * sine-wave SVG paths in an infinite loop.
 * The water level rises/falls with `percent`.
 */
export function WaterWave({
    percent,
    size = 120,
    color = '#3b82f6',
    colorBack = '#93c5fd',
    bgColor = '#eff6ff',
}: Props) {
    const phase = useSharedValue(0);
    const fill = useSharedValue(0);

    // Continuous horizontal wave animation
    useEffect(() => {
        phase.value = withRepeat(
            withTiming(2 * Math.PI, { duration: 2800, easing: Easing.linear }),
            -1, // infinite
            false,
        );
    }, []);

    // Smooth fill level transition
    useEffect(() => {
        fill.value = withTiming(Math.min(Math.max(percent, 0), 100) / 100, {
            duration: 700,
            easing: Easing.out(Easing.cubic),
        });
    }, [percent]);

    const waveWidth = size;
    const amplitude = 6;
    const frequency = 2.5; // number of wave peaks across the width

    // Front wave
    const frontProps = useAnimatedProps(() => {
        const waterY = interpolate(fill.value, [0, 1], [size, 0]);
        let d = `M 0 ${size}`;
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * waveWidth;
            const y =
                waterY +
                amplitude * Math.sin((i / steps) * frequency * 2 * Math.PI + phase.value);
            d += ` L ${x} ${y}`;
        }
        d += ` L ${waveWidth} ${size} Z`;
        return { d };
    });

    // Back wave (offset phase for depth)
    const backProps = useAnimatedProps(() => {
        const waterY = interpolate(fill.value, [0, 1], [size, 0]);
        let d = `M 0 ${size}`;
        const steps = 40;
        for (let i = 0; i <= steps; i++) {
            const x = (i / steps) * waveWidth;
            const y =
                waterY +
                amplitude *
                Math.sin(
                    (i / steps) * frequency * 2 * Math.PI + phase.value + Math.PI * 0.8,
                ) +
                2; // slight vertical offset for layered look
            d += ` L ${x} ${y}`;
        }
        d += ` L ${waveWidth} ${size} Z`;
        return { d };
    });

    return (
        <View
            style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: bgColor,
                overflow: 'hidden',
            }}
        >
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <AnimatedPath animatedProps={backProps} fill={colorBack} opacity={0.5} />
                <AnimatedPath animatedProps={frontProps} fill={color} opacity={0.7} />
            </Svg>
        </View>
    );
}
