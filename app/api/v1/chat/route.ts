import { getSupabaseReqResClient } from "@/utils/supabase/reqResClient";
import { NextRequest } from "next/server";
// app/api/ai-chat/route.ts (App Router)
export const runtime = 'edge';

export async function POST(req: NextRequest) {
  const supabaseEdgeFunctionURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/nvidia-api-integration`;

  const authToken = req.headers.get('authorization'); // forward user JWT from client if needed
  const { supabase } = getSupabaseReqResClient({ request: req });
  const { data } = await supabase.auth.getSession();
const token = data.session?.access_token ;
  //const incomingBody = await req.text(); // streamable forward

  const response = await fetch(supabaseEdgeFunctionURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: authToken } : { Authorization: `Bearer ${token}` }),
    },
    body: JSON.stringify(await req.json()),
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'text/event-stream',
    },
  });
}
