import { formatKRW } from '@/lib/utils'

interface DownloadNotificationPayload {
  invoice_number: string
  client_name: string
  total_amount: number
}

export async function sendDownloadNotification(
  invoice: DownloadNotificationPayload,
  ip: string
): Promise<void> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL
  if (!webhookUrl) return

  const now = new Date()
  // UTC+9 (KST) 수동 보정
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  const timestamp = kst.toISOString().replace('T', ' ').substring(0, 19)

  const payload = {
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '📥 견적서 다운로드' },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*견적서 번호*\n${invoice.invoice_number}` },
          { type: 'mrkdwn', text: `*거래처*\n${invoice.client_name}` },
          { type: 'mrkdwn', text: `*금액*\n${formatKRW(invoice.total_amount)}` },
          { type: 'mrkdwn', text: `*다운로드 시각 (KST)*\n${timestamp}` },
          { type: 'mrkdwn', text: `*IP*\n${ip}` },
        ],
      },
    ],
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 5000)

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
  } catch (err) {
    console.error('[slack] 다운로드 알림 전송 실패:', err)
  } finally {
    clearTimeout(timeout)
  }
}
