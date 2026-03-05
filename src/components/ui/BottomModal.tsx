import React from 'react';
import { View, Text, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { X } from 'lucide-react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function BottomModal({ visible, onClose, title, children }: Props) {
    return (
        <Modal visible={visible} animationType="slide" transparent>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                className="flex-1 justify-end"
                style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            >
                <View className="bg-white rounded-t-3xl p-6 pb-10">
                    <View className="flex-row items-center justify-between mb-6">
                        <Text className="text-lg font-bold text-neutral-800">
                            {title}
                        </Text>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color="#a3a3a3" />
                        </TouchableOpacity>
                    </View>
                    {children}
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
