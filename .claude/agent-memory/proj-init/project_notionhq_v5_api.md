---
name: Notion Client v5 Breaking Change
description: @notionhq/client v5.15.0에서 databases.query()가 제거됨 — search() API로 대체
type: project
---

`@notionhq/client` v5에서 `databases.query()`가 완전히 제거되었다.

**현재 대안:** `notion.search({ filter: { property: 'object', value: 'page' } })`로 전체 페이지 조회 후 `parent.database_id`로 클라이언트 사이드 필터링.

**Why:** v5는 View 기반 쿼리 모델로 전환 (views.queries). database 직접 쿼리 API가 사라졌다.

**How to apply:** `lib/notion.ts`의 `getPagesByDatabase()` 함수가 이 패턴을 구현함. 데이터가 100건 이상이면 페이지네이션 비용이 증가 — ISR 또는 `unstable_cache` 적용 권장.
