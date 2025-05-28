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
    <section className="responsive-container bg-ocean-400 -z-10 -mt-[5%] pt-[5%]">
      <div className={"relative w-full flex"}>

        {/*star image one*/}
        <div className={"absolute top-4 md:top-8 right-4 md:right-[10%]"}>
          <Image
            src="/assets/images/landing-page/star.png"
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
              src="/assets/images/landing-page/star.png"
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

          <div className="bg-[#1212122B] text-white flex flex-col items-center justify-center py-1 px-4 rounded-lg">
            <span>
              Social media today is crowded with noise and pressure.
            </span>
            <span>
              Xolace gives you a calm, anonymous corner to breathe, speak, and be heard.
            </span>
          </div>

          <div className={"w-full grid grid-cols-12 gap-8 mt-4 md:mt-18"}>
            { xolaceFeatures.map((feature) => (
              <div
                key={feature.key}
                className={"col-span-12 md:col-span-6 lg:col-span-4 h-[450px] bg-white rounded-t-lg shadow-md p-4 w-full flex flex-col items-center justify-start gap-8 "}>
                <h4 className={"items-center font-semibold text-lg uppercase"}> { feature.label } </h4>
                <p className={"text-center"}> { feature.description } </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
