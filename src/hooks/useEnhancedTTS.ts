import { useState, useEffect, useRef, useCallback } from 'react';
import { ttsService } from '@/lib/tts/tts-service';
import { TTSResult } from '@/types/audio';
import { useAudioStore } from './useAudioStore';

export interface EnhancedTTSHook {
  audioUrl: string | null;
  ttsResult: TTSResult | null;
  audioStore: ReturnType<typeof useAudioStore>;
  regenerateAudio: (newRate?: number) => Promise<void>;
}

export function useEnhancedTTS(text: string): EnhancedTTSHook {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsResult, setTtsResult] = useState<TTSResult | null>(null);
  const audioStore = useAudioStore();
  const currentTextRef = useRef<string>('');
  const isGeneratingRef = useRef<boolean>(false);

  const generateAudio = useCallback(async (inputText: string, playbackRate?: number) => {
    if (!inputText.trim()) {
      setAudioUrl(null);
      setTtsResult(null);
      audioStore.reset();
      return;
    }

    // 防止重复生成
    if (isGeneratingRef.current) {
      console.log('Already generating audio, skipping...');
      return;
    }

    isGeneratingRef.current = true;
    audioStore.setIsLoading(true);
    audioStore.setError(undefined);
    
    // 停止当前播放
    audioStore.setIsPlaying(false);
    audioStore.setProgress(0);

    try {
      console.log(`Generating TTS for: "${inputText}"`);
      const result = await ttsService.speak(inputText, { 
        playbackRate: playbackRate || audioStore.playbackRate 
      });
      
      setTtsResult(result);
      
      if (result.type === 'url' && result.audioUrl) {
        // AWS TTS - 有实际的音频URL
        if (audioUrl) {
          URL.revokeObjectURL(audioUrl); // 清理之前的URL
        }
        setAudioUrl(result.audioUrl);
        console.log('AWS TTS audio ready');
      } else if (result.type === 'direct') {
        // Browser TTS - 直接播放，设置估算时长
        setAudioUrl(null);
        if (result.duration) {
          audioStore.setDuration(result.duration);
        }
        console.log('Browser TTS ready, duration:', result.duration);
      }
    } catch (error) {
      console.error('TTS error:', error);
      audioStore.setError(error.message);
      setAudioUrl(null);
      setTtsResult(null);
    } finally {
      audioStore.setIsLoading(false);
      isGeneratingRef.current = false;
    }
  }, [audioStore, audioUrl]);

  const regenerateAudio = useCallback(async (newRate?: number) => {
    if (newRate && newRate !== audioStore.playbackRate) {
      audioStore.setPlaybackRate(newRate);
    }
    await generateAudio(currentTextRef.current, newRate || audioStore.playbackRate);
  }, [generateAudio, audioStore]);

  // 当文本改变时生成音频
  useEffect(() => {
    if (text && text !== currentTextRef.current) {
      console.log(`Text changed from "${currentTextRef.current}" to "${text}"`);
      currentTextRef.current = text;
      generateAudio(text);
    }
  }, [text, generateAudio]);

  // 清理资源
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    audioUrl,
    ttsResult,
    audioStore,
    regenerateAudio,
  };
}