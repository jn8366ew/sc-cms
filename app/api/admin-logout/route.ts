export async function POST() {
  // Max-Age=0으로 쿠키를 즉시 만료시켜 삭제
  const cookieValue = [
    'admin_session=',
    'HttpOnly',
    'SameSite=Strict',
    'Max-Age=0',
    'Path=/',
  ].join('; ')

  return Response.json({ ok: true }, {
    status: 200,
    headers: { 'Set-Cookie': cookieValue },
  })
}
