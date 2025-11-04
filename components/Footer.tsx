// components/Footer.tsx
export default function Footer() {
  return (
    <footer
      className="relative !bg-brand-black !text-white border-t border-white/10
                 before:content-[''] before:absolute before:inset-0 before:-z-10
                 before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_1px)]
                 before:bg-[length:24px_24px]"
    >
      <div className="container py-12 grid gap-8 md:grid-cols-3 text-sm text-gray-300">
        <div>
          <h3 className="font-semibold text-white">Precision Gates & Automation</h3>
          <p className="mt-2 text-gray-400">Secure. Modern. Precision.</p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Contact</h3>
          <p className="mt-2 text-gray-400">Denver, CO</p>
          <p className="text-gray-400">Phone: (720) 903-2925</p>
          <p className="text-gray-400">Email: info@pgagates.com</p>
        </div>
        <div>
          <h3 className="font-semibold text-white">Hours</h3>
          <p className="mt-2 text-gray-400">Mon–Fri: 9am–5pm</p>
          <p className="text-gray-400">Same Day Service Available</p>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Precision Gates & Automation. All rights reserved.
      </div>
    </footer>
  );
}


