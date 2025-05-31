import Image from "next/image";

const xolaceFeatures: {key: string, label: string, description: string}[] = [
  {
    key: 'anonymityFirst',
    label: 'Anonymity First',
    description: 'Express yourself without fear of being identified.'
  },
  {
    key: 'emotionBaseReactions',
    label: 'Emotion-Based Reactions',
    description: 'Express yourself without fear of being identified.'
  },
  {
    key: 'focusedFeed',
    label: 'Focused Feed',
    description: 'Express yourself without fear of being identified.'
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
            className="relative flex items-center justify-center text-white text-3xl md:text-5xl font-bold uppercase">
            Why xolace?
            <span className={"absolute -left-[30%] md:-left-[90%] -bottom-10"}>
            <Image
              src="/assets/images/landing-page/star.webp"
              alt="Hero Image"
              width={80}
              height={80}
              className="object-cover"
            />
          </span>
            <span className={"absolute -top-[200%] left-[5%]"}>
            <Image
              src="/assets/images/landing-page/square-star.png"
              alt="Hero Image"
              width={120}
              height={120}
              className="object-cover"
            />
          </span>
          </div>

          <div className="bg-[#1212122B] text-md md:text-lg text-white flex flex-col items-center justify-center py-1 px-4 rounded-lg">
            <span>
              Social media today is crowded with noise and pressure.
            </span>
            <span>
              Xolace gives you a calm, anonymous corner to breathe, speak, and be heard.
            </span>
          </div>

          <div className={"items-center grid grid-cols-12 gap-8 my-8 md:mt-18 mx-6 md:mx-0 text-black"}>
            { xolaceFeatures.map((feature) => (
              <div
                key={feature.key}
                className={"col-span-12 md:col-span-6 lg:col-span-4 h-[328px] w-full bg-white rounded-4xl md:rounded-t-4xl shadow-md p-4 flex flex-col items-center justify-start gap-8 "}>
                <h4 className={"items-center text-center font-bold text-lg uppercase md:text-2xl"}> { feature.label } </h4>
                <p className={"text-center text-md md:text-lg"}> { feature.description } </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
