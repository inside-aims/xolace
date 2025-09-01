'use client';

import { useRouter } from 'next/navigation';
import { ShieldCheck, ShieldX, Clock, MessageSquare, Info } from 'lucide-react';
// import { useAcceptModeratorInvitation, useDeclineModeratorInvitation } from '@/hooks/campfires/useModeratorInvites';
import { useAcceptModeratorInvite, useDeclineModeratorInvite } from '@/hooks/campfires/moderations/useCampfireModerationHooks';
import { Button } from '@/components/ui/button';
import { DefaultLoader } from '../shared/loaders/DefaultLoader';

// Define the shape of the metadata for this specific notification type
interface ModeratorInviteMetadata {
  campfire_id: string;
  campfire_name: string;
  campfire_icon_url?: string;
  invitation_message?: string;
  campfire_slug: string;
}

// The main prop for our component
interface ModeratorInvitationDetailsProps {
  notification: {
    id: string;
    entity_id: string; // This is the invitation_id
    metadata: ModeratorInviteMetadata;
    author_name: string; // The inviter's name
  };
}

export default function ModeratorInvitationDetails({ notification }: ModeratorInvitationDetailsProps) {
  const router = useRouter();
  const invitationId = notification.entity_id;

  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptModeratorInvite();
  const { mutate: declineInvite, isPending: isDeclining } = useDeclineModeratorInvite();

  const handleAccept = () => {
    acceptInvite(invitationId, {
      onSuccess: () => {
        // Redirect to the campfire's page on success
        router.push(`/x/${notification.metadata.campfire_slug}`);
      },
      // You can add onError handling here with a toast notification
    });
  };

  const handleDecline = () => {
    declineInvite(invitationId, {
      onSuccess: () => {
        // Go back to the notifications list
        router.push('/notifications');
      },
    });
  };

  const isProcessing = isAccepting || isDeclining;

  return (
    <div className="main-container max-w-2xl mx-auto p-4 sm:p-6">
      <div className="rounded-2xl border border-gray-700 bg-gray-900/50 p-6 sm:p-8 text-center space-y-6">
        <header className="space-y-3">
          <img
            src={notification.metadata.campfire_icon_url || '/default-icon.png'}
            alt={`${notification.metadata.campfire_name} icon`}
            className="w-20 h-20 rounded-full mx-auto border-2 border-gray-600"
          />
          <h1 className="text-2xl font-bold">Firekeeper Invitation</h1>
          <p className="text-gray-400">
            <span className="font-semibold text-white">{notification.author_name}</span> has invited you to become a Firekeeper for the{' '}
            <span className="font-semibold text-white">{notification.metadata.campfire_name}</span> Campfire.
          </p>
        </header>

        {notification.metadata.invitation_message && (
          <div className="text-left bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <p className="text-sm text-gray-300 italic">
              <MessageSquare className="inline-block mr-2 h-4 w-4" />
              {notification.metadata.invitation_message}
            </p>
          </div>
        )}

        <div className="bg-yellow-900/20 border border-yellow-700/50 text-yellow-300 text-sm p-3 rounded-lg flex items-center gap-3">
          <Info size={20} />
          <span>Becoming a Firekeeper gives you moderation tools and responsibilities within the Campfire. You can safely ignore this invitation if you do not wish to accept it.</span>
        </div>

        <footer className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white rounded-full px-8"
            onClick={handleDecline}
            disabled={isProcessing}
          >
            {isDeclining ? <DefaultLoader size={20} /> : <><ShieldX className="mr-2 h-4 w-4" /> Decline</>}
          </Button>
          <Button
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white rounded-full px-8"
            onClick={handleAccept}
            disabled={isProcessing}
          >
            {isAccepting ? <DefaultLoader size={20} /> : <><ShieldCheck className="mr-2 h-4 w-4" /> Accept</>}
          </Button>
        </footer>
      </div>
    </div>
  );
}