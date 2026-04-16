'use client'

// 관리자 로그인 페이지 — 패스워드 검증 후 /admin으로 이동
// POST /api/admin-login 으로 패스워드를 전송하고 쿠키를 발급받는다
import { useState } from 'react'
import { cn } from '@/lib/utils'

export default function AdminLoginPage() {

  // 폼 상태
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // TODO: 폼 제출 핸들러 — /api/admin-login에 POST 요청
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    const res = await fetch('/api/admin-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      // router.push가 아닌 하드 네비게이션 — Set-Cookie로 설정된 쿠키가
      // 클라이언트 사이드 라우팅 첫 요청에 포함되지 않는 문제 방지
      window.location.href = '/admin/dashboard'
    } else {
      // 실패 시 에러 메시지 표시
      setErrorMessage('비밀번호가 올바르지 않습니다')
      setIsLoading(false)
    }
  }

  return (
    /* 전체 화면 중앙 정렬 */
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      {/* 로그인 카드 */}
      <div className="w-full max-w-sm bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">

        {/* 제목 */}
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 text-center">
          관리자 로그인
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 패스워드 입력 필드 */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5"
            >
              패스워드
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="패스워드 입력"
              autoFocus
              required
              className={cn(
                'w-full rounded-lg border border-zinc-300 dark:border-zinc-600',
                'bg-white dark:bg-zinc-800',
                'text-zinc-900 dark:text-zinc-100',
                'px-3 py-2 text-sm',
                'focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:focus:ring-zinc-400',
                'placeholder-zinc-400 dark:placeholder-zinc-500',
              )}
            />
          </div>

          {/* 에러 메시지 */}
          {errorMessage && (
            <p
              role="alert"
              className="text-red-500 dark:text-red-400 text-sm"
            >
              {errorMessage}
            </p>
          )}

          {/* 제출 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              'w-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900',
              'rounded-lg px-4 py-2.5 text-sm font-semibold',
              'transition-opacity',
              isLoading
                ? 'opacity-60 cursor-not-allowed'
                : 'hover:opacity-80',
            )}
          >
            {/* 로딩 상태에 따라 버튼 텍스트 변경 */}
            {isLoading ? '확인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}
