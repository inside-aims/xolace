// config/featureModals.ts

import { 
    PenTool, 
    Heart, 
    Timer, 
    Smile, 
    Users, 
    User, 
    Award, 
    BarChart3,
    Info,
    Video,
    Search,
    Filter,
    FileText,
    Folders,
    ScanSearch,
    PackageSearch,
    SlidersHorizontal,
    CirclePlus
  } from 'lucide-react';
  import { FeatureModalConfig } from './helpers/featureModalStorageHelper';

  
  export const featureModalConfigs: Record<string, FeatureModalConfig> = {
    // Post Form Page
    '/create-post': {
      route: '/create-post',
      storageKey: 'post_form',
      title: 'Welcome to Xolace!',
      description: 'Share your thoughts and experiences in a supportive community. Here\'s what you can do:',
      features: [
        {
          icon: PenTool,
          title: 'Create Posts',
          description: 'Share your experiences with single posts or multi-slide carousels'
        },
        {
          icon: Smile,
          title: 'Express Mood',
          description: 'Add your current mood to give context to your posts'
        },
        {
          icon: Timer,
          title: '24h Auto-Delete',
          description: 'Create temporary posts that disappear after 24 hours'
        },
        {
          icon: Users,
          title: 'Join Campfires',
          description: 'Post to specific communities based on your interests'
        }
      ],
      hasStepByStep: true
    },
  
    // Profile Page
    '/profile': {
      route: '/profile',
      storageKey: 'profile',
      title: 'Your Profile Hub',
      description: 'Track your journey and see your impact in the community:',
      features: [
        {
          icon: User,
          title: 'Personal Info',
          description: 'View and manage your profile information and badges'
        },
        {
          icon: BarChart3,
          title: 'Stats & Reputation',
          description: 'See your community contributions and earned reputation points'
        },
        {
          icon: Award,
          title: 'Top Tags',
          description: 'Discover the topics you engage with most frequently'
        }
      ],
      hasStepByStep: true
    },
  
    // Channel Page
    '/channel': {
      route: '/channel',
      storageKey: 'channel',
      title: 'Channel Central',
      description: 'Everything you need to know about Xolace and how to get help:',
      features: [
        {
          icon: Info,
          title: 'About Xolace',
          description: 'Learn about our mission and community values'
        },
        {
          icon: Heart,
          title: 'Support & Contribute',
          description: 'Ways to support the platform and give feedback'
        },
        {
          icon: Award,
          title: 'Community Guidelines',
          description: 'Understand our rules and policies for a safe space'
        }
      ],
      hasStepByStep: true
    },
  
    // Health Space - Reflections
    '/glimpse': {
      route: '/glimpse',
      storageKey: 'health_glimpse',
      title: 'Reflections Library',
      description: 'Access guided reflection videos for mental wellness:',
      features: [
        {
          icon: Video,
          title: 'Reflection Videos',
          description: 'Watch curated videos to guide your self-reflection journey'
        },
        {
          icon: Search,
          title: 'Search & Discover',
          description: 'Find videos that match your current needs and interests'
        },
        {
          icon: Filter,
          title: 'Filter Options',
          description: 'Sort by most recent, most viewed, or oldest content'
        }
      ],
      hasStepByStep: true
    },

     // Collections Page
     '/collections': {
      route: '/collections',
      storageKey: 'collections',
      title: 'Collections Central',
      description: 'Manage your saved content:',
      features: [
        {
          icon: FileText,
          title: 'Saved Posts',
          description: 'View your saved posts'
        },
        {
          icon: Video,
          title: 'Saved Videos',
          description: 'View your saved videos'
        }
      ],
      hasStepByStep: true
    },

     // Manage Campfires Page
     '/manage-campfires': {
      route: '/user/x/campfires',
      storageKey: 'manage-campfires',
      title: 'Manage Campfires',
      description: 'Manage your campfires:',
      features: [
        {
          icon: ScanSearch,
          title: 'Find your campfires',
          description: 'View campfires you have joined, added to favorites or created'
        },
        {
          icon: Folders,
          title: 'Adding to favorites',
          description: 'Add or remove campfires to or from your favorites by clicking the star icon'
        }
      ],
      hasStepByStep: true
    },

     // Manage Campfires Page
     '/campfires-discover': {
      route: '/campfires/discover',
      storageKey: 'campfires-discover',
      title: 'Discover Campfires',
      description: 'Discover new campfires:',
      features: [
        {
          icon: PackageSearch,
          title: 'Find campfires',
          description: 'Find campfires based on your interests'
        },
        {
          icon: SlidersHorizontal,
          title: 'Search and Filter',
          description: 'Search campfire name or filter by purpose'
        },
        {
          icon: CirclePlus,
          title: 'Join campfire',
          description: 'Join campfire by clicking the join button'
        }
      ],
      hasStepByStep: true
    },
  };
  
  // Helper function to get config by route
  export const getFeatureModalConfig = (route: string): FeatureModalConfig | null => {
    return featureModalConfigs[route] || null;
  };