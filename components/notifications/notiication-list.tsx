"use client";

import React, { useState } from "react";
import {
  parseISO,
  isToday,
  isYesterday,
  isThisWeek,
  isSameWeek,
  subWeeks,
  isThisMonth,
  isSameMonth,
} from "date-fns";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";

import { NotificationProps } from "@/components/notifications/index";
import ListHeader from "@/components/notifications/list-header";
import NotificationCard from "@/components/notifications/notification-card";
import {ChevronDown} from "lucide-react";

// Filter options
const filterOptions: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "important", label: "Important" },
  { key: "unread", label: "Unread" },
  { key: "markAllAsRead", label: "Mark all as read" },
  { key: "clearAll", label: "Clear All" },
];

// Filter time options
const timeOptions: { key: string; label: string }[] = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "thisWeek", label: "This Week" },
  { key: "lastWeek", label: "Last Week" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
];

const isLastWeek = (date: Date) => {
  const lastWeekStart = subWeeks(new Date(), 1);
  return isSameWeek(date, lastWeekStart, { weekStartsOn: 1 });
};

const isLastMonth = (date: Date) => {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  return isSameMonth(date, lastMonth);
};


const NotificationList = ({ notifications }: { notifications: NotificationProps[] }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("today");

  const onFilterChange = (filter: string) => setSelectedFilter(filter);
  const onTimeRangeChange = (range: string) => setSelectedTimeRange(range);

  const applyFilter = (n: NotificationProps) => {
    if (selectedFilter === "important") return n.important;
    if (selectedFilter === "unread") return n.status === "unread";
    return true;
  };

  const filterByTime = (n: NotificationProps): boolean => {
    const date = parseISO(n.createdAt);
    switch (selectedTimeRange) {
      case "today":
        return isToday(date);
      case "yesterday":
        return isYesterday(date);
      case "thisWeek":
        return (
          isThisWeek(date, { weekStartsOn: 1 }) &&
          !isToday(date) &&
          !isYesterday(date)
        );
      case "lastWeek":
        return isLastWeek(date);
      case "thisMonth":
        return (
          isThisMonth(date) &&
          !isThisWeek(date, { weekStartsOn: 1 })
        );
      case "lastMonth":
        return isLastMonth(date);
      default:
        return true;
    }
  };

  const filteredNotifications = notifications.filter(
    (n) => applyFilter(n) && filterByTime(n)
  );

  return (
    <div className="flex flex-col gap-8">
      <section className="sticky top-3 z-20 bg-white dark:bg-[#121212]">
        <ListHeader
          onFilterChange={onFilterChange}
          filterOptions={filterOptions}
          selectedFilter={selectedFilter}
        />
      </section>

      {/* Notification Section */}
      <section className="w-full mt-4">
        {/* Time Range Selector */}
        <section className="w-full bg-white dark:bg-[#121212] flex gap-2 overflow-x-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center justify-between py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-sm capitalize">
                {timeOptions.find((opt) => opt.key === selectedTimeRange)?.label}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="flex flex-col w-full">
              {timeOptions.map((opt) => (
                <DropdownMenuItem
                  key={opt.key}
                  onClick={() => onTimeRangeChange(opt.key)}
                  className={`w-full px-3 py-2 text-sm flex items-center justify-start capitalize ${selectedTimeRange === opt.key && ("bg-lavender-500")}`}
                >
                  {opt.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </section>
        <div className="overflow-y-auto bg-neutral-100 dark:bg-dark-1 rounded-lg mt-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n) => (
              <NotificationCard key={n.notificationId} {...n} />
            ))
          ) : (
            <div className="text-center text-sm text-gray-500 p-4">
              No notifications
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default NotificationList;
