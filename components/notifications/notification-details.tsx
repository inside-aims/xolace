'use client';

import { motion } from 'motion/react';
import { Clock, Tag, User, ExternalLink, MoveLeft, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import {
  useNotificationDetails,
  useDeleteNotification,
} from '@/hooks/notifications/useNotifications';
import { NotificationMetadataWithLink } from '@/hooks/notifications/useNotificationCardLogic';
import SearchLoader from '../shared/loaders/SearchLoader';
import { DefaultLoader } from '../shared/loaders/DefaultLoader';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high':
      return 'text-red-400 bg-red-900/20 border-red-800/50';
    case 'medium':
      return 'text-yellow-400 bg-yellow-900/20 border-yellow-800/50';
    case 'low':
      return 'text-green-400 bg-green-900/20 border-green-800/50';
    default:
      return 'text-gray-400 bg-gray-800/20 border-gray-700/50';
  }
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'feature_update':
      return 'text-blue-400 bg-blue-900/20 border-blue-800/50';
    case 'policy_update':
      return 'text-purple-400 bg-purple-900/20 border-purple-800/50';
    case 'maintenance':
      return 'text-orange-400 bg-orange-900/20 border-orange-800/50';
    default:
      return 'text-gray-400 bg-gray-800/20 border-gray-700/50';
  }
};

export default function NotificationDetails({
  notificationId,
}: {
  notificationId: string;
}) {
  const router = useRouter();
  const {
    data: notification,
    isPending,
    error,
  } = useNotificationDetails({ notificationId });
  const { mutate: deleteNotification, isPending: isDeletingNotification } =
    useDeleteNotification({ notificationId });

  const handleBack = () => {
    router.back();
  };

  const handleDelete = async () => {
    try {
      //await fakeDeleteNotification(notificationId)
      deleteNotification();
      router.push('/notifications');
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (isPending) return <SearchLoader />;

  if (error) return <div>Error: {error.message}</div>;

  const metadata = notification.metadata as NotificationMetadataWithLink | null;

  return (
    <div className="main-container">
      {/* Header */}
      <header className="flex w-full items-center justify-between px-4 sm:px-6">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full"
          onClick={handleBack}
        >
          <MoveLeft className="mr-2 h-4 w-4" />
          Back to Notifications
        </Button>

        <Button
          variant="destructive"
          size="sm"
          className="flex items-center justify-center gap-1 rounded-full"
          onClick={handleDelete}
          disabled={isDeletingNotification}
        >
          {isDeletingNotification ? (
            <DefaultLoader />
          ) : (
            <>
              <Trash size={14} /> <span>Delete</span>
            </>
          )}
        </Button>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <motion.article
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {/* Hero Section */}
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="mb-4 text-6xl"
            >
              {metadata?.icon || ''}
            </motion.div>

            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl"
            >
              {metadata?.title || ''}
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-400"
            >
              {metadata?.description || ''}
            </motion.p>
          </div>

          {/* Metadata */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <User className="h-4 w-4" />
              <span>{metadata?.author || ''}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span>
                {formatDistanceToNow(new Date(notification.created_at), {
                  addSuffix: true,
                })}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <span>📖</span>
              <span>{metadata?.estimated_read_time || ''}</span>
            </div>
          </motion.div>

          {/* Tags and Priority */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            <span
              className={`rounded-full border bg-transparent px-3 py-1 text-xs font-medium ${getPriorityColor(
                metadata?.priority || '',
              )}`}
            >
              {metadata?.priority.toUpperCase()} PRIORITY
            </span>

            <span
              className={`rounded-full border bg-transparent px-3 py-1 text-xs font-medium ${getCategoryColor(
                metadata?.category || '',
              )}`}
            >
              {metadata?.category.replace('_', ' ').toUpperCase()}
            </span>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="rounded-2xl border border-gray-100 bg-gray-400/50 p-6 backdrop-blur-sm sm:p-8 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <div
              className="prose prose-invert prose-gray max-w-none text-black/70 dark:text-gray-300"
              dangerouslySetInnerHTML={{ __html: metadata?.content || '' }}
            />
          </motion.div>

          {/* Tags */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2 text-gray-400">
              <Tag className="h-4 w-4" />
              <span className="text-sm font-medium">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {metadata?.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="cursor-pointer rounded-full bg-gray-300/50 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Action Button */}
          {metadata?.action_url && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="pt-4 text-center"
            >
              <Button
                className="rounded-full bg-gradient-to-r from-[#0536ff] to-[#6a71ea] px-8 py-3 font-medium text-white shadow-lg shadow-[#0536ff]/25 transition-all duration-300 hover:from-[#0536ff]/90 hover:to-[#6a71ea]/90"
                onClick={() => router.push(metadata.action_url!)}
              >
                <span>Learn More</span>
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.article>
      </main>
    </div>
  );
}
