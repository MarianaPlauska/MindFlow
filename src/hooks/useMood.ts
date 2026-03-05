import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import * as moodSvc from '../services/moodService';
import { MOOD_LEVELS } from '../constants/categories';

export function useMood() {
    const { session } = useAuth();
    const [logs, setLogs] = useState<any[]>([]);
    const [selectedScore, setSelectedScore] = useState<number | null>(null);
    const [notes, setNotes] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    const scaleAnims = useRef(MOOD_LEVELS.map(() => new Animated.Value(1))).current;

    useEffect(() => {
        if (session?.user?.id) load();
    }, [session]);

    async function load() {
        setLoading(true);
        const { data } = await moodSvc.fetchMoodLogs(session!.user.id);
        setLogs(data);
        setLoading(false);
    }

    function selectMood(index: number, score: number) {
        // Animate selected
        Animated.sequence([
            Animated.timing(scaleAnims[index], { toValue: 1.3, duration: 100, useNativeDriver: true }),
            Animated.spring(scaleAnims[index], { toValue: 1.1, friction: 3, useNativeDriver: true }),
        ]).start();

        // Reset others
        scaleAnims.forEach((anim, i) => {
            if (i !== index) {
                Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
            }
        });

        setSelectedScore(score);
        setShowNoteModal(true);
    }

    async function save() {
        if (!selectedScore) return;
        setSaving(true);
        // Use the mood label as mood_type (intensity-based, no clinical labels)
        const moodLevel = MOOD_LEVELS.find((m) => m.score === selectedScore);
        await moodSvc.saveMoodLog(session!.user.id, {
            mood_score: selectedScore,
            mood_type: moodLevel?.label || 'Neutro',
            notes: notes.trim() || null,
        });
        resetSelection();
        setSaving(false);
        await load();
    }

    function resetSelection() {
        setSelectedScore(null);
        setNotes('');
        setShowNoteModal(false);
        scaleAnims.forEach((anim) => {
            Animated.timing(anim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
        });
    }

    function getMoodData(score: number) {
        return MOOD_LEVELS.find((m) => m.score === score) || MOOD_LEVELS[2];
    }

    return {
        logs,
        selectedScore,
        notes,
        setNotes,
        showNoteModal,
        saving,
        loading,
        scaleAnims,
        selectMood,
        save,
        resetSelection,
        getMoodData,
        refresh: load,
    };
}
