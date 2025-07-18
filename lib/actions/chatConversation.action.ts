"use server"

import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { streamText } from 'ai';


export type ChatMessage = {
    role: 'user' | 'assistant';
    content: string;
  };
  
 export const chatConversation = async () => {
    const nim = createOpenAICompatible({
        name: 'nim',
        baseURL: 'https://integrate.api.nvidia.com/v1',
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
        },
      });
      
      const result = streamText({
        model: nim.chatModel('deepseek-ai/deepseek-r1'),
        prompt: 'Tell me the history of the Northern White Rhino.',
        maxTokens: 500,
        temperature: 0.7,
      });
      
      for await (const textPart of result.textStream) {
        process.stdout.write(textPart);
      }
      
}

