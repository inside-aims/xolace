'use client';

import React from 'react';

export default function ChatPanel() {
  return (
    <div>
      <h3 className="font-semibold mb-3">Chat</h3>
      <div className="space-y-2">
        <div className="bg-white/10 rounded-lg p-2">Hello there 👋</div>
        <div className="bg-blue-600 text-white rounded-lg p-2 ml-auto w-fit">Hi, how are you?</div>
      </div>
    </div>
  );
}
