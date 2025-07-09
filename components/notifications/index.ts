export interface NotificationProps {
  notificationId: string;
  message: string;
  sender: string;
  createdAt: string;
  type: 'system' | 'post';
  typeId: string; //when type is a post, the typeId has to be post id
  status: "read" | "unread";
  important: boolean;
}
