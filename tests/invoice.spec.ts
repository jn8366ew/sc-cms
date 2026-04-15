import { test, expect } from '@playwright/test'

// .env.local의 TEST_INVOICE_ID — 실제 Notion 견적서 페이지 ID
// 미설정 시 해당 테스트는 skip
const TEST_INVOICE_ID = process.env.TEST_INVOICE_ID ?? ''

// ---------------------------------------------------------------------------
// TC-01: 유효한 견적서 ID → 정상 렌더링
// ---------------------------------------------------------------------------
test('유효한 견적서 ID로 접근하면 견적서가 렌더링된다', async ({ page }) => {
  test.skip(!TEST_INVOICE_ID, 'TEST_INVOICE_ID가 .env.local에 설정되지 않음')

  await page.goto(`/invoice/${TEST_INVOICE_ID}`)

  // 견적서 본문 article
  const article = page.getByRole('article')
  await expect(article).toBeVisible()

  // "견적서" 타이틀
  await expect(page.getByRole('heading', { name: '견적서' })).toBeVisible()

  // PDF 다운로드 버튼 활성화 상태 확인
  const pdfButton = page.getByRole('button', { name: /PDF 다운로드/i })
  await expect(pdfButton).toBeVisible()
  await expect(pdfButton).toBeEnabled()
})

// ---------------------------------------------------------------------------
// TC-02: PDF 다운로드 버튼 클릭 → 파일 다운로드 발생
// ---------------------------------------------------------------------------
test('PDF 다운로드 버튼을 클릭하면 PDF 파일이 다운로드된다', async ({ page }) => {
  test.skip(!TEST_INVOICE_ID, 'TEST_INVOICE_ID가 .env.local에 설정되지 않음')

  await page.goto(`/invoice/${TEST_INVOICE_ID}`)

  // 다운로드 이벤트 대기
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: /PDF 다운로드/i }).click(),
  ])

  // 파일명 형식 확인 (invoice-XXX.pdf)
  expect(download.suggestedFilename()).toMatch(/^invoice-.+\.pdf$/)
})

// ---------------------------------------------------------------------------
// TC-03: 존재하지 않는 ID → 404 페이지
// ---------------------------------------------------------------------------
test('존재하지 않는 견적서 ID로 접근하면 404 페이지가 표시된다', async ({ page }) => {
  // 유효한 형식이지만 존재하지 않는 32자 hex ID
  await page.goto('/invoice/00000000000000000000000000000000')

  await expect(page.getByText('견적서를 찾을 수 없습니다')).toBeVisible()
  await expect(page.getByText('발행자에게 올바른 링크를 요청하세요')).toBeVisible()
})

// ---------------------------------------------------------------------------
// TC-04: 모바일 375px — 카드 레이아웃 렌더링
// ---------------------------------------------------------------------------
test('375px 모바일 뷰포트에서 항목이 카드 레이아웃으로 표시된다', async ({ page }) => {
  test.skip(!TEST_INVOICE_ID, 'TEST_INVOICE_ID가 .env.local에 설정되지 않음')

  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto(`/invoice/${TEST_INVOICE_ID}`)

  // 모바일 카드 리스트 — sm:hidden 블록 (데스크톱 테이블은 hidden)
  // InvoiceView.tsx: <div className="sm:hidden space-y-2">
  const mobileCards = page.locator('.sm\\:hidden').first()
  await expect(mobileCards).toBeVisible()

  // 데스크톱 테이블은 화면 밖 (hidden sm:block)
  const desktopTable = page.locator('.hidden.sm\\:block').first()
  await expect(desktopTable).toBeHidden()
})

// ---------------------------------------------------------------------------
// TC-05: 잘못된 형식의 ID → 404 페이지
// (lib/notion.ts의 정규식 검증 — API 호출 없이 즉시 null 반환)
// ---------------------------------------------------------------------------
test('잘못된 형식의 ID로 접근하면 404 페이지가 표시된다', async ({ page }) => {
  await page.goto('/invoice/not-a-valid-id')

  await expect(page.getByText('견적서를 찾을 수 없습니다')).toBeVisible()
})

// ---------------------------------------------------------------------------
// NOTE: error.tsx 폴백 테스트 (미구현)
//
// Playwright의 page.route()는 브라우저 레벨 HTTP 인터셉트만 가능.
// Notion API 호출은 Next.js 서버사이드(lib/notion.ts)에서 발생하므로
// 브라우저 인터셉트로는 테스트 불가.
//
// 대안 검토:
//   1. 테스트 전용 환경에서 NOTION_API_KEY를 무효값으로 교체 → 서버 에러 유발
//   2. 별도 테스트 전용 route handler로 에러 시나리오 노출
//   → Phase 5 이후 검토
// ---------------------------------------------------------------------------
