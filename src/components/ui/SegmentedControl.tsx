import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../../constants/theme';

interface Props {
    tabs: string[];
    activeIndex: number;
    onSelect: (index: number) => void;
}

export function SegmentedControl({ tabs, activeIndex, onSelect }: Props) {
    return (
        <View className="flex-row bg-neutral-100 rounded-2xl p-1 mx-6 mb-4">
            {tabs.map((tab, i) => (
                <TouchableOpacity
                    key={tab}
                    onPress={() => onSelect(i)}
                    className={`flex-1 py-2.5 rounded-xl items-center ${activeIndex === i ? 'bg-white' : ''
                        }`}
                    style={
                        activeIndex === i
                            ? {
                                boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
                            }
                            : {}
                    }
                >
                    <Text
                        className={`text-sm font-semibold ${activeIndex === i ? 'text-serene-600' : 'text-neutral-400'
                            }`}
                    >
                        {tab}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}
