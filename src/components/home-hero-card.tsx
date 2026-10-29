"use client";

import Link from "next/link";
import { useActionState, useCallback, useEffect, useState } from "react";

import {
  type AuthActionState,
  loginAction,
  registerStarterAction,
  resetPasswordWithTemporaryAction,
} from "@/app/actions/auth";
import { getIntakeHref, type ServiceIntent } from "@/lib/service-intents";

type TabKey = "register" | "login";

const initialState: AuthActionState = {};

function FieldError({
  errors,
  name,
}: {
  errors: AuthActionState["errors"];
  name: string;
}) {
  const message = errors?.[name]?.[0];

  if (!message) {
    return null;
  }

  return <p className="mt-2 text-sm text-red-600">{message}</p>;
}

function StatusMessage({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return <div className="min-h-5" />;
  }

  return <p className="text-sm text-red-600">{message}</p>;
}

export function HomeHeroCard({
  headline,
  description = "Protect your intellectual property rights today.",
  registerSubmitLabel = "GET STARTED",
  loginSubmitLabel = "Log In",
  helperHref = "/patent-search#consultation",
  helperLabel = "Need help choosing a service?",
  contentAlign = "left",
  headlineClassName,
  descriptionClassName,
  serviceIntent = null,
  packageKey = null,
  packageLabel = null,
  defaultTab = "register",
}: {
  headline?: string;
  description?: string;
  registerSubmitLabel?: string;
  loginSubmitLabel?: string;
  helperHref?: string;
  helperLabel?: string;
  contentAlign?: "left" | "center";
  headlineClassName?: string;
  descriptionClassName?: string;
  serviceIntent?: ServiceIntent | null;
  packageKey?: string | null;
  packageLabel?: string | null;
  defaultTab?: TabKey;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>(defaultTab);
  const [sessionState, setSessionState] = useState<{
    authenticated: boolean;
    user?: {
      displayName: string;
      profileComplete: boolean;
      pendingService: ServiceIntent | null;
      pendingServiceLabel: string | null;
      pendingPackageKey: string | null;
      pendingPackageLabel: string | null;
      nextHref: string;
    };
  }>({
    authenticated: false,
  });
  const [currentReturnTo, setCurrentReturnTo] = useState("/");
  const [socialAuthMessage, setSocialAuthMessage] = useState("");
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerStarterAction,
    initialState,
  );
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginAction,
    initialState,
  );
  const [verificationState, verificationAction, verificationPending] = useActionState(
    resetPasswordWithTemporaryAction, initialState,
  );

  const loadSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        cache: "no-store",
      });

      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        authenticated: boolean;
        user?: {
          displayName: string;
          profileComplete: boolean;
          pendingService: ServiceIntent | null;
          pendingServiceLabel: string | null;
          pendingPackageKey: string | null;
          pendingPackageLabel: string | null;
          nextHref: string;
        };
      };

      setSessionState(data);
    } catch {
      setSessionState({ authenticated: false });
    }
  }, []);

  useEffect(() => {
    void loadSession();
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

    const handlePageShow = () => {
      void loadSession();
    };

    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("focus", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("focus", handlePageShow);
    };
  }, [loadSession]);

  const buildSocialAuthHref = (provider: "facebook" | "google") => {
    const params = new URLSearchParams({
      returnTo: currentReturnTo,
    });

    if (serviceIntent) {
      params.set("serviceIntent", serviceIntent);
    }

    if (packageKey) {
      params.set("packageKey", packageKey);
    }

    if (packageLabel) {
      params.set("packageLabel", packageLabel);
    }

    return `/api/auth/oauth/${provider}/start?${params.toString()}`;
  };

  const signedInTargetHref =
    serviceIntent
      ? getIntakeHref(serviceIntent, packageKey)
      : sessionState.user?.nextHref || "/account";

  const signedInButtonLabel =
    serviceIntent && registerSubmitLabel
      ? registerSubmitLabel
      : packageLabel
        ? `Continue ${packageLabel}`
      : sessionState.user?.pendingServiceLabel
        ? `Continue ${sessionState.user.pendingServiceLabel}`
        : "Go To My Account";

  if (sessionState.authenticated) {
    return (
      <div className="hero-form-card overflow-hidden rounded-[2rem] border border-[rgba(231,217,203,0.85)] bg-[rgba(255,253,249,0.92)] text-slate-900 shadow-[0_36px_90px_rgba(36,28,23,0.16)] backdrop-blur-xl">
        <div className="space-y-4 p-6 text-center sm:p-7">
          <p className="text-[1.05rem] leading-8 text-slate-800">
            Protect your intellectual property rights today.
          </p>
          <p className="text-sm leading-7 text-slate-500">
            Signed in as {sessionState.user?.displayName}
          </p>
          <Link
            href={signedInTargetHref}
            className="flex w-full items-center justify-center rounded-[16px] bg-[#fb4522] px-4 py-3.5 text-[1rem] font-semibold text-white shadow-[0_16px_38px_rgba(251,69,34,0.22)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e43b19]"
          >
            {signedInButtonLabel}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="hero-form-card overflow-hidden rounded-[2rem] border border-[rgba(231,217,203,0.85)] bg-[rgba(255,253,249,0.92)] text-slate-900 shadow-[0_36px_90px_rgba(36,28,23,0.16)] backdrop-blur-xl">
      <div className="border-b border-[rgba(231,217,203,0.82)] bg-[rgba(255,250,245,0.86)] px-3 pt-2.5 pb-2.5">
        <div
          className="grid grid-cols-2 gap-2 rounded-[1.25rem] bg-[var(--brand-surface-alt)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.95)]"
          role="tablist"
          aria-label="Hero form mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "register"}
            onClick={() => setActiveTab("register")}
            className={`rounded-[0.95rem] border px-5 py-2.5 text-left text-[1rem] font-semibold tracking-[-0.01em] transition duration-300 ${
              activeTab === "register"
                ? "border-[#fb4522] bg-[#fb4522] text-white shadow-[0_12px_26px_rgba(251,69,34,0.24)]"
                : "border-[rgba(231,217,203,0.9)] bg-white/82 text-slate-600 hover:border-[rgba(251,69,34,0.2)] hover:bg-white hover:text-slate-900"
            }`}
          >
            Register
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "login"}
            onClick={() => setActiveTab("login")}
            className={`rounded-[0.95rem] border px-5 py-2.5 text-left text-[1rem] font-semibold tracking-[-0.01em] transition duration-300 ${
              activeTab === "login"
                ? "border-[#fb4522] bg-[#fb4522] text-white shadow-[0_12px_26px_rgba(251,69,34,0.24)]"
                : "border-[rgba(231,217,203,0.9)] bg-white/82 text-slate-600 hover:border-[rgba(251,69,34,0.2)] hover:bg-white hover:text-slate-900"
            }`}
          >
            Log In
          </button>
        </div>
      </div>

      <div className="space-y-4 p-5 text-slate-900 sm:p-6">
        <div className={contentAlign === "center" ? "space-y-2 text-center" : "space-y-2"}>
          {headline ? (
            <h3
              className={
                headlineClassName ||
                "text-[1.55rem] font-semibold leading-tight tracking-[-0.02em] text-slate-900"
              }
            >
              {headline}
            </h3>
          ) : null}
          {description ? (
            <p
              className={
                descriptionClassName || "text-[15px] leading-7 text-slate-700"
              }
            >
              {description}
            </p>
          ) : null}
        </div>

        {activeTab === "register" && registerState.mode === "verify" ? (
          <form action={verificationAction} className="space-y-3">
            <p className="break-words text-sm text-slate-700" role="status">
              {registerState.delivery === "outbox"
                ? "Email is not configured locally. Your verification code is in the development outbox."
                : `A verification code was sent to ${registerState.email}.`}
            </p>
            <input type="hidden" name="email" value={registerState.email ?? ""} />
            <input type="hidden" name="serviceIntent" value={serviceIntent ?? ""} />
            <input type="hidden" name="packageKey" value={packageKey ?? ""} />
            <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />
            {[
              { name: "temporaryPassword", label: "Email verification code", type: "text", autoComplete: "one-time-code" },
              { name: "newPassword", label: "Create password", type: "password", autoComplete: "new-password" },
              { name: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password" },
            ].map((field) => (
              <label key={field.name} className="block text-sm text-slate-700">
                {field.label}
                <input name={field.name} type={field.type} autoComplete={field.autoComplete} required
                  className="mt-1 w-full rounded-[15px] border border-slate-300 bg-white px-4 py-2.5 text-slate-900" />
                <FieldError errors={verificationState.errors} name={field.name} />
              </label>
            ))}
            <button type="submit" disabled={verificationPending}
              className="w-full rounded-[18px] bg-[#fb4522] px-4 py-3.5 font-semibold text-white disabled:opacity-60">
              {verificationPending ? "Verifying..." : "Verify & Continue"}
            </button>
            <StatusMessage message={verificationState.message} />
            <Link href="/forgot-password" className="text-sm text-slate-600 underline">Request a new code</Link>
          </form>
        ) : activeTab === "register" ? (
          <form action={registerFormAction} className="space-y-3">
            <input type="hidden" name="serviceIntent" value={serviceIntent ?? ""} />
            <input type="hidden" name="packageKey" value={packageKey ?? ""} />
            <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />
            <div>
              <input
                name="name"
                className="w-full rounded-[15px] border border-slate-300/90 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition duration-300 placeholder:text-slate-500 focus:border-[#fb4522] focus:bg-white focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                placeholder="Name"
                autoComplete="name"
              />
              <FieldError errors={registerState.errors} name="name" />
            </div>
            <div>
              <input
                name="email"
                type="email"
                className="w-full rounded-[15px] border border-slate-300/90 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition duration-300 placeholder:text-slate-500 focus:border-[#fb4522] focus:bg-white focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                placeholder="E-mail Address"
                autoComplete="email"
              />
              <FieldError errors={registerState.errors} name="email" />
            </div>
            <div>
              <input
                name="phone"
                className="w-full rounded-[15px] border border-slate-300/90 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition duration-300 placeholder:text-slate-500 focus:border-[#fb4522] focus:bg-white focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                placeholder="Phone Number"
                autoComplete="tel"
              />
              <FieldError errors={registerState.errors} name="phone" />
            </div>
            <button
              type="submit"
              disabled={registerPending}
            className="flex w-full items-center justify-center rounded-[18px] bg-[#fb4522] px-4 py-3.5 text-[1rem] font-semibold text-white shadow-[0_16px_38px_rgba(251,69,34,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e43b19] disabled:cursor-not-allowed disabled:bg-[#fb4522]/60"
          >
              {registerPending ? "Creating account..." : registerSubmitLabel}
            </button>
            <p className="text-xs leading-6 text-slate-500">
              Verify your email and create a password to continue.
            </p>
            <StatusMessage message={registerState.message} />
          </form>
        ) : (
          <form action={loginFormAction} className="space-y-3">
            <input type="hidden" name="serviceIntent" value={serviceIntent ?? ""} />
            <input type="hidden" name="packageKey" value={packageKey ?? ""} />
            <input type="hidden" name="packageLabel" value={packageLabel ?? ""} />
            <div>
              <input
                name="email"
                type="email"
                className="w-full rounded-[15px] border border-slate-300/90 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition duration-300 placeholder:text-slate-500 focus:border-[#fb4522] focus:bg-white focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                placeholder="E-mail Address"
                autoComplete="email"
              />
              <FieldError errors={loginState.errors} name="email" />
            </div>
            <div>
              <input
                name="password"
                type="password"
                className="w-full rounded-[15px] border border-slate-300/90 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition duration-300 placeholder:text-slate-500 focus:border-[#fb4522] focus:bg-white focus:shadow-[0_0_0_4px_rgba(251,69,34,0.10)]"
                placeholder="Password"
                autoComplete="current-password"
              />
              <FieldError errors={loginState.errors} name="password" />
            </div>
            <button
              type="submit"
              disabled={loginPending}
            className="flex w-full items-center justify-center rounded-[18px] bg-[#fb4522] px-4 py-3.5 text-[1rem] font-semibold text-white shadow-[0_16px_38px_rgba(251,69,34,0.2)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e43b19] disabled:cursor-not-allowed disabled:bg-[#fb4522]/60"
          >
              {loginPending ? "Logging in..." : loginSubmitLabel}
            </button>
            <div className="flex items-center justify-between gap-3 text-xs leading-6 text-slate-500">
              <span>Returning users can continue their saved intake flow.</span>
              <Link
                href="/forgot-password"
                className="font-medium text-[#25306b] underline-offset-4 transition hover:text-[#fb4522] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <StatusMessage message={loginState.message} />
          </form>
        )}

        {socialAuthMessage ? (
          <p className="rounded-[14px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-800">
            {socialAuthMessage}
          </p>
        ) : null}

        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href={buildSocialAuthHref("facebook")}
            className="flex items-center justify-center rounded-[14px] border border-[rgba(231,217,203,0.9)] bg-white px-3 py-2 text-[12.5px] font-medium text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(251,69,34,0.28)] hover:text-[#fb4522] hover:shadow-[0_16px_30px_rgba(36,28,23,0.08)]"
          >
            Continue with Facebook
          </Link>
          <Link
            href={buildSocialAuthHref("google")}
            className="flex items-center justify-center rounded-[14px] border border-[rgba(231,217,203,0.9)] bg-white px-3 py-2 text-[12.5px] font-medium text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-[rgba(251,69,34,0.28)] hover:text-[#fb4522] hover:shadow-[0_16px_30px_rgba(36,28,23,0.08)]"
          >
            Continue with Google
          </Link>
        </div>

        {helperLabel ? (
          <Link
            href={helperHref}
            className="inline-flex text-sm font-medium text-slate-600 underline-offset-4 transition hover:text-slate-900 hover:underline"
          >
            {helperLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
