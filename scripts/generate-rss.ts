import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { parseFrontmatter, type Post } from '../src/lib/frontmatter'

const SITE_URL = 'https://jkwon.co'
const SITE_TITLE = 'jkwon'
const SITE_DESCRIPTION = "jkwon's blog"

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function hasValidDate(dateStr: string): boolean {
  if (!dateStr) return false
  const d = new Date(dateStr)
  return !isNaN(d.getTime())
}

const postsDir = join(import.meta.dirname, '..', 'src', 'posts')
const files = readdirSync(postsDir).filter((f) => f.endsWith('.md'))

const posts: Post[] = files
  .map((file) => {
    const raw = readFileSync(join(postsDir, file), 'utf-8')
    const { data, content } = parseFrontmatter(raw)
    return {
      slug: data.slug || file.replace('.md', ''),
      title: data.title || 'Untitled',
      date: data.date || '',
      content,
    }
  })
  .filter((post) => hasValidDate(post.date))

posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

const items = posts
  .map(
    (post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/thoughts/${post.slug}</link>
      <guid>${SITE_URL}/thoughts/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.content || post.title)}</description>
    </item>`
  )
  .join('\n')

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

writeFileSync(join(import.meta.dirname, '..', 'public', 'rss.xml'), rss)
console.log(`Generated RSS feed with ${posts.length} posts`)
