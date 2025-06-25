import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'glass' | 'neon' | 'holographic' | 'minimalist' | 'neural' | 'quantum';
export type BadgeSize = 'sm' | 'md' | 'lg' | 'xl';
export type BadgeTheme = 'blue' | 'purple' | 'pink' | 'green' | 'cyan';

interface BetaBadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  theme?: BadgeTheme;
  className?: string;
  animated?: boolean;
  label?: string;
}

const BetaBadge: React.FC<BetaBadgeProps> = ({
  variant = 'glass',
  size = 'md',
  theme = 'blue',
  className,
  animated = true,
  label = 'BETA'
}) => {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
    xl: 'px-6 py-3 text-lg'
  };

  const themeColors = {
    blue: {
      neon: 'text-neon-blue border-neon-blue',
      glass: 'text-blue-400 border-blue-400/30',
      holographic: 'text-blue-300',
      minimalist: 'text-blue-600 bg-blue-50',
      neural: 'text-blue-400 border-blue-400',
      quantum: 'text-blue-300'
    },
    purple: {
      neon: 'text-neon-purple border-neon-purple',
      glass: 'text-purple-400 border-purple-400/30',
      holographic: 'text-purple-300',
      minimalist: 'text-purple-600 bg-purple-50',
      neural: 'text-purple-400 border-purple-400',
      quantum: 'text-purple-300'
    },
    pink: {
      neon: 'text-neon-pink border-neon-pink',
      glass: 'text-pink-400 border-pink-400/30',
      holographic: 'text-pink-300',
      minimalist: 'text-pink-600 bg-pink-50',
      neural: 'text-pink-400 border-pink-400',
      quantum: 'text-pink-300'
    },
    green: {
      neon: 'text-neon-green border-neon-green',
      glass: 'text-green-400 border-green-400/30',
      holographic: 'text-green-300',
      minimalist: 'text-green-600 bg-green-50',
      neural: 'text-green-400 border-green-400',
      quantum: 'text-green-300'
    },
    cyan: {
      neon: 'text-neon-cyan border-neon-cyan',
      glass: 'text-cyan-400 border-cyan-400/30',
      holographic: 'text-cyan-300',
      minimalist: 'text-cyan-600 bg-cyan-50',
      neural: 'text-cyan-400 border-cyan-400',
      quantum: 'text-cyan-300'
    }
  };

  const baseClasses = 'inline-flex items-center justify-center font-bold tracking-wider rounded-lg transition-all duration-300';

  const variantClasses = {
    glass: cn(
      'backdrop-blur-md bg-glass-gradient border border-white/20',
      'shadow-lg shadow-black/10',
      animated && 'hover:shadow-xl hover:scale-105',
      'relative overflow-hidden',
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent',
      animated && 'before:animate-glass-shimmer'
    ),
    neon: cn(
      'bg-black/80 border-2',
      animated && 'animate-neon-pulse hover:scale-105',
      'shadow-lg'
    ),
    holographic: cn(
      'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-cyan-500/20',
      'border border-white/30 backdrop-blur-sm',
      animated && 'animate-hologram hover:scale-105',
      'relative overflow-hidden',
      'before:absolute before:inset-0 before:bg-holographic before:opacity-20'
    ),
    minimalist: cn(
      'border border-current/20',
      animated && 'hover:scale-105 hover:shadow-md',
      'shadow-sm'
    ),
    neural: cn(
      'bg-gradient-to-r from-gray-900/90 to-black/90',
      'border border-current/50 backdrop-blur-sm',
      animated && 'hover:scale-105',
      'relative overflow-hidden',
      'before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-current/5 before:to-transparent',
      animated && 'before:animate-glass-shimmer'
    ),
    quantum: cn(
      'bg-gradient-to-r from-indigo-900/30 via-purple-900/30 to-pink-900/30',
      'border border-white/20 backdrop-blur-lg',
      animated && 'animate-float hover:scale-105',
      'shadow-2xl shadow-purple-500/20'
    )
  };

  return (
    <div
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        themeColors[theme][variant],
        className
      )}
    >
      <span className="relative z-10">{label}</span>
      
      {variant === 'neural' && (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1 left-1 w-1 h-1 bg-current rounded-full animate-pulse"></div>
          <div className="absolute top-1 right-1 w-1 h-1 bg-current rounded-full animate-pulse delay-100"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-current rounded-full animate-pulse delay-200"></div>
          <div className="absolute bottom-1 right-1 w-1 h-1 bg-current rounded-full animate-pulse delay-300"></div>
        </div>
      )}
      
      {variant === 'quantum' && (
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-1 border border-current/20 rounded"></div>
          <div className="absolute inset-2 border border-current/10 rounded"></div>
        </div>
      )}
    </div>
  );
};

export default BetaBadge;