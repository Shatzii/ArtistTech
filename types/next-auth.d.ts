import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      userType: 'admin' | 'teacher' | 'student'
      subscriptionTier: string
      subscriptionStatus: string
    }
  }

  interface User {
    id: string
    email: string
    name: string
    userType: 'admin' | 'teacher' | 'student'
    subscriptionTier: string
    subscriptionStatus: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userType: 'admin' | 'teacher' | 'student'
    subscriptionTier: string
    subscriptionStatus: string
  }
}