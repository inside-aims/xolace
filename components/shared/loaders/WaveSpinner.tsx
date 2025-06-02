// 5. Wave Spinner - Bouncing dots
export const WaveSpinner = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
    <div role="status" aria-label="Loading" className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-blue-600 rounded-full animate-bounce"
          style={{
            width: size * 0.2,
            height: size * 0.2,
            animationDelay: `${i * 0.3}s`,
            animationDuration: "0.6s",
          }}
        />
      ))}
    </div>
  )