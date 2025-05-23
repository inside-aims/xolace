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
      'Mindful journaling invites us to observe our inner world with curiosity and compassion, helping us process emotions and find clarity. When practiced consistently, it becomes a safe outlet for stress relief and self-awareness, encouraging personal growth over time. Writing freely without judgment allows suppressed feelings to surface, which is essential for emotional healing. In addition to reducing anxiety, journaling can help track mood patterns, improve problem-solving, and reinforce positive habits. The act of writing itself can become a grounding ritual, offering structure and peace in chaotic times.',
  },
  {
    id: '2',
    title: 'Understanding the Power of Gratitude',
    author: 'Dr. Angela Mensah',
    date: '2025-04-12',
    content:
      'Practicing gratitude can shift your mindset and positively impact your mental health. By focusing on what you have rather than what’s lacking, you create a habit of recognizing the good in your life. This perspective helps reduce anxiety, promote better sleep, and increase emotional resilience in stressful situations. Keeping a gratitude journal or simply reflecting on three positive moments each day can elevate your mood over time. Gratitude enhances empathy, strengthens relationships, and serves as a daily reminder of life’s meaningful moments—even during difficult times.',
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
      'There’s a growing link between nutrition and mental health. Diets rich in leafy greens, omega-3 fatty acids, and fermented foods support gut health, which in turn impacts mood and cognition. Eliminating excessive sugar and processed foods can also reduce brain fog and emotional fluctuations. A balanced diet stabilizes blood sugar, enhances neurotransmitter production, and can even help alleviate symptoms of depression and anxiety. Nutritional psychiatry is emerging as a powerful complement to traditional mental health treatment, reinforcing that what we eat truly affects how we feel.',
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