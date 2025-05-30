import Image from "next/image";

const howItWorks: {key: string, label: string, description: string}[] = [
  {
    key: 'signUp',
    label: 'Sign up',
    description: 'Join anonymously in seconds. No pressure, just presence. A safe start for open minds.'
  },
  {
    key: 'postFreely',
    label: 'Post Freely',
    description: 'Share thoughts, fears, or joys without judgment. Venting and vulnerability meet a listening community.'
  },
  {
    key: 'reactEmotionally',
    label: 'React Emotionally',
    description: 'Respond with emojis that reflect your mood. A lightweight way to feel seen and heard.'
  },
  {
    key: 'echoEngage',
    label: 'Echo & Engage',
    description: 'Re-post what resonates. Help others realize they’re not alone in their thoughts or struggles.'
  },
];

export default function HowItWorksSection() {
  return (
    <section id={"how-it-works"} className="responsive-container bg-[#272829] z-30 -mt-[5%] py-[5%] rounded-4xl">
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

          <div className={"grid grid-cols-12 gap-8 mt-8 md:mt-18 mx-6 md:mx-0"}>
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
                <p className={"text-center  text-md md:text-lg"}> {feature.description} </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}