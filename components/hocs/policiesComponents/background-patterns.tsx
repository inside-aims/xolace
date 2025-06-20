"use client"

export function BackgroundPattern() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.15)_1px,transparent_0)] bg-[length:24px_24px] dark:bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)]" />

      {/* Gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-blue-400/10 to-purple-400/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400/10 to-pink-400/10 blur-3xl animate-pulse delay-1000" />
    </div>
  )
}