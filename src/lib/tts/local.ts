export async function fetchLocalTTS(text: string, lang = "zh-CN"): Promise<string | null> {
    try {
      const response = await fetch("http://localhost:5000/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
  
      if (!response.ok) throw new Error("Local TTS request failed");
      
      const data = await response.json();
      return data.audioUrl;
    } catch (error) {
      console.error("Local TTS Error:", error);
      return null;
    }
  }
  