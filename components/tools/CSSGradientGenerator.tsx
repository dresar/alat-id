'use client'

import { useState } from 'react'
import { Palette, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function CSSGradientGenerator() {
  const [type, setType] = useState<'linear' | 'radial'>('linear')
  const [direction, setDirection] = useState('to right')
  const [colors, setColors] = useState([
    { color: '#3b82f6', stop: 0 },
    { color: '#8b5cf6', stop: 100 },
  ])
  const [copied, setCopied] = useState(false)

  const addColor = () => {
    setColors([...colors, { color: '#10b981', stop: 100 }])
  }

  const removeColor = (index: number) => {
    if (colors.length > 2) {
      setColors(colors.filter((_, i) => i !== index))
    }
  }

  const updateColor = (index: number, field: 'color' | 'stop', value: string | number) => {
    const newColors = [...colors]
    newColors[index] = { ...newColors[index], [field]: value }
    setColors(newColors)
  }

  const generateCSS = () => {
    if (type === 'linear') {
      const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(', ')
      return `background: linear-gradient(${direction}, ${colorStops});`
    } else {
      const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(', ')
      return `background: radial-gradient(circle, ${colorStops});`
    }
  }

  const generateCSSFull = () => {
    if (type === 'linear') {
      const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(', ')
      return `linear-gradient(${direction}, ${colorStops})`
    } else {
      const colorStops = colors.map(c => `${c.color} ${c.stop}%`).join(', ')
      return `radial-gradient(circle, ${colorStops})`
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generateCSS())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Type Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Tipe Gradient
        </label>
        <div className="flex gap-2">
          <button
            onClick={() => setType('linear')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'linear'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Linear
          </button>
          <button
            onClick={() => setType('radial')}
            className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
              type === 'radial'
                ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Radial
          </button>
        </div>
      </div>

      {/* Direction (for linear) */}
      {type === 'linear' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Arah
          </label>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          >
            <option value="to right">→ Ke Kanan</option>
            <option value="to left">← Ke Kiri</option>
            <option value="to bottom">↓ Ke Bawah</option>
            <option value="to top">↑ Ke Atas</option>
            <option value="to bottom right">↘ Diagonal Kanan Bawah</option>
            <option value="to bottom left">↙ Diagonal Kiri Bawah</option>
            <option value="to top right">↗ Diagonal Kanan Atas</option>
            <option value="to top left">↖ Diagonal Kiri Atas</option>
          </select>
        </div>
      )}

      {/* Colors */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Warna
          </label>
          <Button variant="outline" size="sm" onClick={addColor}>
            + Tambah Warna
          </Button>
        </div>
        <div className="space-y-3">
          {colors.map((color, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="color"
                value={color.color}
                onChange={(e) => updateColor(index, 'color', e.target.value)}
                className="w-16 h-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
              />
              <input
                type="text"
                value={color.color}
                onChange={(e) => updateColor(index, 'color', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
              />
              <input
                type="number"
                value={color.stop}
                onChange={(e) => updateColor(index, 'stop', parseInt(e.target.value) || 0)}
                min="0"
                max="100"
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
              {colors.length > 2 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeColor(index)}
                >
                  ×
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Preview
        </label>
        <div
          className="w-full h-48 rounded-lg border border-gray-300 dark:border-gray-700"
          style={{ background: generateCSSFull() }}
        />
      </div>

      {/* CSS Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CSS Code
          </label>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? 'Tersalin' : 'Salin'}
          </Button>
        </div>
        <textarea
          value={generateCSS()}
          readOnly
          className="w-full h-24 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
        />
      </div>
    </div>
  )
}

