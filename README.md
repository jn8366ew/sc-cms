# sc-cms

Notion을 백엔드로 사용하는 견적서 관리 시스템.  
동시에 **Claude Code를 실제 프로덕션 프로젝트에서 어떻게 고급스럽게 활용하는지** 탐구하는 레퍼런스 프로젝트입니다.

---

## 프로젝트 이중 목적

### 1. 견적서 CMS

Notion에서 견적서를 작성하면, 클라이언트에게 고유 링크를 전달합니다. 클라이언트는 브라우저에서 견적서를 확인하고 PDF로 다운로드합니다.

| 역할 | 흐름 |
|------|------|
| 관리자 | Notion 작성 → `/admin`에서 링크 복사 → 클라이언트 전달 |
| 클라이언트 | 링크 접근 → 견적서 조회 → PDF 다운로드 |

### 2. Claude Code 고급 활용 레퍼런스

이 프로젝트는 Claude Code의 다양한 기능을 실제 개발 워크플로에 통합하는 방법을 보여줍니다:

- **커스텀 에이전트** (`.claude/agents/`) — 도메인 전문 지식을 에이전트로 캡슐화
- **지속적 메모리** (`.claude/agent-memory/`) — 대화 간 컨텍스트 유지
- **구조화된 태스크** (`.claude/tasks/`) — 로드맵과 연동된 개발 진행 추적
- **프로젝트 지침** (`CLAUDE.md`, `.claude/CLAUDE.md`) — 멘토링 스타일 코드 리뷰 기준 정의
- **에이전트 협업** — slack-hook-expert, notion-api-database-expert 등 전문화된 에이전트 분업

---

## 기술 스택

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 16.2.1 |
| Language | TypeScript | ^5 |
| Runtime | React | 19.2.4 |
| CMS | Notion REST API | — |
| PDF 생성 | @react-pdf/renderer | ^4.4.1 |
| Styling | Tailwind CSS (zero-config) | ^4 |
| UI | shadcn/ui + Lucide React | — |
| Testing | Playwright | ^1.59.1 |
| Deployment | Vercel | — |

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 참고하여 `.env.local`을 생성합니다.

| 변수 | 설명 | 필수 |
|------|------|------|
| `NOTION_API_KEY` | Notion Integration Secret | 필수 |
| `NOTION_DATABASE_ID` | 견적서 Notion DB ID | 필수 |
| `REVALIDATE_SECRET` | 캐시 무효화 엔드포인트 보호 토큰 | 필수 |
| `NEXT_PUBLIC_BASE_URL` | 프로덕션 URL (링크 복사용) | 필수 |
| `ADMIN_PASSWORD` | 관리자 페이지 접근 패스워드 | 필수 |
| `SLACK_WEBHOOK_URL` | Slack 알림 Incoming Webhook URL | 선택 |

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

---

## 앱 구조

```
app/
├── page.tsx                     ← 홈 랜딩 페이지
├── admin/
│   ├── layout.tsx               ← 관리자 레이아웃 (사이드바)
│   ├── login/page.tsx           ← 패스워드 인증
│   └── page.tsx                 ← 견적서 목록
├── invoice/[id]/page.tsx        ← 견적서 공개 조회
└── api/
    ├── admin-login/route.ts
    ├── admin-logout/route.ts
    ├── generate-pdf/route.tsx
    └── revalidate/route.ts

proxy.ts                         ← /admin 쿠키 검증 미들웨어

lib/
├── notion.ts                    ← getInvoice(), getInvoices()
├── slack.ts                     ← Slack webhook 유틸리티
├── ratelimit.ts                 ← IP 기반 rate limiting
└── utils.ts

components/
├── admin/                       ← InvoiceListTable, CopyLinkButton
├── invoice/                     ← InvoiceView, PdfDownloadButton
└── pdf/                         ← InvoicePDF
```

---

## Claude Code 활용 구조

```
.claude/
├── CLAUDE.md                    ← Principal Engineer 멘토링 스타일 지침
├── agents/
│   ├── slack-hook-expert.md     ← Slack webhook 전문 에이전트
│   ├── notion-api-database-expert.md
│   ├── nextjs-app-developer.md
│   └── ...                      ← 도메인별 전문 에이전트
├── agent-memory/
│   └── slack-hook-expert/       ← 에이전트별 지속 메모리
├── tasks/
│   ├── v1/                      ← Phase 1 태스크 (완료)
│   └── phase6-admin-upgrade.md  ← Phase 2 태스크
└── plans/                       ← 구현 계획 파일
```

---

## 스크립트

```bash
npm run dev           # 개발 서버 (Turbopack)
npm run build         # 프로덕션 빌드
npm run lint          # ESLint 검사
npm run test:e2e      # Playwright E2E 테스트
```

---

## 주요 아키텍처 결정

| 결정 | 이유 |
|------|------|
| Notion REST API 직접 `fetch()` 사용 | `@notionhq/client` v5에서 `databases.query()` 미지원 |
| 패스워드 + HttpOnly 쿠키 인증 | 1인 관리자 규모에서 NextAuth 오버엔지니어링 |
| `unstable_cache` + React `cache()` 이중 레이어 | 요청 내 중복 제거 + 요청 간 TTL 캐싱 분리 |
| `@react-pdf/renderer` 서버사이드 PDF | Vercel 서버리스 환경에서 Chromium 바이너리 불필요 |
| Slack Incoming Webhook (SDK 없음) | 단방향 알림에 `fetch()` 직접 호출로 충분 |

자세한 ADR은 [`docs/ROADMAP.md`](docs/ROADMAP.md) 참조.
