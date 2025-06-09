import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
//import { corsHeaders } from "../_share/cors";



Deno.serve(async (req)=>{
  console.log("starting ")
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const supabaseClient = createClient( 
    "http://127.0.0.1:54321",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0", {
      global: {
        headers: {  
          Authorization: req.headers.get('Authorization')
        }
      }
    });
    const body = await req.json()
    // const body = await req.text();
    // console.log('Raw body:', body);
    // console.log(req)

    console.log("body ", body)

    const { title, content, tags = [] } = body;
    console.log("title ", title)
    console.log("content ", content)
    console.log("tags ", tags)

    
    // Validate input
    if (!title || !content) {
      return new Response(JSON.stringify({
        error: 'Title and content are required.'
      }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 400
      });
    }
    // Get the user ID from the auth context
    const token = req.headers.get('Authorization')?.replace('Bearer ', '');
    console.log("token ", token)
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    console.log("user ", user, userError)
    if (userError || !user) {
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 401
      });
    }
    // Check if the user is a verified health professional
    const { data: profile, error: profileError } = await supabaseClient.from('profiles').select('id, role').eq('supabase_user', user.id).single();
    if (profileError || !profile || profile.role !== 'help_professional') {
      return new Response(JSON.stringify({
        error: 'User is not a verified health professional.'
      }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 403
      });
    }
    // Insert the health tip
    const { data: healthTip, error: insertError } = await supabaseClient.from('health_tips').insert({
      title,
      content,
      is_sponsored: false,
      created_by: profile.id,
      author_name: profile.username,
      author_avatar_url: profile.avatar_url,
      is_approved: false,
    }).select();
    if (insertError) {
      return new Response(JSON.stringify({
        error: insertError.message
      }), {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
        },
        status: 500
      });
    }

    const { error } = await supabaseClient.rpc('upsert_tags_and_relationships', {
      tag_names: tags, 
      tips_id: healthTip.id  // Make sure healthTip.id is bigint
    }); 

    console.log(error)
    return new Response(JSON.stringify(healthTip), {
      status: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: error.message
    }), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
      status: 500,
    });
  }
});

