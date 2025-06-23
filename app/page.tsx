import React from 'react'
import { ProStudioDashboard } from '@/components/dashboard/ProStudioDashboard'

export default async function HomePage() {
  // Direct access to dashboard - no authentication required
  return <ProStudioDashboard />
}

export const metadata = {
  title: 'ProStudio - AI-Powered Multimedia Creation Platform',
  description: 'Revolutionary self-hosted AI technology for music production, video creation, and immersive media.',
}