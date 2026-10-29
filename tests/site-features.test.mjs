import assert from "node:assert/strict";
import { test } from "node:test";
import { runtime } from "./test-runtime.mjs";

const selection = { pendingService: "provisional-patent", pendingPackageKey: "provisional-essential", pendingPackageLabel: "Provisional Essential" };
async function starter(rt, email = "qa@example.test") {
  const auth = rt.load("@/lib/auth");
  let code;
  const input = { name: "QA Customer", email, phone: "5550001234", ...selection,
    sendEmail: async (mail) => { code = mail.temporaryPassword; return { delivery: "outbox" }; } };
  assert.equal((await auth.registerStarterUser(input)).ok, true);
  return { auth, input, code };
}

test("signup requires email verification and cannot take over an incomplete account", async () => {
  const rt = runtime();
  const { auth, input, code } = await starter(rt);
  assert.equal(await auth.getCurrentUserContext(), null);
  assert.equal(rt.jar.size, 0);
  assert.equal((await auth.resetPasswordWithTemporary({ email: input.email, temporaryPassword: "WRONG-CODE", newPassword: "Test-password-123" })).ok, false);
  await auth.registerStarterUser({ ...input, name: "Another Person", phone: "0000000000" });
  assert.equal((await auth.listStoredUsers())[0].firstName, "QA");
  assert.equal(rt.jar.size, 0);
  assert.equal((await auth.resetPasswordWithTemporary({ email: input.email, temporaryPassword: code, newPassword: "Test-password-123" })).ok, false);
});

test("valid code sets password, preserves package, rejects replay and old sessions", async () => {
  const rt = runtime();
  const { auth, input, code } = await starter(rt);
  const result = await auth.resetPasswordWithTemporary({ email: input.email, temporaryPassword: code, newPassword: "Test-password-123", ...selection });
  assert.equal(result.ok, true);
  assert.match(result.redirectTo, /intake\/provisional-patent/);
  const context = await auth.getCurrentUserContext();
  assert.equal(context.session.pendingPackageKey, selection.pendingPackageKey);
  const oldCookie = rt.jar.get("patentzoom_session");
  assert.equal((await auth.resetPasswordWithTemporary({ email: input.email, temporaryPassword: code, newPassword: "Other-password-123" })).ok, false);
  let newCode;
  await auth.requestTemporaryPassword({ email: input.email, sendEmail: async (mail) => { newCode = mail.temporaryPassword; return { delivery: "outbox" }; } });
  await auth.resetPasswordWithTemporary({ email: input.email, temporaryPassword: newCode, newPassword: "New-password-123" });
  rt.jar.set("patentzoom_session", oldCookie);
  assert.equal(await auth.getCurrentUserContext(), null);
  assert.equal((await auth.loginUser({ email: input.email, password: "Test-password-123", ...selection })).ok, false);
  assert.equal((await auth.loginUser({ email: input.email, password: "New-password-123", ...selection })).ok, true);
  assert.equal((await auth.updateCurrentUserProfile({ ...context.user, email: "different@example.test" })).ok, false);
  rt.advance(31 * 24 * 60 * 60 * 1000);
  assert.equal(await auth.getSession(), null);
});

test("expired verification codes and repeated email requests are blocked", async () => {
  const rt = runtime();
  const { auth, input, code } = await starter(rt);
  await auth.requestTemporaryPassword(input);
  await auth.requestTemporaryPassword(input);
  assert.equal((await auth.requestTemporaryPassword(input)).ok, false);
  rt.advance(31 * 60 * 1000);
  assert.equal((await auth.resetPasswordWithTemporary({ email: input.email, temporaryPassword: code, newPassword: "Test-password-123" })).ok, false);
});

test("OAuth state is browser-bound, single-use and cannot redirect externally", async () => {
  const rt = runtime();
  const oauth = rt.load("@/lib/oauth");
  const input = { provider: "google", returnTo: "//example.com", serviceIntent: null, packageKey: null, packageLabel: null };
  const value = await oauth.createOAuthState(input);
  assert.equal(await runtime().load("@/lib/oauth").readOAuthState(value, "google"), null);
  assert.equal((await oauth.readOAuthState(value, "google")).returnTo, "/");
  assert.equal(await oauth.readOAuthState(value, "google"), null);
  const expired = await oauth.createOAuthState(input);
  rt.advance(11 * 60 * 1000);
  assert.equal(await oauth.readOAuthState(expired, "google"), null);
  assert.equal(oauth.getOAuthCallbackUrl("google", "http://localhost:3001/login"), "http://localhost:3001/api/auth/oauth/google/callback");
});

test("OAuth success redirect escapes the error handler; unverified Google emails rejected", async () => {
  const rt = runtime({ mocks: {
    "@/lib/oauth": { isOAuthProvider: () => true, readOAuthState: async () => ({ returnTo: "/", ...selection }), exchangeOAuthCode: async () => ({ email: "qa@example.test" }), getOAuthCallbackUrl: () => "", buildOAuthErrorRedirect: () => "/error" },
    "@/lib/auth": { loginOAuthUser: async () => ({ redirectTo: "/account" }) },
  } });
  await assert.rejects(rt.load("@/app/api/auth/oauth/[provider]/callback/route").GET({ nextUrl: new URL("http://localhost/callback?code=test&state=test"), url: "http://localhost/callback" }, { params: Promise.resolve({ provider: "google" }) }), /REDIRECT:\/account/);
  let calls = 0;
  const google = runtime({ env: { GOOGLE_CLIENT_ID: "test", GOOGLE_CLIENT_SECRET: "test" }, fetch: async () => Response.json(++calls === 1 ? { access_token: "test" } : { email: "qa@example.test", email_verified: false }) });
  await assert.rejects(google.load("@/lib/oauth").exchangeOAuthCode({ provider: "google", code: "test", redirectUri: "http://localhost/callback" }), /did not verify/);
});

test("SMTP failure is not reported as delivery; local outbox escapes user HTML", async () => {
  const payload = { email: "qa@example.test", displayName: "<img src=x>", temporaryPassword: "CODE123456" };
  await assert.rejects(runtime({ env: { NODE_ENV: "production" } }).load("@/lib/mailer").sendRegistrationVerificationEmail(payload), /not configured/);
  const rt = runtime();
  assert.equal((await rt.load("@/lib/mailer").sendRegistrationVerificationEmail(payload)).delivery, "outbox");
  const email = JSON.parse([...rt.files.values()][0])[0];
  assert.match(email.html, /&lt;img src=x&gt;/);
  assert.doesNotMatch(email.html, /<img src=x>/);
});

test("renaming and editing packages keeps stable keys and updates checkout amounts", async () => {
  const rt = runtime();
  const store = rt.load("@/lib/admin-content");
  const prices = await store.listPricingRecords();
  const item = prices.find((p) => p.serviceKey === "provisional-patent");
  await store.savePricingRecord({ ...item, packageName: "Renamed package", price: "$412.50" });
  const page = await store.getEditableServicePage(item.serviceKey);
  assert.equal(page.offers.cards[0].packageKey, item.packageKey);
  const summary = rt.load("@/lib/intake-pricing").buildIntakeOrderSummary;
  assert.equal((await summary({ serviceIntent: item.serviceKey, packageKey: item.packageKey, packageLabel: item.packageName, searchOption: "none" })).amountTotalCents, 41250);
  const search = prices.find((p) => p.serviceKey === "patent-search");
  await store.savePricingRecord({ ...search, price: "$455" });
  assert.equal((await summary({ serviceIntent: "patent-search", packageKey: search.packageKey, packageLabel: null, searchOption: "none" })).stripeLineItems[0].unitAmountCents, 45500);
  await store.savePricingRecord({ ...item, active: false });
  assert.equal((await summary({ serviceIntent: item.serviceKey, packageKey: item.packageKey, packageLabel: null, searchOption: "none" })).ok, false);
  assert.equal((await summary({ serviceIntent: "utility-patent", packageKey: "removed-package", packageLabel: null, searchOption: "none" })).ok, false);
});

test("unchecked pricing flags save and invalid article dates/slugs return validation errors", async () => {
  const rt = runtime({ mocks: { "@/lib/admin": { requireAdminSession: async () => ({}) } } });
  const store = rt.load("@/lib/admin-content");
  const actions = rt.load("@/app/actions/content");
  const [price] = await store.listPricingRecords();
  const form = new FormData();
  for (const name of ["serviceKey", "packageKey", "packageName", "price", "fee", "ctaLabel"]) form.set(name, price[name]);
  assert.equal((await actions.savePricingAction({}, form)).message, "Pricing saved.");
  assert.equal((await store.listPricingRecords())[0].active, false);
  const [article] = await store.listArticles();
  const articleForm = new FormData();
  for (const key of ["title", "slug", "category", "excerpt", "imageUrl", "body", "meta", "status", "publishedAt"]) articleForm.set(key, article[key]);
  articleForm.set("id", "");
  articleForm.set("publishedAt", "not a date");
  assert.ok((await actions.saveArticleAction({}, articleForm)).errors.publishedAt);
  articleForm.set("publishedAt", article.publishedAt);
  assert.ok((await actions.saveArticleAction({}, articleForm)).errors.slug);
});

test("manual article edits preserve SEO fields and original article URLs", async () => {
  const rt = runtime();
  const store = rt.load("@/lib/admin-content");
  const [base] = await store.listArticles();
  const saved = await store.saveArticle({ ...base, id: "new-article", slug: "new-article", seoTitle: "SEO title", faqs: [{ question: "Question?", answer: "Answer" }], automationJobId: "job-1" });
  const edited = await store.saveArticle({ id: saved.id, title: "Edited title", slug: saved.slug, category: saved.category, excerpt: saved.excerpt, imageUrl: saved.imageUrl, body: saved.body, meta: saved.meta, status: saved.status, publishedAt: saved.publishedAt });
  assert.equal(edited.seoTitle, "SEO title");
  assert.equal(edited.faqs.length, 1);
  assert.equal(edited.automationJobId, "job-1");
  assert.equal((await store.listPublishedArticles()).length, 4);
  assert.equal((await store.getArticleBySlug(base.slug)).body, base.body);
});

test("late, duplicate and concurrent payment events cannot downgrade a paid checkout", async () => {
  const rt = runtime();
  const { auth, input, code } = await starter(rt);
  await auth.resetPasswordWithTemporary({ email: input.email, temporaryPassword: code, newPassword: "Test-password-123" });
  const user = (await auth.listStoredUsers())[0];
  const path = [...rt.files.keys()].find((key) => key.endsWith("auth-store.json"));
  const data = JSON.parse(rt.files.get(path));
  data.users[0].intakeDrafts = { "provisional-patent": { currentStep: 10, paymentInformation: { stripeCheckoutSessionId: "cs_current", stripeCheckoutStatus: "pending", stripePaymentIntentId: "pi_current" } } };
  rt.files.set(path, JSON.stringify(data));
  const payment = { userId: user.id, serviceIntent: "provisional-patent", stripeCheckoutSessionId: "cs_current", stripeCheckoutStatus: "paid", stripePaymentIntentId: "pi_current", stripePaymentStatus: "paid", stripeCustomerEmail: input.email, stripeCurrency: "usd", stripeAmountSubtotal: 29900, stripeAmountTotal: 29900, paidAt: new Date().toISOString() };
  assert.equal((await auth.markStripeCheckoutStatus({ ...payment, stripeCheckoutSessionId: "cs_old" })).ignored, true);
  await Promise.all([auth.markStripeCheckoutStatus(payment), auth.markStripeCheckoutStatus({ ...payment, stripeCheckoutStatus: "expired" })]);
  await auth.markStripeCheckoutStatus({ ...payment, stripeCheckoutStatus: "failed" });
  assert.equal((await auth.listStoredUsers())[0].intakeDrafts["provisional-patent"].paymentInformation.stripeCheckoutStatus, "paid");
});

test("contact and pending-selection endpoints reject malformed inputs without crashing", async () => {
  const rt = runtime();
  for (const path of ["consultation", "auth/pending-selection"]) {
    const route = rt.load(`@/app/api/${path}/route`);
    const response = await route.POST(new Request(`http://localhost/api/${path}`, { method: "POST", body: "{broken" }));
    assert.equal(response.status, 400);
  }
});

test("admin login, reset and session expiry use the persisted password", async () => {
  const rt = runtime({ env: { PATENTZOOM_ADMIN_EMAIL: "admin@example.test", PATENTZOOM_ADMIN_PASSWORD: "Initial-admin-password" } });
  const admin = rt.load("@/lib/admin");
  assert.equal((await admin.loginAdmin({ email: "admin@example.test", password: "wrong-password" })).ok, false);
  assert.equal((await admin.loginAdmin({ email: "admin@example.test", password: "Initial-admin-password" })).ok, true);
  assert.equal((await admin.getAdminSession()).email, "admin@example.test");
  const old = rt.jar.get("patentzoom_admin_session");
  let token;
  await admin.requestAdminPasswordReset({ email: "admin@example.test", sendEmail: async (mail) => {
    token = new URL(mail.resetUrl).searchParams.get("token"); return { delivery: "outbox" };
  } });
  assert.equal((await admin.resetAdminPasswordWithToken({ token, newPassword: "Updated-admin-password" })).ok, true);
  assert.equal((await admin.resetAdminPasswordWithToken({ token, newPassword: "Another-admin-password" })).ok, false);
  rt.jar.set("patentzoom_admin_session", old);
  assert.equal(await admin.getAdminSession(), null);
  assert.equal((await admin.loginAdmin({ email: "admin@example.test", password: "Initial-admin-password" })).ok, false);
  assert.equal((await admin.loginAdmin({ email: "admin@example.test", password: "Updated-admin-password" })).ok, true);
  rt.advance(13 * 60 * 60 * 1000);
  assert.equal(await admin.getAdminSession(), null);
});

test("Stripe asynchronous success is handled; missing local payment asks Stripe to retry", async () => {
  let saved;
  let ready = true;
  const rt = runtime({ mocks: {
    "next/headers": { headers: async () => new Headers({ "stripe-signature": "test" }) },
    "@/lib/stripe": { getStripeWebhookSecret: () => "test", getStripeClient: () => ({ webhooks: { constructEvent: () => ({ type: "checkout.session.async_payment_succeeded", data: { object: { id: "cs_test", payment_status: "paid", metadata: { userId: "test", serviceIntent: "provisional-patent" } } } }) } }) },
    "@/lib/auth": { markStripeCheckoutStatus: async (input) => { saved = input; return { ok: ready }; } },
  } });
  const route = rt.load("@/app/api/stripe/webhook/route");
  assert.equal((await route.POST(new Request("http://localhost/webhook", { method: "POST", body: "test" }))).status, 200);
  assert.equal(saved.stripeCheckoutStatus, "paid");
  ready = false;
  assert.equal((await route.POST(new Request("http://localhost/webhook", { method: "POST", body: "test" }))).status, 503);
});

test("checkout return requires the owning customer and does not call Stripe anonymously", async () => {
  const rt = runtime({ mocks: {
    "@/lib/auth": { getCurrentUserContext: async () => null },
    "@/lib/stripe": { getAppUrl: () => "http://localhost:3000", getStripeClient: () => { throw new Error("Must not call Stripe"); } },
  } });
  const request = { nextUrl: new URL("http://localhost:3000/api/stripe/checkout/return?session_id=cs_test"), url: "http://localhost:3000/api/stripe/checkout/return?session_id=cs_test" };
  const response = await rt.load("@/app/api/stripe/checkout/return/route").GET(request);
  assert.equal(response.headers.get("location"), "http://localhost:3000/login");
});

test("SEO automation route rejects absent and incorrect secrets before running", async () => {
  const rt = runtime({ env: { CRON_SECRET: "unit-test-secret" }, mocks: {
    "@/lib/seo-automation": { runSeoAutomation: () => { throw new Error("Unauthorized job ran"); } },
  } });
  const route = rt.load("@/app/api/admin/seo-automation/run/route");
  for (const authorization of ["", "Bearer incorrect"]) {
    assert.equal((await route.POST(new Request("http://localhost/run", { method: "POST", headers: { authorization } }))).status, 401);
  }
});

test("upload validation rejects the whole batch before writing any oversized file", async () => {
  const rt = runtime();
  const upload = rt.load("@/lib/intake-uploads").saveIntakeUploads;
  const small = { name: "drawing.pdf", size: 20, type: "application/pdf", arrayBuffer: async () => new ArrayBuffer(20) };
  const result = await upload({ userId: "test-user", serviceIntent: "provisional-patent", files: [small, { ...small, size: 21 * 1024 * 1024 }] });
  assert.equal(result.ok, false);
  assert.equal(rt.files.size, 0);
  assert.equal((await upload({ userId: "test-user", serviceIntent: "provisional-patent", files: [small] })).uploads.length, 1);
});

test("checkout action uses edited prices and blocks payment without prerequisites or after payment", async () => {
  const draft = { currentStep: 10, engagementAgreement: { accepted: true }, searchOption: "none" };
  let checkout;
  let count = 0;
  const context = { session: { userId: "test-user", profileComplete: true }, user: { id: "test-user", email: "qa@example.test", intakeDrafts: { "provisional-patent": draft } } };
  const rt = runtime({ mocks: {
    "@/lib/auth": { getCurrentUserContext: async () => context, savePaymentInformationStep: async () => ({ ok: true }) },
    "@/lib/stripe": { getAppUrl: () => "http://localhost:3000", getStripeCurrency: () => "usd", getStripeClient: () => ({ checkout: { sessions: { create: async (input) => { count++; checkout = input; return { id: "cs_test", url: "https://checkout.stripe.com/test", payment_status: "unpaid" }; } } } }) },
  } });
  const store = rt.load("@/lib/admin-content");
  const item = (await store.listPricingRecords()).find(p => p.serviceKey === "provisional-patent");
  await store.savePricingRecord({ ...item, price: "$412.50" });
  draft.packageKey = item.packageKey;
  const form = new FormData();
  for (const [key, value] of Object.entries({ serviceIntent: item.serviceKey, packageKey: item.packageKey, packageLabel: item.packageName, billingSameAsProfile: "true", billingFirstName: "QA", billingLastName: "Customer", billingAddress1: "123 Test Road", billingAddress2: "", billingCity: "Test City", billingState: "CA", billingZip: "00000", billingCountry: "United States", authorizationSignatureDataUrl: "data:image/png;base64,AAAAAAAAAAAAAAAAAAAAAAA" })) form.set(key, value);
  const action = rt.load("@/app/actions/intake").saveStepTenAction;
  await assert.rejects(action({}, form), /REDIRECT:https:\/\/checkout.stripe.com\/test/);
  assert.equal(checkout.line_items[0].price_data.unit_amount, 41250);
  draft.engagementAgreement.accepted = false;
  assert.match((await action({}, form)).message, /Complete your profile/);
  draft.engagementAgreement.accepted = true;
  draft.paymentInformation = { stripeCheckoutStatus: "paid" };
  await assert.rejects(action({}, form), /REDIRECT:.*step=11/);
  assert.equal(count, 1);
});
