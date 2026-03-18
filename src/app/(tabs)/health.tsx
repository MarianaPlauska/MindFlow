import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { AnimatedCard } from '../../components/ui/AnimatedCard';
import { WaterTracker } from '../../components/features/health/WaterTracker';
import { ProteinTracker } from '../../components/features/health/ProteinTracker';
import { MedicationCard } from '../../components/features/health/MedicationCard';
import { ReminderList } from '../../components/features/health/ReminderList';
import { useHealth } from '../../hooks/useHealth';
import { useProfile } from '../../hooks/useProfile';
import { getRandomPhrase, HEALTH_PHRASES } from '../../constants/phrases';

export default function HealthScreen() {
    const health = useHealth();
    const { profile } = useProfile();
    const [phrase] = useState(() => getRandomPhrase(HEALTH_PHRASES));
    const displayName = profile?.username || 'Mari';

    return (
        <View className="flex-1 bg-calm-50">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
                <AnimatedCard delay={0}>
                    <View className="pt-16 pb-2 px-6">
                        <Text className="text-2xl font-bold text-neutral-800">💚 Saúde</Text>
                        <Text className="text-sm text-neutral-400 mt-1">{phrase}</Text>
                    </View>
                </AnimatedCard>

                {/* Water Tracker */}
                <AnimatedCard delay={100}>
                    <View className="mx-6 mt-4 mb-4">
                        <WaterTracker
                            waterToday={health.waterToday}
                            waterGoal={health.waterGoal}
                            waterPercent={health.waterPercent}
                            onAddWater={health.addWater}
                            onClearWater={health.clearWater}
                            loadingWater={health.loadingWater}
                        />
                    </View>
                </AnimatedCard>

                {/* Protein Tracker */}
                <AnimatedCard delay={200}>
                    <View className="mx-6 mb-4">
                        <ProteinTracker
                            current={health.proteinCurrent}
                            goal={health.proteinGoal}
                            percent={health.proteinPercent}
                            onAddProtein={health.addProtein}
                            loadingProtein={health.loadingProtein}
                        />
                    </View>
                </AnimatedCard>

                {/* Medication Manager */}
                <AnimatedCard delay={250}>
                    <View className="mx-6 mb-4">
                        <MedicationCard
                            displayName={displayName}
                            medicationRoutines={health.medicationRoutines}
                            medicationLogs={health.medicationLogs}
                            onLogMedication={health.logMedication}
                            onAddRoutine={health.addMedicationRoutine}
                            onDeleteRoutine={health.deleteMedicationRoutine}
                            loading={health.loadingMedication}
                        />
                    </View>
                </AnimatedCard>

                {/* Reminders */}
                <AnimatedCard delay={300}>
                    <View className="px-6 mb-4">
                        <ReminderList
                            reminders={health.reminders}
                            onToggle={health.toggleReminder}
                            onAdd={health.addReminder}
                        />
                    </View>
                </AnimatedCard>
            </ScrollView>
        </View>
    );
}
