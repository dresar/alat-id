'use client'

import { useState } from 'react'
import { MessageCircle, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function WhatsAppLink() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [message, setMessage] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)

  const generateLink = () => {
    if (!phoneNumber) {
      setLink('')
      return
    }

    // Remove any non-digit characters
    const cleanedPhone = phoneNumber.replace(/\D/g, '')
    
    // If phone doesn't start with country code, assume it's Indonesian (+62)
    let formattedPhone = cleanedPhone
    if (!cleanedPhone.startsWith('62') && cleanedPhone.length > 0) {
      formattedPhone = '62' + cleanedPhone
    }

    let whatsappLink = `https://wa.me/${formattedPhone}`
    
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message)
      whatsappLink += `?text=${encodedMessage}`
    }

    setLink(whatsappLink)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(link)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setPhoneNumber('')
    setMessage('')
    setLink('')
  }

  return (
    <div className="space-y-6">
      {/* Phone Number Input */}
      <div className="space-y-2">
        <label htmlFor="phone-input" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <MessageCircle className="h-4 w-4" />
          Nomor WhatsApp
        </label>
        <input
          id="phone-input"
          type="text"
          value={phoneNumber}
          onChange={(e) => {
            setPhoneNumber(e.target.value)
            generateLink()
          }}
          placeholder="081234567890 atau +6281234567890"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Masukkan nomor dengan atau tanpa kode negara
        </p>
      </div>

      {/* Message Input */}
      <div className="space-y-2">
        <label htmlFor="message-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pesan (Opsional)
        </label>
        <textarea
          id="message-input"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            generateLink()
          }}
          placeholder="Pesan yang akan muncul saat link dibuka..."
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none"
        />
      </div>

      {/* Generate Button */}
      <Button
        onClick={generateLink}
        disabled={!phoneNumber}
        className="w-full"
      >
        Generate Link
      </Button>

      {/* Result */}
      {link && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline break-all flex-1"
              >
                {link}
              </a>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <MessageCircle className="h-4 w-4 mr-2" />
                Buka WhatsApp
              </Button>
            </a>
            <Button
              variant="outline"
              onClick={handleClear}
            >
              Hapus
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

