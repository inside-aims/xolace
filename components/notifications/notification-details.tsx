"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft, Flame, MailOpen, Mail } from "lucide-react";
import {NotificationProps} from "@/components/notifications/index";

// dummy data
const mockNotification: NotificationProps = {
  notificationId: "abc123",
  message: "Critical system alert: CPU usage exceeded 90%. Attention! Attention!! Attention!!",
  sender: "System Monitor",
  createdAt: "2025-07-08T10:30:00Z",
  type: 'system',
  typeId: 'abc123',
  status: "unread",
  important: true,
  author_avatar_url: ""
};

const NotificationDetails = ({ notificationId }: {notificationId: string}) => {
  const notification = mockNotification;

  const isUnread = notification.status === "unread";
  const isImportant = notification.important;

  return (
    <main
      id="notification-details"
      className="flex w-full flex-col px-4 items-start gap-8"
    >
      <header className="w-full">
        <Link href={"/notifications"}>
          <Button variant="outline" size="sm" className="rounded-full">
            <MoveLeft className="mr-2 h-4 w-4" />
            Back to Notifications
          </Button>
        </Link>
      </header>

      <section
        className={`relative w-full max-w-2xl bg-card border rounded-2xl p-4 shadow-lg overflow-hidden transition-all`}
      >
        {isImportant && (
          <div className="absolute inset-0 -z-10 blur-2xl opacity-30 bg-red-500 animate-pulse rounded-2xl pointer-events-none" />
        )}

        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            From: <strong>{notification.sender}</strong>
          </span>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1 ${
              isUnread
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {isUnread ? <Mail className="h-3 w-3" /> : <MailOpen className="h-3 w-3" />}
            {notification.status.toUpperCase()}
          </span>
        </div>

        <h2 className="text-2xl font-semibold mb-2 leading-tight">
          {notification.message}
        </h2>

        {isImportant && (
          <div className="flex items-center gap-2 text-red-600 font-semibold mb-2">
            <Flame className="h-5 w-5" />
            <span>Marked as Important</span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-4">
          Sent on:{" "}
          {new Date(notification.createdAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </section>
    </main>
  );
};

export default NotificationDetails;
