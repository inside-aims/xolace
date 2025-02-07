import type { Step } from "react-joyride";


export const FeedSteps: Step[] = [
    {
      target: "#feedList",
      content: "This is our Feed page.",
      disableBeacon: true,
    },
    {
        target: "#post-1",
        content: "This is a post card. It contains the title, excerpt, and interactive elements.",
      },
      {
        target: "#post-1 #upvote-btn",
        content: "Click here to upvote a post you find helpful or interesting.",
      },
      {
        target: "#post-1 #downvote-btn",
        content: "Click here to downvote a post you find unhelpful or uninteresting.",
      },
      {
        target: "#post-1 #comment-btn",
        content: "Click here to comment on a post.",
      },
      {
        target: "#post-1 #view-btn",
        content: "See how many people have viewed this post.",
      },
      {
        target: "#post-1 #mood-btn",
        content: "See the mood associated with this post.",
      },
      {
        target: "#post-1 #collection-btn",
        content: "Click here to save this post to your collections.",
      },
      {
        target: "#theme-btn",
        content: "Switch theme between light & dark mode with this button"
      }
  ]

export const createPostSteps = (): Step[] =>{

    return [
        {
            target: "#postTextArea",
            content: "This is our Feed page.",
            disableBeacon: true,
          },
    ]
}