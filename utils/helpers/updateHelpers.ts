import { RefreshCw, Rocket, Sparkles, Zap } from "lucide-react"

export const getVersionIcon = (type: string) => {
    switch (type) {
      case "major":
        return Rocket 
      case "minor":
        return Sparkles 
      case "patch":
        return Zap 
      default:
        return RefreshCw 
    }
}

export const getVersionColor = (type: string) => {
    switch (type) {
      case "major":
        return "bg-gradient-to-r from-purple-500 to-pink-500"
      case "minor":
        return "bg-gradient-to-r from-blue-500 to-cyan-500"
      case "patch":
        return "bg-gradient-to-r from-green-500 to-emerald-500"
      default:
        return "bg-gradient-to-r from-gray-500 to-slate-500"
    }
}



