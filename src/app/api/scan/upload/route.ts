import { NextResponse } from 'next/server'

const MAX_FILE_SIZE = 25 * 1024 * 1024

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: 'File too large. Maximum 25MB.' }, { status: 400 })

    const buffer = Buffer.from(await file.arrayBuffer())
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const mimeType = file.type

    let extractedText = ''
    let fileType = ''
    let documentBase64: string | null = null
    let documentMediaType: string | null = null

    if (ext === 'pdf' || mimeType === 'application/pdf') {
      fileType = 'PDF'
      documentBase64 = buffer.toString('base64')
      documentMediaType = 'application/pdf'
    } else if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileType = 'DOCX'
      const mammoth = await import('mammoth')
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value.slice(0, 50000)
    } else if (ext === 'txt' || mimeType === 'text/plain') {
      fileType = 'TEXT'
      extractedText = buffer.toString('utf-8').slice(0, 50000)
    } else if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'heic', 'tiff', 'svg'].includes(ext) || mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'For accurate analysis, please upload a PDF or Word document. Photos of contracts cannot be reliably scanned. Use your phone\'s built-in scanner (Notes on iPhone, Google Drive on Android) to create a PDF first.' },
        { status: 400 }
      )
    } else {
      return NextResponse.json({ error: `Unsupported file type: .${ext}. Accepted: PDF, DOCX, TXT` }, { status: 400 })
    }

    return NextResponse.json({ text: extractedText, fileType, fileName: file.name, fileSize: file.size, documentBase64, documentMediaType })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: `Failed to process file: ${error.message}` }, { status: 500 })
  }
}
