'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PolicyPage() {
  const [activeSection, setActiveSection] = useState('privacy');

  const sections = [
    { id: 'privacy', title: 'Privacy Policy' },
    { id: 'community', title: 'Community Guidelines' },
    { id: 'safety', title: 'Safety and Support' },
    { id: 'data', title: 'Data Retention and Account Termination' },
    { id: 'disclaimer', title: 'Disclaimer' },
    { id: 'contact', title: 'Contact Us' },
  ];

  const policyContent = {
    privacy: (
      <>
        <h2 className="mb-4 text-2xl font-bold">
          1. Anonymity and Personal Information
        </h2>
        <p className="mb-4">
          At Xolace, we prioritize user privacy and anonymity. We don&apos;t
          require users to provide identifiable information such as their real
          names, phone numbers. We use unique identifiers (like usernames or
          encrypted identifiers) to maintain a safe, anonymous environment. Your
          privacy is our top priority, and no personally identifiable
          information is stored or shared with others. Users are strongly urged
          not to provide a real identity information about themselves when
          entering their username.
          <span className="font-semibold text-amber-600">
            NB: We will not be held responsible for carelessness
          </span>
        </p>

        <h2 className="mb-4 text-2xl font-bold">2. Data Collection and Use</h2>
        <p className="mb-4">
          We collect only limited information to ensure the app&apos;s
          functionality, such as device data (for troubleshooting) and anonymous
          usage data (for improving features). This data is never shared with
          third parties or used for marketing purposes.
        </p>
        <p className="mb-4 font-bold">
          NOTE: In creating an account with Xolace a working email will be
          needed to help in the case where you will need to reset your password
          when forgotten.
        </p>

        <h2 className="mb-4 text-2xl font-bold">3. Cookies and Tracking</h2>
        <p className="mb-4">
          Xolace may use cookies or similar technologies to improve user
          experience, but these are strictly for app performance and
          personalization. No tracking data is collected or used to identify
          individual users.
        </p>

        <h2 className="mb-4 text-2xl font-bold">4. Data Security</h2>
        <p className="mb-4">
          We employ industry-standard security measures to protect all data,
          ensuring it is safely encrypted and inaccessible to unauthorized
          users. We regularly update our security protocols to match evolving
          standards.
        </p>
      </>
    ),
    community: (
      <>
        <h2 className="mb-4 text-2xl font-bold">1. Respect and Empathy</h2>
        <p className="mb-4">
          Xolace is a supportive space where users can share openly and find
          encouragement from others. We ask all users to engage respectfully and
          empathetically. Comments should be constructive, encouraging, and free
          of judgment.
        </p>

        <h2 className="mb-4 text-2xl font-bold">2. Prohibited Content</h2>
        <p className="mb-4">
          To maintain a safe space, we prohibit content that includes:
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>Hate speech or abusive language</li>
          <li>Harassment, bullying, or intimidation</li>
          <li>Self-harm or suicide promotion</li>
          <li>Inappropriate or explicit material</li>
          <li>Misinformation or false claims</li>
        </ul>

        <h2 className="mb-4 text-2xl font-bold">3. Reporting Violations</h2>
        <p className="mb-4">
          Users can report posts or comments that violate these guidelines.
          Reported content will be reviewed promptly, and appropriate actions,
          including post removal or user suspension, will be taken to ensure a
          safe environment.
        </p>
      </>
    ),
    safety: (
      <>
        <h2 className="mb-4 text-2xl font-bold">
          1. Mental Health and Well-being
        </h2>
        <p className="mb-4">
          Xolace is a peer-support space but not a replacement for professional
          advice or therapy. If you&apos;re in crisis, we encourage seeking
          professional help. For users interested in further guidance, Xolace
          offers a &quot;Help Section&quot; where you can connect with
          professionals for counseling or business advice via subscription.
        </p>

        <h2 className="mb-4 text-2xl font-bold">
          2. Content Moderation and Review
        </h2>
        <p className="mb-4">
          We use a combination of automated tools and human moderation to ensure
          Xolace remains a positive, safe space for all users. Despite our
          efforts, we cannot guarantee that all inappropriate content will be
          immediately removed, and we rely on user reports to assist us.
        </p>
      </>
    ),
    data: (
      <>
        <h2 className="mb-4 text-2xl font-bold">1. Data Retention</h2>
        <p className="mb-4">
          Xolace stores data only as long as necessary for operational purposes.
          Anonymous posts and comments may remain visible on the platform but
          will have no association with personal identifiers.
        </p>

        <h2 className="mb-4 text-2xl font-bold">2. Account Termination</h2>
        <p className="mb-4">
          Users can delete their accounts at any time. When an account is
          deleted, all data associated with it (including posts and comments)
          will be permanently erased from our servers.
        </p>
      </>
    ),
    disclaimer: (
      <>
        <h2 className="mb-4 text-2xl font-bold">1. Content Responsibility</h2>
        <p className="mb-4">
          Users are solely responsible for the content they share on Xolace.
          While we strive to provide a safe space, we cannot guarantee that all
          posts or comments reflect supportive or professional perspectives.
          Content on Xolace should be viewed as peer support only, not
          professional advice.
        </p>

        <h2 className="mb-4 text-2xl font-bold">2. Limitation of Liability</h2>
        <p className="mb-4">
          Xolace is not liable for any emotional distress or damages resulting
          from interactions within the platform. Users are encouraged to engage
          thoughtfully and seek professional assistance when needed.
        </p>
      </>
    ),
    contact: (
      <>
        <h2 className="mb-4 text-2xl font-bold">Contact Us</h2>
        <p className="mb-4">
          If you have any questions or concerns about this policy, please
          contact us through our support channels within the app.
        </p>
      </>
    ),
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-100/10 to-indigo-200/10 px-5 py-8">
      <Button
        variant="outline"
        size="icon"
        className="bg-blackA11 fixed top-4 left-4 z-50 shadow-md hover:bg-gray-100 dark:bg-white"
        onClick={() => window.history.back()}
      >
        <ChevronLeft className="h-4 w-4 text-white dark:text-black" />
      </Button>

      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg bg-gray-200 shadow-xl max-sm:max-w-5xl dark:bg-black">
        <div className="p-8">
          <h1 className="mb-8 text-center text-4xl font-bold text-indigo-600">
            Xolace&quot;s Policies
          </h1>

          <div className="mb-8 flex overflow-x-auto">
            {sections.map(section => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                className="mr-2 whitespace-nowrap"
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </Button>
            ))}
          </div>

          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="prose max-w-none"
          >
            {policyContent[activeSection as keyof typeof policyContent]}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
