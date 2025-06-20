"use server";

import { createStreamableValue } from "ai/rsc";

export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export async function continueConversation(messages: ChatMessage[]) {
  const stream = createStreamableValue("");

  const response = await fetch("https://integrate.api.nvidia.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.NVIDIA_NIM_API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemma-2-9b-it",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
      stream: true,
    }),
  });

  if (!response.ok || !response.body) {
    stream.update("Error: Failed to get response");
    stream.done();
    return stream.value;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  await (async () => {
    let fullContent = "";

    while (true) {
      const {done, value} = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, {stream: true});
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.startsWith('data: ') && !line.includes('[DONE]')) {
          try {
            const data = JSON.parse(line.slice(6));
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              fullContent += content;
              stream.update(fullContent);
            }
          } catch {
          }
        }
      }
    }
    stream.done();
  })();

  return stream.value;
}