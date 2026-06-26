"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { HomeHeroCard } from "@/components/home-hero-card";
import { type ServiceIntent } from "@/lib/service-intents";

export function ServicePackageAuthTrigger({
  buttonLabel,
  buttonClassName,
  serviceIntent,
  packageKey,
  packageLabel,
}: {
  buttonLabel: string;
  buttonClassName: string;
  serviceIntent: ServiceIntent;
  packageKey: string;
  packageLabel: string;
}) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!modalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  function closeModal() {
    setModalOpen(false);
  }

  function handleButtonClick() {
    startTransition(async () => {
      const sessionResponse = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      const session = (await sessionResponse.json()) as {
        authenticated: boolean;
        user?: {
          profileComplete: boolean;
        };
      };

      if (!session.authenticated) {
        setModalOpen(true);
        return;
      }

      const selectionResponse = await fetch("/api/auth/pending-selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          serviceIntent,
          packageKey,
          packageLabel,
        }),
      });

      if (!selectionResponse.ok) {
        setModalOpen(true);
        return;
      }

      const data = (await selectionResponse.json()) as {
        redirectTo: string;
      };
      router.push(data.redirectTo);
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={isPending}
        className={buttonClassName}
      >
        {isPending ? "Opening..." : buttonLabel}
      </button>

      {modalOpen ? (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-[2px]">
          <div className="relative w-full max-w-[520px]">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#7bc214] text-white shadow-[0_18px_30px_rgba(123,194,20,0.32)] transition hover:scale-105"
              aria-label="Close package signup modal"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </svg>
            </button>

            <HomeHeroCard
              serviceIntent={serviceIntent}
              packageKey={packageKey}
              packageLabel={packageLabel}
              headline=""
              description=""
              helperLabel=""
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
