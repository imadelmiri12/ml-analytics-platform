"use client"

import { useState } from "react"
import { Sliders, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"

const API_URL = "/api"

interface DataPreprocessingProps {
  datasetId: string
  datasetStats: any
  onPreprocessed: (newDatasetId: string) => void
}

export default function DataPreprocessing({ datasetId, datasetStats, onPreprocessed }: DataPreprocessingProps) {
  const [loading, setLoading] = useState(false)
  const [missingValueStrategy, setMissingValueStrategy] = useState<string>("mean")
  const [normalize, setNormalize] = useState(false)
  const [encodeLabels, setEncodeLabels] = useState(true)
  const { toast } = useToast()

  const hasMissingValues =
    datasetStats?.missing_values && Object.values(datasetStats.missing_values).some((v: any) => v > 0)

  const handlePreprocess = async () => {
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/preprocess-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset_id: datasetId,
          operations: {
            missing_values: missingValueStrategy,
            normalize: normalize,
            encode_labels: encodeLabels,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Preprocessing failed")
      }

      const data = await response.json()

      toast({
        title: "Data preprocessed successfully",
        description: "Your dataset has been cleaned and transformed",
      })

      onPreprocessed(data.dataset_id)
    } catch (error: any) {
      toast({
        title: "Preprocessing failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const missingValuesCount = datasetStats?.missing_values
    ? Object.entries(datasetStats.missing_values).filter(([_, count]: [string, any]) => count > 0).length
    : 0

  return (
    <Card className="border-gray-200 bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sliders className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-gray-900">Data Preprocessing</CardTitle>
        </div>
        <CardDescription className="text-gray-600">
          Clean and transform your data for better model performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {hasMissingValues && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-gray-700">
              {missingValuesCount} column{missingValuesCount > 1 ? "s have" : " has"} missing values. Preprocessing is
              recommended before training.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {/* Missing Values Strategy */}
          <div className="space-y-2">
            <Label htmlFor="missing-values" className="text-gray-700">
              Missing Values Strategy
            </Label>
            <Select value={missingValueStrategy} onValueChange={setMissingValueStrategy}>
              <SelectTrigger id="missing-values" className="bg-white border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mean">Replace with Mean (numeric)</SelectItem>
                <SelectItem value="median">Replace with Median (numeric)</SelectItem>
                <SelectItem value="mode">Replace with Mode (most frequent)</SelectItem>
                <SelectItem value="drop">Drop rows with missing values</SelectItem>
                <SelectItem value="forward_fill">Forward Fill (use previous value)</SelectItem>
                <SelectItem value="backward_fill">Backward Fill (use next value)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-500">How to handle missing values in your dataset</p>
          </div>

          {/* Normalize/Standardize */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="normalize" className="text-gray-700">
                Normalize Data
              </Label>
              <p className="text-xs text-gray-500">Scale numeric features to standard range (0-1)</p>
            </div>
            <Switch id="normalize" checked={normalize} onCheckedChange={setNormalize} />
          </div>

          {/* Encode Labels */}
          <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="encode" className="text-gray-700">
                Encode Categorical Variables
              </Label>
              <p className="text-xs text-gray-500">Convert text categories to numeric values</p>
            </div>
            <Switch id="encode" checked={encodeLabels} onCheckedChange={setEncodeLabels} />
          </div>
        </div>

        {/* Dataset Info */}
        {datasetStats && (
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h4 className="mb-3 font-semibold text-gray-900">Current Dataset Info</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Total Rows</p>
                <p className="text-lg font-bold text-gray-900">{datasetStats.shape[0]}</p>
              </div>
              <div>
                <p className="text-gray-500">Total Columns</p>
                <p className="text-lg font-bold text-gray-900">{datasetStats.shape[1]}</p>
              </div>
              <div>
                <p className="text-gray-500">Numeric Columns</p>
                <p className="text-lg font-bold text-gray-900">{datasetStats.numeric_columns?.length || 0}</p>
              </div>
              <div>
                <p className="text-gray-500">Categorical Columns</p>
                <p className="text-lg font-bold text-gray-900">{datasetStats.categorical_columns?.length || 0}</p>
              </div>
            </div>

            {missingValuesCount > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">Columns with missing values:</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(datasetStats.missing_values)
                    .filter(([_, count]: [string, any]) => count > 0)
                    .map(([col, count]: [string, any]) => (
                      <span
                        key={col}
                        className="rounded-md bg-red-50 border border-red-200 px-2 py-1 text-xs text-red-600"
                      >
                        {col}: {count}
                      </span>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Button
          onClick={handlePreprocess}
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Apply Preprocessing
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
