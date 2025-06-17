import React, { useState, useEffect } from 'react';
import { Gift, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LiquidGlassNewButtonProps {
  /** Text to display on the button */
  text?: string;
  /** Icon to display (defaults to Gift) */
  icon?: React.ReactNode;
  /** Notification count to display */
  notificationCount?: number;
  /** Maximum count to display before showing "+" */
  maxCount?: number;
  /** Whether to show the pulsing animation */
  animated?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning';
  /** Whether to show as a badge instead of button */
  asBadge?: boolean;
  /** Click handler */
  onClick?: () => void;
  /** Custom className */
  className?: string;
  /** Whether the component is disabled */
  disabled?: boolean;
  /** Custom notification dot color */
  notificationColor?: string;
}

const LiquidGlassButton: React.FC<LiquidGlassNewButtonProps> = ({
  text = "See What's New",
  icon,
  notificationCount = 0,
  maxCount = 99,
  animated = true,
  size = 'md',
  variant = 'primary',
  asBadge = false,
  onClick,
  className,
  disabled = false,
  notificationColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const displayIcon = icon || <Gift className="w-full h-full" />;
  const hasNotification = notificationCount > 0;
  const displayCount = notificationCount > maxCount ? `${maxCount}+` : notificationCount.toString();

  // Size configurations
  const sizeConfig = {
    sm: {
      container: asBadge ? 'w-8 h-8' : 'px-3 py-2 gap-2',
      icon: 'w-3 h-3',
      text: 'text-xs',
      notification: 'w-4 h-4 text-[10px] -top-1 -right-1',
    },
    md: {
      container: asBadge ? 'w-10 h-10' : 'px-4 py-3 gap-3',
      icon: 'w-4 h-4',
      text: 'text-sm',
      notification: 'w-5 h-5 text-xs -top-2 -right-2',
    },
    lg: {
      container: asBadge ? 'w-12 h-12' : 'px-6 py-4 gap-3',
      icon: 'w-5 h-5',
      text: 'text-base',
      notification: 'w-6 h-6 text-sm -top-2 -right-2',
    },
    xl: {
      container: asBadge ? 'w-16 h-16' : 'px-8 py-5 gap-4',
      icon: 'w-6 h-6',
      text: 'text-lg',
      notification: 'w-7 h-7 text-sm -top-3 -right-3',
    },
  };

  // Color configurations
  const variantConfig = {
    primary: {
      background: 'from-blue-500/20 via-cyan-500/15 to-purple-500/20',
      border: 'border-blue-400/30',
      glow: 'shadow-blue-500/25',
      hoverGlow: 'group-hover:shadow-blue-500/40',
      reflection: 'from-white/40 via-white/10 to-transparent',
    },
    secondary: {
      background: 'from-gray-500/20 via-slate-500/15 to-gray-600/20',
      border: 'border-gray-400/30',
      glow: 'shadow-gray-500/25',
      hoverGlow: 'group-hover:shadow-gray-500/40',
      reflection: 'from-white/40 via-white/10 to-transparent',
    },
    accent: {
      background: 'from-pink-500/20 via-rose-500/15 to-orange-500/20',
      border: 'border-pink-400/30',
      glow: 'shadow-pink-500/25',
      hoverGlow: 'group-hover:shadow-pink-500/40',
      reflection: 'from-white/40 via-white/10 to-transparent',
    },
    success: {
      background: 'from-green-500/20 via-emerald-500/15 to-teal-500/20',
      border: 'border-green-400/30',
      glow: 'shadow-green-500/25',
      hoverGlow: 'group-hover:shadow-green-500/40',
      reflection: 'from-white/40 via-white/10 to-transparent',
    },
    warning: {
      background: 'from-yellow-500/20 via-amber-500/15 to-orange-500/20',
      border: 'border-yellow-400/30',
      glow: 'shadow-yellow-500/25',
      hoverGlow: 'group-hover:shadow-yellow-500/40',
      reflection: 'from-white/40 via-white/10 to-transparent',
    },
  };

  const config = sizeConfig[size];
  const colors = variantConfig[variant];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };
    
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);

    onClick?.();
  };

  return (
    <button
      className={cn(
        'group relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent',
        asBadge ? `${config.container} flex items-center justify-center` : `${config.container} flex items-center justify-center`,
        `bg-gradient-to-br ${colors.background}`,
        colors.border,
        `shadow-md ${colors.glow} ${colors.hoverGlow}`,
        animated && 'hover:scale-105 hover:-translate-y-1',
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        'transform-gpu will-change-transform',
        className
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={disabled}
    >
      {/* Glass reflection overlay */}
      <div className={cn(
        'absolute inset-0 rounded-2xl bg-gradient-to-br transition-opacity duration-300',
        `${colors.reflection}`,
        isHovered ? 'opacity-60' : 'opacity-40'
      )} />

      {/* Animated shimmer effect */}
      {animated && (
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      )}

      {/* Ripple effects */}
      {ripples.map(ripple => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white/20 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: '600ms',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2 text-white/90 group-hover:text-white transition-colors duration-200">
        <div className={cn(config.icon, 'transition-transform duration-200 group-hover:scale-110')}>
          {displayIcon}
        </div>
        {!asBadge && (
          <span className={cn(config.text, 'font-medium whitespace-nowrap')}>
            {text}
          </span>
        )}
      </div>

      {/* Notification badge */}
      {hasNotification && (
        <div
          className={cn(
            'absolute rounded-full flex items-center justify-center font-bold text-white shadow-lg',
            'border-2 border-white/20 backdrop-blur-sm',
            config.notification,
            animated && 'animate-pulse',
            notificationColor ? '' : 'bg-gradient-to-r from-red-500 to-pink-500'
          )}
          style={notificationColor ? { backgroundColor: notificationColor } : {}}
        >
          {displayCount}
        </div>
      )}

      {/* Floating particles effect */}
      {animated && isHovered && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-bounce"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 15}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '2s',
              }}
            />
          ))}
        </>
      )}
    </button>
  );
};

export default LiquidGlassButton;