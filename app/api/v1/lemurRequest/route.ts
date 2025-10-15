import { createClient } from '@/utils/supabase/server';
import { AssemblyAI } from 'assemblyai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: ClaimsData, error: ClaimsError } =
    await supabase.auth.getClaims();
  const user = ClaimsData?.claims?.sub;


  if (ClaimsError || !user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

  const apiKey = process.env.ASSEMBLY_API_KEY;
  console.log('apiKey : ', apiKey);
  if (!apiKey) {
    return NextResponse.error();
  }

  const client = new AssemblyAI({ apiKey: apiKey });
  const body = await request.json();

  console.log('body : ', body);

  const post = body?.post;

  console.log('post : ', post);

  if (!post) {
    return NextResponse.error();
  }

  const finalPrompt = `What was the emotional sentiment of the post in one word? and a wording to initiate conversation with user , and suggest therapy if needed or words of comfort. prefix your suggestion with 'suggestion: '`;

  const lemurResponse = await client.lemur.task({
    prompt: finalPrompt,
    input_text: post,
    // TODO: For now we just give some context, but here we could add the actual meeting text.
    final_model: 'anthropic/claude-3-5-sonnet',
  });

  const response = {
    prompt: post,
    response: lemurResponse.response,
  };

  console.log('response : ', response);
  return NextResponse.json(response);
}
