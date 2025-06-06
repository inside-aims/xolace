'use client';

import { DetailPost } from "@/types/global";

import { DetailCard } from '@/components/cards/DetailCard';
import PostDetailDrawer from '@/components/ui/PostDetailDrawer';
import PostDetailsInteraction from '@/components/hocs/detailsPostComponents/PostDetailsInteraction';

import { useMediaQuery } from "@/hooks/use-media-query";

interface CommentProps {
    postId: string;
    post: DetailPost;
    type: string | string[] | undefined;
}

const Comment = ({ postId, post, type }: CommentProps) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    return (
        <>
      <DetailCard postId={postId} post={post} />
      {/* <Suspense fallback={<Skeleton className="view_skeleton" />}>
        <View id={postId} createdBy={post.created_by} viewsCount={post.views[0].count || 0} content={post.content} />
      </Suspense> */}

      {/* Drawer for comment form and comment cards for mobile */}
      {isMobile && <PostDetailDrawer post={post} type={type} />}

      {/* comment form and comment cards for desktop */}
      {!isMobile && <PostDetailsInteraction post={post} />}
      
    </>
    );
};

export default Comment;