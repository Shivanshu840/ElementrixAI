import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import { prisma } from "@/lib/prisma"

// Helper function to extract JSON from markdown
function extractJsonFromMarkdown(text: string): string {
  console.log("Original text:", text)

  let cleanedText = text.trim()

  // Remove markdown code blocks with various formats
  const patterns = [/^```json\s*([\s\S]*?)\s*```$/, /^```\s*([\s\S]*?)\s*```$/, /^`([\s\S]*?)`$/]

  for (const pattern of patterns) {
    const match = cleanedText.match(pattern)
    if (match) {
      cleanedText = match[1].trim()
      console.log("Extracted from markdown:", cleanedText)
      break
    }
  }

  return cleanedText
}

// Helper function to validate and fix JSON structure
function validateAndFixResponse(data: any): any {
  if (!data || typeof data !== "object") {
    return {
      message: "Invalid response format",
      component: null,
    }
  }

  // Ensure message exists
  if (!data.message || typeof data.message !== "string") {
    data.message = "Component generated successfully"
  }

  // Validate component structure if it exists
  if (data.component) {
    if (!data.component.name || typeof data.component.name !== "string") {
      data.component.name = "GeneratedComponent"
    }
    if (!data.component.jsxCode || typeof data.component.jsxCode !== "string") {
      data.component.jsxCode = "// Component code not available"
    }
    if (!data.component.cssCode) {
      data.component.cssCode = "/* No CSS provided */"
    }
    if (!data.component.version || typeof data.component.version !== "number") {
      data.component.version = 1
    }
  }

  return data
}

export async function POST(request: NextRequest) {
  console.log("🚀 Chat API called")

  try {
    // 1. Check API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("❌ Missing GOOGLE_GENERATIVE_AI_API_KEY")
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 })
    }

    // 2. Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.error("❌ No session found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("✅ Session found for user:", session.user.id)

    // 3. Parse request body
    let body
    try {
      body = await request.json()
    } catch (error) {
      console.error("❌ Invalid JSON in request body:", error)
      return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
    }

    const { message, sessionId } = body

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      console.error("❌ Invalid message:", message)
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("📝 Processing message:", message.substring(0, 50) + "...")
    console.log("📁 Session ID:", sessionId)

    // 4. Create system prompt
    const systemPrompt = `You are a React component generator. You must respond with valid JSON in this exact format with NO markdown code blocks:

{
  "message": "Brief description of what you created",
  "component": {
    "name": "ComponentName",
    "jsxCode": "Complete React component code as plain text",
    "cssCode": "CSS styles as plain text",
    "version": 1
  }
}

CRITICAL RULES:
- Return ONLY valid JSON, no markdown formatting
- jsxCode must be plain React/TypeScript code without any backticks or markdown
- cssCode must be plain CSS without any backticks or markdown
- Use functional React components with proper TypeScript interfaces
- Make components responsive and accessible
- Do not wrap code in \`\`\`typescript or \`\`\`css blocks
- If you can't create a component, set component to null

Example of correct jsxCode format:
"jsxCode": "import React, { useState } from 'react';\n\nconst MyComponent = () => {\n  return <div>Hello World</div>;\n};\n\nexport default MyComponent;"
`

    // 5. Call Gemini API
    console.log("🤖 Calling Gemini API...")
    let aiResponse
    try {
      const result = await generateText({
        model: google("gemini-1.5-flash"),
        system: systemPrompt,
        prompt: message,
        temperature: 0.7,
        maxTokens: 2000,
      })
      aiResponse = result.text
      console.log("✅ Gemini response received")
    } catch (aiError) {
      console.error("❌ Gemini API error:", aiError)
      return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 503 })
    }

    // 6. Parse AI response
    let responseData
    try {
      // Clean the response (remove code blocks if present)
      let cleanResponse = aiResponse.trim()

      // Remove markdown code blocks
      if (cleanResponse.startsWith("```json")) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, "").replace(/\s*```$/, "")
      } else if (cleanResponse.startsWith("```")) {
        cleanResponse = cleanResponse.replace(/^```\s*/, "").replace(/\s*```$/, "")
      }

      responseData = JSON.parse(cleanResponse)
      console.log("✅ Successfully parsed AI response")
    } catch (parseError) {
      console.error("❌ Failed to parse AI response:", parseError)
      console.log("Raw AI response:", aiResponse)

      // Fallback response
      responseData = {
        message: "I created a component based on your request, but there was a formatting issue.",
        component: {
          name: "GeneratedComponent",
          jsxCode: `// Component generated from: ${message}\nfunction GeneratedComponent() {\n  return <div>Component generated successfully</div>\n}\n\nexport default GeneratedComponent`,
          cssCode: "/* Add your styles here */",
          version: 1,
        },
      }
    }

    // 7. Validate response structure
    responseData = validateAndFixResponse(responseData)
    console.log("Final response data:", responseData)

    // 8. Save to database if session exists
    if (sessionId && responseData.component) {
      try {
        // sessionId is already a string, no conversion needed here based on your schema
        console.log("💾 Saving to database...")

        // Save chat messages
        await prisma.chatMessage.createMany({
          data: [
            {
              sessionId: sessionId, // Use sessionId directly as a string
              role: "user",
              content: message,
            },
            {
              sessionId: sessionId, // Use sessionId directly as a string
              role: "assistant",
              content: responseData.message,
            },
          ],
        })

        // Save component
        if (responseData.component.jsxCode !== "// Component code not available") {
          const component = await prisma.component.create({
            data: {
              sessionId: sessionId, // Use sessionId directly as a string
              name: responseData.component.name,
              jsxCode: responseData.component.jsxCode,
              cssCode: responseData.component.cssCode || "",
              version: responseData.component.version || 1,
            },
          })

          responseData.component.id = component.id.toString()
          console.log("✅ Component saved with ID:", component.id)
        }

        console.log("✅ Data saved to database")
      } catch (dbError) {
        console.error("❌ Database error (continuing anyway):", dbError)
      }
    }

    console.log("🎉 Chat API completed successfully")
    return NextResponse.json(responseData)
  } catch (error) {
    console.error("💥 Unexpected error in chat API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
