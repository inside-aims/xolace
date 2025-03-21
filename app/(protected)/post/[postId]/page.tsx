import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import type { Metadata } from 'next';

import { DetailCard } from '@/components/cards/DetailCard';
import PostDetailDrawer from '@/components/ui/PostDetailDrawer';
import { createClient } from '@/utils/supabase/server';
import View from '@/components/hocs/detailsPostComponents/View';
import { Skeleton } from '@/components/ui/skeleton';

type Params = Promise<{ postId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata: Metadata = {
  title: 'Post',
}

const PostDetailPage = async (props: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) => {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const supabase = await createClient();
  const postId = params.postId;
  const type = searchParams.type;

  // incase there is no post id
  if (!postId) {
    return notFound();
  }

  const { data: post, error } = await supabase
    .from('posts')
    .select(
      `
      *,
       posttags (
        tags (
          name
        )
      ),
         votes(
         user_id,
         vote_type
         ),
         comments(*),
         views:views(count),
         collections(
           user_id
         )
   `,
    )
    .eq('id', postId)
    .order('created_at', { ascending: true, referencedTable: 'comments' })
    .single();

  //  check for error
  if (error) {
    return notFound();
  }

  return (
    <>
      <DetailCard postId={postId} post={post} />
      <Suspense fallback={<Skeleton className="view_skeleton" />}>
        <View id={postId} viewsCount={post.views[0].count} />
      </Suspense>

      {/* Drawer for comment form and comment cards */}
      <PostDetailDrawer post={post} type={type} />
    </>
  );
};

export default PostDetailPage;
