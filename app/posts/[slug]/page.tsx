import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPostBySlug, getPostContent } from '@/lib/notion'

// Next.js 16: params는 Promise 타입 — await 필요
type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) return {}

  return {
    title: post.title,
    description: `${post.category} | ${post.tags.join(', ')}`,
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const blocks = await getPostContent(post.id)

  return (
    <main className="max-w-3xl mx-auto w-full px-6 py-16">
      <header className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight mb-3">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-zinc-400">
          {post.category && (
            <span className="bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded text-xs">
              {post.category}
            </span>
          )}
          {post.tags.map((tag) => (
            <span key={tag} className="text-zinc-400">
              #{tag}
            </span>
          ))}
          {post.published && <span>{post.published}</span>}
        </div>
      </header>

      <article className="prose prose-zinc max-w-none">
        {/* 블록 렌더링은 추후 구현 예정. 현재는 블록 수만 표시. */}
        <p className="text-zinc-400 text-sm">
          총 {blocks.length}개의 콘텐츠 블록이 있습니다. (블록 렌더러 구현 예정)
        </p>
      </article>
    </main>
  )
}
