// app/page.tsx
export const metadata = {
  title: 'Precision Gates & Automation',
  description: 'Site under construction. Get a fast quote today.',
}

export default function Page() {
  return (
    <main className="min-h-[80vh] grid place-items-center px-4 bg-[#0A0A0A] text-white">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Precision Gates & Automation
        </h1>
        <p className="mt-4 text-gray-300">
          Our new website is on the way. In the meantime, we’re open and taking projects.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <a
            href="tel:+17204279585"
            className="rounded-2xl bg-white text-black px-5 py-3 font-medium"
          >
            Call (720) 427-9585
          </a>
          <a
            href="mailto:info@pgagates.com"
            className="rounded-2xl border border-white/20 px-5 py-3 font-medium"
          >
            Email: info@pgagates.com
          </a>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          Licensed & Insured • Clean Installs • Rapid Repairs
        </p>
      </div>
    </main>
  )
}


