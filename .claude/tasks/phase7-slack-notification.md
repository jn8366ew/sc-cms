## 실행 순서

```
#P7-01 (독립) ─→ #P7-02 (의존: #P7-01)
               └→ #P7-03 (독립)
```

---

## #P7-01 lib/slack.ts — 알림 헬퍼 작성

- **상태**: ✅ completed (2026-04-16)
- **의존성**: 없음
- **파일**: `lib/slack.ts` (신규)
- **작업**:
  - `sendDownloadNotification(invoice, ip)` 함수 작성
  - `SLACK_WEBHOOK_URL` 환경 변수 미설정 시 즉시 return (개발 환경 skip)
  - `AbortController` 5초 타임아웃
  - 실패 시 `console.error`만, throw 금지 (fire-and-forget)
  - Slack Block Kit payload 구성:
    - Header 블록: "📥 견적서 다운로드"
    - Section 블록: 견적서 번호, 거래처명, 금액(`formatKRW`), 다운로드 시각(KST), IP

---

## #P7-02 app/api/generate-pdf/route.tsx — 알림 호출 추가

- **상태**: ✅ completed (2026-04-16)
- **의존성**: #P7-01
- **파일**: `app/api/generate-pdf/route.tsx` (수정)
- **작업**:
  - PDF 생성 성공 후 응답 반환 직전 `sendDownloadNotification()` fire-and-forget 호출
  - `void sendDownloadNotification(...).catch(() => {})` 패턴 사용
  - IP: 기존 rate limit 로직의 `ip` 변수 재사용

---

## #P7-03 환경 변수 추가

- **상태**: 🔲 pending (`.env.example` 파일 권한 제한으로 수동 추가 필요)
- **의존성**: 없음
- **파일**: `.env.example` (수정), `.env.local` (직접 추가)
- **작업**:
  - `.env.example`에 `SLACK_WEBHOOK_URL` 항목 추가 (주석 포함)
  - `.env.local`에 실제 Slack Incoming Webhook URL 추가
  - Vercel 대시보드 환경 변수에도 추가 필요
- **비고**: `.env.example` 권한 이슈로 이전 세션과 동일하게 수동 추가 필요
  ```env
  SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/yyy/zzz  # PDF 다운로드 알림용
  ```

---

## 검증 방법

1. `.env.local`에 실제 Slack Incoming Webhook URL 설정
2. `npm run dev` 실행
3. 견적서 페이지에서 PDF 다운로드 버튼 클릭
4. Slack 채널에서 알림 메시지 수신 확인
5. `.env.local`에서 `SLACK_WEBHOOK_URL` 제거 후 다운로드 재시도 → PDF 정상 다운로드 (에러 없음) 확인
