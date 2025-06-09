export const DefaultLoader = ({ size = 40, className = "" }: { size?: number; className?: string }) => (
    <div className={`inline-block ${className}`} style={{ width: size, height: size }}>
      <div
        className="animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
        style={{ width: size, height: size }}
      />
    </div>
  )