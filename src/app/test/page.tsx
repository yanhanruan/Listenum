"use client";
import AudioControls from "@/components/audio-controls";
import { generateSpeech } from "@/services/ttsService";

import { useEffect, useState } from "react";

export default function Home() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSpeak = () => {
    if (!isSpeaking) {
      setIsSpeaking(true);
      // browserDefaultSpeech("123456","en-US");
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
