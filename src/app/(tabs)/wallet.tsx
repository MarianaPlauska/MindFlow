import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react-native';

export default function WalletScreen() {
    return (
        <View className="flex-1 bg-calm-50 pt-16 px-6">
            <Text className="text-2xl font-bold text-neutral-800 mb-2">
                💰 Finanças
            </Text>
            <Text className="text-sm text-neutral-400 mb-8">
                Acompanhe seus gastos e receitas
            </Text>

            {/* Balance Card */}
            <View className="bg-white rounded-3xl p-6 mb-4" style={{
                shadowColor: '#1e3a5f',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.06,
                shadowRadius: 16,
                elevation: 4,
            }}>
                <Text className="text-sm text-neutral-400 mb-1">Saldo Atual</Text>
                <Text className="text-3xl font-bold text-serene-700">R$ 0,00</Text>
                <View className="flex-row mt-4 gap-4">
                    <View className="flex-1 bg-calm-50 rounded-2xl p-3 items-center">
                        <TrendingUp size={18} color="#22c55e" />
                        <Text className="text-xs text-calm-600 mt-1">Receitas</Text>
                        <Text className="text-sm font-semibold text-calm-700">R$ 0</Text>
                    </View>
                    <View className="flex-1 bg-blush-50 rounded-2xl p-3 items-center">
                        <TrendingDown size={18} color="#ec4899" />
                        <Text className="text-xs text-blush-600 mt-1">Despesas</Text>
                        <Text className="text-sm font-semibold text-blush-700">R$ 0</Text>
                    </View>
                </View>
            </View>

            {/* Empty state */}
            <View className="flex-1 justify-center items-center pb-24">
                <Wallet size={48} color="#a3a3a3" strokeWidth={1.2} />
                <Text className="text-neutral-400 mt-4 text-center">
                    Nenhuma transação registrada ainda.{'\n'}
                    Adicione sua primeira transação!
                </Text>
                <TouchableOpacity className="bg-serene-500 rounded-2xl px-6 py-3 mt-6">
                    <Text className="text-white font-semibold">+ Nova Transação</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
