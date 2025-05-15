import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PastPrompts } from "./PastPrompts";
import { ArrowRight, Check, Flame, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";
import { PromptResponse } from "./PromptResponse";
import { toast } from "sonner";

// Dummy data for the daily prompt
const CURRENT_PROMPT = {
  id: 1,
  text: "What's something you've always wanted to say but never did?",
  date: "May 13, 2025",
};

export const DailyPrompt = () => {
  const [expanded, setExpanded] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [streak, setStreak] = useState(3);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleRespond = () => {
    setShowResponseModal(true);
  };

  // Animation effect for the streak flame when user hovers
  const handleStreakHover = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 1000);
  };

  // Notification toggle handler with toast
  const handleNotificationToggle = (checked: boolean) => {
    setNotificationsEnabled(checked);
    if (checked) {
      toast.success("Daily prompt notifications enabled", {
        description: "You'll receive a notification each day with a new prompt.",
        position: "bottom-center",
      });
    } else {
      toast.info("Daily prompt notifications disabled", {
        position: "bottom-center",
      });
    }
  };

  // Subtle pulse animation
  useEffect(() => {
    const timer = setInterval(() => {
      const card = document.getElementById("prompt-card");
      if (card) {
        card.classList.add("pulse-animation");
        setTimeout(() => {
          card.classList.remove("pulse-animation");
        }, 1000);
      }
    }, 10000); // Pulse every 10 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <style>
        {`
        @keyframes pulse-glow {
          0% { box-shadow: 0 5px 15px rgba(124, 58, 237, 0.1); }
          50% { box-shadow: 0 5px 25px rgba(124, 58, 237, 0.2); }
          100% { box-shadow: 0 5px 15px rgba(124, 58, 237, 0.1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-15deg); }
          75% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
        .pulse-animation {
          animation: pulse-glow 2s ease-in-out;
        }
        .float-animation {
          animation: float 6s ease-in-out infinite;
        }
        .rotate-animation {
          animation: rotate 1s ease-in-out;
        }
        `}
      </style>

      <div
        id="prompt-card"
        className={`bg-white rounded-xl shadow-md transition-all overflow-hidden relative
          ${expanded
            ? "animate-expand-card"
            : "h-64 hover:shadow-lg"
          } float-animation`}
      >
        {/* Calendar icon with purple glow */}
        <div className="absolute top-4 left-4 bg-purple-50 rounded-full p-2">
          <CalendarDays className="h-5 w-5 text-purple-600" />
        </div>

        {/* Top corner streak indicator */}
        <div 
          className="absolute top-4 right-4 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1 rounded-full flex items-center text-orange-600 text-sm font-medium cursor-pointer transform hover:scale-105 transition-transform"
          onMouseEnter={handleStreakHover}
        >
          <Flame className={`mr-1 h-4 w-4 ${isRotating ? 'rotate-animation' : ''}`} />
          <span>Streak: {streak} days</span>
        </div>

        <div className="p-6 flex flex-col h-full">
          {/* Card header */}
          <div className="mb-4 mt-8">
            <span className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-600 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Prompt of the Day
            </span>
            <h3 className="text-sm text-gray-500 mt-1">{CURRENT_PROMPT.date}</h3>
          </div>

          {/* Prompt content with decorative element */}
          <div className="flex-grow">
            <div className="relative">
              <span className="absolute -left-2 top-0 text-4xl text-purple-200 font-serif">"</span>
              <h2 className="text-2xl font-bold text-gray-800 mb-4 pl-4">{CURRENT_PROMPT.text}</h2>
              <span className="absolute -bottom-4 right-0 text-4xl text-purple-200 font-serif">"</span>
            </div>
            
            {/* Call to action with gradient */}
            <Button 
              onClick={handleRespond}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-all hover:translate-y-[-2px] mt-6"
            >
              Respond <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Notification toggle with improved styling */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <div>
              <label
                htmlFor="notifications"
                className="text-sm font-medium text-gray-700 flex items-center"
              >
                Daily Prompt
              </label>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                A quiet nudge each day to help you express yourself.
              </p>
            </div>
            <Switch
              id="notifications"
              checked={notificationsEnabled}
              onCheckedChange={handleNotificationToggle}
              className="data-[state=checked]:bg-purple-600"
            />
          </div>

          {/* Expand/collapse button with animated chevron */}
          <button
            onClick={toggleExpanded}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-purple-600 hover:text-purple-800 transition-colors"
          >
            {expanded ? (
              <span className="flex items-center text-xs">
                Show less <ChevronUp className="ml-1 h-4 w-4 animate-bounce" />
              </span>
            ) : (
              <span className="flex items-center text-xs">
                See past prompts <ChevronDown className="ml-1 h-4 w-4 animate-bounce" />
              </span>
            )}
          </button>
        </div>

        {/* Past prompts section with improved animation */}
        <div className={`${expanded ? 'animate-fade-in' : 'hidden'}`}>
          <PastPrompts />
        </div>
      </div>

      {/* Response modal */}
      {showResponseModal && (
        <PromptResponse 
          prompt={CURRENT_PROMPT} 
          onClose={() => setShowResponseModal(false)} 
          onSubmit={() => {
            setShowResponseModal(false);
            setStreak(streak + 1);
            toast.success("Response submitted! 🎉", { 
              description: "Your streak is now " + (streak + 1) + " days!",
              position: "bottom-center"
            });
          }} 
        />
      )}
    </div>
  );
};
