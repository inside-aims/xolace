/* utils/useChatDummy.ts */
import { useState, useCallback } from 'react'

type Message = { id: string, content: string, role: 'user' | 'assistant' }

type UseChatReturn = {
  messages: Message[]
  input: string
  setInput: (text: string) => void
  handleSubmit: () => void
  status: 'idle' | 'streaming' | 'submitted'
  error: Error | null
  reload: () => void
  stop: () => void
  api?: string
}

export function useChatDummy({ initialMessages = [], api }: { initialMessages?: Message[], api?: string } = {}): UseChatReturn {
    console.log("useChatDummy", api)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState<string>('')
  const [status, setStatus] = useState<'idle'|'streaming'|'submitted'>('idle')
  const [error, setError] = useState<Error | null>(null)

  const handleSubmit = useCallback(() => {
    if (!input.trim()) return
    setStatus('submitted')
    // echo user message and a dummy assistant reply
    const userMsg: Message = { id: Date.now().toString(), content: input, role: 'user' }
    const botMsg: Message = { id: (Date.now()+1).toString(), content: "[Dummy reply] You said: " + input, role: 'assistant' }
    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
    setStatus('idle')
  }, [input])

  const reload = useCallback(() => {
    setError(null)
    setStatus('idle')
  }, [])

  const stop = useCallback(() => {
    // No-op for dummy
    setStatus('idle')
  }, [])

  return { messages, input, setInput, handleSubmit, status, error, reload, stop }
}
