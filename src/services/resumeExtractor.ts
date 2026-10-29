/**
 * Zero-Cost In-Browser Resume Extractor
 * Extracts plain text from uploaded files (PDF, DOCX, TXT) directly in the browser
 * without transmitting data to paid external AI APIs or third-party servers.
 */

export interface ExtractedResumeData {
  fileName: string;
  fileSize: number;
  extractedText: string;
  detectedEmail?: string;
  detectedPhone?: string;
  detectedSkills: string[];
  detectedLinkedIn?: string;
  detectedGitHub?: string;
  detectedPortfolio?: string;
}

const COMMON_TECH_SKILLS = [
  'React.js',
  'React',
  'JavaScript',
  'TypeScript',
  'HTML5',
  'CSS3',
  'Tailwind CSS',
  'Next.js',
  'Redux Toolkit',
  'Redux',
  'Node.js',
  'Express.js',
  'Express',
  'MongoDB',
  'RESTful APIs',
  'REST API',
  'Git',
  'GitHub',
  'Jest',
  'Vitest',
  'Webpack',
  'Vite',
  'Postman',
  'SQL',
  'PostgreSQL',
  'Java',
  'Spring Boot',
  'Docker',
  'AWS',
  'Responsive Design',
];

/**
 * Validates resume file size and type
 */
export function validateResumeFile(file: File): { isValid: boolean; error?: string } {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt'];
  const fileNameLower = file.name.toLowerCase();
  const hasValidExt = allowedExtensions.some(ext => fileNameLower.endsWith(ext));

  if (!hasValidExt) {
    return {
      isValid: false,
      error: 'Invalid file format. Please upload a PDF (.pdf), Word Document (.docx), or plain text (.txt) file.',
    };
  }

  // Max 5MB file limit for zero-cost browser storage
  const maxBytes = 5 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      isValid: false,
      error: 'File size exceeds 5MB limit. Please upload an optimized resume document.',
    };
  }

  return { isValid: true };
}

/**
 * Extracts raw text from an uploaded resume file
 */
export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  if (fileName.endsWith('.txt')) {
    return await file.text();
  }

  // For PDF or binary documents in browser, read as ArrayBuffer / Text
  const buffer = await file.arrayBuffer();
  
  if (fileName.endsWith('.pdf')) {
    return parsePdfStream(buffer);
  }

  if (fileName.endsWith('.docx')) {
    return parseDocxStream(buffer);
  }

  return await file.text();
}

/**
 * Client-side PDF text stream extractor
 * Extracts text stream tokens from PDF binary without external heavy server dependencies
 */
function parsePdfStream(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);

  // PDF stream text extraction: look for BT ... ET blocks and string tokens (..) or <..>
  const textBlocks: string[] = [];
  const streamRegex = /BT[\s\S]*?ET/g;
  let match: RegExpExecArray | null;

  while ((match = streamRegex.exec(text)) !== null) {
    const block = match[0];
    // Extract strings within parenthesis: (Hello World) Tj or [(Hello) -10 (World)] TJ
    const tjRegex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
    let tjMatch: RegExpExecArray | null;
    while ((tjMatch = tjRegex.exec(block)) !== null) {
      const decoded = tjMatch[1]
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\\t/g, ' ')
        .replace(/\\([()\\])/g, '$1');
      if (decoded.trim()) {
        textBlocks.push(decoded);
      }
    }
  }

  if (textBlocks.length > 5) {
    return textBlocks.join(' ').replace(/\s+/g, ' ');
  }

  // Fallback: extract printable ASCII / UTF sequences if compressed stream
  const printableRegex = /[A-Za-z0-9@#\$\%&*\(\)_\+\-=\[\]\{\};:'",.<>\/?|\\~]{3,}/g;
  const filteredTokens = text.match(printableRegex) || [];
  const cleanTokens = filteredTokens.filter(t => 
    !t.startsWith('/Root') && !t.startsWith('/Catalog') && !t.startsWith('/Font') && !t.includes('Obj')
  );

  return cleanTokens.slice(0, 1500).join(' ');
}

/**
 * Client-side DOCX text extractor
 * DOCX is a zip archive containing word/document.xml with <w:t> text nodes
 */
function parseDocxStream(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  
  // Extract text within XML tags: <w:t>...</w:t>
  const wtRegex = /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;
  const tokens: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = wtRegex.exec(text)) !== null) {
    if (match[1]) {
      tokens.push(match[1]);
    }
  }

  if (tokens.length > 0) {
    return tokens.join(' ');
  }

  // Fallback string matching
  return text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000);
}

/**
 * Identifies structured entities (emails, phones, skills, social links) from extracted text
 */
export function analyzeResumeText(rawText: string, file: File): ExtractedResumeData {
  // 1. Detect Email
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const detectedEmail = emailMatch ? emailMatch[0] : undefined;

  // 2. Detect Phone (+91 or 10-digit Indian numbers)
  const phoneMatch = rawText.match(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}/);
  const detectedPhone = phoneMatch ? phoneMatch[0] : undefined;

  // 3. Detect LinkedIn, GitHub, Portfolio
  const linkedInMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const gitHubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const portfolioMatch = rawText.match(/(?:https?:\/\/)[a-zA-Z0-9.-]+\.(?:dev|me|io|in|com)/i);

  // 4. Detect Technical Skills
  const detectedSkills: string[] = [];
  const textLower = rawText.toLowerCase();

  COMMON_TECH_SKILLS.forEach(skill => {
    const sLower = skill.toLowerCase();
    // Word boundary check
    const regex = new RegExp(`\\b${sLower.replace('.', '\\.')}\\b`, 'i');
    if (regex.test(textLower)) {
      if (!detectedSkills.includes(skill)) {
        detectedSkills.push(skill);
      }
    }
  });

  return {
    fileName: file.name,
    fileSize: file.size,
    extractedText: rawText,
    detectedEmail,
    detectedPhone,
    detectedSkills,
    detectedLinkedIn: linkedInMatch ? linkedInMatch[0] : undefined,
    detectedGitHub: gitHubMatch ? gitHubMatch[0] : undefined,
    detectedPortfolio: portfolioMatch ? portfolioMatch[0] : undefined,
  };
}
