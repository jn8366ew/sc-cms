// 조건부 클래스 조합 유틸리티
// clsx/tailwind-merge 없이 동작하는 단순 버전.
// 추후 패키지 설치 시 내부 구현만 교체하면 된다.
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

// 금액 포맷: ₩1,234,567
export function formatKRW(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`
}

// ISO 8601 날짜 → 한국 표기 (예: 2025-04-13 → 2025년 04월 13일)
export function formatDate(iso: string): string {
  if (!iso) return '-'
  const [year, month, day] = iso.split('-')
  return `${year}년 ${month}월 ${day}일`
}
