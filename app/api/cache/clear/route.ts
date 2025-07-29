import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { RedisCache } from "@/lib/redis"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Clear user-specific cache
    const success = await RedisCache.invalidateUserCache(session.user.id)

    if (success) {
      return NextResponse.json({ message: "User cache cleared successfully" })
    } else {
      return NextResponse.json({ message: "Cache clear completed with some errors" })
    }
  } catch (error) {
    console.error("Cache clear error:", error)
    return NextResponse.json({ error: "Failed to clear cache" }, { status: 500 })
  }
}
