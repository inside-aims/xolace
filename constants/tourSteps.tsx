'use client';

import { TourContent, TourTitle, TourWrapper } from '@/styles/tourStyles';

interface Step {
  selector: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
}

export const FeedSteps: Step[] = [
  {
    selector: '#navbar',
    content: () => (
      <TourWrapper>
        <TourTitle>Navigation Bar</TourTitle>
        <TourContent>
          This is the navigation bar.
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#sidebar-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Sidebar Button</TourTitle>
        <TourContent>
          This is the avatar sidebar button. Helps navigate between different sections of the app.
        </TourContent>
      </TourWrapper>
    ),
  },
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
    selector: '#post-1 #upvote-count',
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
    selector: '#post-1 #downvote-count',
    content: () => (
      <TourWrapper>
        <TourTitle>Down Vote Score</TourTitle>
        <TourContent>
          This score is the showdown between upvotes and downvotes! You can only
          pick one side at a time—upvote adds +1, downvote takes away -1. Choose
          wisely!
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
          happy, sad, angry , or somewhere in between—it&apos;s like reading the room,
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
  {
    selector: '#sign-out',
    content: () => (
      <TourWrapper>
        <TourTitle>Sign Out</TourTitle>
        <TourContent>
          Are you sure you want to leave us? 😢 If you must go, click here to
          sign out—but we’ll be waiting when you come back!
        </TourContent>
      </TourWrapper>
    ),
  },
];

export const createPostSteps: Step[] = [
  {
    selector: '#postTextArea',
    content: () => (
      <TourWrapper>
        <TourTitle>Share Your Story</TourTitle>
        <TourContent>
          Got thoughts, memories, or experiences to share? Let them flow right
          here!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#postTextArea #tags-guide',
    content: () => (
      <TourWrapper>
        <TourTitle>Tag Your Post</TourTitle>
        <TourContent>
          Keep it relevant! Add up to three tags (max) to your post. Once
          posted, each tag gets its own shiny little card!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#postTextArea #mood-display',
    content: () => (
      <TourWrapper>
        <TourTitle>Post Mood</TourTitle>
        <TourContent>
          This reveals the mood chosen for the post—because every post has a
          vibe!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#toggle24hr',
    content: () => (
      <TourWrapper>
        <TourTitle>Post Duration</TourTitle>
        <TourContent>
          Set the clock! Choose whether your post vanishes in 24 hours or stays
          up for the long haul.
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#postTextArea #emoji-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Add Emojis</TourTitle>
        <TourContent>
          A picture&apos;s worth a thousand words—so why not add some emojis?
          Click to sprinkle some extra flair! 😉
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#mood-carousel',
    content: () => (
      <TourWrapper>
        <TourTitle>Choose a Mood</TourTitle>
        <TourContent>
          Set the tone! Pick a mood—happy, sad, angry, or anything in between—to
          match your post&apos;s vibe.
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#submit-btn',
    content: () => (
      <TourWrapper>
        <TourTitle>Submit Your Post</TourTitle>
        <TourContent>
          All set? Click this button to send your post out into the world!
        </TourContent>
      </TourWrapper>
    ),
  },
  {
    selector: '#counter',
    content: () => (
      <TourWrapper>
        <TourTitle>Character Count</TourTitle>
        <TourContent>
          Keep an eye on your words! This shows how many characters you&apos;ve
          typed—if it turns red, you&apos;ve gone over the limit!
        </TourContent>
      </TourWrapper>
    ),
  },
];
