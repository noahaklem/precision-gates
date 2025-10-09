export default function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="container py-10 grid gap-6 md:grid-cols-3 text-sm text-gray-300">
        <div>
          <div className="font-semibold text-white">Precision Gates & Automation</div>
          <p className="mt-2">Secure. Modern. Precision.</p>
        </div>
        <div>
          <div className="font-semibold text-white">Contact</div>
          <p>Denver, CO</p>
          <p>Phone: (720) 903-2925</p>
          <p>Email: info@pgagates.com</p>
        </div>
        <div>
          <div className="font-semibold text-white">Hours</div>
          <p>Mon–Fri: 9am–5pm</p>
          <p>Emergency repairs available</p>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 pb-8">© {new Date().getFullYear()} Precision Gates & Automation</div>
    </footer>
  )
}
