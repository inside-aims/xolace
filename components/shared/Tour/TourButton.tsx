"use client"

import { Button } from "@/components/ui/button"
import { Binoculars , HelpCircle} from "lucide-react"
import { useTour } from "@reactour/tour"


export default function TourButton() {
    const { setIsOpen } = useTour()
  return (
    <> 
    <Button variant="outline" onClick={() => setIsOpen(true)} className=" block md:hidden fixed bottom-10 right-5 z-50 rounded-full">
      <Binoculars size={20} strokeWidth={2.25} color="#342adb" />
    </Button>

    <button
      onClick={() => setIsOpen(true)}
      className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2 px-4 rounded-full items-center shadow-lg transition-colors duration-200 hidden md:flex fixed bottom-10 right-20 z-50"
    >
      <HelpCircle className="mr-2" />
      Start Tour
    </button>
    </>
  )
}

