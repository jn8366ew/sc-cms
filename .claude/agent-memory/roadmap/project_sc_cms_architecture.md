---
name: sc-cms 핵심 아키텍처 결정
description: sc-cms (Notion + Next.js 16 견적서 시스템) 주요 기술 결정, 제약사항, 구현 상태 (2026-04-10 Step1/2/4(에러처리) 완료 갱신)
type: project
---

## 프로젝트 개요

Notion을 데이터베이스로 활용한 견적서 관리 시스템. Next.js 16.2.1 App Router 기반, 1인 개발.
관리자는 Notion에서 견적서를 작성하고 고유 URL로 클라이언트에게 공유. 클라이언트는 링크로 견적서 조회 및 PDF 다운로드.

**Why:** 별도 관리자 UI 없이 Notion 워크스페이스에서 견적서를 작성하면 웹에 자동 반영되는 구조.

**How to apply:** 기능 제안 시 Notion 스키마 변경을 최소화하는 방향으로 설계할 것.

---

## Notion DB 스키마 (확정, 2026-04-10)

### Invoices DB

| 컬럼명 | 타입 | 비고 |
|--------|------|------|
| 견적서명 | Title | |
| 견적서번호 | Text | |
| 클라이언트명 | Text | |
| 발행일 | Date | |
| 유효기간 | Date | |
| 총금액 | Rollup | Items.금액 합산 (Notion 자동 계산) |
| Status | Select | |
| 항목 | Relation | Items DB 페이지 ID 배열 |

### Items DB

| 컬럼명 | 타입 | 비고 |
|--------|------|------|
| 항목명 | Title | |
| Invoices | Relation | 역방향 Relation |
| 단가 | Number | |
| 수량 | Number | |
| 금액 | Formula | 단가 × 수량 |

**Why:** CSV 분석으로 확인됨 (Q1 해결). 항목은 페이지 내 블록 테이블이 아닌 별도 Relation DB.

**How to apply:** Items 조회 시 `blocks.children.list()` 파싱 방식 사용 금지. Invoices "항목" Relation 필드에서 페이지 ID 배열 추출 후 각 항목을 `pages.retrieve()`로 조회하는 방식 사용.

---

## 핵심 아키텍처 결정

### Notion API v5 제약

`databases.query()` 제거됨. 견적서 시스템은 단건 조회(`pages.retrieve()`)만 사용하므로 이 제약에 영향 없음.

**Why:** @notionhq/client v5(^5.15.0)에서 query API 삭제됨.

**How to apply:** Notion 데이터 조회 코드 수정 시 databases.query 사용 제안 금지. `pages.retrieve()` 기반 패턴 유지.

### Next.js 16 Promise-based params

App Router에서 `params`는 `Promise<{ id: string }>` 타입. 반드시 `await params` 필요.

**Why:** Next.js 16 파괴적 변경. 이전 방식(`params.id` 직접 접근)은 타입 에러 발생.

**How to apply:** 모든 동적 라우트 페이지에서 `const { id } = await params;` 패턴 사용.

### PDF 생성 전략

`@react-pdf/renderer`로 서버사이드 PDF 생성. `app/api/generate-pdf/route.ts`에서 처리.

**Why:** Vercel 서버리스 환경에서 Puppeteer(크로미움 50MB 초과)를 사용할 수 없음.

**How to apply:** PDF 레이아웃은 웹 CSS가 아닌 `StyleSheet.create()` API로 별도 작성 필요.

---

## 구현 상태 (2026-04-10 기준)

### 완료

- `types/invoice.ts`: `Invoice`, `InvoiceItem`, `InvoiceStatus`, `STATUS_MAP` 타입 정의
- `lib/notion.ts`: `getInvoice(pageId)` 구현 완료
  - v5 API 타입 기반 파싱 헬퍼 함수: `getTitle`, `getRichText`, `getDate`, `getStatus`, `getRollupNumber`, `getRelationIds`, `getNumber`, `getFormulaNumber`
  - Items Relation DB 병렬 조회 (`Promise.all`)
  - `APIErrorCode.ObjectNotFound` → null 반환
  - 잘못된 pageId 형식 정규식 검증 (32자 hex / UUID) — API 호출 없이 즉시 null 반환
  - 블로그 함수 전부 제거
- `app/invoice/[id]/page.tsx`: 실제 `getInvoice()` 연동 완료, `generateMetadata()`에 실제 `invoice_number` 반영
- 견적서 헤더/테이블 UI, 모바일 `overflow-x-auto` 처리 완료
- `app/not-found.tsx`: "견적서를 찾을 수 없습니다" 안내
- `app/error.tsx`: `unstable_retry` 패턴 (Next.js 16.2.0)
- `app/page.tsx`: `/invoice`로 redirect
- `app/posts/`, `app/category/` 블로그 라우트 제거
- `next build` 통과 + 브라우저에서 실제 Notion 데이터 조회 동작 확인

### 미구현 (잔여 작업)

- **`.env.example` 업데이트**: `NOTION_TOKEN` → `NOTION_API_KEY` (파일 권한 이슈로 미완료, 우선순위 낮음)
- **UI/UX 개선 (다음 세션 우선순위 1)**: 실제 견적서 문서 레이아웃, 금액 포맷(`₩` + 천 단위), 상태 배지 디자인, 모바일 375px 세부 조정
- **PDF 다운로드 (다음 세션 우선순위 2, UI 확정 후)**: `app/api/generate-pdf/route.ts`, `InvoicePDF` 컴포넌트, `PdfDownloadButton`
- **Vercel 배포**: 환경 변수 설정 및 배포
- **Playwright E2E 테스트**

### 다음 세션 진입점

`phase3-core-features.md` 상단을 참고. 작업 순서:
1. UI/UX 개선 (app/invoice/[id]/page.tsx 디자인 개선)
2. PDF 다운로드 구현 (#9 → #10 → #11 → #12)

---

## 기술 제약사항

- Next.js 16.2.1: App Router 전용, params는 반드시 await 필요 (Promise 타입)
- @notionhq/client ^5.15.0: databases.query() 없음, pages.retrieve() 사용
- Tailwind CSS ^4: zero-config, postcss 플러그인 방식
- shadcn/ui: 설치 완료, 최소 활용 원칙
- React 19.2.4
- @react-pdf/renderer: 웹 CSS 미지원, StyleSheet.create() API 별도 작성 필요
