import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { InspirationCard } from '../../components/features/mind/InspirationCard';
import { DiaryForm } from '../../components/features/mind/DiaryForm';
import { EmotionalDiary } from '../../components/features/mind/EmotionalDiary';
import { useMood } from '../../hooks/useMood';
import { getRandomPhrase, MIND_PHRASES } from '../../constants/phrases';

export default function MindScreen() {
    const mood = useMood();
    const [phrase] = useState(() => getRandomPhrase(MIND_PHRASES));

    return (
        <View className="flex-1 bg-calm-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <AnimatedCard delay={0}>
                    <View className="pt-16 pb-2 px-6">
                        <Text className="text-2xl font-bold text-neutral-800">🧠 Mente</Text>
                        <Text className="text-sm text-neutral-400 mt-1">{phrase}</Text>
                    </View>
                </AnimatedCard>

                <AnimatedCard delay={100}>
                    <View className="mx-6 mt-4 mb-4">
                        <InspirationCard phrase={phrase} />
                    </View>
                </AnimatedCard>

                {/* Full diary form (mood + text) instead of modal */}
                <AnimatedCard delay={200}>
                    <View className="mx-6 mb-4">
                        <DiaryForm
                            selectedScore={mood.selectedScore}
                            notes={mood.notes}
                            setNotes={mood.setNotes}
                            saving={mood.saving}
                            scaleAnims={mood.scaleAnims}
                            onSelect={mood.selectMood}
                            onSave={mood.save}
                            onCancel={mood.resetSelection}
                        />
                    </View>
                </AnimatedCard>

                <AnimatedCard delay={350}>
                    <View className="px-6 mb-4">
                        <EmotionalDiary logs={mood.logs} getMoodData={mood.getMoodData} />
                    </View>
                </AnimatedCard>
            </ScrollView>
        </View>
    );
}
