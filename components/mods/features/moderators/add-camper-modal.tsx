'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Search, Plus, X, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/utils/helpers/useDebounce';
import { useSearchUsers } from '@/hooks/campfires/moderations/useSearchUsers';
import { useAddApprovedUser } from '@/hooks/campfires/moderations/useAddApprovedUser';
import { formatDistanceToNow } from 'date-fns';

export interface UserSearchResult {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  reputation: number;
}

export interface AddApprovedCamperModalProps {
  isOpen: boolean;
  onClose: () => void;
  campfireId: string;
  onAdd: (userId: string) => void;
}

const AddApprovedCamperModal: React.FC<AddApprovedCamperModalProps> = ({ 
  isOpen, 
  onClose, 
  campfireId,
  onAdd 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);

  // Hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: foundUsers, isLoading: isSearching, isError } = useSearchUsers(debouncedSearchTerm);
  const addApprovedUserMutation = useAddApprovedUser(campfireId);

  const handleUserSelect = (user: UserSearchResult) => {
    setSelectedUser(user);
    setSearchTerm('');
  };

  const handleCancelSelection = () => {
    setSelectedUser(null);
    setSearchTerm('');
  };

  const handleAdd = async () => {
    if (!selectedUser) {
      return;
    }

    try {
      await addApprovedUserMutation.mutateAsync({
        userId: selectedUser.id
      });

      // Reset form and close modal
      handleReset();
      onClose();
      onAdd(selectedUser.id);
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Add approved user error:', error);
    }
  };

  const handleReset = () => {
    setSelectedUser(null);
    setSearchTerm('');
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-[500px] border-0 rounded-2xl!">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <Plus className="h-5 w-5" /> 
            Add Approved Camper
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input or Selected User */}
          <div className="relative">
            {!selectedUser ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search users to approve..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg"
                    disabled={addApprovedUserMutation.isPending}
                  />
                </div>

                {/* Search Results */}
                {debouncedSearchTerm.length >= 3 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {isSearching && (
                      <div className="flex items-center justify-center p-4 text-sm text-gray-500">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...
                      </div>
                    )}
                    {isError && (
                      <div className="p-4 text-sm text-red-500 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Could not search users. Please try again.
                      </div>
                    )}
                    {!isSearching && foundUsers && foundUsers.length === 0 && (
                      <div className="p-4 text-sm text-gray-500 text-center">
                        No users found matching "{debouncedSearchTerm}"
                      </div>
                    )}
                    {foundUsers?.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                        onClick={() => handleUserSelect(user)}
                      >
                        <Avatar className="w-10 h-10 border-2 border-neutral-200 dark:border-neutral-700">
                          <AvatarImage src={user.avatar_url} alt={user.username} />
                          <AvatarFallback className="text-sm">
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {user.username}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatDistanceToNow(new Date(user.created_at))} old • {user.reputation.toLocaleString()} reputation
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Selected User Display */
              <div className="flex items-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border">
                <Avatar className="w-10 h-10 border-2 border-neutral-200 dark:border-neutral-600">
                  <AvatarImage src={selectedUser.avatar_url} alt={selectedUser.username} />
                  <AvatarFallback className="text-sm">
                    {selectedUser.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {selectedUser.username}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(selectedUser.created_at))} old • {selectedUser.reputation.toLocaleString()} reputation
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSelection}
                  disabled={addApprovedUserMutation.isPending}
                  className="h-8 w-8 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Only existing campfire members can be approved. Users must join the campfire first.
            </AlertDescription>
          </Alert>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={addApprovedUserMutation.isPending}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={!selectedUser || addApprovedUserMutation.isPending}
              className="rounded-lg"
            >
              {addApprovedUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve User'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddApprovedCamperModal;