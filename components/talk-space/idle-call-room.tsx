'use client';

import {MessageSquareMore} from "lucide-react";
import {Button} from "@/components/ui/button";

const IdleCallRoom = ({onCall}: {onCall: (state: boolean) => void}) => {
  return (
    <div className="relative z-10 flex flex-col items-center text-center">
      <div className="bg-gradient-to-br from-purple-400 to-lavender-600 p-6 rounded-2xl shadow-lg mb-6">
        <MessageSquareMore
          className="w-8 h-8 lg:w-14 lg:h-14 text-white"
          strokeWidth={1.5}
        />
      </div>
      <h2
        className="text-2xl lg:text-3xl font-bold mb-3 bg-gradient-to-r from-purple-700 to-indigo-700 bg-clip-text text-transparent"> Start
        Your Journey </h2>
      <p className="text-gray-600 mb-6 max-w-md text-sm lg:text-base">
        Select a conversation or start a new one to connect with support
      </p>
      <Button className="rounded-full px-6 lg:px-8 py-5 lg:py-6 text-sm lg:text-base font-semibold bg-gradient-to-r from-purple-400 to-lavender-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        onClick={onCall}
      >
        Select a Conversation
      </Button>
    </div>
  )
}

export default IdleCallRoom;