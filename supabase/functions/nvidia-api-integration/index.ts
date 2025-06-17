import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createOpenAICompatible } from 'npm:@ai-sdk/openai-compatible';
import { createClient } from 'npm:@supabase/supabase-js@2';
import { streamText } from 'npm:ai';
const nim = createOpenAICompatible({
  name: 'nim',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  headers: {
    Authorization: `Bearer ${Deno.env.get('NVIDIA_NIM_API_KEY')}`,
  },
});
Deno.serve(async req => {
  console.log('In function');
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
    });
  }

  console.log('creating client ', req.headers.get('Authorization'));
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized, No token',
      }),
      {
        status: 401,
      },
    );
  }
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_ANON_KEY'),
    {
      global: {
        headers: {
          Authorization: req.headers.get('Authorization'),
        },
      },
    },
  );
  const {
    data: { user },
    error: userError,
  } = await supabaseClient.auth.getUser(token);
  if (userError || !user) {
    return new Response(
      JSON.stringify({
        error: 'Unauthorized, No user ' + userError,
      }),
      {
        status: 401,
      },
    );
  }

  console.log("user ",user)
  // get id of profiles table 
  const { data: profileData, error: profileError } = await supabaseClient
    .from('profiles')
    .select('id')
    .eq('supabase_user', user.id)
    .single();
  if (profileError || !profileData) {
    console.log('Profile not found ', profileError);
    return new Response(
      JSON.stringify({
        error: 'Profile not found',
      }),
      {
        status: 404,
      },
    );
  }

  console.log("profileData ",profileData)
  const { data: creditsData, error: creditsError } = await supabaseClient
    .from('ai_credits')
    .select('credits_remaining')
    .eq('user_id', profileData.id)
    .single();
  if (creditsError || !creditsData || creditsData.credits_remaining <= 0) {
    console.log('Insufficient credits ', creditsError);
    return new Response(
      JSON.stringify({
        error: 'Insufficient credits',
      }),
      {
        status: 403,
      },
    );
  }
  // Deduct one credit
  await supabaseClient
    .from('ai_credits')
    .update({
      credits_remaining: creditsData.credits_remaining - 1,
    })
    .eq('user_id', profileData.id);
  const { messages } = await req.json(); // Populate this with the actual messages
  const result = streamText({
    model: nim.chatModel('writer/palmyra-med-70b-32k'),
    system:
      "You are Aniima AI, your mental health companion. You are here to listen, support, and guide you through whatever you're experiencing. Do not give advice for crisis situations. Always refer to the user to a mental health professional.",
    messages,
    maxTokens: 500,
    temperature: 0.7,
  });
  return result.toDataStreamResponse();
});
