const services = [
  { title: 'Gate Fabrication', desc: 'Steel & aluminum, powder-coated durability.' },
  { title: 'Automation Systems', desc: 'Operators, safety loops, photo eyes.' },
  { title: 'Access Control', desc: 'Keypads, intercoms, RFID, app control.' },
  { title: 'Repairs & Maintenance', desc: 'All brands serviced. Emergency available.' },
]
export default function Services() {
  return (
    <section id="services" className="section container">
      <h2 className="text-3xl font-semibold text-white">Our Services</h2>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map(s => (
          <div
            key={s.title}
            className="rounded-2xl border border-white/10 bg-brand-dark p-6
                       shadow-sm hover:shadow-lg hover:border-white/20 transition-all"
          >
            <div className="text-white font-medium tracking-tight">{s.title}</div>
            <p className="text-sm text-gray-400 mt-1">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
