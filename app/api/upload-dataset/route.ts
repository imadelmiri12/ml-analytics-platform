import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] API Route: Received upload request")

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] API Route: File received:", file.name)

    // Forward to Python backend
    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000"
    const pythonFormData = new FormData()
    pythonFormData.append("file", file)

    console.log("[v0] API Route: Forwarding to Python backend:", `${pythonBackendUrl}/api/upload-dataset`)

    const response = await fetch(`${pythonBackendUrl}/api/upload-dataset`, {
      method: "POST",
      body: pythonFormData,
    })

    const data = await response.json()
    console.log("[v0] API Route: Response from Python:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] API Route: Error:", error)
    return NextResponse.json(
      { error: `Failed to upload dataset: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
