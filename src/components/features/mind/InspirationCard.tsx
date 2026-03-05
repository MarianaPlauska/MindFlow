import React from 'react';
import { View, Text } from 'react-native';
import { Sparkles } from 'lucide-react-native';

interface Props {
    phrase: string;
}

export function InspirationCard({ phrase }: Props) {
    return (
        <View
            className="rounded-3xl p-5 flex-row items-center"
            style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
        >
            <Sparkles size={20} color="#3b82f6" />
            <Text className="text-sm text-serene-600 ml-3 flex-1 leading-5">
                {phrase}
            </Text>
        </View>
    );
}
