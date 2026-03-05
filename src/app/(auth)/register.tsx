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

export default function RegisterScreen() {
    const { signUp } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    async function handleRegister() {
        setError('');

        if (!email || !password || !confirmPassword) {
            setError('Por favor, preencha todos os campos.');
            return;
        }

        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }

        setLoading(true);
        const { error: authError } = await signUp(email.trim(), password);
        if (authError) {
            setError('Não foi possível criar a conta. Tente outro e-mail.');
        } else {
            setSuccess(true);
        }
        setLoading(false);
    }

    if (success) {
        return (
            <View className="flex-1 justify-center items-center px-8 bg-calm-50">
                <Text className="text-5xl mb-6">✉️</Text>
                <Text className="text-2xl font-bold text-serene-700 text-center mb-4">
                    Verifique seu e-mail
                </Text>
                <Text className="text-base text-neutral-400 text-center leading-6 mb-8">
                    Enviamos um link de confirmação para{'\n'}
                    <Text className="font-semibold text-neutral-600">{email}</Text>
                </Text>
                <Link href="/(auth)/login" asChild>
                    <TouchableOpacity className="bg-serene-500 rounded-2xl px-8 py-4">
                        <Text className="text-white font-semibold text-base">
                            Voltar para Login
                        </Text>
                    </TouchableOpacity>
                </Link>
            </View>
        );
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
                        <Text className="text-5xl mb-4">🌱</Text>
                        <Text className="text-3xl font-bold text-calm-700 tracking-tight">
                            Criar Conta
                        </Text>
                        <Text className="text-base text-neutral-400 mt-2 text-center">
                            Comece sua jornada de bem-estar
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

                    {/* Email */}
                    <Text className="text-sm font-medium text-neutral-500 mb-2 ml-1">
                        E-mail
                    </Text>
                    <TextInput
                        className="bg-white border border-calm-200 rounded-2xl px-4 py-4 text-base text-neutral-800 mb-5"
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
                        className="bg-white border border-calm-200 rounded-2xl px-4 py-4 text-base text-neutral-800 mb-5"
                        placeholder="Mínimo 6 caracteres"
                        placeholderTextColor="#a3a3a3"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    {/* Confirm Password */}
                    <Text className="text-sm font-medium text-neutral-500 mb-2 ml-1">
                        Confirmar Senha
                    </Text>
                    <TextInput
                        className="bg-white border border-calm-200 rounded-2xl px-4 py-4 text-base text-neutral-800 mb-8"
                        placeholder="Repita a senha"
                        placeholderTextColor="#a3a3a3"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />

                    {/* Register Button */}
                    <TouchableOpacity
                        onPress={handleRegister}
                        disabled={loading}
                        className="bg-calm-500 rounded-2xl py-4 items-center shadow-sm"
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text className="text-white text-base font-semibold">
                                Criar Conta
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Login link */}
                    <View className="flex-row justify-center mt-8">
                        <Text className="text-neutral-400 text-sm">
                            Já tem uma conta?{' '}
                        </Text>
                        <Link href="/(auth)/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-calm-600 text-sm font-semibold">
                                    Entrar
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
