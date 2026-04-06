import { Client } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { NotionPost, NotionBlock } from '@/types/notion'

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ''

/**
 * Notion API v5 breaking change:
 * databases.query() 가 제거되었다. 대신 search() API + parent.database_id 필터로
 * 특정 데이터베이스의 페이지를 가져온다.
 *
 * 트레이드오프: search는 전체 워크스페이스를 대상으로 하므로 클라이언트 사이드에서
 * database_id로 한 번 더 필터링이 필요하다. 데이터가 많아지면 페이지네이션과
 * 함께 캐싱 전략을 검토해야 한다.
 */
async function getPagesByDatabase(databaseId: string): Promise<PageObjectResponse[]> {
  const results: PageObjectResponse[] = []
  let cursor: string | undefined

  do {
    const response = await notion.search({
      filter: { property: 'object', value: 'page' },
      sort: { timestamp: 'last_edited_time', direction: 'descending' },
      ...(cursor ? { start_cursor: cursor } : {}),
      page_size: 100,
    })

    for (const item of response.results) {
      if (
        item.object === 'page' &&
        'parent' in item &&
        item.parent.type === 'database_id' &&
        item.parent.database_id.replace(/-/g, '') === databaseId.replace(/-/g, '')
      ) {
        results.push(item as PageObjectResponse)
      }
    }

    cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined
  } while (cursor)

  return results
}

// Notion API 응답에서 NotionPost 타입으로 변환
function toPost(page: PageObjectResponse): NotionPost {
  const props = page.properties

  const titleProp = props['Title']
  const title =
    titleProp?.type === 'title'
      ? titleProp.title.map((t) => ('plain_text' in t ? t.plain_text : '')).join('')
      : ''

  const categoryProp = props['Category']
  const category =
    categoryProp?.type === 'select' && categoryProp.select ? categoryProp.select.name : ''

  const tagsProp = props['Tags']
  const tags =
    tagsProp?.type === 'multi_select' ? tagsProp.multi_select.map((t) => t.name) : []

  const publishedProp = props['Published']
  const published =
    publishedProp?.type === 'date' && publishedProp.date ? publishedProp.date.start : ''

  const statusProp = props['Status']
  const statusName =
    statusProp?.type === 'select' && statusProp.select ? statusProp.select.name : ''

  return {
    id: page.id,
    title,
    category,
    tags,
    published: published ?? '',
    status: statusName === '발행됨' ? 'published' : 'draft',
    slug: encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-')),
  }
}

/**
 * 발행된 글 목록 조회 (최신 발행일순)
 */
export async function getPosts(): Promise<NotionPost[]> {
  const pages = await getPagesByDatabase(DATABASE_ID)

  return pages
    .map(toPost)
    .filter((p) => p.status === 'published')
    .sort((a, b) => {
      if (!a.published) return 1
      if (!b.published) return -1
      return b.published.localeCompare(a.published)
    })
}

/**
 * slug으로 단건 조회
 * slug은 title 기반이므로 발행된 목록에서 매칭한다.
 */
export async function getPostBySlug(slug: string): Promise<NotionPost | null> {
  const posts = await getPosts()
  return posts.find((p) => p.slug === slug) ?? null
}

/**
 * 카테고리별 글 목록 조회
 */
export async function getPostsByCategory(category: string): Promise<NotionPost[]> {
  const posts = await getPosts()
  return posts.filter((p) => p.category === category)
}

/**
 * 페이지 본문 블록 조회
 * 현재는 flat한 블록 목록만 반환한다. 중첩 블록은 별도 요청이 필요하다.
 */
export async function getPostContent(pageId: string): Promise<NotionBlock[]> {
  const response = await notion.blocks.children.list({
    block_id: pageId,
  })

  return response.results as NotionBlock[]
}
