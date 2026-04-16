import { NextRequest, NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const session = request.cookies.get('admin_session')
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  // /admin (정확히)과 /admin/* (login 제외)를 모두 검증
  // /admin/login 은 제외 (무한 리다이렉트 방지)
  matcher: ['/admin', '/admin/((?!login).*)'],
}
