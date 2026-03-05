import { View, Text, TouchableOpacity } from 'react-native';
import { Heart, Droplets, Beef } from 'lucide-react-native';

export default function HealthScreen() {
    return (
        <View className="flex-1 bg-calm-50 pt-16 px-6">
            <Text className="text-2xl font-bold text-neutral-800 mb-2">
                💚 Saúde
            </Text>
            <Text className="text-sm text-neutral-400 mb-8">
                Suas metas de nutrição e hidratação
            </Text>

            {/* Water Card */}
            <View className="bg-white rounded-3xl p-6 mb-4" style={{
                shadowColor: '#1e3a5f',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 4,
            }}>
                <View className="flex-row items-center mb-3">
                    <Droplets size={20} color="#3b82f6" />
                    <Text className="text-base font-semibold text-serene-700 ml-2">
                        Água
                    </Text>
                </View>
                <View className="bg-serene-50 rounded-full h-3 w-full mb-2">
                    <View className="bg-serene-400 rounded-full h-3" style={{ width: '0%' }} />
                </View>
                <Text className="text-xs text-neutral-400">0 / 2000 ml</Text>
            </View>

            {/* Protein Card */}
            <View className="bg-white rounded-3xl p-6 mb-4" style={{
                shadowColor: '#1e3a5f',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 4,
            }}>
                <View className="flex-row items-center mb-3">
                    <Beef size={20} color="#22c55e" />
                    <Text className="text-base font-semibold text-calm-700 ml-2">
                        Proteína
                    </Text>
                </View>
                <View className="bg-calm-50 rounded-full h-3 w-full mb-2">
                    <View className="bg-calm-400 rounded-full h-3" style={{ width: '0%' }} />
                </View>
                <Text className="text-xs text-neutral-400">0 / 100g</Text>
            </View>

            {/* Empty state */}
            <View className="flex-1 justify-center items-center pb-24">
                <Heart size={48} color="#a3a3a3" strokeWidth={1.2} />
                <Text className="text-neutral-400 mt-4 text-center">
                    Comece a registrar sua alimentação{'\n'}e hidratação do dia!
                </Text>
                <TouchableOpacity className="bg-calm-500 rounded-2xl px-6 py-3 mt-6">
                    <Text className="text-white font-semibold">+ Registrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
