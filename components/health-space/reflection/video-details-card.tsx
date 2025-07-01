'use client';

import {Copy, Link as LinkIcon, ScanEye, Bookmark, ThumbsUp} from "lucide-react";
import * as React from "react";
import {ShadowBtn} from "@/components/health-space/reflection/shadow-btn";
import {VideoDetailProps} from "@/components/health-space/reflection/index";
import {cleanTitle, createIframeLink} from "@/lib/utils";

//Helper to parse timestamp
function parseTimestamp(time: string): number {
  const parts = time.split(':').map(Number);
  let [h, m, s] = [0, 0, 0];
  if (parts.length === 3) [h, m, s] = parts;
  else if (parts.length === 2) [m, s] = parts;
  else if (parts.length === 1) [s] = parts;

  return h * 3600 + m * 60 + s;
}


const VideoDetailsCard = ({video, videoId}: { video: VideoDetailProps, videoId: string }) => {
  const [copied, setCopied] = React.useState(false);
  const [selectedTab, setSelectedTab] = React.useState<string>("transcript");
  const [startTime, setStartTime] = React.useState<number | null>(null);


  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigator.clipboard.writeText(`${window.location.origin}`).then();
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
    { label: "Title", value: cleanTitle(video.title) },
    { label: "Description", value: video.metaTags.map((value) => value.value) || "No description" },
    { label: "URL", value: createIframeLink(videoId) },
  ];


  const renderTranscript = () => {
    if (!video.captions || video.captions.length === 0) {
      return <p className="text-neutral-500">No transcript available.</p>;
    }

    return (
      <ul className="flex flex-col items-start gap-4">
        {video.captions.map((caption, index) => (
          <li
            className="flex flex-row gap-4 text-sm" key={index}
            onClick={() => {
              const seconds = parseTimestamp(caption.time);
              setStartTime(seconds);
            }}
          >
            <h2 className="text-red-500 self-start">[{caption.time}]</h2>
            <p className="flex flex-wrap self-start">{caption.text}</p>
          </li>
        ))}
      </ul>
    );
  };

  const renderMetadata = () => (
    <div className={"flex flex-col gap-4 items-start"}>
      {metaDatas.map(({label, value}, index) => (
        <article className={"flex flex-row items-start gap-2 "} key={index}>
          <h2 className={"font-semibold"}>{label}:</h2>
          <p className={`${label === "Video url" && ("underline text-blue-500 cursor-move")}`}>{value}</p>
        </article>
      ))}
    </div>
  )

  return (
    <>
      <section className={"grid grid-cols-12 gap-8 items-start h-full md:h-[calc(100vh-var(--header-height))]"}>
        <div className="relative col-span-12 md:col-span-8">
          {/* Mobile: Make the entire video section sticky */}
          <div className="z-40 bg-white dark:bg-dark-2 aboslute top-0 sticky md:static ">
            <div className="flex flex-col items-center gap-2">
              <div className="aspect-video w-full rounded-lg overflow-hidden border">
                <iframe
                  src={createIframeLink(videoId, startTime || 0)}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="inset-0 w-full h-full border-0"
                ></iframe>
              </div>

              {/* Video info */}
              <div className="w-full flex flex-col gap-2">
                <aside className="font-semibold text-lg">
                  {cleanTitle(video.title)} - {" "}
                  {video.createdAt.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </aside>

                <section className="w-full flex flex-col md:flex-row items-start justify-between gap-2">
                  <div className="items-start flex span gap-2">
                    <p className="border rounded-full w-8 h-8 aspect-square bg-neutral-400"/>
                    <div className="flex flex-col items-start leading-none m-0 p-0">
                      <span>FedeJnr</span>
                      <span className="text-sm text-neutral-400">
                        {video.visibility}
                      </span>
                    </div>
                  </div>
                  <div className="w-full md:w-auto flex items-start justify-between gap-0 md:gap-4">
                    <ShadowBtn key={'likes'} value={23} icon={<ThumbsUp className="size-4 sm:size-4"/>}/>
                    <ShadowBtn key={'view'} value={video.views} icon={<ScanEye className="size-4 text-red-200 sm:size-4"/>}/>
                    <ShadowBtn key={'save'} value={"Save"} icon={<Bookmark className="size-4 sm:size-4"/>}/>
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
        </div>

        {/*transcript and metadata*/}
        <div className={"col-span-12 md:col-span-4 h-full overflow-y-auto"}>
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