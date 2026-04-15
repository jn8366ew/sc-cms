---
phase: 5
title: 성능 최적화 및 통합 배포
status: pending
blockedBy: phase3 (#9-#12 코드 완성됨, E2E 검증 후 진행)
---

<!-- ============================================================
  진입점 (2026-04-15 기준)
  Phase 3 PDF 코드(#9~#12, #18) 실제로는 작성 완료 상태 (ROADMAP stale).
  신규 태스크: 캐싱 전략(#19, #20), Rate Limiting(#21), 배포(#16, #17, #22)
============================================================ -->

## 실행 순서 (의존성 기준)

```
#19 (독립) ──────────────────────────────────────────┐
#20 (의존: #19) ─────────────────────────────────────┤──→ #16 E2E → #17 배포 → #22 Analytics
#21 (독립) ──────────────────────────────────────────┘
```

---

## #19 React `cache()` — 요청 내 중복 호출 제거

- **상태**: ✅ completed (2026-04-15)
- **의존성**: 없음
- **파일**: `lib/notion.ts`
- **문제**: `generateMetadata()`와 페이지 컴포넌트 양쪽에서 `getInvoice(id)` 각각 호출
  → 동일 요청 내 Notion API 2회 왕복
- **작업**:
  - `import { cache } from 'react'` 추가
  - `export const getInvoice = cache(async (pageId: string) => { ... })` 로 감쌈
  - 효과: 렌더 트리 내 동일 인자 → 첫 번째 결과 재사용, API 1회 호출

---

## #20 `unstable_cache()` — 요청 간 서버 캐싱 (TTL 5분)

- **상태**: ✅ completed (2026-04-15)
- **구현**: `fetchInvoiceData` 분리 + `unstable_cache(revalidate: 300, tags: ['invoice'])` + `React cache()` 2레이어
- **비고**: `cacheComponents: true`(`use cache` 디렉티브)는 페이지 Suspense 구조 변경 필요로 채택 안 함. `unstable_cache`가 Next.js 16에서 공식 지원 유지됨.
- **신규 파일**: `app/api/revalidate/route.ts` — `revalidateTag(tag, 'max')` 엔드포인트
- **환경 변수 추가 필요**: `REVALIDATE_SECRET`

---

## #21 Rate Limiting — `/api/generate-pdf` IP 기반 제한

- **상태**: ✅ completed (2026-04-15)
- **구현**: `lru-cache` 메모리 기반 (개인 프로젝트 — 인스턴스 간 공유 불필요)
- **파일**: `lib/ratelimit.ts` (신규), `app/api/generate-pdf/route.tsx` (수정)
- **제한**: IP당 1분 5회, 초과 시 429 + Retry-After 헤더
- **완료 내용 (달라진 점)**:
  - 외부 서비스(Upstash Redis) 없이 `lru-cache`로 단순 구현
  - 개인 프로젝트 특성상 인스턴스별 독립 카운팅으로 충분
  - 추후 트래픽 증가 시 `@upstash/ratelimit`으로 마이그레이션 가능
  - `lib/ratelimit.ts` 생성:
    - `slidingWindow(5, '1 m')` — IP당 1분 5회 제한
    - 환경 변수 미설정 시 `null` fallback (개발 환경 skip)
  - `app/api/generate-pdf/route.tsx` 수정:
    - rate limit 체크 → 초과 시 `429 Too Many Requests` + `Retry-After` 헤더
    - IP: `x-forwarded-for` 헤더 첫 번째 값 파싱
- **환경 변수 추가**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## #16 Playwright E2E 실행 및 검증

- **상태**: ✅ completed (2026-04-15)
- **의존성**: #9~#12 코드 완성 (이미 완성됨), `.env.local`에 `TEST_INVOICE_ID` 설정
- **파일**: `tests/invoice.spec.ts` (5개 시나리오 작성 완료)
- **작업**:
  - `npm run dev` 실행 후 `npm run test:e2e` 실행
  - TC-01 유효한 견적서 ID → 정상 렌더링
  - TC-02 PDF 다운로드 버튼 → 파일 다운로드
  - TC-03 존재하지 않는 ID → 404 페이지
  - TC-04 375px 모바일 카드 레이아웃
  - TC-05 잘못된 형식 ID → 404 페이지
  - 실패 시 스크린샷/트레이스 분석 후 수정

---

## #17 Vercel 배포

- **상태**: 🔲 pending
- **의존성**: #16, #21
- **작업**:
  - Vercel 프로젝트 생성 + GitHub 연동 (자동 CI/CD)
  - 환경 변수 설정 (아래 목록)
  - 프로덕션 URL에서 견적서 조회 + PDF 다운로드 최종 확인
  - ROADMAP.md 배포 전 체크리스트 전체 확인

**Vercel 환경 변수 목록**:

| 변수명 | 설명 | 필수 여부 |
|--------|------|----------|
| `NOTION_API_KEY` | Notion Integration 토큰 | 필수 |
| `NOTION_DATABASE_ID` | 견적서 DB ID | 필수 |
| `UPSTASH_REDIS_REST_URL` | Rate limiting | #21 구현 시 |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limiting | #21 구현 시 |
| `REVALIDATE_SECRET` | 캐시 무효화 엔드포인트 보호 | #20 구현 시 |

---

## #22 Vercel Analytics 통합

- **상태**: 🔲 pending
- **의존성**: #17
- **패키지**: `@vercel/analytics`
- **파일**: `app/layout.tsx`
- **작업**:
  - `npm install @vercel/analytics`
  - `import { Analytics } from '@vercel/analytics/react'`
  - `<Analytics />` 컴포넌트를 `<body>` 내 추가
  - Vercel 대시보드에서 Core Web Vitals (LCP, CLS 등) 확인
