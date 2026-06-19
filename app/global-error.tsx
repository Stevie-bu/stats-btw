"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="de">
      <body className="min-h-screen flex items-center justify-center bg-[#fdfdfd]">
        <div className="text-center px-6">
          <h1 className="text-[120px] sm:text-[180px] font-black italic leading-none">
            500
          </h1>
          <p className="text-xl text-black/60 mt-4 mb-8">
            Ein Fehler ist aufgetreten.
          </p>
          <button
            onClick={reset}
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/80 transition-colors cursor-pointer"
          >
            Erneut versuchen
          </button>
        </div>
      </body>
    </html>
  );
}
