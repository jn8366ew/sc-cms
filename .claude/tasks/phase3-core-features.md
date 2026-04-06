---
phase: 3
title: 핵심 기능 개발
status: pending
blockedBy: phase2
---

## #6 BlockRenderer 컴포넌트 구현 (P0/P1 블록 타입)

- **상태**: 🔲 pending
- **의존성**: #3, #4, #5
- **작업**:
  - P0 (필수): paragraph, heading_1/2/3, bulleted/numbered_list_item, 폴백 UI
  - P1 (중요): table, code (복사 버튼), image (Next.js Image), callout
  - P2 (선택): toggle, quote, divider
  - `components/notion/BlockRenderer.tsx` 작성

---

## #7 getPostContent에 중첩 블록 재귀 조회 추가

- **상태**: 🔲 pending
- **의존성**: #3, #4, #5
- **작업**:
  - `lib/notion.ts`의 `getPostContent`에서 `has_children` 확인
  - 재귀 조회 (depth 최대 2단계 — Rate Limit 대응)

---

## #8 글 상세 페이지에 BlockRenderer 연결

- **상태**: 🔲 pending
- **의존성**: #6, #7
- **작업**:
  - `app/posts/[slug]/page.tsx` TODO 제거
  - BlockRenderer import 및 blocks 배열 전달
  - "총 N개의 콘텐츠 블록" 더미 메시지 제거

---

## #9 홈 / 카테고리 페이지 PostCard 리팩터링

- **상태**: 🔲 pending
- **의존성**: #5, #6
- **작업**:
  - `app/page.tsx` — `<h2>/<div>` 마크업 → PostCard 교체
  - `app/category/[category]/page.tsx` — PostCard 적용
  - CategoryBadge, TagPill 연결
