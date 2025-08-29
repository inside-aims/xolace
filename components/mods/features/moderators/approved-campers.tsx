'use client';

import {Button} from "@/components/ui/button";
import {Plus, Search} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import React from "react";
import {ModInviteProps} from "@/components/mods/features/moderators/invites-mod-modal";
import AddApprovedCamperModal from "@/components/mods/features/moderators/add-camper-modal";


const mockApprovedCampers = [
  {
    id: 1,
    username: "u/NoFlow9266",
    avatar: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
    joined: "11:04 AM • Aug 19, 2025",
  },
  {
    id: 2,
    username: "u/Usual_Field_7545",
    avatar: "/avatars/avatar2.png",
    joined: "7:37 PM • Aug 25, 2025",
  },
];


const ApprovedCampers = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showAddCamperModal, setShowAddCamperModal] = React.useState(false);

  const filteredModerators = searchTerm.trim() === ""
    ? mockApprovedCampers
    : mockApprovedCampers.filter((camper) => {
      const term = searchTerm.toLowerCase()
      return (
        camper.username.toLowerCase().includes(term) ||
        camper.id.toString().includes(term)
      )
    })

  //Helper for inviting mods
  const handleAddCamper = (mod: ModInviteProps) => {
    console.log('Inviting mod:', mod);
    // Handle the invitation logic here
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <p className={"text-neutral-500 text-sm"}>
          Think of approved users as campers with special access to the fire, they can gather without being held back by
          some of the usual limits.
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            className="flex items-center gap-1 rounded-full bg-lavender-500 px-4 py-2 text-white text-sm hover:bg-lavender-600 transition"
            onClick={() => setShowAddCamperModal(true)}
          >
            <Plus/> Add Approved Camper
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full rounded-full">
          <span className="absolute inset-y-0 start-0 flex items-center ps-2">
            <Search className="w-4 h-4 text-muted-foreground"/>
          </span>
          <Input
            type="text"
            name="searchInput"
            placeholder="Search campers"
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
                  <TableCell>{mod.joined}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
      <AddApprovedCamperModal
        isOpen={showAddCamperModal}
        onClose={() => setShowAddCamperModal(false)}
        onAdd={handleAddCamper}
      />
    </>
  )
}
export default ApprovedCampers