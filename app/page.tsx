import Link from 'next/link'
import { FileText, Link2, ArrowRight } from 'lucide-react'

// 홈 랜딩 페이지 — 서비스 소개 및 클라이언트/관리자 진입점 안내
export default function RootPage() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg space-y-8">

        {/* 서비스 소개 섹션 */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 mb-2">
            <FileText className="w-7 h-7 text-white dark:text-zinc-900" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            견적서 관리
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Notion 기반 견적서 발행 및 공유 시스템입니다.
            <br />
            클라이언트에게 링크를 전달하면 즉시 조회하고 PDF로 다운로드할 수 있습니다.
          </p>
        </div>

        {/* 클라이언트 안내 카드 */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-zinc-400 dark:text-zinc-500 shrink-0" />
            <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              견적서 링크를 받으셨나요?
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            담당자에게 받은 링크를 브라우저 주소창에 붙여넣거나,
            전달받은 링크를 직접 클릭해 견적서를 확인하세요.
          </p>
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            링크 형식 예시: <span className="font-mono">https://your-domain.com/invoice/…</span>
          </p>
        </div>

        {/* 관리자 진입 버튼 */}
        <div className="flex justify-center">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg px-5 py-2.5 text-sm font-semibold hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            관리자 페이지
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </main>
  )
}
