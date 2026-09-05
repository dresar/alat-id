'use client'

import { useState } from 'react'
import { Database, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function SQLFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatSQL = () => {
    if (!input.trim()) {
      setError('Please enter SQL code')
      return
    }

    try {
      let formatted = input
        // Add newlines after keywords
        .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|ON|GROUP BY|ORDER BY|HAVING|INSERT INTO|UPDATE|SET|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|VALUES|AND|OR)\b/gi, '\n$1')
        // Add newlines before keywords
        .replace(/\b(SELECT|FROM|WHERE|JOIN|INNER JOIN|LEFT JOIN|RIGHT JOIN|FULL JOIN|ON|GROUP BY|ORDER BY|HAVING|INSERT INTO|UPDATE|SET|DELETE FROM|CREATE TABLE|ALTER TABLE|DROP TABLE|VALUES)\b/gi, '\n$1')
        // Add spaces around operators
        .replace(/([=<>!]+)/g, ' $1 ')
        // Add spaces around commas
        .replace(/,/g, ', ')
        // Remove multiple spaces
        .replace(/\s+/g, ' ')
        // Remove multiple newlines
        .replace(/\n+/g, '\n')
        .trim()

      // Indent lines
      const lines = formatted.split('\n')
      let indentLevel = 0
      const indentedLines = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed) return ''

        // Decrease indent before certain keywords
        if (trimmed.match(/^(FROM|WHERE|JOIN|GROUP BY|ORDER BY|HAVING)/i)) {
          indentLevel = Math.max(0, indentLevel - 1)
        }

        const indented = '  '.repeat(indentLevel) + trimmed

        // Increase indent after certain keywords
        if (trimmed.match(/^(SELECT|FROM|WHERE|JOIN|INSERT INTO|UPDATE|CREATE TABLE)/i)) {
          indentLevel++
        }

        return indented
      })

      formatted = indentedLines.filter(l => l).join('\n')
      setOutput(formatted)
      setError(null)
    } catch (err: any) {
      setError('Failed to format SQL')
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
          <Database className="h-4 w-4" />
          Masukkan Kode SQL
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOutput('')
            setError(null)
          }}
          placeholder="SELECT * FROM users WHERE age > 18 ORDER BY name"
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
        <Button onClick={formatSQL} disabled={!input} className="flex-1">
          Format SQL
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
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none font-mono text-sm"
          />
        </div>
      )}
    </div>
  )
}

