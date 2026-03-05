import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { fetchProfile } from '../services/profileService';
import * as healthSvc from '../services/healthService';
import { WATER_GOAL_ML, PROTEIN_GOAL_G, WATER_INCREMENT_ML } from '../constants/goals';

export function useHealth() {
    const { session } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [waterToday, setWaterToday] = useState(0);
    const [reminders, setReminders] = useState<any[]>([]);
    const [loadingWater, setLoadingWater] = useState(false);
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

    async function load() {
        const userId = session!.user.id;
        setLoading(true);

        const [profileRes, waterRes, remRes] = await Promise.all([
            fetchProfile(userId),
            healthSvc.fetchWaterToday(userId),
            healthSvc.fetchReminders(userId),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        setWaterToday(waterRes.total);
        setReminders(remRes.data);
        setLoading(false);
    }

    async function addWater() {
        setLoadingWater(true);
        await healthSvc.addWaterLog(session!.user.id, WATER_INCREMENT_ML);
        setWaterToday((prev) => prev + WATER_INCREMENT_ML);
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
    const proteinCurrent = 0; // TODO: integrate with food logging
    const proteinPercent = Math.min((proteinCurrent / proteinGoal) * 100, 100);

    return {
        waterToday,
        waterGoal,
        waterPercent,
        waterFillAnim,
        loadingWater,
        proteinCurrent,
        proteinGoal,
        proteinPercent,
        reminders,
        loading,
        addWater,
        toggleReminder,
        addReminder,
        refresh: load,
    };
}
