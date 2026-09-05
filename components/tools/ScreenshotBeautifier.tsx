'use client'

import { useEffect, useRef, useState } from 'react'
import { Monitor, Upload, Download, Sparkles, SlidersHorizontal, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function ScreenshotBeautifier() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [output, setOutput] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  // Settings
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [bgColor, setBgColor] = useState('#0f172a')
  const [padding, setPadding] = useState(48)
  const [radius, setRadius] = useState(16)
  const [shadow, setShadow] = useState(16)
  const [showTopBar, setShowTopBar] = useState(true)

  const resetSettings = () => {
    setTheme('light')
    setBgColor('#0f172a')
    setPadding(48)
    setRadius(16)
    setShadow(16)
    setShowTopBar(true)
  }

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
    if (fileInputRef.current) fileInputRef.current.value = ''
    resetSettings()
  }

  const render = async () => {
    if (!preview) return
    setProcessing(true)
    try {
      const img = new Image()
      img.src = preview
      await img.decode()

      const paddingPx = padding
      const barHeight = showTopBar ? 36 : 0

      const canvas = canvasRef.current || document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) throw new Error('Canvas not supported')

      canvas.width = img.width + paddingPx * 2
      canvas.height = img.height + paddingPx * 2 + barHeight

      // background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // shadow effect
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.25)'
      ctx.shadowBlur = shadow
      ctx.shadowOffsetY = Math.floor(shadow / 4)

      // container with radius
      const x = paddingPx
      const y = paddingPx + barHeight
      const w = img.width
      const h = img.height
      ctx.fillStyle = theme === 'light' ? '#0b1220' : '#0f172a'
      roundRect(ctx, x - 8, y - (showTopBar ? barHeight : 0), w + 16, h + (showTopBar ? barHeight : 0) + 16, radius)
      ctx.fill()
      ctx.restore()

      // top bar
      if (showTopBar) {
        ctx.fillStyle = theme === 'light' ? '#e5e7eb' : '#111827'
        roundRect(ctx, x - 8, y - barHeight, w + 16, barHeight + 8, radius)
        ctx.fill()
        const dotsY = y - barHeight / 2
        const colors = ['#ef4444', '#f59e0b', '#22c55e']
        colors.forEach((c, i) => {
          ctx.beginPath()
          ctx.fillStyle = c
          ctx.arc(x + 14 + i * 16, dotsY, 5, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // image
      ctx.save()
      roundRect(ctx, x, y, w, h, Math.max(radius - 4, 6))
      ctx.clip()
      ctx.drawImage(img, x, y, w, h)
      ctx.restore()

      const dataUrl = canvas.toDataURL('image/png')
      setOutput(dataUrl)
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  useEffect(() => {
    if (preview) render()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, theme, bgColor, padding, radius, shadow, showTopBar])

  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    const radius = Math.min(r, w / 2, h / 2)
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + w - radius, y)
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius)
    ctx.lineTo(x + w, y + h - radius)
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h)
    ctx.lineTo(x + radius, y + h)
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  const handleDownload = () => {
    if (!output) return
    const a = document.createElement('a')
    a.href = output
    a.download = 'beautified.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="space-y-6">
      <canvas ref={canvasRef} className="hidden" />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Screenshot Beautifier</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tambahkan frame, background estetik, dan top bar browser secara instan.</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetSettings}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Pengaturan
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Upload */}
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 space-y-3 md:col-span-1">
          <label className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            Upload Screenshot
          </label>
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
              <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, JPEG</p>
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
        <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-gray-200">
            <SlidersHorizontal className="h-4 w-4" />
            Pengaturan Tampilan
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Tema Frame</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
                <span className="text-xs text-gray-600 dark:text-gray-400">Pilih warna latar</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Padding</label>
              <input
                type="range"
                min="16"
                max="128"
                value={padding}
                onChange={(e) => setPadding(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 dark:text-gray-400">{padding}px</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Radius</label>
              <input
                type="range"
                min="0"
                max="48"
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 dark:text-gray-400">{radius}px</div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 dark:text-gray-400">Shadow</label>
              <input
                type="range"
                min="0"
                max="40"
                value={shadow}
                onChange={(e) => setShadow(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 dark:text-gray-400">{shadow}px</div>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input
                type="checkbox"
                checked={showTopBar}
                onChange={(e) => setShowTopBar(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              Tampilkan top bar browser
            </label>
          </div>
        </div>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">Hasil Beautify</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PNG siap pakai dengan frame & background.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Unduh
              </Button>
              <Button variant="outline" onClick={clearAll}>
                Hapus
              </Button>
            </div>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800">
            <img src={output} alt="beautified" className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <Button onClick={render} disabled={!preview || processing} className="flex-1">
          <Sparkles className="h-4 w-4 mr-2" />
          {processing ? 'Memproses...' : 'Beautify'}
        </Button>
      </div>

      <ToolGuide
        title="Panduan Screenshot Beautifier"
        steps={[
          'Upload screenshot (PNG/JPG)',
          'Atur background, padding, radius, shadow, dan top bar',
          'Pilih tema frame (light/dark)',
          'Klik Beautify untuk menghasilkan preview',
          'Unduh hasil PNG'
        ]}
        tips={[
          'Padding besar + shadow lembut membuat screenshot lebih menonjol',
          'Top bar cocok untuk mockup browser; matikan jika tidak perlu',
          'Gunakan warna latar gelap (#0f172a) agar konten terang lebih pop',
          'Radius 12-20px memberi efek kartu modern',
          'Jika ukuran file besar, perkecil screenshot sebelum unggah'
        ]}
      />
    </div>
  )
}
