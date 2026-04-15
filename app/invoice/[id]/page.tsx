// 견적서 상세 페이지 — 서버 컴포넌트
// 데이터 fetch 및 라우팅 처리만 담당; UI는 InvoiceView로 위임
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getInvoice } from '@/lib/notion'
import { InvoiceView } from '@/components/invoice/InvoiceView'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const invoice = await getInvoice(id)
  if (!invoice) return {}
  return {
    title: `견적서 ${invoice.invoice_number}`,
  }
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params
  const invoice = await getInvoice(id)

  if (!invoice) notFound()

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-10 px-4 print:bg-white print:py-0 print:px-0">
      <div className="max-w-2xl mx-auto">
        <InvoiceView invoice={invoice} />
      </div>
    </main>
  )
}
