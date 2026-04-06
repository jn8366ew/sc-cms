---
name: sc-cms 핵심 아키텍처 결정
description: 소울칼리버 블로그(Notion CMS + Next.js 16) 주요 기술 결정 및 제약사항
type: project
---

## 프로젝트 개요

Notion을 CMS로 활용한 소울칼리버 블로그. Next.js 16.2.1 App Router 기반, 1인 개발.

**Why:** 별도 관리자 UI 없이 Notion 워크스페이스에서 글을 작성하면 웹에 자동 반영되는 구조.

**How to apply:** 기능 제안 시 Notion 스키마 변경을 최소화하는 방향으로 설계할 것.

---

## 핵심 아키텍처 결정

### Notion API v5 파괴적 변경

`databases.query()` 제거됨. 현재 `notion.search()` + `parent.database_id` 클라이언트 필터링으로 대체 구현 완료 (`lib/notion.ts`).

**Why:** @notionhq/client v5(^5.15.0)에서 query API 삭제됨.

**How to apply:** Notion 데이터 조회 코드 수정 시 databases.query 사용 제안 금지. search() 기반 패턴 유지.

### 한국어 Status 정확 매칭

`status === '발행됨'` 문자열로 발행 여부 판단. Notion DB의 Status 속성 옵션 이름이 정확히 "발행됨"이어야 함.

**Why:** Notion API는 status 속성을 string으로 반환하며, 오타나 이름 변경 시 모든 글이 draft 처리됨.

**How to apply:** Status 관련 코드 수정 시 이 문자열 의존성을 명시적으로 언급할 것.

### 슬러그 전략

제목 기반 슬러그 (`encodeURIComponent(title.toLowerCase().replace(/\s+/g, '-'))`). 별도 slug 필드 없음.

**Why:** Notion DB 스키마 변경 없이 구현. 제목 변경이 드문 블로그 특성에 맞는 트레이드오프.

**How to apply:** 제목 변경이 잦아지면 Notion DB에 Slug 속성 추가를 권장해야 함.

### 검색 전략

서버에서 전체 글 목록 로드 후 클라이언트 인메모리 필터링. 별도 검색 서버 없음.

**Why:** 수백 건 이하 규모에서 Algolia 등 외부 의존성 추가는 오버엔지니어링.

**How to apply:** 글 수 1000건 초과 시 Fuse.js 또는 Algolia 도입 검토 제안.

---

## 구현 상태 (2026-03-31 기준)

### 완료

- `lib/notion.ts`: getPosts, getPostBySlug, getPostsByCategory, getPostContent
- `types/notion.ts`: NotionPost, NotionBlock
- `app/page.tsx`, `app/posts/[slug]/page.tsx`, `app/category/[category]/page.tsx`
- `next.config.ts`: 보안 헤더 4종
- Next.js 16 Promise-based params 대응 완료

### 미구현 (핵심)

- **블록 렌더러**: posts/[slug]/page.tsx에 TODO 상태, 블록 수만 표시
- **UI 컴포넌트**: components/ 디렉터리 완전히 비어있음 (PostCard, TagPill, CategoryBadge 없음)
- **검색 기능**: 미구현
- **태그 페이지**: /tags/[tag] 없음
- **캐싱**: unstable_cache / revalidate 미적용
- **에러 바운더리**: app/error.tsx, app/not-found.tsx 없음

---

## 기술 제약사항

- Next.js 16.2.1: App Router 전용, params는 반드시 await 필요 (Promise 타입)
- @notionhq/client ^5.15.0: databases.query() 없음, search() 사용
- Tailwind CSS ^4: zero-config, postcss 플러그인 방식
- shadcn/ui: 설치 완료이나 미사용 (필요 시 사용 가능)
- React 19.2.4

---

## 블록 렌더링 우선순위

소울칼리버 콘텐츠 특성상 코드 블록(프레임 데이터), 테이블(캐릭터 데이터), 이미지(기술 캡처)가 중요함.

P0: paragraph, heading_1/2/3, bulleted_list_item, numbered_list_item
P1: code, table, image, callout
P2: toggle, quote, divider
P3: video, embed
