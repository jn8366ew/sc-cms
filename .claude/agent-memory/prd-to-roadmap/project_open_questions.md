---
name: sc-cms 미결 사항 및 가정
description: PRD 분석 시 발견된 미결 요구사항과 로드맵 작성 시 적용한 가정
type: project
---

## 즉시 확인 필요

- Notion DB의 Status 속성 옵션 이름이 정확히 "발행됨"인지 확인 필요. 오타 시 전체 글이 표시 안 됨.

**How to apply:** Notion 연동 이슈 발생 시 이 항목 먼저 점검 제안.

---

## 미결 설계 질문

1. 검색을 `/search` 별도 페이지로 할지, 홈 인라인으로 할지 미결정
2. `/tags` 전체 태그 목록 페이지 필요 여부 미결정
3. 목차(TOC) 기능 Must-have / Nice-to-have 미결정
4. 카테고리 네비게이션을 정적 목록으로 할지, Notion에서 동적으로 가져올지 미결정
5. Notion 이미지 URL 만료 이슈 대응 방식 미결정 (Notion 이미지는 1시간 후 만료되는 서명된 URL)
6. 테이블 블록 지원 필요 여부 (소울칼리버 프레임 데이터 특성상 중요할 수 있음)

**Why:** PRD가 단일 개인 개발자 문서로 일부 상세 요구사항 미기술.

**How to apply:** 해당 기능 구현 전에 위 질문들에 대한 결정을 먼저 확인할 것.

---

## 로드맵 수립 시 적용한 가정

1. 1인 개발 기준 일정 (Phase 1-2: 2주, Phase 3: 1주)
2. shadcn/ui는 필요한 경우에만 사용 (커스텀 컴포넌트 우선)
3. SSG(generateStaticParams) 미사용, ISR/revalidate로 충분하다고 가정
4. Notion DB 스키마(Title/Category/Tags/Published/Status) 고정 가정
5. 중첩 블록은 depth 2단계까지만 지원
6. 다크 모드 토글 UI는 Nice-to-have (Phase 3 이후)
