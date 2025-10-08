// app/search/page.tsx
type SearchPageProps = { searchParams?: { q?: string } };

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q ?? "";
  return (
    <main className="section">
      <h1 className="text-2xl font-semibold">Search results for “{query}”</h1>
      <p className="text-gray-300 mt-2">
        Feature coming soon — we’re building a searchable gallery of gate installations.
      </p>
    </main>
  );
}
