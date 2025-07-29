import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { RedisCache } from "@/lib/redis"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionId = Number.parseInt(params.id)

    // Check Redis cache first
    const cachedSession = await RedisCache.get(`session:${sessionId}`)
    if (cachedSession && cachedSession.userId === Number.parseInt(session.user.id)) {
      return NextResponse.json({ session: cachedSession })
    }

    const sessionData = await prisma.session.findFirst({
      where: {
        id: sessionId,
        userId: Number.parseInt(session.user.id),
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
    })

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Cache the session data
    await RedisCache.set(`session:${sessionId}`, sessionData, 3600)

    // Cache chat history separately for faster access
    await RedisCache.set(`chat_history:${session.user.id}:${sessionId}`, sessionData.messages, 3600)

    return NextResponse.json({ session: sessionData })
  } catch (error) {
    console.error("Session GET error:", error)
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, description } = await request.json()
    const sessionId = Number.parseInt(params.id)

    const updatedSession = await prisma.session.update({
      where: {
        id: sessionId,
        userId: Number.parseInt(session.user.id),
      },
      data: {
        title,
        description,
        updatedAt: new Date(),
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
    })

    // Update cache
    await RedisCache.set(`session:${sessionId}`, updatedSession, 3600)

    // Invalidate user sessions cache
    await RedisCache.del(`user_sessions:${session.user.id}`)

    return NextResponse.json({ session: updatedSession })
  } catch (error) {
    console.error("Session PUT error:", error)
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sessionId = Number.parseInt(params.id)

    await prisma.session.delete({
      where: {
        id: sessionId,
        userId: Number.parseInt(session.user.id),
      },
    })

    // Clear related cache entries
    await RedisCache.del(`session:${sessionId}`)
    await RedisCache.del(`chat_history:${session.user.id}:${sessionId}`)
    await RedisCache.del(`user_sessions:${session.user.id}`)

    return NextResponse.json({ message: "Session deleted successfully" })
  } catch (error) {
    console.error("Session DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 })
  }
}
