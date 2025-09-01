'use client';

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Search, UserRoundPlusIcon, X, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useDebounce } from '@/utils/helpers/useDebounce';
import { useSearchUsers } from '@/hooks/campfires/moderations/useSearchUsers';
import { getPermissionGroups } from '@/queries/campfires/permissions/getPermissionGroup';
import { useCreateFirekeeperInviteV2 } from '@/hooks/campfires/moderations/useCampfireModerationHooks';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

export interface ModInviteProps {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  reputation: number;
}

export interface InviteModModalProps {
  isOpen: boolean;
  onClose: () => void;
  campfireId: string;
}

export interface SelectedPermissions {
  [groupKey: string]: {
    selected: boolean;
    permissions: number[];
  };
}

const InviteModModal: React.FC<InviteModModalProps> = ({ 
  isOpen, 
  onClose, 
  campfireId 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMod, setSelectedMod] = useState<ModInviteProps | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<SelectedPermissions>({});
  const [invitationMessage, setInvitationMessage] = useState('');
  const [showMessageInput, setShowMessageInput] = useState(false);

  // Hooks
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data: foundUsers, isLoading: isSearching, isError } = useSearchUsers(debouncedSearchTerm);
  const { data: permissionGroups, isLoading: isLoadingPermissions } = getPermissionGroups();
  const createInviteMutation = useCreateFirekeeperInviteV2(campfireId);

  // Initialize permissions when groups are loaded
  React.useEffect(() => {
    if (permissionGroups && Object.keys(selectedPermissions).length === 0) {
      const initialPermissions = permissionGroups.reduce((acc, group) => {
        acc[group.group] = {
          selected: group.group === 'manage_content', // Default select content management
          permissions: group.permissions.map(p => p.id)
        };
        return acc;
      }, {} as SelectedPermissions);
      setSelectedPermissions(initialPermissions);
    }
  }, [permissionGroups, selectedPermissions]);

  // Calculate selected permission IDs
  const selectedPermissionIds = useMemo(() => {
    return Object.values(selectedPermissions)
      .filter(group => group.selected)
      .flatMap(group => group.permissions);
  }, [selectedPermissions]);

  const handleUserSelect = (mod: ModInviteProps) => {
    setSelectedMod(mod);
    setSearchTerm('');
  };

  const handleCancelSelection = () => {
    setSelectedMod(null);
    setSearchTerm('');
  };

  const handlePermissionGroupToggle = (groupKey: string) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        selected: !prev[groupKey]?.selected
      }
    }));
  };

  const handleInvite = async () => {
    if (!selectedMod) {
      toast.error('Please select a user to invite');
      return;
    }

    if (selectedPermissionIds.length === 0) {
      toast.error('Please select at least one permission group');
      return;
    }

    try {
      await createInviteMutation.mutateAsync({
        inviteeId: selectedMod.id,
        permissionIds: selectedPermissionIds,
        invitationMessage: invitationMessage.trim() || undefined
      });

      // Reset form and close modal
      handleReset();
      onClose();
    } catch (error) {
      // Error handling is done in the mutation
      console.error('Invite error:', error);
    }
  };

  const handleReset = () => {
    setSelectedMod(null);
    setSearchTerm('');
    setInvitationMessage('');
    setShowMessageInput(false);
    // Reset to default permissions
    if (permissionGroups) {
      const defaultPermissions = permissionGroups.reduce((acc, group) => {
        acc[group.group] = {
          selected: group.group === 'manage_content',
          permissions: group.permissions.map(p => p.id)
        };
        return acc;
      }, {} as SelectedPermissions);
      setSelectedPermissions(defaultPermissions);
    }
  };

  const handleCancel = () => {
    handleReset();
    onClose();
  };

  if (isLoadingPermissions) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-full max-w-[98vw] sm:max-w-[500px]">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Loading permissions...
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1">
            <UserRoundPlusIcon className="h-5 w-5" /> 
            Invite Firekeeper
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search Input or Selected Mod */}
          <div className="relative">
            {!selectedMod ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search users to invite..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-lg"
                    disabled={createInviteMutation.isPending}
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
                    {foundUsers?.map((mod) => (
                      <div
                        key={mod.id}
                        className="flex items-center p-3 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
                        onClick={() => handleUserSelect(mod)}
                      >
                        <Avatar className="w-10 h-10 border-2 border-neutral-200 dark:border-neutral-700">
                          <AvatarImage src={mod.avatar_url} alt={mod.username} />
                          <AvatarFallback className="text-xs">
                            {mod.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                            {mod.username}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {formatDistanceToNow(new Date(mod.created_at))} old • {mod.reputation.toLocaleString()} reputation
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
                  <AvatarImage src={selectedMod.avatar_url} alt={selectedMod.username} />
                  <AvatarFallback className="text-sm">
                    {selectedMod.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {selectedMod.username}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDistanceToNow(new Date(selectedMod.created_at))} old • {selectedMod.reputation.toLocaleString()} reputation
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSelection}
                  disabled={createInviteMutation.isPending}
                  className="h-8 w-8 p-0 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Firekeeper Permissions
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                Select the permission groups for this firekeeper. They will have access to all permissions within the selected groups.
              </p>
            </div>

            {permissionGroups?.map((group) => (
              <div key={group.group} className="space-y-2">
                <div className="flex items-start space-x-3 p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                  <Checkbox
                    id={group.group}
                    checked={selectedPermissions[group.group]?.selected || false}
                    onCheckedChange={() => handlePermissionGroupToggle(group.group)}
                    disabled={createInviteMutation.isPending}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <label 
                      htmlFor={group.group} 
                      className="text-sm font-medium cursor-pointer text-neutral-900 dark:text-neutral-100"
                    >
                      {group.label}
                    </label>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      {group.description}
                    </p>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      Includes: {group.permissions.map(p => p.display_name).join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {selectedPermissionIds.length === 0 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Please select at least one permission group to proceed with the invitation.
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Optional Invitation Message */}
          <div className="space-y-2">
            {!showMessageInput ? (
              <Button
                variant="outline"
                onClick={() => setShowMessageInput(true)}
                disabled={createInviteMutation.isPending}
                className="text-sm"
              >
                Add personal message (optional)
              </Button>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  Personal Message (Optional)
                </label>
                <Textarea
                  placeholder="Add a personal message to the invitation..."
                  value={invitationMessage}
                  onChange={(e) => setInvitationMessage(e.target.value)}
                  disabled={createInviteMutation.isPending}
                  className="min-h-[80px] resize-none"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-neutral-500">
                    {invitationMessage.length}/500 characters
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowMessageInput(false);
                      setInvitationMessage('');
                    }}
                    disabled={createInviteMutation.isPending}
                    className="text-xs"
                  >
                    Remove message
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={createInviteMutation.isPending}
              className="rounded-lg"
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!selectedMod || selectedPermissionIds.length === 0 || createInviteMutation.isPending}
              className="rounded-lg"
            >
              {createInviteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModModal;