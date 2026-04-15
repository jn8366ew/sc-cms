'use client'

import { useEffect } from 'react'

// Next.js 16.2.0: reset → unstable_retry
export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 text-center max-w-md w-full">
        <p className="text-5xl font-extrabold text-zinc-200 dark:text-zinc-700 tracking-tight">500</p>
        <h1 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">오류가 발생했습니다</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          일시적인 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
        <button
          onClick={() => unstable_retry()}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-zinc-900 dark:bg-zinc-100 px-5 py-2.5 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          다시 시도
        </button>
      </div>
    </main>
  )
}
