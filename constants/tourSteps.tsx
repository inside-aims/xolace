'use client';

import { TourContent, TourTitle, TourWrapper } from '@/styles/tourStyles';

interface Step {
  selector: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

export const FeedSteps: Step[] = [
  {
    selector: '[data-tour="welcome-header"]',
    content: () => (
      <TourWrapper>
        <TourTitle>Post Collection</TourTitle>
        <TourContent>
          Behold our collection of insightful posts! Each card represents a
          treasure trove of knowledge. Let&apos;s explore one in detail.
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1',
    content: () => (
      <TourWrapper>
        <TourTitle>Anatomy of a Post Card</TourTitle>
        <TourContent>
          This is a post card. It&apos;s packed with information and interactive
          elements. Let&apos;s break it down!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1 #upvote-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Upvote</TourTitle>
        <TourContent>
          Love the post? Give it an upvote! This helps other readers find
          valuable content.
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1 #vote-count',
    content: () => (
      <TourWrapper>
        <TourTitle>Vote Score</TourTitle>
        <TourContent>
          This score is the showdown between upvotes and downvotes! You can only
          pick one side at a time—upvote adds +1, downvote takes away -1. Choose
          wisely!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1 #downvote-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Downvote</TourTitle>
        <TourContent>
          Not your cup of tea? You can downvote posts. But remember,
          constructive feedback is always better!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1 #comment-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Comments</TourTitle>
        <TourContent>
          Join the conversation! Click here to view existing comments or add
          your own thoughts.
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1 #view-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Post Views</TourTitle>
        <TourContent>
          Wondering how many eyes have been on this post? Check the view count
          here!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1 #mood-btn',
    content: () => (
      <TourWrapper>
        {' '}
        <TourTitle>What&apos;s the Vibe?</TourTitle>{' '}
        <TourContent>
          {' '}
          Curious about the mood of this post? Take a peek and see if it&apos;s
          chill, fiery, or somewhere in between—it&apos;s like reading the room,
          but for posts!{' '}
        </TourContent>{' '}
      </TourWrapper>
    ),
  },
  {
    selector: '#post-1 #collection-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Save for Later</TourTitle>
        <TourContent>
          Found something interesting but don&apos;t have time to read it now?
          Save it for later with this handy button!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#theme-btn',
    content: () => (
      <TourWrapper>
        {' '}
        <TourTitle>Light or Dark? Your Call!</TourTitle>{' '}
        <TourContent>
          {' '}
          Can&apos;t decide between a bright day or a cozy night? Flip the
          switch and let the magic happen—your eyes will thank you!{' '}
        </TourContent>{' '}
      </TourWrapper>
    ),
  },
];

export const createPostSteps = (): Step[] => {
  return [
    {
      selector: '#postTextArea',
      content: 'Enter your thoughts , memories , experiences to share ',
    },
    {
      selector: '#postTextArea #tags-guide',
      content:
        'You can add up to three tags(max). After posting, tags are seperated into their own cards ',
    },
    {
      selector: '#postTextArea #mood-display',
      content: 'This displays mood chosen for post',
    },
    {
      selector: '#toggle24hr',
      content:
        'Toggle whether to display post for only 24hr or for as long as you want  ',
    },
    {
      selector: '#postTextArea #emoji-btn',
      content: 'Click to add emojis to your content 😉 ',
    },
    {
      selector: '#mood-carousel',
      content:
        'Pick from the moods displayed( such as sad , happy , angry , etc...) to describe your kind of post ',
    },
    {
      selector: '#submit-btn',
      content: 'Click this button to submit your post  ',
    },
    {
      selector: '#counter',
      content:
        'Displays amount of characters entered into the content box, red indicates you have exceeded your limits ',
    },
  ];
};
