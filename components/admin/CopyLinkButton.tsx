'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

interface CopyLinkButtonProps {
  pageId: string
}

// 견적서 클라이언트 공유 URL을 클립보드에 복사하는 버튼
// 복사 성공 시 2초간 "복사됨" 상태로 전환 후 원복
export function CopyLinkButton({ pageId }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/invoice/${pageId}`

  async function handleCopy() {
    try {
      // 모던 브라우저: Clipboard API (HTTPS 환경 필수)
      await navigator.clipboard.writeText(url)
      setCopied(true)
    } catch {
      // 구형 브라우저 fallback: execCommand 방식
      const textarea = document.createElement('textarea')
      textarea.value = url
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
    }

    // 2초 후 원복
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? '링크가 복사되었습니다' : '견적서 링크 복사'}
      className={[
        'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium border transition-colors',
        copied
          ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
          : 'border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800',
      ].join(' ')}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5" />
          복사됨
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          링크 복사
        </>
      )}
    </button>
  )
}
