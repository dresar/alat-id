'use client'

import { useState } from 'react'
import { Search, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function FindReplace() {
  const [text, setText] = useState('')
  const [searchText, setSearchText] = useState('')
  const [replaceText, setReplaceText] = useState('')
  const [result, setResult] = useState('')
  const [copied, setCopied] = useState(false)
  const [matchCount, setMatchCount] = useState(0)

  const handleReplace = () => {
    if (!searchText) {
      setResult(text)
      setMatchCount(0)
      return
    }

    const regex = new RegExp(searchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
    const replaced = text.replace(regex, replaceText)
    const matches = text.match(regex)
    setResult(replaced)
    setMatchCount(matches ? matches.length : 0)
  }

  const handleReplaceAll = () => {
    handleReplace()
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result || text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setText('')
    setSearchText('')
    setReplaceText('')
    setResult('')
    setMatchCount(0)
  }

  return (
    <div className="space-y-6">
      {/* Search and Replace Inputs */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="search" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Search className="h-4 w-4" />
            Cari teks
          </label>
          <input
            id="search"
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Masukkan teks yang ingin dicari..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="replace" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Ganti dengan
          </label>
          <input
            id="replace"
            type="text"
            value={replaceText}
            onChange={(e) => setReplaceText(e.target.value)}
            placeholder="Masukkan teks pengganti..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
          />
        </div>
      </div>

      {matchCount > 0 && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Ditemukan <strong>{matchCount}</strong> kecocokan
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          onClick={handleReplaceAll}
          disabled={!text || !searchText}
          className="flex-1"
        >
          Ganti Semua
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!result && !text}
          className="flex-1"
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
        <Button
          variant="outline"
          onClick={handleClear}
          disabled={!text}
        >
          Hapus
        </Button>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Teks asli
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            setResult('')
            setMatchCount(0)
          }}
          placeholder="Tempel atau ketik teks Anda di sini..."
          className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none"
        />
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-2">
          <label htmlFor="result" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasil
          </label>
          <textarea
            id="result"
            value={result}
            readOnly
            className="w-full h-48 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 resize-none"
          />
        </div>
      )}

      <ToolGuide
        title="Panduan Cari & Ganti Teks"
        steps={[
          'Tempel atau ketik teks Anda di kotak "Teks asli"',
          'Masukkan teks yang ingin dicari di kotak "Cari teks"',
          'Masukkan teks pengganti di kotak "Ganti dengan"',
          'Klik tombol "Ganti Semua" untuk mengganti semua kemunculan teks',
          'Lihat jumlah kecocokan yang ditemukan',
          'Hasil akan muncul di kotak "Hasil" di bawah',
          'Gunakan tombol "Salin" untuk menyalin hasil ke clipboard',
          'Gunakan tombol "Hapus" untuk membersihkan semua input'
        ]}
        tips={[
          'Pencarian bersifat case-sensitive (membedakan huruf besar/kecil)',
          'Semua kemunculan teks akan diganti sekaligus',
          'Tool ini sangat berguna untuk mengganti kata/kalimat dalam dokumen panjang',
          'Anda dapat melihat berapa banyak kecocokan yang ditemukan sebelum mengganti',
          'Hasil dapat langsung disalin tanpa perlu mengetik ulang'
        ]}
      />
    </div>
  )
}

