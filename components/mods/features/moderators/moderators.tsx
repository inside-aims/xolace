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
import { Button } from "@/components/ui/button";
import { Plus, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import ModeratorActionsPopover from "@/components/mods/features/moderators/action-popover";
import InviteModModal from "@/components/mods/features/moderators/invites-mod-modal";
import { getCampfireModerators } from "@/queries/campfires/moderations/getCampfireModerators";
import { formatDistanceToNow } from "date-fns";

interface ModeratorsProps {
  campfireId: string;
}

const Moderators: React.FC<ModeratorsProps> = ({ campfireId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false);

  // Fetch moderators data
  const { 
    data: moderators, 
    isLoading, 
    isError,
    error 
  } = getCampfireModerators(campfireId);

  // Filter moderators based on search term
  const filteredModerators = React.useMemo(() => {
    if (!moderators) return [];
    
    if (searchTerm.trim() === "") {
      return moderators;
    }

    const term = searchTerm.toLowerCase();
    return moderators.filter((moderator) => 
      moderator.username.toLowerCase().includes(term) ||
      moderator.id.toString().includes(term)
    );
  }, [moderators, searchTerm]);

  const handleTeamOrder = () => {
    // TODO: Implement team order functionality
    console.log('Team order functionality');
  };

  const handleLeaveModTeam = () => {
    // TODO: Implement leave mod team functionality  
    console.log('Leave mod team functionality');
  };

  if (isLoading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-ocean-500" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
          Loading moderators...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-8">
        <p className="text-sm text-red-500 mb-4">
          Failed to load moderators: {error?.message || 'Unknown error'}
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
        {/* Header Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            className="flex items-center gap-1 rounded-full bg-lavender-500 py-2 text-white text-sm hover:bg-lavender-600 transition-colors"
            onClick={() => setShowInviteModal(true)}
          >
            <Plus className="h-4 w-4" /> 
            Invite Firekeeper
          </Button>
          <ModeratorActionsPopover
            onLeaveModTeam={handleLeaveModTeam}
            onTeamOrder={handleTeamOrder}
          />
        </div>

        {/* Search */}
        <div className="relative w-full rounded-full">
          <span className="absolute inset-y-0 start-0 flex items-center ps-3">
            <Search className="w-4 h-4 text-muted-foreground" />
          </span>
          <Input
            type="text"
            name="searchInput"
            placeholder="Search firekeepers..."
            className="ps-10 w-full md:w-64 lg:w-80 rounded-full border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Moderators Table */}
        <div className="overflow-x-auto rounded-lg border border-neutral-200 dark:border-neutral-800">
          <Table>
            <TableHeader>
              <TableRow className="bg-neutral-50 dark:bg-neutral-900">
                <TableHead className="font-semibold">USERNAME</TableHead>
                <TableHead className="font-semibold">PERMISSIONS</TableHead>
                <TableHead className="font-semibold">YOU CAN EDIT</TableHead>
                <TableHead className="font-semibold">JOINED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModerators.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <p className="text-neutral-500 dark:text-neutral-400">
                        {searchTerm.trim() ? 'No moderators found matching your search.' : 'No moderators found.'}
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
                filteredModerators.map((mod) => (
                  <TableRow 
                    key={mod.id} 
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-neutral-200 dark:border-neutral-700">
                          <AvatarImage src={mod.avatar_url} alt={mod.username} />
                          <AvatarFallback className="text-sm font-medium">
                            {mod.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-neutral-900 dark:text-neutral-100">
                            {mod.username}
                          </span>
                          {mod.role === 'creator' && (
                            <span className="text-xs text-ocean-600 dark:text-ocean-400 font-medium">
                              Founder
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {mod.permission_summary || 'Everything'}
                        </span>
                        {mod.permission_count && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {mod.permission_count} permission{mod.permission_count !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-sm font-medium ${
                        mod.can_edit 
                          ? 'text-green-600 dark:text-green-400' 
                          : 'text-neutral-500 dark:text-neutral-400'
                      }`}>
                        {mod.can_edit ? 'Yes' : 'No'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-900 dark:text-neutral-100">
                          {formatDistanceToNow(new Date(mod.joined_at))} ago
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {new Date(mod.joined_at).toLocaleDateString('en-US', {
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
        {moderators && moderators.length > 0 && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 text-center">
            Showing {filteredModerators.length} of {moderators.length} firekeeper{moderators.length !== 1 ? 's' : ''}
          </div>
        )}
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