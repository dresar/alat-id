'use client'

import { useState } from 'react'
import { Hash, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const figletFonts = [
  'Standard',
  '3D-ASCII',
  '3D Diagonal',
  '3x5',
  '5 Line Oblique',
  'Alpha',
  'Banner',
  'Big',
  'Block',
  'Bubble',
  'Digital',
  'Doom',
  'Epic',
  'Graffiti',
  'Isometric1',
  'Larry 3D',
  'Lean',
  'Mini',
  'Script',
  'Shadow',
  'Slant',
  'Small',
  'Speed',
  'Star Wars',
  'Stop',
  'Straight',
  'Thin',
  'Threepoint',
  'Tiny',
]

export default function ASCIIArt() {
  const [text, setText] = useState('')
  const [selectedFont, setSelectedFont] = useState('Standard')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const generateASCII = async () => {
    if (!text) {
      setResult('')
      return
    }

    // Simple ASCII art generation (client-side approximation)
    // For full figlet support, you'd need a library like figlet.js
    const asciiMap: Record<string, (char: string) => string> = {
      'Standard': (char) => char.toUpperCase(),
      'Block': (char) => `█${char}█`,
      'Bubble': (char) => `( ${char} )`,
      'Lean': (char) => `/${char}\\`,
      'Slant': (char) => `\\${char}/`,
    }

    const generator = asciiMap[selectedFont] || asciiMap['Standard']
    const ascii = text
      .split('')
      .map(char => char === ' ' ? ' ' : generator(char))
      .join(' ')

    setResult(ascii)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setText('')
    setResult('')
  }

  return (
    <div className="space-y-6">
      {/* Font Selection */}
      <div className="space-y-2">
        <label htmlFor="font-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Pilih Font
        </label>
        <select
          id="font-select"
          value={selectedFont}
          onChange={(e) => {
            setSelectedFont(e.target.value)
            if (text) {
              setTimeout(() => generateASCII(), 0)
            }
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          {figletFonts.map((font) => (
            <option key={font} value={font}>
              {font}
            </option>
          ))}
        </select>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Masukkan teks
        </label>
        <input
          id="text-input"
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            if (e.target.value) {
              setTimeout(() => generateASCII(), 0)
            } else {
              setResult('')
            }
          }}
          placeholder="Ketik teks Anda..."
          maxLength={20}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Maksimal 20 karakter untuk hasil terbaik
        </p>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hasil ASCII Art
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
          <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900">
            <pre className="text-sm font-mono whitespace-pre-wrap text-gray-900 dark:text-gray-100">
              {result}
            </pre>
          </div>
        </div>
      )}

      <Button
        variant="outline"
        onClick={handleClear}
        disabled={!text}
        className="w-full"
      >
        Hapus
      </Button>
    </div>
  )
}

