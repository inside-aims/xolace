"use server"

import { createClient } from "@/utils/supabase/server";
export const getHealthTips = async () => {

  const supabase = await createClient();

  const { data, error }: {data: any[] | null, error: any | null}  = await supabase
    .from('health_tips')
    .select(
      `
      *
    `
    ).limit(6)
    .eq("is_approved", true)
    .order('created_at', { ascending: false });

  if (error) throw error;

  
  return data || [];
};