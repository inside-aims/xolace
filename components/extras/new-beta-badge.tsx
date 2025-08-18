import React, { useState, ReactNode, HTMLAttributes } from 'react';

// Type definitions
type BadgeVariant = 'default' | 'glass' | 'neon' | 'outline' | 'gradient' | 'soft' | 'floating' | 'dot' | 'cyber' | 'neuro';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type BadgeColor = 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'pink' | 'gray';

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  color?: BadgeColor;
  glow?: boolean;
  pulse?: boolean;
  icon?: ReactNode;
  className?: string;
}

export const KvngBadge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  color = 'blue',
  glow = false,
  pulse = false,
  icon,
  className = '',
  ...props 
}) => {
  // Base styles that apply to all badges
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out select-none";
  
  // Size variants
  const sizeStyles: Record<BadgeSize, string> = {
    xs: "px-2 py-0.5 text-xs gap-1",
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5",
    xl: "px-5 py-2.5 text-lg gap-3"
  };
  
  // Color variants for different styles
  const colorMap: Record<BadgeColor, { primary: string; secondary: string; light: string }> = {
    blue: { primary: '#3b82f6', secondary: '#1e40af', light: '#dbeafe' },
    green: { primary: '#10b981', secondary: '#047857', light: '#d1fae5' },
    purple: { primary: '#8b5cf6', secondary: '#7c3aed', light: '#e9d5ff' },
    red: { primary: '#ef4444', secondary: '#dc2626', light: '#fee2e2' },
    orange: { primary: '#f97316', secondary: '#ea580c', light: '#fed7aa' },
    pink: { primary: '#ec4899', secondary: '#db2777', light: '#fce7f3' },
    gray: { primary: '#6b7280', secondary: '#4b5563', light: '#f3f4f6' }
  };
  
  const colors = colorMap[color];
  
  // Variant styles
  const variantStyles: Record<BadgeVariant, string> = {
    // Standard solid badge
    default: `bg-${color}-500 text-white rounded-full hover:bg-${color}-600 shadow-sm`,
    
    // Glass morphism effect
    glass: `backdrop-blur-md bg-white/20 border border-white/30 rounded-xl text-gray-800 shadow-lg hover:bg-white/30`,
    
    // Neon glow effect
    neon: `bg-gray-900 border-2 rounded-lg text-${color}-400 shadow-2xl hover:shadow-${color}-500/50`,
    
    // Subtle outline
    outline: `border-2 border-${color}-500 text-${color}-600 rounded-full bg-transparent hover:bg-${color}-50`,
    
    // Modern gradient
    gradient: `bg-gradient-to-r rounded-xl text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`,
    
    // Soft material design
    soft: `bg-${color}-100 text-${color}-800 rounded-lg hover:bg-${color}-200 border border-${color}-200`,
    
    // Floating card style
    floating: `bg-white rounded-2xl shadow-xl border border-gray-100 text-gray-700 hover:shadow-2xl transform hover:-translate-y-1`,
    
    // Minimal dot style
    dot: `bg-${color}-500 text-white rounded-full shadow-sm hover:shadow-md transform hover:scale-105`,
    
    // Cyberpunk inspired
    cyber: `bg-black border border-${color}-400 rounded text-${color}-400 font-mono uppercase tracking-wider shadow-lg`,
    
    // Neumorphism style
    neuro: `bg-gray-200 text-gray-700 rounded-2xl shadow-inner hover:shadow-lg border border-gray-300`
  };
  
  // Dynamic gradient colors based on color prop
  const gradientMap: Record<BadgeColor, string> = {
    blue: 'from-blue-500 to-purple-600',
    green: 'from-green-500 to-teal-600',
    purple: 'from-purple-500 to-pink-600',
    red: 'from-red-500 to-orange-600',
    orange: 'from-orange-500 to-yellow-600',
    pink: 'from-pink-500 to-rose-600',
    gray: 'from-gray-500 to-slate-600'
  };
  
  // Compile final classes
  let finalClasses = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`;
  
  // Add gradient for gradient variant
  if (variant === 'gradient') {
    finalClasses = finalClasses.replace('bg-gradient-to-r', `bg-gradient-to-r ${gradientMap[color]}`);
  }
  
  // Add glow effect if requested
  if (glow) {
    finalClasses += ` shadow-lg shadow-${color}-500/50`;
  }
  
  // Add pulse animation if requested
  if (pulse) {
    finalClasses += " animate-pulse";
  }
  
  // Special styling for neon variant
  const neonStyle = variant === 'neon' ? {
    boxShadow: `0 0 20px ${colors.primary}40, inset 0 0 20px ${colors.primary}20`,
    textShadow: `0 0 10px ${colors.primary}`
  } : {};
  
  // Glass variant special styling
  const glassStyle = variant === 'glass' ? {
    backdropFilter: 'blur(10px)',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
    borderColor: 'rgba(255,255,255,0.2)'
  } : {};
  
  return (
    <span 
      className={finalClasses}
      style={{...neonStyle, ...glassStyle}}
      {...props}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
};