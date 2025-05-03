// import SettingsWrapper from "@/components/settings/settings-wrapper";
// import {SettingsNavigationWrapper} from "@/components/settings/settings-navigation";
// import {ChevronRight,} from "lucide-react";
// import Link from "next/link";
//
// interface PreferencesProps {
//   key: string;
//   label: string;
//   href: string;
// }
//
// const preferencesOption: PreferencesProps[] = [
//   {
//     key: "pushNotifications",
//     label: "Push notifications",
//     href: '/settings/notifications/push-notifications'
//   },
//   {
//     key: "emailNotifications",
//     label: "Email notifications",
//     href: '/settings/notifications/email-notifications'
//   },
// ]
//
// export default function PreferencesPage() {
//   return(
//     <>
//       <div className="w-full flex items-start flex-col md:hidden">
//         <PreferencesContent/>
//       </div>
//       <div className="hidden md:flex items-center flex-col">
//         <SettingsWrapper>
//           <PreferencesContent/>
//         </SettingsWrapper>
//       </div>
//     </>
//   )
// }
//
// function PreferencesContent() {
//   return(
//     <SettingsNavigationWrapper title="Preferences">
//       <div className={"w-full flex flex-col items-start"}>
//         <p className={"w-full text-neutral-400 px-4 pb-4 text-sm"}>
//           Select your preferences notifications by type.
//           <span className={"cursor-pointer text-blue9 hover:underline"}>
//              Learn more
//           </span>
//         </p>
//         <div className={"w-full flex flex-col items-start gap-2"}>
//           {
//             preferencesOption.map((option) => (
//               <Link
//                 key={option.key}
//                 href={option.href}
//                 className={"w-full flex flex-col items-start cursor-pointer py-4  hover:bg-neutral-100 dark:hover:bg-neutral-900"}>
//                 <h4 className={"px-4 w-full flex items-center justify-between text-lg"}>
//                   {option.label}
//                   <span className={"justify-end ml-auto"}><ChevronRight/></span>
//                 </h4>
//               </Link>
//             ))
//           }
//         </div>
//       </div>
//     </SettingsNavigationWrapper>
//   )
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page