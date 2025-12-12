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
console.log('user:', user);
  const apiKey = process.env.ASSEMBLY_API_KEY;
  if (!apiKey) {
    return NextResponse.error();
  }

  
  console.log('Processing lemur request...');
  const body = await request.json();

  const post = body?.post;


  if (!post) {
    return NextResponse.error();
  }

const finalPrompt = `
Analyze the emotional tone of the following post and respond with empathy in one short, natural-sounding sentence.

Your response must:
- Start with a brief acknowledgment of the detected emotion (e.g., “It sounds like you’re feeling sad” or “Feeling anxious is completely valid”).
- Then continue the same sentence with a comforting, human-like suggestion that fits the mood.
- The total response should sound like a caring friend who understands, not a therapist.
- Keep it under 300 characters.
- If the tone feels severely distressed (hopeless, suicidal, unsafe, despair, worthless, etc.), include a gentle reminder to reach out to a counselor or crisis line for support.
- If the tone is moderate, suggest community or peer support (like joining a Xolace Campfire, sharing with a mentor, or taking a small self-care step).
- Avoid clinical or diagnostic language.
- Do not label with “Emotion:” or “suggestion:” — just write the empathetic line directly.

Example formats (for inspiration):
- “It sounds like you’re feeling sad. Maybe opening up in a Campfire or sharing with a mentor could bring a little light.”
- “Feeling anxious is okay. Try breathing for a bit, and maybe talk about it in a support Campfire.”
- “It seems you’re feeling hopeless. Please consider reaching out to someone who can listen or a counselor for support.”

Now analyze and respond empathetically to this post:
`;



console.log('Sending request to AssemblyAI LLM Gateway...');
console.log('Post content:', post);
console.log('api key : ', process.env.ASSEMBLY_API_KEY);
const response = await fetch(
    "https://llm-gateway.assemblyai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        authorization: process.env.ASSEMBLY_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        messages: [
          {
            role: "user",
            content: `Analyze this post for emotional sentiment:\n\n${post}\n\n${finalPrompt}`,
          },
        ],
        max_tokens: 1000,
      }),
    }
  );
  const result = await response.json();
  console.log('LLM Response:', result.choices[0].message.content);

  return NextResponse.json({ response: result.choices[0].message.content, post: post });
}



/*
migrating to this 
import { AssemblyAI } from "assemblyai";
const client = new AssemblyAI({
  apiKey: "<YOUR_API_KEY>",
});
const run = async () => {
  // Step 1: Transcribe an audio file
  const audioFile = "https://assembly.ai/call.mp4";
  const transcript = await client.transcripts.transcribe({ audio: audioFile });
  // Step 2: Prepare for LLM Gateway
  const prompt = "What was the emotional sentiment of the phone call?";
  const response = await fetch(
    "https://llm-gateway.assemblyai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        authorization: "<YOUR_API_KEY>",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        messages: [
          {
            role: "user",
            content: `Analyze this phone call transcript for emotional sentiment:\n\n${transcript.text}\n\n${prompt}`,
          },
        ],
        max_tokens: 1000,
      }),
    }
  );
  const result = await response.json();
  console.log(result.choices[0].message.content);
};
run();

*/