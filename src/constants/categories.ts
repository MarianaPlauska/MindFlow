// ─── Mood Intensities (redesigned: no clinical labels) ──

export interface MoodLevel {
    score: number;
    label: string;
    emoji: string;
    color: string;
    bg: string;
}

export const MOOD_LEVELS: MoodLevel[] = [
    { score: 1, label: 'Sobrecarregado', emoji: '😞', color: '#be185d', bg: '#fdf2f8' },
    { score: 2, label: 'Pesado', emoji: '😔', color: '#ec4899', bg: '#fce7f3' },
    { score: 3, label: 'Agitado', emoji: '😐', color: '#eab308', bg: '#fefce8' },
    { score: 4, label: 'Tranquilo', emoji: '😊', color: '#22c55e', bg: '#dcfce7' },
    { score: 5, label: 'Levinho', emoji: '😌', color: '#15803d', bg: '#f0fdf4' },
];

// ─── Transaction Categories ─────────────────────────────

export const TX_CATEGORIES = [
    { key: 'alimentacao', label: 'Alimentação', emoji: '🍽️' },
    { key: 'transporte', label: 'Transporte', emoji: '🚌' },
    { key: 'saude', label: 'Saúde', emoji: '💊' },
    { key: 'lazer', label: 'Lazer', emoji: '🎮' },
    { key: 'educacao', label: 'Educação', emoji: '📚' },
    { key: 'moradia', label: 'Moradia', emoji: '🏠' },
    { key: 'compras', label: 'Compras', emoji: '🛍️' },
    { key: 'outros', label: 'Outros', emoji: '📌' },
];

// ─── Card Colors ────────────────────────────────────────

export const CARD_COLORS = [
    '#3b82f6', '#22c55e', '#8b5cf6',
    '#ec4899', '#f97316', '#1d4ed8',
];
