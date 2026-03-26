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
