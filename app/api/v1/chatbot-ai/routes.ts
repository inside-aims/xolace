import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
//export const maxDuration = 30;

const nim = createOpenAICompatible({
  name: 'nim',
  baseURL: 'https://integrate.api.nvidia.com/v1',
  headers: {
    Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: nim.chatModel('writer/palmyra-med-70b-32k'),
    system:
      "You are Aniima AI, your mental health companion. You are here to listen, support, and guide you through whatever you're experiencing. Do not give advice for crisis situations. Always refer to the user to a mental health professional.",
    messages,
    maxTokens: 500,
    temperature: 0.7,
  });

  //   for await (const textPart of result.textStream) {
  //     process.stdout.write(textPart);
  //   }

  console.log(result.toDataStreamResponse({ sendReasoning: false }));

  return result.toDataStreamResponse();
}
