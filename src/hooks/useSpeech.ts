import { useState, useRef, useEffect } from 'react';
import { TTSProvider, generateAudioUrl } from '@/lib/ttsService';
// NOTE: I've removed the incorrect 'typescript' import for the Utterance. It's a built-in type.

// A helper to estimate speech duration (e.g., 180 words per minute)
const estimateDuration = (text: string) => {
  const words = text.trim().split(/\s+/).length;
  const wpm = 180;
  return (words / wpm) * 60; // duration in seconds
};

export function useSpeech() {
  const [provider, setProvider] = useState<TTSProvider>(TTSProvider.AWS_Polly);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const textRef = useRef<string>("");

  const cleanup = () => {
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
    }
    window.speechSynthesis.cancel();
    if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
    }
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  };

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.onplay = () => setIsPlaying(true);
    audioRef.current.onpause = () => setIsPlaying(false);
    audioRef.current.onended = () => {
        setIsPlaying(false);
        if (audioRef.current) setProgress(audioRef.current.duration);
    };
    audioRef.current.ontimeupdate = () => {
        if(audioRef.current) setProgress(audioRef.current.currentTime);
    };
    audioRef.current.onloadedmetadata = () => {
        if(audioRef.current) setDuration(audioRef.current.duration);
    };
    
    return cleanup;
  }, []);
  
  const generateAndPlay = async (text: string, newProvider: TTSProvider, rate = playbackRate) => {
    cleanup();
    setIsLoading(true);
    
    textRef.current = text;
    setProvider(newProvider);
    setPlaybackRate(rate); // Ensure rate is consistent

    try {
        if (newProvider === TTSProvider.AWS_Polly) {
            const url = await generateAudioUrl(text, newProvider);
            if (url && audioRef.current) {
                audioRef.current.src = url;
                audioRef.current.playbackRate = rate;
                audioRef.current.play();
            }
        } else {
            const estimated = estimateDuration(text);
            setDuration(estimated);
            
            utteranceRef.current = new SpeechSynthesisUtterance(text);
            utteranceRef.current.rate = rate; // Use the provided rate
            
            utteranceRef.current.onstart = () => {
                setIsPlaying(true);
                const startTime = Date.now();
                progressIntervalRef.current = setInterval(() => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    setProgress(Math.min(elapsed, estimated));
                }, 100);
            };
            
            utteranceRef.current.onend = () => {
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                setIsPlaying(false);
                setProgress(estimated);
            };
            
            utteranceRef.current.onerror = () => {
                if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
                setIsPlaying(false);
                console.error("Browser TTS Error");
            }
            
            window.speechSynthesis.speak(utteranceRef.current);
        }
    } catch (error) {
        console.error("TTS Error:", error);
    } finally {
        setIsLoading(false);
    }
  };

  const onPlayPause = () => {
    if (isPlaying) {
      if (provider === TTSProvider.AWS_Polly) audioRef.current?.pause();
      else window.speechSynthesis.pause();
    } else {
      if (provider === TTSProvider.AWS_Polly) audioRef.current?.play();
      else window.speechSynthesis.resume();
    }
  };

  const onReplay = () => {
     generateAndPlay(textRef.current, provider, playbackRate);
  };
  
  const onSeek = (value: number) => {
    if (provider === TTSProvider.AWS_Polly && audioRef.current) {
      audioRef.current.currentTime = value;
      setProgress(value);
    }
    // No seeking for browser TTS
  };

  // --- THIS IS THE KEY CHANGE ---
  const onChangeSpeed = (rate: number) => {
    setPlaybackRate(rate);
    if (provider === TTSProvider.AWS_Polly) {
        if (audioRef.current) {
            audioRef.current.playbackRate = rate;
        }
    } else {
        // For Browser TTS, restart the speech immediately with the new rate
        // This provides instant feedback to the user
        if (isPlaying || progress > 0) { // Only restart if it was playing or paused mid-way
            generateAndPlay(textRef.current, TTSProvider.Browser, rate);
        }
    }
  };

  return {
    isLoading,
    isPlaying,
    progress,
    duration,
    playbackRate,
    canSeek: provider === TTSProvider.AWS_Polly,
    generateAndPlay,
    // Speed can now always be changed
    onPlayPause,
    onReplay,
    onSeek,
    onChangeSpeed,
  };
}