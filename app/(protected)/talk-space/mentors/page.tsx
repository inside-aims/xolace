import type {Metadata} from "next";
import MentorsPage from "@/components/talk-space/mentors-page";

export const metadata: Metadata = {
  title: 'Browse Mentors',
  description:
    'Connect with mentors in a safe and supportive environment. Your space to talk, heal, and grow through meaningful conversations.'
};


export default function Mentors(){
  return(
    <main>
      <MentorsPage/>
    </main>
  )
}