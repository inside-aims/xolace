'use client';

import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon: React.ElementType;
  color?: string;
  label?: string;
}

export default function IconButton({ active, icon: Icon, color,label, className = '', ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className={`p-3 rounded-xl transition-all ${
        active
          ? `bg-gradient-to-br ${color ?? 'from-blue-500 to-cyan-500'} text-white shadow-lg`
          : 'bg-white/10 text-gray-400 hover:bg-white/20'
      } ${className}`}
    >
      <Icon size={22} /> {label && <span className="text-lg">{label}</span>}
    </button>
  );
}
