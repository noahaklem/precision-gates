// app/components/Testimonials.tsx
export default function Testimonials() {
  const data = [
    { name:'John D., Denver', quote:'Flawless automation install — responsive, clean, professional.' },
    { name:'Samantha K., Highlands Ranch', quote:'Exactly what we wanted for our custom steel gate.' },
    { name:'Ops Manager, Aurora', quote:'Slide gate + access control working perfectly. Great crew.' },
  ];
  return (
    <section className="section container">
      <h2 className="text-3xl font-semibold">What Clients Say</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-6">
        {data.map((t) => (
          <figure key={t.name} className="rounded-2xl border border-white/10 bg-black/30 p-6">
            <blockquote className="text-gray-200">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm text-400">— {t.name}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
