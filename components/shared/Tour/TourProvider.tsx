"use client"

import { useState, useEffect } from "react"
import Joyride, { type Step, type CallBackProps, STATUS } from "react-joyride"
import type React from "react" // Added import for React

interface TourProviderProps {
  children: React.ReactNode
  steps: Step[]
  startTour: boolean
  onTourEnd: () => void
}

export default function TourProvider({ children, steps, startTour, onTourEnd }: TourProviderProps) {
  const [run, setRun] = useState(false)

  useEffect(() => {
    if (startTour) {
      const timer = setTimeout(() => {
        setRun(true)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setRun(false)
    }
  }, [startTour])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      onTourEnd()
    }
  }

  return (
    <>
      <Joyride
        steps={steps}
        run={run}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      {children}
    </>
  )
}

