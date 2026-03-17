import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { WATER_GOAL_ML, PROTEIN_GOAL_G } from '../constants/goals';
import { MOOD_LEVELS } from '../constants/categories';

export interface WeeklyInsight {
    waterDaysHit: number;
    waterAvgMl: number;
    proteinDaysHit: number;
    moodAvgScore: number;
    moodStablePct: number;
    dominantMood: string;
    totalSpent: number;
    topCategory: string;
    message: string;
}

/**
 * Analyzes the past 7 days of data from Supabase to generate
 * a warm, encouraging weekly summary.
 */
export function useWeeklyInsights() {
    const { session } = useAuth();
    const [insight, setInsight] = useState<WeeklyInsight | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) analyze();
    }, [session]);

    async function analyze() {
        const userId = session!.user.id;
        setLoading(true);

        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weekAgoISO = weekAgo.toISOString();

        // Fetch last 7 days of data in parallel
        const [waterRes, moodRes, txRes] = await Promise.all([
            supabase
                .from('water_logs')
                .select('amount_ml, logged_at')
                .eq('user_id', userId)
                .gte('logged_at', weekAgoISO),
            supabase
                .from('mood_logs')
                .select('mood_score, mood_type, logged_at')
                .eq('user_id', userId)
                .gte('logged_at', weekAgoISO),
            supabase
                .from('transactions')
                .select('amount, category, transaction_date')
                .eq('user_id', userId)
                .gte('transaction_date', weekAgo.toISOString().split('T')[0]),
        ]);

        const waterLogs = waterRes.data || [];
        const moodLogs = moodRes.data || [];
        const txLogs = txRes.data || [];

        // ── Water analysis ──────────────────────────────────
        const waterByDay = groupByDay(waterLogs, 'logged_at');
        let waterDaysHit = 0;
        let totalWater = 0;
        for (const [, logs] of Object.entries(waterByDay)) {
            const dayTotal = (logs as any[]).reduce((a: number, l: any) => a + l.amount_ml, 0);
            totalWater += dayTotal;
            if (dayTotal >= WATER_GOAL_ML) waterDaysHit++;
        }
        const daysWithData = Math.max(Object.keys(waterByDay).length, 1);
        const waterAvgMl = Math.round(totalWater / daysWithData);

        // ── Mood analysis ───────────────────────────────────
        const scores = moodLogs.map((m: any) => m.mood_score);
        const moodAvgScore = scores.length > 0
            ? scores.reduce((a: number, s: number) => a + s, 0) / scores.length
            : 0;
        const stableLogs = scores.filter((s: number) => s >= 3);
        const moodStablePct = scores.length > 0
            ? Math.round((stableLogs.length / scores.length) * 100)
            : 0;

        // Find dominant mood type
        const typeCounts: Record<string, number> = {};
        moodLogs.forEach((m: any) => {
            const t = m.mood_type || 'Neutro';
            typeCounts[t] = (typeCounts[t] || 0) + 1;
        });
        const dominantMood = Object.keys(typeCounts).length > 0
            ? Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'Sem registros';

        // ── Finance analysis ────────────────────────────────
        const totalSpent = txLogs.reduce((a: number, t: any) => a + Number(t.amount), 0);
        const catCounts: Record<string, number> = {};
        txLogs.forEach((t: any) => {
            const c = t.category || 'outros';
            catCounts[c] = (catCounts[c] || 0) + Number(t.amount);
        });
        const topCategory = Object.keys(catCounts).length > 0
            ? Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0]
            : 'Nenhum';

        // ── Generate warm message ───────────────────────────
        const parts: string[] = [];

        if (waterDaysHit > 0) {
            parts.push(`Você bateu sua meta de água em ${waterDaysHit} dia${waterDaysHit > 1 ? 's' : ''} 💧`);
        } else if (waterLogs.length > 0) {
            parts.push(`Você registrou água ${Object.keys(waterByDay).length} dia${Object.keys(waterByDay).length > 1 ? 's' : ''} — cada gole conta! 💧`);
        }

        if (moodStablePct > 0) {
            parts.push(`seu humor esteve estável em ${moodStablePct}% do tempo 🌿`);
        }

        if (totalSpent > 0) {
            parts.push(`você investiu R$ ${totalSpent.toFixed(0)} em ${topCategory} 💰`);
        }

        let message = '';
        if (parts.length === 0) {
            message = 'Comece a registrar seus dados para receber insights semanais personalizados! 🌟';
        } else {
            message = `Esta semana, ${parts.join(', ')}. Continue cuidando de si! 💙`;
        }

        setInsight({
            waterDaysHit,
            waterAvgMl,
            proteinDaysHit: 0, // TODO: integrate food logging
            moodAvgScore: Number(moodAvgScore.toFixed(1)),
            moodStablePct,
            dominantMood,
            totalSpent,
            topCategory,
            message,
        });
        setLoading(false);
    }

    return { insight, loading, refresh: analyze };
}

// Group records by day using a date field
function groupByDay(records: any[], dateField: string): Record<string, any[]> {
    const groups: Record<string, any[]> = {};
    records.forEach((r) => {
        const day = new Date(r[dateField]).toISOString().split('T')[0];
        if (!groups[day]) groups[day] = [];
        groups[day].push(r);
    });
    return groups;
}
