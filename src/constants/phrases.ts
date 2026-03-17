// ─── Self-care Phrases ──────────────────────────────────

export const MIND_PHRASES = [
    'Respirar é o primeiro passo. Você está fazendo o suficiente. 🌿',
    'Seus sentimentos são válidos, sempre. 💙',
    'Hoje é um dia novo — e isso já é um recomeço. 🌅',
    'Seja gentil consigo. A vida não precisa ser perfeita. 💚',
    'Você é mais forte do que pensa. 🦋',
    'Cuidar da mente é tão importante quanto cuidar do corpo. 🧘',
    'Está tudo bem não estar bem. Peça ajuda quando precisar. 💜',
    'Cada respiração profunda é um abraço em si. 🫧',
    'O progresso não é linear — e tudo bem. 🌱',
    'Você merece paz. Permita-se descansar. ☁️',
];

export const HEALTH_PHRASES = [
    'Seu corpo merece hidratação e cuidado. 💧',
    'Cada copo de água é um ato de amor próprio. 💙',
    'Proteína constrói força — e força começa por dentro. 💪',
    'Lembrar do remédio é lembrar de si. 💊',
    'Pequenos hábitos constroem grandes mudanças. 🌱',
    'Cuide do corpo como cuida de quem ama. 💚',
];

export const FINANCE_PHRASES = [
    'Cuidar do dinheiro é cuidar de si. 💙',
    'Cada real economizado é paz de espírito. 🌿',
    'Respire fundo. Suas finanças estão no caminho certo. 🧘',
    'Planejamento é carinho com o futuro você. 🌱',
    'Gastar com consciência é um ato de autocuidado. 💚',
];

export function getRandomPhrase(phrases: string[]): string {
    return phrases[Math.floor(Math.random() * phrases.length)];
}
