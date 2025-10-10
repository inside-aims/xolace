import type {Metadata} from "next";
import TalkSpace from "@/components/talk-space/talk-space";

export const metadata: Metadata = {
  title: 'Talk Space',
  description:
    'Connect with mentors, counselors, and therapists in a safe and supportive environment. Your space to talk, heal, and grow through meaningful conversations.'
};



export default function TalkSpacePage() {
  return(
    <main className={"flex items-center w-full"}>
      <TalkSpace/>
    </main>
  )
}