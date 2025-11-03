import Image from "next/image";
import Link from "next/link";

export default function TopBanner() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-b from-white/90 via-white/25 to-transparent backdrop-blur-xsm shadow-sm">
      <div className="container mx-auto flex items-center justify-center py-3">
        <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02]">
          <Image
            src="/logo_pga.png" // or /logo.png (whatever your file is)
            alt="Precision Gates & Automation"
            width={100}
            height={100}
            className="object-contain"
          />
          <span className="font-semibold text-2xl md:text-3xl text-gray-900 tracking-tight leading-none">
            Precision Gates & Automation
          </span>
        </Link>
      </div>
    </header>
  );
}
