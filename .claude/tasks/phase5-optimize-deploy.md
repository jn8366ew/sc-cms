---
phase: 5
title: 최적화 및 배포
status: pending
blockedBy: phase4
---

## #14 unstable_cache 캐싱 및 revalidate 설정

- **상태**: 🔲 pending
- **의존성**: #11, #13
- **작업**:
  - `getPosts`, `getPostsByCategory`, `getPostsByTag`에 `unstable_cache` 적용
  - 글 상세 페이지 `revalidate = 3600` 설정
  - R3 리스크 대응: 중첩 블록 반복 호출 차단

---

## #15 error.tsx / not-found.tsx 구현

- **상태**: 🔲 pending
- **의존성**: #11, #13
- **작업**:
  - `app/error.tsx` — Notion API 실패 시 폴백 UI
  - `app/not-found.tsx` — 커스텀 404 페이지
  - `lib/notion.ts` 각 함수에 try/catch + 콘솔 로깅 추가

---

## #16 SEO 최적화 (OG 태그, sitemap, robots)

- **상태**: 🔲 pending
- **의존성**: #11, #13
- **작업**:
  - 글 상세 페이지 `generateMetadata()`에 OG 태그 / Twitter Card 추가
  - `app/sitemap.ts` — 전체 글 URL 자동 생성
  - `app/robots.ts` — 크롤러 허용 정책 설정
  - canonical URL 확인
  - 목표: Lighthouse SEO 90+

---

## #17 Playwright E2E 전체 테스트 스위트 작성

- **상태**: 🔲 pending
- **의존성**: #14, #15, #16
- **작업** (Observe → Plan → Write → Execute → Verify):
  - 홈 페이지 글 목록 로딩
  - 글 상세 페이지 블록 렌더링
  - 카테고리 페이지 필터링
  - 검색 기능
  - 태그 페이지
  - Notion API 실패 시 에러 폴백 UI
  - 실제 Notion API 대상 (mock 사용 금지, ADR-006)

---

## #18 Vercel 배포 및 QA

- **상태**: 🔲 pending
- **의존성**: #17
- **작업**:
  - Vercel 프로젝트 생성 및 GitHub 연동
  - 환경 변수 설정 (`NOTION_TOKEN`, `NOTION_DATABASE_ID`)
  - 프로덕션 빌드 검증 (`next build` 로컬 통과)
  - Lighthouse Performance 80+, SEO 90+
  - ROADMAP.md Section 7 배포 전 체크리스트 전체 확인
