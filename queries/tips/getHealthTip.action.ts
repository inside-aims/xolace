"use server"

import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
export const getHealthTip = cache(async (id: number) => {

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
});