'use client'

import { useState, useEffect } from 'react'
import { Clock, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function UnixTimestampConverter() {
  const [timestamp, setTimestamp] = useState<string>('')
  const [date, setDate] = useState<string>('')
  const [mode, setMode] = useState<'timestamp-to-date' | 'date-to-timestamp'>('timestamp-to-date')
  const [result, setResult] = useState<string>('')
  const [copied, setCopied] = useState(false)

  const convertTimestampToDate = (ts: string) => {
    const num = parseInt(ts)
    if (isNaN(num)) {
      setResult('Invalid timestamp')
      return
    }

    // Check if timestamp is in seconds or milliseconds
    const timestamp = num < 10000000000 ? num * 1000 : num
    const dateObj = new Date(timestamp)

    if (isNaN(dateObj.getTime())) {
      setResult('Invalid timestamp')
      return
    }

    setResult(dateObj.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short',
    }))
  }

  const convertDateToTimestamp = (dateStr: string) => {
    const dateObj = new Date(dateStr)
    if (isNaN(dateObj.getTime())) {
      setResult('Invalid date')
      return
    }

    const timestamp = Math.floor(dateObj.getTime() / 1000)
    setResult(timestamp.toString())
  }

  useEffect(() => {
    if (mode === 'timestamp-to-date' && timestamp) {
      convertTimestampToDate(timestamp)
    } else if (mode === 'date-to-timestamp' && date) {
      convertDateToTimestamp(date)
    } else {
      setResult('')
    }
  }, [timestamp, date, mode])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setTimestamp('')
    setDate('')
    setResult('')
  }

  const setCurrentTimestamp = () => {
    const now = Math.floor(Date.now() / 1000)
    setTimestamp(now.toString())
    setMode('timestamp-to-date')
  }

  const setCurrentDate = () => {
    const now = new Date().toISOString().slice(0, 16)
    setDate(now)
    setMode('date-to-timestamp')
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setMode('timestamp-to-date')
            setResult('')
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'timestamp-to-date'
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Timestamp → Date
        </button>
        <button
          onClick={() => {
            setMode('date-to-timestamp')
            setResult('')
          }}
          className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === 'date-to-timestamp'
              ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          Date → Timestamp
        </button>
      </div>

      {/* Input */}
      {mode === 'timestamp-to-date' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Unix Timestamp
            </label>
            <Button variant="outline" size="sm" onClick={setCurrentTimestamp}>
              Sekarang
            </Button>
          </div>
          <input
            type="text"
            value={timestamp}
            onChange={(e) => setTimestamp(e.target.value)}
            placeholder="1704067200"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 font-mono"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Masukkan timestamp dalam detik (10 digit) atau milidetik (13 digit)
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Date & Time
            </label>
            <Button variant="outline" size="sm" onClick={setCurrentDate}>
              Sekarang
            </Button>
          </div>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hasil
            </label>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Tersalin' : 'Salin'}
            </Button>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
            <p className="text-lg font-mono text-gray-900 dark:text-white">{result}</p>
          </div>
        </div>
      )}

      <Button variant="outline" onClick={handleClear} disabled={!timestamp && !date} className="w-full">
        Hapus
      </Button>
    </div>
  )
}

