import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File
    const format = formData.get('format') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    let convertedBuffer: Buffer
    let mimeType: string

    switch (format) {
      case 'webp':
        convertedBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer()
        mimeType = 'image/webp'
        break
      case 'png':
        convertedBuffer = await sharp(buffer).png({ quality: 90 }).toBuffer()
        mimeType = 'image/png'
        break
      case 'jpg':
      case 'jpeg':
        convertedBuffer = await sharp(buffer).jpeg({ quality: 90 }).toBuffer()
        mimeType = 'image/jpeg'
        break
      default:
        return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }

    return new NextResponse(convertedBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="converted.${format}"`,
      },
    })
  } catch (error) {
    console.error('Image conversion error:', error)
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    )
  }
}

