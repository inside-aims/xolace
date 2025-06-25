import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

// const [copied, setCopied] = useState(false)

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(children)
//     setCopied(true)
//     setTimeout(() => setCopied(false), 500)
//   }

export type MessageActionProps = {
    className?: string
    tooltip: React.ReactNode
    children: React.ReactNode
    side?: "top" | "bottom" | "left" | "right"
  } & React.ComponentProps<typeof Tooltip>
  
  export const MessageAction = ({
    tooltip,
    children,
    className,
    side = "top",
    ...props
  }: MessageActionProps) => {
    return (
      <Tooltip {...props}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} className={className}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    )
  }