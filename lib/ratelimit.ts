import { LRUCache } from 'lru-cache'

// IP당 슬라이딩 윈도우 rate limit
// 개인 프로젝트 기준: 인스턴스 간 공유 없음 (메모리 기반)
// Vercel 서버리스에서 인스턴스별 독립 카운팅 — 트래픽 낮은 개인 프로젝트에 적합

const WINDOW_MS = 60_000  // 1분 윈도우
const MAX_REQUESTS = 5    // IP당 최대 요청 수

type RateLimitEntry = { count: number; resetAt: number }

const cache = new LRUCache<string, RateLimitEntry>({
  max: 500,        // 최대 추적 IP 수 — 메모리 상한 보장
  ttl: WINDOW_MS,  // 윈도우 초과 시 자동 만료
})

export function checkRateLimit(ip: string): {
  allowed: boolean
  remaining: number
  resetAt: number
} {
  const now = Date.now()
  const entry = cache.get(ip)

  if (!entry || now > entry.resetAt) {
    // 새 윈도우 시작
    const resetAt = now + WINDOW_MS
    cache.set(ip, { count: 1, resetAt })
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count += 1
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt }
}
