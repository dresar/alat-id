'use client'

import { useState } from 'react'
import { FileText, Link as LinkIcon, Copy, Check, RefreshCw, Loader2, Upload, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'

export default function ReadmeViewer() {
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [hideCode, setHideCode] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)

  const handleFetch = async () => {
    if (!url.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(url.trim())
      if (!res.ok) throw new Error(`Gagal memuat README (status ${res.status})`)
      const text = await res.text()
      setContent(text)
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat README')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const handleClear = () => {
    setContent('')
    setUrl('')
    setError(null)
    setFileName(null)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setContent(text)
    setFileName(file.name)
    setError(null)
  }

  const processedContent = hideCode ? stripCodeBlocks(content) : content

  const mdComponents: Components = {
    h1: (props: any) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
    h2: (props: any) => <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />,
    h3: (props: any) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
    p: (props: any) => <p className="mb-2" {...props} />,
    ul: (props: any) => <ul className="list-disc list-inside mb-2" {...props} />,
    ol: (props: any) => <ol className="list-decimal list-inside mb-2" {...props} />,
    li: (props: any) => <li className="mb-1" {...props} />,
    code: ({ inline, className, children, ...props }: any) =>
      inline ? (
        <code className="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs" {...props}>
          {children}
        </code>
      ) : hideCode ? null : (
        <pre className="p-3 rounded bg-gray-100 dark:bg-gray-800 text-xs overflow-auto mb-3">
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ),
    a: (props: any) => (
      <a className="text-blue-600 dark:text-blue-400 underline" target="_blank" rel="noreferrer" {...props} />
    ),
    blockquote: (props: any) => (
      <blockquote className="border-l-4 border-gray-300 dark:border-gray-700 pl-3 italic text-gray-700 dark:text-gray-300 mb-2" {...props} />
    ),
    table: (props: any) => (
      <div className="overflow-auto mb-3">
        <table className="min-w-full text-left text-sm border-collapse" {...props} />
      </div>
    ),
    th: (props: any) => <th className="border px-2 py-1 font-semibold" {...props} />,
    td: (props: any) => <td className="border px-2 py-1" {...props} />,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pembaca README</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Baca README dari URL (raw GitHub / GitLab / Bitbucket) atau tempel manual, lalu salin isinya.
        </p>
      </div>

      {/* URL & Upload */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <LinkIcon className="h-4 w-4" />
            URL README (opsional)
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://raw.githubusercontent.com/user/repo/main/README.md"
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
            />
            <Button onClick={handleFetch} disabled={!url || loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Memuat
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Ambil
                </>
              )}
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Gunakan URL raw (contoh: raw.githubusercontent.com/...). Jika private repo, tempel manual atau upload.
          </p>
          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload README (.md)
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-4 text-center">
            <input
              id="upload-readme"
              type="file"
              accept=".md,text/markdown,text/plain"
              onChange={handleFile}
              className="hidden"
            />
            <label htmlFor="upload-readme" className="cursor-pointer text-sm text-gray-700 dark:text-gray-200">
              Klik untuk upload atau drag & drop
            </label>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {fileName ? `Dipilih: ${fileName}` : 'Maksimal ~5MB'}
            </div>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Konten README
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="# Project Title\nTuliskan README di sini..."
          className="w-full h-64 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 text-sm font-mono whitespace-pre-wrap"
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" onClick={handleCopy} disabled={!content}>
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Tersalin' : 'Salin'}
        </Button>
        <Button variant="outline" onClick={handleClear} disabled={!content && !url && !fileName}>
          Hapus
        </Button>
        <Button
          variant="outline"
          onClick={() => setHideCode((v) => !v)}
          disabled={!content}
        >
          {hideCode ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
          {hideCode ? 'Tampilkan kode' : 'Sembunyikan kode'}
        </Button>
      </div>

      {/* Preview (rendered) */}
      {content && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Pratinjau README (markdown)
          </p>
          <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg bg-white dark:bg-gray-900 overflow-auto text-sm leading-relaxed text-gray-900 dark:text-gray-100">
            {/* GFM dinonaktifkan sementara (bug micromark table). */}
            <ReactMarkdown components={mdComponents}>
              {processedContent}
            </ReactMarkdown>
          </div>
        </div>
      )}

      <ToolGuide
        title="Panduan Pembaca README"
        steps={[
          'Masukkan URL README (raw) lalu klik Ambil, atau tempel konten manual di kotak',
          'Atau upload file README (.md) untuk dibaca',
          'Konten akan dirender jadi tampilan rapi (markdown)',
          'Gunakan tombol Sembunyikan kode jika ingin tampilan tanpa blok kode',
          'Klik Salin untuk menyalin README',
          'Gunakan Hapus untuk membersihkan input'
        ]}
        tips={[
          'Gunakan URL raw GitHub: https://raw.githubusercontent.com/user/repo/branch/README.md',
          'Untuk repo privat, salin manual lalu tempel',
          'Mode Sembunyikan kode menghilangkan blok kode agar lebih mudah dibaca',
          'Jika tabel GFM tidak tampil, konversi ke teks biasa terlebih dahulu',
          'Simpan README yang sudah disalin ke file lokal bila perlu'
        ]}
      />
    </div>
  )
}

function stripCodeBlocks(src: string) {
  // hapus blok kode ``` ```
  const noFenced = src.replace(/```[\s\S]*?```/g, '')
  // hapus blok code indentation 4 spasi
  const noIndented = noFenced
    .split('\n')
    .filter((line) => !line.startsWith('    '))
    .join('\n')
  return noIndented
}

