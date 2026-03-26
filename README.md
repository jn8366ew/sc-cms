# Notion CMS Game Blog

Notion을 CMS로 사용하는 Next.js 게임 블로그입니다.

**기술 스택:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- @notionhq/client

---

## Getting Started

### 1. 의존성 설치

```bash
npm install
```

**포함되는 패키지:**
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- @notionhq/client — Notion API
- shadcn/ui — UI 컴포넌트
- Lucide React — 아이콘

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 입력하세요:

```bash
NOTION_TOKEN=your_notion_token_here
NOTION_DATABASE_ID=your_database_id_here
```

**Notion 토큰 발급:**
[notion.so/my-integrations](https://www.notion.so/my-integrations)에서 "New integration" 생성 후 "Internal Integration Secret" 복사

**Database ID 찾기:**
Notion에서 데이터베이스를 Full page로 열고 URL에서 `?v=` 앞의 32자리 ID 복사

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인

---

## 개발 커맨드

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드된 앱 실행
npm start

# ESLint 검사
npm run lint
```

## UI 컴포넌트 & 아이콘

### shadcn/ui 컴포넌트 추가

필요한 컴포넌트를 언제든 추가할 수 있습니다:

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
```

[shadcn/ui 컴포넌트 목록](https://ui.shadcn.com/docs/components)

### Lucide React 아이콘 사용

```tsx
import { Heart, Search, Menu } from 'lucide-react'

export default function Example() {
  return <Heart className="w-6 h-6" />
}
```

[Lucide 아이콘 목록](https://lucide.dev)
