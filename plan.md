# PatentZoom Website Rebuild Plan

## Summary

This document is the implementation-ready plan for rebuilding [patentzoom.us](https://patentzoom.us/) from its current WordPress site into a modern marketing website optimized for startup founders, lead generation, SEO continuity, and future maintainability.

The new site will:

- replace WordPress as the primary frontend
- use `Next.js + React + TypeScript + Tailwind CSS`
- use a headless CMS for editable marketing content and blog content
- deploy on `Vercel`
- launch through a `preview/staging -> approval -> production cutover` workflow

The product direction is to keep PatentZoom's startup-focused positioning, borrow the conversion structure of [thoughtstopaper.com](https://www.thoughtstopaper.com/), and redesign the experience into a more premium, modern, and trustworthy brand.

## Goals And Success Criteria

### Primary goals

- Improve trust and conversion for founders, funded startups, and growth-stage technology companies.
- Make the site faster, cleaner, easier to manage, and easier to evolve than the current WordPress setup.
- Preserve SEO value and high-intent service discovery during migration.
- Create a scalable base for future pages, blog growth, and CRM-connected lead flows.

### Success criteria

- The homepage clearly explains PatentZoom's value proposition for funded startups within the first screen and first two sections.
- Lead capture is simplified into a clear primary CTA and a small set of supporting CTAs.
- Every key service has a dedicated landing page with a strong CTA and internal linking.
- Editors can update page content, blog posts, testimonials, and selected trust sections without developer involvement.
- Existing important URLs either remain the same or have tested `301` redirects.
- The launch passes responsive QA on mobile, tablet, and desktop.
- Core analytics, SEO metadata, schema, sitemap, and indexation controls are in place before production cutover.

## Locked Technical Decisions

- Frontend framework: `Next.js`
- UI library: `React`
- Language: `TypeScript`
- Styling: `Tailwind CSS`
- CMS model: `Headless CMS`
- Hosting and preview deployment: `Vercel`
- Launch approach: `Preview/staging first`, then production cutover after approval

### Recommended supporting services

- CMS: `Sanity` as the default recommendation unless a different headless CMS is explicitly selected later
- Form handling: serverless form endpoint in Next.js, forwarding to email and CRM/webhook targets
- Meeting booking: `Calendly`
- Analytics: `Google Analytics 4` and `Google Search Console`
- Error monitoring: `Sentry` recommended for production readiness

## Current-State Findings

### Current PatentZoom site strengths

- Clear positioning around patent protection for funded startups
- Existing service coverage for provisional, non-provisional, PCT, office actions, trademarks, and strategy
- Existing conversion intent through contact, WhatsApp, chat, and meeting booking
- Existing brand recognition and domain authority

### Current PatentZoom site weaknesses

- The experience feels like a legacy WordPress marketing site
- A popup interrupts the first visit and competes with core messaging
- Too many CTAs compete at the same time
- Content hierarchy is uneven and trust proof is not presented in a premium way
- Navigation and service discovery can be clearer

### Reference site strengths to borrow

- Strong conversion-focused homepage structure
- Above-the-fold lead capture
- Clear service navigation
- Trust-building sections such as stats, reviews, and educational content
- Good separation between services, social proof, and knowledge center content

### Reference site elements not to copy

- Outdated visual style
- Generic stock-photo aesthetic
- Dense layout treatment
- Old-fashioned color and interface conventions

## Product Direction

### Keep from the current PatentZoom site

- Funded-startup positioning
- Patent strategy language aimed at investor readiness, defensibility, and roadmap alignment
- Core service lineup
- Existing trust signals that are real and support credibility
- Contact pathways that users already expect, such as phone and WhatsApp

### Borrow from the reference site

- Conversion flow order
- Service-led homepage structure
- Prominent but controlled lead capture
- Trust modules such as reviews, results, and educational content
- Better segmentation of homepage sections

### Redesign from scratch

- Visual identity system
- Layout grid, spacing, and typography
- CTA hierarchy
- Homepage storytelling
- Forms and sticky lead components
- Mobile navigation and responsive behavior
- Footer information architecture

## Design And UX Direction

The new site should feel credible, modern, founder-oriented, and premium. It should communicate that PatentZoom is a strategic IP partner for startups, not a generic filing service.

### Visual direction

- Clean, editorial-style layout with bold spacing and clear hierarchy
- Modern typography with a strong headline font and highly readable body font
- Premium color palette built around confidence, expertise, and startup energy
- Minimal visual clutter
- Limited but meaningful motion for reveals, transitions, and CTA emphasis
- Strong contrast and accessible interactions

### Conversion direction

- Use one primary CTA per section
- Reduce simultaneous CTA overload
- Replace intrusive popup-first behavior with a better integrated consultation flow
- Support the primary CTA with secondary options for call, WhatsApp, and meeting booking
- Use trust proof before asking for a deep commitment

### Homepage strategy

The homepage should move users through this sequence:

1. Clarify the audience and value proposition
2. Explain why startup IP strategy matters
3. Introduce the core services
4. Establish trust with proof and positioning
5. Offer educational and consultation next steps
6. Close with a clear contact path

## Information Architecture

### Core pages

- Homepage
- Provisional Patent
- Utility Patent
- Design Patent
- Trademark
- PCT / International Filings if retained after content review
- Office Action Responses if retained as a dedicated page
- IP Portfolio Strategy if retained as a dedicated page
- About
- Contact
- Testimonials / Results
- Blog / Knowledge Center
- Privacy Policy
- Terms if legally required

### Optional pages for phase 2

- Obtained Patents / Case Highlights
- Startup IP Roadmap landing page
- Resource download landing pages
- Industry-specific landing pages such as SaaS, AI, MedTech, or Hardware

### Navigation model

- Top navigation with service categories, About, Blog/Knowledge Center, and Contact
- Sticky primary CTA in header
- Mobile menu with fast access to services and consultation actions
- Footer with company info, service links, trust links, and policy pages

## Homepage Content Model

### Required sections

- Hero with core positioning and primary CTA
- Short founder pain-point or investor-pressure section
- Core services overview
- Why PatentZoom section
- Social proof section
- Process or working model section
- Educational content / resource section
- Contact / consultation CTA section

### Recommended hero content

- Headline focused on patent protection for funded startups
- Supporting copy about defensibility, diligence readiness, and startup speed
- Primary CTA: book or request consultation
- Secondary CTA: explore services
- Optional trust strip: startup-focused messaging, responsiveness, or results proof

### Lead capture behavior

- Inline consultation form on homepage, not an automatic blocking popup
- Sticky CTA on mobile and desktop for booking or consultation
- Persistent support actions for phone and WhatsApp
- Meeting booking integrated through a clear scheduling flow

## Service Page Strategy

Each service page should include:

- clear audience and service definition
- explanation of what the service covers
- why it matters for startups
- expected process or deliverables
- trust proof or FAQ
- strong CTA to consult or book a meeting

### Service pages to build in phase 1

- Provisional Patent
- Utility Patent
- Design Patent
- Trademark
- Contact
- About
- Blog / Knowledge Center

### Service pages pending retention review

- PCT / International Filings
- Office Action Responses
- IP Portfolio Strategy

If these topics drive current traffic or lead quality, retain them as dedicated pages. Otherwise they can be grouped under services and expanded later.

## CMS And Editable Content Interfaces

The CMS should allow non-developers to edit high-value marketing content without touching code.

### CMS collections / document types

- Site settings
- Navigation
- Homepage
- Service pages
- Blog posts
- Categories / tags
- Testimonials / reviews
- Trust statistics or results blocks
- CTA settings
- Footer content
- SEO fields per page

### Editable fields expected

- Headlines and subheadings
- Rich text sections
- CTA labels and destinations
- Service summaries
- FAQ content
- Testimonials and attribution
- Blog metadata and featured images
- SEO title, description, canonical, open graph image

## Integrations

### Required integrations

- Headless CMS for content management
- Form delivery to business email inbox
- CRM-ready webhook or API destination for captured leads
- Calendly for meeting booking
- Google Analytics 4
- Google Search Console

### Recommended integrations

- Sentry for runtime monitoring
- Meta Pixel only if actively used for advertising
- ReCAPTCHA or bot protection on lead forms if spam volume requires it

## Confirmed Account And Intake Pattern

The reference-site verification established that the conversion flow is not just a simple lead form. It is an account-first service intake model.

### Confirmed reference behavior

- One shared `Register / Log In` form appears across homepage and service pages.
- Service pages pass a hidden service identifier so the system already knows what the user is trying to start.
- New users are brought into an account/profile completion flow immediately after registration.
- Returning users log in and continue where they left off.
- Service work continues inside a multi-step intake wizard, not a one-screen checkout.
- Payment happens near the end of the workflow, after service details and engagement steps.

### PatentZoom implementation decision

PatentZoom should adopt the same business flow while improving the UX and code quality:

1. Shared account-entry form across homepage and service pages
2. Account/profile completion area
3. Service-aware intake wizard
4. Package selection and order summary
5. Engagement agreement
6. Payment step
7. Completion / confirmation state

## Client Account And Intake Architecture

### Core routes to support

- `/register`
- `/login`
- `/forgot-password`
- `/account`
- `/intake/[service]`
- `/intake/[service]/complete`

### Shared auth entry behavior

- Homepage and service-page hero cards use one shared `Register / Log In` component.
- Register captures starter information first: name, email, and phone.
- Login captures email and password.
- If the user began from a service page, the selected service is stored and carried forward.
- After auth:
  - go to `/account` if profile completion is still required
  - go directly to `/intake/[service]` when the account is already complete and a service is pending

### Account area responsibilities

- Store and edit contact details
- Capture address and preferred contact timing
- Set or update password
- Show pending service intent
- Resume the next intake step

### Intake responsibilities

- Remember which service the user selected
- Persist multi-step progress
- Separate account/profile data from case-specific intake data
- Support later rollout of provisional, utility, design, patent-search, and other services on the same wizard foundation

## Phase 1 Build Scope

Phase 1 is now defined more concretely than the original foundation phase. It is the first live implementation of the account-to-intake pattern.

### Phase 1 deliverables

- Shared `Register / Log In` scaffold across homepage and service pages
- Session handling for authenticated users
- Dedicated `/login`, `/register`, and `/forgot-password` pages
- `/account` page for profile completion
- Service-aware redirect logic after registration or login
- Placeholder `/intake/[service]` route proving the account-to-service handoff

### Phase 1 technical notes

- The first implementation may use a temporary local persistence layer while the final database and production auth provider are still pending.
- The flow should still be built to resemble the final architecture so the temporary persistence layer can later be replaced without rewriting the UI.
- Final production hardening should use a proper auth provider, durable database, email delivery, and reset-token flow.

### Form routing behavior

- All core lead forms submit to a central server-side handler
- The handler validates fields, forwards the lead to email, and forwards structured payloads to a CRM/webhook destination
- Failed downstream delivery should log the error and show the user a graceful fallback response

## SEO And Migration Requirements

### Migration goals

- Preserve existing search equity
- Minimize traffic loss during cutover
- Maintain discoverability for service-intent queries

### Required SEO tasks

- Audit all current public URLs
- Decide which URLs stay unchanged
- Map changed URLs to new destinations
- Implement tested `301` redirects
- Preserve or improve page metadata
- Generate XML sitemap
- Add robots controls appropriate for preview and production
- Add structured data where useful, including organization and article schema
- Preserve blog content quality and topical relevance

### Current URL groups to review

- homepage
- service pages
- blog
- about
- testimonials
- obtained patents
- contact
- privacy-related pages

### Preview and launch SEO rules

- Preview deployments must be blocked from indexing
- Production must use the canonical production domain
- Redirects must be verified before DNS or domain cutover is finalized

## Performance, Accessibility, And Quality

### Performance expectations

- Fast first load on mobile and desktop
- Optimized images and modern image delivery
- Minimal client-side JavaScript for basic content pages
- Good Core Web Vitals baseline

### Accessibility expectations

- Semantic headings and landmarks
- Keyboard-accessible menus and forms
- Color contrast that meets accessibility standards
- Form labels, validation messages, and focus states

### Responsive expectations

- Mobile-first layouts
- Tablet-specific spacing checks
- Stable sticky CTA behavior across breakpoints
- No conversion-blocking layout shifts

## Delivery Plan

### Phase 1: Foundation

- Set up `Next.js`, `TypeScript`, `Tailwind CSS`, and deployment pipeline
- Establish design tokens, typography, spacing, and layout system
- Configure CMS and base content models
- Set up preview deployment on Vercel

### Phase 2: Core marketing build

- Build homepage
- Build primary service pages
- Build About, Contact, and Blog/Knowledge Center
- Build shared CTA and lead capture components

### Phase 3: Content migration

- Migrate approved copy from the current site
- Refine copy for the new structure
- Enter trust content, testimonials, FAQs, and resources
- Migrate or rewrite key blog content as needed

### Phase 4: Integrations and SEO

- Connect forms to email and CRM/webhook flow
- Integrate Calendly
- Add analytics and search console requirements
- Implement metadata, schema, sitemap, and redirects

### Phase 5: QA and launch

- Test content, forms, layouts, analytics, redirects, and SEO behavior
- Review the preview deployment with stakeholders
- Approve cutover plan
- Deploy production version and monitor post-launch

## Acceptance Criteria

The project is ready for launch when:

- `plan.md` is sufficient for another engineer to implement the full rebuild
- the tech stack and deployment model are unambiguous
- the homepage and service page priorities are clearly defined
- editable content boundaries are defined
- required integrations are identified
- SEO migration requirements are explicit
- preview-first launch workflow is documented
- nothing important depends on WordPress remaining as the live frontend

## Test Cases And Validation Scenarios

### Planning-document validation

- Confirm the document includes project goals and success criteria
- Confirm stack, CMS approach, hosting, and launch flow are explicit
- Confirm homepage priorities and service-page expectations are explicit
- Confirm content management expectations are defined
- Confirm integrations are named
- Confirm SEO migration steps are included
- Confirm keep / borrow / redesign boundaries are clearly separated

### Build-phase validation targets

- Homepage loads with a clear value proposition and functioning primary CTA
- Service pages are indexable and internally linked
- Forms submit successfully and handle errors gracefully
- Calendly flow opens correctly
- Analytics tracking fires in production only
- Preview environment is not indexable
- Redirects resolve to intended destinations
- Mobile navigation and sticky CTA behave correctly

## Assumptions

- The root project file `C:\Users\New\Desktop\Patentzoom Website\plan.md` is the intended destination for this planning document.
- The new site replaces WordPress as the primary frontend instead of redesigning within WordPress.
- PatentZoom wants a full migration plan, not only a homepage redesign plan.
- The initial launch should follow a preview-first workflow, not direct production deployment.
- `Sanity` is the default CMS recommendation unless a different headless CMS is later chosen.
