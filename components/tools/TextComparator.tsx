'use client'

import { useState } from 'react'
import { GitCompare } from 'lucide-react'

export default function TextComparator() {
  const [text1, setText1] = useState('')
  const [text2, setText2] = useState('')

  const getDifferences = () => {
    const lines1 = text1.split('\n')
    const lines2 = text2.split('\n')
    const maxLines = Math.max(lines1.length, lines2.length)
    const differences: Array<{ line: number; type: 'same' | 'diff1' | 'diff2' | 'both'; content1: string; content2: string }> = []

    for (let i = 0; i < maxLines; i++) {
      const line1 = lines1[i] || ''
      const line2 = lines2[i] || ''

      if (line1 === line2) {
        differences.push({ line: i + 1, type: 'same', content1: line1, content2: line2 })
      } else {
        differences.push({ line: i + 1, type: 'both', content1: line1, content2: line2 })
      }
    }

    return differences
  }

  const differences = getDifferences()
  const hasDifferences = text1 && text2 && differences.some(d => d.type === 'both')

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Text 1 */}
        <div className="space-y-2">
          <label htmlFor="text1" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            Teks 1
          </label>
          <textarea
            id="text1"
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            placeholder="Tempel teks pertama di sini..."
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
          />
        </div>

        {/* Text 2 */}
        <div className="space-y-2">
          <label htmlFor="text2" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Teks 2
          </label>
          <textarea
            id="text2"
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            placeholder="Tempel teks kedua di sini..."
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
          />
        </div>
      </div>

      {/* Differences Display */}
      {hasDifferences && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Perbedaan
          </label>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
            <div className="max-h-64 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 font-mono text-sm">
              {differences.map((diff, idx) => (
                <div key={idx} className="mb-2">
                  {diff.type === 'both' && (
                    <>
                      <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-1 rounded">
                        <span className="text-gray-500">- </span>
                        {diff.content1 || '(kosong)'}
                      </div>
                      <div className="text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 p-1 rounded mt-1">
                        <span className="text-gray-500">+ </span>
                        {diff.content2 || '(kosong)'}
                      </div>
                    </>
                  )}
                  {diff.type === 'same' && (
                    <div className="text-gray-600 dark:text-gray-400 p-1">
                      {diff.content1}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {text1 && text2 && !hasDifferences && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-sm text-green-700 dark:text-green-300">
            ✓ Kedua teks identik
          </p>
        </div>
      )}
    </div>
  )
}

