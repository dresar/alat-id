'use client'

import { useState } from 'react'
import { Globe, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function IPLookup() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = async () => {
    if (!input) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch(`/api/ip-lookup?input=${encodeURIComponent(input)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'IP lookup failed')
      }

      setResult(data)
    } catch (err: any) {
      setError(err.message || 'Failed to lookup IP information')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Globe className="h-4 w-4" />
          IP Address atau Domain
        </label>
        <div className="flex gap-2">
          <input
            id="input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && lookup()}
            placeholder="8.8.8.8 atau example.com"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          />
          <Button onClick={lookup} disabled={!input || loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Informasi untuk {input}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {result.ip && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  IP Address
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {result.ip}
                </div>
              </div>
            )}
            {result.country && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Negara
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {result.country}
                </div>
              </div>
            )}
            {result.city && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Kota
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {result.city}
                </div>
              </div>
            )}
            {result.isp && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  ISP/ASN
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {result.isp}
                </div>
              </div>
            )}
            {result.reverse && (
              <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 md:col-span-2">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Reverse DNS
                </div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {result.reverse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

