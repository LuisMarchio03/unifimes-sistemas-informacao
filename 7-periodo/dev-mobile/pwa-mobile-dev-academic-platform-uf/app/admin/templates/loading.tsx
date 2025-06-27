export default function AdminTemplatesLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <header className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-48 bg-white/10 rounded animate-pulse mb-2" />
            <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-white/10 rounded animate-pulse" />
        </div>
      </header>

      {/* Stats Skeleton */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="grid grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-4 w-24 bg-white/10 rounded animate-pulse mb-2" />
                  <div className="h-8 w-16 bg-white/10 rounded animate-pulse" />
                </div>
                <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-80 bg-white/10 rounded animate-pulse" />
            <div className="h-10 w-40 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="h-10 w-24 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Templates Grid Skeleton */}
      <main className="flex-1 px-6 py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-white/10 bg-white/5 p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-white/10 rounded-lg animate-pulse" />
                  <div>
                    <div className="h-5 w-32 bg-white/10 rounded animate-pulse mb-1" />
                    <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-8 bg-white/10 rounded animate-pulse" />
              </div>
              <div className="h-12 w-full bg-white/5 rounded animate-pulse mb-4" />
              <div className="grid grid-cols-3 gap-4 mb-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="h-4 bg-white/5 rounded animate-pulse" />
                ))}
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
                <div className="h-3 w-24 bg-white/5 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
