---
phase: 3
title: PDF 다운로드
status: pending
blockedBy: phase2
---

<!-- ============================================================
  다음 세션 진입점 (2026-04-10 기준)
  현재 상태: Phase 1, 2, 4(에러 처리) 완료. Phase 3 전체 미구현.
  견적서 페이지(app/invoice/[id]/page.tsx)는 실제 Notion 데이터 조회 동작 확인됨.
  기능은 작동하지만 UI/UX가 기본 수준 — PDF 작업 전에 아래 우선순위 1 먼저 진행.
============================================================ -->

## 다음 세션 작업 순서

### 우선순위 1 — UI/UX 개선 (PDF 전에 먼저)

현재 견적서 페이지는 기능은 동작하지만 UI/UX가 기본 수준입니다.
PDF 레이아웃은 웹 뷰 구조를 기반으로 설계하므로, 웹 UI를 먼저 확정한 뒤 PDF를 만드는 것이 이중 수정을 방지합니다.

**작업 목록:**

- [x] 실제 견적서 문서처럼 디자인 개선 (2026-04-13)
  - 회사(발행자) 정보 섹션 추가
  - 수신자(클라이언트) 정보 섹션 추가
  - 인쇄/PDF에 적합한 레이아웃 구조 정리
- [x] 금액 포맷: `₩` 기호 + 천 단위 구분자 (`formatKRW` 유틸 사용) (2026-04-13)
- [x] 상태 배지 디자인 개선 — pill 형태, 색상 코딩 (draft/sent/done) (2026-04-13)
- [x] 모바일 375px 레이아웃 세부 조정 — 카드/테이블 이중 렌더링 전략 적용 (2026-04-13)
- [x] PDF 다운로드 버튼 위치 확정 — 액션 바 우측 상단, filled dark 스타일 (2026-04-13)
- [x] 다크모드 기본 탑재 (2026-04-13)
  - `html.dark` class 고정 (항상 다크)
  - `globals.css` `@custom-variant dark` 등록 (Tailwind v4 class 기반)
  - `InvoiceView`, `not-found`, `error` 전체 `dark:` 클래스 적용

### 우선순위 2 — PDF 다운로드 (UI 확정 후)

웹 UI 구조가 확정되면 동일한 데이터로 PDF 컴포넌트를 작성합니다.

---

## #9 @react-pdf/renderer 설치 및 기본 동작 확인

- **상태**: ✅ completed (2026-04-14 — 코드 작성 완료, 실행 검증은 #16 E2E에서 확인)
- **비고**: `package.json`에 설치됨, `next.config.ts`에 `serverExternalPackages` 등록됨

---

## #10 InvoicePDF 컴포넌트 작성

- **상태**: ✅ completed (2026-04-14)
- **파일**: `components/pdf/InvoicePDF.tsx`
- **비고**: BUG-1~7 수정 사항 코드에 반영 완료 (하이픈 콜백, 고정 너비, VAT 3행 구조 등)

---

## #11 app/api/generate-pdf/route.tsx 구현

- **상태**: ✅ completed (2026-04-14)
- **파일**: `app/api/generate-pdf/route.tsx`

---

## #12 PdfDownloadButton 클라이언트 컴포넌트

- **상태**: ✅ completed (2026-04-14)
- **파일**: `components/invoice/PdfDownloadButton.tsx`

---

## #18 InvoicePDF 렌더링 버그 수정

- **상태**: ✅ completed (2026-04-14 — 코드 반영 완료)
- **비고**: BUG-1~7 모두 `InvoicePDF.tsx` 코드에 반영됨. Playwright E2E(#16)에서 실제 렌더링 검증 예정.
