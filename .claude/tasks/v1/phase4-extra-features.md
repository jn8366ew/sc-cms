---
phase: 4
title: 에러 처리 & 배포
status: completed
blockedBy: phase3
---

## #13 app/not-found.tsx — 커스텀 404

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #5
- **작업**:
  - "견적서를 찾을 수 없습니다" 메시지
  - 발행자에게 올바른 링크를 요청하라는 안내
  - 심플한 디자인 (브랜드 일관성)

---

## #14 app/error.tsx — Notion API 폴백 UI

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #5
- **작업**:
  - Notion API 호출 실패 시 노출되는 에러 바운더리
  - "잠시 후 다시 시도해주세요" 메시지
  - `'use client'` 필수 (error.tsx 규칙)
  - `unstable_retry` 패턴 적용 (Next.js 16.2.0)

---

## #15 lib/notion.ts — try/catch + 콘솔 로깅

- **상태**: ✅ completed (2026-04-10)
- **의존성**: #2
- **작업**:
  - `getInvoice()` 함수에 try/catch 추가
  - Notion API 실패 시 콘솔 에러 로깅 + null 반환 (app/error.tsx로 전파 아님, graceful 처리)
  - 잘못된 pageId 형식 → 즉시 null 반환 (Notion API 호출 생략)

---

## #16 Playwright E2E 테스트

- **상태**: ✅ completed (2026-04-15)
- **의존성**: #12, #13, #14
- **작업** (Observe → Plan → Write → Execute → Verify):
  - 유효한 견적서 ID → 조회 페이지 정상 렌더링
  - PDF 다운로드 버튼 클릭 → 다운로드 이벤트 발생
  - 없는 ID → 404 페이지 표시
  - 모바일 뷰포트(375px) 레이아웃 확인
  - Notion API 실패 시 error.tsx 폴백 표시
  - **실제 Notion API 대상 (mock 사용 금지, ADR 참고)**

---

## #17 Vercel 배포 & QA

- **상태**: ✅ completed (2026-04-16)
- **의존성**: #16
- **작업**:
  - Vercel 프로젝트 생성 및 GitHub 연동
  - 환경 변수 설정: `NOTION_API_KEY`, `NOTION_DATABASE_ID`
  - `next build` 로컬 통과 확인 (이미 통과 확인됨)
  - Notion Integration이 견적서 DB에 공유되어 있는지 확인
  - 프로덕션 URL에서 실제 견적서 조회 + PDF 다운로드 최종 확인
  - ROADMAP.md Section 7 배포 전 체크리스트 전체 확인
