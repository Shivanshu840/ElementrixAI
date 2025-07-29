import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
// Removed the Prisma adapter import
// import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import { RedisCache } from "./redis"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  // Removed the adapter line
  // adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Check Redis cache first
          const cachedUser = await RedisCache.get(`user:${credentials.email}`)
          if (cachedUser && cachedUser.passwordHash) {
            const isPasswordValid = await bcrypt.compare(credentials.password, cachedUser.passwordHash)
            if (isPasswordValid) {
              return {
                id: cachedUser.id.toString(),
                email: cachedUser.email,
                name: cachedUser.name,
              }
            }
          }

          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          })

          if (!user || !user.passwordHash) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            return null
          }

          // Cache user data
          await RedisCache.set(`user:${user.email}`, user, 3600)

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name

        // Cache user session data
        try {
          await RedisCache.cacheSession(user.id, {
            id: user.id,
            email: user.email,
            name: user.name,
            provider: account?.provider || "credentials",
          })
        } catch (error) {
          console.error("Failed to cache session:", error)
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string

        // Try to get additional user data from cache
        try {
          const cachedSession = await RedisCache.getCachedSession(token.id as string)
          if (cachedSession) {
            session.user.provider = cachedSession.provider
          }
        } catch (error) {
          console.error("Failed to get cached session:", error)
        }
      }
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        // Cache OAuth user data
        if (account?.provider !== "credentials" && user.email) {
          await RedisCache.set(
            `user:${user.email}`,
            {
              id: user.id,
              email: user.email,
              name: user.name,
              provider: account?.provider,
            },
            3600,
          )
        }
      } catch (error) {
        console.error("Failed to cache user data on sign in:", error)
      }
      return true
    },
  },
  events: {
    async signOut({ token }) {
      try {
        // Clear user cache on signout
        if (token?.id) {
          await RedisCache.invalidateUserCache(token.id as string)
        }
      } catch (error) {
        console.error("Failed to clear cache on sign out:", error)
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
