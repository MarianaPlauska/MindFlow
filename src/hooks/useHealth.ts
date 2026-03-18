import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { fetchProfile } from '../services/profileService';
import * as healthSvc from '../services/healthService';
import { WATER_GOAL_ML, PROTEIN_GOAL_G, WATER_INCREMENT_ML } from '../constants/goals';

export function useHealth() {
    const { session } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [waterToday, setWaterToday] = useState(0);
    const [proteinCurrent, setProteinCurrent] = useState(0);
    const [medicationLogs, setMedicationLogs] = useState<any[]>([]);
    const [medicationRoutines, setMedicationRoutines] = useState<any[]>([]);
    const [reminders, setReminders] = useState<any[]>([]);
    const [loadingWater, setLoadingWater] = useState(false);
    const [loadingProtein, setLoadingProtein] = useState(false);
    const [loadingMedication, setLoadingMedication] = useState(false);
    const [loading, setLoading] = useState(true);

    const waterFillAnim = useRef(new Animated.Value(0)).current;

    const waterGoal = profile?.water_goal_ml || WATER_GOAL_ML;
    const proteinGoal = profile?.protein_goal_g || PROTEIN_GOAL_G;

    useEffect(() => {
        if (session?.user?.id) load();
    }, [session]);

    useEffect(() => {
        const pct = Math.min(waterToday / waterGoal, 1);
        Animated.timing(waterFillAnim, {
            toValue: pct,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [waterToday, waterGoal]);

    const load = useCallback(async () => {
        const userId = session!.user.id;
        setLoading(true);

        // Each query runs independently so one failure doesn't break all
        const [profileRes, waterRes, proteinRes, remRes, medLogsRes, routinesRes] = await Promise.all([
            fetchProfile(userId).catch(() => ({ data: null })),
            healthSvc.fetchWaterToday(userId).catch(() => ({ total: 0 })),
            healthSvc.fetchProteinToday(userId).catch(() => ({ total: 0 })),
            healthSvc.fetchReminders(userId).catch(() => ({ data: [] })),
            healthSvc.fetchMedicationLogsToday(userId).catch(() => ({ data: [] })),
            healthSvc.fetchMedicationRoutines(userId).catch(() => ({ data: [] })),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        setWaterToday(waterRes.total);
        setProteinCurrent(proteinRes.total);
        setReminders(remRes.data);
        setMedicationLogs(medLogsRes.data);
        setMedicationRoutines(routinesRes.data);
        setLoading(false);
    }, [session]);

    async function addWater(amountMl: number = WATER_INCREMENT_ML) {
        setLoadingWater(true);
        setWaterToday((prev) => prev + amountMl);
        const { error } = await healthSvc.addWaterLog(session!.user.id, amountMl);
        if (error) {
            alert("Erro ao salvar água: " + error.message);
            setWaterToday((prev) => prev - amountMl); // rollback
        }
        setLoadingWater(false);
    }

    async function clearWater() {
        setLoadingWater(true);
        setWaterToday(0);
        await healthSvc.clearWaterLog(session!.user.id);
        setLoadingWater(false);
    }

    async function toggleReminder(id: string, isDone: boolean) {
        await healthSvc.toggleReminderDone(id, isDone);
        setReminders((prev) =>
            prev.map((r) => (r.id === id ? { ...r, is_done: !isDone } : r))
        );
    }

    async function addReminder(name: string, type: string) {
        await healthSvc.addReminder(session!.user.id, {
            name,
            reminder_type: type,
        });
        await load();
    }

    const waterPercent = Math.min((waterToday / waterGoal) * 100, 100);
    const proteinPercent = Math.min((proteinCurrent / proteinGoal) * 100, 100);

    async function addProtein(amountG: number, name: string = 'Refeição') {
        setLoadingProtein(true);
        await healthSvc.addProteinLog(session!.user.id, amountG, name);
        setProteinCurrent((prev) => prev + amountG);
        setLoadingProtein(false);
    }

    async function logMedication(name: string = 'Medicação Diária') {
        setLoadingMedication(true);
        const { error } = await healthSvc.addMedicationLog(session!.user.id, name);
        if (error) alert("Erro ao confirmar medicamento: " + error.message);
        await load(); // refresh to get exact logged_at from DB
        setLoadingMedication(false);
    }

    async function addMedicationRoutine(routine: { name: string; dosage?: string; scheduled_time?: string }) {
        const { error } = await healthSvc.addMedicationRoutine(session!.user.id, routine);
        if (error) alert("Erro ao salvar rotina: " + error.message);
        await load();
        return { error };
    }

    async function deleteMedicationRoutine(id: string) {
        const { error } = await healthSvc.deleteMedicationRoutine(id);
        if (error) alert("Erro ao remover rotina: " + error.message);
        await load();
        return { error };
    }

    return {
        waterToday,
        waterGoal,
        waterPercent,
        waterFillAnim,
        loadingWater,
        proteinCurrent,
        proteinGoal,
        proteinPercent,
        medicationLogs,
        reminders,
        loading,
        medicationRoutines,
        addWater,
        clearWater,
        addProtein,
        logMedication,
        addMedicationRoutine,
        deleteMedicationRoutine,
        loadingProtein,
        loadingMedication,
        toggleReminder,
        addReminder,
        refresh: load,
    };
}
