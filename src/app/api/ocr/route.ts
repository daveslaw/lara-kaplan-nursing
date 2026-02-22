import { NextRequest, NextResponse } from 'next/server'
import { extractAllFields } from '@/lib/ocr/fieldExtractor'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Google Vision API key not configured' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  let imageBase64: string

  if (file.type === 'application/pdf') {
    // Use Google Vision's PDF support via base64
    imageBase64 = buffer.toString('base64')
    // Call Vision with PDF mime type
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/files:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            inputConfig: {
              content: imageBase64,
              mimeType: 'application/pdf',
            },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
            pages: [1, 2, 3, 4, 5],
          }],
        }),
      }
    )

    if (!visionRes.ok) {
      const err = await visionRes.text()
      return NextResponse.json({ error: `Vision API error: ${err}` }, { status: 500 })
    }

    const visionData = await visionRes.json()
    const pageResponses: Array<{ fullTextAnnotation?: { text?: string } }> =
      visionData.responses?.[0]?.responses ?? []
    const rawText = pageResponses
      .map((p, i) => `--- PAGE ${i + 1} ---\n${p.fullTextAnnotation?.text ?? ''}`)
      .join('\n')
    const extracted = extractAllFields(rawText)

    return NextResponse.json({ rawText, ...extracted })
  } else {
    // Image file (jpg, png, etc.)
    imageBase64 = buffer.toString('base64')

    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requests: [{
            image: { content: imageBase64 },
            features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
          }],
        }),
      }
    )

    if (!visionRes.ok) {
      const err = await visionRes.text()
      return NextResponse.json({ error: `Vision API error: ${err}` }, { status: 500 })
    }

    const visionData = await visionRes.json()
    const rawText = visionData.responses?.[0]?.fullTextAnnotation?.text || ''
    const extracted = extractAllFields(rawText)

    return NextResponse.json({ rawText, ...extracted })
  }
}
