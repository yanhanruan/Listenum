import { TTSProvider, TTSOptions, TTSResult } from '@/types/audio';

export class AWSProvider implements TTSProvider {
  id = 'aws' as const;

  async speak(text: string, options?: TTSOptions): Promise<TTSResult> {
    try {
      const response = await fetch('/api/polly', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('AWS Polly request failed');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      return {
        type: 'url',
        audioUrl,
        provider: 'aws'
      };
    } catch (error) {
      throw new Error(`AWS TTS failed: ${error.message}`);
    }
  }
}