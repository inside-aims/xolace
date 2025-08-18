import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { createClient } from '@/utils/supabase/server';
import { getPostMetadata } from '@/lib/actions/post.action';
import Comment from './Comment';

type Params = Promise<{ postId: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<Metadata> {
  const { postId } = await params;

  const post = await getPostMetadata(postId);

  if (!post) return {};

  return {
    title: `Post-${post.author_name}`,
    description: post.content.slice(0, 100)
  };
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
         ),
          post_slides (
            slide_index,
            content
          ),
          campfires!posts_campfire_id_fkey (
            name,
            icon_url,
            slug
          )  
   `,
    )
    .eq('id', postId)
    .order('created_at', { ascending: true, referencedTable: 'comments' })
    .order('slide_index', {
      ascending: true,
      referencedTable: 'post_slides',
    })
    .single();

  //  check for error
  if (error) {
    return notFound();
  }


  return (
    <Comment postId={postId} post={post} type={type} />
  );
};

export default PostDetailPage;
