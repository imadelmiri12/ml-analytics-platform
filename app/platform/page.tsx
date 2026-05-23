"use client"

import { useState } from "react"
import { Upload, Database, BarChart3, Brain, Download, Sliders, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DataUpload from "@/components/data-upload"
import DataPreprocessing from "@/components/data-preprocessing"
import DataVisualization from "@/components/data-visualization"
import ModelTraining from "@/components/model-training"
import ResultsView from "@/components/results-view"
import Link from "next/link"

export default function MLPlatform() {
  const [activeTab, setActiveTab] = useState("upload")
  const [datasetId, setDatasetId] = useState<string | null>(null)
  const [modelId, setModelId] = useState<string | null>(null)
  const [datasetStats, setDatasetStats] = useState<any>(null)
  const [trainingResults, setTrainingResults] = useState<{
    visualization?: string
    visualizations?: string[]
    metrics?: any
  } | null>(null)

  const handleDocumentation = () => {
    window.open("/README.md", "_blank")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-teal-600">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ML Platform</h1>
                <p className="text-xs text-gray-600">Machine Learning Analysis Tool</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleDocumentation}>
                <Download className="mr-2 h-4 w-4" />
                Documentation
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100 lg:w-auto lg:inline-grid">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="preprocess" className="gap-2" disabled={!datasetId}>
              <Sliders className="h-4 w-4" />
              <span className="hidden sm:inline">Preprocess</span>
            </TabsTrigger>
            <TabsTrigger value="visualize" className="gap-2" disabled={!datasetId}>
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Visualize</span>
            </TabsTrigger>
            <TabsTrigger value="train" className="gap-2" disabled={!datasetId}>
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">Train</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2" disabled={!modelId}>
              <Database className="h-4 w-4" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="upload" className="space-y-4">
              <DataUpload
                onDatasetUploaded={(id, stats) => {
                  setDatasetId(id)
                  setDatasetStats(stats)
                  setActiveTab("preprocess")
                }}
              />
            </TabsContent>

            <TabsContent value="preprocess" className="space-y-4">
              {datasetId && (
                <DataPreprocessing
                  datasetId={datasetId}
                  datasetStats={datasetStats}
                  onPreprocessed={(newId) => {
                    setDatasetId(newId)
                    setActiveTab("visualize")
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="visualize" className="space-y-4">
              {datasetId && (
                <DataVisualization
                  datasetId={datasetId}
                  datasetStats={datasetStats}
                  onNext={() => setActiveTab("train")}
                />
              )}
            </TabsContent>

            <TabsContent value="train" className="space-y-4">
              {datasetId && (
                <ModelTraining
                  datasetId={datasetId}
                  datasetStats={datasetStats}
                  onModelTrained={(id, results) => {
                    setModelId(id)
                    setTrainingResults(results)
                    setActiveTab("results")
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="results" className="space-y-4">
              {modelId && datasetId && (
                <ResultsView
                  modelId={modelId}
                  datasetId={datasetId}
                  initialVisualization={trainingResults?.visualization}
                  initialMetrics={trainingResults?.metrics}
                  initialVisualizations={trainingResults?.visualizations}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </main>
    </div>
  )
}
