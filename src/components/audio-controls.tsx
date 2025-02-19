"use client";

import { useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react"; // Assuming you're using Lucide icons
import { Button } from "@/components/ui/button"; // Adjust this import if needed

export default function AudioControls() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Update progress bar
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const percent = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(percent);
    }
  };

  return (
    <div className="bg-[#f2f2f2] p-4 rounded-lg flex items-center gap-4">
      <audio
        ref={audioRef}
        src="/audio/sleepy-rain.mp3"
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
      />
      
      <div className="w-12 h-12 bg-[#e5e8eb] rounded-lg flex items-center justify-center">
        <div className="w-6 h-6 bg-[#141414] rounded" />
      </div>

      <div>
        <h3 className="font-medium">Number sequence</h3>
        <p className="text-sm text-[#737873]">Listenum</p>
      </div>

      <div className="flex-1 h-1 bg-[#e5e8eb] rounded-full mx-4 relative">
        <div className="h-full bg-[#789978] rounded-full" style={{ width: `${progress}%` }} />
      </div>

      <div className="text-sm text-[#737873]">1:17</div>
      <div className="text-sm text-[#737873]">2:23</div>

      <Button size="icon" variant="ghost" className="text-[#789978]" onClick={handlePlayPause}>
        {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
      </Button>

      <Button size="icon" variant="ghost" className="text-[#789978]" onClick={handleReplay}>
        <RotateCcw className="w-6 h-6 fill-current" />
      </Button>
    </div>
  );
}
