import React from "react";

export function TopTags() {
  //Dummy top tags status
  const postTags: {key: string, value: number, name: string}[] = [
    {key: 'relationship', value: 8, name: "Relationship"},
    {key: 'academics', value: 30, name: "Academics"},
    {key: 'friendship', value: 3, name: "Friendship"},
    {key: 'mentalHealth', value: 10, name: "Mental Health"},
    {key: 'trust', value: 4, name: "Trust"},
    {key: 'drugAddict', value: 9, name: "Drug Addict"},
    {key: 'family', value: 5, name: "Family"},
  ]

  return(
    <>
      <div className="w-full flex flex-col gap-4 mx-4 md:mx-0">
        <h3 className="font-semibold text-xl hidden md:flex">Top Tags</h3>
        <div className="flex flex-wrap gap-3">
          {postTags
            .filter((tag) => tag.value >= 1)
            .sort((a, b) => b.value - a.value)
            .slice(0, 6)
            .map((tag) => {
              let tagStyle;
              let holeColor;

              if (tag.value >= 10) {
                tagStyle = 'bg-moss-300 text-moss-900 border-moss-900';
                holeColor = 'bg-moss-900';
              } else if (tag.value >= 5) {
                tagStyle = 'bg-ocean-300 text-ocean-900 border-ocean-900';
                holeColor = 'bg-ocean-900';
              } else {
                tagStyle = 'bg-lavender-300 text-lavender-900 border-lavender-900';
                holeColor = 'bg-lavender-950';
              }

              return (
                <div
                  key={tag.key}
                  className={`relative pr-6 pl-3 py-1 border rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:shadow-md hover:cursor-wait ${tagStyle}`}
                >
                  <span className="capitalize">{tag.name}</span>
                  <span className="text-xs font-semibold opacity-70">[{tag.value}]</span>
                  <span
                    className={`absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border border-white shadow-inner ${holeColor}`}
                  ></span>
                </div>
              );
            })}
        </div>
      </div>
    </>
  )
}