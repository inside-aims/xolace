import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>{
              const cookieOptions = {
                ...options,
                // Only set domain for production/preview, not localhost
                ...(process.env.NODE_ENV === 'production' && { domain: `.${process.env.ROOT_DOMAIN}` }),
              }
              cookieStore.set(name, value, cookieOptions)
            });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            console.error('Error setting cookies:', error);
          }
        },
      },
    },
  );
};

export const getServerSupabase = async () => {
  const supabase = await createClient();
  return supabase;
};
