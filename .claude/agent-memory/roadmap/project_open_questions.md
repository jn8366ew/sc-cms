---
name: sc-cms 미결 사항 및 가정
description: 견적서 시스템 PRD 미결 요구사항과 로드맵 가정. Q1/R5 해결됨 (2026-04-10 갱신)
type: project
---

## 해결된 사항 (2026-04-10)

### Q1: Items 데이터 구조 — 해결됨

Notion 견적서 항목(Items)은 **Relation DB** 방식으로 확인.
- Invoices DB의 "항목" 컬럼 = Relation (Items DB 페이지 ID 배열)
- Items DB 컬럼: 항목명(Title), Invoices(Relation), 단가(Number), 수량(Number), 금액(Formula: 단가×수량)
- 총금액 = Rollup (Items.금액 합산, Notion이 자동 계산)

**How to apply:** Items 조회는 반드시 `pages.retrieve()` 기반으로 구현. `blocks.children.list()` 파싱 방식 사용 금지.

---

## 미결 설계 질문

| # | 질문 | 중요도 |
|---|------|--------|
| Q2 | 견적서 URL에 Notion 페이지 ID를 그대로 노출해도 되는지? | Medium |
| Q3 | PDF에 로고/회사 도장 이미지가 포함되어야 하는지? | Medium |
| Q4 | 견적서 Status에 따라 조회 가능 여부를 제어해야 하는지? (예: "거절" 상태 = 조회 불가) | Medium |
| Q5 | 다국어 지원이 MVP에 필요한지? (현재 PRD에는 MVP 이후로 분류) | Low |

**How to apply:** 해당 기능 구현 전 위 질문에 대한 결정 먼저 확인할 것.

---

## 로드맵 수립 시 적용한 가정

1. 1인 개발 기준 일정 (전체 MVP: 약 4일 기준)
2. **항목 데이터는 Relation DB** — CSV 분석으로 확인됨 (Q1 해결)
3. 인증 불필요 — 링크를 가진 사람이면 누구나 접근 가능 (PRD 기준)
4. 한국어 단일 로케일 고정
5. shadcn/ui는 필요한 경우에만 사용, 기본 Tailwind 우선
6. `npm run build` 기준으로 CI 정상 여부 판단
