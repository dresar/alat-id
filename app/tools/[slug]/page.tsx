import { notFound } from 'next/navigation'
import { getToolBySlug, tools } from '@/lib/tools-data'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

// Dynamic imports for tool components
const toolComponents: Record<string, React.ComponentType> = {
  'penghitung-kata': dynamic(() => import('@/components/tools/WordCounter'), { ssr: false }),
  'ubah-huruf': dynamic(() => import('@/components/tools/TextCaseConverter'), { ssr: false }),
  'cari-ganti-teks': dynamic(() => import('@/components/tools/FindReplace'), { ssr: false }),
  'hapus-baris-duplikat': dynamic(() => import('@/components/tools/RemoveDuplicateLines'), { ssr: false }),
  'pembanding-teks': dynamic(() => import('@/components/tools/TextComparator'), { ssr: false }),
  'ascii-art': dynamic(() => import('@/components/tools/ASCIIArt'), { ssr: false }),
  'kompres-gambar': dynamic(() => import('@/components/tools/ImageCompressor'), { ssr: false }),
  'crop-foto': dynamic(() => import('@/components/tools/ImageCropper'), { ssr: false }),
  'hapus-latar-belakang': dynamic(() => import('@/components/tools/RemoveBackground'), { ssr: false }),
  'konversi-format-gambar': dynamic(() => import('@/components/tools/ImageConverter'), { ssr: false }),
  'kompres-audio': dynamic(() => import('@/components/tools/AudioCompressor'), { ssr: false }),
  'pemotong-audio': dynamic(() => import('@/components/tools/AudioCutter'), { ssr: false }),
  'kompres-video': dynamic(() => import('@/components/tools/VideoCompressor'), { ssr: false }),
  'crop-video': dynamic(() => import('@/components/tools/VideoCropper'), { ssr: false }),
  'json-formatter': dynamic(() => import('@/components/tools/JSONFormatter'), { ssr: false }),
  'json-diff': dynamic(() => import('@/components/tools/JSONDiff'), { ssr: false }),
  'minify-css': dynamic(() => import('@/components/tools/MinifyCSS'), { ssr: false }),
  'minify-javascript': dynamic(() => import('@/components/tools/MinifyJS'), { ssr: false }),
  'unminify': dynamic(() => import('@/components/tools/Unminify'), { ssr: false }),
  'javascript-obfuscator': dynamic(() => import('@/components/tools/JSObfuscator'), { ssr: false }),
  'hapus-komentar': dynamic(() => import('@/components/tools/CommentRemover'), { ssr: false }),
  'dns-lookup': dynamic(() => import('@/components/tools/DNSLookup'), { ssr: false }),
  'ip-lookup': dynamic(() => import('@/components/tools/IPLookup'), { ssr: false }),
  'kode-qr': dynamic(() => import('@/components/tools/QRCodeGenerator'), { ssr: false }),
  'password': dynamic(() => import('@/components/tools/PasswordGenerator'), { ssr: false }),
  'lorem-ipsum': dynamic(() => import('@/components/tools/LoremIpsum'), { ssr: false }),
  'link-whatsapp': dynamic(() => import('@/components/tools/WhatsAppLink'), { ssr: false }),
  'youtube-transcript': dynamic(() => import('@/components/tools/YouTubeTranscript'), { ssr: false }),
  'signature-background-remover': dynamic(() => import('@/components/tools/SignatureBackgroundRemover'), { ssr: false }),
  'screenshot-beautifier': dynamic(() => import('@/components/tools/ScreenshotBeautifier'), { ssr: false }),
  'image-exif-remover': dynamic(() => import('@/components/tools/ImageEXIFRemover'), { ssr: false }),
  'base64-image-encoder': dynamic(() => import('@/components/tools/Base64ImageEncoder'), { ssr: false }),
  'json-to-csv': dynamic(() => import('@/components/tools/JSONToCSV'), { ssr: false }),
  'sql-formatter': dynamic(() => import('@/components/tools/SQLFormatter'), { ssr: false }),
  'css-gradient-generator': dynamic(() => import('@/components/tools/CSSGradientGenerator'), { ssr: false }),
  'color-converter': dynamic(() => import('@/components/tools/ColorConverter'), { ssr: false }),
  'unix-timestamp-converter': dynamic(() => import('@/components/tools/UnixTimestampConverter'), { ssr: false }),
  'text-diff-checker': dynamic(() => import('@/components/tools/TextComparator'), { ssr: false }),
  'markdown-live-preview': dynamic(() => import('@/components/tools/MarkdownLivePreview'), { ssr: false }),
  'hash-generator': dynamic(() => import('@/components/tools/HashGenerator'), { ssr: false }),
  'minify-html': dynamic(() => import('@/components/tools/MinifyHTML'), { ssr: false }),
  'pembaca-readme': dynamic(() => import('@/components/tools/ReadmeViewer'), { ssr: false }),
  'mock-data-generator': dynamic(() => import('@/components/tools/MockDataGenerator'), { ssr: false }),
  'og-image-generator': dynamic(() => import('@/components/tools/OGImageGenerator'), { ssr: false }),
  'pdf-invoice-generator': dynamic(() => import('@/components/tools/PDFInvoiceGenerator'), { ssr: false }),
  'svg-shape-generator': dynamic(() => import('@/components/tools/SVGShapeGenerator'), { ssr: false }),
  'code-snippet-image': dynamic(() => import('@/components/tools/CodeSnippetImage'), { ssr: false }),
  'e-certificate-generator': dynamic(() => import('@/components/tools/ECertificateGenerator'), { ssr: false }),
  'github-profile-generator': dynamic(() => import('@/components/tools/GithubProfileGenerator'), { ssr: false }),
  'css-glass-neumorphism': dynamic(() => import('@/components/tools/CSSGlassNeumorphism'), { ssr: false }),
  'wifi-card-generator': dynamic(() => import('@/components/tools/WifiCardGenerator'), { ssr: false }),
  'json-to-type': dynamic(() => import('@/components/tools/JsonToTypeGenerator'), { ssr: false }),
  'random-palette-generator': dynamic(() => import('@/components/tools/RandomPaletteGenerator'), { ssr: false }),
  'pwa-manifest-icon': dynamic(() => import('@/components/tools/PWAManifestIconGenerator'), { ssr: false }),
  'nginx-config-generator': dynamic(() => import('@/components/tools/NginxConfigGenerator'), { ssr: false }),
  'barcode-generator': dynamic(() => import('@/components/tools/BarcodeGenerator'), { ssr: false }),
  'user-avatar-generator': dynamic(() => import('@/components/tools/UserAvatarGenerator'), { ssr: false }),
}

export async function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tool = getToolBySlug(params.slug)
  
  if (!tool) {
    return {
      title: 'Tool Not Found',
    }
  }

  return {
    title: `${tool.name} - Alat.id`,
    description: tool.description,
  }
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug)

  if (!tool) {
    notFound()
  }

  const ToolComponent = toolComponents[tool.slug] || (() => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">{tool.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">Tool sedang dalam pengembangan...</p>
      </div>
    </div>
  ))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {tool.name}
              </h1>
              <p className="text-gray-700 dark:text-gray-300">
                {tool.description}
              </p>
            </div>
            <Link href="/" prefetch={false}>
              <Button variant="outline" size="sm">
                Kembali
              </Button>
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 p-6">
          <ToolComponent />
        </div>
      </div>
    </div>
  )
}

