"use server"

import { createClient } from "@/utils/supabase/server";
export const getHealthTip = async (id: number) => {

  const supabase = await createClient();

  const { data, error }: {data: any | null, error: any | null}  = await supabase
    .from('health_tips')
    .select(
      `
      *
    `
    )
    .eq('id', id)
    .single();

  if (error) throw error;

  
  return data;
};