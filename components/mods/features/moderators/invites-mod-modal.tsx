'use client';

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {Search, UserRoundPlusIcon, X} from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// Mock mod data
const mockUsers = [
  {
    id: '1',
    username: 'DeepFuckingValue',
    avatar: '/api/placeholder/32/32',
    postKarma: 0,
    commentKarma: 0,
    accountAge: '6y ago'
  },
  {
    id: '2',
    username: 'JohnDoe123',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    postKarma: 150,
    commentKarma: 320,
    accountAge: '2y ago'
  },
  {
    id: '3',
    username: 'TechGuru',
    avatar: '/api/placeholder/32/32',
    postKarma: 500,
    commentKarma: 1200,
    accountAge: '4y ago'
  },
  {
    id: '4',
    username: 'CryptoTrader',
    avatar: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    postKarma: 75,
    commentKarma: 890,
    accountAge: '1y ago'
  }
];

export interface ModInviteProps {
  id: string;
  username: string;
  avatar: string;
  postKarma: number;
  commentKarma: number;
  accountAge: string;
}

export interface InviteModModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (mod: ModInviteProps, permissions: ModPermissions) => void;
}

export interface ModPermissions {
  everything: boolean;
  campers: boolean;
  channels: boolean;
  chatConfig: boolean;
}

interface PermissionOption {
  key: keyof ModPermissions;
  label: string;
  description: string;
}

// Permission configuration
const PERMISSION_OPTIONS: PermissionOption[] = [
  {
    key: 'everything',
    label: 'Everything',
    description: 'Full access including the ability to manage moderator access and permissions.'
  },
  {
    key: 'campers',
    label: 'Campers',
    description: 'Access mod notes, ban and mute campers, and approve submitters*.'
  },
  {
    key: 'channels',
    label: 'Channels',
    description: 'Create, edit, and delete channels.'
  },
  {
    key: 'chatConfig',
    label: 'Chat config',
    description: 'Create live chat posts in this community.'
  }
];


const InviteModModal: React.FC<InviteModModalProps> = ({isOpen, onClose, onInvite}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMod, setSelectedMod] = useState<ModInviteProps | null>(null);
  const [permissions, setPermissions] = useState<ModPermissions>({
    everything: true,
    campers: true,
    channels: true,
    chatConfig: true
  });

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return [];
    return mockUsers.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleUserSelect = (mod: ModInviteProps) => {
    setSelectedMod(mod);
    setSearchTerm('');
  };

  const handleCancelSelection = () => {
    setSelectedMod(null);
    setSearchTerm('');
  };

  const handlePermissionChange = (permission: keyof ModPermissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  const handleInvite = () => {
    if (selectedMod) {
      onInvite(selectedMod, permissions);

      setSelectedMod(null);
      setSearchTerm('');
      setPermissions({
        everything: true,
        campers: true,
        channels: true,
        chatConfig: true
      });
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedMod(null);
    setSearchTerm('');
    setPermissions({
      everything: true,
      campers: true,
      channels: true,
      chatConfig: true
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className={"flex items-center gap-1"}>
            <UserRoundPlusIcon/> Invite
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input or Selected Mod */}
          <div className="relative">
            {!selectedMod ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search users"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>

                {/* Search Results */}
                {searchTerm && filteredUsers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg max-h-40 overflow-y-auto">
                    {filteredUsers.map((mod) => (
                      <div
                        key={mod.id}
                        className="flex items-center p-3 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => handleUserSelect(mod)}
                      >
                        <Avatar className="w-8 h-8 rounded-full border border-neutral-400 dark:border-neutral-100">
                          <AvatarImage src={mod.avatar} alt={mod.username}/>
                          <AvatarFallback>{mod.username.charAt(2)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                            {mod.username}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {mod.accountAge} • {mod.postKarma} post karma • {mod.commentKarma} comment karma
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Selected User Display */
              <div className="flex items-center p-3 bg-neutral-200 dark:bg-neutral-800 rounded-md">
                <Avatar className="w-8 h-8 rounded-full border border-neutral-400 dark:border-neutral-100">
                  <AvatarImage src={selectedMod.avatar} alt={selectedMod.username}/>
                  <AvatarFallback>{selectedMod.username.charAt(2)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                    {selectedMod.username}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedMod.accountAge} • {selectedMod.postKarma} post karma • {selectedMod.commentKarma} comment karma
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSelection}
                  className="ml-2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4"/>
                </Button>
              </div>
            )}
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            {PERMISSION_OPTIONS.map((option) => (
              <div key={option.key} className="flex items-start space-x-3">
                <Checkbox
                  id={option.key}
                  checked={permissions[option.key]}
                  onCheckedChange={() => handlePermissionChange(option.key)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label htmlFor={option.key} className="text-sm font-medium cursor-pointer">
                    {option.label}
                  </label>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className={"rounded-full"}
            >
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!selectedMod}
              className={`rounded-full ${!selectedMod ? 'cursor-not-allowed' : ''}`}
            >
              Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModModal;
