---
phase: 1
title: 데이터 모델 & Notion 연동
status: completed
blockedBy: 없음 (시작 가능)
---

## #1 types/invoice.ts — 타입 정의

- **상태**: ✅ completed (2026-04-10)
- **의존성**: 없음
- **작업**:
  - `Invoice` 타입: `id`, `invoice_number`, `client_name`, `issue_date`, `valid_until`, `total_amount`, `status`
  - `InvoiceItem` 타입: `id`, `description`, `quantity`, `unit_price`, `amount`
  - `InvoiceStatus`, `STATUS_MAP` 정의 (상태 enum 및 한국어 레이블 매핑)
  - 기존 `types/notion.ts`의 `NotionPost`, 블로그용 타입 제거

---

## #2 lib/notion.ts 재작성

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #1
- **작업**:
  - Notion 클라이언트 초기화 로직 유지 (환경 변수명 `NOTION_API_KEY`로 통일)
  - `getInvoice(pageId: string): Promise<Invoice | null>` 작성
    - `notion.pages.retrieve({ page_id: pageId })` — 속성 조회
    - Items Relation DB 병렬 조회 (`Promise.all()`) — Invoices "항목" 필드에서 페이지 ID 배열 추출 후 각 항목을 `pages.retrieve()`로 조회
    - 잘못된 pageId → null 반환 (404 분기용)
  - 기존 블로그 함수 (`getPosts`, `getPostBySlug`, `getPostsByCategory` 등) 제거
  - v5 API 타입 기반 파싱 헬퍼 함수 작성: `getTitle`, `getRichText`, `getDate`, `getStatus`, `getRollupNumber`, `getRelationIds`, `getNumber`, `getFormulaNumber`
  - `APIErrorCode.ObjectNotFound` → null 반환 처리
  - 잘못된 pageId 형식 정규식 검증 (32자 hex / UUID) — API 호출 없이 즉시 null 반환
- **실제 동작 확인**: 브라우저에서 실제 Notion 데이터 조회 및 렌더링 확인 완료

---

## #3 .env.example 업데이트

- **상태**: 🔲 pending
- **의존성**: 없음
- **작업**:
  - `NOTION_TOKEN` → `NOTION_API_KEY` 키 이름 변경 (PRD 기준)
  - `NOTION_DATABASE_ID` 유지
- **비고**: 파일 권한 이슈로 이전 세션에서 미완료. 단순 텍스트 파일 수정이므로 우선순위 낮음.

---

## #4 기존 블로그 라우트 제거

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #1, #2
- **작업**:
  - `app/page.tsx` → `/invoice`로 redirect하는 페이지로 대체
  - `app/posts/` 디렉터리 제거
  - `app/category/` 디렉터리 제거
  - `app/layout.tsx` 정리 (견적서 시스템 메타데이터로 교체)
