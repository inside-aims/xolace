import { createClient } from "@supabase/supabase-js";

// never use the super Admin client on the frontend
// or for calling user specific features like getSession() or getUser()
export const getSupabaseAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
