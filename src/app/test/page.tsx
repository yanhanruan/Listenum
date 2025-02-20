"use client";
import AudioControls from "@/components/audio-controls";
import { browserDefaultSpeech } from "@/lib/tts";
import { useEffect, useState } from "react";

// function synthesizeSpeech(text: string, lang = "zh-CN"): void {
//   if ("speechSynthesis" in window) {
//     const synth = window.speechSynthesis;
//     synth.cancel(); // Prevent overlapping speech

//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang;

//     // Ensure voices are loaded before speaking
//     const voices = synth.getVoices();
//     if (voices.length === 0) {
//       synth.onvoiceschanged = () => {
//         utterance.voice = synth.getVoices().find((v) => v.lang === lang) || null;
//         synth.speak(utterance);
//       };
//     } else {
//       utterance.voice = voices.find((v) => v.lang === lang) || null;
//       synth.speak(utterance);
//     }
//   } else {
//     console.error("The current browser does not support speech synthesis");
//   }
// }

export default function Home() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!isSpeaking) {
      setIsSpeaking(true);
      browserDefaultSpeech("123456","en-US");
      setTimeout(() => setIsSpeaking(false), 1000); // Prevent spam clicking
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <button onClick={handleSpeak} className="px-4 py-2 bg-blue-500 text-white rounded">
        Speak
      </button>
      <AudioControls />
    </main>
  );
}
