import { renderToBuffer } from '@react-pdf/renderer'
import { getInvoice } from '@/lib/notion'
import { InvoicePDF } from '@/components/pdf/InvoicePDF'
import { checkRateLimit } from '@/lib/ratelimit'
import { sendDownloadNotification } from '@/lib/slack'

export async function POST(request: Request) {
  // Vercel: x-forwarded-for 헤더에 실제 클라이언트 IP가 담김
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? '127.0.0.1'
  const limit = checkRateLimit(ip)

  if (!limit.allowed) {
    const retryAfterSec = Math.ceil((limit.resetAt - Date.now()) / 1000)
    return new Response(JSON.stringify({ error: 'Too Many Requests' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': String(retryAfterSec),
        'X-RateLimit-Limit': '5',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil(limit.resetAt / 1000)),
      },
    })
  }

  const { invoiceId } = await request.json()

  if (!invoiceId || typeof invoiceId !== 'string') {
    return new Response(JSON.stringify({ error: 'invoiceId is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const invoice = await getInvoice(invoiceId)

  if (!invoice) {
    return new Response(JSON.stringify({ error: 'Invoice not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const buffer = await renderToBuffer(<InvoicePDF invoice={invoice} />)

  const filename = `invoice-${invoice.invoice_number}.pdf`

  // fire-and-forget — 알림 실패가 PDF 응답을 차단하지 않음
  void sendDownloadNotification(
    { invoice_number: invoice.invoice_number, client_name: invoice.client_name, total_amount: invoice.total_amount },
    ip
  ).catch(() => {})

  // Node.js Buffer는 Web API Response의 BodyInit에 직접 할당 불가 — Uint8Array로 변환
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
