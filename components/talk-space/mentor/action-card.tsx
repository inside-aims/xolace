'use client';

import React from 'react';

interface ActionCardProps {
  label: string;
}

export default function ActionCard({ label }: ActionCardProps) {
  return (
    <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
      {label}
    </button>
  );
}
