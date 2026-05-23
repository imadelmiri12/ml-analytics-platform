"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowRight, BarChart3 } from "lucide-react"

const API_URL = "/api"

interface DataVisualizationProps {
  datasetId: string
  datasetStats: any
  onNext: () => void
}

export default function DataVisualization({ datasetId, datasetStats, onNext }: DataVisualizationProps) {
  const [vizType, setVizType] = useState("correlation")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const generateVisualization = async () => {
    setLoading(true)
    try {
      console.log("[v0] Generating visualization:", { datasetId, vizType })

      const response = await fetch(`${API_URL}/visualize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset_id: datasetId,
          type: vizType,
          columns: datasetStats?.columns || [],
        }),
      })

      const data = await response.json()
      console.log("[v0] Visualization response:", data)

      if (response.ok) {
        setImageUrl(data.image)
        toast({
          title: "Visualization generated",
          description: "Your data visualization is ready",
        })
      } else {
        throw new Error(data.error || "Visualization failed")
      }
    } catch (error: any) {
      console.error("[v0] Visualization error:", error)
      toast({
        title: "Visualization failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-gray-900">Data Visualization</CardTitle>
          </div>
          <CardDescription className="text-gray-600">
            Explore your data through interactive visualizations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Select value={vizType} onValueChange={setVizType}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white border-gray-300">
                <SelectValue placeholder="Select visualization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="correlation">Correlation Matrix</SelectItem>
                <SelectItem value="distribution">Distribution</SelectItem>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={generateVisualization}
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              {loading ? "Generating..." : "Generate Visualization"}
            </Button>
          </div>

          {imageUrl && (
            <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <img src={imageUrl || "/placeholder.svg"} alt="Data visualization" className="w-full rounded-lg" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
        >
          Continue to Model Training
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
