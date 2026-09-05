'use client'

import { useState } from 'react'
import { Lock, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function JSObfuscator() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const obfuscate = () => {
    // Simple obfuscation (basic example)
    // For production, consider using a library like javascript-obfuscator
    let obfuscated = input
      // Replace variable names with random names
      .replace(/\b(var|let|const)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, (match, keyword, varName) => {
        const randomName = '_0x' + Math.random().toString(36).substr(2, 9)
        return `${keyword} ${randomName}`
      })
      // Basic string encoding
      .replace(/['"]([^'"]+)['"]/g, (match, str) => {
        const encoded = btoa(str)
        return `atob('${encoded}')`
      })

    setOutput(obfuscated)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Masukkan JavaScript
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOutput('')
          }}
          placeholder="function hello() { console.log('Hello'); }"
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Catatan: Ini adalah obfuscation sederhana. Untuk keamanan lebih tinggi, gunakan library khusus.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={obfuscate} disabled={!input} className="flex-1">
          Obfuscate
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
            Hasil Obfuscated
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none font-mono text-sm"
          />
        </div>
      )}
    </div>
  )
}

