'use client'

import { useEffect, useRef, useState } from 'react'
import { Crop, Upload, Download, RotateCcw, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function ImageCropper() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  // Crop settings
  const [x, setX] = useState(0)
  const [y, setY] = useState(0)
  const [width, setWidth] = useState(500)
  const [height, setHeight] = useState(500)
  const [aspect, setAspect] = useState<'free' | '1:1' | '16:9' | '4:3'>('free')
  const [scale, setScale] = useState(1)

  useEffect(() => {
    if (!preview) return
    cropNow()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, x, y, width, height, aspect, scale])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  const resetSettings = () => {
    setX(0)
    setY(0)
    setWidth(500)
    setHeight(500)
    setAspect('free')
    setScale(1)
  }

  const clearAll = () => {
    setFile(null)
    setPreview(null)
    setOutput(null)
    resetSettings()
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const cropNow = async () => {
    if (!preview) return
    setProcessing(true)
    try {
      const img = new Image()
      img.src = preview
      await img.decode()

      // derive aspect lock
      let targetW = width
      let targetH = height
      if (aspect !== 'free') {
        const [a, b] = aspect.split(':').map(Number)
        targetH = Math.round((width / a) * b)
        setHeight(targetH)
      }

      const canvas = document.createElement('canvas')
      canvas.width = targetW * scale
      canvas.height = targetH * scale
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas unsupported')
      ctx.drawImage(
        img,
        x,
        y,
        targetW,
        targetH,
        0,
        0,
        targetW * scale,
        targetH * scale
      )
      const dataUrl = canvas.toDataURL('image/png')
      setOutput(dataUrl)
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!output) return
    const a = document.createElement('a')
    a.href = output
    a.download = 'cropped.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val))

  const nSet = (setter: (v: number) => void, min: number, max: number) => (v: number) =>
    setter(clamp(v, min, max))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Image Cropper</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Potong gambar, kunci rasio, dan ubah skala langsung di browser.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSettings}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Pengaturan
        </Button>
      </div>

      {/* Upload & Preview */}
      <div className="grid md:grid-cols-2 gap-4">
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

          {preview && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">Preview</p>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
                <img src={preview} alt="preview" className="w-full h-full object-contain" />
              </div>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 space-y-3">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Crop className="h-4 w-4" />
            Pengaturan Crop
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">X (px)</label>
              <input
                type="number"
                value={x}
                onChange={(e) => nSet(setX, 0, 8000)(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Y (px)</label>
              <input
                type="number"
                value={y}
                onChange={(e) => nSet(setY, 0, 8000)(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => nSet(setWidth, 50, 8000)(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => nSet(setHeight, 50, 8000)(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Rasio</label>
            <select
              value={aspect}
              onChange={(e) => setAspect(e.target.value as any)}
              className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="free">Bebas</option>
              <option value="1:1">1:1 (Persegi)</option>
              <option value="16:9">16:9</option>
              <option value="4:3">4:3</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500 dark:text-gray-400">Scale output</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full"
            />
            <div className="text-xs text-gray-600 dark:text-gray-400">x{scale.toFixed(1)}</div>
          </div>
        </div>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Hasil Crop</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG, ukuran mengikuti area crop dan scale.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Unduh PNG
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Hapus
              </Button>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
            <img src={output} alt="Cropped" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={cropNow} disabled={!preview || processing} className="flex-1">
          <Sparkles className="h-4 w-4 mr-2" />
          {processing ? 'Memproses...' : 'Crop Sekarang'}
        </Button>
        <Button variant="outline" onClick={clearAll} disabled={!file}>
          Hapus
        </Button>
      </div>

      <ToolGuide
        title="Panduan Crop Foto"
        steps={[
          'Upload gambar (PNG/JPG/JPEG)',
          'Isi posisi X,Y serta Width/Height area crop',
          'Opsional: kunci rasio 1:1, 16:9, atau 4:3',
          'Atur Scale output jika ingin memperbesar/perkecil hasil',
          'Klik Crop untuk melihat hasil dan unduh PNG'
        ]}
        tips={[
          'Rasio terkunci menjaga proporsi konsisten (cocok untuk thumbnail)',
          'Scale >1 akan memperbesar kanvas (bisa sedikit menurunkan ketajaman)',
          'Pastikan X,Y dan Width/Height tidak melebihi dimensi gambar asli',
          'Gunakan ukuran kecil untuk kebutuhan web agar lebih ringan',
          'Jika hasil kosong, pastikan area crop berada di dalam gambar'
        ]}
      />
    </div>
  )
}
