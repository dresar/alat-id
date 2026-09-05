'use client'

import { useState } from 'react'
import { Trash2, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function RemoveDuplicateLines() {
  const [text, setText] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [removedCount, setRemovedCount] = useState(0)

  const handleRemoveDuplicates = () => {
    const lines = text.split('\n')
    const uniqueLines = Array.from(new Set(lines))
    const removed = lines.length - uniqueLines.length
    setResult(uniqueLines.join('\n'))
    setRemovedCount(removed)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result || text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setText('')
    setResult('')
    setRemovedCount(0)
  }

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Trash2 className="h-4 w-4" />
          Masukkan teks dengan baris duplikat
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setResult('')
            setRemovedCount(0)
          }}
          placeholder="Tempel teks Anda di sini (satu baris per item)..."
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none"
        />
      </div>

      {removedCount > 0 && (
        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            <strong>{removedCount}</strong> baris duplikat telah dihapus
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleRemoveDuplicates}
          disabled={!text}
          className="flex-1"
        >
          Hapus Baris Duplikat
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!result && !text}
          className="flex-1"
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={!text}
        >
          Hapus
        </Button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <label htmlFor="result" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasil (tanpa duplikat)
          </label>
          <textarea
            id="result"
            value={result}
            readOnly
            className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
          />
        </div>
      )}
    </div>
  )
}

