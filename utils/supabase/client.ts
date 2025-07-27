import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/types_db';

export const getSupabaseBrowserClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookieOptions: {
        ...(process.env.NODE_ENV === 'production' && { domain: `.${process.env.ROOT_DOMAIN}` }), // This is KEY for browser client
      },
    }
  );
