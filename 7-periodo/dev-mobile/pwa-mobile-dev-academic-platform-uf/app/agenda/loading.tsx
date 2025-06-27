export default function AgendaLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded bg-white/10 animate-pulse" />
            <div>
              <div className="h-6 w-24 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-48 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
        </div>
      </header>

      <main className="flex-1 px-4 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-8 w-16 bg-white/10 rounded animate-pulse" />
            ))}
          </div>
          <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="flex items-center justify-between">
          <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
          <div className="h-6 w-48 bg-white/10 rounded animate-pulse" />
          <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-20 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-8 w-12 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="flex items-start gap-4">
                <div className="min-w-[60px]">
                  <div className="h-4 w-12 bg-white/10 rounded animate-pulse mb-1" />
                  <div className="h-3 w-8 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="h-5 w-48 bg-white/10 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-white/10 rounded-full animate-pulse" />
                  </div>
                  <div className="h-4 w-full bg-white/10 rounded animate-pulse mb-3" />
                  <div className="flex gap-6">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-3 w-16 bg-white/10 rounded animate-pulse" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
