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

  const finalPrompt = `Analyze the emotional tone of the following post and respond with empathy in one short sentence.

Your response must:
- Start with the detected emotion in one word (e.g., sad, hopeful, anxious, calm).
- Then provide one warm, human-like comfort phrase and a specific supportive suggestion.
- The entire sentence (comfort + suggestion) must begin with "suggestion:".
- Keep the total response under 300 characters.
- If the tone feels severely distressed, gently suggest connecting with a mental health professional (not therapy).
- If the detected emotion matches any of these severe tokens (case-insensitive): hopeless, suicidal, unsafe, despair, worthless or others similar to these, the suggestion MUST include a subtle recommendation to consider contacting a mental health professional or a crisis line (phrase it gently, e.g., "please consider reaching out to a counselor or crisis line for immediate support").
- If the tone is moderate, guide them toward Xolace Campfires(campfires have different purposes such as creative outlet, support circle, growth group, general discussion) , mentors for community support or peer support when appropriate.
- Avoid clinical or diagnostic language.
- Sound like a caring friend who understands, not a therapist.

Example formats(these are just example formats , you can always structure it as you see fit):
- Emotion: sad | suggestion: That sounds really heavy, you’re not alone in this. Maybe opening up in a Campfire or chatting with a mentor could help.  
- Emotion: anxious | suggestion: You’ve got a lot on your mind, breathe for a bit, and maybe share with others in a Campfire who feel the same.  
- Emotion: hopeless | suggestion: It sounds like you’re really struggling, please consider reaching out to a counselor or someone who can listen.  
`;

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
