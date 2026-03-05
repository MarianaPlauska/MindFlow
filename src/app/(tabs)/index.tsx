import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
    const { session, signOut } = useAuth();

    return (
        <View className="flex-1 justify-center items-center px-8 bg-calm-50">
            <Text className="text-5xl mb-6">🧠</Text>
            <Text className="text-2xl font-bold text-serene-700 mb-2">
                Olá, bem-vindo(a)!
            </Text>
            <Text className="text-base text-neutral-400 text-center mb-8">
                {session?.user?.email}
            </Text>

            <View className="bg-white border border-serene-100 rounded-3xl p-6 w-full mb-8">
                <Text className="text-lg font-semibold text-calm-700 mb-2">
                    🌿 MindFlow
                </Text>
                <Text className="text-sm text-neutral-400 leading-5">
                    Seu painel principal está quase pronto.{'\n'}
                    Em breve: humor, finanças e metas de saúde.
                </Text>
            </View>

            <TouchableOpacity
                onPress={signOut}
                className="border border-neutral-200 rounded-2xl px-6 py-3"
            >
                <Text className="text-neutral-400 text-sm font-medium">
                    Sair da conta
                </Text>
            </TouchableOpacity>
        </View>
    );
}
