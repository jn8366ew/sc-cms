'use client'

import { useState } from 'react'

export default function LogoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    try {
      await fetch('/api/admin-logout', { method: 'POST' })
    } finally {
      // 쿠키 삭제 후 첫 요청에 반영되어야 하므로 하드 네비게이션 사용
      window.location.href = '/admin/login'
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs font-medium text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700 rounded px-3 py-1.5 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {loading ? '로그아웃 중...' : '로그아웃'}
    </button>
  )
}
