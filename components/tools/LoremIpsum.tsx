'use client'

import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const loremWords = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit',
  'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat',
  'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt',
  'mollit', 'anim', 'id', 'est', 'laborum'
]

export default function LoremIpsum() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs')
  const [count, setCount] = useState(3)
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)

  const generateWord = () => {
    return loremWords[Math.floor(Math.random() * loremWords.length)]
  }

  const generateSentence = () => {
    const wordCount = Math.floor(Math.random() * 10) + 5
    const words = []
    for (let i = 0; i < wordCount; i++) {
      words.push(generateWord())
    }
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
    return words.join(' ') + '.'
  }

  const generateParagraph = () => {
    const sentenceCount = Math.floor(Math.random() * 3) + 3
    const sentences = []
    for (let i = 0; i < sentenceCount; i++) {
      sentences.push(generateSentence())
    }
    return sentences.join(' ')
  }

  const generate = () => {
    let output = ''

    if (type === 'words') {
      const words = []
      for (let i = 0; i < count; i++) {
        words.push(generateWord())
      }
      output = words.join(' ')
    } else if (type === 'sentences') {
      const sentences = []
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence())
      }
      output = sentences.join(' ')
    } else {
      const paragraphs = []
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph())
      }
      output = paragraphs.join('\n\n')
    }

    setResult(output)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setResult('')
  }

  return (
    <div className="space-y-6">
      {/* Options */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="type-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Tipe
          </label>
          <select
            id="type-select"
            value={type}
            onChange={(e) => setType(e.target.value as 'words' | 'sentences' | 'paragraphs')}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          >
            <option value="words">Kata</option>
            <option value="sentences">Kalimat</option>
            <option value="paragraphs">Paragraf</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="count-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Jumlah
          </label>
          <input
            id="count-input"
            type="number"
            min="1"
            max={type === 'words' ? 1000 : type === 'sentences' ? 100 : 50}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value) || 1)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          />
        </div>
      </div>

      {/* Generate Button */}
      <Button onClick={generate} className="w-full">
        Generate Lorem Ipsum
      </Button>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hasil
            </label>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Tersalin' : 'Salin'}
            </Button>
          </div>
          <textarea
            value={result}
            readOnly
            className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
          />
          <Button
            variant="outline"
            onClick={handleClear}
            className="w-full"
          >
            Hapus
          </Button>
        </div>
      )}
    </div>
  )
}

