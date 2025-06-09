'use server';

import { createClient } from '@/utils/supabase/server';
import { cache } from 'react';
export const getHealthTip = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data, error }: { data: any | null; error: any | null } =
    await supabase
      .from('health_tips')
      .select(
        `
      *
    `,
      )
      .eq('slug', slug)
      .single();

  if (error) throw error;

  return data;
});
