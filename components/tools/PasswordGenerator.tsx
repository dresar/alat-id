'use client'

import { useState } from 'react'
import { Key, Copy, Check, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

export default function PasswordGenerator() {
  const [password, setPassword] = useState('')
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [copied, setCopied] = useState(false)

  const generatePassword = () => {
    let charset = ''
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (includeNumbers) charset += '0123456789'
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'

    if (!charset) {
      setPassword('')
      return
    }

    let generated = ''
    for (let i = 0; i < length; i++) {
      generated += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setPassword(generated)
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 12) strength++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
    if (/\d/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++

    if (strength <= 2) return { level: strength, label: 'Lemah', color: 'red' }
    if (strength <= 3) return { level: strength, label: 'Sedang', color: 'yellow' }
    if (strength <= 4) return { level: strength, label: 'Kuat', color: 'green' }
    return { level: strength, label: 'Sangat Kuat', color: 'green' }
  }

  const strength = getPasswordStrength()

  return (
    <div className="space-y-6">
      {/* Length Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Key className="h-4 w-4" />
            Panjang Password
          </label>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{length}</span>
        </div>
        <input
          type="range"
          min="4"
          max="64"
          value={length}
          onChange={(e) => setLength(parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      {/* Options */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pilihan Karakter
        </label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Huruf Besar (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Huruf Kecil (a-z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Angka (0-9)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Simbol (!@#$%...)</span>
          </label>
        </div>
      </div>

      {/* Generate Button */}
      <Button
        onClick={generatePassword}
        disabled={!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols}
        className="w-full"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Generate Password
      </Button>

      {/* Password Display */}
      {password && (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <code className="text-lg font-mono text-gray-900 dark:text-gray-100 break-all">
                {password}
              </code>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Kekuatan Password:
              </span>
              <span className={`text-sm font-semibold ${
                strength.color === 'red' ? 'text-red-600 dark:text-red-400' :
                strength.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-green-600 dark:text-green-400'
              }`}>
                {strength.label}
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${
                  strength.color === 'red' ? 'bg-red-500' :
                  strength.color === 'yellow' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(strength.level / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <ToolGuide
        title="Panduan Generator Password"
        steps={[
          'Atur panjang password menggunakan slider (4-64 karakter)',
          'Pilih jenis karakter yang ingin digunakan: huruf besar, huruf kecil, angka, dan simbol',
          'Klik tombol "Generate Password" untuk membuat password acak',
          'Password akan muncul dengan indikator kekuatan (Lemah, Sedang, Kuat, Sangat Kuat)',
          'Gunakan tombol "Salin" untuk menyalin password ke clipboard',
          'Generate ulang untuk mendapatkan password yang berbeda'
        ]}
        tips={[
          'Password yang kuat minimal 12 karakter dengan kombinasi semua jenis karakter',
          'Jangan gunakan password yang sama untuk banyak akun',
          'Simpan password di password manager yang aman',
          'Hindari menggunakan informasi pribadi dalam password',
          'Semakin panjang dan kompleks password, semakin aman'
        ]}
      />
    </div>
  )
}

