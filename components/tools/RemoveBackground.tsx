'use client'

import { useEffect, useRef, useState } from 'react'
import { Scissors, Upload, Download, Sparkles, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function RemoveBackground() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)

  // Settings
  const [tolerance, setTolerance] = useState(30)
  const [feather, setFeather] = useState(0)
  const [fillColor, setFillColor] = useState<string>('transparent')
  const [invert, setInvert] = useState(false)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const clearAll = () => {
    setFile(null)
    setPreview(null)
    setOutput(null)
    setProcessingTime(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const resetSettings = () => {
    setTolerance(30)
    setFeather(0)
    setFillColor('transparent')
    setInvert(false)
  }

  const removeBg = async () => {
    if (!preview) return
    setProcessing(true)
    const t0 = performance.now()
    try {
      const img = new Image()
      img.src = preview
      await img.decode()

      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')
      ctx.drawImage(img, 0, 0)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      // Pick sample color from top-left pixel (assume background)
      const r0 = data[0]
      const g0 = data[1]
      const b0 = data[2]

      const tol = tolerance
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]
        const dist = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2)
        const match = invert ? dist > tol : dist < tol
        if (match) {
          // make transparent or fill color
          if (fillColor === 'transparent') {
            data[i + 3] = feather > 0 ? Math.max(0, 255 - feather * 5) : 0
          } else {
            const col = hexToRgb(fillColor) || { r: 255, g: 255, b: 255 }
            data[i] = col.r
            data[i + 1] = col.g
            data[i + 2] = col.b
            data[i + 3] = 255
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)
      const out = canvas.toDataURL('image/png')
      setOutput(out)
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
      const t1 = performance.now()
      setProcessingTime(Math.round(t1 - t0))
    }
  }

  const hexToRgb = (hex: string) => {
    const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return match
      ? {
          r: parseInt(match[1], 16),
          g: parseInt(match[2], 16),
          b: parseInt(match[3], 16),
        }
      : null
  }

  useEffect(() => {
    if (preview) removeBg()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, tolerance, feather, fillColor, invert])

  const handleDownload = () => {
    if (!output) return
    const a = document.createElement('a')
    a.href = output
    a.download = 'no-background.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const originalSize = file?.size || 0
  const processedSize = output ? Math.round((output.length * 3) / 4) : 0
  const savings =
    originalSize > 0 && processedSize > 0
      ? ((1 - processedSize / originalSize) * 100).toFixed(1)
      : '0'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Remove Background (Basic)</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hilangkan background polos (putih/warna solid) langsung di browser.</p>
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
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Tolerance</span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{tolerance}</span>
          </div>
          <input
            type="range"
            min="5"
            max="150"
            value={tolerance}
            onChange={(e) => setTolerance(parseInt(e.target.value))}
            className="w-full"
          />

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Feather (soft edge)</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{feather}</span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            value={feather}
            onChange={(e) => setFeather(parseInt(e.target.value))}
            className="w-full"
          />

          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Fill Color (jika tidak transparan)</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={fillColor === 'transparent' ? '#ffffff' : fillColor}
                onChange={(e) => setFillColor(e.target.value)}
              />
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={fillColor === 'transparent'}
                  onChange={(e) => setFillColor(e.target.checked ? 'transparent' : '#ffffff')}
                  className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                Buat Transparan
              </label>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
            <input
              type="checkbox"
              checked={invert}
              onChange={(e) => setInvert(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            Balik seleksi (hapus foreground)
          </label>
        </div>

        {/* Upload & Preview */}
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 space-y-3">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200">Upload Gambar (background polos)</label>
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
                  <div
                    className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800"
                    style={{
                      backgroundImage:
                        'linear-gradient(45deg, #f0f0f0 25%, transparent 25%), linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f0f0f0 75%), linear-gradient(-45deg, transparent 75%, #f0f0f0 75%)',
                      backgroundSize: '20px 20px',
                    }}
                  >
                    <img src={output} alt="processed" className="w-full h-full object-contain" />
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
            {processedSize ? (processedSize / 1024).toFixed(2) + ' KB' : '0 KB'}
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
        <Button onClick={removeBg} disabled={!preview || processing} className="flex-1">
          <Sparkles className="h-4 w-4 mr-2" />
          {processing ? 'Memproses...' : 'Hapus Background'}
        </Button>
        <Button variant="outline" onClick={handleDownload} disabled={!output}>
          <Download className="h-4 w-4 mr-2" />
          Unduh PNG
        </Button>
        <Button variant="outline" onClick={clearAll} disabled={!file}>
          Hapus
        </Button>
      </div>

      <ToolGuide
        title="Panduan Hapus Background (Basic)"
        steps={[
          'Upload gambar dengan background polos (putih/warna solid)',
          'Atur tolerance untuk menentukan seberapa mirip warna yang dihapus',
          'Opsional: aktifkan feather untuk tepi lebih halus',
          'Pilih transparan atau isi warna lain',
          'Klik Hapus Background lalu unduh PNG'
        ]}
        tips={[
          'Metode ini berbasis warna: terbaik untuk background polos/kontras tinggi',
          'Jika objek ikut hilang, kurangi tolerance atau centang invert untuk membalik seleksi',
          'Feather menurunkan opacity di tepi agar lebih halus',
          'Gunakan warna isi jika butuh background solid baru',
          'Untuk hasil kompleks (background ramai), perlu model AI server-side'
        ]}
      />
    </div>
  )
}
