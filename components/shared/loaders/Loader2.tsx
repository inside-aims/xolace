import React from 'react'
import { Loader2 } from 'lucide-react'


interface Loader2Props {
  message?: string;
}

const Loader2Component = ({ message = 'Searching...' }: Loader2Props) => {
  return (
    <div className="flex items-center justify-center p-4 text-sm text-gray-500 gap-2">
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {message}
        </p>
    </div>
  )
}

export default Loader2Component