// components/enhanced-audio-controls.tsx
"use client";

import {
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ttsService } from "@/lib/tts/tts-service";
import { TTSResult } from "@/types/audio";
import { AudioStore } from "@/hooks/useAudioStore";

export interface AudioControlsHandle {
  play: () => void;
  replay: () => void;
  pause: () => void;
  stop: () => void;
}

interface Props {
  audioUrl: string | null;
  ttsResult: TTSResult | null;
  currentText: string;
  audioStore: AudioStore;
  onPlaybackRateChange?: (rate: number) => void;
}

export const EnhancedAudioControls = forwardRef<AudioControlsHandle, Props>(
  ({ audioUrl, ttsResult, currentText, audioStore, onPlaybackRateChange }, ref) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const browserTTSRef = useRef<{ 
      isPlaying: boolean; 
      startTime: number; 
      pausedTime: number;
      intervalId?: NodeJS.Timeout;
    }>({
      isPlaying: false,
      startTime: 0,
      pausedTime: 0
    });

    const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

    // 浏览器TTS进度模拟
    const simulateBrowserTTSProgress = () => {
      const state = browserTTSRef.current;
      if (!state.isPlaying || audioStore.duration === 0) return;

      const elapsed = (Date.now() - state.startTime) / 1000 + state.pausedTime;
      const progress = Math.min(elapsed, audioStore.duration);
      
      if (!isDragging) {
        audioStore.setProgress(progress);
      }

      if (progress >= audioStore.duration) {
        // 播放结束
        console.log('Browser TTS playback ended');
        state.isPlaying = false;
        audioStore.setIsPlaying(false);
        audioStore.setProgress(audioStore.duration);
        if (state.intervalId) {
          clearInterval(state.intervalId);
          state.intervalId = undefined;
        }
      }
    };

    // 处理浏览器TTS播放
    const playBrowserTTS = async () => {
      const browserProvider = ttsService.getBrowserProvider();
      const state = browserTTSRef.current;

      try {
        // 如果是暂停后恢复
        if (state.pausedTime > 0) {
          console.log('Resuming Browser TTS from', state.pausedTime);
          browserProvider.resume();
          state.startTime = Date.now();
          state.isPlaying = true;
          audioStore.setIsPlaying(true);
          
          // 继续进度模拟
          if (!state.intervalId) {
            state.intervalId = setInterval(simulateBrowserTTSProgress, 100);
          }
          return;
        }

        // 全新播放
        console.log('Starting new Browser TTS playback');
        state.startTime = Date.now();
        state.pausedTime = 0;
        state.isPlaying = true;
        audioStore.setIsPlaying(true);
        audioStore.setProgress(0);

        // 开始进度模拟
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
        state.intervalId = setInterval(simulateBrowserTTSProgress, 100);

        await browserProvider.playDirect(currentText, {
          playbackRate: audioStore.playbackRate,
          lang: 'en-US'
        }, {
          onStart: () => {
            console.log('Browser TTS started');
          },
          onEnd: () => {
            console.log('Browser TTS ended');
            state.isPlaying = false;
            audioStore.setIsPlaying(false);
            audioStore.setProgress(audioStore.duration);
            if (state.intervalId) {
              clearInterval(state.intervalId);
              state.intervalId = undefined;
            }
          },
          onError: (error) => {
            console.error('Browser TTS error:', error);
            state.isPlaying = false;
            audioStore.setIsPlaying(false);
            audioStore.setError(error.message);
            if (state.intervalId) {
              clearInterval(state.intervalId);
              state.intervalId = undefined;
            }
          }
        });
      } catch (error) {
        console.error('Browser TTS play error:', error);
        state.isPlaying = false;
        audioStore.setIsPlaying(false);
        audioStore.setError(error.message);
        if (state.intervalId) {
          clearInterval(state.intervalId);
          state.intervalId = undefined;
        }
      }
    };

    // 暂停浏览器TTS
    const pauseBrowserTTS = () => {
      const browserProvider = ttsService.getBrowserProvider();
      const state = browserTTSRef.current;
      
      browserProvider.pause();
      state.isPlaying = false;
      state.pausedTime = audioStore.progress;
      audioStore.setIsPlaying(false);
      
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = undefined;
      }
    };

    // 重播浏览器TTS
    const replayBrowserTTS = async () => {
      const browserProvider = ttsService.getBrowserProvider();
      const state = browserTTSRef.current;
      
      // 停止当前播放
      browserProvider.stop();
      if (state.intervalId) {
        clearInterval(state.intervalId);
        state.intervalId = undefined;
      }
      
      // 重置状态
      state.pausedTime = 0;
      audioStore.setProgress(0);
      
      // 开始播放
      await playBrowserTTS();
    };

    useImperativeHandle(ref, () => ({
      play: () => {
        if (ttsResult?.type === 'url' && audioRef.current) {
          // AWS TTS
          const audio = audioRef.current;
          if (audio.readyState >= 3) {
            audio.play();
          } else {
            const onCanPlay = () => {
              audio.play();
              audio.removeEventListener('canplay', onCanPlay);
            };
            audio.addEventListener('canplay', onCanPlay);
          }
        } else if (ttsResult?.type === 'direct') {
          // Browser TTS
          playBrowserTTS();
        }
      },
      pause: () => {
        if (ttsResult?.type === 'url' && audioRef.current) {
          audioRef.current.pause();
        } else if (ttsResult?.type === 'direct') {
          pauseBrowserTTS();
        }
      },
      stop: () => {
        if (ttsResult?.type === 'url' && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        } else if (ttsResult?.type === 'direct') {
          const browserProvider = ttsService.getBrowserProvider();
          browserProvider.stop();
          const state = browserTTSRef.current;
          state.isPlaying = false;
          state.pausedTime = 0;
          audioStore.setIsPlaying(false);
          audioStore.setProgress(0);
          if (state.intervalId) {
            clearInterval(state.intervalId);
            state.intervalId = undefined;
          }
        }
      },
      replay: () => {
        if (ttsResult?.type === 'url' && audioRef.current) {
          const audio = audioRef.current;
          audio.currentTime = 0;
          audio.play();
        } else if (ttsResult?.type === 'direct') {
          replayBrowserTTS();
        }
      },
    }));

    // 播放/暂停切换
    const handlePlayPause = () => {
      if (audioStore.isPlaying) {
        // 暂停
        if (ttsResult?.type === 'url' && audioRef.current) {
          audioRef.current.pause();
        } else if (ttsResult?.type === 'direct') {
          pauseBrowserTTS();
        }
      } else {
        // 播放
        if (ttsResult?.type === 'url' && audioRef.current) {
          audioRef.current.play();
        } else if (ttsResult?.type === 'direct') {
          playBrowserTTS();
        }
      }
    };

    // 重播
    const handleReplay = () => {
      if (ttsResult?.type === 'url' && audioRef.current) {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.play();
      } else if (ttsResult?.type === 'direct') {
        replayBrowserTTS();
      }
    };

    // AWS TTS 事件处理
    const handleTimeUpdate = () => {
      if (!audioRef.current || isDragging || ttsResult?.type !== 'url') return;
      audioStore.setProgress(audioRef.current.currentTime);
    };

    const handleLoadedMetadata = () => {
      const audio = audioRef.current;
      if (!audio || ttsResult?.type !== 'url') return;
      audioStore.setDuration(audio.duration);
      audioStore.setProgress(0);
      audio.playbackRate = audioStore.playbackRate;
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      audioStore.setProgress(newTime);
      
      if (ttsResult?.type === 'url' && audioRef.current) {
        audioRef.current.currentTime = newTime;
      } else if (ttsResult?.type === 'direct') {
        // 浏览器TTS不支持精确跳转，重新开始播放
        const state = browserTTSRef.current;
        state.pausedTime = newTime;
        if (state.isPlaying) {
          replayBrowserTTS();
        }
      }
    };

    // 改变播放速度
    const handleChangeSpeed = async (rate: number) => {
      if (ttsResult?.type === 'url' && audioRef.current) {
        // AWS TTS - 直接改变播放速度
        audioRef.current.playbackRate = rate;
        audioStore.setPlaybackRate(rate);
      } else if (ttsResult?.type === 'direct') {
        // Browser TTS - 需要重新生成音频
        audioStore.setPlaybackRate(rate);
        if (onPlaybackRateChange) {
          onPlaybackRateChange(rate);
        }
      }
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleEnded = () => {
      audioStore.setIsPlaying(false);
      audioStore.setProgress(audioStore.duration);
    };

    // 格式化时间
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const progressPercent = useMemo(
      () => (audioStore.duration ? (audioStore.progress / audioStore.duration) * 100 : 0),
      [audioStore.progress, audioStore.duration]
    );

    // 清理定时器
    useEffect(() => {
      return () => {
        const state = browserTTSRef.current;
        if (state.intervalId) {
          clearInterval(state.intervalId);
        }
      };
    }, []);

    return (
      <div className="bg-[#f2f2f2] p-4 rounded-lg flex items-center gap-4 w-full">
        {/* AWS TTS Audio Element */}
        {ttsResult?.type === 'url' && (
          <audio
            ref={audioRef}
            src={audioUrl || undefined}
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onPlay={() => audioStore.setIsPlaying(true)}
            onPause={() => audioStore.setIsPlaying(false)}
          />
        )}

        <div className="w-12 h-12 bg-[#e5e8eb] rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-[#141414] rounded" />
        </div>

        <div>
          <h3 className="font-medium">Number sequence</h3>
          <p className="text-sm text-[#737873]">
            Listenum {ttsResult && `(${ttsResult.provider.toUpperCase()})`}
          </p>
        </div>

        <div className="flex-1 relative group">
          <div className="w-full h-1 bg-gray-300 rounded-full relative overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-[#789978] rounded-full"
              style={{ width: `${Math.min(progressPercent, 100)}%` }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={audioStore.duration || 100}
            step={0.1}
            value={audioStore.progress}
            onChange={handleSeek}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={audioStore.isLoading}
          />
        </div>

        <div className="text-sm text-[#737873] font-mono min-w-[80px]">
          {formatTime(audioStore.progress)} / {formatTime(audioStore.duration)}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="text-[#789978]"
          onClick={handlePlayPause}
          disabled={audioStore.isLoading || audioStore.error}
        >
          {audioStore.isPlaying ? (
            <Pause className="w-6 h-6 fill-current" />
          ) : (
            <Play className="w-6 h-6 fill-current" />
          )}
        </Button>

        <Button
          size="icon"
          variant="ghost"
          className="text-[#789978]"
          onClick={handleReplay}
          disabled={audioStore.isLoading || audioStore.error}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-[#789978] font-mono"
              disabled={audioStore.isLoading || audioStore.error}
            >
              {audioStore.playbackRate}x
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {speedOptions.map((rate) => (
              <DropdownMenuItem
                key={rate}
                onClick={() => handleChangeSpeed(rate)}
                className={
                  rate === audioStore.playbackRate ? "font-bold text-[#789978]" : ""
                }
              >
                {rate}x
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {audioStore.error && (
          <div className="text-red-500 text-sm">
            Error: {audioStore.error}
          </div>
        )}
      </div>
    );
  }
);

EnhancedAudioControls.displayName = "EnhancedAudioControls";