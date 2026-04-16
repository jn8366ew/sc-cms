---
phase: 6
title: 관리자 기능 고도화
status: completed
completedAt: 2026-04-16
---

## 실행 순서 (의존성 기준)

```
#P2-01 (독립) ────────────────────────────────────────────────────┐
#P2-06 (독립) ──────────────────────────────────┐                 │
#P2-07 (독립) ──────────────────────────────────┤                 │
#P2-10 (독립) ──────────┬───────────────────────┤                 │
#P2-02 (독립) ────┐     │                       │                 │
#P2-03 (독립) ──┐ │     │                       │                 │
                │ │     ├→ #P2-08 (의존: #P2-10) │                 │
                │ ├→ #P2-05 (의존: #P2-06)       │                 │
                │ │     │                       │                 │
                │ └──→ #P2-04 (의존: #P2-02, #P2-03, #P2-05)      │
                │       │                       │                 │
                │       ├→ #P2-09 (의존: #P2-10) │                 │
                ├───────┴───────────────────────┴─────────────────┘
                │
                └──→ #P2-11 (의존: #P2-03) ── 관리자 대시보드
```

---

## #P2-01 홈 화면 랜딩 페이지

- **상태**: ✅ completed (2026-04-16)
- **의존성**: 없음
- **파일**: `app/page.tsx`
- **작업**:
  - 현재 `/invoice` redirect 로직 제거
  - 서비스 소개 랜딩 페이지로 교체
  - 컨텐츠 구성: 서비스 이름 + 간단한 설명
  - "견적서 링크를 받으셨나요?" 클라이언트 안내 섹션
  - 관리자 진입 버튼 (`/admin` 링크)
  - 다크모드 기본 적용 (`dark:` 클래스, zinc 계열)

---

## #P2-02 getInvoices() 함수 추가

- **상태**: ✅ completed (2026-04-16) — @notionhq/client v5 databases.query() 미지원으로 Notion REST API fetch()로 대체
- **의존성**: 없음
- **파일**: `lib/notion.ts`
- **작업**:
  - Notion `databases.query()` API로 DB 전체 견적서 목록 조회
  - 반환 타입: `Invoice[]` (기존 `Invoice` 타입 재사용)
  - 정렬: 발행일 내림차순 (`sorts: [{ property: 'issue_date', direction: 'descending' }]`)
  - 기존 파싱 헬퍼 함수 재사용 (`getTitle`, `getRichText`, `getDate`, `getStatus` 등)
  - try/catch + 콘솔 에러 로깅 (기존 패턴 유지)
  - `React.cache()` 래핑 (요청 내 중복 호출 방지)
- **비고**: 구현 전 `@notionhq/client` v5의 `databases.query()` 호환성 확인 필수. 문제 시 Notion REST API 직접 `fetch()` 호출로 대체.

---

## #P2-03 관리자 레이아웃

- **상태**: ✅ completed (2026-04-16)
- **의존성**: 없음
- **파일**: `app/admin/layout.tsx`
- **작업**:
  - 서버 컴포넌트로 구현
  - 좌측 사이드바: 로고/서비스명 + "견적서 목록" 네비게이션 링크
  - 메인 컨텐츠 영역: `{children}` 렌더링
  - 다크모드 기본 적용 (`dark:` 클래스, zinc 계열)
  - 모바일 대응: 사이드바 → 상단 네비게이션 바로 전환

---

## #P2-04 견적서 목록 페이지

- **상태**: ✅ completed (2026-04-16)
- **의존성**: #P2-02, #P2-03, #P2-05
- **파일**: `app/admin/page.tsx`
- **작업**:
  - 서버 컴포넌트로 구현
  - `getInvoices()` 호출 → `InvoiceListTable`에 데이터 전달
  - `generateMetadata()`: `{ title: '견적서 목록 | 관리자' }`
  - 데이터 없을 때 빈 상태 UI 표시

---

## #P2-05 InvoiceListTable 컴포넌트

- **상태**: ✅ completed (2026-04-16)
- **의존성**: #P2-06
- **파일**: `components/admin/InvoiceListTable.tsx`
- **작업**:
  - 테이블 컬럼: 견적서 번호 | 거래처명 | 발행일 | 금액 | 상태 | 링크 복사
  - 금액 표시: 기존 `formatKRW` 유틸 재사용 (`₩` + 천 단위 구분자)
  - 상태 배지: 기존 `STATUS_MAP` 재사용 (pill 형태, 색상 코딩)
  - 각 행에 `CopyLinkButton` 컴포넌트 배치
  - 견적서 번호 클릭 시 `/invoice/[id]` 상세 페이지로 이동
  - 다크모드 기본 적용

---

## #P2-06 CopyLinkButton 컴포넌트

- **상태**: ✅ completed (2026-04-16)
- **의존성**: 없음
- **파일**: `components/admin/CopyLinkButton.tsx`
- **작업**:
  - `'use client'` 클라이언트 컴포넌트
  - `navigator.clipboard.writeText(url)` 사용
  - URL 형식: `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${pageId}`
  - 복사 성공 시 버튼 텍스트 "복사됨" 으로 2초간 변경 후 원복
  - 복사 실패 시 fallback 처리 (구형 브라우저 대응)
  - 다크모드 기본 적용

---

## #P2-07 환경 변수 추가

- **상태**: ✅ completed (2026-04-16) — .env.example 권한 제한으로 수동 추가 필요 (아래 비고 참고)
- **의존성**: 없음
- **파일**: `.env.example`
- **작업**:
  - `NEXT_PUBLIC_BASE_URL` 추가 (프로덕션 URL, 링크 복사용)
  - `ADMIN_PASSWORD` 추가 (관리자 패스워드)
  - 각 변수에 설명 주석 추가
- **비고**: Vercel 대시보드에도 두 환경 변수 추가 필요 (`NEXT_PUBLIC_BASE_URL`, `ADMIN_PASSWORD`)

---

## #P2-08 패스워드 입력 폼

- **상태**: ✅ completed (2026-04-16)
- **의존성**: #P2-10
- **파일**: `app/admin/login/page.tsx`
- **작업**:
  - 서버 컴포넌트 (form action은 클라이언트에서 API Route 호출)
  - 패스워드 입력 필드 (`type="password"`) + 로그인 버튼
  - `/api/admin-login` POST 요청으로 패스워드 검증
  - 성공 시 `/admin`으로 리다이렉트
  - 잘못된 패스워드 시 에러 메시지 표시 ("비밀번호가 올바르지 않습니다")
  - 다크모드 기본 적용 (`dark:` 클래스, zinc 계열)
  - 중앙 정렬 카드 레이아웃

---

## #P2-09 미들웨어 쿠키 검증

- **상태**: ✅ completed (2026-04-16) — Next.js 16 규약에 따라 middleware.ts → proxy.ts로 구현
- **의존성**: #P2-10
- **파일**: `middleware.ts` (프로젝트 루트, 신규 생성)
- **작업**:
  - `/admin` 경로 접근 시 `admin_session` 쿠키 존재 여부 확인
  - 쿠키 없으면 `/admin/login`으로 리다이렉트
  - `/admin/login` 경로는 미들웨어 검증 제외 (matcher config)
  - Next.js Edge Runtime에서 동작 (Node.js API 사용 불가 — `crypto.subtle` 등 Web API만 사용)
  - `config.matcher` 패턴: `'/admin/((?!login).*)' `

---

## #P2-10 패스워드 검증 API Route

- **상태**: ✅ completed (2026-04-16)
- **의존성**: 없음
- **파일**: `app/api/admin-login/route.ts`
- **작업**:
  - POST 핸들러: request body에서 `password` 필드 수신
  - `process.env.ADMIN_PASSWORD`와 비교 (timing-safe comparison 권장)
  - 일치 시: `admin_session` 쿠키 발급 + 200 응답
    - 쿠키 옵션: `HttpOnly`, `Secure`, `SameSite=Strict`, `maxAge=86400` (24시간)
  - 불일치 시: 401 응답 + `{ error: '비밀번호가 올바르지 않습니다' }`
  - `ADMIN_PASSWORD` 환경 변수 미설정 시 500 에러 반환

---

## #P2-11 관리자 대시보드

- **상태**: 🔲 pending
- **의존성**: #P2-03 (관리자 레이아웃)
- **파일**:
  - `app/admin/dashboard/page.tsx` (신규)
  - `app/admin/layout.tsx` (수정 — 사이드바 "대시보드" 메뉴 추가)
  - `app/admin/login/page.tsx` (수정 — 로그인 성공 시 `/admin/dashboard`로 redirect)
- **작업**:
  - 로그인 성공 후 랜딩 페이지 `/admin/dashboard` 생성
  - 대시보드 구성 (프로토타입 — 실제 데이터 연동 없이 UI 껍데기만):
    - **견적서 현황**: 전체 건수 / 이번 달 발행 / 미결 건수 카드 (값은 "--" placeholder)
    - **거래처 관리**: "준비 중" 빈 상태 UI
    - **최근 활동**: 스켈레톤 placeholder 3행 + "추후 지원 예정" 안내
  - 사이드바 네비게이션에 "대시보드" 링크 (`/admin/dashboard`) 추가 — 견적서 목록 위에 배치
  - 로그인 성공 시 redirect 경로를 `/admin` → `/admin/dashboard`로 변경
  - 다크모드 기본 적용 (zinc 계열)
- **비고**: 프로토타입 목적 — 세부 데이터 연동은 Phase 3에서 결정. `app/admin/dashboard/page.tsx`는 이미 생성 완료됨 (2026-04-16).
