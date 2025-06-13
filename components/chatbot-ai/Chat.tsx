"use client";

import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { readStreamableValue } from "ai/rsc";
import { continueConversation, type ChatMessage } from "@/app/api/v1/chatbot-ai/route";
import { Send, MessageCircle } from "lucide-react";
import {useUserState} from "@/lib/store/user";

export default function Chat() {
  const user = useUserState(state => state.user);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { content: input, role: "user" };
    const newMessages = [...messages, userMessage];

    setMessages([...newMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsLoading(true);

    const result = await continueConversation(newMessages);

    for await (const content of readStreamableValue(result)) {
      if (content) {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content };
          return updated;
        });
      }
    }
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isEnter = e.key === "Enter";
    const isComposing = e.nativeEvent.isComposing;
    const isShiftHeld = e.shiftKey;

    if (isEnter && !isShiftHeld && !isComposing) {
      e.preventDefault();
      if (input.trim().length > 0) {
        handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>).then();
      }
    }
  };

  return (
    <div className={`w-full ${messages.length > 0 && "h-[500px]"} flex flex-col border rounded-xl shadow-lg overflow-hidden`}>
      {
        messages.length > 0 ? (
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map((m, i) => (
              <div key={i} className={`mb-4 flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-md p-2 rounded-lg ${
                  m.role === "user"
                    ? "bg-ocean-400 text-white  rounded-br-none"
                    : "bg-neutral-100 text-neutral-800 rounded-bl-none"
                }`}>
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-neutral-100 rounded-lg p-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                      style={{animationDelay: '0.1s'}}
                    >
                    </div>
                    <div
                      className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                      style={{animationDelay: '0.2s'}}>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef}/>
          </div>
        ): (
          <div
            className="flex text-lg font-semibold p-4 items-center text-neutral-400 justify-center"
          >
            {`Good evening, ${user?.username} !`}
          </div>
        )
      }
      <form onSubmit={handleSubmit} className="p-4">
        <div className="relative">
          <textarea
            className="w-full p-4 border rounded-lg resize-none"
            rows={1}
            value={input}
            placeholder="Ask me anything..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            onKeyDown={handleKeyDown}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute bottom-3 right-3 w-8 h-8 bg-blue-500 text-white rounded-full disabled:opacity-50 flex items-center justify-center"
          >
            {input.trim() ? <Send size={16}/> : <MessageCircle size={16}/>}
          </button>
        </div>
      </form>
    </div>
  );
}