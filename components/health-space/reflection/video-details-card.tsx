'use client';

import {Copy, Link as LinkIcon, ScanEye, Bookmark} from "lucide-react";
import * as React from "react";
import {ShadowBtn} from "@/components/health-space/reflection/shadow-btn";

const VideoDetailsCard = () => {
  const [copied, setCopied] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<string>("transcript");

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}`);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  const handleSelectedTab = (key: string) => {
    setSelectedTab(key);
  }

  const navTabs: {key: string; value: string}[] = [
    {key: "transcript", value: "Transcript"},
    {key: "metadata", value: "Metadata"},
  ]

  const metaDatas = [
    {
      label: "Video title",
      value: "24,Jun.2025"
    },
    {
      label: "Video description",
      value: "This is video description",
    },
    {
      label: "Video id",
      value: "Vdieo Id",
    },
    {
      label: "Video url",
      value: "https://www.youtube.com/embed/",
    },
  ];

  const renderTranscript = () => {
    return (
      <ul className={"flex flex-col items-start gap-4"}>
        <li className={"flex flex-row gap-4 text-sm"}>
          <h2 className={"text-red-500 self-start"}>[00:00:00]</h2>
          <p className={"flex flex-wrap item self-start"}>
            This is the transcript and the description sesction
          </p>
        </li>
      </ul>
    )
  }

  const renderMetadata = () => (
    <div className={"flex flex-col gap-4 items-start"}>
      {metaDatas.map(({label, value}, index) => (
        <article className={"flex flex-row items-start gap-2 "} key={index}>
          <h2>{label}:</h2>
          <p>{value}</p>
        </article>
      ))}
    </div>
  )

  return (
    <>
      <section className={"grid grid-cols-12 gap-8 items-start"}>
        <div className={"col-span-12 md:col-span-8 self-start"}>

          {/*video and description*/}
          <div className={"flex flex-col items-center gap-2"}>
            <div className={"aspect-video w-full rounded-2xl border "}>
              <video className="w-full h-full " controls autoPlay >
                <source src="/assets/videos/prime_demo.mp4" type="video/mp4"/>
                {`Your browser doesn't support the video tag.`}
              </video>

            </div>

            {/*details section*/}
            <div className={"w-full flex items-start flex-col gap-2"}>
              <aside className={"font-semibold text-lg"}>
              This is the title of the video - 25,Jun.2025
              </aside>
              <section className={"w-full flex items-start justify-between"}>
                <div className={"items-start flex span gap-2"}>
                  <p className={"border rounded-full w-8 h-8 aspect-square bg-neutral-400"}>

                  </p>
                  <div className="flex flex-col items-start leading-none m-0 p-0">
                    <span>FedeJnr</span>
                    <span className="text-sm text-neutral-400">public</span>
                  </div>
                </div>
                <div/>
                <div className={"flex items-start justify-between gap-2 md:gap-4"}>
                  <ShadowBtn
                    key={'view'}
                    value={12}
                    icon={ <ScanEye className="size-4 text-red-200 sm:size-4"/>}
                  />
                  <ShadowBtn
                    key={"save"}
                    value={"Save"}
                    icon={ <Bookmark className="size-4 sm:size-4"/>}
                  />
                  <button
                    onClick={handleCopy}
                    className="flex items-center p-2 w-8 h-8 rounded-full border border-neutral-600"
                  >
                    {copied ? (
                      <Copy className="text-gray-500 rotate-180"/>
                    ) : (
                      <LinkIcon className="text-gray-500 rotate-180"/>
                    )}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/*transcript and metadata*/}
        <div className={"col-span-12 md:col-span-4 self-start"}>
          <section className="flex gap-8 w-full border-b border-neutral-200">
            {navTabs.map((tab) => {
              const active = selectedTab === tab.key;
              return (
                <button
                  key={tab.key}
                  className={`relative pb-2 -mb-[1px] border-b-2 transition-colors ${
                    active
                      ? 'text-lavender-500 border-lavender-500'
                      : 'text-neutral-500 border-transparent'
                  }`}
                  onClick={() => handleSelectedTab(tab.key)}
                >
                  {tab.value}
                </button>
              );
            })}
          </section>

          <section className={"mt-4"}>
            {selectedTab === "transcript" ?
              (renderTranscript()) : (renderMetadata())
            }
          </section>
        </div>
      </section>

    </>
  )
}
export default VideoDetailsCard;