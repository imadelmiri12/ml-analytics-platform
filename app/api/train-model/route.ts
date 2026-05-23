import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] API Route: Training model request")

  try {
    const body = await request.json()
    console.log("[v0] API Route: Training config:", body)

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000"

    const response = await fetch(`${pythonBackendUrl}/api/train`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    console.log("[v0] API Route: Training complete, visualization included:", !!data.visualization)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API Route: Error:", error)
    return NextResponse.json(
      { error: `Failed to train model: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
