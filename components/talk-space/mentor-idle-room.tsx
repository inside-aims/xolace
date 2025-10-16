'use client';
import { useState } from "react";
import { MentorIdleSidebar } from "@/components/talk-space/mentor/idle-layout";
import HomeContent from "@/components/talk-space/mentor/home-content";
import MentorUpcomingPage from "@/components/talk-space/mentor/upcoming-page";
import MentorPreviousPage from "@/components/talk-space/mentor/previous-page";
import MentorRecordingsPage from "@/components/talk-space/mentor/recordings-page";
import MentorPersonalRoomPage from "@/components/talk-space/mentor/personal-room-page";
import MentorIncomingRequestsPage from "@/components/talk-space/mentor/requests-page";

const MentorIdleRoom = () => {
  const [activeRoute, setActiveRoute] = useState('home');

  const handleNavigation = (route: string) => {
    setActiveRoute(route);
  };

  console.log("Route key", activeRoute);

  const renderContent = () => {
    switch (activeRoute) {
      case 'home':
        return <HomeContent onNavigate={handleNavigation} />;
      case "requests":
        return <MentorIncomingRequestsPage />
      case 'upcoming':
        return <MentorUpcomingPage />
      case 'previous':
        return <MentorPreviousPage />
      case 'recordings':
        return <MentorRecordingsPage />
      case 'personalRoom':
        return <MentorPersonalRoomPage />
      default:
        return <HomeContent onNavigate={handleNavigation} />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <MentorIdleSidebar
        activeRoute={activeRoute}
        onNavigate={handleNavigation}
      />
      <main className="flex-1 overflow-auto pt-[57px] lg:pt-0 pb-20 lg:pb-0">
        <div className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}

export default MentorIdleRoom