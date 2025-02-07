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
            content: "Enter your thoughts , memories , experiences to share ",
            disableBeacon: true,
          },
          {
            target: "#postTextArea #tags-guide",
            content: "You can add up to three tags(max). After posting, tags are seperated into their own cards "
          },
          {
            target: "#postTextArea #mood-display",
            content: "This displays mood chosen for post"
          },
          {
            target: "#toggle24hr",
            content: "Toggle whether to display post for only 24hr or for as long as you want  "
          },
          {
            target: "#postTextArea #emoji-btn",
            content: "Click to add emojis to your content 😉 "
          },
          {
            target: "#mood-carousel",
            content: "Pick from the moods displayed( such as sad , happy , angry , etc...) to describe your kind of post "
          },
          {
            target: "#submit-btn",
            content: "Click this button to submit your post  "
          },
          {
            target: "#counter",
            content: "Displays amount of characters entered into the content box, red indicates you have exceeded your limits "
          }
    ]
}