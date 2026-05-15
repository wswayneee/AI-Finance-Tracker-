import React from 'react';

export function WigladsLogo({ className = "h-12", showText = true }: { className?: string; showText?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg viewBox="0 0 100 100" className="h-full w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>
        </defs>
        {/* Main shape: stylized W + Hand/Wallet circle */}
        <path 
          d="M30 40 C 20 50, 20 80, 50 85 C 80 90, 85 60, 75 45 M30 40 L45 65 L60 40 L75 65" 
          stroke="url(#logoGradient)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        {/* Growth bars */}
        <rect x="55" y="25" width="6" height="15" rx="3" fill="#1e3a8a" />
        <rect x="65" y="15" width="6" height="25" rx="3" fill="#1e40af" />
        <rect x="75" y="20" width="6" height="20" rx="3" fill="#172554" />


        {/* Circle accent */}
        <circle cx="50" cy="50" r="45" stroke="url(#logoGradient)" strokeWidth="2" strokeDasharray="10 5" opacity="0.2" />
      </svg>
      {showText && (
        <div className="flex flex-col text-left">
          <span className="text-2xl font-black tracking-tighter text-foreground leading-none">Wiglads</span>
          <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-primary">Smart Money Tracker</span>
        </div>
      )}
    </div>
  );
}
