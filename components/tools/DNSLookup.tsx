'use client'

import { useState } from 'react'
import { Network, Search, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

type DNSRecord = {
  type: string
  value: string
  ttl?: number
}

export default function DNSLookup() {
  const [domain, setDomain] = useState('')
  const [records, setRecords] = useState<DNSRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const lookup = async () => {
    if (!domain) return

    setLoading(true)
    setError(null)
    setRecords([])

    try {
      const response = await fetch(`/api/dns-lookup?domain=${encodeURIComponent(domain)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'DNS lookup failed')
      }

      setRecords(data.records || [])
    } catch (err: any) {
      setError(err.message || 'Failed to lookup DNS records')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="domain-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Network className="h-4 w-4" />
          Domain atau IP
        </label>
        <div className="flex gap-2">
          <input
            id="domain-input"
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && lookup()}
            placeholder="example.com atau 8.8.8.8"
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          />
          <Button onClick={lookup} disabled={!domain || loading}>
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
      {records.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            DNS Records untuk {domain}
          </h3>
          <div className="space-y-2">
            {records.map((record, idx) => (
              <div
                key={idx}
                className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {record.type}
                  </span>
                  {record.ttl && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      TTL: {record.ttl}s
                    </span>
                  )}
                </div>
                <code className="text-sm text-gray-700 dark:text-gray-300 break-all">
                  {record.value}
                </code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

