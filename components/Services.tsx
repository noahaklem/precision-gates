const services = [
  { title: 'Gate Fabrication', desc: 'Steel & aluminum, powder-coated durability.' },
  { title: 'Automation Systems', desc: 'Operators, safety loops, photo eyes.' },
  { title: 'Access Control', desc: 'Keypads, intercoms, RFID, app control.' },
  { title: 'Repairs & Maintenance', desc: 'All brands serviced. Emergency available.' },
]
export default function Services(){
  return (
    <section id="services" className="section">
      <h2 className="text-3xl font-semibold">Our Services</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(s => (
          <div key={s.title} className="rounded-2xl border border-white/10 bg-brand-dark p-6 hover:shadow-soft transition">
            <div className="font-semibold">{s.title}</div>
            <p className="text-sm text-gray-300 mt-2">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
