import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';

interface Props {
    visible: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export function BottomModal({ visible, onClose, title, children }: Props) {
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.present();
            if (Platform.OS !== 'web') {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
            }
        } else {
            bottomSheetRef.current?.dismiss();
        }
    }, [visible]);

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={['55%', '90%']}
            index={0}
            keyboardBehavior="interactive"
            onDismiss={onClose}
            backdropComponent={(props) => (
                <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior="close" opacity={0.4} />
            )}
            backgroundStyle={{
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                boxShadow: '0px -4px 20px rgba(30, 58, 95, 0.08)' as any,
                backgroundColor: '#ffffff'
            }}
            handleIndicatorStyle={{
                backgroundColor: '#d4d4d4',
                width: 40,
            }}
            enablePanDownToClose
        >
            <BottomSheetScrollView 
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40, paddingTop: 12 }}
                showsVerticalScrollIndicator={false}
            >
                <View className="flex-row items-center justify-between mb-6">
                    <Text className="text-lg font-bold text-neutral-800">
                        {title}
                    </Text>
                    <Pressable onPress={() => {
                        if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
                        onClose();
                    }} className="p-1">
                        <X size={24} color="#a3a3a3" />
                    </Pressable>
                </View>
                {children}
            </BottomSheetScrollView>
        </BottomSheetModal>
    );
}
