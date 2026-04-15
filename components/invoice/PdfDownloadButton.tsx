'use client'

import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PdfDownloadButtonProps {
  invoiceId: string
  invoiceNumber: string
}

export function PdfDownloadButton({ invoiceId, invoiceNumber }: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownload() {
    if (isLoading) return
    setIsLoading(true)

    try {
      const res = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoiceId }),
      })

      if (!res.ok) {
        throw new Error(`PDF 생성 실패: ${res.status}`)
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)

      // 임시 <a> 태그로 다운로드 트리거 — 사용 후 즉시 정리
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = `invoice-${invoiceNumber}.pdf`
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      // revokeObjectURL을 즉시 호출하면 Playwright 등 자동화 도구가
      // blob 데이터를 읽기 전에 URL이 무효화된다 — 100ms 지연으로 회피
      setTimeout(() => URL.revokeObjectURL(url), 100)
    } catch (err) {
      console.error('[PdfDownloadButton]', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isLoading}
      aria-label={isLoading ? 'PDF 생성 중...' : 'PDF 다운로드'}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg px-4 py-2.5',
        'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-semibold',
        'shadow-sm border border-zinc-800 dark:border-zinc-200',
        'transition-opacity',
        isLoading ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-80 cursor-pointer',
      )}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        <Download className="h-4 w-4" aria-hidden="true" />
      )}
      {isLoading ? '생성 중...' : 'PDF 다운로드'}
    </button>
  )
}
