import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { FallbackCache } from "@/lib/cache"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = Number.parseInt(session.user.id)

    // Check cache first
    const cachedSessions = await FallbackCache.get(`user_sessions:${session.user.id}`)
    if (cachedSessions) {
      return NextResponse.json({ sessions: cachedSessions })
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId: userId,
      },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        components: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    // Cache the sessions
    await FallbackCache.set(`user_sessions:${session.user.id}`, sessions, 600)

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Sessions GET error:", error)
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description } = await request.json()

    const newSession = await prisma.session.create({
      data: {
        userId: Number.parseInt(session.user.id),
        title,
        description,
      },
    })

    // Invalidate cached user sessions
    await FallbackCache.del(`user_sessions:${session.user.id}`)

    // Cache the new session
    await FallbackCache.set(`session:${newSession.id}`, newSession, 3600)

    return NextResponse.json({ session: newSession })
  } catch (error) {
    console.error("Sessions POST error:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }
}
