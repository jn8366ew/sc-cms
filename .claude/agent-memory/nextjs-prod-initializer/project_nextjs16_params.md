---
name: Next.js 16 params Promise API
description: Next.js 16에서 동적 라우트 params는 Promise 타입 — await 필요
type: project
---

Next.js 16 (이 프로젝트)에서 App Router 동적 라우트의 `params`는 Promise 타입이다.

**적용 방법:**
```tsx
type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
}
```

**Why:** v15.0.0-RC에서 변경됨. v14 이하에서는 동기적으로 접근 가능했지만 현재는 deprecated.

**How to apply:** page.tsx, layout.tsx에서 dynamic segment를 사용할 때 항상 `await params` 패턴 사용.
