# ROADMAP.md

<!-- Last Updated: 2026-04-16 | Version: 3.1.0 -->

---

## 1. 프로젝트 개요

### 제품 비전

Notion을 데이터베이스로 활용한 견적서 관리 시스템. 관리자는 Notion에서 견적서를 작성하고 고유 링크를 클라이언트에게 전달하며, 클라이언트는 링크로 접근하여 견적서를 조회하고 PDF로 다운로드한다.

### 사용자

| 역할 | 설명 |
|------|------|
| 견적서 작성자 (관리자) | Notion에서 견적서를 작성하고 관리자 페이지에서 링크를 복사하여 클라이언트에게 전달 |
| 클라이언트 (수신자) | 링크를 통해 견적서를 조회하고 PDF 다운로드 |

### 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js | 16.2.1 |
| Language | TypeScript | ^5 |
| Runtime | React | 19.2.4 |
| CMS | Notion API (`@notionhq/client`) | ^5.15.0 |
| PDF 생성 | @react-pdf/renderer | ^4.4.1 |
| Styling | Tailwind CSS | ^4 (zero-config) |
| UI Components | shadcn/ui | — |
| Icons | Lucide React | ^1.7.0 |
| Testing | Playwright | ^1.59.1 |
| Deployment | Vercel | — |

---

## 2. 개발 현황 — Phase 1 (MVP 완료)

**완료일**: 2026-04-16 (Vercel 배포 포함)

### 완료된 기능

| 기능 | 상태 | 비고 |
|------|------|------|
| Notion API 연동 (`getInvoice`) | ✅ | 단건 조회, 헬퍼 파싱 함수 |
| 견적서 공개 조회 페이지 `/invoice/[id]` | ✅ | 서버 컴포넌트, generateMetadata |
| 견적서 UI (헤더, 항목 테이블, 상태 배지) | ✅ | 다크모드 기본, 반응형 375px~ |
| PDF 생성 API `/api/generate-pdf` | ✅ | @react-pdf/renderer, 서버사이드 |
| PDF 다운로드 버튼 | ✅ | 클라이언트 컴포넌트, Blob 다운로드 |
| 404 커스텀 페이지 | ✅ | not-found.tsx |
| Notion API 에러 폴백 | ✅ | error.tsx |
| React `cache()` (요청 내 중복 제거) | ✅ | lib/notion.ts |
| `unstable_cache()` TTL 5분 캐싱 | ✅ | 요청 간 서버 캐싱 |
| Rate Limiting (IP 기반, 1분 5회) | ✅ | lru-cache, /api/generate-pdf |
| 캐시 무효화 엔드포인트 `/api/revalidate` | ✅ | REVALIDATE_SECRET 보호 |
| Playwright E2E 테스트 TC-01~05 | ✅ | 실제 Notion API 대상 |
| Vercel 배포 (프로덕션) | ✅ | GitHub 연동, 환경 변수 설정 완료 |

### 현재 앱 구조 (Phase 2 완료 기준)

```
app/
├── page.tsx                         ← 홈 랜딩 페이지
├── layout.tsx
├── globals.css
├── not-found.tsx
├── error.tsx
├── admin/
│   ├── layout.tsx                   ← 관리자 레이아웃 (사이드바)
│   ├── login/
│   │   └── page.tsx                 ← 패스워드 입력 폼
│   └── page.tsx                     ← 견적서 목록
├── invoice/[id]/page.tsx            ← 견적서 공개 조회
└── api/
    ├── admin-login/route.ts         ← 패스워드 검증 + 쿠키 발급
    ├── generate-pdf/route.tsx
    └── revalidate/route.ts

proxy.ts                             ← /admin 쿠키 검증 (Next.js 16 규약)

components/
├── admin/
│   ├── InvoiceListTable.tsx         ← 견적서 목록 테이블
│   └── CopyLinkButton.tsx           ← 링크 복사 버튼 ('use client')
├── invoice/
│   ├── InvoiceView.tsx
│   └── PdfDownloadButton.tsx
└── pdf/
    └── InvoicePDF.tsx

lib/
├── notion.ts    ← getInvoice(pageId) + getInvoices() (REST API fetch)
├── ratelimit.ts
└── utils.ts
```

---

## 3. Phase 2 — 관리자 기능 고도화 🟡 부분 완료

> **목표**: 관리자가 Notion 앱을 열지 않고 웹에서 견적서 목록을 확인하고 클라이언트 링크를 즉시 복사할 수 있도록 한다.

### 실행 순서

```
#P2-01 홈 화면 ──────────────────────────────────────────────┐
#P2-02 getInvoices() 함수 추가 ───────────────────────────────┤
#P2-03 관리자 레이아웃 ──── #P2-04 견적서 목록 페이지 ──────────┤──→ E2E 업데이트 → 배포
#P2-05 InvoiceListTable ──┘                                   │
#P2-06 CopyLinkButton ────────────────────────────────────────┘
```

---

### 우선순위 1 — 홈 화면

**목적**: 현재 `/invoice` redirect를 제거하고 서비스 소개 랜딩 페이지로 교체한다.

**파일**: `app/page.tsx`

**컨텐츠 구성**:
- 서비스 이름 + 간단한 설명
- "견적서 링크를 받으셨나요?" → 링크를 받은 클라이언트 안내
- "관리자" 진입 버튼 → `/admin` 링크

#### 태스크

| ID | 작업 | 복잡도 | 상태 |
|----|------|--------|------|
| #P2-01 | `app/page.tsx` 홈 랜딩 페이지로 교체 (redirect 제거) | S | ✅ |

---

### 우선순위 2 — 관리자 레이아웃 & 견적서 목록

**목적**: `/admin` 라우트에 견적서 목록을 테이블로 표시한다.

**인증 전략**: 환경 변수 `ADMIN_PASSWORD` 기반 심플 패스워드.
- `app/admin/login/page.tsx` — 패스워드 입력 폼
- 로그인 성공 시 쿠키 발급 → `middleware.ts`에서 `/admin` 접근 시 쿠키 검증
- NextAuth, OAuth 등 인증 라이브러리 불필요

**데이터 소스**: `NOTION_DATABASE_ID` 환경 변수 + Notion REST API 직접 `fetch()` 호출
> ℹ️ **구현 노트**: `@notionhq/client` v5가 `databases.query()`를 미지원(ADR-002 리스크 실현). Notion REST API(`POST /v1/databases/{id}/query`)로 대체 구현.

**목록 컬럼**: 견적서 번호 | 거래처명 | 발행일 | 금액 | 상태 | 링크 복사

#### 태스크

| ID | 작업 | 복잡도 | 파일 | 상태 |
|----|------|--------|------|------|
| #P2-02 | `lib/notion.ts` — `getInvoices()` 함수 추가 (REST API fetch로 구현) | M | `lib/notion.ts` | ✅ |
| #P2-03 | `app/admin/layout.tsx` — 관리자 레이아웃 (사이드바, 네비게이션) | S | `app/admin/layout.tsx` | ✅ |
| #P2-04 | `app/admin/page.tsx` — 견적서 목록 서버 컴포넌트 | M | `app/admin/page.tsx` | ✅ |
| #P2-05 | `components/admin/InvoiceListTable.tsx` — 목록 테이블 컴포넌트 | M | `components/admin/InvoiceListTable.tsx` | ✅ |
| #P2-08 | `app/admin/login/page.tsx` — 패스워드 입력 폼 | S | `app/admin/login/page.tsx` | ✅ |
| #P2-09 | `proxy.ts` — `/admin` 쿠키 검증, 미인증 시 `/admin/login` 리다이렉트 | S | `proxy.ts` | ✅ |
| #P2-10 | `app/api/admin-login/route.ts` — 패스워드 검증 후 쿠키 발급 | S | `app/api/admin-login/route.ts` | ✅ |

---

### 우선순위 3 — 링크 복사

**목적**: 견적서 목록 각 행에서 클라이언트 전송용 URL을 클립보드에 복사한다.

**URL 형식**: `${NEXT_PUBLIC_BASE_URL}/invoice/${notionPageId}`

**UX**:
- 복사 버튼 클릭 → `navigator.clipboard.writeText(url)`
- 성공 시 버튼 텍스트 "복사됨 ✓" 로 2초간 변경
- `'use client'` 컴포넌트

**환경 변수 추가 필요**:
```env
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app  # 프로덕션 URL
```

#### 태스크

| ID | 작업 | 복잡도 | 파일 | 상태 |
|----|------|--------|------|------|
| #P2-06 | `components/admin/CopyLinkButton.tsx` — 클립보드 복사 버튼 | S | `components/admin/CopyLinkButton.tsx` | ✅ |
| #P2-07 | `NEXT_PUBLIC_BASE_URL`, `ADMIN_PASSWORD` 환경 변수 추가 (`.env.example`, Vercel) | S | `.env.example` | ✅ |

---

### 우선순위 4 — 관리자 대시보드 & 로그아웃

**목적**: 로그인 후 대시보드로 랜딩하고, 상단 우측에 로그아웃 버튼을 제공한다.

#### 태스크

| ID | 작업 | 복잡도 | 파일 | 상태 |
|----|------|--------|------|------|
| #P2-11 | `app/admin/(main)/dashboard/page.tsx` — 대시보드 (프로토타입 shell) | M | `app/admin/(main)/dashboard/page.tsx` | 🔲 |
| #P2-11 | `app/admin/(main)/layout.tsx` — 헤더 상단 우측 로그아웃 버튼, 로그인 페이지 레이아웃 분리 (라우트 그룹) | S | `app/admin/(main)/layout.tsx` | 🔲 |
| #P2-11 | `components/admin/LogoutButton.tsx` — 버튼 스타일 로그아웃 컴포넌트 | S | `components/admin/LogoutButton.tsx` | 🔲 |
| #P2-11 | `app/api/admin-logout/route.ts` — 쿠키 만료 처리 | S | `app/api/admin-logout/route.ts` | 🔲 |

---

### Phase 2 완성 후 앱 구조

```
app/
├── page.tsx                         ← 홈 랜딩 페이지
├── layout.tsx
├── globals.css
├── not-found.tsx
├── error.tsx
├── admin/
│   ├── layout.tsx                   ← pass-through (사이드바 없음)
│   ├── (main)/                      ← 라우트 그룹: 사이드바+헤더 적용
│   │   ├── layout.tsx               ← 헤더(로그아웃 우측) + 사이드바
│   │   ├── page.tsx                 ← 견적서 목록 (/admin)
│   │   └── dashboard/
│   │       └── page.tsx             ← 대시보드 (/admin/dashboard)
│   └── login/
│       └── page.tsx                 ← 패스워드 입력 폼 (사이드바 없음)
├── invoice/[id]/page.tsx            ← 기존 유지 (공개 조회)
└── api/
    ├── admin-login/route.ts         ← 패스워드 검증 + 쿠키 발급
    ├── admin-logout/route.ts        ← 쿠키 만료 처리
    ├── generate-pdf/route.tsx
    └── revalidate/route.ts

proxy.ts                             ← /admin 쿠키 검증 (Next.js 16 규약)

components/
├── admin/
│   ├── InvoiceListTable.tsx         ← 견적서 목록 테이블
│   ├── CopyLinkButton.tsx           ← 링크 복사 버튼 ('use client')
│   └── LogoutButton.tsx             ← 로그아웃 버튼 ('use client')
├── invoice/
│   ├── InvoiceView.tsx
│   └── PdfDownloadButton.tsx
└── pdf/
    └── InvoicePDF.tsx
```

### Phase 2 완료 기준

- [x] `/` 홈 화면이 서비스 소개 랜딩 페이지로 표시됨
- [x] `/admin` 접근 시 패스워드 폼(`/admin/login`)으로 리다이렉트됨
- [x] 올바른 패스워드 입력 시 `/admin/dashboard`로 이동
- [x] 잘못된 패스워드 → 에러 메시지 표시
- [x] `/admin`에서 Notion DB의 견적서 목록이 테이블로 표시됨
- [x] 목록 각 행의 "링크 복사" 클릭 시 클립보드에 견적서 URL 복사됨
- [x] 복사 후 2초간 "복사됨 ✓" 피드백 표시
- [x] 모바일(375px)에서 관리자 레이아웃 정상 표시
- [ ] `/admin/dashboard` 대시보드 페이지 표시 (로그인 후 랜딩)
- [ ] 로그인 페이지에 사이드바/헤더 미표시
- [ ] 상단 우측 로그아웃 버튼 — 클릭 시 쿠키 삭제 후 로그인 페이지로 이동
- [ ] Playwright E2E 테스트 업데이트 및 통과

---

## 4. Phase 3 — 추가 고도화 (PRD 기반)

> PRD `## 향후 개선 방향` 기반. Phase 2 완료 후 우선순위 결정.

### Phase 3-A: 관리 기능 강화

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 견적서 상태 필터링 | 목록에서 상태별 필터 (대기/발송/완료) | Medium |
| 견적서 검색 | 거래처명, 견적서 번호 검색 | Low |

### Phase 3-B: 자동화

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 이메일 자동 발송 | Resend 또는 SendGrid 연동 — 견적서 링크 이메일 전송 | Medium |
| 견적서 만료 알림 | 유효기간 임박 시 관리자에게 알림 | Low |

### Phase 3-C: 고급 기능

| 기능 | 설명 | 우선순위 |
|------|------|---------|
| 다중 템플릿 | 업종별 견적서 레이아웃 선택 | Low |
| 전자 서명 | 클라이언트 서명 수집 | Low |
| 견적서 버전 관리 | 수정 이력 추적 | Low |

---

## 5. 미결 사항

> ROADMAP_v1.md에서 이월된 미결 사항 (Q2~Q5)

| # | 질문 | 중요도 | 상태 |
|---|------|--------|------|
| Q2 | 견적서 URL에 Notion 페이지 ID를 그대로 노출해도 되는지, 아니면 별도 짧은 ID가 필요한지? | Medium | 미결 |
| Q3 | PDF에 이미지가 포함되어야 하는지? | Medium | ✅ 해결됨 — 로고/도장 불필요. 간단한 장식 이미지 수준으로 처리 |
| Q4 | 견적서 상태(Status)에 따라 표시 여부를 제어해야 하는지? (예: "거절" 상태 견적서 조회 불가) | Medium | 미결 |
| Q5 | 다국어 지원이 필요한지? | Low | ✅ 해결됨 — 불필요. 한국어 단일 로케일 고정 |
| Q6 | 관리자 페이지 인증 방식 | Medium | ✅ 해결됨 — 간단한 패스워드 (환경 변수 `ADMIN_PASSWORD` + 쿠키) |

---

## 6. 아키텍처 결정 사항 (ADR)

### ADR-001: App Router 채택 _(기존 유지)_

**상태**: 결정됨
**결정**: `app/` 디렉터리, 서버 컴포넌트 기본, Promise-based params.
**근거**: Next.js 16에서 Pages Router는 레거시 경로. 장기 유지보수 측면에서 App Router가 표준.

---

### ADR-002: Notion `pages.retrieve()` 기반 단건 조회 _(기존 유지)_

**상태**: 결정됨
**결정**: URL의 `[id]` 파라미터를 Notion 페이지 ID로 직접 사용. 공개 조회 페이지는 `pages.retrieve()` 단건 조회 유지.
**트레이드오프**: Notion 페이지 ID가 URL에 노출됨. 링크를 받은 사람만 접근하므로 현재는 허용.

---

### ADR-003: PDF 생성 — @react-pdf/renderer _(기존 유지)_

**상태**: 결정됨
**결정**: `@react-pdf/renderer`로 React 컴포넌트 기반 PDF 레이아웃. 서버사이드 생성.
**근거**: Vercel 서버리스 환경 친화적. 크로미움 바이너리 의존성 없음.

---

### ADR-004: PDF 생성을 API Route에서 처리 _(기존 유지)_

**상태**: 결정됨
**결정**: `app/api/generate-pdf/route.ts` 서버사이드에서 처리. 클라이언트는 POST 후 Blob 수신.
**근거**: Notion API 키 클라이언트 미노출. 무거운 렌더링 연산을 서버에서 처리.

---

### ADR-005: 관리자 패스워드 — 환경 변수 + 쿠키 방식 _(신규)_

**상태**: 결정됨 · 구현 완료 (2026-04-16)
**결정**: `ADMIN_PASSWORD` 환경 변수와 HttpOnly 쿠키를 사용한 심플 패스워드 인증.
- `POST /api/admin-login` — 패스워드 검증 후 `admin_session` 쿠키 발급 (HttpOnly, Secure)
- `proxy.ts` — `/admin` 경로 접근 시 쿠키 존재 여부 확인. 없으면 `/admin/login` 리다이렉트 (Next.js 16: `middleware.ts` → `proxy.ts` 규약 변경)
- 세션 DB, JWT 라이브러리 불필요
**근거**: 개인 프로젝트 + 1인 관리자. NextAuth.js 등 인증 라이브러리는 이 규모에서 오버엔지니어링. 쿠키 방식으로 충분한 보호 수준 확보.
**트레이드오프**: 패스워드 변경 시 환경 변수 재배포 필요. 로그아웃 기능은 쿠키 삭제로 구현.

---

### ADR-006: 링크 복사 — `navigator.clipboard` API _(신규)_

**상태**: 결정됨
**결정**: `CopyLinkButton` 클라이언트 컴포넌트에서 `navigator.clipboard.writeText()` 사용.
**근거**: 추가 라이브러리 없이 브라우저 내장 API 활용. 모던 브라우저 전체 지원.
**트레이드오프**: HTTPS 환경에서만 동작 (로컬호스트 제외). Vercel 배포 기준 문제 없음.

---

## 7. 리스크 레지스터

| # | 리스크 | 영향도 | 발생 가능성 | 완화 전략 |
|---|--------|--------|-------------|-----------|
| R1 | Notion 페이지 ID 형식 변경 | High | Low | 완화 적용됨 — 정규식 검증 |
| R2 | `@notionhq/client` v5에서 `databases.query()` 호환성 문제 | High | ~~Medium~~ **발생** | ✅ 완화됨 — Notion REST API 직접 `fetch()` 호출로 대체 구현 (2026-04-16) |
| R3 | Vercel 함수 타임아웃 (PDF 생성) | Medium | Low | `maxDuration` 설정 (Pro 플랜) |
| R4 | `NEXT_PUBLIC_BASE_URL` 미설정 시 복사 URL이 잘못됨 | Medium | Medium | `.env.example` 문서화, 배포 체크리스트 항목 추가 |
| R5 | 패스워드 유출 시 견적서 목록 노출 | Medium | Low | `ADMIN_PASSWORD` 환경 변수로 관리. 쿠키 HttpOnly + Secure 설정으로 XSS 방어 |

---

## 8. 배포 환경 변수 목록

| 변수명 | 설명 | Phase | 필수 |
|--------|------|-------|------|
| `NOTION_API_KEY` | Notion Integration 토큰 | 1 | 필수 |
| `NOTION_DATABASE_ID` | 견적서 DB ID | 1 | 필수 |
| `REVALIDATE_SECRET` | 캐시 무효화 엔드포인트 보호 | 1 | 필수 |
| `NEXT_PUBLIC_BASE_URL` | 프로덕션 URL (링크 복사용) | 2 | 필수 |
| `ADMIN_PASSWORD` | 관리자 페이지 접근 패스워드 | 2 | 필수 |
