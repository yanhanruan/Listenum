"use client";
import AudioControls from "@/components/audio-controls";
import { awsPolly } from "@/lib/tts/aws-polly";
import { use, useEffect, useState } from "react";


export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  useEffect(() => {
    const fetchAudio = async () => {
      const url = await awsPolly("12345");
      setAudioUrl(url);
    };
    fetchAudio();

  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">

      <AudioControls audioUrl={audioUrl} />

    </main>
  );
}
