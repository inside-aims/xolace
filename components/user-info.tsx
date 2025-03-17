import React from 'react'

import { SidebarMenu, SidebarMenuItem } from './ui/sidebar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

import { Profile } from '@/types/global'

const UserInfo = ({user}: { user?: Profile}) => {
  return (
    <SidebarMenu>
        <SidebarMenuItem>
        <div className=" mb-5 flex flex-row items-center gap-x-2 py-2">
            <Avatar>
              <AvatarImage src={user?.avatar_url ?? undefined } alt={user?.username} />
              <AvatarFallback>🦸</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h5 className="text-small text-default-400 tracking-tight text-dark-2 dark:text-light-3">
                {user?.username}
              </h5>
            </div>
          </div>
        </SidebarMenuItem>
    </SidebarMenu>
  )
}

export default UserInfo