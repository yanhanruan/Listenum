// let cachedVoices: SpeechSynthesisVoice[] | null = null;

// export function getVoicesByLanguage(): Promise<SpeechSynthesisVoice[]> {
//     if (cachedVoices) return Promise.resolve(cachedVoices);

//     return new Promise((resolve) => {
//         const updateVoices = () => {
//             cachedVoices = window.speechSynthesis.getVoices();
//             resolve(cachedVoices);
//         };

//         if (window.speechSynthesis.getVoices().length > 0) {
//             updateVoices();
//         } else {
//             window.speechSynthesis.onvoiceschanged = updateVoices;
//         }
//     });
// }

// export const getAvailableLanguages = async () => 
//     [...new Set((await getVoicesByLanguage()).map((v) => v.lang))];

// export const getVoicesForLanguage = async (lang: string) => 
//     (await getVoicesByLanguage()).filter((v) => v.lang === lang);

// export async function speakWithBrowserTTS(text: string, lang = "en-US", voiceURI?: string) {
//     if (!("speechSynthesis" in window)) {
//         console.error("Browser TTS not supported");
//         return;
//     }

//     const voices = await getVoicesByLanguage();
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = lang;
//     utterance.voice = voices.find((v) => v.voiceURI === voiceURI) || voices[0] || null;
    
//     window.speechSynthesis.speak(utterance);
// }


// 文件: lib/tts/browser.ts
// (保留 getVoicesByLanguage 等辅助函数)

/**
 * 获取 SpeechSynthesis 的实例，并进行兼容性检查
 */
const getSpeechSynthesis = (): SpeechSynthesis | null => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis;
    }
    return null;
  };
  
  /**
   * 创建并准备一个 SpeechSynthesisUtterance 实例，但不立即播放。
   * 返回一个包含 utterance 和控制方法的对象。
   * @param text 要朗读的文本
   * @param lang 语言代码
   * @param rate 播放速率 (0.1 to 10)
   * @returns 控制器对象
   */
  export const createBrowserUtterance = (text: string, lang = "en-US", rate = 1.0) => {
    const synth = getSpeechSynthesis();
    if (!synth) {
      console.error("Browser TTS not supported.");
      // 返回一个无操作的接口，防止上层代码出错
      return {
        speak: () => {},
        on: (event: 'start' | 'end' | 'error', callback: () => void) => {},
      };
    }
  
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    // 可以添加 voice 选择逻辑
    // utterance.voice = ...
  
    return {
      /**
       * 开始朗读
       */
      speak: () => {
        // 在播放前确保取消之前的语音
        synth.cancel();
        synth.speak(utterance);
      },
      /**
       * 绑定事件监听
       * @param event 事件名 ('start', 'end', 'error')
       * @param callback 回调函数
       */
      on: (event: 'start' | 'end' | 'error', callback: (ev?: SpeechSynthesisEvent) => void) => {
        utterance[`on${event}`] = callback;
      },
    };
  };
  
  /**
   * 立即停止当前所有浏览器朗读
   */
  export const cancelBrowserTTS = () => {
    const synth = getSpeechSynthesis();
    if (synth) {
      synth.cancel();
    }
  };