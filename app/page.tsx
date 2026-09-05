'use client'

import { useState } from 'react'
import Link from 'next/link'
import { tools, categories, getToolsByCategory } from '@/lib/tools-data'
import * as Icons from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('semua')
  const filteredTools = getToolsByCategory(selectedCategory)

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.FileText
    return IconComponent
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Semua Alat Online dalam Satu Tempat
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-2">
          Nikmati berbagai alat online untuk mendukung kebutuhan sehari-hari. Simpel, cepat, dan mudah digunakan langsung di browser Anda.
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Gratis, cepat, dan tanpa instalasi
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {categories.map((category) => {
          const IconComponent = getIcon(category.icon)
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                selectedCategory === category.id
                  ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
              )}
            >
              <IconComponent className="h-4 w-4" />
              {category.name}
            </button>
          )
        })}
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const IconComponent = getIcon(tool.icon)
          return (
            <Link
              key={tool.id}
              href={`/tools/${tool.slug}`}
              className="group p-6 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md transition-all bg-white dark:bg-gray-900"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors">
                  <IconComponent className="h-5 w-5 text-gray-700 dark:text-gray-200" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
