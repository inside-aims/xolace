import React from 'react'
import { Loader2 } from 'lucide-react'

const Loader2Component = () => {
  return (
    <div className="flex items-center justify-center p-4 text-sm text-gray-500">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
    </div>
  )
}

export default Loader2Component