import type { NextConfig } from 'next'

const securityHeaders = [
  // 클릭재킹 방지. CSP frame-ancestors가 지원되면 그쪽이 더 강력하지만,
  // 구형 브라우저 호환성을 위해 X-Frame-Options도 병행 설정한다.
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // MIME 타입 스니핑 방지 — XSS 공격 벡터 차단
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  // Referrer 정책 — 외부 사이트로 나갈 때 origin만 전송
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  // 불필요한 브라우저 기능 비활성화
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
]

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // 모든 경로에 보안 헤더 적용
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
}

export default nextConfig
