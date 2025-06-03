import Image from "next/image";

const xolaceFeatures: {key: string, label: string, description: string , description2?: string, isQuote?: boolean}[] = [
  {
    key: 'anonymityFirst',
    label: 'You’re Not Alone',
    description: "Hear from people just like you — not as influencers, not as celebrities — real voices navigating life's highs and lows.",
    description2: "Behind every 'I’m fine' is a story waiting to be heard. Xolace is where those stories meet understanding ears—from peers who get it to professionals who care."
  },
  {
    key: 'emotionBaseReactions',
    label: 'Care Without Walls ',
    description: 'Mental health professionals walk beside you, not above you. They engage openly—sharing free advice and offering dedicated help when needed.',
    description2: "Therapy should feel like a natural next step—not a clinical obligation. - Xolace",
    isQuote: true
  },
  {
    key: 'focusedFeed',
    label: 'Light in the Dark',
    description: 'Because healing isn’t just about pain—it’s about joy too. Share funny stories, celebrate small wins, and be the reason someone smiles today. Here, every emotion belongs.',
    description2: "Real people, real stories—building real support"
  },
]
export default function WhyXolaceSection() {
  return (
    <section id={"why-xolace"} className="responsive-container bg-ocean-400 -z-10 -mt-[5%] pt-[5%]">
      <div className={"relative w-full flex"}>

        {/*star image one*/}
        <div className={"absolute top-4 md:top-8 right-4 md:right-[10%]"}>
          <Image
            src="/assets/images/landing-page/star.webp"
            alt="Hero Image"
            width={100}
            height={100}
            className="object-cover"
          />
        </div>

        {/*First div section*/}
        <div className="w-full flex flex-col items-center justify-center gap-8 mt-[6%] relative">
          <div
            className="relative flex items-center justify-center text-white text-4xl md:text-6xl font-bold uppercase">
            Why xolace?
            <span className={"absolute -left-[30%] md:-left-[90%] -bottom-10"}>
            <Image
              src="/assets/images/landing-page/star.webp"
              alt="Hero Image"
              width={80}
              height={80}
              className="object-cover"
              loading="lazy"
            />
          </span>
            <span className={"absolute -top-[200%] left-[5%]"}>
            <Image
              src="/assets/images/landing-page/square-star.png"
              alt="Hero Image"
              width={120}
              height={120}
              className="object-cover"
              loading="lazy"
            />
          </span>
          </div>

          <div className="bg-[#1212122B] text-md md:text-lg text-white flex flex-col items-center justify-center py-1 px-4 rounded-lg">
            <span>
              Social media today is crowded with noise and pressure.
            </span>
            <span>
            Everyone has a story. Some need to be heard, others need to be told. 
            </span>
          </div>

          <div className={"items-center grid grid-cols-12 gap-8 my-8 md:mt-18 mx-6 md:mx-0 text-black"}>
            { xolaceFeatures.map((feature) => (
              <div
                key={feature.key}
                className={"col-span-12 md:col-span-6 lg:col-span-4 h-[328px] w-full bg-white rounded-4xl md:rounded-t-4xl shadow-md p-4 flex flex-col items-center justify-start gap-6 "}>
                <h4 className={"items-center text-center font-bold text-2xl uppercase md:text-3xl"}> { feature.label } </h4>
                <p className={"text-center text-lg md:text-xl"}> { feature.description } </p>
                { feature.description2 && feature.isQuote ?  <blockquote className="mt-6 border-l-2 pl-6 italic text-sm"> { feature.description2 } </blockquote> : <p className={"text-center text-[15px] md:text-[16px]"}> { feature.description2 } </p> }
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
