import Link from 'next/link'
import { getPosts } from '@/lib/notion'

export default async function HomePage() {
  // Notion 환경 변수가 설정되지 않은 경우 빈 배열을 반환
  const posts = process.env.NOTION_TOKEN ? await getPosts() : []

  return (
    <main className="flex flex-col flex-1 max-w-3xl mx-auto w-full px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight mb-2">나만의 소울칼리버 블로그</h1>
      <p className="text-zinc-500 mb-12">Notion CMS 기반 소울칼리버 자료 및 대전회고</p>

      {posts.length === 0 ? (
        <p className="text-zinc-400 text-sm">
          아직 발행된 글이 없거나 환경 변수가 설정되지 않았습니다.
          <br />
          <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">.env.local</code>에{' '}
          <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">NOTION_TOKEN</code>과{' '}
          <code className="text-xs bg-zinc-100 px-1 py-0.5 rounded">NOTION_DATABASE_ID</code>를
          설정하세요.
        </p>
      ) : (
        <ul className="flex flex-col gap-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-zinc-100 pb-6">
              <Link href={`/posts/${post.slug}`} className="group">
                <h2 className="text-lg font-medium group-hover:underline">{post.title}</h2>
                <div className="flex items-center gap-3 mt-1 text-sm text-zinc-400">
                  {post.category && <span>{post.category}</span>}
                  {post.published && <span>{post.published}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
