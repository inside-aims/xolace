import { NotificationProps } from "@/components/notifications";

// Dummy listed notifications(It'd be replace with real notification)
//Note: when type is a post, the typeId has to be post id
export const notifications: NotificationProps[] = [
  {
    notificationId: "one",
    sender: "Khanllan Allan",
    message: "You have a new message regarding your appointment.",
    createdAt: "2025-07-09T23:22:00.000Z",
    status: "read",
    type: "post",
    typeId: "a1b2c3d4",
    important: true,
    author_avatar_url: ""
  },
  {
    notificationId: "two",
    sender: "Sarah Okello",
    message: "Reminder: Your health tips submission is due tomorrow.",
    createdAt: "2025-07-06T10:00:00.000Z",
    status: "unread",
    type: "system",
    typeId: "sys8743",
    important: false,
    author_avatar_url: ""
  },
  {
    notificationId: "three",
    sender: "Admin",
    message: "System maintenance scheduled for this weekend.",
    createdAt: "2025-06-29T14:45:00.000Z",
    status: "read",
    type: "system",
    typeId: "sys9921",
    important: true,
    author_avatar_url: ""
  },
  {
    notificationId: "four",
    sender: "Dr. Mercy",
    message: "New patient added to your watchlist.",
    createdAt: "2025-07-03T09:15:00.000Z",
    status: "unread",
    type: "post",
    typeId: "post3471",
    important: false,
    author_avatar_url: ""
  },
  {
    notificationId: "five",
    sender: "Support Team",
    message: "Your support ticket has been resolved.",
    createdAt: "2025-06-30T12:00:00.000Z",
    status: "read",
    type: "system",
    typeId: "sys5588",
    important: false,
    author_avatar_url: ""
  },
  {
    notificationId: "six",
    sender: "Admin",
    message: "Don't forget to update your profile information.",
    createdAt: "2025-07-01T11:20:00.000Z",
    status: "unread",
    type: "system",
    typeId: "sys2214",
    important: false,
    author_avatar_url: ""
  },
  {
    notificationId: "seven",
    sender: "Jane Doe",
    message: "Your session notes have been reviewed.",
    createdAt: "2025-07-02T15:00:00.000Z",
    status: "read",
    type: "post",
    typeId: "pst7892",
    important: false,
    author_avatar_url: ""
  },
  {
    notificationId: "eight",
    sender: "Khanllan Allan",
    message: "Your weekly report is now available.",
    createdAt: "2025-07-04T07:45:00.000Z",
    status: "unread",
    type: "post",
    typeId: "rep5589",
    important: true,
    author_avatar_url: ""
  },
  {
    notificationId: "nine",
    sender: "System",
    message: "Security alert: New login from unknown device.",
    createdAt: "2025-07-05T06:30:00.000Z",
    status: "unread",
    type: "system",
    typeId: "sys3012",
    important: true,
    author_avatar_url: ""
  },
  {
    notificationId: "ten",
    sender: "Helpdesk",
    message: "We’ve updated our privacy policy.",
    createdAt: "2025-07-06T13:10:00.000Z",
    status: "read",
    type: "system",
    typeId: "sys1903",
    important: false,
    author_avatar_url: ""
  },
];
