import { parseFrontmatter, type Post } from './frontmatter'

export type { Post }

const postFiles = import.meta.glob('../posts/*.md', { eager: true, query: '?raw', import: 'default' })

export function getAllPosts(): Post[] {
  const posts: Post[] = []

  for (const path in postFiles) {
    const raw = postFiles[path] as string
    const { data, content } = parseFrontmatter(raw)

    posts.push({
      slug: data.slug || path.replace('../posts/', '').replace('.md', ''),
      title: data.title || 'Untitled',
      date: data.date || '',
      content,
    })
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug)
}
