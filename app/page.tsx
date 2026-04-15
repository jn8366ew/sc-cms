import { redirect } from 'next/navigation'

// 루트 경로 접근 시 견적서 목록으로 리다이렉트 (추후 목록 페이지 구현 전까지 not-found 방지)
export default function RootPage() {
  redirect('/invoice')
}
