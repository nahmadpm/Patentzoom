import { HomeHeroCard } from "@/components/home-hero-card";

export default function RegisterPage() {
  return (
    <main className="bg-[#f8f9fb] py-16 text-slate-900">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
        <section className="rounded-[32px] bg-[#243551] px-8 py-10 text-white shadow-sm lg:px-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
            PatentZoom Account
          </p>
          <h1 className="mt-5 text-[3rem] font-light leading-none tracking-[-0.05em] text-[#63cbff] sm:text-[3.4rem]">
            Create your account and keep moving
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
            Register once, complete your profile, and keep every PatentZoom
            service inquiry connected to one account. This mirrors the
            account-first conversion flow we validated on the reference site.
          </p>
        </section>

        <section className="flex items-center justify-center rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm lg:p-10">
          <div className="w-full max-w-[480px]">
            <HomeHeroCard
              defaultTab="register"
              helperHref="/login"
              helperLabel="Already have an account? Log in."
            />
          </div>
        </section>
      </div>
    </main>
  );
}
