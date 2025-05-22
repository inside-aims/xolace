'use client';

import {Info, Cross, CircleArrowRight, MoveLeft} from 'lucide-react';
import {Button} from '@/components/ui/button'
import React, {useState} from "react";
import { useRouter } from 'next/navigation';

interface HealthTipCardProps {
  id: string;
  title: string;
  author: string;
  content: string | string[];
  date: string;
  index?: number;
  total?: number
  onHealthTipSelect?: (healthTipId: string) => void;
}

// dummy health tips data
const healthTips: HealthTipCardProps[] = [
  {
    id: '1',
    title: 'Coping With Anxiety in Isolation',
    author: 'Dr. Sarah Mensah',
    content: [
      'Anxiety during isolation is a common struggle that many individuals face. The lack of social interaction can heighten feelings of loneliness and uncertainty.',
      'To manage this, acknowledge your emotions without judgment. It’s okay to feel overwhelmed — acceptance is the first step toward healing.',
      'Establishing a daily routine can help regain a sense of control. Set fixed wake-up and sleep times, eat balanced meals, and schedule intentional breaks.',
      'Stay mentally active. Read books, solve puzzles, or try learning a new skill — cognitive engagement boosts your mood and reduces rumination.',
      'Don’t underestimate the value of movement. A short walk, stretching, or a quick dance session can release endorphins and reduce stress.',
      'Digital connections matter. Schedule regular virtual catch-ups with family or join online support groups to avoid complete social withdrawal.',
      'Incorporate grounding techniques — like focusing on your breath or naming five things you see — to calm your mind during anxiety spikes.',
      'Lastly, speak kindly to yourself. You’re not failing for feeling anxious. Progress isn’t linear, and every effort counts.'
    ],
    date: '2025-05-20',
  },
  {
    id: '2',
    title: 'Daily Breathing Exercises for Calm',
    author: 'Dr. Kwame Boateng',
    content: [
      'Breathing exercises are accessible tools to reset your body’s stress response, offering a natural path to calm and balance.',
      'Start with diaphragmatic breathing. Lie down, place one hand on your chest and another on your belly. Breathe deeply and slowly so only your belly rises.',
      'Practice this for 5–10 minutes daily. Over time, it can lower blood pressure and reduce chronic anxiety symptoms.',
      'Box breathing is another effective method — inhale for 4 counts, hold for 4, exhale for 4, and pause for 4. Repeat this cycle for several minutes.',
      'Use breathing as a mindfulness anchor. When your thoughts wander, gently return to the rhythm of your breath without judgment.',
      'Breathwork isn’t only for mornings — it’s perfect before stressful meetings, during traffic, or when falling asleep.',
      'Pair your breathing practice with calming music or ambient nature sounds to enhance the effect.',
      'As you continue, note how your body responds. The more consistent your practice, the easier it becomes to enter a state of calm quickly.'
    ],
    date: '2025-12-18',
  },
  {
    id: '3',
    title: 'Benefits of Mindful Journaling',
    author: 'Dr. Linda Owusu',
    content: [
      'Mindful journaling invites us to observe our inner world with curiosity and compassion, helping us process emotions and find clarity.',
      'Start with simple prompts like “What emotions am I feeling right now?” or “What drained or energized me today?”',
      'Journaling is most effective when done consistently. Set a timer for 10–15 minutes and allow your thoughts to spill without censorship.',
      'Use it as a tool to track your personal growth, highlight recurring thought patterns, or identify emotional triggers.',
      'It can serve as an emotional outlet, reducing the mental clutter that contributes to stress and anxiety.',
      'Over time, you may notice more gratitude, resilience, and emotional intelligence emerging through your entries.',
      'You don’t have to write daily. Even two or three times a week can offer benefits. Just be intentional when you do.',
      'Finally, treat your journal as a safe space. There’s no right or wrong — only your authentic self, expressed freely.',
      'Mindful journaling invites us to observe our inner world with curiosity and compassion, helping us process emotions and find clarity.',
      'Start with simple prompts like “What emotions am I feeling right now?” or “What drained or energized me today?”',
      'Journaling is most effective when done consistently. Set a timer for 10–15 minutes and allow your thoughts to spill without censorship.',
      'Use it as a tool to track your personal growth, highlight recurring thought patterns, or identify emotional triggers.',
      'It can serve as an emotional outlet, reducing the mental clutter that contributes to stress and anxiety.',
      'Over time, you may notice more gratitude, resilience, and emotional intelligence emerging through your entries.',
      'You don’t have to write daily. Even two or three times a week can offer benefits. Just be intentional when you do.',
      'Finally, treat your journal as a safe space. There’s no right or wrong — only your authentic self, expressed freely.',
    ],
    date: '2025-10-17',
  },
];



export default function HealthTips() {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [healthTipDetails, setHealthTipDetails] = useState<HealthTipCardProps>()
  const router = useRouter();

  // Helper for health tip click to read more
  const handleHealthClick = (healthTipId: string) => {
    const selectTip = healthTips.find((tip) => tip.id === healthTipId);
    if (selectTip) {
      setHealthTipDetails(selectTip)
      setShowDetails(!showDetails);
    }
  }

  // Handle health tips route navigation
  const handleHealthTipsNavigation = () => {
    return router.push('/health-tips');
  }

  return (
   <>
     <div className={"w-full flex flex-col"}>
       <div className={`${!showDetails ? 'flex flex-col w-full md:px-4 gap-4' : 'hidden'}`}>
         {/*Xolace wellness section*/}
         <div className="flex flex-col gap-2  py-2 md:py-4 items-start border shadow-lg rounded-xl">
           <h4 className="w-full flex justify-between items-center  px-2 md:px-4 text-neutral-500 ">
          <span className={"font-semibold"}>
            Xolace Wellness Insights
          </span>
             <Cross size={18}/>
           </h4>
           <div className={"flex flex-col items-center gap-2 text-sm"}>
             <p className={"flex ps-2 md:px-4 "}>
               Practical health tips and trusted advice to help you thrive mind and body.
             </p>
             <p className={"flex ms-2 md:ms-4  border-t py-1 md:py-2"}>
               Backed by experts, tailored for your everyday wellbeing.
             </p>
             <div className={"w-full py-2 flex items-center justify-center md:hidden border-t"}>
               <Button
                 className={"w-full mx-8 bg-lavender-400 hover:bg-lavender-500 rounded-full transition-transform duration-300 ease-in-out hover:scale-110"}
                 onClick={() => handleHealthTipsNavigation()}
               >
                 View Health Tips
               </Button>
             </div>
           </div>
         </div>

         {/*Filtered health tips little info on desktop device only*/}
         <div className="hidden md:flex flex-col gap-2 md:gap-6 py-2 md:py-4 items-start border shadow-lg rounded-xl">
           <h4 className="w-full flex justify-between items-center px-2 md:px-4 text-neutral-500">
             <span className={"font-semibold"}>Health Tips</span>
             <Info size={22}/>
           </h4>

           <div className="flex flex-col gap-4 md:gap-6 ps-2 md:ps-4 w-full">
             { healthTips.map((healthTip, index) => (
               <div
                 key={healthTip.id}
                 className={`${index > 0 ? 'hidden md:block ' : 'block'}`}
               >
                 <HealthTipCard
                   id={healthTip.id}
                   title={healthTip.title}
                   author={healthTip.author}
                   content={healthTip.content}
                   date={healthTip.date}
                   index={index}
                   total={healthTips.length}
                   onHealthTipSelect={() => handleHealthClick(healthTip.id)}
                 />
               </div>
             ))}
           </div>
           <div className={"border-t w-full flex items-center justify-center"}>
             <Button
               variant="link"
               className={"flex text-lavender-400 hover:lavender-500"}
               onClick={() => handleHealthTipsNavigation()}
             >
                See More Tips
               <span className={"text-lavender-400 hover:lavender-500 ml-1"}>
                 <CircleArrowRight size={16}/>
               </span>
             </Button>
           </div>
         </div>
       </div>

       {/*health tips details on desktop */}
       <div className={`${showDetails ? 'hidden w-full md:flex flex-col gap-4 items-start py-2 px-4' : 'hidden'}`}>
         <button
           className={"flex flex-row items-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-900"}
           onClick={() => setShowDetails(false)}
         >
           <MoveLeft size={20}/>
         </button>
         <div className={"flex flex-col items-center"}>
           <HealthTipDetailsCard
             id={healthTipDetails?.id || ''}
             title={healthTipDetails?.title || ''}
             author={healthTipDetails?.author || ''}
             content={healthTipDetails?.content || ''}
             date={healthTipDetails?.date || ''}
           />
         </div>
       </div>
     </div>
   </>
  );
}

// Health tip card component
export function HealthTipCard({id, title, author, total, index, date, onHealthTipSelect}: HealthTipCardProps) {
  return (
    <div className="flex flex-row gap-2 md:gap-4 items-start">
        <p
          className="h-6 md:h-8 w-6 md:w-8 border bg-neutral-500 text-white font-bold flex items-center justify-center rounded-full text-xs md:text-lg">
          {author[0]}
        </p>
        <div className="w-full items-start flex flex-col">
          <p className="text-sm pe-2 md:pe-4">{title}</p>
          <h3 className="w-full flex items-center justify-between text-sm text-neutral-500 pe-2 md:pe-4 mb-1">
            <span>
            {`${author}`} — {new Date(date).toLocaleDateString("en-US", {
              month: 'short', year: 'numeric'
            })}
          </span>
          </h3>
          <button
            className="bg-linear-to-b from-lavender-500/70 to-lavender-200/30 dark:from-lavender-700/70 dark:to-lavender-500/40 border border-lavender-500/10 dark:border-white/30 rounded-full backdrop-blur-md text-black dark:text-white px-5 py-2 text-sm transition duration-500 hover:from-lavender-300/80 hover:to-lavender-200/40 dark:hover:from-lavender-600/80 dark:hover:to-lavender-500/40 cursor-pointer"
            onClick={() => onHealthTipSelect && onHealthTipSelect(id)}
          >
            See more
          </button>
          {index !== undefined && total !== undefined && index < total - 1 && (
            <p className="hidden md:flex w-full border-b py-2 "></p>
          )}
        </div>
      </div>
  );
}

// Health tip card component details page
export function HealthTipDetailsCard(props: HealthTipCardProps){
  return(
    <div className={"flex w-full flex-col gap-4"} key={props?.id}>
      <div className={"w-full flex flex-col items-start"}>
        <h4 className={"font-semibold text-lg"}>
          {props?.title}
        </h4>
        <p className={"flex flex-row gap-2 text-sm text-neutral-400"}>
          <span>
            {`${props?.author}`} — { new Date(props?.date).toLocaleDateString("en-US", {
              month: 'short', year: 'numeric' })}
          </span>
        </p>
      </div>
      <div className={"text-neutral-600"}>
        { Array.isArray(props.content) ? (
          props.content.map((para, idx) => (
            <p key={idx} className="mb-2">{para}</p>
          ))
        ) : (
          <p>{props.content}</p>
        )}
      </div>

    </div>
  )
}
