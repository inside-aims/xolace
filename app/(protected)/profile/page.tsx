import React from 'react'
import type { Metadata } from 'next'

import Profile from './Profile'

export const metadata: Metadata = {
  title: 'Profile',
  description: "Explore user profiles, view earned badges, and track reputation scores across our supportive mental health community."
}

const ProfilePage = () => {
  return (
    <Profile />
  )
}

export default ProfilePage