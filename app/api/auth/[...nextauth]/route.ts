import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcrypt'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Demo credentials for immediate testing
        const demoUsers = [
          {
            id: '1',
            email: 'admin@prostudio.ai',
            password: 'ProStudio2025!',
            name: 'Admin User',
            userType: 'admin' as const,
            subscriptionTier: 'enterprise',
            subscriptionStatus: 'active'
          },
          {
            id: '2',
            email: 'teacher@prostudio.ai',
            password: 'Teacher2025!',
            name: 'Teacher User',
            userType: 'teacher' as const,
            subscriptionTier: 'professional',
            subscriptionStatus: 'active'
          },
          {
            id: '3',
            email: 'student@prostudio.ai',
            password: 'Student2025!',
            name: 'Student User',
            userType: 'student' as const,
            subscriptionTier: 'basic',
            subscriptionStatus: 'active'
          }
        ]

        const user = demoUsers.find(u => u.email === credentials.email && u.password === credentials.password)
        
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            userType: user.userType,
            subscriptionTier: user.subscriptionTier,
            subscriptionStatus: user.subscriptionStatus,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.userType = user.userType
        token.subscriptionTier = user.subscriptionTier
        token.subscriptionStatus = user.subscriptionStatus
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.sub
        session.user.userType = token.userType
        session.user.subscriptionTier = token.subscriptionTier
        session.user.subscriptionStatus = token.subscriptionStatus
      }
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  secret: process.env.NEXTAUTH_SECRET || 'prostudio-secret-key-2025',
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }