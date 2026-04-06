---
phase: 4
title: 추가 기능 개발
status: pending
blockedBy: phase3
---

## #10 SearchInput 컴포넌트 및 인메모리 필터링 로직 구현

- **상태**: 🔲 pending
- **의존성**: #8, #9
- **작업**:
  - `components/ui/SearchInput.tsx` — controlled input, debounce 300ms
  - 제목 + 태그 기반 필터링 로직
  - 검색 결과 0건 Empty State UI
  - ADR-004 참고: 클라이언트 사이드 인메모리 필터링

---

## #11 홈 페이지에 검색 기능 통합

- **상태**: 🔲 pending
- **의존성**: #10
- **작업**:
  - `app/page.tsx`에 SearchInput 인라인 통합
  - 서버에서 전체 글 목록 수신 → 클라이언트 필터링
  - `'use client'` 분리 필요 시 클라이언트 컴포넌트 분리

---

## #12 getPostsByTag 함수 추가 및 /tags/[tag] 페이지 구현

- **상태**: 🔲 pending
- **의존성**: #8, #9
- **작업**:
  - `lib/notion.ts`에 `getPostsByTag(tag: string)` 함수 추가
  - `app/tags/[tag]/page.tsx` 구현 — 태그별 글 목록 표시
  - PostCard 컴포넌트 활용

---

## #13 글 상세 페이지 TagPill → 태그 페이지 링크 연결

- **상태**: 🔲 pending
- **의존성**: #12
- **작업**:
  - `app/posts/[slug]/page.tsx`에서 TagPill 클릭 시 `/tags/[tag]`로 이동
  - TagPill에 href prop 전달
