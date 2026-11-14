// Página inicial. A busca real será implementada no módulo search.
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-3xl font-semibold">Caninde</h1>
      <p className="text-slate-600">Encontre empresas de serviços locais na sua cidade.</p>
    </main>
  );
}
