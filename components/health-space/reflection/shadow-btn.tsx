import React from "react";

export const ShadowBtn = (
  { value, icon, onClick, className}:
    { value: string | number; icon?: React.ReactNode; onClick?: () => void; className?: string }
) => {
  return(
    <button
      className={`flex items-center px-4 py-1 shadow-md rounded-2xl border border-neutral-200 gap-2 cursor-pointer hover:shadow-lg text-sm ${className}`}
      onClick={onClick}
    >
      <span>{icon && (icon)}</span> {value}
    </button>
  )
}