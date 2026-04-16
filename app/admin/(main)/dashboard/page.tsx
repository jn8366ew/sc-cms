import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, Building2, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: '대시보드 | 관리자',
}

// 프로토타입 — 실제 데이터 연동 없이 UI 구조만 구현
export default function AdminDashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">대시보드</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          견적서 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* 요약 카드 */}
      <section>
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
          견적서 현황
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="전체 견적서" value="—" icon={<FileText className="w-5 h-5" />} />
          <StatCard label="이번 달 발행" value="—" icon={<FileText className="w-5 h-5" />} />
          <StatCard label="미결 견적서" value="—" icon={<FileText className="w-5 h-5" />} />
        </div>
      </section>

      {/* 거래처 관리 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            거래처 관리
          </h2>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
            준비 중
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center gap-3 text-center">
          <Building2 className="w-8 h-8 text-zinc-300 dark:text-zinc-600" />
          <p className="text-sm text-zinc-400 dark:text-zinc-500">
            거래처 관리 기능은 추후 지원 예정입니다.
          </p>
        </div>
      </section>

      {/* 최근 활동 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
            최근 활동
          </h2>
          <Link
            href="/admin"
            className="text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            전체 보기 →
          </Link>
        </div>
        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-800">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <Activity className="w-4 h-4 text-zinc-300 dark:text-zinc-600 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-48 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-2.5 w-24 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            </div>
          ))}
          <div className="px-4 py-3 text-center text-xs text-zinc-400 dark:text-zinc-500">
            최근 활동 내역은 추후 지원 예정입니다.
          </div>
        </div>
      </section>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4">
      <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400">
        {icon}
      </div>
      <div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{label}</p>
        <p className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{value}</p>
      </div>
    </div>
  )
}
