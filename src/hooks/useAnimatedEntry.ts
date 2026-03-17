import { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * Reusable fade-in + slide-up animation hook.
 * Returns { fadeAnim, slideAnim } to apply on Animated.View.
 */
export function useAnimatedEntry(delay = 0) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(16)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 400,
                delay,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    return { fadeAnim, slideAnim };
}
