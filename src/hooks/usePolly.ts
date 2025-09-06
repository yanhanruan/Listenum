import { useState, useEffect } from "react";
import { awsPolly } from "@/lib/tts/aws-polly";

export function usePolly(text: string) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!text) {
      setAudioUrl(null);
      return;
    }

    setIsLoading(true);
    (async () => {
      try {
        const url = await awsPolly(text);
        setAudioUrl(url);
      } catch (err) {
        console.error("Polly error:", err);
        setAudioUrl(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [text]);

  return { audioUrl, isLoading };
}
