'use client'

import { useState, useEffect } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function WordCounter() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, '').length,
    words: text.trim() === '' ? 0 : text.trim().split(/\s+/).length,
    sentences: text.trim() === '' ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length,
    paragraphs: text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length,
    lines: text.split('\n').length,
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setText('')
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.characters}</div>
          <div className="text-sm text-gray-600 dark:text-gray-300">Karakter</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.charactersNoSpaces}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Tanpa Spasi</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.words}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Kata</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.sentences}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Kalimat</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.paragraphs}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Paragraf</div>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.lines}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Baris</div>
        </div>
      </div>

      {/* Text Input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Masukkan teks Anda
          </label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              disabled={!text}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Tersalin' : 'Salin'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={!text}
            >
              Hapus
            </Button>
          </div>
        </div>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tempel atau ketik teks Anda di sini..."
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none"
        />
      </div>

      <ToolGuide
        title="Panduan Penghitung Kata"
        steps={[
          'Tempel atau ketik teks Anda di kotak input di atas',
          'Statistik akan otomatis terupdate secara real-time saat Anda mengetik',
          'Lihat hasil perhitungan: karakter (dengan/tanpa spasi), kata, kalimat, paragraf, dan baris',
          'Gunakan tombol "Salin" untuk menyalin teks ke clipboard',
          'Gunakan tombol "Hapus" untuk membersihkan semua teks'
        ]}
        tips={[
          'Tool ini menghitung kata berdasarkan spasi sebagai pemisah',
          'Paragraf dihitung berdasarkan baris kosong ganda',
          'Kalimat dihitung berdasarkan tanda titik, tanda tanya, dan tanda seru',
          'Semua perhitungan dilakukan secara real-time tanpa perlu klik tombol'
        ]}
      />
    </div>
  )
}

