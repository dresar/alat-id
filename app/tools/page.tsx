import Link from 'next/link'
import { tools, categories } from '@/lib/tools-data'
import { Button } from '@/components/ui/Button'

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Semua Tools</h1>
          <p className="text-gray-700 dark:text-gray-300">
            Daftar lengkap alat yang tersedia. Klik untuk membuka masing-masing tool.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span
              key={cat.id}
              className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              {cat.name}
            </span>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <div
              key={tool.id}
              className="h-full border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                  {tool.name}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {tool.description}
                </div>
              </div>
              <div className="pt-5">
                <Link href={`/tools/${tool.slug}`} prefetch={false} className="block">
                  <Button className="w-full">Buka</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


