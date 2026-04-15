import { revalidateTag } from 'next/cache'
import { NextRequest } from 'next/server'

// POST /api/revalidate
// Notion 데이터 변경 시 수동으로 캐시를 무효화하는 엔드포인트
// Header: x-revalidate-secret: <REVALIDATE_SECRET>
// Body: { "tag": "invoice-<pageId>" } or {} (전체 무효화)
export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret')
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json().catch(() => ({}))
  // 특정 견적서 태그 지정 시 해당 항목만 무효화, 없으면 전체 무효화
  const tag: string = body.tag ?? 'invoice'

  // 'max': 기존 캐시를 즉시 만료시키지 않고 다음 방문 시 백그라운드 갱신 (권장)
  revalidateTag(tag, 'max')

  return Response.json({
    revalidated: true,
    tag,
    timestamp: new Date().toISOString(),
  })
}
