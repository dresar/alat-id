import { Info } from 'lucide-react'

interface ToolGuideProps {
  title: string
  steps: string[]
  tips?: string[]
}

export default function ToolGuide({ title, steps, tips }: ToolGuideProps) {
  return (
    <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-start gap-3 mb-4">
        <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            {title}
          </h3>
          
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                Cara Menggunakan:
              </h4>
              <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                {steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>

            {tips && tips.length > 0 && (
              <div className="mt-4 pt-4 border-t border-blue-200 dark:border-blue-700">
                <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  💡 Tips:
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-sm text-blue-700 dark:text-blue-300">
                  {tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

