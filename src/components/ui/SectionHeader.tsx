import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface Props {
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
}

export function SectionHeader({ title, actionLabel, onAction, icon }: Props) {
    return (
        <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
                {icon}
                <Text className="text-base font-semibold text-neutral-800 ml-2">
                    {title}
                </Text>
            </View>
            {actionLabel && onAction ? (
                <TouchableOpacity onPress={onAction} className="flex-row items-center">
                    <Text className="text-serene-600 text-xs font-semibold mr-1">
                        {actionLabel}
                    </Text>
                    <ChevronRight size={14} color="#3b82f6" />
                </TouchableOpacity>
            ) : null}
        </View>
    );
}
