import { View, Text, TouchableOpacity } from 'react-native';
import { Brain, Smile, Meh, Frown } from 'lucide-react-native';

const moods = [
    { score: 1, icon: Frown, label: 'Muito mal', color: '#be185d' },
    { score: 2, icon: Frown, label: 'Mal', color: '#ec4899' },
    { score: 3, icon: Meh, label: 'Neutro', color: '#eab308' },
    { score: 4, icon: Smile, label: 'Bem', color: '#22c55e' },
    { score: 5, icon: Smile, label: 'Muito bem', color: '#15803d' },
];

export default function MindScreen() {
    return (
        <View className="flex-1 bg-calm-50 pt-16 px-6">
            <Text className="text-2xl font-bold text-neutral-800 mb-2">
                🧠 Mente
            </Text>
            <Text className="text-sm text-neutral-400 mb-8">
                Como você está se sentindo?
            </Text>

            {/* Quick Mood Selector */}
            <View className="bg-white rounded-3xl p-6 mb-4" style={{
                shadowColor: '#1e3a5f',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 4,
            }}>
                <Text className="text-base font-semibold text-serene-700 mb-4">
                    Como você está agora?
                </Text>
                <View className="flex-row justify-between">
                    {moods.map((mood) => {
                        const Icon = mood.icon;
                        return (
                            <TouchableOpacity
                                key={mood.score}
                                className="items-center p-2 rounded-2xl"
                            >
                                <Icon size={28} color={mood.color} strokeWidth={1.8} />
                                <Text className="text-xs text-neutral-400 mt-1">
                                    {mood.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>

            {/* Recent Logs */}
            <View className="bg-white rounded-3xl p-6 mb-4" style={{
                shadowColor: '#1e3a5f',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 4,
            }}>
                <Text className="text-base font-semibold text-calm-700 mb-2">
                    Últimos registros
                </Text>
                <Text className="text-sm text-neutral-400">
                    Nenhum registro ainda. Compartilhe como está se sentindo!
                </Text>
            </View>

            {/* Empty state */}
            <View className="flex-1 justify-center items-center pb-24">
                <Brain size={48} color="#a3a3a3" strokeWidth={1.2} />
                <Text className="text-neutral-400 mt-4 text-center">
                    Registrar seu humor ajuda a entender{'\n'}padrões de ansiedade e depressão.
                </Text>
            </View>
        </View>
    );
}
