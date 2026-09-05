'use client'

import { useState, useEffect } from 'react'
import { XCircle, Copy, Check, Download, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

type FileType = 'html' | 'css' | 'js' | 'auto'

export default function CommentRemover() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [fileType, setFileType] = useState<FileType>('auto')
  const [copied, setCopied] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)
  const [originalSize, setOriginalSize] = useState(0)
  const [processedSize, setProcessedSize] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Settings
  const [preserveStructure, setPreserveStructure] = useState(true)
  const [removeEmptyLines, setRemoveEmptyLines] = useState(false)
  const [trimLines, setTrimLines] = useState(false)

  const removeComments = () => {
    if (!input.trim()) {
      setOutput('')
      setProcessingTime(0)
      setOriginalSize(0)
      setProcessedSize(0)
      return
    }

    const startTime = performance.now()
    let result = input
    let detectedType = fileType

    // Auto-detect file type
    if (fileType === 'auto') {
      if (input.includes('<!DOCTYPE') || input.includes('<html') || input.includes('<!--')) {
        detectedType = 'html'
      } else if (input.includes('/*') || input.includes('//') && input.includes('{')) {
        detectedType = 'css'
      } else if (input.includes('//') || input.includes('/*')) {
        detectedType = 'js'
      } else {
        detectedType = 'html'
      }
    }

    // Remove comments based on type
    if (detectedType === 'html') {
      // Remove HTML comments: <!-- ... -->
      result = result.replace(/<!--[\s\S]*?-->/g, '')
    } else if (detectedType === 'css') {
      // Remove CSS comments: /* ... */
      result = result.replace(/\/\*[\s\S]*?\*\//g, '')
    } else if (detectedType === 'js') {
      // Remove single-line comments: // ...
      result = result.replace(/\/\/.*$/gm, '')
      // Remove multi-line comments: /* ... */
      result = result.replace(/\/\*[\s\S]*?\*\//g, '')
    }

    // Preserve structure - only clean up excessive whitespace
    if (preserveStructure) {
      // Clean up multiple consecutive empty lines
      result = result.replace(/\n\s*\n\s*\n+/g, '\n\n')
    } else {
      // More aggressive cleanup
      result = result.replace(/\n\s*\n/g, '\n')
    }

    // Remove empty lines
    if (removeEmptyLines) {
      result = result.replace(/^\s*[\r\n]/gm, '')
    }

    // Trim lines
    if (trimLines) {
      result = result.split('\n').map(line => line.trimEnd()).join('\n')
    }

    result = result.trim()

    const endTime = performance.now()
    const time = Math.round(endTime - startTime)

    setOutput(result)
    setProcessingTime(time)
    setOriginalSize(new Blob([input]).size)
    setProcessedSize(new Blob([result]).size)
  }

  useEffect(() => {
    removeComments()
  }, [input, fileType, preserveStructure, removeEmptyLines, trimLines])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `no-comments.${fileType === 'auto' ? 'txt' : fileType}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setProcessingTime(0)
    setOriginalSize(0)
    setProcessedSize(0)
  }

  const handleReset = () => {
    setPreserveStructure(true)
    setRemoveEmptyLines(false)
    setTrimLines(false)
  }

  const savings = originalSize > 0 ? ((1 - processedSize / originalSize) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pengaturan Penghapusan Komentar
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hapus komentar tanpa merubah struktur kode
        </p>
      </div>

      {/* File Type Selection */}
      <div className="space-y-2">
        <label htmlFor="type-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <XCircle className="h-4 w-4" />
          Tipe File
        </label>
        <select
          id="type-select"
          value={fileType}
          onChange={(e) => {
            setFileType(e.target.value as FileType)
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          <option value="auto">Auto-detect</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
        </select>
      </div>

      {/* Quick Settings */}
      <div className="space-y-4">
        <button
          onClick={() => {}}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="font-medium text-gray-900 dark:text-white">Pengaturan</span>
          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="grid gap-3">
          {/* Preserve Structure */}
          <label className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={preserveStructure}
              onChange={(e) => setPreserveStructure(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Pertahankan struktur
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Jaga indentasi dan struktur kode tetap rapi tanpa merubah format.
              </div>
            </div>
          </label>

          {/* Remove Empty Lines */}
          <label className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={removeEmptyLines}
              onChange={(e) => setRemoveEmptyLines(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Hapus baris kosong
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hapus semua baris kosong untuk hasil yang lebih kompak.
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="font-medium text-gray-900 dark:text-white">Advanced Settings</span>
          {showAdvanced ? (
            <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          )}
        </button>

        {showAdvanced && (
          <div className="space-y-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={trimLines}
                onChange={(e) => setTrimLines(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Trim spasi di akhir baris</span>
            </label>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Masukkan Kode dengan Komentar
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tempel kode HTML, CSS, atau JavaScript dengan komentar di sini..."
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
        />
      </div>

      {/* Metrics */}
      {originalSize > 0 && (
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">SEBELUM</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {(originalSize / 1024).toFixed(2)} KB
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">SESUDAH</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {(processedSize / 1024).toFixed(2)} KB
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">HEMAT</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400">
              {savings}%
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">WAKTU</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {processingTime} ms
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!output && !input}
          className="flex-1"
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
        {output && (
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Unduh
          </Button>
        )}
        <Button variant="outline" onClick={handleClear} disabled={!input}>
          Hapus
        </Button>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasil (Tanpa Komentar)
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
          />
        </div>
      )}

      <ToolGuide
        title="Panduan Penghapus Komentar"
        steps={[
          'Pilih tipe file: Auto-detect, HTML, CSS, atau JavaScript',
          'Atur pengaturan: Pertahankan struktur, Hapus baris kosong',
          'Buka Advanced Settings untuk opsi tambahan (opsional)',
          'Tempel atau ketik kode yang berisi komentar di kotak input',
          'Komentar akan otomatis dihapus saat Anda mengetik',
          'Lihat metrics: ukuran sebelum/sesudah, persentase penghematan, dan waktu proses',
          'Gunakan tombol "Salin" untuk menyalin hasil ke clipboard',
          'Gunakan tombol "Unduh" untuk menyimpan file tanpa komentar',
          'Gunakan tombol "Reset" untuk mengembalikan pengaturan ke default'
        ]}
        tips={[
          'Auto-detect akan mendeteksi tipe file secara otomatis',
          'HTML: Menghapus komentar <!-- ... --> tanpa merubah struktur',
          'CSS: Menghapus komentar /* ... */ tanpa merubah struktur',
          'JavaScript: Menghapus komentar // dan /* ... */ tanpa merubah struktur',
          'Pertahankan struktur menjaga indentasi dan format kode tetap rapi',
          'Tool ini tidak mengubah fungsi kode, hanya menghapus komentar',
          'Semakin banyak komentar, semakin besar penghematan ukuran file'
        ]}
      />
    </div>
  )
}

