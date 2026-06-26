export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-20 lg:px-10">
      <div className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-300">
          About PatentZoom
        </p>
        <h1 className="font-serif text-5xl tracking-tight text-white">
          Built for startup velocity, not corporate bureaucracy.
        </h1>
        <p className="max-w-3xl text-lg leading-8 text-slate-300">
          This first version of the rebuild positions PatentZoom as a strategic
          IP partner for founders who need clarity, responsiveness, and better
          alignment between legal work and product momentum.
        </p>
      </div>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          "Founder-friendly communication",
          "Roadmap-aligned patent thinking",
          "A cleaner client journey than the current WordPress site",
        ].map((item) => (
          <article
            key={item}
            className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-slate-200"
          >
            {item}
          </article>
        ))}
      </section>
    </main>
  );
}
