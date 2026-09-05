'use client'

import { useState } from 'react'
import { GitCompare } from 'lucide-react'

interface DiffResult {
  key: string
  status: 'added' | 'removed' | 'modified' | 'unchanged'
  oldValue?: any
  newValue?: any
}

export default function JSONDiff() {
  const [json1, setJson1] = useState('')
  const [json2, setJson2] = useState('')
  const [diffs, setDiffs] = useState<DiffResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const compareJSON = () => {
    try {
      setError(null)
      const obj1 = JSON.parse(json1)
      const obj2 = JSON.parse(json2)
      
      const differences: DiffResult[] = []
      const allKeys = new Set([...Object.keys(obj1), ...Object.keys(obj2)])

      allKeys.forEach((key) => {
        const val1 = obj1[key]
        const val2 = obj2[key]

        if (!(key in obj1)) {
          differences.push({
            key,
            status: 'added',
            newValue: val2,
          })
        } else if (!(key in obj2)) {
          differences.push({
            key,
            status: 'removed',
            oldValue: val1,
          })
        } else if (JSON.stringify(val1) !== JSON.stringify(val2)) {
          differences.push({
            key,
            status: 'modified',
            oldValue: val1,
            newValue: val2,
          })
        } else {
          differences.push({
            key,
            status: 'unchanged',
            oldValue: val1,
            newValue: val2,
          })
        }
      })

      setDiffs(differences)
    } catch (err) {
      setError('Invalid JSON in one or both inputs')
      setDiffs([])
    }
  }

  const getStatusColor = (status: DiffResult['status']) => {
    switch (status) {
      case 'added':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
      case 'removed':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
      case 'modified':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
      default:
        return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
    }
  }

  const getStatusLabel = (status: DiffResult['status']) => {
    switch (status) {
      case 'added':
        return 'Ditambahkan'
      case 'removed':
        return 'Dihapus'
      case 'modified':
        return 'Diubah'
      default:
        return 'Tidak berubah'
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* JSON 1 */}
        <div className="space-y-2">
          <label htmlFor="json1" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            JSON 1
          </label>
          <textarea
            id="json1"
            value={json1}
            onChange={(e) => {
              setJson1(e.target.value)
              setDiffs([])
              setError(null)
            }}
            placeholder='{"key": "value"}'
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
          />
        </div>

        {/* JSON 2 */}
        <div className="space-y-2">
          <label htmlFor="json2" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            JSON 2
          </label>
          <textarea
            id="json2"
            value={json2}
            onChange={(e) => {
              setJson2(e.target.value)
              setDiffs([])
              setError(null)
            }}
            placeholder='{"key": "value"}'
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
          />
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      <button
        onClick={compareJSON}
        disabled={!json1 || !json2}
        className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Bandingkan
      </button>

      {/* Differences */}
      {diffs.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Perbedaan
          </label>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {diffs.map((diff, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${getStatusColor(diff.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                    {diff.key}
                  </span>
                  <span className="text-xs font-medium px-2 py-1 rounded">
                    {getStatusLabel(diff.status)}
                  </span>
                </div>
                {diff.status === 'removed' && (
                  <div className="text-sm text-red-700 dark:text-red-300 font-mono">
                    - {JSON.stringify(diff.oldValue)}
                  </div>
                )}
                {diff.status === 'added' && (
                  <div className="text-sm text-green-700 dark:text-green-300 font-mono">
                    + {JSON.stringify(diff.newValue)}
                  </div>
                )}
                {diff.status === 'modified' && (
                  <>
                    <div className="text-sm text-red-700 dark:text-red-300 font-mono mb-1">
                      - {JSON.stringify(diff.oldValue)}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300 font-mono">
                      + {JSON.stringify(diff.newValue)}
                    </div>
                  </>
                )}
                {diff.status === 'unchanged' && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {JSON.stringify(diff.oldValue)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

