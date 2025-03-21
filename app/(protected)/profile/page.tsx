import React from 'react'
import type { Metadata } from 'next'

import Profile from './Profile'

export const metadata: Metadata = {
  title: 'Profile',
}

const ProfilePage = () => {
  return (
    <Profile />
  )
}

export default ProfilePage