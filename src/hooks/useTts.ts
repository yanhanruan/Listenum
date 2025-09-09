// 文件: hooks/useTts.ts

import { useState, useEffect, useCallback, useRef } from 'react';
import { awsPolly } from '@/lib/tts/aws-polly';
import { createBrowserUtterance, cancelBrowserTTS } from '@/lib/tts/browser';

// 定义播放状态的结构
interface PlaybackState {
  isPlaying: boolean;
  duration: number;
  progress: number;
  playbackRate: number;
}

// Hook 返回的接口
export interface UseTtsResult {
  state: PlaybackState & {
    isLoading: boolean;
    isBrowserTts: boolean;
    audioUrl: string | null;
  };
  actions: {
    play: () => void;
    pause: () => void;
    replay: () => void;
    seek: (time: number) => void;
    changeSpeed: (rate: number) => void;
    attachAudioRef: (element: HTMLAudioElement | null) => void;
  };
}

const CHARS_PER_SECOND = 15; // 用于估算浏览器TTS时长的平均每秒字符数

export function useTts(text: string): UseTtsResult {
  const [isLoading, setIsLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [ttsService, setTtsService] = useState<'aws' | 'browser' | 'idle'>('idle');

  const [playbackState, setPlaybackState] = useState<PlaybackState>({
    isPlaying: false,
    duration: 0,
    progress: 0,
    playbackRate: 1.0,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 清理计时器
  const cleanupProgressInterval = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  // 主效果钩子，当文本变化时触发
  useEffect(() => {
    if (!text) {
      setIsLoading(false);
      setTtsService('idle');
      return;
    }

    // --- 清理上一个状态 ---
    setIsLoading(true);
    setPlaybackState(prev => ({ ...prev, isPlaying: false, progress: 0, duration: 0 }));
    cleanupProgressInterval();
    cancelBrowserTTS();
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    // ----------------------

    const fetchTts = async () => {
      try {
        const url = await awsPolly(text);
        setAudioUrl(url);
        setTtsService('aws');
        // duration 会在 audio 元素的 onLoadedMetadata 事件中设置
      } catch (error) {
        console.error("AWS Polly failed, falling back to browser TTS:", error);
        setTtsService('browser');
        // 估算时长
        const estimatedDuration = text.length / CHARS_PER_SECOND;
        setPlaybackState(prev => ({ ...prev, duration: estimatedDuration }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchTts();

    // 组件卸载时的最终清理
    return () => {
      cleanupProgressInterval();
      cancelBrowserTTS();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [text, cleanupProgressInterval]);


  // --- 统一的播放控制 Action ---

  const play = useCallback(() => {
    if (ttsService === 'aws' && audioRef.current) {
      audioRef.current.play().catch(console.error);
    } else if (ttsService === 'browser') {
      const utteranceController = createBrowserUtterance(text, 'en-US', playbackState.playbackRate);
      
      utteranceController.on('start', () => {
        setPlaybackState(prev => ({ ...prev, isPlaying: true, progress: 0 }));
        cleanupProgressInterval();
        progressIntervalRef.current = setInterval(() => {
          setPlaybackState(prev => {
            const newProgress = prev.progress + 0.1;
            if (newProgress >= prev.duration) {
              cleanupProgressInterval();
              return { ...prev, progress: prev.duration, isPlaying: false };
            }
            return { ...prev, progress: newProgress };
          });
        }, 100);
      });

      const onEndOrError = () => {
        cleanupProgressInterval();
        setPlaybackState(prev => ({ ...prev, isPlaying: false, progress: prev.duration }));
      };
      utteranceController.on('end', onEndOrError);
      utteranceController.on('error', onEndOrError);

      utteranceController.speak();
    }
  }, [ttsService, text, playbackState.playbackRate, playbackState.duration, cleanupProgressInterval]);

  const pause = useCallback(() => {
    if (ttsService === 'aws' && audioRef.current) {
      audioRef.current.pause();
    } else if (ttsService === 'browser') {
      cancelBrowserTTS();
      cleanupProgressInterval();
      setPlaybackState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [ttsService, cleanupProgressInterval]);

  const replay = useCallback(() => {
    if (ttsService === 'aws' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(console.error);
    } else if (ttsService === 'browser') {
      // 重新播放会触发新的 start 事件，状态会在那里重置
      play();
    }
  }, [ttsService, play]);

  const changeSpeed = useCallback((rate: number) => {
    setPlaybackState(prev => ({ ...prev, playbackRate: rate }));
    if (ttsService === 'aws' && audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
    // 对于浏览器TTS，如果在播放中，则需要重新播放以应用速率
    if (ttsService === 'browser' && playbackState.isPlaying) {
      // 由于 state 更新是异步的，我们需要在下一次 `play` 调用中获得新的速率
      // 所以我们直接在这里创建一个新的 utterance
      const utteranceController = createBrowserUtterance(text, 'en-US', rate);
      // ... (此处逻辑与 play 函数内相同，可以考虑重构提取)
      // 简单起见，我们将在下一个版本中触发play
      // play() 将使用更新后的 playbackRate state
    }
  }, [ttsService, text, playbackState.isPlaying]);
  
  // 仅在 `changeSpeed` 后如果正在播放，则重新触发播放
  useEffect(() => {
      if(ttsService === 'browser' && playbackState.isPlaying) {
          play();
      }
  }, [playbackState.playbackRate]);


  const seek = useCallback((time: number) => {
    if (ttsService === 'aws' && audioRef.current) {
      audioRef.current.currentTime = time;
      setPlaybackState(prev => ({ ...prev, progress: time }));
    }
    // 浏览器TTS不支持seek
  }, [ttsService]);
  
  const attachAudioRef = useCallback((element: HTMLAudioElement | null) => {
      audioRef.current = element;
      if (element) {
        // 绑定事件处理器
        const updateProgress = () => setPlaybackState(p => ({ ...p, progress: element.currentTime }));
        const updateDuration = () => setPlaybackState(p => ({ ...p, duration: element.duration }));
        const updatePlaying = (isPlaying: boolean) => () => setPlaybackState(p => ({ ...p, isPlaying }));

        element.addEventListener('timeupdate', updateProgress);
        element.addEventListener('loadedmetadata', updateDuration);
        element.addEventListener('play', updatePlaying(true));
        element.addEventListener('pause', updatePlaying(false));
        element.addEventListener('ended', updatePlaying(false));
        // TODO: 在 ref 变化或卸载时移除事件监听
      }
  }, []);

  return {
    state: {
      ...playbackState,
      isLoading,
      isBrowserTts: ttsService === 'browser',
      audioUrl,
    },
    actions: {
      play,
      pause,
      replay,
      seek,
      changeSpeed,
      attachAudioRef,
    },
  };
}