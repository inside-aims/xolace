import Link from 'next/link';
import { Info, Cross} from 'lucide-react';
import {Button} from '@/components/ui/button'

interface HealthTipCardProps {
  id: string;
  title: string;
  author: string;
  content: string;
  date: string;
  index?: number;
  total?: number
}

const healthTips: HealthTipCardProps[] = [
  {
    id: '1',
    title: 'Coping With Anxiety in Isolation',
    author: 'Dr. Sarah Mensah',
    content: 'Many people face anxiety when they feel alone. In this guide, we will walk through ways to embrace solitude...',
    date: '2025-05-20',
  },
  {
    id: '2',
    title: 'Daily Breathing Exercises for Calm',
    author: 'Dr. Kwame Boateng',
    content: 'Simple breathing exercises can significantly reduce stress. Practice these for 5 minutes daily...',
    date: '2025-12-18',
  },
  {
    id: '3',
    title: 'Benefits of Mindful Journaling',
    author: 'Dr. Linda Owusu',
    content: 'Journaling is a tool for self-reflection and emotional processing. Learn how to start a mindful journal...',
    date: '2025-10-17',
  },
  // {
  //   id: '4',
  //   title: 'Hydration and Mental Clarity',
  //   author: 'Dr. Henry Osei',
  //   content: 'Dehydration can affect mood and focus. Discover the importance of regular water intake...',
  //   date: '2025-08-15',
  // },
];

export default function HealthTips() {
  return (
    <div className="flex flex-col w-full md:px-4 gap-4">
      <div className="flex flex-col gap-2  py-2 md:py-4 items-start border shadow-lg rounded-xl">
        <h4 className="w-full flex justify-between items-center  px-2 md:px-4 ">
          <span className={"font-semibold"}>
            Xolace Wellness Insights
          </span>
          <Cross size={18}/>
        </h4>
        <div className={"flex flex-col items-center gap-2"}>
          <p className={"flex ps-2 md:px-4 "}>
            Practical health tips and trusted advice to help you thrive mind and body.
          </p>
          <p className={"flex ms-2 md:ms-4  border-t py-1 md:py-2"}>
            Backed by experts, tailored for your everyday wellbeing.
          </p>
          <div className={"w-full py-2 flex items-center justify-center md:hidden border-t"}>
            <Button
              className={"w-full mx-8 bg-lavender-400 hover:bg-lavender-500 rounded-full transition-transform duration-300 ease-in-out hover:scale-110"}
            >
              View Health Tips
            </Button>
          </div>
        </div>
      </div>

      <div className="hidden md:flex flex-col gap-2 md:gap-4 py-2 md:py-4 items-start border shadow-lg rounded-xl">
        <h4 className="w-full flex justify-between items-center px-2 md:px-4">
          <span className={"font-semibold"}>Health Tips</span>
          <Info size={22}/>
        </h4>

        <div className="flex flex-col gap-4 md:gap-4 ps-2 md:ps-4 w-full">
          {healthTips.map((healthTip, index) => (
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
              />
            </div>
          ))}
        </div>
        <div className={"border-t w-full flex items-center justify-center"}>
          <Button
            variant="link"
          >
            See more tips
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HealthTipCard({id, title, author, total, index, date}: HealthTipCardProps) {
  return (
    <Link href={`/health-tips/${id}`} className="w-full block">
      <div className="flex flex-row gap-2 md:gap-4 items-start">
        <p className="h-6 md:h-8 w-6 md:w-8 border bg-neutral-500 text-white font-bold flex items-center justify-center rounded-full text-xs md:text-lg">
          {author[0]}
        </p>
        <div className="w-full items-start flex flex-col">
          <p className="font-semibold text-sm pe-2 md:pe-4">{title}</p>
          <h3 className="w-full flex items-center justify-between text-sm text-neutral-500 pe-2 md:pe-4">
            <span className={""}>{author}</span>
            <span className={"text-xs"}>{
              new Date(date).toLocaleDateString("en-US", {
                month: 'short',
                year: 'numeric'
              })
            }</span>
          </h3>
          <Button
            variant={'outline'}
            className={"rounded-full"}
          >
            Read more
          </Button>
          {index !== undefined && total !== undefined && index < total - 1 && (
            <p className="hidden md:flex w-full border-b py-2 "></p>
          )}
        </div>
      </div>
    </Link>
  );
}
