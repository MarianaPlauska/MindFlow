import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─── Configuration ──────────────────────────────────────

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,  // Gentle — no aggressive sounds
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

// ─── Permission ─────────────────────────────────────────

export async function requestPermissions() {
    const { status: existing } = await Notifications.getPermissionsAsync();
    if (existing === 'granted') return true;

    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
}

// ─── Schedule Helpers ───────────────────────────────────

/**
 * Schedule a daily water reminder.
 * Gentle: "Hora de beber um copinho de água! 💧"
 */
export async function scheduleWaterReminder(hour: number, minute: number) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '💧 Hidratação',
            body: 'Hora de beber um copinho de água! Cada gole é cuidado.',
            sound: false,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
}

/**
 * Schedule a medication reminder at a specific time.
 */
export async function scheduleMedicationReminder(
    name: string,
    hour: number,
    minute: number,
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '💊 Lembrete de Saúde',
            body: `Hora de ${name}. Cuidar de si é um ato de amor. 💙`,
            sound: false,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
        },
    });
}

/**
 * Schedule the nightly diary invite at 20:00.
 * "Como foi seu dia, Mari? Quer anotar algo no seu diário seguro? 🌙"
 */
export async function scheduleDiaryInvite(displayName: string) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🌙 Diário Emocional',
            body: `Como foi seu dia, ${displayName}? Quer anotar algo no seu diário seguro? 💙`,
            sound: false,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: 20,
            minute: 0,
        },
    });
}

/**
 * Schedule a grocery/shopping reminder for a specific date.
 */
export async function scheduleGroceryReminder(
    itemName: string,
    date: Date,
) {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: '🛒 Lista de Compras',
            body: `Lembrete: é hora de comprar ${itemName}!`,
            sound: false,
        },
        trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date,
        },
    });
}

// ─── Setup Default Reminders ────────────────────────────

/**
 * Initializes the "Grande Amigo" reminder system with sensible defaults.
 * Call once after the user logs in / during onboarding.
 */
export async function setupDefaultReminders(displayName: string) {
    const granted = await requestPermissions();
    if (!granted) return false;

    // Cancel all existing to avoid duplicates
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Water reminders: 9h, 11h, 14h, 16h, 18h
    const waterHours = [9, 11, 14, 16, 18];
    for (const h of waterHours) {
        await scheduleWaterReminder(h, 0);
    }

    // Nightly diary invite at 20h
    await scheduleDiaryInvite(displayName);

    return true;
}

// ─── Cancel All ─────────────────────────────────────────

export async function cancelAllReminders() {
    await Notifications.cancelAllScheduledNotificationsAsync();
}

// ─── List Scheduled ─────────────────────────────────────

export async function listScheduledReminders() {
    return Notifications.getAllScheduledNotificationsAsync();
}
