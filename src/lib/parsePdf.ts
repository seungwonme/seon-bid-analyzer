let initialized = false

async function getPdfjs() {
  // 브라우저에서만 로드 — 모듈 평가 시점에 DOMMatrix 등 브라우저 API를 호출하는
  // pdfjs canvas.js 때문에 top-level import 하면 SSR/Turbopack 빌드에서 터짐
  const pdfjs = await import('pdfjs-dist')
  if (!initialized) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString()
    initialized = true
  }
  return pdfjs
}

export async function extractTextFromPdf(file: File): Promise<string> {
  const pdfjs = await getPdfjs()
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()

    const lineGroups = new Map<number, { x: number; str: string }[]>()

    for (const item of content.items) {
      if (!('str' in item)) continue
      const ti = item as { str: string; transform: number[] }
      if (!ti.str.trim()) continue
      const y = Math.round(ti.transform[5])
      const x = ti.transform[4]
      if (!lineGroups.has(y)) lineGroups.set(y, [])
      lineGroups.get(y)!.push({ x, str: ti.str })
    }

    const sortedYs = [...lineGroups.keys()].sort((a, b) => b - a)
    const lines = sortedYs
      .map(y =>
        lineGroups
          .get(y)!
          .sort((a, b) => a.x - b.x)
          .map(i => i.str)
          .join(' ')
          .trim()
      )
      .filter(Boolean)

    pages.push(lines.join('\n'))
  }

  return pages.join('\n')
}
