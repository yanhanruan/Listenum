import { speakWithBrowserTTS } from './tts/browser'
import { awsPolly } from './tts/aws-polly';

// Define the available TTS providers for clarity
export enum TTSProvider {
  Browser,
  AWS_Polly,
}

/**
 * Generates an audio URL from a provider that supports it (AWS Polly).
 * Returns null if the provider plays audio directly (Browser TTS).
 */
export async function generateAudioUrl(
  text: string,
  provider: TTSProvider
): Promise<string | null> {
  if (provider === TTSProvider.AWS_Polly) {
    return awsPolly(text);
  }
  return null;
}

/**
 * Plays audio directly using a provider that supports it (Browser TTS).
 */
export function playAudioDirectly(
  text: string,
  provider: TTSProvider,
  options: { lang?: string; voiceURI?: string } = {}
): void {
  if (provider === TTSProvider.Browser) {
    speakWithBrowserTTS(text, options.lang, options.voiceURI);
  }
}