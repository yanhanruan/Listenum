"use client";

import {
  useRef,
  useState,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

// Define the props for the component, including the new isLoading state
type Props = {
  audioUrl: string | null;
  isLoading: boolean;
};

// Define the functions that the parent component can call using a ref
export type AudioControlsHandle = {
  play: () => void;
  replay: () => void;
};

export const AudioControls = forwardRef<AudioControlsHandle, Props>(
  ({ audioUrl, isLoading }, ref) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [playbackRate, setPlaybackRate] = useState(1.0);

    const speedOptions = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

    // Replace this entire block in your AudioControls component
    useImperativeHandle(ref, () => ({
      play: () => {
        const audio = audioRef.current;
        if (!audio) return;

        // This is the fix: Check if the audio is actually ready to play.
        // readyState >= 3 means it has enough data to start.
        if (audio.readyState >= 3) {
          audio.play();
        } else {
          // If not ready, we add a one-time event listener to play the audio
          // as soon as the browser says it's ready.
          const onCanPlay = () => {
            audio.play();
            audio.removeEventListener('canplay', onCanPlay);
          };
          audio.addEventListener('canplay', onCanPlay);
        }
      },
      replay: () => {
        handleReplay();
      },
    }));

    // Toggle play/pause
    const handlePlayPause = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (audio.paused) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    // Restart playback from the beginning
    const handleReplay = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.currentTime = 0;
      audio.play();
    };

    // Update playback progress
    const handleTimeUpdate = () => {
      if (!audioRef.current || isDragging) return;
      setProgress(audioRef.current.currentTime);
    };

    // When audio metadata is loaded
    const handleLoadedMetadata = () => {
      const audio = audioRef.current;
      if (!audio) return;
      setDuration(audio.duration);
      setProgress(0);
      audio.playbackRate = playbackRate;
    };

    // Seek manually
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = parseFloat(e.target.value);
      setProgress(newTime);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    };

    // Handle dragging on progress bar
    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    // Playback ended
    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(duration);
    };

    // Change playback speed
    const handleChangeSpeed = (rate: number) => {
      if (!audioRef.current) return;
      audioRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    };

    // Format seconds into mm:ss
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    const progressPercent = useMemo(
      () => (duration ? (progress / duration) * 100 : 0),
      [progress, duration]
    );

    return (
      <div className="bg-[#f2f2f2] p-4 rounded-lg flex items-center gap-4 w-full">
        <audio
          ref={audioRef}
          src={audioUrl || undefined}
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="w-12 h-12 bg-[#e5e8eb] rounded-lg flex items-center justify-center">
          <div className="w-6 h-6 bg-[#141414] rounded" />
        </div>

        <div>
          <h3 className="font-medium">Number sequence</h3>
          <p className="text-sm text-[#737873]">Listenum</p>
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
            max={duration || 100}
            step={0.1}
            value={progress}
            onChange={handleSeek}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        <div className="text-sm text-[#737873] font-mono min-w-[80px]">
          {formatTime(progress)} / {formatTime(duration)}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="text-[#789978]"
          onClick={handlePlayPause}
          // BUG FIX: Disable button if there's no audio URL or if a new one is loading.
          disabled={!audioUrl || isLoading}
        >
          {isPlaying ? (
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
          // BUG FIX: Disable button if there's no audio URL or if a new one is loading.
          disabled={!audioUrl || isLoading}
        >
          <RotateCcw className="w-6 h-6" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="text-[#789978] font-mono"
              disabled={!audioUrl || isLoading}
            >
              {playbackRate}x
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {speedOptions.map((rate) => (
              <DropdownMenuItem
                key={rate}
                onClick={() => handleChangeSpeed(rate)}
                className={
                  rate === playbackRate ? "font-bold text-[#789978]" : ""
                }
              >
                {rate}x
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
);

AudioControls.displayName = "AudioControls";
export default AudioControls;
