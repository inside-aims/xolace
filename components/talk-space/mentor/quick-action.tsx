'use client';

import {ActionButton, QuickLink} from "@/components/talk-space/mentor/action-links";

const QuickAction = () => {
  return (
    <aside className="w-full lg:w-80 bg-white/80 dark:bg-background shadow-lg p-4 lg:p-6 space-y-3 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
        Quick Actions
      </h3>
      <ActionButton/>
      <div
        className="mt-8 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl p-5 border border-purple-200">
        <h4 className="font-bold text-sm mb-3 text-purple-900">
          Quick Links
        </h4>
        <div className="space-y-2.5">
          <QuickLink emoji="🧠" text="Mental Health Resources"/>
          <QuickLink emoji="❤️" text="How to Talk Safely Online"/>
          <QuickLink emoji="📘" text="Community Guidelines"/>
        </div>
      </div>

      <div className="mt-4 bg-white dark:bg-dark-2 rounded-lg p-4 border">
        <p className="text-xs italic text-center">
          {"You're not alone. We're here to listen and support you."}
        </p>
      </div>
    </aside>
  )
}
export default QuickAction