"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SupaVideoDetails } from "@/types/global"
import { ReactElement, JSXElementConstructor, ReactNode, ReactPortal, Key } from "react"


interface VideoTabsProps {
  video: SupaVideoDetails
  activeTab: "transcript" | "metadata"
  onTabChange: (tab: "transcript" | "metadata") => void
}

export function VideoTabs({ video, activeTab, onTabChange }: VideoTabsProps) {
  return (
    <div className="py-4 lg:p-6">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as "transcript" | "metadata")}>
        <TabsList className="grid w-full grid-cols-2 bg-gray-400 dark:bg-gray-800">
          <TabsTrigger value="transcript" className="data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-500 data-[state=inactive]:bg-gray-400 dark:data-[state=inactive]:bg-gray-800  data-[state=active]:text-white data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 ">
            Transcript
          </TabsTrigger>
          <TabsTrigger value="metadata" className="data-[state=active]:bg-blue-600 dark:data-[state=active]:bg-blue-500 data-[state=inactive]:bg-gray-400 dark:data-[state=inactive]:bg-gray-800 data-[state=active]:text-white data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-400 ">
            Metadata
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transcript" className="mt-6">
          <div className="space-y-4">
          <p className="text-gray-400">No transcript available.</p>
            {/* {video.transcript ? (
              <div className="text-gray-300 leading-relaxed">
                {video.transcript.split("\n").map((line: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, index: Key | null | undefined) => (
                  <p key={index} className="mb-2">
                    {line}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No transcript available.</p>
            )} */}
          </div>
        </TabsContent>

        <TabsContent value="metadata" className="mt-6 px-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div className="flex gap-x-2">
                <p className="text-gray-400 mb-1">Duration:</p>
                <p className="dark:text-white text-gray-600">
                  {Math.floor(video.duration ? video.duration / 60 : 0)}:{(video.duration ? video.duration % 60 : 0).toString().padStart(2, "0")}
                </p>
              </div>
              <div className="flex gap-x-2">
                <p className="text-gray-400 mb-1">Upload Date:</p>
                <p className="dark:text-white text-gray-600">{new Date(video.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-x-2">
                <p className="text-gray-400 mb-1">Privacy:</p>
                <p className="dark:text-white text-gray-600 capitalize">{video.visibility}</p>
              </div>
            </div>

            {/* {video.tags && video.tags.length > 0 && (
              <div>
                <p className="text-gray-400 mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {video.tags.map((tag, index) => (
                    <span key={index} className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
