'use client';

import {NotificationProps} from "@/components/notifications/index";
import {useRouter} from "next/navigation";

const NotificationPanelCard = (props: NotificationProps) => {
  const router = useRouter();

  const truncate = (text: string, max = 30) => {
    return text.length > max ? text.slice(0, max) + '...' : text;
  };

  const handleCardClick = (type: string, typeId: string) => {
    if( type && type !== "system" ) {
      router.push(`/post/${typeId}`);
    } else {
      router.push(`/notifications/${typeId}`);
    }
  }


  return (
    <div
      className={`w-full flex flex-col border shadow-lg ${props.status == "unread" ? "bg-neutral-100 dark:bg-dark-2" : "bg-white dark:bg-[#121212]"}`}>
      <div
        key={props.notificationId}
        className="w-full p-4 flex items-start justify-between cursor-pointer"
        onClick={() => handleCardClick(props.type, props.type !== "system" ? props.typeId : props.notificationId)}
      >
        <div className="w-full flex flex-row gap-4 items-start">
          <p
            className="h-10 w-10 flex-shrink-0 flex items-center justify-center font-semibold bg-lavender-500 border rounded-full">
          </p>
          <div
            className={`w-full flex flex-col hover:underline ${props.status === "read" ? 'text-neutral-400' : ''}`}>
              <span className="font-semibold">
                {props.sender}
              </span>
            <span className="text-sm">
                {truncate(props.message)}
              </span>
            <p className={"w-full text-xs flex items-end justify-end text-gray-400"}>
              {new Date(props.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationPanelCard;