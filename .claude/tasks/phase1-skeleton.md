---
phase: 1
title: 프로젝트 초기 설정 (골격)
status: in_progress
---

## #1 Playwright 설치 및 playwright.config.ts 설정

- **상태**: 🔲 pending
- **의존성**: 없음 (시작 가능)
- **작업**:
  - `npx playwright install` 실행
  - `playwright.config.ts` 생성 (baseURL: localhost:3000, chromium 단일 브라우저)
  - `package.json`에 `test`, `test:ui` 스크립트 추가

---

## #2 홈 페이지 smoke test 작성 (tests/smoke.spec.ts)

- **상태**: 🔲 pending
- **의존성**: #1
- **작업**:
  - 홈 페이지 접속 시 200 응답 확인
  - 글 목록이 1개 이상 렌더링되는지 확인
  - `npm test` 통과 기준
