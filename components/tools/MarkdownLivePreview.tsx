'use client'

import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function MarkdownLivePreview() {
  const [markdown, setMarkdown] = useState(`# Heading 1
## Heading 2
### Heading 3

**Bold text** and *italic text*

- List item 1
- List item 2
- List item 3

1. Numbered item 1
2. Numbered item 2

\`inline code\`

\`\`\`javascript
// Code block
function hello() {
  console.log('Hello World');
}
\`\`\`

[Link](https://example.com)

> Blockquote

| Column 1 | Column 2 |
|----------|----------|
| Cell 1   | Cell 2   |`)
  const [copied, setCopied] = useState(false)

  const markdownToHTML = (md: string): string => {
    let html = md
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code blocks
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      // Tables
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(c => c.trim())
        if (cells.length === 0) return ''
        return '<tr>' + cells.map(c => `<td>${c.trim()}</td>`).join('') + '</tr>'
      })
      // Line breaks
      .replace(/\n/g, '<br>')

    // Wrap lists
    html = html.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')

    return html
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleClear = () => {
    setMarkdown('')
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Markdown Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Markdown Editor
            </label>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? 'Tersalin' : 'Salin'}
            </Button>
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Ketik markdown di sini..."
            className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400 resize-none font-mono text-sm"
          />
        </div>

        {/* HTML Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Live Preview
          </label>
          <div
            className="w-full h-96 px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white overflow-y-auto prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: markdownToHTML(markdown) }}
          />
        </div>
      </div>

      <Button variant="outline" onClick={handleClear} disabled={!markdown} className="w-full">
        Hapus
      </Button>
    </div>
  )
}

