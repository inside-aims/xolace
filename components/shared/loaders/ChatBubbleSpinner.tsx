// 13. Chat Bubbles Spinner
export const ChatBubblesSpinner = ({ size = 40, className = "" , dotClassName = "" }: { size?: number; className?: string; dotClassName?: string }) => (
    <div role="status" aria-label="Loading" className={`flex items-end space-x-1 ${className}`} style={{
        opacity: 0,
        animation: `fadeIn 0.2s ease-in forwards`
      }}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`bg-blue-500 rounded-full ${dotClassName}`}
          style={{
            width: size * 0.2,
            height: size * 0.2,
            animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite both`,
          }}
        />
      ))}
    </div>
  )