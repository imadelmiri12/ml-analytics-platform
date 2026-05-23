import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] API Route: Exporting model results")

  try {
    const body = await request.json()
    const { model_id } = body

    if (!model_id) {
      return NextResponse.json({ error: "model_id is required" }, { status: 400 })
    }

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000"

    const response = await fetch(`${pythonBackendUrl}/api/export-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Python backend error:", data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API Route: Error:", error)
    return NextResponse.json(
      { error: `Failed to export model: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  console.log("[v0] API Route: Getting model export (GET)")

  try {
    const searchParams = request.nextUrl.searchParams
    const modelId = searchParams.get("model_id")

    if (!modelId) {
      return NextResponse.json({ error: "model_id is required" }, { status: 400 })
    }

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000"

    const response = await fetch(`${pythonBackendUrl}/api/export-results`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_id: modelId,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("[v0] Python backend error:", data)
      return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API Route: Error:", error)
    return NextResponse.json(
      { error: `Failed to export model: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
