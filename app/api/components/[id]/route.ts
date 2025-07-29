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

    const componentId = Number.parseInt(params.id)

    // Check Redis cache first
    const cachedComponent = await RedisCache.getCachedComponent(componentId.toString())
    if (cachedComponent) {
      return NextResponse.json({ component: cachedComponent })
    }

    const component = await prisma.component.findFirst({
      where: {
        id: componentId,
        session: {
          userId: Number.parseInt(session.user.id),
        },
      },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!component) {
      return NextResponse.json({ error: "Component not found" }, { status: 404 })
    }

    // Cache the component
    await RedisCache.cacheComponent(componentId.toString(), component)

    return NextResponse.json({ component })
  } catch (error) {
    console.error("Component GET error:", error)
    return NextResponse.json({ error: "Failed to fetch component" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { jsxCode, cssCode, changeDescription } = await request.json()
    const componentId = Number.parseInt(params.id)

    // Get current component
    const currentComponent = await prisma.component.findFirst({
      where: {
        id: componentId,
        session: {
          userId: Number.parseInt(session.user.id),
        },
      },
    })

    if (!currentComponent) {
      return NextResponse.json({ error: "Component not found" }, { status: 404 })
    }

    // Create version history
    await prisma.componentVersion.create({
      data: {
        componentId: componentId,
        jsxCode: currentComponent.jsxCode,
        cssCode: currentComponent.cssCode,
        versionNumber: currentComponent.version,
        changeDescription: changeDescription || `Version ${currentComponent.version}`,
      },
    })

    // Update component
    const updatedComponent = await prisma.component.update({
      where: { id: componentId },
      data: {
        jsxCode,
        cssCode,
        version: currentComponent.version + 1,
      },
      include: {
        versions: {
          orderBy: { createdAt: "desc" },
        },
      },
    })

    // Update cache
    await RedisCache.cacheComponent(componentId.toString(), updatedComponent)

    // Invalidate related session cache
    await RedisCache.del(`session:${currentComponent.sessionId}`)

    return NextResponse.json({ component: updatedComponent })
  } catch (error) {
    console.error("Component PUT error:", error)
    return NextResponse.json({ error: "Failed to update component" }, { status: 500 })
  }
}
