'use client'

import { useState, useRef } from 'react'
import { RefreshCw, Upload, Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

type ImageFormat = 'webp' | 'png' | 'jpg' | 'jpeg'

export default function ImageConverter() {
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState<ImageFormat>('webp')
  const [preview, setPreview] = useState<string | null>(null)
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null)
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

  const handleConvert = async () => {
    if (!file) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('format', format)

      const response = await fetch('/api/convert-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Conversion failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setConvertedUrl(url)
    } catch (err) {
      setError('Failed to convert image. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (convertedUrl) {
      const a = document.createElement('a')
      a.href = convertedUrl
      a.download = `converted.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    }
  }

  const handleClear = () => {
    setFile(null)
    setPreview(null)
    setConvertedUrl(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="space-y-2">
        <label htmlFor="format-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Format Output
        </label>
        <select
          id="format-select"
          value={format}
          onChange={(e) => setFormat(e.target.value as ImageFormat)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          <option value="webp">WebP</option>
          <option value="png">PNG</option>
          <option value="jpg">JPG/JPEG</option>
        </select>
      </div>

      {/* File Upload */}
      <div className="space-y-2">
        <label htmlFor="file-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
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
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              Klik untuk upload atau drag & drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
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
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <img
                src={preview}
                alt="Original"
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>
        )}

        {convertedUrl && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hasil Konversi ({format.toUpperCase()})
            </label>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
              <img
                src={convertedUrl}
                alt="Converted"
                className="max-w-full h-auto rounded"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleConvert}
          disabled={!file || loading}
          className="flex-1"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Mengkonversi...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Konversi
            </>
          )}
        </Button>
        {convertedUrl && (
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Unduh
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

      <ToolGuide
        title="Panduan Konversi Format Gambar"
        steps={[
          'Pilih format output yang diinginkan: WebP, PNG, atau JPG',
          'Klik area upload atau drag & drop gambar ke area tersebut',
          'Gambar akan muncul di preview',
          'Klik tombol "Konversi" untuk memproses gambar',
          'Tunggu proses konversi selesai (gambar hasil akan muncul)',
          'Klik tombol "Unduh" untuk menyimpan gambar hasil konversi',
          'Gunakan tombol "Hapus" untuk membersihkan dan mulai dari awal'
        ]}
        tips={[
          'Format WebP memberikan ukuran file lebih kecil dengan kualitas yang baik',
          'Format PNG mendukung transparansi (alpha channel)',
          'Format JPG/JPEG cocok untuk foto dengan ukuran file yang lebih kecil',
          'Maksimal ukuran file: 10MB',
          'Semua proses dilakukan di server, data Anda aman dan tidak disimpan'
        ]}
      />
    </div>
  )
}

