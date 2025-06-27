export default function ProjectWizardLoading() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Skeleton */}
      <header className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-4 h-6 w-6 animate-pulse rounded bg-white/10" />
            <div>
              <div className="h-6 w-48 animate-pulse rounded bg-white/10" />
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar Skeleton */}
      <div className="border-b border-white/10 px-4 py-4">
        <div className="flex items-center justify-between">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
                <div className="mt-2 text-center">
                  <div className="h-3 w-16 animate-pulse rounded bg-white/10" />
                  <div className="mt-1 h-3 w-20 animate-pulse rounded bg-white/10" />
                </div>
              </div>
              {index < 5 && <div className="mx-2 h-4 w-4 animate-pulse rounded bg-white/10" />}
            </div>
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="text-center">
            <div className="mx-auto h-8 w-64 animate-pulse rounded bg-white/10" />
            <div className="mx-auto mt-2 h-4 w-96 animate-pulse rounded bg-white/10" />
          </div>

          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-lg bg-white/5" />
            ))}
          </div>
        </div>
      </main>

      {/* Footer Skeleton */}
      <footer className="border-t border-white/10 px-4 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div className="h-10 w-24 animate-pulse rounded bg-white/10" />
          <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
          <div className="h-10 w-24 animate-pulse rounded bg-white/10" />
        </div>
      </footer>
    </div>
  )
}
