import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, Activity, Heart, Stethoscope, Sparkles, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function LiveTriageDispatchMonitor() {
  const [pulseTime, setPulseTime] = useState(0);
  const [timerCount, setTimerCount] = useState(260); // 4 min 20 sec

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTime((prev) => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerCount((prev) => (prev > 0 ? prev - 1 : 260));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m} min ${s < 10 ? "0" : ""}${s} sec`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-neutral-950 text-white shadow-2xl backdrop-blur-md"
    >
      {/* Header bar matching screenshot */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-900/80 px-6 py-4">
        <div className="flex items-center gap-3">
          <Badge className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1 text-sm font-black tracking-wider gap-1.5 shadow-lg shadow-red-600/30">
            <AlertCircle className="size-4 animate-bounce" /> Red Priority Triage
          </Badge>
          <div className="flex items-center gap-2 rounded-xl bg-neutral-800/80 px-3 py-1 text-sm font-semibold text-neutral-300">
            <span>Male</span>
            <span className="text-neutral-500">|</span>
            <span>62 yr</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-xl bg-neutral-800/90 px-4 py-1.5 border border-neutral-700/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">ETA</span>
            <span className="font-display text-2xl font-black text-white">12</span>
            <span className="text-xs font-semibold text-neutral-400">min</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-neutral-800/90 px-4 py-1.5 border border-neutral-700/50">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">GCS</span>
            <span className="font-display text-2xl font-black text-white">3</span>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid Grid */}
      <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-12">
        {/* LEFT COLUMN: Body Injury Silhouette */}
        <div className="lg:col-span-3 flex flex-col justify-between rounded-2xl bg-neutral-900/50 border border-neutral-800 p-5">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Anatomy Mapping</span>
              <span className="size-2.5 rounded-full bg-red-500 animate-ping" />
            </div>

            {/* SVG Anatomy graphic with glowing hotspots */}
            <div className="relative my-2 flex justify-center py-2">
              <svg viewBox="0 0 200 240" className="h-56 w-auto drop-shadow-md">
                {/* Silhouette Front */}
                <g opacity="0.3" fill="none" stroke="#6b7280" strokeWidth="2.5">
                  {/* Head */}
                  <circle cx="60" cy="25" r="14" />
                  {/* Neck */}
                  <line x1="60" y1="39" x2="60" y2="46" />
                  {/* Torso */}
                  <path d="M 40 50 L 80 50 L 76 120 L 44 120 Z" />
                  {/* Arms */}
                  <path d="M 38 52 L 20 110 M 82 52 L 100 110" />
                  {/* Legs */}
                  <path d="M 48 120 L 44 210 M 72 120 L 76 210" />
                </g>

                {/* Silhouette Back */}
                <g opacity="0.3" fill="none" stroke="#6b7280" strokeWidth="2.5">
                  <circle cx="140" cy="25" r="14" />
                  <line x1="140" y1="39" x2="140" y2="46" />
                  <path d="M 120 50 L 160 50 L 156 120 L 124 120 Z" />
                  <path d="M 118 52 L 100 110 M 162 52 L 180 110" />
                  <path d="M 128 120 L 124 210 M 152 120 L 156 210" />
                </g>

                {/* Chest Injury Hotspot */}
                <circle cx="68" cy="70" r="10" fill="url(#redGlow)" className="animate-pulse" />
                <circle cx="68" cy="70" r="4" fill="#ef4444" />

                {/* Pelvic Injury Hotspot */}
                <circle cx="140" cy="115" r="12" fill="url(#redGlow)" className="animate-pulse" />
                <circle cx="140" cy="115" r="5" fill="#ef4444" />

                <defs>
                  <radialGradient id="redGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <div className="text-center">
              <p className="font-display text-sm font-bold text-white">Blunt injury</p>
              <p className="text-xs text-neutral-400">RTC - Motor vehicle</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-neutral-800/80 p-2.5 text-center border border-neutral-700/60">
              <p className="text-xs font-bold text-neutral-200">Chest</p>
              <p className="text-[11px] text-neutral-400 truncate">Haemothorax R</p>
            </div>
            <div className="rounded-xl bg-neutral-800/80 p-2.5 text-center border border-neutral-700/60">
              <p className="text-xs font-bold text-neutral-200">Pelvic</p>
              <p className="text-[11px] text-neutral-400 truncate">Fracture</p>
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN: Timed Dispatch Log */}
        <div className="lg:col-span-4 flex flex-col justify-between rounded-2xl bg-neutral-900/50 border border-neutral-800 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Dispatch Sequence</span>
            <span className="text-xs font-mono text-neutral-500">REALTIME SYNC</span>
          </div>

          <div className="space-y-3.5">
            {/* 16:02 */}
            <div className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-neutral-400">16:02</span>
              <div className="flex flex-1 items-center justify-between rounded-xl bg-neutral-800/60 px-3 py-2 border border-neutral-700/40">
                <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                  <Heart className="size-3.5 text-blue-400" /> Time of Call
                </span>
              </div>
            </div>

            {/* 16:10 */}
            <div className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-neutral-400">16:10</span>
              <div className="flex flex-1 items-center justify-between rounded-xl bg-neutral-800/60 px-3 py-2 border border-neutral-700/40">
                <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                  <Activity className="size-3.5 text-emerald-400" /> Arrive the scene
                </span>
              </div>
            </div>

            {/* 16:15 */}
            <div className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-neutral-400">16:15</span>
              <div className="flex flex-1 items-center justify-between rounded-xl bg-neutral-800/60 px-3 py-2 border border-neutral-700/40">
                <span className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                  <Stethoscope className="size-3.5 text-amber-400" /> Apply ADE
                </span>
              </div>
            </div>

            {/* 16:25 Active timer box REBOA */}
            <div className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-neutral-400">16:25</span>
              <div className="flex flex-1 items-center justify-between rounded-xl bg-red-600/90 px-3 py-2 text-white shadow-md shadow-red-600/20">
                <span className="flex items-center gap-2 text-xs font-bold">
                  💣 REBOA
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-black/30 px-2 py-0.5 text-[11px] font-mono font-bold">
                  ⏱️ {formatTimer(timerCount)}
                </span>
              </div>
            </div>

            {/* Current scan bar 16:30 */}
            <div className="relative py-1">
              <div className="flex items-center gap-3">
                <span className="w-10 font-mono text-xs font-bold text-white">16:30</span>
                <div className="h-0.5 flex-1 bg-neutral-600 relative">
                  <span className="absolute -top-1.5 left-0 size-3 rounded-full bg-white animate-ping" />
                </div>
              </div>
              <div className="mt-2 h-8 w-full rounded-xl bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 opacity-60 border border-neutral-700/50" />
            </div>

            {/* 16:35 Warning box */}
            <div className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs text-neutral-400">16:35</span>
              <div className="flex flex-1 items-center justify-between rounded-xl bg-neutral-800/90 px-3 py-2 border border-amber-500/40">
                <span className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                  <AlertCircle className="size-3.5 text-amber-400" /> Potential Heart Failure
                </span>
                <span className="text-[11px] font-bold text-amber-400">25% Risk</span>
              </div>
            </div>

            {/* 16:42 ETA */}
            <div className="flex items-center gap-3">
              <span className="w-10 font-mono text-xs font-bold text-white">16:42</span>
              <span className="rounded-lg bg-neutral-800 px-2.5 py-1 text-xs font-mono font-bold text-neutral-300">
                ETA
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Vitals wave graphics & AI diagnostics */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          {/* Wave Graphs Card */}
          <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-4">
            {/* ECG wave top */}
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-emerald-400">1.0 cm/mV</span>
              <span className="text-[11px] font-mono text-neutral-500">ECG Lead II</span>
            </div>
            <div className="relative h-16 w-full overflow-hidden rounded-lg bg-neutral-950/80 border border-neutral-800">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 500 80">
                <path
                  d={`M 0 40 Q 30 40 40 20 T 50 60 T 60 10 T 70 65 T 80 40 H 160 Q 190 40 200 20 T 210 60 T 220 10 T 230 65 T 240 40 H 320 Q 350 40 360 20 T 370 60 T 380 10 T 390 65 T 400 40 H 500`}
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeDasharray="600"
                  strokeDashoffset={-pulseTime * 6}
                />
              </svg>
            </div>

            {/* SpO2 wave bottom */}
            <div className="my-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-amber-400">SpO2 1x</span>
            </div>
            <div className="relative h-12 w-full overflow-hidden rounded-lg bg-neutral-950/80 border border-neutral-800">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 500 60">
                <path
                  d="M 0 30 Q 25 10 50 30 T 100 30 T 150 10 T 200 30 T 250 30 T 300 10 T 350 30 T 400 30 T 450 10 T 500 30"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="500"
                  strokeDashoffset={-pulseTime * 5}
                />
              </svg>
            </div>

            {/* Dynamic Digital Vitals Grid */}
            <div className="mt-4 grid grid-cols-5 gap-1.5 text-center">
              <div className="rounded-xl bg-neutral-800/60 p-2 border border-neutral-700/40">
                <span className="block text-[10px] font-mono text-emerald-400">HR bpm</span>
                <span className="font-display text-lg font-black text-white">90</span>
              </div>
              <div className="rounded-xl bg-neutral-800/60 p-2 border border-neutral-700/40">
                <span className="block text-[10px] font-mono text-blue-400">BP mmHg</span>
                <span className="font-display text-sm font-black text-white leading-tight">120<br />/75</span>
              </div>
              <div className="rounded-xl bg-neutral-800/60 p-2 border border-neutral-700/40">
                <span className="block text-[10px] font-mono text-purple-400">Resp /min</span>
                <span className="font-display text-lg font-black text-white">10</span>
              </div>
              <div className="rounded-xl bg-neutral-800/60 p-2 border border-neutral-700/40">
                <span className="block text-[10px] font-mono text-amber-400">etCO2</span>
                <span className="font-display text-lg font-black text-white">20</span>
              </div>
              <div className="rounded-xl bg-neutral-800/60 p-2 border border-neutral-700/40">
                <span className="block text-[10px] font-mono text-orange-400">SpO2 %</span>
                <span className="font-display text-lg font-black text-white">98</span>
              </div>
            </div>
          </div>

          {/* Paramedic Note */}
          <div className="rounded-2xl bg-neutral-900/50 border border-neutral-800 p-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 mb-1">
              <FileText className="size-3.5 text-neutral-400" /> Parametrix Note:
            </span>
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              "Suddenly passed out once we arrived at the scene."
            </p>
          </div>

          {/* AI Diagnostic Alert */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-950/40 to-neutral-900 border border-blue-500/40 p-4">
            <span className="flex items-center gap-1.5 text-xs font-extrabold text-blue-400 mb-1">
              <Sparkles className="size-3.5 text-blue-400" /> AI Diagnostic Assistant
            </span>
            <p className="text-xs font-bold text-white">
              Potential Heart Failure <span className="text-amber-400 font-mono">25%</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
