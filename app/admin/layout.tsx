// /admin 루트 레이아웃 — 사이드바 없이 pass-through
// 실제 관리자 레이아웃(사이드바+헤더)은 app/admin/(main)/layout.tsx 에 있음
// login 페이지는 (main) 그룹 밖이므로 사이드바 없이 렌더링됨
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
