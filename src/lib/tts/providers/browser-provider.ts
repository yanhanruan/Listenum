import { TTSProvider, TTSOptions, TTSResult } from '@/types/audio';

export class BrowserProvider implements TTSProvider {
  id = 'browser' as const;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    this.loadVoices();
  }

  private async loadVoices(): Promise<void> {
    return new Promise((resolve) => {
      const updateVoices = () => {
        this.voices = window.speechSynthesis.getVoices();
        resolve();
      };

      if (window.speechSynthesis.getVoices().length > 0) {
        updateVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
    });
  }

  private estimateAudioDuration(text: string, rate: number = 1): number {
    // 估算语音时长：平均每分钟150个单词，每个单词5个字符
    const wordsPerMinute = 150 * rate;
    const charactersPerMinute = wordsPerMinute * 5;
    const durationInMinutes = text.length / charactersPerMinute;
    return durationInMinutes * 60; // 转换为秒
  }

  async speak(text: string, options: TTSOptions = {}): Promise<TTSResult> {
    try {
      await this.loadVoices();
      
      const duration = this.estimateAudioDuration(text, options.playbackRate || 1);
      
      return {
        type: 'direct',
        duration,
        provider: 'browser'
      };
    } catch (error) {
      throw new Error(`Browser TTS failed: ${error.message}`);
    }
  }

  // 实际播放语音的方法
  async playDirect(
    text: string, 
    options: TTSOptions = {},
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: Error) => void;
    }
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.stop(); // 停止当前播放

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options.lang || 'en-US';
      utterance.rate = options.playbackRate || 1;
      
      if (this.voices.length > 0) {
        const voice = this.voices.find(v => v.voiceURI === options.voice) || this.voices[0];
        utterance.voice = voice;
      }

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        callbacks?.onEnd?.();
        resolve();
      };

      utterance.onerror = (event) => {
        const error = new Error(`Speech synthesis error: ${event.error}`);
        callbacks?.onError?.(error);
        reject(error);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    });
  }

  pause(): void {
    window.speechSynthesis.pause();
  }

  resume(): void {
    window.speechSynthesis.resume();
  }

  stop(): void {
    window.speechSynthesis.cancel();
    this.currentUtterance = null;
  }
}