import type {Metadata} from "next";
import MentorsListings from "@/components/talk-space/mentor/mentors-listings";

export const metadata: Metadata = {
  title: 'Browse Mentors',
  description:
    'Connect with mentors in a safe and supportive environment. Your space to talk, heal, and grow through meaningful conversations.'
};


export default function Mentors(){
  return(
    <main>
      <MentorsListings/>
    </main>
  )
}