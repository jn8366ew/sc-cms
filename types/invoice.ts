// Notion Status 속성 값 → 도메인 상태 매핑
// Notion: "Not started" | "In progress" | "Done"
export type InvoiceStatus = 'draft' | 'sent' | 'done'

export type InvoiceItem = {
  id: string
  name: string        // 항목명
  unit_price: number  // 단가
  quantity: number    // 수량
  amount: number      // 금액 (= 단가 × 수량)
}

export type Invoice = {
  id: string
  invoice_number: string  // 견적서 번호
  client_name: string     // 거래처명
  issue_date: string      // 발행일 (ISO 8601)
  valid_until: string     // 유효기간 (ISO 8601)
  status: InvoiceStatus
  total_amount: number    // 총금액
  items: InvoiceItem[]
}

export const STATUS_MAP: Record<string, InvoiceStatus> = {
  'Not started': 'draft',
  'In progress': 'sent',
  Done: 'done',
}
