import React from 'react';

interface NewBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'gradient' | 'glow' | 'minimal';
  className?: string;
  containerClass?: string;
  text?: string;
}

export const NewBadge: React.FC<NewBadgeProps> = ({ 
  size = 'md', 
  variant = 'gradient',
  className = '' ,
  containerClass = '',
  text = 'New'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-[10px]',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-bold tracking-wide uppercase
    rounded-full
    transition-all duration-300
    select-none
    ${sizeClasses[size]}
    ${className}
  `;

  if (variant === 'glow') {
    return (
      <div className={`${baseClasses} relative overflow-hidden`}>
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0536FF] via-[#524EDD] to-[#0536FF] animate-pulse rounded-full"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0536FF]/20 via-[#524EDD]/20 to-[#0536FF]/20 animate-ping rounded-full"></div>
        
        {/* Main badge */}
        <div className="relative z-10 bg-gradient-to-r from-[#0536FF] to-[#524EDD] text-white rounded-full px-full py-full w-full h-full flex items-center justify-center">
          <span className="drop-shadow-sm">{text}</span>
        </div>
        
        {/* Subtle inner glow */}
        <div className="absolute inset-1 bg-gradient-to-r from-white/10 to-transparent rounded-full pointer-events-none"></div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={`
        ${baseClasses}
        bg-gradient-to-r from-[#0536FF]/10 to-[#524EDD]/10
        text-[#0536FF] border border-[#0536FF]/20
        hover:from-[#0536FF]/20 hover:to-[#524EDD]/20
        hover:border-[#0536FF]/40
        backdrop-blur-sm
      `}>
        <span>{text}</span>
      </div>
    );
  }

  // Default gradient variant
  return (
    <div className={`${containerClass}`}>
        <div className={` relative ${baseClasses} overflow-hidden group`}>
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0536FF] via-[#524EDD] to-[#6366F1] rounded-full"></div>
      
      {/* Subtle teal accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#14B8A6]/20 rounded-full"></div>
      
      {/* Content */}
      <span className="relative z-10 text-white drop-shadow-sm">{text}</span>
      
      {/* Inner highlight */}
      <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-full pointer-events-none"></div>
    </div>
    </div>
  );
};

// Pulse variant for extra attention
export const PulsingNewBadge: React.FC<NewBadgeProps> = (props) => {
  return (
    <div className="relative">
      {/* Pulsing rings */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-full h-full bg-[#0536FF]/30 rounded-full"></div>
      </div>
      <div className="absolute inset-0 animate-pulse animation-delay-150">
        <div className="w-full h-full bg-[#524EDD]/20 rounded-full scale-110"></div>
      </div>
      
      {/* Main badge */}
      <NewBadge {...props} variant="glow" />
    </div>
  );
};