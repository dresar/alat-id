'use client'

import { useState } from 'react'
import { FileCode, Copy, Check, Download, Sparkles, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function MinifyHTML() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Quick Settings
  const [removeComments, setRemoveComments] = useState(true)
  const [removeWhitespace, setRemoveWhitespace] = useState(true)
  const [removeEmptyAttributes, setRemoveEmptyAttributes] = useState(false)
  
  // Advanced Settings
  const [collapseWhitespace, setCollapseWhitespace] = useState(true)
  const [removeOptionalTags, setRemoveOptionalTags] = useState(false)
  const [minifyInlineCSS, setMinifyInlineCSS] = useState(false)
  const [minifyInlineJS, setMinifyInlineJS] = useState(false)

  const minify = () => {
    if (!input.trim()) {
      setOutput('')
      setProcessingTime(0)
      return
    }

    const startTime = performance.now()
    let minified = input

    // Remove HTML comments
    if (removeComments) {
      minified = minified.replace(/<!--[\s\S]*?-->/g, '')
    }

    // Remove whitespace
    if (removeWhitespace) {
      // Collapse whitespace between tags
      if (collapseWhitespace) {
        minified = minified.replace(/>\s+</g, '><')
      }
      // Remove whitespace at start/end of lines
      minified = minified.replace(/^\s+|\s+$/gm, '')
      // Remove multiple spaces
      minified = minified.replace(/\s+/g, ' ')
    }

    // Remove empty attributes
    if (removeEmptyAttributes) {
      minified = minified.replace(/\s+(\w+)=""/g, '')
      minified = minified.replace(/\s+(\w+)=''/g, '')
    }

    // Remove optional tags (basic)
    if (removeOptionalTags) {
      // Remove closing </p> before other block elements
      const closePRegex = new RegExp('<\\/p>\\s*<(div|section|article|header|footer|nav|aside|h[1-6])', 'gi')
      minified = minified.replace(closePRegex, '<$1')
      // Remove closing </li> before next <li> or </ul>
      const closeLiRegex = new RegExp('<\\/li>\\s*<(li|ul|ol)', 'gi')
      minified = minified.replace(closeLiRegex, '<$1')
    }

    // Minify inline CSS (basic)
    if (minifyInlineCSS) {
      const styleRegex = new RegExp('<style[^>]*>([\\s\\S]*?)<\\/style>', 'gi')
      minified = minified.replace(styleRegex, (match, content) => {
        const minifiedCSS = content
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s*([{}:;,])\s*/g, '$1')
          .replace(/\s+/g, ' ')
          .trim()
        return match.replace(content, minifiedCSS)
      })
    }

    // Minify inline JS (basic)
    if (minifyInlineJS) {
      const scriptRegex = new RegExp('<script[^>]*>([\\s\\S]*?)<\\/script>', 'gi')
      minified = minified.replace(scriptRegex, (match, content) => {
        // Skip if src attribute exists
        if (match.includes('src=')) return match
        const minifiedJS = content
          .replace(/\/\/.*$/gm, '')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\s*([=+\-*/%<>!&|?:,;{}()\[\]])\s*/g, '$1')
          .replace(/\s+/g, ' ')
          .trim()
        return match.replace(content, minifiedJS)
      })
    }

    minified = minified.trim()

    const endTime = performance.now()
    setProcessingTime(Math.round(endTime - startTime))
    setOutput(minified)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([output], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'minified.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    setRemoveComments(true)
    setRemoveWhitespace(true)
    setRemoveEmptyAttributes(false)
    setCollapseWhitespace(true)
    setRemoveOptionalTags(false)
    setMinifyInlineCSS(false)
    setMinifyInlineJS(false)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setProcessingTime(0)
  }

  const originalSize = new Blob([input]).size
  const minifiedSize = new Blob([output]).size
  const savings = originalSize > 0 ? ((1 - minifiedSize / originalSize) * 100).toFixed(1) : '0'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pengaturan Kompresi
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Hapus komentar • Optimasi struktur • Hapus whitespace
        </p>
      </div>

      {/* Quick Settings */}
      <div className="space-y-4">
        <button
          onClick={() => {}}
          className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <span className="font-medium text-gray-900 dark:text-white">Quick Settings</span>
          <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
        </button>

        <div className="grid gap-3">
          {/* Remove Comments */}
          <label className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={removeComments}
              onChange={(e) => setRemoveComments(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Hapus komentar
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Singkirkan komentar HTML &lt;!-- ... --&gt; untuk menghemat setiap byte yang tidak dibutuhkan.
              </div>
            </div>
          </label>

          {/* Remove Whitespace */}
          <label className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={removeWhitespace}
              onChange={(e) => setRemoveWhitespace(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Hapus whitespace
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hapus spasi, tab, dan newline yang tidak diperlukan untuk ukuran lebih kecil.
              </div>
            </div>
          </label>

          {/* Remove Empty Attributes */}
          <label className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={removeEmptyAttributes}
              onChange={(e) => setRemoveEmptyAttributes(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <div className="flex-1">
              <div className="font-medium text-gray-900 dark:text-white mb-1">
                Hapus atribut kosong
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Hapus atribut dengan nilai kosong untuk menghemat ruang.
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
                checked={collapseWhitespace}
                onChange={(e) => setCollapseWhitespace(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Collapse whitespace between tags</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={removeOptionalTags}
                onChange={(e) => setRemoveOptionalTags(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Remove optional closing tags</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={minifyInlineCSS}
                onChange={(e) => setMinifyInlineCSS(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Minify inline CSS</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={minifyInlineJS}
                onChange={(e) => setMinifyInlineJS(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Minify inline JavaScript</span>
            </label>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={minify} disabled={!input} className="flex-1">
          <Sparkles className="h-4 w-4 mr-2" />
          Minify
        </Button>
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">SEBELUM</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {originalSize > 0 ? (originalSize / 1024).toFixed(2) + ' KB' : '0 B'}
          </div>
        </div>
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">SESUDAH</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">
            {minifiedSize > 0 ? (minifiedSize / 1024).toFixed(2) + ' KB' : '0 B'}
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

      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileCode className="h-4 w-4" />
          Masukkan HTML
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOutput('')
            setProcessingTime(0)
          }}
          placeholder="<html><!-- comment --><body>Hello World</body></html>"
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
        />
      </div>

      {/* Hasil Minify */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hasil Minify
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              HTML yang sudah dikompresi akan tampil di sini setelah proses selesai.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Salin
            </Button>
            {output && (
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Unduh .html
              </Button>
            )}
          </div>
        </div>
        <textarea
          value={output || 'Belum ada hasil minify.'}
          readOnly
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
          placeholder="Belum ada hasil minify."
        />
      </div>

      <ToolGuide
        title="Panduan Minify HTML"
        steps={[
          'Masukkan kode HTML di kotak input',
          'Pilih opsi Quick Settings: Hapus komentar, Hapus whitespace, Hapus atribut kosong',
          'Buka Advanced Settings untuk opsi tambahan (opsional)',
          'Klik tombol "Minify" untuk memproses HTML',
          'Lihat metrics: ukuran sebelum/sesudah, persentase penghematan, dan waktu proses',
          'Gunakan tombol "Salin" untuk menyalin hasil ke clipboard',
          'Gunakan tombol "Unduh .html" untuk menyimpan file HTML yang sudah di-minify',
          'Gunakan tombol "Reset" untuk mengembalikan pengaturan ke default'
        ]}
        tips={[
          'Hapus komentar akan menghilangkan semua komentar HTML (&lt;!-- ... --&gt;)',
          'Hapus whitespace akan menghilangkan spasi, tab, dan newline yang tidak perlu',
          'Hapus atribut kosong akan menghilangkan atribut dengan nilai kosong',
          'Collapse whitespace akan menghilangkan spasi antara tag',
          'Remove optional tags akan menghilangkan tag penutup yang opsional',
          'Minify inline CSS/JS akan mengompres CSS dan JavaScript di dalam tag <style> dan <script>',
          'Semakin banyak opsi yang diaktifkan, semakin kecil ukuran file',
          'Minify HTML dapat mengurangi ukuran file hingga 30-50%',
          'Selalu test HTML setelah di-minify untuk memastikan masih berfungsi',
          'Backup file original sebelum di-minify'
        ]}
      />
    </div>
  )
}

