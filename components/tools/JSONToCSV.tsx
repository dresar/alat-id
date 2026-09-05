'use client'

import { useState } from 'react'
import { Table, Copy, Check, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function JSONToCSV() {
  const [mode, setMode] = useState<'json-to-csv' | 'csv-to-json'>('json-to-csv')
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const jsonToCSV = (json: string) => {
    try {
      const data = JSON.parse(json)
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('JSON must be an array of objects')
      }

      const headers = Object.keys(data[0])
      const csvRows = [headers.join(',')]

      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header]
          if (value === null || value === undefined) return ''
          const stringValue = String(value)
          // Escape commas and quotes
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`
          }
          return stringValue
        })
        csvRows.push(values.join(','))
      }

      return csvRows.join('\n')
    } catch (err: any) {
      throw new Error(`Invalid JSON: ${err.message}`)
    }
  }

  const csvToJSON = (csv: string) => {
    try {
      const lines = csv.trim().split('\n')
      if (lines.length < 2) {
        throw new Error('CSV must have at least a header and one data row')
      }

      const headers = lines[0].split(',').map(h => h.trim())
      const result = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',')
        const obj: any = {}
        headers.forEach((header, index) => {
          let value = values[index]?.trim() || ''
          // Remove quotes if present
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1).replace(/""/g, '"')
          }
          obj[header] = value
        })
        result.push(obj)
      }

      return JSON.stringify(result, null, 2)
    } catch (err: any) {
      throw new Error(`Invalid CSV: ${err.message}`)
    }
  }

  const handleConvert = () => {
    setError(null)
    setOutput('')

    if (!input.trim()) {
      setError('Please enter input data')
      return
    }

    try {
      if (mode === 'json-to-csv') {
        const csv = jsonToCSV(input)
        setOutput(csv)
      } else {
        const json = csvToJSON(input)
        setOutput(json)
      }
    } catch (err: any) {
      setError(err.message)
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
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setMode('json-to-csv')
            setInput('')
            setOutput('')
            setError(null)
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'json-to-csv'
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          JSON → CSV
        </button>
        <button
          onClick={() => {
            setMode('csv-to-json')
            setInput('')
            setOutput('')
            setError(null)
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'csv-to-json'
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          CSV → JSON
        </button>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Table className="h-4 w-4" />
          Input ({mode === 'json-to-csv' ? 'JSON' : 'CSV'})
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOutput('')
            setError(null)
          }}
          placeholder={mode === 'json-to-csv' 
            ? '[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
            : 'name,age\nJohn,30\nJane,25'}
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleConvert}
          disabled={!input}
          className="flex-1"
        >
          <ArrowLeftRight className="h-4 w-4 mr-2" />
          Konversi
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
            Output ({mode === 'json-to-csv' ? 'CSV' : 'JSON'})
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
          />
        </div>
      )}
    </div>
  )
}

