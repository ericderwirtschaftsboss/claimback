/**
 * Client-side text extraction from PDF, DOCX, and TXT files.
 * Runs entirely in the browser — no server upload needed.
 * This avoids Netlify's 6MB request body limit for serverless functions.
 */

export async function extractTextFromFile(file: File): Promise<{ text: string; fileType: string }> {
  const ext = file.name.split('.').pop()?.toLowerCase() || ''
  const mimeType = file.type

  if (ext === 'pdf' || mimeType === 'application/pdf') {
    const text = await extractPdfText(file)
    return { text, fileType: 'PDF' }
  }

  if (ext === 'docx' || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const text = await extractDocxText(file)
    return { text, fileType: 'DOCX' }
  }

  if (ext === 'txt' || mimeType === 'text/plain') {
    const text = await file.text()
    return { text: text.slice(0, 100000), fileType: 'TEXT' }
  }

  throw new Error(`Unsupported file type: .${ext}`)
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')

  // Use the worker file copied to /public during build
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const pages: string[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item: any) => item.str)
      .join(' ')
    pages.push(pageText)
  }

  return pages.join('\n\n').slice(0, 100000)
}

async function extractDocxText(file: File): Promise<string> {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.slice(0, 100000)
}
