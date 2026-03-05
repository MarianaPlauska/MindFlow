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
import { Link } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function handleLogin() {
        if (!email || !password) {
            setError('Por favor, preencha todos os campos.');
            return;
        }
        setLoading(true);
        setError('');
        const { error: authError } = await signIn(email.trim(), password);
        if (authError) {
            setError('E-mail ou senha incorretos. Tente novamente.');
        }
        setLoading(false);
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
                    <View className="items-center mb-12">
                        <Text className="text-5xl mb-4">🧠</Text>
                        <Text className="text-3xl font-bold text-serene-700 tracking-tight">
                            MindFlow
                        </Text>
                        <Text className="text-base text-neutral-400 mt-2 text-center">
                            Seu espaço seguro para cuidar da mente e das finanças
                        </Text>
                    </View>

                    {/* Error message (soft, no red) */}
                    {error ? (
                        <View className="bg-warmth-50 border border-warmth-200 rounded-2xl px-4 py-3 mb-6">
                            <Text className="text-warmth-600 text-sm text-center">
                                {error}
                            </Text>
                        </View>
                    ) : null}

                    {/* Email */}
                    <Text className="text-sm font-medium text-neutral-500 mb-2 ml-1">
                        E-mail
                    </Text>
                    <TextInput
                        className="bg-white border border-serene-200 rounded-2xl px-4 py-4 text-base text-neutral-800 mb-5"
                        placeholder="seu@email.com"
                        placeholderTextColor="#a3a3a3"
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                    />

                    {/* Password */}
                    <Text className="text-sm font-medium text-neutral-500 mb-2 ml-1">
                        Senha
                    </Text>
                    <TextInput
                        className="bg-white border border-serene-200 rounded-2xl px-4 py-4 text-base text-neutral-800 mb-8"
                        placeholder="••••••••"
                        placeholderTextColor="#a3a3a3"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        autoComplete="password"
                    />

                    {/* Login Button */}
                    <TouchableOpacity
                        onPress={handleLogin}
                        disabled={loading}
                        className="bg-serene-500 rounded-2xl py-4 items-center shadow-sm"
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Entrar
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Register link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-neutral-400 text-sm">
                            Não tem uma conta?{' '}
                        </Text>
                        <Link href="/(auth)/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-serene-500 text-sm font-semibold">
                                    Criar conta
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
