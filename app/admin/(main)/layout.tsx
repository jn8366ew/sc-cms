import Link from 'next/link'
import LogoutButton from '@/components/admin/LogoutButton'

export default function AdminMainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* 전체 너비 상단 헤더 */}
      <header className="flex items-center justify-between bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 h-14 shrink-0">
        <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          견적서 관리
        </span>
        <LogoutButton />
      </header>

      <div className="flex flex-1 min-h-0">
        {/* 데스크톱 사이드바 */}
        <aside className="hidden md:flex md:flex-col w-52 shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800">
          <nav className="flex flex-col gap-1 p-3">
            <Link
              href="/admin/dashboard"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              대시보드
            </Link>
            <Link
              href="/admin"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 px-3 py-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              견적서 목록
            </Link>
          </nav>
        </aside>

        {/* 모바일 서브 네비게이션 */}
        <div className="flex md:hidden fixed top-14 left-0 right-0 z-10 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 gap-4">
          <Link
            href="/admin/dashboard"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 py-2 transition-colors"
          >
            대시보드
          </Link>
          <Link
            href="/admin"
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 py-2 transition-colors"
          >
            견적서 목록
          </Link>
        </div>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 min-w-0 pt-10 md:pt-0">
          {children}
        </main>
      </div>
    </div>
  )
}
