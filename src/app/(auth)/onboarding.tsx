import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function OnboardingScreen() {
    const { session, setIsNewUser } = useAuth();
    const router = useRouter();

    const [fullName, setFullName] = useState('');
    const [waterGoal, setWaterGoal] = useState('2000');
    const [proteinGoal, setProteinGoal] = useState('100');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleComplete() {
        if (!fullName.trim()) {
            setError('Por favor, insira seu nome.');
            return;
        }

        setLoading(true);
        setError('');

        const { error: dbError } = await supabase.from('profiles').upsert({
            id: session?.user.id,
            username: fullName.trim(),
            protein_goal_g: parseInt(proteinGoal) || 100,
            water_goal_ml: parseInt(waterGoal) || 2000,
            theme: 'light',
        });

        if (dbError) {
            setError('Algo deu errado. Tente novamente em instantes.');
            setLoading(false);
            return;
        }

        setIsNewUser(false);
        setLoading(false);
        router.replace('/(tabs)');
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center px-8 py-12 bg-calm-50">
                    {/* Header */}
                    <View className="items-center mb-10">
                        <Text className="text-5xl mb-4">🌿</Text>
                        <Text className="text-3xl font-bold text-calm-700 tracking-tight">
                            Bem-vindo(a)!
                        </Text>
                        <Text className="text-base text-neutral-400 mt-2 text-center leading-6">
                            Vamos personalizar sua experiência.{'\n'}
                            Leva menos de 1 minuto 💚
                        </Text>
                    </View>

                    {/* Error */}
                    {error ? (
                        <View className="bg-warmth-50 border border-warmth-200 rounded-2xl px-4 py-3 mb-6">
                            <Text className="text-warmth-600 text-sm text-center">
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    {/* Full Name */}
                    <Text className="text-sm font-medium text-neutral-500 mb-2 ml-1">
                        Seu nome completo
                    </Text>
                    <TextInput
                        className="bg-white border border-calm-200 rounded-2xl px-4 py-4 text-base text-neutral-800 mb-6"
                        placeholder="Como podemos te chamar?"
                        placeholderTextColor="#a3a3a3"
                        value={fullName}
                        onChangeText={setFullName}
                        autoCapitalize="words"
                    />

                    {/* Health Goals */}
                    <View className="bg-white border border-serene-100 rounded-3xl p-6 mb-6">
                        <Text className="text-lg font-semibold text-serene-700 mb-1">
                            🎯 Suas Metas de Saúde
                        </Text>
                        <Text className="text-sm text-neutral-400 mb-5">
                            Você pode ajustar a qualquer momento
                        </Text>

                        {/* Water Goal */}
                        <Text className="text-sm font-medium text-neutral-500 mb-2 ml-1">
                            💧 Meta de Água (ml/dia)
                        </Text>
                        <TextInput
                            className="bg-calm-50 border border-calm-200 rounded-2xl px-4 py-4 text-base text-neutral-800 mb-5"
                            placeholder="2000"
                            placeholderTextColor="#a3a3a3"
                            value={waterGoal}
                            onChangeText={setWaterGoal}
                            keyboardType="numeric"
                        />

                        {/* Protein Goal */}
                        <Text className="text-sm font-medium text-neutral-500 mb-2 ml-1">
                            🥩 Meta de Proteína (g/dia)
                        </Text>
                        <TextInput
                            className="bg-calm-50 border border-calm-200 rounded-2xl px-4 py-4 text-base text-neutral-800"
                            placeholder="100"
                            placeholderTextColor="#a3a3a3"
                            value={proteinGoal}
                            onChangeText={setProteinGoal}
                            keyboardType="numeric"
                        />
                        <Text className="text-xs text-calm-500 mt-2 ml-1">
                            Padrão recomendado: 100g de proteína por dia
                        </Text>
                    </View>

                    {/* Complete Button */}
                    <TouchableOpacity
                        onPress={handleComplete}
                        disabled={loading}
                        className="bg-calm-500 rounded-2xl py-4 items-center shadow-sm"
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Começar minha jornada 🚀
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
