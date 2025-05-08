import React from 'react';

const PostCardMask = () => {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/20 backdrop-blur-md">
      <div className="max-w-xs p-6 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4 text-yellow-500"
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h3 className="mb-2 text-lg font-semibold">Sensitive Content</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          This post may contain sensitive content that some viewers might find
          offensive or disturbing.
        </p>
        {/* <Button onClick={() => setRevealed(true)}>Show Content</Button> */}
      </div>
    </div>
  );
};

export default PostCardMask;
