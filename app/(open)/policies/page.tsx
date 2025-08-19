import type { Metadata } from "next"
import PoliciesPage from "@/components/hocs/policiesComponents/policesPage"

export const metadata: Metadata = {
  title: 'Policies',
  description: "Xolace policies, rules and guidelines for campers, moderators, mentors and professionals."
}

export default function Policies() {
  return (
      <PoliciesPage />
  )
}