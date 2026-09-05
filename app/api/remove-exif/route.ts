import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    // Remove all EXIF/metadata using sharp
    // Sharp automatically strips metadata when converting
    const processedBuffer = await sharp(buffer)
      .withMetadata({}) // Empty metadata object removes all EXIF
      .jpeg({ quality: 90 })
      .toBuffer()

    return new NextResponse(processedBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Content-Disposition': `attachment; filename="no-exif-${file.name}"`,
      },
    })
  } catch (error) {
    console.error('EXIF removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove EXIF data' },
      { status: 500 }
    )
  }
}

