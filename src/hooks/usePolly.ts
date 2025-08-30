import { useState, useEffect } from "react";
import { awsPolly } from "@/lib/tts/aws-polly";

export function usePolly(text: string) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!text) return;
    const fetchAudio = async () => {
      const url = await awsPolly(text);
      setAudioUrl(url);
    };
    fetchAudio();
  }, [text]);

  return audioUrl;
}
