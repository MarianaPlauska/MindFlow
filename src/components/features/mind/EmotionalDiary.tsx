import React from 'react';
import { View, Text } from 'react-native';
import { BookOpen, Brain } from 'lucide-react-native';
import { MOOD_LEVELS } from '../../../constants/categories';
import { SHADOWS } from '../../../constants/theme';
import { SectionHeader } from '../../ui/SectionHeader';

interface Props {
    logs: any[];
    getMoodData: (score: number) => any;
}

function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function EmotionalDiary({ logs, getMoodData }: Props) {
    return (
        <View>
            <SectionHeader
                title="Diário emocional"
                icon={<BookOpen size={18} color="#a3a3a3" />}
            />

            {logs.length === 0 ? (
                <View className="bg-white rounded-3xl p-6 items-center" style={SHADOWS.card}>
                    <Brain size={32} color="#a3a3a3" strokeWidth={1.2} />
                    <Text className="text-neutral-400 text-sm mt-3 text-center">
                        Nenhum registro ainda.{'\n'}
                        Compartilhar como se sente ajuda a entender padrões. 🌿
                    </Text>
                </View>
            ) : (
                logs.map((log: any) => {
                    const moodData = getMoodData(log.mood_score);
                    return (
                        <View
                            key={log.id}
                            className="bg-white rounded-2xl p-4 mb-2 flex-row items-center"
                            style={SHADOWS.cardSm}
                        >
                            <View
                                className="rounded-xl p-2 mr-3"
                                style={{ backgroundColor: moodData.bg }}
                            >
                                <Text style={{ fontSize: 18 }}>{moodData.emoji}</Text>
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-medium text-neutral-700">
                                    {moodData.label}
                                </Text>
                                {log.notes && (
                                    <Text className="text-xs text-neutral-400 mt-1" numberOfLines={2}>
                                        {log.notes}
                                    </Text>
                                )}
                            </View>
                            <Text className="text-xs text-neutral-300">
                                {formatTime(log.logged_at)}
                            </Text>
                        </View>
                    );
                })
            )}
        </View>
    );
}
