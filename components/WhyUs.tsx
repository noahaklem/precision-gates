// app/components/WhyUs.tsx
export default function WhyUs() {
  const items = [
    'Powder coat and protective options',
    'UL325 compliant safety standards',
    'Professional designs & layouts',
    'Access control: keypad, RFID, Intercom',
    'Preventative maintenance plans',
    'Licensed • Insured • Background-checked',
    'Quality fabrication & installation',
  ];
  return (
    <section className="container">
      <div className="rounded-2xl border border-white/10 bg-black/20 p-8">
        <h2 className="text-3xl font-semibold">Why Choose Precision Gates</h2>
        <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-gray-100">
          {items.map(t => (
            <li key={t} className="flex items-start gap-3">
              <span className="mt-2 inline-block h-5 w-5 rounded-full border border-white/10 grid place-items-center text-xs">✓</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
