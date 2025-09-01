"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {Button} from "@/components/ui/button";
import {Plus, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import React, {useState} from "react";
import ModeratorActionsPopover from "@/components/mods/features/moderators/action-popover";
import InviteModModal, {
  ModInviteProps
} from "@/components/mods/features/moderators/invites-mod-modal";

const mockModerators = [
  {
    id: 1,
    username: "u/NoFlow9266",
    avatar: "/avatars/avatar1.png",
    permissions: "Everything",
    canEdit: "No",
    joined: "11:04 AM • Aug 19, 2025",
  },
  {
    id: 2,
    username: "u/Usual_Field_7545",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    permissions: "Everything",
    canEdit: "No",
    joined: "7:37 PM • Aug 25, 2025",
  },
];

const Moderators = ({campfireId}: {campfireId: string}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  const filteredModerators = searchTerm.trim() === ""
    ? mockModerators
    : mockModerators.filter((moderator) => {
      const term = searchTerm.toLowerCase()
      return (
        moderator.username.toLowerCase().includes(term) ||
        moderator.id.toString().includes(term)
      )
    })

  //Helper for inviting mods
  // const handleInviteMod = (mod: ModInviteProps, permissions: ModPermissions) => {
  //   console.log('Inviting mod:', mod);
  //   console.log('With permissions:', permissions);
  //   // Handle the invitation logic here
  // };

  //Helper for mod team order
  const handleTeamOrder = () => {
    return ''
  }

  //Helper to exit as mod
  const handleLeaveModTeam = () => {
    return ''
  }

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="flex gap-2 justify-end">
          <Button
            className="flex items-center gap-1 rounded-full bg-lavender-500 py-2 text-white text-sm hover:bg-lavender-600 transition"
            onClick={() => setShowInviteModal(true)}
          >
            <Plus/> Invite Mod
          </Button>
          <ModeratorActionsPopover
            onLeaveModTeam={handleLeaveModTeam}
            onTeamOrder={handleTeamOrder}
          />
        </div>

        {/* Search */}
        <div className="relative w-full rounded-full my-4">
          <span className="absolute inset-y-0 start-0 flex items-center ps-2">
            <Search className="w-4 h-4 text-muted-foreground"/>
          </span>
          <Input
            type="text"
            name="searchInput"
            placeholder="Search mod"
            className="ps-8 w-full md:w-64 lg:w-81 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>USERNAME</TableHead>
                <TableHead>PERMISSIONS</TableHead>
                <TableHead>You can edit</TableHead>
                <TableHead>JOINED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModerators.map((mod) => (
                <TableRow key={mod.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={mod.avatar} alt={mod.username}/>
                      <AvatarFallback>
                        {mod.username.charAt(2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{mod.username}</span>
                  </TableCell>
                  <TableCell>{mod.permissions}</TableCell>
                  <TableCell>{mod.canEdit}</TableCell>
                  <TableCell>{mod.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <InviteModModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        campfireId={campfireId}
      />
    </>
  );
};

export default Moderators;
