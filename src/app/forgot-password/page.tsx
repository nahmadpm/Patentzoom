"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import {
  requestPasswordResetAction,
  resetPasswordWithTemporaryAction,
  type AuthActionState,
} from "@/app/actions/auth";

const initialRequestState: AuthActionState = {
  mode: "request",
};

const initialResetState: AuthActionState = {
  mode: "reset",
};

function FieldError({
  errors,
  name,
}: {
  errors?: Record<string, string[]>;
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-500">{message}</p>;
}

export default function ForgotPasswordPage() {
  const [requestState, requestAction, requestPending] = useActionState(
    requestPasswordResetAction,
    initialRequestState,
  );
  const [resetState, resetAction, resetPending] = useActionState(
    resetPasswordWithTemporaryAction,
    initialResetState,
  );
  const [emailForReset, setEmailForReset] = useState("");
  const [currentReturnTo, setCurrentReturnTo] = useState("/forgot-password");
  const [socialAuthMessage, setSocialAuthMessage] = useState("");

  useEffect(() => {
    if (requestState.mode === "reset" && requestState.email) {
      setEmailForReset(requestState.email);
    }
  }, [requestState.email, requestState.mode]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authMessage = params.get("authMessage");

    params.delete("authMessage");
    const nextSearch = params.toString();
    setCurrentReturnTo(
      `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ""}`,
    );

    if (authMessage) {
      setSocialAuthMessage(authMessage);
    }
  }, []);

  const showResetStep = Boolean(emailForReset);
  const buildSocialAuthHref = (provider: "facebook" | "google") => {
    const params = new URLSearchParams({
      returnTo: currentReturnTo,
    });

    return `/api/auth/oauth/${provider}/start?${params.toString()}`;
  };

  return (
    <main
      className="relative overflow-hidden bg-[#0d1528] py-16 text-slate-900"
      style={{
        backgroundImage:
          "linear-gradient(rgba(8,14,30,0.72), rgba(8,14,30,0.82)), url('https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=80')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="pt-10 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#fb4522]">
              PatentZoom Account Recovery
            </p>
            <h1 className="mt-5 max-w-2xl text-[3rem] font-light leading-[0.98] tracking-[-0.05em] text-white sm:text-[4rem]">
              Reset your password with a temporary access code
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
              This flow now follows the same pattern you pointed out on Thoughts
              to Paper: request a temporary password by email, then use it to
              set a new password and continue back into your PatentZoom account.
            </p>
          </section>

          <section className="overflow-hidden rounded-[26px] border border-white/30 bg-[rgba(255,255,255,0.92)] shadow-[0_30px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            <div className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-white/70 px-4 pt-3 pb-3">
              <Link
                href="/register"
                className="rounded-[14px] bg-[#7bc214] px-5 py-3 text-left text-[1rem] font-semibold text-white shadow-[0_10px_24px_rgba(123,194,20,0.24)]"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="rounded-[14px] border border-slate-200 bg-white px-5 py-3 text-left text-[1rem] font-semibold text-slate-800"
              >
                Log In
              </Link>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              {!showResetStep ? (
                <form action={requestAction} className="space-y-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="text-[1rem] font-medium text-slate-700"
                    >
                      E-Mail Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      className="mt-2 w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                      placeholder="you@company.com"
                    />
                    <FieldError errors={requestState.errors} name="email" />
                  </div>

                  {requestState.message ? (
                    <div className="rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 text-slate-700">
                      {requestState.message}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={requestPending}
                    className="flex w-full items-center justify-center rounded-[14px] bg-[#fb1208] px-4 py-3.5 text-[1rem] font-semibold text-white transition duration-300 hover:bg-[#e30f06] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {requestPending ? "Sending temporary password..." : "EMAIL ME A TEMPORARY PASSWORD"}
                  </button>
                </form>
              ) : (
                <div className="space-y-5">
                  <form action={resetAction} className="space-y-5">
                    <input type="hidden" name="email" value={emailForReset} />

                    <div>
                      <label
                        htmlFor="reset-email"
                        className="text-[1rem] font-medium text-slate-700"
                      >
                        E-Mail Address
                      </label>
                      <input
                        id="reset-email"
                        value={emailForReset}
                        readOnly
                        className="mt-2 w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="temporaryPassword"
                        className="text-[1rem] font-medium text-slate-700"
                      >
                        Temporary Password
                      </label>
                      <input
                        id="temporaryPassword"
                        name="temporaryPassword"
                        type="password"
                        className="mt-2 w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                      />
                      <FieldError errors={resetState.errors} name="temporaryPassword" />
                    </div>

                    <div>
                      <label
                        htmlFor="newPassword"
                        className="text-[1rem] font-medium text-slate-700"
                      >
                        Set New Password
                      </label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        className="mt-2 w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                      />
                      <FieldError errors={resetState.errors} name="newPassword" />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="text-[1rem] font-medium text-slate-700"
                      >
                        Retype New Password
                      </label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="mt-2 w-full rounded-[14px] border border-slate-300 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-[#fb4522] focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                      />
                      <FieldError errors={resetState.errors} name="confirmPassword" />
                    </div>

                    <div className="text-[15px] leading-8 text-[#ff5a55]">
                      <p>
                        {requestState.message ||
                          "An email has been sent to you with a temporary password. Please check your email and enter the temporary password above."}
                      </p>
                    </div>

                    {resetState.message ? (
                      <div className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-sm leading-7 text-red-700">
                        {resetState.message}
                      </div>
                    ) : null}

                    <button
                      type="submit"
                      disabled={resetPending}
                      className="flex w-full items-center justify-center rounded-[14px] bg-[#fb1208] px-4 py-3.5 text-[1rem] font-semibold text-white transition duration-300 hover:bg-[#e30f06] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {resetPending ? "Updating password..." : "SET PASSWORD & CONTINUE"}
                    </button>
                  </form>

                  <form action={requestAction}>
                    <input type="hidden" name="email" value={emailForReset} />
                    <button
                      type="submit"
                      className="text-[15px] font-semibold text-[#1f4faa] underline underline-offset-4"
                    >
                      Resend email.
                    </button>
                  </form>

                  {requestState.delivery === "outbox" ? (
                    <p className="rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                      SMTP is not configured yet, so local development writes the
                      temporary password email into
                      <code className="mx-1 rounded bg-white px-1.5 py-0.5">
                        .codex-temp/password-reset-outbox.json
                      </code>
                      until production email settings are added.
                    </p>
                  ) : null}
                </div>
              )}

              {socialAuthMessage ? (
                <p className="rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                  {socialAuthMessage}
                </p>
              ) : null}

              <div className="grid gap-2 sm:grid-cols-2">
                <Link
                  href={buildSocialAuthHref("facebook")}
                  className="flex items-center justify-center rounded-[14px] bg-[#1976d2] px-3 py-2.5 text-[12.5px] font-medium text-white transition duration-300 hover:-translate-y-0.5"
                >
                  Continue with Facebook
                </Link>
                <Link
                  href={buildSocialAuthHref("google")}
                  className="flex items-center justify-center rounded-[14px] border border-slate-300 bg-white px-3 py-2.5 text-[12.5px] font-medium text-slate-700 transition duration-300 hover:-translate-y-0.5"
                >
                  Continue with Google
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
