import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { cn, formatKRW, formatDate } from '@/lib/utils'
import { CopyLinkButton } from './CopyLinkButton'

// 상태별 배지 메타 — InvoiceView.tsx와 동일한 색상 시스템 유지
const STATUS_META: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: '초안',
    className:
      'bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  },
  sent: {
    label: '발송됨',
    className:
      'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  },
  done: {
    label: '완료',
    className:
      'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  },
}

interface InvoiceListTableProps {
  invoices: Invoice[]
}

// 관리자용 견적서 목록 테이블
// 견적서 번호 클릭 시 공개 조회 페이지(/invoice/[id])로 이동 (새 탭)
// 모바일에서는 overflow-x-auto로 가로 스크롤 처리
export function InvoiceListTable({ invoices }: InvoiceListTableProps) {
  // 등록된 견적서가 없는 경우 빈 상태 UI 표시
  if (invoices.length === 0) {
    return (
      <div className="py-16 text-center">
        <FileText
          className="mx-auto mb-3 w-10 h-10 text-zinc-300 dark:text-zinc-600"
          aria-hidden="true"
        />
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          등록된 견적서가 없습니다
        </p>
      </div>
    )
  }

  return (
    // 모바일 가로 스크롤 컨테이너
    <div className="w-full overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-700">
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
            >
              견적서 번호
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
            >
              거래처명
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
            >
              발행일
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
            >
              금액
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
            >
              상태
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
            >
              링크 복사
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            const statusMeta = STATUS_META[invoice.status]
            return (
              <tr
                key={invoice.id}
                className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                {/* 견적서 번호 — 공개 조회 페이지로 새 탭 이동 */}
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100">
                  <Link
                    href={`/invoice/${invoice.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline"
                  >
                    {invoice.invoice_number}
                  </Link>
                </td>

                {/* 거래처명 */}
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                  {invoice.client_name}
                </td>

                {/* 발행일 */}
                <td className="px-4 py-3 text-zinc-900 dark:text-zinc-100 whitespace-nowrap">
                  {formatDate(invoice.issue_date)}
                </td>

                {/* 금액 — tabular-nums으로 숫자 정렬 */}
                <td className="px-4 py-3 text-right text-zinc-900 dark:text-zinc-100 tabular-nums whitespace-nowrap">
                  {formatKRW(invoice.total_amount)}
                </td>

                {/* 상태 배지 — pill 형태, 색상 코딩 */}
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                      statusMeta.className
                    )}
                  >
                    {statusMeta.label}
                  </span>
                </td>

                {/* 링크 복사 버튼 */}
                <td className="px-4 py-3">
                  <CopyLinkButton pageId={invoice.id} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
