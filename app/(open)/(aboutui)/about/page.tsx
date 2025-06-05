"use client"

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMediaQuery } from '@/hooks/use-media-query'
import AboutPage from './AboutPage'

const About = () => {
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const router = useRouter()

    useEffect(() => {
        if (isDesktop) {
            router.replace('/about/general')
        }
    }, [isDesktop, router])

    return !isDesktop ? <AboutPage /> : null
}

export default About