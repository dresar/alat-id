'use client'

import { useState, useRef } from 'react'
import { QrCode, Download, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import QRCode from 'react-qr-code'
import ToolGuide from './ToolGuide'

export default function QRCodeGenerator() {
  const [text, setText] = useState('')
  const [fgColor, setFgColor] = useState('#000000')
  const [bgColor, setBgColor] = useState('#FFFFFF')
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (qrRef.current && text) {
      const svg = qrRef.current.querySelector('svg')
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = 'qrcode.png'
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
              URL.revokeObjectURL(url)
            }
          })
        }
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
      }
    }
  }

  const handleCopy = async () => {
    if (qrRef.current && text) {
      const svg = qrRef.current.querySelector('svg')
      if (svg) {
        try {
          const svgData = new XMLSerializer().serializeToString(svg)
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          const img = new Image()
          
          img.onload = async () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            canvas.toBlob(async (blob) => {
              if (blob) {
                await navigator.clipboard.write([
                  new ClipboardItem({ 'image/png': blob }),
                ])
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }
            })
          }
          
          img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
        } catch (err) {
          console.error('Failed to copy:', err)
        }
      }
    }
  }

  const handleClear = () => {
    setText('')
  }

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div className="space-y-2">
        <label htmlFor="text-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          Masukkan teks atau URL
        </label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Masukkan teks, URL, atau data yang ingin diubah menjadi QR code..."
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none"
        />
      </div>

      {/* QR Code Display */}
      {text && (
        <div className="space-y-4">
          <div className="flex justify-center">
            <div ref={qrRef} className="p-4 rounded-lg border border-gray-300 dark:border-gray-700" style={{ backgroundColor: bgColor }}>
              <QRCode
                value={text}
                size={256}
                level="H"
                fgColor={fgColor}
                bgColor={bgColor}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            </div>
          </div>

          {/* Color Customization */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Warna QR Code
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="w-16 h-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Warna Background
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-16 h-10 rounded border border-gray-300 dark:border-gray-700 cursor-pointer"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Unduh
            </Button>
            <Button
              variant="outline"
              onClick={handleCopy}
              className="flex-1"
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Tersalin' : 'Salin'}
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
            >
              Hapus
            </Button>
          </div>
        </div>
      )}

      {!text && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <QrCode className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>Masukkan teks atau URL untuk menghasilkan QR code</p>
        </div>
      )}

      <ToolGuide
        title="Panduan Generator QR Code"
        steps={[
          'Masukkan teks, URL, atau data yang ingin diubah menjadi QR code',
          'QR code akan otomatis ter-generate saat Anda mengetik',
          'Kustomisasi warna QR code dan background sesuai keinginan (opsional)',
          'Gunakan tombol "Unduh" untuk menyimpan QR code sebagai file PNG',
          'Gunakan tombol "Salin" untuk menyalin gambar QR code ke clipboard',
          'Gunakan tombol "Hapus" untuk membersihkan dan mulai dari awal'
        ]}
        tips={[
          'QR code dapat menyimpan berbagai jenis data: URL, teks, nomor telepon, email, dll',
          'Semakin panjang teks, semakin kompleks QR code-nya',
          'Pastikan warna QR code kontras dengan background agar mudah di-scan',
          'QR code dengan level "H" (High) lebih tahan terhadap kerusakan',
          'QR code yang dihasilkan dapat di-scan dengan aplikasi QR scanner di smartphone'
        ]}
      />
    </div>
  )
}

