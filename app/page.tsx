import React from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { ProStudioDashboard } from '@/components/dashboard/ProStudioDashboard'
import { LandingPage } from '@/components/landing/LandingPage'

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return <LandingPage />
  }

  return <ProStudioDashboard />
}

export const metadata = {
  title: 'ProStudio - AI-Powered Multimedia Creation Platform',
  description: 'Revolutionary self-hosted AI technology for music production, video creation, and immersive media.',
}