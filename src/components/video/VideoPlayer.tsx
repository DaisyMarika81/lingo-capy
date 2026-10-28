"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  videoId?: string;
  initialPositionSec?: number;
  onProgressUpdate?: (watchedPct: number, lastPositionSec: number) => void;
  onCompleted?: () => void;
}

export function VideoPlayer({
  videoId = "lesson-video",
  initialPositionSec = 0,
  onProgressUpdate,
  onCompleted,
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialPositionSec);
  const duration = 480; // 8 minutes default
  const [hasCompleted, setHasCompleted] = useState(false);

  // Debounced progress reporting
  useEffect(() => {
    const timer = setInterval(() => {
      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = Math.min(prev + 1, duration);
          const watchedPct = Math.round((next / duration) * 100);

          if (onProgressUpdate) {
            onProgressUpdate(watchedPct, next);
          }

          if (watchedPct >= 90 && !hasCompleted) {
            setHasCompleted(true);
            if (onCompleted) onCompleted();
          }

          return next;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, duration, hasCompleted, onProgressUpdate, onCompleted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="w-full relative aspect-video bg-gradient-to-br from-[#312E81] to-[#4F46E5] rounded-3xl overflow-hidden shadow-card flex flex-col justify-between p-6 select-none">
      {/* Top watermark / lesson badge */}
      <div className="flex justify-between items-center text-white/80 text-xs font-semibold">
        <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
          Lingo Capy Player · HD 1080p
        </span>
        <span>Minh An · Lớp 6</span>
      </div>

      {/* Center Play/Pause CTA Button */}
      <div className="self-center my-auto flex items-center justify-center">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Tạm dừng video" : "Phát video"}
          className="btn-cta w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-lg"
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-ink-900 fill-current" />
          ) : (
            <Play className="w-8 h-8 text-ink-900 fill-current ml-1" />
          )}
        </button>
      </div>

      {/* Bottom Controls Bar */}
      <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3 flex flex-col gap-2">
        {/* Timeline Slider */}
        <div
          className="w-full h-2 bg-white/30 rounded-full overflow-hidden cursor-pointer relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickPos = (e.clientX - rect.left) / rect.width;
            setCurrentTime(Math.round(clickPos * duration));
          }}
        >
          <div
            className="h-full bg-capy-accent transition-all"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Time and info */}
        <div className="flex justify-between items-center text-white text-xs font-bold">
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-capy-accent transition-colors">
              {isPlaying ? "Tạm dừng" : "Phát"}
            </button>
            <span className="text-white/70">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-white/70">
            {hasCompleted && (
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-md">
                ✓ Đã xem &ge; 90%
              </span>
            )}
            <span>Tốc độ: 1.0x</span>
          </div>
        </div>
      </div>
    </div>
  );
}
