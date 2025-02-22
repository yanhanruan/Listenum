// TODO wrap with tailwind css
"use client";
import { useState, useEffect, useCallback } from "react";
import { getAvailableLanguages, getVoicesForLanguage, speakText } from "@/lib/tts/browser";

export default function SpeechComponent() {
    const [state, setState] = useState({
        languages: [] as string[],
        voices: [] as SpeechSynthesisVoice[],
        selectedLang: "",
        selectedVoice: ""
    });

    useEffect(() => {
        getAvailableLanguages().then(languages => 
            setState(prev => ({ ...prev, languages }))
        );
    }, []);

    useEffect(() => {
        if (state.selectedLang) {
            getVoicesForLanguage(state.selectedLang).then(voices => {
                setState(prev => ({
                    ...prev,
                    voices,
                    selectedVoice: voices[0]?.voiceURI || ""
                }));
            });
        }
    }, [state.selectedLang]);

    const handleLanguageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setState(prev => ({ ...prev, selectedLang: e.target.value }));
    }, []);

    const handleVoiceChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        setState(prev => ({ ...prev, selectedVoice: e.target.value }));
    }, []);

    const handleSpeak = useCallback(() => {
        speakText("Hello", "en-US", state.selectedVoice);
    }, [state.selectedVoice]);

    return (
        <div className="flex flex-col gap-2">
            <select value={state.selectedLang} onChange={handleLanguageChange}>
                <option value="">Select Language</option>
                {state.languages.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>

            <select 
                value={state.selectedVoice} 
                onChange={handleVoiceChange}
                disabled={!state.selectedLang}
            >
                {state.voices.map(voice => (
                    <option key={voice.voiceURI} value={voice.voiceURI}>
                        {voice.name}
                    </option>
                ))}
            </select>

            <button onClick={handleSpeak}>Speak</button>
        </div>
    );
}
