import Link from "next/link";

export default function NotFound() {
  return (
    <section className="min-h-[50vh] grid place-items-center text-center">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl tracking-tight">Page not found</h1>
        <p className="text-foreground/70">The page you’re looking for doesn’t exist.</p>
        <Link href="/" className="inline-block px-3 py-1.5 rounded-md border border-black/10 hover:bg-black/5">
          Go home
        </Link>
      </div>
    </section>
  );
}

