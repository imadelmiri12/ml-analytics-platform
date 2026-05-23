"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const API_URL = "/api"

interface DataUploadProps {
  onDatasetUploaded: (datasetId: string, stats: any) => void
}

export default function DataUpload({ onDatasetUploaded }: DataUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<any>(null)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[v0] File input changed")
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      console.log("[v0] File selected:", selectedFile.name)
      setFile(selectedFile)
      setStats(null)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    console.log("[v0] File dropped")

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.name.endsWith(".csv")) {
        console.log("[v0] Valid CSV file dropped:", droppedFile.name)
        setFile(droppedFile)
        setStats(null)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file",
          variant: "destructive",
        })
      }
    }
  }

  const handleClick = () => {
    console.log("[v0] Upload area clicked")
    fileInputRef.current?.click()
  }

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to upload",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Starting upload for file:", file.name)
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    const datasetId = `dataset_${Date.now()}`
    formData.append("dataset_id", datasetId)

    try {
      console.log("[v0] Sending request to:", `${API_URL}/upload-dataset`)
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000)

      const response = await fetch(`${API_URL}/upload-dataset`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] Error response:", errorText)
        throw new Error(`Server error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log("[v0] Response data:", data)

      setStats(data.stats)
      toast({
        title: "Dataset uploaded successfully",
        description: `Loaded ${data.stats.shape[0]} rows and ${data.stats.shape[1]} columns`,
      })
      console.log("[v0] Passing dataset stats to parent:", data.dataset_id)
      onDatasetUploaded(data.dataset_id, data.stats)
    } catch (error: any) {
      console.error("[v0] Upload error:", error)

      const errorMessage = "Upload failed"
      let errorDescription = error.message

      if (error.name === "AbortError") {
        errorDescription = "Upload timed out. The file might be too large or the server is not responding."
      } else if (error.message === "Failed to fetch") {
        errorDescription =
          "Cannot connect to backend. Please check:\n1. Python server is running (python scripts/api_backend.py)\n2. Server is running on http://localhost:5000"
      }

      toast({
        title: errorMessage,
        description: errorDescription,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFile = () => {
    console.log("[v0] Removing file")
    setFile(null)
    setStats(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="text-gray-900">Upload Dataset</CardTitle>
          <CardDescription className="text-gray-600">
            Upload a CSV file containing your data for analysis and machine learning
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            onClick={handleClick}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
              dragActive
                ? "border-blue-600 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-gray-100"
            }`}
          >
            <Upload className="mb-4 h-12 w-12 text-gray-400" />
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold text-gray-900">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV files only</p>
          </div>

          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileChange} className="hidden" />

          {file && (
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="flex-1 text-sm text-gray-900">{file.name}</span>
              <Button onClick={handleRemoveFile} variant="ghost" size="sm">
                <X className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleUpload}
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {stats && (
        <Card className="border-gray-200 bg-white">
          <CardHeader>
            <CardTitle className="text-gray-900">Dataset Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                <p className="text-sm text-gray-600">Rows</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shape[0]}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-teal-50 to-teal-100 p-4">
                <p className="text-sm text-gray-600">Columns</p>
                <p className="text-2xl font-bold text-gray-900">{stats.shape[1]}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                <p className="text-sm text-gray-600">Numeric</p>
                <p className="text-2xl font-bold text-gray-900">{stats.numeric_columns.length}</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-orange-50 to-orange-100 p-4">
                <p className="text-sm text-gray-600">Categorical</p>
                <p className="text-2xl font-bold text-gray-900">{stats.categorical_columns.length}</p>
              </div>
            </div>

            {Object.values(stats.missing_values).some((v: any) => v > 0) && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-800">
                  Missing values detected in some columns. Consider preprocessing your data.
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h4 className="mb-2 font-semibold text-gray-900">Columns</h4>
              <div className="flex flex-wrap gap-2">
                {stats.columns.map((col: string) => (
                  <span
                    key={col}
                    className="rounded-md border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-700"
                  >
                    {col}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
