import Image from "next/image";

const howItWorks: {key: string, label: string, description: string}[] = [
  {
    key: 'speak',
    label: 'Speak',
    description: 'Post your thoughts anonymously or with your profile — be as open as you choose. Set content to expire or stay forever. This is your space, your rules.'
  },
  {
    key: 'connect',
    label: 'Connect',
    description: 'Get responses from both community members and verified professionals. No hierarchies—just shared humanity. Know that every interaction builds someone up'
  },
  {
    key: 'grow',
    label: 'Grow',
    description: 'Daily prompts gently nudge self-reflection, community votes foster connection, and streaks reward showing up—exactly as you are'
  },
  {
    key: 'heal',
    label: 'Heal',
    description: 'Need more? Seamless transition to paid sessions if needed, with professionals you already trust from the community'
  },
];

export default function HowItWorksSection() {
  return (
    <section id={"how-it-works"} className="responsive-container bg-[#272829] z-30 -mt-[5%] py-[5%] rounded-4xl">
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
        <div className="w-full flex flex-col items-center md:items-start justify-center gap-8 my-[4%] relative">
          <div
            className="relative flex flex-col items-center md:items-start text-white text-3xl md:text-5xl font-bold uppercase">
            <span className="w-full text-center md:text-left">How it works</span>

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

          <div className={"grid grid-cols-12 gap-8 mt-8 md:mt-18 mx-6 md:mx-0 text-black"}>
            {howItWorks.map((feature, index) => (
              <div
                key={feature.key}
                className={"col-span-12 md:col-span-6 lg:col-span-3 h-[320px] bg-white rounded-2xl shadow-md p-4 w-full flex flex-col items-center justify-start gap-8 "}>
                <div className={"flex flex-col items-center justify-center font-bold text-2xl uppercase"}>
                  <h3 className={"text-4xl"}>
                    { index + 1 }
                  </h3>
                  <h4 className={"text-center"}>
                    { feature.label }
                  </h4>
                </div>
                <p className={"text-center  text-lg md:text-xl"}> {feature.description} </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}