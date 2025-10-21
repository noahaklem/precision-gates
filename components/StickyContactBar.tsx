// app/components/StickyContactBar.tsx
export default function StickyContactBar() {
  return (
    <div className="fixed bottom-4 inset-x-4 z-40 md:hidden">
      <div className="rounded-2xl bg-white text-black shadow-soft grid grid-cols-2 overflow-hidden">
        <a href="tel:+17209032925" className="px-4 py-3 text-center font-medium border-r border-black/10">Call</a>
        <a href="#contact" className="px-4 py-3 text-center font-medium">Get Quote</a>
      </div>
    </div>
  );
}
