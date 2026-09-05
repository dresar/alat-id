'use client'

import { useState, useEffect } from 'react'
import { Droplet, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type ColorFormat = 'hex' | 'rgb' | 'hsl' | 'cmyk'

export default function ColorConverter() {
  const [hex, setHex] = useState('#3b82f6')
  const [rgb, setRgb] = useState('rgb(59, 130, 246)')
  const [hsl, setHsl] = useState('hsl(217, 91%, 60%)')
  const [cmyk, setCmyk] = useState('cmyk(76%, 47%, 0%, 4%)')
  const [copied, setCopied] = useState(false)
  const [copiedFormat, setCopiedFormat] = useState<ColorFormat | null>(null)

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null
  }

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6
          break
        case g:
          h = ((b - r) / d + 2) / 6
          break
        case b:
          h = ((r - g) / d + 4) / 6
          break
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255
    g /= 255
    b /= 255

    const k = 1 - Math.max(r, g, b)
    const c = k === 1 ? 0 : (1 - r - k) / (1 - k)
    const m = k === 1 ? 0 : (1 - g - k) / (1 - k)
    const y = k === 1 ? 0 : (1 - b - k) / (1 - k)

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100),
    }
  }

  const updateFromHex = (hexValue: string) => {
    if (!/^#?[0-9A-Fa-f]{6}$/.test(hexValue)) return

    const rgbValue = hexToRgb(hexValue)
    if (!rgbValue) return

    const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b)
    const cmykValue = rgbToCmyk(rgbValue.r, rgbValue.g, rgbValue.b)

    setRgb(`rgb(${rgbValue.r}, ${rgbValue.g}, ${rgbValue.b})`)
    setHsl(`hsl(${hslValue.h}, ${hslValue.s}%, ${hslValue.l}%)`)
    setCmyk(`cmyk(${cmykValue.c}%, ${cmykValue.m}%, ${cmykValue.y}%, ${cmykValue.k}%)`)
  }

  useEffect(() => {
    updateFromHex(hex)
  }, [hex])

  const handleCopy = async (format: ColorFormat, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setCopiedFormat(format)
    setTimeout(() => {
      setCopied(false)
      setCopiedFormat(null)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Color Preview */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Droplet className="h-4 w-4" />
          Preview Warna
        </label>
        <div
          className="w-full h-32 rounded-lg border border-gray-300 dark:border-gray-700"
          style={{ backgroundColor: hex }}
        />
      </div>

      {/* HEX */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            HEX
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy('hex', hex)}
          >
            {copied && copiedFormat === 'hex' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied && copiedFormat === 'hex' ? 'Tersalin' : 'Salin'}
          </Button>
        </div>
        <input
          type="text"
          value={hex}
          onChange={(e) => {
            let value = e.target.value
            if (!value.startsWith('#')) value = '#' + value
            setHex(value)
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 font-mono"
        />
      </div>

      {/* RGB */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            RGB
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy('rgb', rgb)}
          >
            {copied && copiedFormat === 'rgb' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied && copiedFormat === 'rgb' ? 'Tersalin' : 'Salin'}
          </Button>
        </div>
        <input
          type="text"
          value={rgb}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
        />
      </div>

      {/* HSL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            HSL
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy('hsl', hsl)}
          >
            {copied && copiedFormat === 'hsl' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied && copiedFormat === 'hsl' ? 'Tersalin' : 'Salin'}
          </Button>
        </div>
        <input
          type="text"
          value={hsl}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
        />
      </div>

      {/* CMYK */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            CMYK
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy('cmyk', cmyk)}
          >
            {copied && copiedFormat === 'cmyk' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied && copiedFormat === 'cmyk' ? 'Tersalin' : 'Salin'}
          </Button>
        </div>
        <input
          type="text"
          value={cmyk}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
        />
      </div>
    </div>
  )
}

