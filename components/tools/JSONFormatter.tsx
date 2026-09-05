'use client'

import { useState } from 'react'
import { Brackets, Copy, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function JSONFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const formatJSON = () => {
    try {
      setError(null)
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
    } catch (err) {
      setError('Invalid JSON format. Please check your input.')
      setOutput('')
    }
  }

  const validateJSON = () => {
    try {
      JSON.parse(input)
      setError(null)
      setOutput('✓ Valid JSON')
    } catch (err) {
      setError('Invalid JSON format')
      setOutput('')
    }
  }

  const minifyJSON = () => {
    try {
      setError(null)
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
    } catch (err) {
      setError('Invalid JSON format. Please check your input.')
      setOutput('')
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Brackets className="h-4 w-4" />
          Masukkan JSON
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOutput('')
            setError(null)
          }}
          placeholder='{"key": "value"}'
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button onClick={formatJSON} disabled={!input} className="flex-1 min-w-[120px]">
          Format
        </Button>
        <Button onClick={validateJSON} disabled={!input} variant="outline" className="flex-1 min-w-[120px]">
          Validasi
        </Button>
        <Button onClick={minifyJSON} disabled={!input} variant="outline" className="flex-1 min-w-[120px]">
          Minify
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!output && !input}
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
        <Button variant="outline" onClick={handleClear} disabled={!input}>
          Hapus
        </Button>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasil
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none font-mono text-sm"
          />
        </div>
      )}

      <ToolGuide
        title="Panduan JSON Formatter"
        steps={[
          'Tempel atau ketik JSON yang ingin diformat di kotak input',
          'Klik tombol "Format" untuk merapikan JSON dengan indentasi yang rapi',
          'Klik tombol "Validasi" untuk memeriksa apakah JSON valid',
          'Klik tombol "Minify" untuk mengecilkan ukuran JSON (menghapus spasi)',
          'Hasil akan muncul di kotak output di bawah',
          'Gunakan tombol "Salin" untuk menyalin hasil ke clipboard',
          'Gunakan tombol "Hapus" untuk membersihkan input dan output'
        ]}
        tips={[
          'JSON yang valid harus menggunakan tanda kutip ganda untuk key dan string',
          'Gunakan Format untuk membuat JSON mudah dibaca',
          'Gunakan Minify untuk mengurangi ukuran file JSON',
          'Jika ada error, periksa apakah semua tanda kurung dan koma sudah benar',
          'JSON Formatter juga dapat memperbaiki format JSON yang berantakan'
        ]}
      />
    </div>
  )
}

