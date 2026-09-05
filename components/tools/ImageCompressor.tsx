'use client'

import { useRef, useState, useEffect } from 'react'
import { Upload, Download, Copy, Check, Sparkles, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function ImageCompressor() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)

  // Settings
  const [quality, setQuality] = useState(0.8)
  const [maxWidth, setMaxWidth] = useState(1920)
  const [maxHeight, setMaxHeight] = useState(1080)
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp' | 'image/png'>('image/webp')
  const [keepMetadata, setKeepMetadata] = useState(false)

  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return
    setFile(f)
    setOriginalSize(f.size)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(f)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) handleFile(f)
  }

  const clearAll = () => {
    setFile(null)
    setPreview(null)
    setOutput(null)
    setProcessingTime(0)
    setCompressedSize(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const resetSettings = () => {
    setQuality(0.8)
    setMaxWidth(1920)
    setMaxHeight(1080)
    setFormat('image/webp')
    setKeepMetadata(false)
  }

  const compress = async () => {
    if (!file || !preview) return
    setProcessing(true)
    const t0 = performance.now()
    try {
      const img = new Image()
      img.src = preview
      await img.decode()

      const ratio = Math.min(1, maxWidth / img.width, maxHeight / img.height)
      const targetW = Math.round(img.width * ratio)
      const targetH = Math.round(img.height * ratio)

      const canvas = document.createElement('canvas')
      canvas.width = targetW
      canvas.height = targetH
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')
      ctx.drawImage(img, 0, 0, targetW, targetH)

      const dataUrl = canvas.toDataURL(format, quality)
      setOutput(dataUrl)

      // size in bytes (rough estimate from base64)
      const size = Math.round((dataUrl.length * 3) / 4)
      setCompressedSize(size)
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
      const t1 = performance.now()
      setProcessingTime(Math.round(t1 - t0))
    }
  }

  useEffect(() => {
    if (file && preview) {
      compress()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, preview, quality, maxWidth, maxHeight, format, keepMetadata])

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!output) return
    const a = document.createElement('a')
    a.href = output
    const ext = format === 'image/png' ? 'png' : format === 'image/jpeg' ? 'jpg' : 'webp'
    a.download = `compressed.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const savings =
    originalSize > 0 && compressedSize > 0
      ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
      : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Compressor</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kompres gambar di browser dengan pengaturan kualitas, ukuran, dan format.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSettings}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Pengaturan
        </Button>
      </div>

      {/* Settings */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Kualitas</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{Math.round(quality * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="1"
            step="0.05"
            value={quality}
            onChange={(e) => setQuality(parseFloat(e.target.value))}
            className="w-full"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Max Width (px)</label>
              <input
                type="number"
                min={200}
                max={8000}
                value={maxWidth}
                onChange={(e) => setMaxWidth(parseInt(e.target.value) || 1920)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Max Height (px)</label>
              <input
                type="number"
                min={200}
                max={8000}
                value={maxHeight}
                onChange={(e) => setMaxHeight(parseInt(e.target.value) || 1080)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Format Output</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="image/webp">WebP (kecil)</option>
              <option value="image/jpeg">JPEG</option>
              <option value="image/png">PNG (lossless)</option>
            </select>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={keepMetadata}
              onChange={(e) => setKeepMetadata(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            Pertahankan metadata (EXIF)
          </label>
        </div>

        {/* Upload & Preview */}
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 space-y-3">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">Upload Gambar</label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 dark:text-gray-400">Klik untuk upload atau drag & drop</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, JPEG hingga 10MB</p>
            </label>
          </div>

          {(preview || output) && (
            <div className="grid md:grid-cols-2 gap-3">
              {preview && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sebelum</p>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <img src={preview} alt="original" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
              {output && (
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sesudah</p>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                    <img src={output} alt="compressed" className="w-full h-full object-contain" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">SEBELUM</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {originalSize ? (originalSize / 1024).toFixed(2) + ' KB' : '0 KB'}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">SESUDAH</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {compressedSize ? (compressedSize / 1024).toFixed(2) + ' KB' : '0 KB'}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">HEMAT</div>
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{savings}%</div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">WAKTU</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{processingTime} ms</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={compress} disabled={!file || processing} className="flex-1">
          <Sparkles className="h-4 w-4 mr-2" />
          {processing ? 'Memproses...' : 'Kompres'}
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!output}>
          <Download className="h-4 w-4 mr-2" />
          Unduh
        </Button>
        <Button variant="outline" onClick={handleCopy} disabled={!output}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          Salin Data URL
        </Button>
        <Button variant="outline" onClick={clearAll} disabled={!file}>
          Hapus
        </Button>
      </div>

      <ToolGuide
        title="Panduan Kompres Gambar"
        steps={[
          'Upload gambar (PNG/JPG/JPEG)',
          'Atur kualitas dan batas lebar/tinggi sesuai kebutuhan',
          'Pilih format output (WebP/JPEG/PNG)',
          'Klik Kompres lalu unduh hasilnya',
          'Gunakan salin Data URL jika perlu embed langsung'
        ]}
        tips={[
          'WebP biasanya paling kecil dengan kualitas baik',
          'Turunkan kualitas ke 60–80% untuk penghematan signifikan',
          'Batas lebar/tinggi mengecilkan dimensi tanpa merusak rasio',
          'PNG cocok untuk grafis teks/logo, JPEG/WebP untuk foto',
          'Matikan pertahankan metadata untuk privasi (EXIF akan hilang)'
        ]}
      />
    </div>
  )
}
