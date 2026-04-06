# 나만의 소울칼리버 블로그

Notion CMS 기반 소울칼리버 자료 및 대전회고 블로그

**기술 스택:**
- Next.js 16.2.1 (App Router, Turbopack)
- React 19.2.4
- TypeScript 5
- Tailwind CSS v4 (zero-config, `@import "tailwindcss"`)
- @notionhq/client v5 (주의: `databases.query` 제거됨 — `search` API 사용)
- lucide-react v1

---

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 참고하여 `.env.local` 파일을 직접 생성합니다.

```bash
cp .env.example .env.local
# 편집기에서 .env.local 열고 값 입력
```

| 변수 | 설명 |
|------|------|
| `NOTION_TOKEN` | [notion.so/my-integrations](https://www.notion.so/my-integrations)에서 발급한 Integration Secret |
| `NOTION_DATABASE_ID` | 블로그 포스트 Notion 데이터베이스의 ID (URL에서 `?v=` 앞 32자리) |

**Notion 데이터베이스 스키마:**

| 속성명 | 타입 | 설명 |
|--------|------|------|
| Title | title | 포스트 제목 |
| Category | select | 카테고리 |
| Tags | multi_select | 태그 목록 |
| Published | date | 발행일 |
| Status | select | `발행됨` / 초안 |

> 발행된 글만 노출하려면 Status 값을 정확히 `발행됨`으로 설정해야 합니다.

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

---

## 스크립트

```bash
npm run dev           # 개발 서버 (Turbopack)
npm run build         # 프로덕션 빌드
npm start             # 빌드된 앱 실행
npm run lint          # ESLint 검사
npm run format        # Prettier 포맷 적용
npm run format:check  # Prettier 포맷 확인
```

---

## 폴더 구조

```
sc-cms/
├── app/
│   ├── layout.tsx              # 루트 레이아웃, 사이트 메타데이터
│   ├── page.tsx                # 홈 (포스트 목록)
│   ├── globals.css             # Tailwind v4 임포트 + 전역 스타일
│   ├── posts/[slug]/
│   │   └── page.tsx            # 포스트 상세 페이지
│   └── category/[category]/
│       └── page.tsx            # 카테고리별 포스트 목록
├── lib/
│   └── notion.ts               # Notion API 클라이언트 + 데이터 페치 함수
├── types/
│   └── notion.ts               # NotionPost 등 도메인 타입
├── components/                 # UI 컴포넌트 (추가 예정)
├── .env.example                # 환경 변수 템플릿
└── next.config.ts              # 보안 헤더 설정
```

---

## 주요 설계 결정 및 주의사항

### @notionhq/client v5 API 변경

`databases.query()`가 v5에서 제거되었습니다. 현재 `lib/notion.ts`는 `notion.search()` API를 사용하여 워크스페이스 전체 페이지를 조회한 뒤 `parent.database_id`로 필터링합니다.

**트레이드오프:** 페이지가 많아질수록 페이지네이션 순회 비용이 증가합니다. 100건 이상이 예상된다면 `unstable_cache` 또는 ISR 적용을 검토하세요.

### Tailwind v4

`tailwind.config.js`가 없습니다. 커스텀 디자인 토큰은 `app/globals.css`의 `@theme` 블록에서 CSS 변수로 정의합니다.

### 보안 헤더

`next.config.ts`에 X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy가 전체 경로에 적용됩니다.
