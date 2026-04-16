---
phase: 2
title: 견적서 조회 페이지
status: completed
blockedBy: phase1
---

## #5 app/invoice/[id]/page.tsx 서버 컴포넌트

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #1, #2
- **작업**:
  - `getInvoice(params.id)` 호출 → null이면 `notFound()` 호출
  - `generateMetadata()` — 실제 `invoice_number` 기반 페이지 제목 (`견적서 #INV-001 | 회사명`)
  - 서버 컴포넌트로 구현 (Notion API 키 클라이언트 미노출)
  - Next.js 16 `params: Promise<{ id: string }>` 패턴 적용 (`const { id } = await params`)
- **실제 동작 확인**: 유효한 Notion 페이지 ID로 접근 시 견적서 정상 렌더링, 없는 ID → notFound() 동작 확인

---

## #6 견적서 헤더 UI

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #5
- **작업**:
  - 견적서 번호, 발행일, 유효기간 표시
  - 거래처명(클라이언트명) 표시
  - 상태 배지 표시
  - shadcn/ui 및 Tailwind 기본 컴포넌트 활용

---

## #7 견적서 항목 테이블 UI

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #5
- **작업**:
  - 항목 테이블: 품목 설명, 수량, 단가, 금액 컬럼
  - 합계 행 (총액)
  - Relation DB 방식으로 구현 (Q1 해결 — Items DB는 별도 Relation DB)

---

## #8 반응형 레이아웃

- **상태**: ✅ completed (기본 완료, 2026-04-10)
- **의존성**: #6, #7
- **작업 (완료)**:
  - `max-w-3xl` 최대 너비 제한
  - `overflow-x-auto` — 항목 테이블 가로 스크롤 처리
  - 기본 모바일 대응 완료
- **잔여 작업 (다음 세션 — 우선순위 1)**:
  - 실제 견적서 문서처럼 디자인 개선 (회사 정보 섹션, 수신자 정보 섹션)
  - 인쇄/PDF에 적합한 레이아웃 정리
  - 금액 포맷: `₩` 기호 + 천 단위 구분자
  - 상태 배지 디자인 개선
  - 모바일 375px 레이아웃 세부 조정
  - PDF 다운로드 버튼 위치 확정 (헤더 우측 상단 또는 하단 고정)
- **비고**: 기능은 동작하지만 UI/UX가 기본 수준. Phase 3 PDF 작업 전에 먼저 개선 권장.
