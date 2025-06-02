'use client'
 
import { useLinkStatus } from 'next/link'
import { ChatBubblesSpinner } from './ChatBubbleSpinner'
 
export default function LinkLoadingIndicator() {
  const { pending } = useLinkStatus()
  return pending ? (
    <ChatBubblesSpinner size={25}/>
  ) : null
}