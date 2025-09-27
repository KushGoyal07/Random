import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

export const parseResume = async (file) => {
  try {
    let text = ''
    
    if (file.type === 'application/pdf') {
      text = await parsePDF(file)
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      text = await parseDOCX(file)
    } else {
      throw new Error('Unsupported file type')
    }

    // Extract information from text
    const candidateData = extractCandidateInfo(text)
    
    return candidateData
  } catch (error) {
    console.error('Resume parsing error:', error)
    throw new Error('Failed to parse resume')
  }
}

const parsePDF = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    const pageText = textContent.items.map(item => item.str).join(' ')
    text += pageText + ' '
  }

  return text
}

const parseDOCX = async (file) => {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

const extractCandidateInfo = (text) => {
  const candidateData = {
    id: Date.now().toString(),
    name: null,
    email: null,
    phone: null,
    rawText: text
  }

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emailMatch = text.match(emailRegex)
  if (emailMatch) {
    candidateData.email = emailMatch[0]
  }

  // Extract phone number
  const phoneRegex = /(\+?1?[-.\s]?)?\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})/g
  const phoneMatch = text.match(phoneRegex)
  if (phoneMatch) {
    candidateData.phone = phoneMatch[0].replace(/\D/g, '').replace(/^1/, '')
    candidateData.phone = candidateData.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3')
  }

  // Extract name (simple heuristic - first line or before email)
  const lines = text.split('\n').filter(line => line.trim().length > 0)
  if (lines.length > 0) {
    // Try to find name in first few lines
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      const line = lines[i].trim()
      // Skip lines that look like headers, emails, or phone numbers
      if (!line.includes('@') && 
          !line.match(/\d{3}/) && 
          line.length > 2 && 
          line.length < 50 &&
          !line.toLowerCase().includes('resume') &&
          !line.toLowerCase().includes('cv')) {
        // Check if it looks like a name (2-4 words, mostly letters)
        const words = line.split(/\s+/)
        if (words.length >= 2 && words.length <= 4) {
          const isName = words.every(word => 
            /^[A-Za-z]+$/.test(word) && word.length > 1
          )
          if (isName) {
            candidateData.name = line
            break
          }
        }
      }
    }
  }

  return candidateData
}
