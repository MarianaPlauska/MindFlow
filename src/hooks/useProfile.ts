import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchProfile } from '../services/profileService';

export function useProfile() {
    const { session } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (session?.user?.id) load();
    }, [session]);

    async function load() {
        setLoading(true);
        const { data } = await fetchProfile(session!.user.id);
        if (data) setProfile(data);
        setLoading(false);
    }

    function getGreeting(): string {
        const hour = new Date().getHours();
        if (hour < 6) return 'Boa madrugada';
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    }

    const displayName = profile?.username?.split(' ')[0] || 'usuário';

    return {
        profile,
        loading,
        displayName,
        greeting: getGreeting(),
        refresh: load,
    };
}
