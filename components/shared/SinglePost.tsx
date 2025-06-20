interface SinglePostProps {
    content: string
    onClick?: () => void
  }
  
  export function SinglePost({ content, onClick }: SinglePostProps) {
    return (
      <div className="relative" onClick={onClick}>
        <div className="bg-transparent  rounded-2xl py-2 ">
          <p className="dark:text-white leading-relaxed text-content-label whitespace-pre-wrap">{content}</p>
        </div>
  
        {/* Decorative elements */}
        {/* <div className="absolute -top-2 -left-2 w-3 h-3 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-60"></div>
        <div className="absolute -bottom-2 -right-1 w-3 h-3 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full opacity-60"></div> */}
      </div>
    )
  }
  