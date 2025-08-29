'use client';

import React, { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {Plus, Search, X} from 'lucide-react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

// Mock user data
const mockCampers = [
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
  onAdd: (camper: ModInviteProps) => void;
}

const AddApprovedCamperModal: React.FC<InviteModModalProps> = ({isOpen, onClose, onAdd}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCamper, setSelectedCamper] = useState<ModInviteProps | null>(null);

  // Filter campers based on search term
  const filteredCampers = useMemo(() => {
    if (!searchTerm) return [];
    return mockCampers.filter(camper =>
      camper.username.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleCamperSelect = (camper: ModInviteProps) => {
    setSelectedCamper(camper);
    setSearchTerm('');
  };

  const handleCancelSelection = () => {
    setSelectedCamper(null);
    setSearchTerm('');
  };


  const handleAdd = () => {
    if (selectedCamper) {
      onAdd(selectedCamper);

      setSelectedCamper(null);
      setSearchTerm('');
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedCamper(null);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[98vw] sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className={"flex items-center gap-1"}>
            <Plus /> Add camper
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Input or Selected camper */}
          <div className="relative">
            {!selectedCamper ? (
              <>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search campers"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>

                {/* Search Results */}
                {searchTerm && filteredCampers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-900 rounded-md shadow-lg max-h-40 overflow-y-auto border">
                    {filteredCampers.map((camper) => (
                      <div
                        key={camper.id}
                        className="flex items-center p-3 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                        onClick={() => handleCamperSelect(camper)}
                      >
                        <Avatar className="w-8 h-8 rounded-full border border-neutral-400 dark:border-neutral-100">
                          <AvatarImage src={camper.avatar} alt={camper.username}/>
                          <AvatarFallback>{camper.username.charAt(2)}</AvatarFallback>
                        </Avatar>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                            {camper.username}
                          </div>
                          <div className="text-xs text-neutral-500 dark:text-neutral-400">
                            {camper.accountAge} • {camper.postKarma} post karma • {camper.commentKarma} comment karma
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
                  <AvatarImage src={selectedCamper.avatar} alt={selectedCamper.username}/>
                  <AvatarFallback>{selectedCamper.username.charAt(2)}</AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1">
                  <div className="text-sm font-medium text-neutral-900 dark:text-neutral-200">
                    {selectedCamper.username}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">
                    {selectedCamper.accountAge} • {selectedCamper.postKarma} post karma • {selectedCamper.commentKarma} comment karma
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelSelection}
                  className="ml-2 h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
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
              onClick={handleAdd}
              disabled={!selectedCamper}
              className={`rounded-full ${!selectedCamper ? 'cursor-not-allowed' : ''}`}
            >
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddApprovedCamperModal;
