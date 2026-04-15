/**
 * TEST_INVOICE_ID 자동 추출 스크립트
 *
 * 사용법: node scripts/get-test-invoice-id.mjs
 *
 * NOTION_API_KEY + NOTION_DATABASE_ID로 데이터베이스의 첫 번째 견적서 페이지 ID를 출력한다.
 * 출력된 ID를 .env.local의 TEST_INVOICE_ID에 붙여넣으면 된다.
 */

import { existsSync } from 'fs'

// .env.local 로드
if (existsSync('.env.local')) {
  process.loadEnvFile('.env.local')
}

const { NOTION_API_KEY, NOTION_DATABASE_ID } = process.env

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error('❌ .env.local에 NOTION_API_KEY와 NOTION_DATABASE_ID가 필요합니다.')
  process.exit(1)
}

const res = await fetch(
  `https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}/query`,
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ page_size: 3 }),
  }
)

if (!res.ok) {
  const err = await res.json()
  console.error('❌ Notion API 오류:', err.message ?? JSON.stringify(err))
  process.exit(1)
}

const data = await res.json()
const pages = data.results ?? []

if (pages.length === 0) {
  console.error('❌ 데이터베이스에 페이지가 없습니다.')
  process.exit(1)
}

console.log('\n✅ 사용 가능한 견적서 페이지 IDs:\n')
for (const page of pages) {
  // title 속성 추출 (이름 없으면 ID만 표시)
  const titleProp = Object.values(page.properties ?? {}).find(p => p.type === 'title')
  const title = titleProp?.title?.map(t => t.plain_text).join('') || '(제목 없음)'
  // Notion ID는 하이픈 없이 반환되므로 그대로 사용
  const id = page.id.replace(/-/g, '')
  console.log(`  ${title}`)
  console.log(`  ID: ${id}\n`)
}

console.log('👉 .env.local에 추가:')
const firstId = pages[0].id.replace(/-/g, '')
console.log(`  TEST_INVOICE_ID=${firstId}\n`)
