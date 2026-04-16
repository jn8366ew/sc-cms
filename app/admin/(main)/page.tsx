import type { Metadata } from 'next'
import { getInvoices } from '@/lib/notion'
import { InvoiceListTable } from '@/components/admin/InvoiceListTable'

export const metadata: Metadata = {
  title: '견적서 목록 | 관리자',
}

export default async function AdminPage() {
  const invoices = await getInvoices()

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">견적서 목록</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Notion에서 관리되는 견적서 목록입니다.
        </p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800">
        <InvoiceListTable invoices={invoices} />
      </div>
    </div>
  )
}
