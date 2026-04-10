import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="relative flex min-h-screen flex-col overflow-hidden">
        <div className="hero-glow absolute inset-0" />

        <main className="relative flex-1">
          <div className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
              <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                <Image
                  src="/logo.png"
                  alt="Shuriken Logo"
                  width={160}
                  height={160}
                  priority
                  className="object-contain"
                />
              </div>

              <h1 className="mt-8 text-5xl font-bold tracking-tight text-primary sm:text-6xl md:text-7xl">
                Shuriken
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                A sharp, production-ready Next.js starter. Minimal auth, Prisma
                database, and a clean, modern UI without bloat.
              </p>

              <div className="mt-10">
                <a
                  href="https://github.com/rishiahuja/shuriken"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center rounded-none border-2 border-primary bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-border/70 py-8">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            Built with Next.js 16, React 19, and TypeScript
          </div>
        </footer>
      </div>
    </div>
  );
}
