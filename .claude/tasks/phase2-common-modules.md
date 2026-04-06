---
phase: 2
title: 공통 모듈 개발
status: pending
blockedBy: phase1
---

## #3 Header / Footer 컴포넌트 구현

- **상태**: 🔲 pending
- **의존성**: #1, #2
- **작업**:
  - `components/layout/Header.tsx` — 사이트 제목, 카테고리 네비게이션 링크
  - `components/layout/Footer.tsx` — 저작권, 간단한 소개
  - Tailwind CSS 스타일링

---

## #4 app/layout.tsx에 Header / Footer 통합

- **상태**: 🔲 pending
- **의존성**: #1, #2, #3
- **작업**:
  - `app/layout.tsx`에 Header, Footer import 및 렌더링
  - 모든 페이지에 공통 레이아웃 적용 확인

---

## #5 PostCard / CategoryBadge / TagPill 컴포넌트 구현

- **상태**: 🔲 pending
- **의존성**: #1, #2
- **작업**:
  - `components/ui/PostCard.tsx` — 제목, 카테고리, 날짜, 태그 요약 표시
  - `components/ui/CategoryBadge.tsx` — 카테고리 링크 배지
  - `components/ui/TagPill.tsx` — 태그 링크 필
  - 각 컴포넌트 독립적으로 사용 가능해야 함
