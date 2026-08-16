export default function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-200 bg-white px-4 py-6 text-center text-xs text-neutral-500">
      <p className="font-medium text-neutral-700">My BedSpace</p>
      <p className="mt-1">
        Support:{" "}
        <a href="mailto:support@mybedspace.com.ng" className="text-brand-600 underline">
          support@mybedspace.com.ng
        </a>
      </p>
      <p className="mt-1">
        <a href="tel:+2340000000000" className="text-brand-600 underline">
          +234 000 000 0000
        </a>
      </p>
      <div className="mt-2 flex justify-center gap-4">
        <a href="https://instagram.com/mybedspace" target="_blank" className="text-brand-600">
          Instagram
        </a>
        <a href="https://twitter.com/mybedspace" target="_blank" className="text-brand-600">
          Twitter/X
        </a>
        <a href="https://wa.me/2340000000000" target="_blank" className="text-brand-600">
          WhatsApp
        </a>
      </div>
      <p className="mt-3 text-neutral-400">© {new Date().getFullYear()} My BedSpace</p>
    </footer>
  );
}
