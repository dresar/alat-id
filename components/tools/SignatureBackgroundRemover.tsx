'use client'

import { useState, useRef } from 'react'
import { PenTool, Upload, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function SignatureBackgroundRemover() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processedUrl, setProcessedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile)
      setError(null)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setError('Please select a valid image file')
    }
  }

  const processImage = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('action', 'remove-background')

      const response = await fetch('/api/remove-signature-background', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setProcessedUrl(url)
    } catch (err) {
      setError('Failed to process image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (processedUrl) {
      const a = document.createElement('a')
      a.href = processedUrl
      a.download = 'signature-transparent.png'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setProcessedUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 Tips: Upload foto tanda tangan di kertas putih untuk hasil terbaik. Tool ini akan menghapus background putih dan membuat transparan.
        </p>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label htmlFor="file-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <PenTool className="h-4 w-4" />
          Pilih Foto Tanda Tangan
        </label>
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center">
          <input
            ref={fileInputRef}
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              Klik untuk upload atau drag & drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG, JPEG hingga 10MB
            </p>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Preview and Result */}
      <div className="grid md:grid-cols-2 gap-4">
        {preview && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview Original
            </label>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
              <img
                src={preview}
                alt="Original"
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>
        )}

        {processedUrl && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hasil (Transparan)
            </label>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800" style={{ backgroundImage: 'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)', backgroundSize: '20px 20px' }}>
              <img
                src={processedUrl}
                alt="Processed"
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={processImage}
          disabled={!file || loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <PenTool className="h-4 w-4 mr-2" />
              Hapus Background
            </>
          )}
        </Button>
        {processedUrl && (
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Unduh PNG
          </Button>
        )}
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={!file}
        >
          Hapus
        </Button>
      </div>
    </div>
  )
}

