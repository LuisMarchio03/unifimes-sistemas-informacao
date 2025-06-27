export default function SearchLoading() {
  return (
    <div className="h-screen flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-400">Carregando pesquisa...</p>
      </div>
    </div>
  )
}
