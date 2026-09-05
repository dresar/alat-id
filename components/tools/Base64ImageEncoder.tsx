'use client'

import { useState, useRef } from 'react'
import { Code, Upload, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Base64ImageEncoder() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [base64, setBase64] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError('File terlalu besar. Maksimal 5MB.')
        return
      }
      setFile(selectedFile)
      setError(null)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        setBase64(result)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setError('Please select a valid image file')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(base64)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setBase64('')
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getBase64Code = () => {
    if (!base64) return ''
    return `<img src="${base64}" alt="Image" />`
  }

  return (
    <div className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <label htmlFor="file-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Code className="h-4 w-4" />
          Pilih Gambar
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
              PNG, JPG, JPEG hingga 5MB
            </p>
          </label>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800">
            <img
              src={preview}
              alt="Preview"
              className="max-w-full h-auto rounded"
            />
          </div>
        </div>
      )}

      {/* Base64 Output */}
      {base64 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Base64 String
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? 'Tersalin' : 'Salin'}
              </Button>
            </div>
            <textarea
              value={base64}
              readOnly
              className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-xs"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              HTML Code
            </label>
            <textarea
              value={getBase64Code()}
              readOnly
              className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
            />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-700 dark:text-blue-300">
              💡 Ukuran Base64: {Math.round(base64.length / 1024)}KB. Gunakan untuk embed gambar langsung di HTML/CSS tanpa file terpisah.
            </p>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        onClick={handleClear}
        disabled={!file}
        className="w-full"
      >
        Hapus
      </Button>
    </div>
  )
}

