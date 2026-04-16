import { timingSafeEqual } from 'crypto'

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return Response.json({ error: '서버 설정 오류' }, { status: 500 })
  }

  let password: string
  try {
    const body = await request.json()
    password = typeof body?.password === 'string' ? body.password : ''
  } catch {
    return Response.json({ error: '잘못된 요청입니다' }, { status: 400 })
  }

  // timing-safe 비교 — 길이가 다르면 즉시 false (상수 시간 보장 불가)이므로
  // 길이 불일치도 일정 시간 비교처럼 처리하기 위해 동일 길이로 맞춘 뒤 비교
  const a = Buffer.from(password)
  const b = Buffer.from(adminPassword)
  const match =
    a.length === b.length && timingSafeEqual(a, b)

  if (!match) {
    return Response.json({ error: '비밀번호가 올바르지 않습니다' }, { status: 401 })
  }

  const isProduction = process.env.NODE_ENV === 'production'
  const cookieValue = [
    'admin_session=1',
    'HttpOnly',
    isProduction ? 'Secure' : '',
    'SameSite=Strict',
    'Max-Age=86400',
    'Path=/',
  ]
    .filter(Boolean)
    .join('; ')

  return Response.json({ ok: true }, {
    status: 200,
    headers: { 'Set-Cookie': cookieValue },
  })
}
