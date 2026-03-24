export interface Post {
  slug: string
  title: string
  date: string
  content: string
}

export function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const lines = raw.split('\n')
  const data: Record<string, string> = {}
  let contentStart = 0

  if (lines[0]?.trim() === '---') {
    for (let i = 1; i < lines.length; i++) {
      if (lines[i]?.trim() === '---') {
        contentStart = i + 1
        break
      }
      const match = lines[i]?.match(/^(\w+):\s*(.+)$/)
      if (match) {
        data[match[1]] = match[2]
      }
    }
  }

  return {
    data,
    content: lines.slice(contentStart).join('\n').trim(),
  }
}
