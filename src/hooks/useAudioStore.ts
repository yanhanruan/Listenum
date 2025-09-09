import { useState, useCallback, useRef } from 'react';
import { AudioState } from '@/types/audio';

export interface AudioStore extends AudioState {
  // 状态更新方法
  setIsPlaying: (playing: boolean) => void;
  setProgress: (progress: number) => void;
  setDuration: (duration: number) => void;
  setPlaybackRate: (rate: number) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
  reset: () => void;
}

const initialState: AudioState = {
  isPlaying: false,
  progress: 0,
  duration: 0,
  playbackRate: 1.0,
  isLoading: false,
  error: undefined,
};

export function useAudioStore(): AudioStore {
  const [state, setState] = useState<AudioState>(initialState);

  const setIsPlaying = useCallback((playing: boolean) => {
    setState(prev => ({ ...prev, isPlaying: playing }));
  }, []);

  const setProgress = useCallback((progress: number) => {
    setState(prev => ({ ...prev, progress }));
  }, []);

  const setDuration = useCallback((duration: number) => {
    setState(prev => ({ ...prev, duration }));
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, playbackRate: rate }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setError = useCallback((error?: string) => {
    setState(prev => ({ ...prev, error }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    setIsPlaying,
    setProgress,
    setDuration,
    setPlaybackRate,
    setIsLoading,
    setError,
    reset,
  };
}