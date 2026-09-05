'use client'

import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function Unminify() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [type, setType] = useState<'js' | 'css' | 'html' | 'json'>('js')
  const [copied, setCopied] = useState(false)

  const unminify = () => {
    let formatted = input

    if (type === 'json') {
      try {
        const parsed = JSON.parse(input)
        formatted = JSON.stringify(parsed, null, 2)
      } catch {
        formatted = input
      }
    } else if (type === 'js') {
      // Basic JavaScript formatting
      formatted = input
        .replace(/;/g, ';\n')
        .replace(/{/g, '{\n')
        .replace(/}/g, '\n}')
        .replace(/,/g, ',\n')
        .split('\n')
        .map(line => {
          const indent = (line.match(/^(\s*)/)?.[1]?.length || 0) / 2
          return '  '.repeat(indent) + line.trim()
        })
        .join('\n')
    } else if (type === 'css') {
      formatted = input
        .replace(/}/g, '}\n')
        .replace(/{/g, '{\n')
        .replace(/;/g, ';\n')
        .split('\n')
        .map(line => {
          if (line.includes('}')) {
            return line.trim()
          }
          return '  ' + line.trim()
        })
        .join('\n')
    } else if (type === 'html') {
      // Basic HTML formatting
      formatted = input
        .replace(/>/g, '>\n')
        .replace(/</g, '\n<')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n')
    }

    setOutput(formatted)
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
      {/* Type Selection */}
      <div className="space-y-2">
        <label htmlFor="type-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Tipe File
        </label>
        <select
          id="type-select"
          value={type}
          onChange={(e) => {
            setType(e.target.value as 'js' | 'css' | 'html' | 'json')
            setOutput('')
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          <option value="js">JavaScript</option>
          <option value="css">CSS</option>
          <option value="html">HTML</option>
          <option value="json">JSON</option>
        </select>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Masukkan kode minified
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOutput('')
          }}
          placeholder="Paste minified code here..."
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button onClick={unminify} disabled={!input} className="flex-1">
          Unminify & Format
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
            Hasil Formatted
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

