import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostsByCategory } from '@/lib/notion'

// Next.js 16: params는 Promise 타입
type Props = {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const decoded = decodeURIComponent(category)

  return {
    title: `카테고리: ${decoded}`,
    description: `소울칼리버 블로그의 ${decoded} 카테고리 글 목록`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const decoded = decodeURIComponent(category)
  const posts = await getPostsByCategory(decoded)

  if (posts.length === 0) notFound()

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">{decoded}</h1>
      <p className="text-zinc-400 text-sm mb-10">카테고리 · {posts.length}개의 글</p>

      <ul className="flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.id} className="border-b border-zinc-100 pb-6">
            <Link href={`/posts/${post.slug}`} className="group">
              <h2 className="text-lg font-medium group-hover:underline">{post.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                {post.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
                {post.published && <span>{post.published}</span>}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
