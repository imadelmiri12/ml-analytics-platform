"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const API_URL = "/api"

interface ResultsViewProps {
  modelId: string
  datasetId: string
  initialVisualization?: string
  initialMetrics?: any
  initialVisualizations?: string[]
}

export default function ResultsView({
  modelId,
  datasetId,
  initialVisualization,
  initialMetrics,
  initialVisualizations,
}: ResultsViewProps) {
  const [visualizations, setVisualizations] = useState<string[]>(
    initialVisualizations || (initialVisualization ? [initialVisualization] : []),
  )
  const [metrics, setMetrics] = useState<any>(initialMetrics || null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (!initialVisualizations && !initialMetrics && !initialVisualization) {
      evaluateModel()
    }
  }, [modelId, datasetId])

  useEffect(() => {
    if (initialVisualizations && initialVisualizations.length > 0) {
      setVisualizations(initialVisualizations)
    } else if (initialVisualization) {
      setVisualizations([initialVisualization])
    }
  }, [initialVisualizations, initialVisualization])

  useEffect(() => {
    if (initialMetrics) {
      setMetrics(initialMetrics)
    }
  }, [initialMetrics])

  const evaluateModel = async () => {
    setLoading(true)
    try {
      const pythonBackendUrl = process.env.NEXT_PUBLIC_PYTHON_BACKEND_URL || "http://127.0.0.1:5000"
      const response = await fetch(`${pythonBackendUrl}/api/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_id: modelId,
          dataset_id: datasetId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setVisualizations(data.visualizations || [data.visualization])
        setMetrics(data.metrics)
      } else {
        throw new Error(data.error || "Evaluation failed")
      }
    } catch (error: any) {
      toast({
        title: "Evaluation failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const exportResults = async () => {
    try {
      const response = await fetch(`${API_URL}/export-model`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_id: modelId }),
      })

      const data = await response.json()

      if (response.ok) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json;charset=utf-8" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.style.display = "none"
        a.href = url
        a.download = `model_results_${modelId}.json`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)

        toast({
          title: "Results exported",
          description: "Model results have been downloaded",
        })
      } else {
        throw new Error(data.error || "Export failed")
      }
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gray-900">Model Evaluation Results</CardTitle>
              <CardDescription className="text-gray-600">
                Performance metrics and comprehensive visualizations for your trained model
              </CardDescription>
            </div>
            <Button
              onClick={exportResults}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {metrics && (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Object.entries(metrics).map(([key, value]: [string, any]) => (
                <div
                  key={key}
                  className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-teal-50 p-4 shadow-sm"
                >
                  <p className="text-sm capitalize text-gray-600">{key.replace(/_/g, " ")}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {typeof value === "number" ? value.toFixed(4) : value}
                  </p>
                </div>
              ))}
            </div>
          )}

          {visualizations.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Comprehensive Model Analysis</h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {visualizations.map((viz, index) => (
                  <div key={index} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <img
                      src={viz || "/placeholder.svg"}
                      alt={`Model visualization ${index + 1}`}
                      className="w-full rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                <p className="text-sm text-gray-600">Evaluating model and generating comprehensive visualizations...</p>
              </div>
            </div>
          )}

          {!loading && visualizations.length === 0 && (
            <div className="flex items-center justify-center p-12">
              <p className="text-sm text-gray-600">
                No visualization available yet. Train a model to see comprehensive results.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
