"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, CheckCircle } from "lucide-react"

export function UploadCard() {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0 && files[0].name.endsWith(".csv")) {
      setUploadedFile(files[0].name)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploadedFile(files[0].name)
    }
  }

  return (
    <Card className="bg-slate-900/50 backdrop-blur-xl border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg">
            <Upload className="w-4 h-4 text-white" />
          </div>
          📤 Upload CSV Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
            isDragOver
              ? "border-cyan-400 bg-cyan-400/10"
              : uploadedFile
                ? "border-green-400 bg-green-400/10"
                : "border-slate-600 hover:border-slate-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <div className="space-y-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <div>
                <p className="text-green-400 font-medium">File uploaded successfully!</p>
                <p className="text-slate-400 text-sm mt-1">{uploadedFile}</p>
              </div>
              <Button onClick={() => setUploadedFile(null)} className="bg-slate-700 hover:bg-slate-600 text-white">
                Upload Another File
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white font-medium">Drop your CSV file here</p>
                <p className="text-slate-400 text-sm mt-1">Upload airline booking data (.csv) to visualize instantly</p>
              </div>
              <div className="space-y-2">
                <input type="file" accept=".csv" onChange={handleFileSelect} className="hidden" id="csv-upload" />
                <label htmlFor="csv-upload">
                  <Button
                    asChild
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white cursor-pointer"
                  >
                    <span>
                      <FileText className="w-4 h-4 mr-2" />📤 Import Data
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-slate-500">Expected columns: Date, Origin, Destination, Bookings, Price</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
