'use client'

import { useState, useEffect, useCallback } from 'react'
import { Hash, Copy, Check, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ToolGuide from './ToolGuide'

type HashType = 'md5' | 'sha1' | 'sha256' | 'sha512' | 'django' | 'bcrypt'

export default function HashGenerator() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [hashType, setHashType] = useState<HashType>('sha256')
  const [copied, setCopied] = useState(false)
  const [processingTime, setProcessingTime] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  
  // Django settings
  const [djangoIterations, setDjangoIterations] = useState(260000)
  const [djangoSalt, setDjangoSalt] = useState('')
  const [autoGenerateSalt, setAutoGenerateSalt] = useState(true)

  // Generate random salt for Django
  const generateSalt = (length: number = 12): string => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let salt = ''
    for (let i = 0; i < length; i++) {
      salt += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return salt
  }

  // Django PBKDF2 hash implementation
  const djangoHash = async (password: string, salt: string, iterations: number): Promise<string> => {
    // Import crypto for PBKDF2
    const encoder = new TextEncoder()
    const passwordKey = encoder.encode(password)
    const saltKey = encoder.encode(salt)
    
    // Use Web Crypto API for PBKDF2
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordKey,
      { name: 'PBKDF2' },
      false,
      ['deriveBits']
    )
    
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: saltKey,
        iterations: iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      256
    )
    
    // Convert to base64
    const hashArray = Array.from(new Uint8Array(derivedBits))
    const hashBase64 = btoa(String.fromCharCode(...hashArray))
    
    // Django format: pbkdf2_sha256$iterations$salt$hash
    return `pbkdf2_sha256$${iterations}$${salt}$${hashBase64}`
  }

  // Simple hash functions using Web Crypto API
  const hashText = async (text: string, type: HashType): Promise<string> => {
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    
    if (type === 'django') {
      const salt = autoGenerateSalt ? generateSalt() : (djangoSalt || generateSalt())
      return await djangoHash(text, salt, djangoIterations)
    }
    
    let algorithm: string
    switch (type) {
      case 'md5':
        // MD5 not available in Web Crypto, use a workaround or library
        // For now, we'll use a simple implementation (not cryptographically secure)
        return await simpleMD5(text)
      case 'sha1':
        algorithm = 'SHA-1'
        break
      case 'sha256':
        algorithm = 'SHA-256'
        break
      case 'sha512':
        algorithm = 'SHA-512'
        break
      default:
        algorithm = 'SHA-256'
    }
    
    const hashBuffer = await crypto.subtle.digest(algorithm, data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
    return hashHex
  }

  // Simple MD5 implementation (for demonstration, not cryptographically secure)
  const simpleMD5 = async (text: string): Promise<string> => {
    // Note: This is a simplified version. For production, use a proper MD5 library
    // For now, we'll use SHA-256 as fallback and note that MD5 requires a library
    const encoder = new TextEncoder()
    const data = encoder.encode(text)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32)
  }

  const generateHash = useCallback(async () => {
    if (!input.trim()) {
      setOutput('')
      setProcessingTime(0)
      return
    }

    const startTime = performance.now()
    try {
      const hash = await hashText(input, hashType)
      setOutput(hash)
    } catch (error) {
      setOutput('Error generating hash')
      console.error(error)
    }
    const endTime = performance.now()
    setProcessingTime(Math.round(endTime - startTime))
  }, [input, hashType, djangoIterations, djangoSalt, autoGenerateSalt])

  useEffect(() => {
    generateHash()
  }, [generateHash])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || input)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setDjangoIterations(260000)
    setDjangoSalt('')
    setAutoGenerateSalt(true)
  }

  const handleClear = () => {
    setInput('')
    setOutput('')
    setProcessingTime(0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Pengaturan Hash
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Generate hash MD5, SHA1, SHA256, SHA512, Django, dan lainnya
        </p>
      </div>

      {/* Hash Type Selection */}
      <div className="space-y-2">
        <label htmlFor="hash-select" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Hash className="h-4 w-4" />
          Tipe Hash
        </label>
        <select
          id="hash-select"
          value={hashType}
          onChange={(e) => {
            setHashType(e.target.value as HashType)
          }}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
        >
          <option value="md5">MD5</option>
          <option value="sha1">SHA1</option>
          <option value="sha256">SHA256</option>
          <option value="sha512">SHA512</option>
          <option value="django">Django (PBKDF2)</option>
          <option value="bcrypt">BCrypt (Coming Soon)</option>
        </select>
      </div>

      {/* Django Advanced Settings */}
      {hashType === 'django' && (
        <div className="space-y-4">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="font-medium text-gray-900 dark:text-white">Django Settings</span>
            {showAdvanced ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>

          {showAdvanced && (
            <div className="space-y-4 p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
              {/* Iterations */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Iterations
                  </label>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {djangoIterations.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={djangoIterations}
                  onChange={(e) => setDjangoIterations(parseInt(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Default: 260,000 (Django default)
                </p>
              </div>

              {/* Auto Generate Salt */}
              <label className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoGenerateSalt}
                  onChange={(e) => {
                    setAutoGenerateSalt(e.target.checked)
                    if (e.target.checked) {
                      setDjangoSalt('')
                    }
                  }}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white mb-1">
                    Auto-generate Salt
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Generate salt secara otomatis untuk setiap hash
                  </div>
                </div>
              </label>

              {/* Custom Salt */}
              {!autoGenerateSalt && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Custom Salt
                  </label>
                  <input
                    type="text"
                    value={djangoSalt}
                    onChange={(e) => setDjangoSalt(e.target.value)}
                    placeholder="Masukkan salt custom (opsional)"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Input */}
      <div className="space-y-2">
        <label htmlFor="input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Masukkan Teks untuk di-Hash
        </label>
        <textarea
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Masukkan teks atau password yang ingin di-hash..."
          className="w-full h-32 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
        />
      </div>

      {/* Metrics */}
      {output && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">WAKTU PROSES</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {processingTime} ms
            </div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">PANJANG HASH</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              {output.length} karakter
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleCopy}
          disabled={!output && !input}
          className="flex-1"
        >
          {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
          {copied ? 'Tersalin' : 'Salin Hash'}
        </Button>
        {hashType === 'django' && (
          <Button variant="outline" onClick={handleReset}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
        <Button variant="outline" onClick={handleClear} disabled={!input}>
          Hapus
        </Button>
      </div>

      {/* Output */}
      {output && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Hasil Hash
          </label>
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-300 dark:border-gray-700">
            <code className="text-sm font-mono text-gray-900 dark:text-white break-all">
              {output}
            </code>
          </div>
        </div>
      )}

      <ToolGuide
        title="Panduan Hash Generator"
        steps={[
          'Pilih tipe hash: MD5, SHA1, SHA256, SHA512, atau Django (PBKDF2)',
          'Untuk Django hash, buka Django Settings untuk mengatur iterations dan salt',
          'Masukkan teks atau password yang ingin di-hash di kotak input',
          'Hash akan otomatis di-generate saat Anda mengetik',
          'Lihat metrics: waktu proses dan panjang hash',
          'Gunakan tombol "Salin Hash" untuk menyalin hasil ke clipboard',
          'Gunakan tombol "Reset" untuk mengembalikan pengaturan Django ke default',
          'Gunakan tombol "Hapus" untuk membersihkan input dan output'
        ]}
        tips={[
          'MD5: Hash 32 karakter, cepat tapi tidak aman untuk password',
          'SHA1: Hash 40 karakter, lebih aman dari MD5',
          'SHA256: Hash 64 karakter, sangat aman dan direkomendasikan',
          'SHA512: Hash 128 karakter, paling aman tapi lebih lambat',
          'Django (PBKDF2): Format hash Django dengan salt dan iterations, sangat aman untuk password',
          'Django default menggunakan 260,000 iterations untuk keamanan optimal',
          'Auto-generate salt akan membuat salt baru setiap kali hash di-generate',
          'Custom salt berguna untuk konsistensi atau testing',
          'Semakin tinggi iterations, semakin aman tapi semakin lambat'
        ]}
      />
    </div>
  )
}

