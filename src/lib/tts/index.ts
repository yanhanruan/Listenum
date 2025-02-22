import { fetchCloudTTS } from "./cloud";
import { fetchLocalTTS } from "./local";
import { speakWithBrowserTTS } from "./browser";

export async function speakText(text: string, lang = "zh-CN") {
  let audioUrl = await fetchCloudTTS(text, lang);

  if (!audioUrl) {
    console.log("Falling back to local TTS...");
    audioUrl = await fetchLocalTTS(text, lang);
  }

  if (audioUrl) {
    const audio = new Audio(audioUrl);
    audio.play();
  } else {
    console.log("Falling back to browser Web Speech API...");
    speakWithBrowserTTS(text, lang);
  }
}
