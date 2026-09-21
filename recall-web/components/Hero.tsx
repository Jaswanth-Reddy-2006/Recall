'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRight,
  Play,
  Maximize,
  RotateCcw,
  Camera,
  Link2,
  FileText,
  PhoneCall,
  Search,
  Clock,
  Calendar,
  Check,
  Home,
  Inbox,
  BookOpen,
} from 'lucide-react';
import { RecallLogo } from './Navbar';

export default function Hero() {
  const [isVideoMode, setIsVideoMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleWatchDemoClick = () => {
    const nextMode = !isVideoMode;
    setIsVideoMode(nextMode);

    if (nextMode) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.play().catch(() => {});
        }
      }, 400);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    }
  };

  const handleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if ((video as any).webkitRequestFullscreen) {
      (video as any).webkitRequestFullscreen();
    } else if ((video as any).msRequestFullscreen) {
      (video as any).msRequestFullscreen();
    }
  };

  const handleVideoEnded = () => {
    setIsVideoMode(false);
  };

  return (
    <section id="home" className="relative pt-16 pb-10 md:pt-20 md:pb-14 overflow-hidden">
      {/* Ambient background soft pastel glow circles */}
      <div className="absolute top-10 left-1/4 w-[450px] h-[450px] bg-pink-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, CTAs, Capture Pills */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-slate-900 tracking-tight leading-[1.08]">
              Your memory, <br />
              <span className="text-[#E6007A]">finally </span>
              <span className="text-[#2563EB]">organized.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-lg">
              Capture anything—screenshots, links, notes, or calls. Recall understands, connects the dots, and turns them into actionable insights so you never lose important information again.
            </p>

            {/* Two Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="#features"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold text-white bg-[#E6007A] hover:bg-[#C20067] shadow-pink hover:shadow-lg transition-all"
              >
                <span>Try the Prototype</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              {/* Watch Demo Button that triggers smooth phone rotation */}
              <button
                onClick={handleWatchDemoClick}
                className={`inline-flex items-center gap-2 px-5 py-3.5 rounded-full text-sm font-bold transition-all shadow-sm cursor-pointer ${
                  isVideoMode
                    ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8] shadow-md'
                    : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-transform ${
                    isVideoMode
                      ? 'bg-white/20 text-white'
                      : 'bg-[#FDF2F8] border border-pink-200 text-[#E6007A]'
                  }`}
                >
                  {isVideoMode ? (
                    <RotateCcw className="w-3.5 h-3.5" />
                  ) : (
                    <Play className="w-3 h-3 fill-[#E6007A] translate-x-0.5" />
                  )}
                </div>
                <span>{isVideoMode ? 'Back to App Mockup' : 'Watch Demo Video'}</span>
              </button>
            </div>

            {/* 4 Capture Type Pills */}
            <div className="pt-6 grid grid-cols-4 gap-2 sm:gap-4 max-w-md">
              <a href="#screens" className="flex flex-col items-center gap-1.5 text-center group cursor-pointer">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-sm group-hover:scale-105 transition-all">
                  <Camera className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Screenshots</span>
              </a>

              <a href="#screens" className="flex flex-col items-center gap-1.5 text-center group cursor-pointer">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB] shadow-sm group-hover:scale-105 transition-all">
                  <Link2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Links</span>
              </a>

              <a href="#screens" className="flex flex-col items-center gap-1.5 text-center group cursor-pointer">
                <div className="w-11 h-11 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center text-[#E6007A] shadow-sm group-hover:scale-105 transition-all">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Notes</span>
              </a>

              <a href="#screens" className="flex flex-col items-center gap-1.5 text-center group cursor-pointer">
                <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[#3B5BDB] shadow-sm group-hover:scale-105 transition-all">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-700">Calls</span>
              </a>
            </div>

          </div>

          {/* Right Column: Rotating Mobile Device */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-4 min-h-[440px] sm:min-h-[520px]">

            {/* Handwritten Note & Curved Arrow on the right */}
            <div className={`absolute -right-4 sm:-right-8 bottom-12 z-20 hidden sm:flex flex-col items-center pointer-events-none transition-opacity duration-300 ${isVideoMode ? 'opacity-0' : 'opacity-100'}`}>
              <span className="font-handwriting text-2xl font-bold text-[#1E3A8A] -rotate-6 transform">
                From chaos <br /> to clarity
              </span>
              <svg width="46" height="46" viewBox="0 0 50 50" fill="none" className="text-[#1E3A8A] mt-1 -rotate-12">
                <path
                  d="M38 6C34 22 18 36 10 38M10 38L18 32M10 38L16 44"
                  stroke="#1E3A8A"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* The Mobile Phone Frame — Fixed Size, Smooth Rotation */}
            <div
              className="relative w-[305px] sm:w-[325px] h-[580px] sm:h-[610px] rounded-[48px] p-3 bg-slate-900 shadow-phone border-[5px] border-slate-800 transition-transform duration-700 ease-in-out"
              style={{
                transform: isVideoMode ? 'rotate(-90deg) scale(0.98)' : 'rotate(0deg) scale(1)',
                transformOrigin: 'center center',
              }}
            >
              {/* Dynamic Island Notch */}
              <div className="w-24 h-5 bg-black rounded-full mx-auto mb-2 relative z-30 flex items-center justify-between px-3">
                <div className="w-2 h-2 rounded-full bg-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-950/80" />
              </div>

              {/* Inner Screen Container */}
              <div className="relative w-full h-[calc(100%-36px)] rounded-[38px] overflow-hidden bg-white border border-slate-200">
                
                {/* ════════════════════════════════════════════════════════ */}
                {/* LAYER 1: App Mockup (Visible in Portrait)                */}
                {/* ════════════════════════════════════════════════════════ */}
                <div
                  className={`w-full h-full flex flex-col justify-between text-left transition-opacity duration-300 ${
                    isVideoMode ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                >
                  {/* Status Bar */}
                  <div className="px-6 pt-1 pb-2 flex items-center justify-between text-[11px] font-bold text-slate-800">
                    <span>9:41</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px]">5G</span>
                      <div className="w-4 h-2 rounded-sm border border-slate-800 p-0.5">
                        <div className="w-full h-full bg-slate-800 rounded-2xs" />
                      </div>
                    </div>
                  </div>

                  {/* Phone App Header */}
                  <div className="px-5 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RecallLogo size={24} />
                      <span className="font-black text-slate-900 text-sm tracking-tight">Recall</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                        alt="User avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Phone Search Bar */}
                  <div className="px-4 py-2">
                    <div className="bg-slate-100/90 rounded-xl px-3 py-2 flex items-center gap-2 border border-slate-200/60">
                      <Search className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] text-slate-400 font-medium">
                        Ask your memory anything...
                      </span>
                    </div>
                  </div>

                  {/* Filter Chips */}
                  <div className="px-4 py-1.5 flex gap-1.5 overflow-x-auto text-[10px] font-bold">
                    <span className="px-3 py-1 rounded-full bg-slate-900 text-white">
                      All
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" /> Tasks
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                      <FileText className="w-2.5 h-2.5" /> Notes
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                      <Link2 className="w-2.5 h-2.5" /> Links
                    </span>
                  </div>

                  {/* Section Header */}
                  <div className="px-4 pt-3 pb-1.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-slate-900">Needs your attention</span>
                      <span className="w-4 h-4 rounded-full bg-[#E6007A] text-white text-[9px] font-black flex items-center justify-center">
                        3
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-[#2563EB]">View all</span>
                  </div>

                  {/* 3 Real In-App Action Cards */}
                  <div className="px-4 py-1 space-y-2 pb-3">
                    <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-sm space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                          ● Deadline
                        </span>
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        Submit DBMS assignment
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Tomorrow, 11:59 PM</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-sm space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#2563EB] border border-blue-100">
                          ● Follow-up
                        </span>
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        Ask Ravi about deployment
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>Today, 5:00 PM</span>
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200/80 rounded-xl p-2.5 shadow-sm space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                          ● Opportunity
                        </span>
                      </div>
                      <div className="text-xs font-black text-slate-900">
                        Walk-in Drive – TechCorp
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>Sep 22, 2026</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Navigation */}
                  <div className="bg-slate-50 border-t border-slate-100 px-5 py-2.5 flex items-center justify-between text-slate-400">
                    <div className="flex flex-col items-center gap-0.5 text-[#2563EB]">
                      <Home className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-bold">Home</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Search className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-medium">Search</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#2563EB] text-white flex items-center justify-center shadow-md">
                      <span className="text-base font-light leading-none">+</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <Inbox className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-medium">Inbox</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-medium">Library</span>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div className="w-24 h-1 bg-slate-300 rounded-full mx-auto my-1.5" />
                </div>

                {/* ════════════════════════════════════════════════════════ */}
                {/* LAYER 2: Uncropped Video in Rotated Phone                */}
                {/* ════════════════════════════════════════════════════════ */}
                <div
                  className={`absolute inset-0 w-full h-full bg-black transition-opacity duration-300 ${
                    isVideoMode ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                >
                  {/* Inside the phone rotated -90deg, this wrapper rotated +90deg stays 100% upright to the viewer */}
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[540px] sm:w-[570px] h-[280px] sm:h-[300px] flex flex-col justify-between"
                    style={{
                      transform: 'translate(-50%, -50%) rotate(90deg)',
                    }}
                  >
                    {/* The Full HD 16:9 Video — 100% visible, ZERO cropping */}
                    <video
                      ref={videoRef}
                      src="/demo-video.mp4"
                      playsInline
                      onEnded={handleVideoEnded}
                      className="w-full h-full object-contain bg-black"
                    />

                    {/* Full Screen button at bottom right, positioned comfortably above the bottom edge */}
                    <div className="absolute bottom-8 right-4 sm:bottom-9 sm:right-5 z-30 pointer-events-auto">
                      <button
                        onClick={handleFullscreen}
                        className="px-3.5 py-1.5 rounded-full bg-[#2563EB]/90 hover:bg-[#2563EB] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-blue-600/50 transition-all cursor-pointer active:scale-95 border border-white/30 backdrop-blur-sm"
                        title="Enter Full Screen"
                      >
                        <Maximize className="w-3.5 h-3.5" />
                        <span>Full Screen</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Home Indicator */}
              <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto my-1.5" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
