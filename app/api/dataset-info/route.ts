import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  console.log("[v0] API Route: Getting dataset info")

  try {
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000"

    const response = await fetch(`${pythonBackendUrl}/api/dataset-info`)
    const data = await response.json()

    console.log("[v0] API Route: Dataset info received")
    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API Route: Error:", error)
    return NextResponse.json(
      { error: `Failed to get dataset info: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
