'use client'

import { useState } from 'react'
import { Type, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

type CaseType = 'uppercase' | 'lowercase' | 'title' | 'sentence' | 'camelCase' | 'snake_case'

export default function TextCaseConverter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)
  const [activeCase, setActiveCase] = useState<CaseType | null>(null)

  const convertText = (caseType: CaseType): string => {
    switch (caseType) {
      case 'uppercase':
        return text.toUpperCase()
      case 'lowercase':
        return text.toLowerCase()
      case 'title':
        return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase())
      case 'sentence':
        return text.toLowerCase().replace(/^\w|\.\s*\w/g, (char) => char.toUpperCase())
      case 'camelCase':
        return text
          .toLowerCase()
          .replace(/[^a-z0-9]+(.)/g, (_, char) => char.toUpperCase())
          .replace(/^./, (char) => char.toLowerCase())
      case 'snake_case':
        return text
          .replace(/([A-Z])/g, '_$1')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '_')
          .replace(/^_|_$/g, '')
      default:
        return text
    }
  }

  const handleConvert = (caseType: CaseType) => {
    const converted = convertText(caseType)
    setText(converted)
    setActiveCase(caseType)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setText('')
    setActiveCase(null)
  }

  const cases: { type: CaseType; label: string }[] = [
    { type: 'uppercase', label: 'UPPERCASE' },
    { type: 'lowercase', label: 'lowercase' },
    { type: 'title', label: 'Title Case' },
    { type: 'sentence', label: 'Sentence case' },
    { type: 'camelCase', label: 'camelCase' },
    { type: 'snake_case', label: 'snake_case' },
  ]

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Type className="h-4 w-4" />
          Masukkan teks Anda
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setActiveCase(null)
          }}
          placeholder="Tempel atau ketik teks Anda di sini..."
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none"
        />
      </div>

      {/* Convert Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {cases.map(({ type, label }) => (
          <Button
            key={type}
            onClick={() => handleConvert(type)}
            disabled={!text}
            variant={activeCase === type ? 'default' : 'outline'}
            className="w-full"
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!text}
          className="flex-1"
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={!text}
          className="flex-1"
        >
          Hapus
        </Button>
      </div>

      <ToolGuide
        title="Panduan Konverter Case Teks"
        steps={[
          'Masukkan atau tempel teks yang ingin diubah di kotak input',
          'Pilih jenis case yang diinginkan: UPPERCASE, lowercase, Title Case, Sentence case, camelCase, atau snake_case',
          'Teks akan otomatis dikonversi sesuai pilihan Anda',
          'Gunakan tombol "Salin" untuk menyalin hasil ke clipboard',
          'Gunakan tombol "Hapus" untuk membersihkan teks'
        ]}
        tips={[
          'UPPERCASE: Mengubah semua huruf menjadi kapital',
          'lowercase: Mengubah semua huruf menjadi kecil',
          'Title Case: Setiap kata dimulai dengan huruf kapital',
          'Sentence case: Hanya huruf pertama kalimat yang kapital',
          'camelCase: Format untuk nama variabel (huruf pertama kecil, kata berikutnya kapital)',
          'snake_case: Format dengan underscore sebagai pemisah (biasa digunakan untuk nama variabel Python)'
        ]}
      />
    </div>
  )
}

