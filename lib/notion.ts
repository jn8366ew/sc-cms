import { Client, APIResponseError, APIErrorCode } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { Invoice, InvoiceItem, InvoiceStatus } from '@/types/invoice'
import { STATUS_MAP } from '@/types/invoice'
import { cache } from 'react'
import { unstable_cache } from 'next/cache'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// --- Property 파싱 헬퍼 ---
// PageObjectResponse.properties는 복잡한 union 타입이므로
// 각 타입별 헬퍼로 분리해 type narrowing을 명확히 한다.

function getTitle(props: PageObjectResponse['properties'], key: string): string {
  const prop = props[key]
  if (!prop || prop.type !== 'title') return ''
  return prop.title.map((t) => t.plain_text).join('')
}

function getRichText(props: PageObjectResponse['properties'], key: string): string {
  const prop = props[key]
  if (!prop || prop.type !== 'rich_text') return ''
  return prop.rich_text.map((t) => t.plain_text).join('')
}

function getDate(props: PageObjectResponse['properties'], key: string): string {
  const prop = props[key]
  if (!prop || prop.type !== 'date' || !prop.date) return ''
  return prop.date.start
}

function getStatus(props: PageObjectResponse['properties'], key: string): InvoiceStatus {
  const prop = props[key]
  if (!prop || prop.type !== 'status' || !prop.status) return 'draft'
  return STATUS_MAP[prop.status.name] ?? 'draft'
}

function getRollupNumber(props: PageObjectResponse['properties'], key: string): number {
  const prop = props[key]
  if (!prop || prop.type !== 'rollup') return 0
  const rollup = prop.rollup
  // PartialRollupValueResponse는 number | date | array 세 가지
  if (rollup.type !== 'number' || rollup.number === null) return 0
  return rollup.number
}

function getRelationIds(props: PageObjectResponse['properties'], key: string): string[] {
  const prop = props[key]
  if (!prop || prop.type !== 'relation') return []
  return prop.relation.map((r) => r.id)
}

function getNumber(props: PageObjectResponse['properties'], key: string): number {
  const prop = props[key]
  if (!prop || prop.type !== 'number' || prop.number === null) return 0
  return prop.number
}

function getFormulaNumber(props: PageObjectResponse['properties'], key: string): number {
  const prop = props[key]
  if (!prop || prop.type !== 'formula') return 0
  const formula = prop.formula
  if (formula.type !== 'number' || formula.number === null) return 0
  return formula.number
}

// --- Items DB 단건 조회 ---

async function fetchInvoiceItem(pageId: string): Promise<InvoiceItem | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: pageId })
    // PartialPageObjectResponse에는 properties가 없다
    if (page.object !== 'page' || !('properties' in page)) return null

    const props = (page as PageObjectResponse).properties
    return {
      id: page.id,
      name: getTitle(props, '항목명'),
      unit_price: getNumber(props, '단가'),
      quantity: getNumber(props, '수량'),
      // 금액은 Notion Formula (단가 × 수량) — API가 계산 결과를 반환
      amount: getFormulaNumber(props, '금액'),
    }
  } catch {
    // 항목 페이지 조회 실패 시 해당 항목만 제외 (전체 실패 방지)
    return null
  }
}

// --- Invoices DB 단건 조회 ---

// Notion 페이지 ID는 32자 hex 또는 UUID 형식이어야 함
const NOTION_ID_RE = /^[0-9a-f]{32}$|^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// --- Notion API 직접 호출 (캐싱 레이어 없음) ---

async function fetchInvoiceData(pageId: string): Promise<Invoice | null> {
  if (!NOTION_ID_RE.test(pageId)) return null

  try {
    const page = await notion.pages.retrieve({ page_id: pageId })
    if (page.object !== 'page' || !('properties' in page)) return null

    const props = (page as PageObjectResponse).properties

    // 항목은 Relation DB — 연결된 Item 페이지 ID 배열로 각 항목을 병렬 조회
    const itemIds = getRelationIds(props, '항목')
    const itemResults = await Promise.all(itemIds.map(fetchInvoiceItem))
    const items = itemResults.filter((item): item is InvoiceItem => item !== null)

    // Rollup(총금액)은 Formula 속성 집계 시 type:'array'를 반환해 0이 나올 수 있음
    // 이미 items를 조회했으므로 여기서 직접 합산하는 것이 더 안전하다
    const total_amount = items.reduce((sum, item) => sum + item.amount, 0)

    return {
      id: page.id,
      invoice_number: getTitle(props, '견적서 번호'),
      client_name: getRichText(props, '거래처명'),
      issue_date: getDate(props, '발행일'),
      valid_until: getDate(props, '유효기간'),
      status: getStatus(props, '상태'),
      total_amount,
      items,
    }
  } catch (err) {
    if (err instanceof APIResponseError && err.code === APIErrorCode.ObjectNotFound) {
      return null // 존재하지 않는 pageId → 404 처리용
    }
    console.error('[notion] getInvoice failed:', pageId, err)
    return null
  }
}

// 레이어 1: unstable_cache — 요청 간 서버 캐싱 (5분 TTL)
// 동일 pageId 결과를 서버 메모리에 보관해 Notion API 재호출 방지
const getCachedInvoice = unstable_cache(fetchInvoiceData, ['invoice'], {
  revalidate: 300, // 5분
  tags: ['invoice'],
})

// 레이어 2: React cache() — 렌더 요청 내 deduplication
// generateMetadata + InvoicePage 두 곳에서 동일 pageId 호출 시 API 1회만 실행
export const getInvoice = cache(getCachedInvoice)
