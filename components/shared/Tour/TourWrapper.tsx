// "use client"

// import { useState } from "react"
// import type { Step } from "react-joyride"
// import TourProvider from "./TourProvider"
// import TourButton from "./TourButton"
// import type React from "react" // Added import for React

// interface PageWrapperProps {
//   children: React.ReactNode
//   steps: Step[]
// }

// export default function TourWrapper({ children, steps }: PageWrapperProps) {
//   const [startTour, setStartTour] = useState(false)

//   const handleStartTour = () => {
//     setStartTour(true)
//   }

//   const handleTourEnd = () => {
//     setStartTour(false)
//   }

//   return (
//     <TourProvider steps={steps} startTour={startTour} onTourEnd={handleTourEnd}>
//       {children}
//       <TourButton onStartTour={handleStartTour} />
//     </TourProvider>
//   )
// }

