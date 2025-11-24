"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { VoiceButton, VoiceButtonState } from "@/components/ui/voice-button"
import { Mic } from "lucide-react"



interface VoiceInputProps {

  /**
   * Callback when transcription is complete
   */
  onTranscriptionComplete: (text: string) => void

  /**
   * Optional callback for errors
   */
  onError?: (error: string) => void

  /**
   * Disabled state
   */
  disabled?: boolean

  /**
   * Custom className for the button
   */
  className?: string

  /**
   * API endpoint for transcription
   * @default "/api/transcribe"
   */
  apiEndpoint?: string

  /**
   * Maximum recording duration in seconds
   * @default 120 (2 minutes)
   */
  maxDuration?: number
}

interface TranscriptionResult {
  text?: string
  error?: string
  transcriptionTime?: number
}

export function VoiceInput({ 
    onTranscriptionComplete, 
    disabled,
    apiEndpoint = "/api/v1/transcribe",
    onError,
    maxDuration = 120,
}: VoiceInputProps) {
  const [state, setState] = useState<VoiceButtonState>("idle")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const streamRef = useRef<MediaStream | null>(null)
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const cleanupStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current)
      recordingTimeoutRef.current = null
    }
  }, [])

  const processAudio = useCallback(
    async (audioBlob: Blob) => {
      setState("processing")

      try {
        const formData = new FormData()
        formData.append("audio", audioBlob, "recording.webm")

        const response = await fetch(apiEndpoint, {
          method: "POST",
          body: formData,
        })

        const data: TranscriptionResult = await response.json()

        if (!response.ok) {
          throw new Error(data.error || "Transcription failed")
        }

        if (data.text) {
          onTranscriptionComplete(data.text)
          setState("success")
        } else {
          // If no text returned (e.g. silence), just go back to idle
          setState("idle")
        }
      } catch (err) {
        console.error("Transcription error:", err)
        setState("error")
      }
    },
    [onTranscriptionComplete]
  )

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state !== "inactive") {
      mediaRecorderRef.current?.stop()
    }
    cleanupStream()
  }, [cleanupStream])

  const startRecording = useCallback(async () => {
    try {
      audioChunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      })
      streamRef.current = stream

      // Check for supported mime types
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm"

      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType })
        processAudio(audioBlob)
      }

      mediaRecorder.start()
      setState("recording")

      // Set max duration timeout
      if (maxDuration > 0) {
        recordingTimeoutRef.current = setTimeout(() => {
          stopRecording()
        }, maxDuration * 1000)
      }
    } catch (err) {
      const errorMessage = "Microphone permission denied"
      console.error("Microphone error:", err)
      onError?.(errorMessage)
      setState("error")
    }
  }, [processAudio, maxDuration, stopRecording])

  const handleToggleRecording = useCallback(() => {
    if (state === "recording") {
      stopRecording()
    } else {
      startRecording()
    }
  }, [state, startRecording, stopRecording])

  // Keyboard shortcut (Alt + Space)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "Space" && !disabled) {
        e.preventDefault()
        handleToggleRecording()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleToggleRecording, disabled])

  // Cleanup on unmount
  useEffect(() => {
    return cleanupStream
  }, [cleanupStream])

  return (
    <VoiceButton
      state={state}
      onClick={handleToggleRecording}
      disabled={disabled}
      size="icon"
      icon={<Mic className="size-4" />}
      className="size-9 shrink-0 bg-muted"
      variant="ghost"
      aria-label={
          state === "recording"
            ? "Stop recording"
            : "Start voice recording"
        }
    />
  )
}
