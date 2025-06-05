interface HealthTipCardProps {
  id: string;
  title: string;
  author: string;
  content: string | string[];
  date: string;
  index?: number;
  total?: number;
  onHealthTipSelect?: (healthTipId: string) => void;
}

export const healthTips: HealthTipCardProps[] = [
  {
    id: '1',
    title: 'The Art of Emotional Journaling',
    author: 'Darlton Carwell',
    date: '12/9/2032',
    content:
      `### Question

I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?

#### What I've Tried:
- Lazy loading components
- Using React.memo on some components
- Managing state with React Context API

#### Issues:
- The app still lags when rendering large lists.
- Switching between pages feels sluggish.
- Sometimes, re-renders happen unexpectedly.

#### Key Areas I Need Help With:
1. Efficiently handling large datasets.
2. Reducing unnecessary re-renders.
3. Optimizing state management.

Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:

\`\`\`js
import React, { useState, useMemo } from "react";

const LargeList = ({ items }) => {
  const [filter, setFilter] = useState("");

  // Filtering items dynamically
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LargeList;
\`\`\`

#### Questions:
1. Is using \`useMemo\` the right approach here, or is there a better alternative?
2. Should I implement virtualization for the list? If yes, which library would you recommend?
3. Are there better ways to optimize state changes when dealing with user input and dynamic data?

Looking forward to your suggestions and examples!

**Tags:** React, Performance, State Management
  `,
  },
  {
    id: '2',
    title: 'Understanding the Power of Gratitude',
    author: 'Dr. Angela Mensah',
    date: '2025-04-12',
    content:
      `### Question

I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?

#### What I've Tried:
- Lazy loading components
- Using React.memo on some components
- Managing state with React Context API

#### Issues:
- The app still lags when rendering large lists.
- Switching between pages feels sluggish.
- Sometimes, re-renders happen unexpectedly.

#### Key Areas I Need Help With:
1. Efficiently handling large datasets.
2. Reducing unnecessary re-renders.
3. Optimizing state management.

Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:

\`\`\`js
import React, { useState, useMemo } from "react";

const LargeList = ({ items }) => {
  const [filter, setFilter] = useState("");

  // Filtering items dynamically
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LargeList;
\`\`\`

#### Questions:
1. Is using \`useMemo\` the right approach here, or is there a better alternative?
2. Should I implement virtualization for the list? If yes, which library would you recommend?
3. Are there better ways to optimize state changes when dealing with user input and dynamic data?

Looking forward to your suggestions and examples!

**Tags:** React, Performance, State Management
  `,
  },
  {
    id: '3',
    title: 'How Nature Heals the Mind',
    author: 'Dr. Kwame Osei',
    date: '2025-05-10',
    content:
      'Spending time in nature has been proven to reduce cortisol levels and lower blood pressure, helping the brain relax and rejuvenate. Nature therapy, or ecotherapy, encourages individuals to unplug from devices and reestablish a connection with the natural world. Whether it’s a walk in the park or gardening, these small moments can make a big difference. Engaging with nature supports creativity, sharpens focus, and brings a sense of awe that can reset our mental state. Even brief exposure to green spaces can improve memory, attention, and emotional balance.',
  },
  {
    id: '4',
    title: 'Digital Detox: A Path to Mental Clarity',
    author: 'Dr. Linda Owusu',
    date: '2025-06-03',
    content:
      'Constant digital stimulation can overwhelm the brain, leading to fatigue, irritability, and sleep disturbances. A digital detox involves setting boundaries around device usage to create space for mindfulness, rest, and human interaction. Even short breaks from screens can restore focus, reduce anxiety, and improve overall well-being. Turning off notifications, setting screen-free zones, and engaging in offline activities like reading or walking can help reclaim attention and create deeper presence. Disconnecting for mental clarity is not about rejecting technology, but about using it with intention.',
  },
  {
    id: '5',
    title: 'The Role of Diet in Mental Health',
    author: 'Dr. Nana Serwaa',
    date: '2025-06-18',
    content:
      `### Question

I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?

#### What I've Tried:
- Lazy loading components
- Using React.memo on some components
- Managing state with React Context API

#### Issues:
- The app still lags when rendering large lists.
- Switching between pages feels sluggish.
- Sometimes, re-renders happen unexpectedly.

#### Key Areas I Need Help With:
1. Efficiently handling large datasets.
2. Reducing unnecessary re-renders.
3. Optimizing state management.

Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:

\`\`\`js
import React, { useState, useMemo } from "react";

const LargeList = ({ items }) => {
  const [filter, setFilter] = useState("");

  // Filtering items dynamically
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);

  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default LargeList;
\`\`\`

#### Questions:
1. Is using \`useMemo\` the right approach here, or is there a better alternative?
2. Should I implement virtualization for the list? If yes, which library would you recommend?
3. Are there better ways to optimize state changes when dealing with user input and dynamic data?

Looking forward to your suggestions and examples!

**Tags:** React, Performance, State Management
  `,
  },
  {
    id: '6',
    title: 'Setting Boundaries for Emotional Safety',
    author: 'Therapist Joana Biney',
    date: '2025-07-01',
    content:
      'Learning to set healthy boundaries is essential for protecting your emotional space. Whether in personal relationships or the workplace, boundaries clarify your needs and help prevent burnout. Assertiveness, paired with empathy, ensures that your mental well-being remains a priority while still fostering connection and respect. Without boundaries, emotional exhaustion, resentment, and confusion can build up over time. Practicing saying “no,” taking time to recharge, and communicating clearly can transform how you navigate relationships and protect your peace.',
  },
];