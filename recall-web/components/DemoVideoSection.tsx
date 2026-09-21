'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Maximize,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

export default function DemoVideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [duration, setDuration] = useState('0:00');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Format seconds to mm:ss
  const formatTime = (timeInSeconds: number) => {
    if (isNaN(timeInSeconds)) return '0:00';
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.warn('Playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(formatTime(current));
    if (total > 0) {
      setProgress((current / total) * 100);
    }
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(formatTime(videoRef.current.duration));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newProgress = clickX / rect.width;
    videoRef.current.currentTime = newProgress * videoRef.current.duration;
    setProgress(newProgress * 100);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    const el = containerRef.current || videoRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const videoChapters = [
    { title: 'The Problem: Scattered Information', time: '0:00' },
    { title: 'Real Screenshot Capture & Vision OCR', time: '0:25' },
    { title: 'AI Extraction & Smart Categorization', time: '0:50' },
    { title: 'Action Inbox: Decisions & Deadlines', time: '1:15' },
    { title: 'Natural Language Semantic Search', time: '1:40' },
  ];

  const handleJumpTo = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = seconds;
    if (!isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <section id="demo" className="py-20 md:py-28 bg-[#F8FAFC] border-t border-slate-100 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-100/40 via-pink-100/30 to-indigo-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-slate-200 text-xs font-extrabold uppercase tracking-widest text-[#2563EB] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E6007A]" />
            <span>LIVE PRODUCT WALKTHROUGH</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            See Recall <span className="text-[#2563EB]">in Action.</span>
          </h2>

          <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
            Watch how Recall imports real mobile data, understands content with on-device AI, and transforms scattered moments into structured memories.
          </p>
        </div>

        {/* Video Player & Chapters Card */}
        <div className="grid lg:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          
          {/* Main Video Frame Player */}
          <div className="lg:col-span-8">
            <div
              ref={containerRef}
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(isPlaying ? false : true)}
              className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl group transition-all"
            >
              {/* HTML5 Video Element */}
              <video
                ref={videoRef}
                src="/demo-video.mp4"
                playsInline
                preload="metadata"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                onClick={handlePlayPause}
                className="w-full h-auto max-h-[480px] object-contain bg-black cursor-pointer"
              />

              {/* Poster & Play Overlay (Shown when not playing) */}
              {!isPlaying && (
                <div
                  onClick={handlePlayPause}
                  className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex flex-col items-center justify-center cursor-pointer transition-all p-6 text-center"
                >
                  <div className="relative mb-4 group-hover:scale-110 transition-transform">
                    <div className="absolute -inset-2 bg-gradient-to-r from-[#E6007A] to-[#2563EB] rounded-full blur-md opacity-70 animate-pulse" />
                    <div className="relative w-20 h-20 rounded-full bg-white text-[#2563EB] flex items-center justify-center shadow-xl">
                      <Play className="w-8 h-8 fill-[#2563EB] translate-x-0.5" />
                    </div>
                  </div>

                  <span className="text-white font-black text-lg sm:text-xl tracking-tight drop-shadow-md">
                    Click to Play Demo
                  </span>
                  <span className="text-slate-200 text-xs font-semibold mt-1 drop-shadow-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Watch full walkthrough with audio</span>
                  </span>
                </div>
              )}

              {/* Floating Fullscreen Trigger Badge at Top Right */}
              <button
                onClick={handleFullscreen}
                className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                title="Watch Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5" />
                <span>Full Screen</span>
              </button>

              {/* Custom Bottom Control Bar */}
              <div
                className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 transition-opacity duration-200 z-20 ${
                  showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Progress Bar / Scrubber */}
                <div
                  onClick={handleSeek}
                  className="w-full h-1.5 bg-white/30 rounded-full cursor-pointer overflow-hidden mb-3 hover:h-2.5 transition-all"
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#E6007A] to-[#2563EB] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Controls Row */}
                <div className="flex items-center justify-between text-white text-xs font-semibold">
                  
                  {/* Left: Play/Pause, Mute, Timestamps */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayPause}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 fill-white" />
                      ) : (
                        <Play className="w-4 h-4 fill-white" />
                      )}
                    </button>

                    <button
                      onClick={toggleMute}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer"
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? (
                        <VolumeX className="w-4 h-4 text-rose-400" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>

                    <div className="font-mono text-[11px] text-slate-300">
                      <span>{currentTime}</span> / <span>{duration}</span>
                    </div>
                  </div>

                  {/* Right: Fullscreen Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleFullscreen}
                      className="p-1.5 rounded-lg hover:bg-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                      aria-label="Toggle Fullscreen"
                    >
                      <Maximize className="w-4 h-4" />
                      <span className="hidden sm:inline text-[11px] font-bold">Full Screen</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Walkthrough Highlights */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            
            <div className="space-y-1 pb-3 border-b border-slate-100">
              <div className="text-xs font-black uppercase tracking-widest text-[#E6007A]">
                WHAT'S COVERED
              </div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">
                Key Features Demonstrated
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              {videoChapters.map((chapter, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    const secs = [0, 25, 50, 75, 100][idx] || 0;
                    handleJumpTo(secs);
                  }}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/60 transition-all cursor-pointer group"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#2563EB] flex items-center justify-center shrink-0 font-mono font-black text-[10px] group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-slate-800 group-hover:text-[#2563EB] transition-colors leading-snug">
                      {chapter.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Full Screen CTA Card */}
            <div className="pt-2">
              <button
                onClick={() => {
                  handlePlayPause();
                  handleFullscreen();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              >
                <Maximize className="w-4 h-4" />
                <span>Play in Full Screen</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
