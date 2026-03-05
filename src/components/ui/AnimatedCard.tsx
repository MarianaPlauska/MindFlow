import React from 'react';
import { Animated } from 'react-native';
import { useAnimatedEntry } from '../../hooks/useAnimatedEntry';

interface Props {
    children: React.ReactNode;
    delay?: number;
    style?: any;
}

export function AnimatedCard({ children, delay = 0, style }: Props) {
    const { fadeAnim, slideAnim } = useAnimatedEntry(delay);

    return (
        <Animated.View
            style={[
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                style,
            ]}
        >
            {children}
        </Animated.View>
    );
}
