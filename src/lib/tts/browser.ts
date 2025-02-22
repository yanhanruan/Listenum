let cachedVoices: SpeechSynthesisVoice[] | null = null;

export function getVoicesByLanguage(): Promise<SpeechSynthesisVoice[]> {
    if (cachedVoices) return Promise.resolve(cachedVoices);

    return new Promise((resolve) => {
        const updateVoices = () => {
            cachedVoices = window.speechSynthesis.getVoices();
            resolve(cachedVoices);
        };

        if (window.speechSynthesis.getVoices().length > 0) {
            updateVoices();
        } else {
            window.speechSynthesis.onvoiceschanged = updateVoices;
        }
    });
}

export const getAvailableLanguages = async () => 
    [...new Set((await getVoicesByLanguage()).map((v) => v.lang))];

export const getVoicesForLanguage = async (lang: string) => 
    (await getVoicesByLanguage()).filter((v) => v.lang === lang);

export async function speakText(text: string, lang = "en-US", voiceURI?: string) {
    if (!("speechSynthesis" in window)) {
        console.error("Browser TTS not supported");
        return;
    }

    const voices = await getVoicesByLanguage();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.voice = voices.find((v) => v.voiceURI === voiceURI) || voices[0] || null;
    
    window.speechSynthesis.speak(utterance);
}
