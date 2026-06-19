import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="de">
      <body className="min-h-screen flex items-center justify-center bg-[#fdfdfd]">
        <div className="text-center px-6">
          <h1
            className="text-[120px] sm:text-[180px] font-black italic leading-none"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </h1>
          <p className="text-xl text-black/60 mt-4 mb-8">
            Diese Seite wurde nicht gefunden.
          </p>
          <Link
            href="/"
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/80 transition-colors"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </body>
    </html>
  );
}
