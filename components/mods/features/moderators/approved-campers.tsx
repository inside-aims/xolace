'use client';

import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import AddApprovedCamperModal from "@/components/mods/features/moderators/add-camper-modal";
import { getApprovedUsers } from "@/queries/campfires/moderations/getApprovedUsers";
import { formatDistanceToNow } from "date-fns";

interface ApprovedCampersProps {
  campfireId: string;
}

const ApprovedCampers: React.FC<ApprovedCampersProps> = ({ campfireId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCamperModal, setShowAddCamperModal] = useState(false);

  // Fetch approved users data
  const { 
    data: approvedUsers, 
    isLoading, 
    isError,
    error 
  } = getApprovedUsers(campfireId);

  // Filter approved users based on search term
  const filteredUsers = React.useMemo(() => {
    if (!approvedUsers) return [];
    
    if (searchTerm.trim() === "") {
      return approvedUsers;
    }

    const term = searchTerm.toLowerCase();
    return approvedUsers.filter((user) => 
      user.username.toLowerCase().includes(term) ||
      user.id.toString().includes(term)
    );
  }, [approvedUsers, searchTerm]);

  const handleAddCamper = (userId: string) => {
    console.log('Adding approved camper:', userId);
    // The actual approval logic is handled in the modal
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-500" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Loading approved users...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <p className="text-sm text-red-500 mb-4">
          Failed to load approved users: {error?.message || 'Unknown error'}
        </p>
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          className="rounded-lg"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="w-full flex flex-col space-y-4">
        <p className="text-neutral-500 text-sm">
          Think of approved users as campers with special access to the fire, they can gather without being held back by
          some of the usual limits.
        </p>

        {/* Header Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            className="flex items-center gap-1 rounded-full bg-lavender-500 px-4 py-2 text-white text-sm hover:bg-lavender-600 transition-colors"
            onClick={() => setShowAddCamperModal(true)}
          >
            <Plus className="h-4 w-4" /> 
            Add Approved Camper
          </Button>
        </div>

        {/* Search */}
        <div className="relative w-full rounded-full">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3">
            <Search className="w-4 h-4 text-muted-foreground" />
          </span>
          <Input
            type="text"
            name="searchInput"
            placeholder="Search approved campers..."
            className="ps-10 w-full md:w-64 lg:w-80 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Approved Users Table */}
        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                <TableHead className="font-semibold">USERNAME</TableHead>
                <TableHead className="font-semibold">REPUTATION</TableHead>
                <TableHead className="font-semibold">JOINED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        {searchTerm.trim() ? 'No approved users found matching your search.' : 'No approved users found.'}
                      </p>
                      {searchTerm.trim() && (
                        <Button 
                          variant="ghost" 
                          onClick={() => setSearchTerm('')}
                          className="text-sm"
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-neutral-200 dark:border-neutral-700">
                          <AvatarImage src={user.avatar_url} alt={user.username} />
                          <AvatarFallback className="text-sm font-medium">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {user.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-neutral-900 dark:text-neutral-100">
                        {user.reputation.toLocaleString()}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {formatDistanceToNow(new Date(user.joined_at))} ago
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(user.joined_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Stats Footer */}
        {approvedUsers && approvedUsers.length > 0 && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
            Showing {filteredUsers.length} of {approvedUsers.length} approved user{approvedUsers.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <AddApprovedCamperModal
        isOpen={showAddCamperModal}
        onClose={() => setShowAddCamperModal(false)}
        campfireId={campfireId}
        onAdd={handleAddCamper}
      />
    </>
  );
};

export default ApprovedCampers;