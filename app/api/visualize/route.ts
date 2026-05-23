import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  console.log("[v0] API Route: Generating visualization (POST)")

  try {
    const body = await request.json()
    const { type, dataset_id, columns } = body

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000"

    const response = await fetch(`${pythonBackendUrl}/api/visualize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataset_id,
        type,
        columns,
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
      { error: `Failed to generate visualization: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  console.log("[v0] API Route: Getting visualization (GET)")

  try {
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const datasetId = searchParams.get("dataset_id")
    const columnsParam = searchParams.get("columns")
    const columns = columnsParam ? JSON.parse(columnsParam) : []

    const pythonBackendUrl = process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000"

    const response = await fetch(`${pythonBackendUrl}/api/visualize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dataset_id: datasetId,
        type: type,
        columns: columns,
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
      { error: `Failed to get visualization: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
