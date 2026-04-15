// 견적서 UI 컴포넌트 — 순수 마크업/스타일링만 담당
// 데이터 fetch, 상태 관리, 비즈니스 로직 없음
import { ArrowLeft, Building2, FileText } from 'lucide-react'
import type { Invoice, InvoiceStatus } from '@/types/invoice'
import { cn, formatKRW, formatDate } from '@/lib/utils'
import { PdfDownloadButton } from './PdfDownloadButton'

// ---------------------------------------------------------------------------
// 발행자(우리 회사) 정보 — 실제 배포 시 환경 변수 또는 CMS에서 주입 필요
// ---------------------------------------------------------------------------
const ISSUER = {
  name: '(주)스타트컴퍼니',
  registration: '123-45-67890',
  address: '서울특별시 강남구 테헤란로 123, 4층',
  tel: '02-1234-5678',
  email: 'contact@startcompany.kr',
  manager: '홍길동',
}

// ---------------------------------------------------------------------------
// 상태 배지
// ---------------------------------------------------------------------------
const STATUS_META: Record<InvoiceStatus, { label: string; className: string }> = {
  draft: {
    label: '초안',
    className: 'bg-zinc-100 text-zinc-500 border border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
  },
  sent: {
    label: '발송됨',
    className: 'bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800',
  },
  done: {
    label: '완료',
    className: 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800',
  },
}

interface StatusBadgeProps {
  status: InvoiceStatus
}

function StatusBadge({ status }: StatusBadgeProps) {
  const { label, className } = STATUS_META[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide',
        className,
      )}
    >
      {label}
    </span>
  )
}

// ---------------------------------------------------------------------------
// 구분선
// ---------------------------------------------------------------------------
function Separator() {
  return <hr className="border-0 border-t border-zinc-100 dark:border-zinc-800 my-8 print:my-5" aria-hidden="true" />
}

// ---------------------------------------------------------------------------
// 발행자 정보 블록
// ---------------------------------------------------------------------------
function IssuerBlock() {
  return (
    <address className="not-italic">
      {/* 회사 로고 자리표시자 — TODO: 실제 로고 이미지로 교체 */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className="h-9 w-9 rounded-lg bg-zinc-900 dark:bg-zinc-700 flex items-center justify-center shrink-0"
          aria-hidden="true"
        >
          <Building2 className="h-4.5 w-4.5 text-white dark:text-zinc-200" />
        </div>
        <p className="text-base font-bold text-zinc-900 dark:text-zinc-50 leading-tight">{ISSUER.name}</p>
      </div>
      <p className="text-zinc-400 dark:text-zinc-500 text-xs mb-3 pl-0.5">사업자등록번호 {ISSUER.registration}</p>
      <dl className="space-y-1.5 text-xs pl-0.5">
        <div className="flex gap-3">
          <dt className="text-zinc-400 dark:text-zinc-500 shrink-0 w-14">주소</dt>
          <dd className="text-zinc-600 dark:text-zinc-400">{ISSUER.address}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-zinc-400 dark:text-zinc-500 shrink-0 w-14">전화</dt>
          <dd className="text-zinc-600 dark:text-zinc-400">{ISSUER.tel}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-zinc-400 dark:text-zinc-500 shrink-0 w-14">이메일</dt>
          <dd className="text-zinc-600 dark:text-zinc-400">{ISSUER.email}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="text-zinc-400 dark:text-zinc-500 shrink-0 w-14">담당</dt>
          <dd className="text-zinc-600 dark:text-zinc-400">{ISSUER.manager}</dd>
        </div>
      </dl>
    </address>
  )
}

// ---------------------------------------------------------------------------
// 수신자(클라이언트) 정보 블록
// ---------------------------------------------------------------------------
interface RecipientBlockProps {
  clientName: string
}

function RecipientBlock({ clientName }: RecipientBlockProps) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-2">수신</p>
      <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
        {clientName}
        <span className="text-zinc-400 dark:text-zinc-500 font-normal text-base ml-2">귀중</span>
      </p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 발행 정보 블록 (일자 / 유효기간)
// ---------------------------------------------------------------------------
interface IssueMeta {
  invoiceNumber: string
  issueDate: string
  validUntil: string
}

function IssueMetaBlock({ invoiceNumber, issueDate, validUntil }: IssueMeta) {
  return (
    <dl className="space-y-2.5 text-xs">
      <div className="flex justify-between gap-8 sm:gap-14">
        <dt className="text-zinc-400 dark:text-zinc-500 font-medium shrink-0">견적서 번호</dt>
        <dd className="text-zinc-800 dark:text-zinc-200 font-mono font-semibold tracking-wider">{invoiceNumber}</dd>
      </div>
      <div className="flex justify-between gap-8 sm:gap-14">
        <dt className="text-zinc-400 dark:text-zinc-500 font-medium shrink-0">발행일</dt>
        <dd className="text-zinc-700 dark:text-zinc-300">{formatDate(issueDate)}</dd>
      </div>
      <div className="flex justify-between gap-8 sm:gap-14">
        <dt className="text-zinc-400 dark:text-zinc-500 font-medium shrink-0">유효기간</dt>
        <dd className="text-zinc-700 dark:text-zinc-300">{formatDate(validUntil)}</dd>
      </div>
    </dl>
  )
}

// ---------------------------------------------------------------------------
// 항목 테이블
// 모바일(~sm): 가로 스크롤 대신 카드 리스트로 전환 — 375px 최적화
// 데스크톱(sm~): 전통적인 테이블 레이아웃
// ---------------------------------------------------------------------------
interface ItemsTableProps {
  items: Invoice['items']
  totalAmount: number
}

function ItemsTable({ items, totalAmount }: ItemsTableProps) {
  return (
    <>
      {/* ── 데스크톱 테이블 (sm 이상) ── */}
      <div className="hidden sm:block">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-y border-zinc-100 dark:border-zinc-800">
              <th className="py-3.5 px-5 text-left font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider">
                품목명
              </th>
              <th className="py-3 px-4 text-right font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider w-20">
                수량
              </th>
              <th className="py-3 px-4 text-right font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider w-32">
                단가
              </th>
              <th className="py-3 px-4 text-right font-semibold text-zinc-500 dark:text-zinc-400 text-xs uppercase tracking-wider w-36">
                금액
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr
                key={item.id}
                className={cn(
                  'border-b border-zinc-100 dark:border-zinc-800 align-top',
                  idx % 2 === 1
                    ? 'bg-zinc-50/60 dark:bg-zinc-800/30 print:bg-transparent'
                    : 'bg-white dark:bg-transparent',
                )}
              >
                <td className="py-4 px-5 text-zinc-800 dark:text-zinc-200 font-medium">{item.name}</td>
                <td className="py-4 px-5 text-right text-zinc-600 dark:text-zinc-400 tabular-nums">{item.quantity}</td>
                <td className="py-4 px-5 text-right text-zinc-600 dark:text-zinc-400 tabular-nums">
                  {formatKRW(item.unit_price)}
                </td>
                <td className="py-4 px-5 text-right text-zinc-900 dark:text-zinc-100 font-semibold tabular-nums">
                  {formatKRW(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr aria-hidden="true">
              <td colSpan={4} className="pt-1 pb-0 px-0">
                <div className="border-t-2 border-zinc-900 dark:border-zinc-100" />
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="pt-5 pb-3 px-5">
                <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">* 부가세(VAT 10%) 별도</span>
              </td>
              <td className="pt-5 pb-3 px-5 text-right text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                합계 금액
              </td>
              <td className="pt-5 pb-3 px-5 text-right font-bold text-zinc-900 dark:text-zinc-50 text-xl tabular-nums">
                {formatKRW(totalAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ── 모바일 카드 리스트 (sm 미만, ~375px) ── */}
      <div className="sm:hidden space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/40 p-5 space-y-3.5"
          >
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">{item.name}</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-zinc-400 dark:text-zinc-500 mb-1">수량</p>
                <p className="text-zinc-700 dark:text-zinc-300 tabular-nums font-medium">{item.quantity}</p>
              </div>
              <div>
                <p className="text-zinc-400 dark:text-zinc-500 mb-1">단가</p>
                <p className="text-zinc-700 dark:text-zinc-300 tabular-nums font-medium">{formatKRW(item.unit_price)}</p>
              </div>
              <div>
                <p className="text-zinc-400 dark:text-zinc-500 mb-1">금액</p>
                <p className="text-zinc-900 dark:text-zinc-100 tabular-nums font-bold">{formatKRW(item.amount)}</p>
              </div>
            </div>
          </div>
        ))}
        {/* 모바일 합계 카드 */}
        <div className="rounded-lg border-2 border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-900 px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">합계 금액</p>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">VAT 10% 별도</p>
          </div>
          <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tabular-nums">{formatKRW(totalAmount)}</p>
        </div>
      </div>
    </>
  )
}

// ---------------------------------------------------------------------------
// 비고 영역
// ---------------------------------------------------------------------------
function NotesSection() {
  return (
    <section aria-label="비고" className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="h-3.5 w-3.5 text-zinc-400 dark:text-zinc-500" aria-hidden="true" />
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">비고</h3>
      </div>
      {/* TODO: invoice.notes 필드 추가 시 실제 내용으로 교체 */}
      <div className="rounded-lg border border-dashed border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/20 p-5 min-h-[80px] print:min-h-[48px] flex items-start">
        <p className="text-xs text-zinc-400 dark:text-zinc-600 italic">내용 없음</p>
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// 메인 컴포넌트
// ---------------------------------------------------------------------------
interface InvoiceViewProps {
  invoice: Invoice
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <>
      {/* 액션 바 — 인쇄/PDF 시 숨김 */}
      <div className="print:hidden mb-6 flex items-center justify-between gap-4">
        {/* 뒤로가기 링크 */}
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
          aria-label="목록으로 돌아가기"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
            aria-hidden="true"
          />
          목록
        </a>

        <PdfDownloadButton invoiceId={invoice.id} invoiceNumber={invoice.invoice_number} />
      </div>

      {/* 견적서 문서 본체 */}
      <article
        className={cn(
          'bg-white dark:bg-zinc-900 rounded-2xl',
          'border border-zinc-200 dark:border-zinc-800 shadow-sm',
          'p-8 sm:p-10',
          'print:shadow-none print:border-none print:rounded-none print:p-0',
        )}
        aria-label={`견적서 ${invoice.invoice_number}`}
      >
        {/* ── 문서 헤더 ── */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <IssuerBlock />
          <div className="sm:text-right">
            <div className="flex items-baseline gap-3 sm:justify-end">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">견적서</h1>
              <StatusBadge status={invoice.status} />
            </div>
            <p className="mt-1.5 font-mono text-xs text-zinc-400 dark:text-zinc-500 tracking-wider">
              {invoice.invoice_number}
            </p>
          </div>
        </header>

        <Separator />

        {/* ── 수신자 / 발행 정보 ── */}
        <section
          className={cn(
            'grid grid-cols-1 gap-6 sm:grid-cols-2',
            'rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-700/50 px-6 py-6',
            'print:bg-transparent print:border-zinc-200',
          )}
          aria-label="견적서 기본 정보"
        >
          <RecipientBlock clientName={invoice.client_name} />
          <div className="sm:flex sm:justify-end">
            <IssueMetaBlock
              invoiceNumber={invoice.invoice_number}
              issueDate={invoice.issue_date}
              validUntil={invoice.valid_until}
            />
          </div>
        </section>

        <Separator />

        {/* ── 항목 테이블 ── */}
        <section aria-label="견적 항목">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">견적 항목</h2>
          </div>
          <ItemsTable items={invoice.items} totalAmount={invoice.total_amount} />
        </section>

        {/* ── 비고 ── */}
        <NotesSection />

        {/* ── 문서 푸터 ── */}
        <footer className="mt-12 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center print:mt-6">
          <p className="text-xs text-zinc-400 dark:text-zinc-500 leading-relaxed">
            본 견적서는{' '}
            <span className="text-zinc-600 dark:text-zinc-400 font-medium">{formatDate(invoice.valid_until)}</span>까지 유효합니다.
            {' '}문의사항은{' '}
            <span className="text-zinc-600 dark:text-zinc-400">{ISSUER.email}</span>로 연락 주십시오.
          </p>
        </footer>
      </article>
    </>
  )
}
