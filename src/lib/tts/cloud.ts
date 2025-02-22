export async function fetchCloudTTS(text: string, lang = "zh-CN"): Promise<string | null> {
    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
  
      if (!response.ok) throw new Error("Cloud TTS request failed");
      
      const data = await response.json();
      return data.audioUrl; // Expected to return a URL to the audio file
    } catch (error) {
      console.error("Cloud TTS Error:", error);
      return null;
    }
  }
  