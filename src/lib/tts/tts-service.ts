import { TTSProvider, TTSOptions, TTSResult } from '@/types/audio';
import { AWSProvider } from './providers/aws-provider';
import { BrowserProvider } from './providers/browser-provider';

export class TTSService {
  private providers: TTSProvider[];
  private browserProvider: BrowserProvider;

  constructor() {
    this.browserProvider = new BrowserProvider();
    this.providers = [
      new AWSProvider(),
      this.browserProvider
    ];
  }

  async speak(text: string, options: TTSOptions = {}): Promise<TTSResult> {
    let lastError: Error | null = null;

    // 尝试每个提供商
    for (const provider of this.providers) {
      try {
        console.log(`尝试使用 ${provider.id} TTS`);
        const result = await provider.speak(text, options);
        // ✅ FIX: 只在 provider.id 是 'aws' 的时候才抛出错误来模拟失败
        if (provider.id === 'aws') {
          throw new Error(`模拟AWS失败`);
        }
        console.log(`${provider.id} TTS 成功`);
        return result;
      } catch (error) {
        console.warn(`${provider.id} TTS 失败:`, error);
        lastError = error;
        continue;
      }
    }

    throw new Error(`所有 TTS 服务都失败了。最后错误: ${lastError?.message}`);
  }

  // 获取浏览器TTS实例，用于直接播放控制
  getBrowserProvider(): BrowserProvider {
    return this.browserProvider;
  }
}

// 单例实例
export const ttsService = new TTSService();