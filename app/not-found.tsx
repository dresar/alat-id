import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        404 - Tool Not Found
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Tool yang Anda cari tidak ditemukan.
      </p>
      <Link href="/">
        <Button>Kembali ke Beranda</Button>
      </Link>
    </div>
  )
}

