// TODO: add different voices
// Function to get all available voices
export function getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise((resolve) => {
        // Get voices if already loaded
        let voices = window.speechSynthesis.getVoices();
        if (voices.length) {
            resolve(voices);
            return;
        }

        // Wait for voices to load
        window.speechSynthesis.onvoiceschanged = () => {
            voices = window.speechSynthesis.getVoices();
            resolve(voices);
        };
    });
}

export function browserDefaultSpeech(text: string, lang = "en-US") {
    if (!window.speechSynthesis) throw new Error("Browser does not support speech synthesis");
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  }
  