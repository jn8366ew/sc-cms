export default function NotFound() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center px-4 print:bg-white">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm p-10 text-center max-w-md w-full">
        <p className="text-5xl font-extrabold text-zinc-200 dark:text-zinc-700 tracking-tight">404</p>
        <h1 className="mt-3 text-xl font-bold text-zinc-900 dark:text-zinc-50">견적서를 찾을 수 없습니다</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          링크가 잘못되었거나 만료되었을 수 있습니다.
          <br />
          발행자에게 올바른 링크를 요청하세요.
        </p>
      </div>
    </main>
  )
}
