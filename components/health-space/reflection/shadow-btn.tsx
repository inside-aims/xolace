import React from "react";

export const ShadowBtn = (
  { value, icon, onClick, className, disabled = false }:
    { value: string | number; icon?: React.ReactNode; onClick?: () => void; className?: string, disabled?: boolean }
) => {
  return(
    <button
      className={`flex items-center px-4 py-1 shadow-md rounded-2xl border border-neutral-200 text-gray-600 dark:text-white gap-2 cursor-pointer hover:shadow-lg text-sm transition-colors ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span>{icon && (icon)}</span> {value}
    </button>
  )
}