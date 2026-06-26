export const contactDetails = {
  phoneDisplay: "(408) 915-5544",
  phoneHref: "tel:4089155544",
  whatsappHref: "https://wa.me/14089155544",
  email: "mail@patentzoom.us",
  emailHref: "mailto:mail@patentzoom.us",
  address: "589 S 22nd Street, San Jose, CA 95116",
  hours: "Mon-Fri, 7:30 AM to 4:00 PM PT",
};

export const navigationLinks = [
  { href: "/provisional-patent", label: "Provisional Patent" },
  { href: "/utility-patent", label: "Utility Patent" },
  { href: "/design-patent", label: "Design Patent" },
  { href: "/patent-search", label: "Patent Search" },
  { href: "/knowledge-center", label: "Knowledge Center" },
];

export const homepageServiceMenu = [
  {
    title: "Patent Applications",
    links: [
      { href: "/provisional-patent", label: "Provisional Patent" },
      { href: "/utility-patent", label: "Utility Patent" },
      { href: "/design-patent", label: "Design Patent" },
      { href: "/pct-international", label: "PCT International Patent" },
    ],
  },
  {
    title: "Additional Services",
    links: [
      { href: "/patent-search", label: "Patent Search" },
      { href: "/patent-search", label: "Patent Valuation" },
      { href: "/office-action-responses", label: "Office Action Responses" },
      { href: "/trademark", label: "Trademark" },
      { href: "/ip-portfolio-strategy", label: "IP Portfolio Strategy" },
      { href: "/patent-search", label: "Book Strategic Session" },
    ],
  },
];

export const servicePages = {
  "provisional-patent": {
    title: "Provisional Patent Applications",
    eyebrow: "Structured to preserve priority while supporting roadmap expansion",
    summary:
      "Secure an early filing date before launches, demos, investor meetings, or product exposure while keeping enough technical depth to support the next filing step.",
    bullets: [
      "Document the invention clearly before public disclosure affects patentability.",
      "Support patent pending status while the product continues to evolve.",
      "Create a stronger handoff into a later non-provisional utility filing.",
      "Best fit for founders moving quickly and needing protection before market conversations expand.",
    ],
  },
  "utility-patent": {
    title: "Utility Patent Applications",
    eyebrow: "Claims engineered for defensibility, not just approval",
    summary:
      "Transform a startup invention into a non-provisional filing with stronger claims, clearer technical framing, and better alignment with diligence and long-term protection goals.",
    bullets: [
      "Protect how the invention works, how its components interact, and where the core novelty sits.",
      "Translate complex technical features into a filing strategy investors and acquirers can understand.",
      "Develop a better foundation for prosecution, office actions, and future portfolio growth.",
      "Built for startups that need stronger claims around real product differentiation.",
    ],
  },
  "design-patent": {
    title: "Design Patent Applications",
    eyebrow: "Protect the visible design language of the product",
    summary:
      "Secure protection for the shape, look, and visual identity of a product when design itself carries brand value, recognizability, or competitive advantage.",
    bullets: [
      "Protect the exterior design and visible form of the product.",
      "Strengthen visual product defensibility in consumer, hardware, and branded device categories.",
      "Pair well with utility strategy when both function and appearance matter.",
      "Useful when launches or manufacturing timelines make fast visual protection important.",
    ],
  },
  trademark: {
    title: "Trademark Protection",
    eyebrow: "Brand security alongside technology protection",
    summary:
      "Protect the names, marks, and brand identifiers your startup is building as awareness, traction, and market exposure increase.",
    bullets: [
      "Reduce avoidable naming conflicts before growth accelerates.",
      "Protect customer-facing brand assets before awareness compounds.",
      "Support cleaner expansion, fundraising, and category positioning.",
      "A strong complement to patent work when both the technology and the brand matter.",
    ],
  },
  "pct-international": {
    title: "PCT & International Filings",
    eyebrow: "Global protection aligned with expansion strategy",
    summary:
      "Use a PCT-centered approach to preserve international options while the startup evaluates where future commercial protection is actually worth the investment.",
    bullets: [
      "Keep international filing pathways open while the company grows into target markets.",
      "Coordinate timing around commercial expansion, investor goals, and jurisdiction priorities.",
      "Avoid rushing into expensive country decisions before strategy is ready.",
      "Useful for startups planning global growth or cross-border fundraising conversations.",
    ],
  },
  "office-action-responses": {
    title: "Office Action Responses",
    eyebrow: "Strategic responses protecting claim strength and scope",
    summary:
      "Respond to examiner objections with a strategy that protects the real value of the claims instead of treating prosecution as a mechanical checkbox exercise.",
    bullets: [
      "Address rejections with stronger technical and strategic positioning.",
      "Protect claim scope wherever possible while still advancing prosecution.",
      "Reduce reactive responses that weaken long-term defensibility.",
      "Especially important when startup valuation or roadmap plans depend on claim quality.",
    ],
  },
  "ip-portfolio-strategy": {
    title: "IP Portfolio Strategy",
    eyebrow: "Long-term roadmap planning aligned with valuation milestones",
    summary:
      "Build a portfolio roadmap that connects patents to fundraising, product sequencing, competitive pressure, and long-term exit potential.",
    bullets: [
      "Map what to file, when to file, and what can wait.",
      "Align patent timing with launches, diligence, and product releases.",
      "Build a defensibility story investors can understand quickly.",
      "Turn individual filings into a portfolio strategy instead of disconnected legal tasks.",
    ],
  },
} as const;

export type ServicePageKey = keyof typeof servicePages;

export type ReferenceServicePageData = {
  hero: {
    title: string;
    summary: string;
    image: string;
    formHeadline: string;
    formDescription: string;
    formSubmitLabel: string;
    registerSubmissionMessage: string;
  };
  process: {
    title: string;
    steps: readonly {
      title: string;
      description: string;
      imageSrc?: string;
      imageAlt?: string;
    }[];
  };
  offers: {
    title: string;
    footnote: string;
    showcaseImages?: readonly {
      src: string;
      alt: string;
    }[];
    cards: readonly {
      name: string;
      badge?: string;
      imageSrc?: string;
      imageAlt?: string;
      price: string;
      fee: string;
      ctaLabel: string;
      bullets: readonly string[];
      featured?: boolean;
      comparison?: readonly ("included" | "excluded")[];
    }[];
  };
  includes: {
    title: string;
    items: readonly {
      title: string;
      description: string;
      iconSrc?: string;
      iconAlt?: string;
    }[];
  };
  trustStrip: {
    title: string;
    items: readonly string[];
  };
  reviews: {
    title: string;
    description: string;
    quotes: readonly string[];
  };
  proof: {
    stat: string;
    title: string;
    description: string;
    bullets: readonly string[];
    ctaLabel: string;
    ctaHref: string;
  };
  searchPrompt: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  resources: {
    title: string;
    description: string;
    ctaLabel: string;
    ctaHref: string;
  };
  comparisonSection?: {
    title: string;
    leftLabel: string;
    rightLabel: string;
    rows: readonly {
      left: string;
      right: string;
    }[];
  };
  finalCta: {
    title: string;
    description: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
};

export const referenceServicePages: Record<
  | "provisional-patent"
  | "utility-patent"
  | "design-patent"
  | "trademark"
  | "pct-international"
  | "office-action-responses"
  | "ip-portfolio-strategy",
  ReferenceServicePageData
> = {
  "provisional-patent": {
    hero: {
      title: "Provisional Patent Application",
      summary:
        '"Patent Pending" status for 12 months. Consultation with a patent attorney or agent. Fixed fees.',
      image:
        "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600&q=80",
      formHeadline: 'Get "Patent Pending" Status!.',
      formDescription: "",
      formSubmitLabel: "START PROVISIONAL PATENT APPLICATION",
      registerSubmissionMessage:
        "Provisional patent application pilot page submission",
    },
    process: {
      title: "Our Provisional Filing Process",
      steps: [
        {
          title: "Share the invention",
          description:
            "Start with notes, sketches, pitch-deck context, or a product walkthrough so we understand what needs protection first.",
        },
        {
          title: "Consult with PatentZoom",
          description:
            "Clarify timing, disclosure risk, roadmap dependencies, and whether a provisional filing is the right first move.",
        },
        {
          title: "Scope the filing path",
          description:
            "Decide how much drafting support, technical detail, and visual documentation the current stage requires.",
        },
        {
          title: "Prepare and file",
          description:
            "Turn the invention into a provisional application package built to support the next prosecution step later.",
        },
        {
          title: "Plan the next 12 months",
          description:
            "Use the provisional window intentionally so the later utility filing is stronger, more complete, and better timed.",
        },
      ],
    },
    offers: {
      title: "File a Provisional Patent Application",
      footnote:
        "*$65 Govt Fee assumes micro-entity status. Pricing is temporary for layout review in this pilot.",
      cards: [
        {
          name: "Basic",
          price: "$299",
          fee: "+$65 Govt Fee*",
          ctaLabel: "Get Basic",
          bullets: [
            '"Patent Pending" status for 12 months',
            "Email consultation with a patent practitioner",
          ],
        },
        {
          name: "Professional",
          badge: "Popular",
          price: "$899",
          fee: "+$65 Govt Fee*",
          ctaLabel: "Get Professional",
          bullets: [
            '"Patent Pending" status for 12 months',
            "Professionally drafted patent writing",
            "Professionally drafted patent drawings",
            "Phone and email consultation with a patent practitioner",
          ],
          featured: true,
        },
        {
          name: "Essentials",
          price: "$599",
          fee: "+$65 Govt Fee*",
          ctaLabel: "Get Essentials",
          bullets: [
            '"Patent Pending" status for 12 months',
            "Professionally drafted patent writing",
            "Professionally drafted patent drawings",
            "Phone and email consultation with a patent practitioner",
          ],
          comparison: ["included", "excluded", "included", "included"],
        },
      ],
    },
    includes: {
      title: "All Filing Paths Include",
      items: [
        {
          title: "Consultation-first guidance",
          description:
            "Discuss legal and strategy questions before the filing path expands.",
        },
        {
          title: "Early filing-date protection",
          description:
            "Establish a provisional filing date before launch pressure creates disclosure risk.",
        },
        {
          title: "Founder-friendly communication",
          description:
            "A simpler intake process with direct visibility into the next step.",
        },
        {
          title: "Roadmap-aware drafting logic",
          description:
            "Protection decisions shaped around how the product is likely to evolve.",
        },
        {
          title: "Electronic review workflow",
          description:
            "Review materials and move the process forward without a heavy legal handoff.",
        },
        {
          title: "Clear transition planning",
          description:
            "A better bridge from provisional status into the utility application stage.",
        },
      ],
    },
    trustStrip: {
      title: "Built for founder timing",
      items: [
        "Investor meetings",
        "Prototype demos",
        "Pitch deck circulation",
        "Pre-launch reviews",
      ],
    },
    reviews: {
      title: "What founders need from the provisional stage",
      description:
        "Representative placeholder feedback for the pilot layout. Final testimonials can replace these later.",
      quotes: [
        "We needed a faster path to protection before investor conversations widened, and the process felt much more structured than a generic intake form.",
        "The value was not just getting a filing on record. It was understanding what mattered now versus what could wait for the utility application.",
        "This kind of page makes the next step feel clearer for startup teams that are still refining the invention while momentum is building.",
      ],
    },
    proof: {
      stat: "12 months",
      title: "Use the provisional window strategically",
      description:
        "A provisional filing is most valuable when it creates space for the team to refine claims, product direction, and invention detail before the non-provisional stage.",
      bullets: [
        "Preserve momentum before disclosure risk expands.",
        "Keep the product roadmap moving while protection planning catches up.",
        "Improve the quality of the later utility filing instead of rushing it.",
      ],
      ctaLabel: "Book a provisional strategy call",
      ctaHref: "/patent-search#consultation",
    },
    searchPrompt: {
      title: "Should you start with a patent search first?",
      description:
        "Some teams should file immediately. Others benefit from understanding the landscape first. This pilot section mirrors the reference flow while keeping the advice framed around PatentZoom's consultation-first approach.",
      ctaLabel: "Ask about patent search",
      ctaHref: "/patent-search",
    },
    resources: {
      title: "Knowledge Center",
      description:
        "Read practical founder-facing guidance around patent timing, valuation, and common early-stage IP mistakes.",
      ctaLabel: "Visit Knowledge Center",
      ctaHref: "/knowledge-center",
    },
    finalCta: {
      title: "Talk with PatentZoom and plan the next filing step",
      description:
        "If the invention is moving quickly, the next move should be clear. Use a consultation to decide whether a provisional filing, patent search, or broader strategy discussion comes first.",
      primaryLabel: "Request consultation",
      primaryHref: "/patent-search#consultation",
      secondaryLabel: "Call PatentZoom",
      secondaryHref: "tel:4089155544",
    },
  },
  "utility-patent": {
    hero: {
      title: "Utility Patent Application",
      summary:
        "Apply for 20 years of patent rights on how your invention works. Consultation with a patent attorney or agent. Fixed fees.",
      image:
        "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?auto=format&fit=crop&w=1600&q=80",
      formHeadline: "Apply for Utility Patent Application.",
      formDescription: "",
      formSubmitLabel: "START APPLICATION",
      registerSubmissionMessage: "Utility patent application page submission",
    },
    process: {
      title: "Utility Patent Application Process",
      steps: [
        {
          title: "Put your invention on paper",
          description:
            "Start with product notes, diagrams, screenshots, workflows, or technical context so the invention can be understood before drafting begins.",
        },
        {
          title: "Review with a patent practitioner",
          description:
            "Work through novelty, scope, timing, and whether the current product is ready for a non-provisional filing.",
        },
        {
          title: "Decide if a search comes first",
          description:
            "Some teams benefit from a patent search before drafting so claim direction can be shaped with better landscape awareness.",
        },
        {
          title: "Prepare and file the application",
          description:
            "PatentZoom drafts the application package, coordinates filing, and moves the invention into patent-pending status.",
        },
        {
          title: "Build toward issued rights",
          description:
            "If approved by the USPTO, the filing can mature into long-term protection around how the invention works.",
        },
      ],
    },
    offers: {
      title: "File a Non-Provisional Utility Patent Application",
      footnote:
        "*$400 Govt Fee assumes micro-entity status. Pricing is temporary for layout review and will be refined with final PatentZoom packaging.",
      cards: [
        {
          name: "Mechanical invention",
          imageSrc: "/service-mechanical.svg",
          imageAlt: "Mechanical invention illustration",
          price: "$3,300",
          fee: "+$400 Govt Fee*",
          ctaLabel: "Start Application",
          bullets: [
            "Utility filing support for physical products and mechanical systems",
            "Drafted patent specifications, claims, and coordinated filing",
            "Consultation with a patent attorney or agent before submission",
          ],
        },
        {
          name: "Software or method invention",
          badge: "Popular",
          imageSrc: "/service-software.svg",
          imageAlt: "Software invention illustration",
          price: "$3,800",
          fee: "+$400 Govt Fee*",
          ctaLabel: "Start Application",
          bullets: [
            "Built for software flows, system logic, and process-driven inventions",
            "Claim drafting shaped around functionality and implementation detail",
            "Prepared application package with filing support and review",
            "Consultation path designed for startup and product teams",
          ],
          featured: true,
        },
        {
          name: "Highly technical invention",
          imageSrc: "/service-technical.svg",
          imageAlt: "Highly technical invention illustration",
          price: "$4,300",
          fee: "+$400 Govt Fee*",
          ctaLabel: "Start Application",
          bullets: [
            "Best fit for biology, chemistry, circuitry, and other deep-technical subject matter",
            "Additional drafting depth for complex technical disclosure",
            "Consultation and filing workflow aligned to higher-complexity inventions",
          ],
        },
      ],
    },
    includes: {
      title: "All Plans Include",
      items: [
        {
          title: "Apply for 20 years of patent rights",
          description:
            "If the invention is allowed by the USPTO, a utility patent can secure long-term protection around how it works.",
        },
        {
          title: "Fully prepared patent application",
          description:
            "The filing package is prepared with specifications, claims, and the supporting structure needed for submission.",
        },
        {
          title: "Consultation with a licensed practitioner",
          description:
            "Discuss patentability, timing, and filing questions with a patent attorney or agent before the application is finalized.",
        },
        {
          title: '"Patent Pending" status',
          description:
            "Once filed, the application moves the invention into pending status while it works through review.",
        },
        {
          title: "Live team Monday-Friday",
          description:
            "Get help by phone or email during the work week when questions come up during intake or drafting.",
        },
        {
          title: "Government receipt",
          description:
            "Receive official USPTO confirmation showing that the utility application was accepted for filing.",
        },
      ],
    },
    trustStrip: {
      title: "Built for real utility-patent scenarios",
      items: [
        "Mechanical products",
        "Software systems",
        "Methods and workflows",
        "Deep-tech inventions",
      ],
    },
    reviews: {
      title: "What teams need from a utility filing",
      description:
        "Placeholder review copy for the rollout. Final PatentZoom testimonials can drop into the same structure later.",
      quotes: [
        "The page makes a complicated filing step feel more understandable for teams moving from prototype to a serious IP position.",
        "What matters here is clarity around how the invention works and what has to be protected, not just submitting a form.",
        "This layout gives inventors a cleaner path into a higher-value utility filing conversation without the old-site friction.",
      ],
    },
    proof: {
      stat: "20 years",
      title: "Protection built for the long game",
      description:
        "A utility patent matters most when the claims track the real commercial and technical value of the invention, not just a simplified summary of it.",
      bullets: [
        "Protect how the invention works, not just how it appears.",
        "Support fundraising, diligence, and licensing conversations with stronger filing depth.",
        "Create a better base for prosecution, continuation strategy, and portfolio growth.",
      ],
      ctaLabel: "Book a utility patent consultation",
      ctaHref: "/patent-search#consultation",
    },
    searchPrompt: {
      title: "Should you request a patent search first?",
      description:
        "For some inventions, a search helps shape the claim direction before drafting begins. For others, speed to filing matters more. PatentZoom can help choose the right sequence.",
      ctaLabel: "Ask about patent search",
      ctaHref: "/patent-search",
    },
    resources: {
      title: "Knowledge Center",
      description:
        "Explore practical articles on patent timing, patentability, prosecution, and how utility filings fit into a broader protection strategy.",
      ctaLabel: "Visit Knowledge Center",
      ctaHref: "/knowledge-center",
    },
    finalCta: {
      title: "Start the utility patent conversation with PatentZoom",
      description:
        "If the invention is past the idea stage and needs stronger protection around how it works, the next step should be a clear filing conversation with the right technical context.",
      primaryLabel: "Request consultation",
      primaryHref: "/patent-search#consultation",
      secondaryLabel: "Call PatentZoom",
      secondaryHref: "tel:4089155544",
    },
  },
  "design-patent": {
    hero: {
      title: "Design Patent Application",
      summary:
        "Apply for 15 years of design patent rights. Filed by licensed patent attorneys and agents. Fixed fees.",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
      formHeadline: "Apply for Design Patent.",
      formDescription: "",
      formSubmitLabel: "START APPLICATION",
      registerSubmissionMessage: "Design patent application page submission",
    },
    process: {
      title: "Design Patent Application Process",
      steps: [
        {
          title: "Share sketches or photos",
          description:
            "Send product photos, sketches, renders, or concept images so PatentZoom can review the design you want protected.",
          imageSrc: "/design-process-share.svg",
          imageAlt: "Share sketches or product photos",
        },
        {
          title: "Discuss with a practitioner",
          description:
            "Talk through what makes the design distinctive, whether a design patent is the right fit, and how it compares with utility coverage.",
          imageSrc: "/design-process-consult.svg",
          imageAlt: "Consult with a patent practitioner",
        },
        {
          title: "Prepare design-ready drawings",
          description:
            "We convert the design into patent-acceptable drawing views that support a cleaner filing package.",
          imageSrc: "/design-process-drawings.svg",
          imageAlt: "Prepare design patent drawings",
        },
        {
          title: "File the application",
          description:
            "The design patent application is assembled and filed with the USPTO to secure pending status around the appearance of the invention.",
          imageSrc: "/design-process-file.svg",
          imageAlt: "File the design patent application",
        },
        {
          title: "Build toward issued rights",
          description:
            "If approved by the USPTO, the design can receive long-term protection over how the invention looks.",
          imageSrc: "/design-process-rights.svg",
          imageAlt: "Receive design patent rights",
        },
      ],
    },
    offers: {
      title: "Design Patent Application",
      footnote:
        "*$260 Govt Fee assumes micro-entity status. Pricing is temporary for layout review and can be refined once final PatentZoom packaging is approved.",
      showcaseImages: [
        {
          src: "/design-sample-phone.svg",
          alt: "Design drawing sample of a handheld device",
        },
        {
          src: "/design-sample-device.svg",
          alt: "Design drawing sample of a product component",
        },
        {
          src: "/design-sample-watch.svg",
          alt: "Design drawing sample of a watch",
        },
        {
          src: "/design-sample-shoe.svg",
          alt: "Design drawing sample of footwear",
        },
      ],
      cards: [
        {
          name: "Design patent filing",
          imageSrc: "/service-design.svg",
          imageAlt: "Design patent filing illustration",
          price: "$990",
          fee: "+$260 Govt Fee*",
          ctaLabel: "Start Application",
          bullets: [
            '"Patent Pending" status for the shape of your invention',
            "Up to 7 professional patent drawings across the required design views",
            "Fully prepared design patent application with drawings, figure descriptions, preamble, and claim",
          ],
          featured: true,
        },
      ],
    },
    includes: {
      title: "All Plans Include",
      items: [
        {
          title: "Consultation with a licensed practitioner",
          description:
            "Ask legal questions about the design patent process and get guidance before the application is finalized.",
          iconSrc: "/icon-consult.svg",
          iconAlt: "Consultation icon",
        },
        {
          title: '"Patent Pending" status',
          description:
            "Once filed, the invention can move into pending status while the design application is under review.",
          iconSrc: "/icon-pending.svg",
          iconAlt: "Patent pending icon",
        },
        {
          title: "Live team Monday-Friday",
          description:
            "Get support by phone or email during the work week when design, drawing, or filing questions come up.",
          iconSrc: "/icon-live.svg",
          iconAlt: "Live support icon",
        },
        {
          title: "Design patent drawings",
          description:
            "Drawing views are prepared to show the design's depth, contours, and shape in a patent-acceptable format.",
          iconSrc: "/icon-drawings.svg",
          iconAlt: "Design patent drawings icon",
        },
        {
          title: "Design patent specifications",
          description:
            "The application includes the design-focused written components needed to complete the filing package.",
          iconSrc: "/icon-specs.svg",
          iconAlt: "Design specifications icon",
        },
        {
          title: "Government receipt",
          description:
            "Receive official USPTO confirmation showing that the design patent application was accepted for filing.",
          iconSrc: "/icon-receipt.svg",
          iconAlt: "Government receipt icon",
        },
      ],
    },
    trustStrip: {
      title: "Well suited for appearance-driven products",
      items: [
        "Consumer products",
        "Packaging and accessories",
        "Hardware exteriors",
        "Branded physical designs",
      ],
    },
    reviews: {
      title: "When appearance is part of the product advantage",
      description:
        "Placeholder review copy for the rollout. Final PatentZoom testimonials can replace these later without changing layout.",
      quotes: [
        "For products where look and form matter, the page makes the design-patent path feel much easier to understand.",
        "This is a much stronger presentation for design protection than a generic service page because it explains what is actually being protected.",
        "The single-package structure feels cleaner here and helps users move faster into the right consultation.",
      ],
    },
    proof: {
      stat: "15 years",
      title: "Protection focused on how the invention looks",
      description:
        "A design patent can be a strong fit when product shape, form, or visual identity carries real market value and needs protection beyond brand messaging alone.",
      bullets: [
        "Protect the shape and visible appearance of the invention.",
        "Strengthen product differentiation in categories where design influences buying decisions.",
        "Pair with utility strategy when both appearance and function matter.",
      ],
      ctaLabel: "Book a design patent consultation",
      ctaHref: "/patent-search#consultation",
    },
    searchPrompt: {
      title: "Should you request a patent search before filing?",
      description:
        "Some teams should go straight to design filing. Others may benefit from understanding adjacent products and prior art first. PatentZoom can help choose the right order.",
      ctaLabel: "Ask about patent search",
      ctaHref: "/patent-search",
    },
    resources: {
      title: "Knowledge Center",
      description:
        "Read practical guidance on design protection, patent timing, prosecution, and how design patents compare with utility filings.",
      ctaLabel: "Visit Knowledge Center",
      ctaHref: "/knowledge-center",
    },
    comparisonSection: {
      title: "Design vs. Utility Patents",
      leftLabel: "Design Patent",
      rightLabel: "Utility Patent",
      rows: [
        {
          left: "Protects how the invention looks and the shape users see.",
          right: "Protects how the invention works and how it is put together.",
        },
        {
          left: "Focuses on the exterior visual design rather than internal function.",
          right: "Focuses on functional features, operation, and technical structure.",
        },
        {
          left: "May not stop copies that use a different appearance.",
          right: "Can protect the functional invention even when the exterior shape changes.",
        },
      ],
    },
    finalCta: {
      title: "Talk with PatentZoom about protecting product design",
      description:
        "If the visual form of the product matters to brand value, market recognition, or copycat risk, the next step should be a clear conversation about whether design filing, utility filing, or both make sense.",
      primaryLabel: "Request consultation",
      primaryHref: "/patent-search#consultation",
      secondaryLabel: "Call PatentZoom",
      secondaryHref: "tel:4089155544",
    },
  },
  trademark: {
    hero: {
      title: "Trademark Protection",
      summary:
        "Protect the name, logo, and brand identity customers see first. Consultation-first support. Fixed-fee filing guidance.",
      image:
        "https://images.unsplash.com/photo-1558655146-364adaf1fcc9?auto=format&fit=crop&w=1600&q=80",
      formHeadline: "Start your trademark filing.",
      formDescription: "",
      formSubmitLabel: "START APPLICATION",
      registerSubmissionMessage: "Trademark page submission",
    },
    process: {
      title: "Trademark Filing Process",
      steps: [
        {
          title: "Share the mark and how you use it",
          description:
            "Start with the brand name, logo, product line, or service mark you want to protect and where it appears today.",
        },
        {
          title: "Review conflict risk and filing goals",
          description:
            "Discuss where the mark is used, which classes may matter, and whether the current brand is ready for filing.",
        },
        {
          title: "Decide if a clearance search comes first",
          description:
            "Some brands should file quickly. Others benefit from a fuller search before investing in the application path.",
        },
        {
          title: "Prepare and file the application",
          description:
            "PatentZoom prepares the filing package and submits the application with the right ownership and class information.",
        },
        {
          title: "Track the next response stage",
          description:
            "Once filed, the mark moves into review and you can plan for office actions, publication, and registration timing.",
        },
      ],
    },
    offers: {
      title: "Trademark Application Filing",
      footnote:
        "*USPTO government filing fees vary by class and filing basis. Pricing shown is a temporary layout value for the rebuild.",
      cards: [
        {
          name: "Trademark filing",
          imageSrc: "/service-trademark.svg",
          imageAlt: "Trademark protection illustration",
          price: "$595",
          fee: "+USPTO Govt Fee*",
          ctaLabel: "Start Application",
          bullets: [
            "Guided application preparation around one brand asset or filing path",
            "Class and ownership review before submission",
            "Consultation on trademark filing strategy and next steps",
          ],
          featured: true,
        },
      ],
    },
    includes: {
      title: "All Plans Include",
      items: [
        {
          title: "Consultation with a filing professional",
          description:
            "Get guidance on filing basis, ownership, classes, and what could create avoidable conflict risk.",
        },
        {
          title: "Application preparation",
          description:
            "The filing package is prepared around the mark, goods or services, and the practical filing path that fits the business.",
        },
        {
          title: "Brand-positioning context",
          description:
            "Filing decisions are shaped around how the mark will actually be used as the company grows.",
        },
        {
          title: "Live team Monday-Friday",
          description:
            "Get support by phone or email during the work week when brand, class, or filing questions come up.",
        },
        {
          title: "Government receipt",
          description:
            "Receive official confirmation showing that the application was accepted for filing by the USPTO.",
        },
        {
          title: "Next-step guidance",
          description:
            "Plan for examiner responses, publication, and how the registration timeline fits your launch and marketing plans.",
        },
      ],
    },
    trustStrip: {
      title: "Built for modern brand protection",
      items: [
        "Startup names",
        "Product marks",
        "Service brands",
        "Logo systems",
      ],
    },
    reviews: {
      title: "What founders need from trademark filing",
      description:
        "Placeholder review copy for the rollout. Final PatentZoom testimonials can replace these later.",
      quotes: [
        "The page makes trademark filing feel much clearer than a generic legal intake because it connects the filing step to actual brand use.",
        "This is the kind of service page that helps teams decide whether they are ready to file or should search and adjust first.",
        "It feels more professional when the trademark path is framed as brand protection strategy instead of just paperwork.",
      ],
    },
    proof: {
      stat: "10 years",
      title: "Protection that can grow with the brand",
      description:
        "Trademark rights matter most when the mark is tied to real business use, customer recognition, and long-term positioning in the market.",
      bullets: [
        "Protect the names and identity customers remember first.",
        "Support cleaner launches, marketing campaigns, and investor-facing brand growth.",
        "Reduce avoidable brand conflict risk before awareness compounds.",
      ],
      ctaLabel: "Book a trademark consultation",
      ctaHref: "/patent-search#consultation",
    },
    searchPrompt: {
      title: "Should you start with a trademark search first?",
      description:
        "Some marks are ready to file now. Others should be checked more carefully before the brand grows further. PatentZoom can help choose the right order.",
      ctaLabel: "Ask about trademark search",
      ctaHref: "/patent-search",
    },
    resources: {
      title: "Knowledge Center",
      description:
        "Read practical articles on filing timing, infringement risk, clearance questions, and how trademark protection fits the broader IP picture.",
      ctaLabel: "Visit Knowledge Center",
      ctaHref: "/knowledge-center",
    },
    finalCta: {
      title: "Talk with PatentZoom about brand protection",
      description:
        "If the brand is gaining traction, the next move should be clear. Use a consultation to decide whether trademark search, trademark filing, or broader IP coordination comes first.",
      primaryLabel: "Request consultation",
      primaryHref: "/patent-search#consultation",
      secondaryLabel: "Call PatentZoom",
      secondaryHref: "tel:4089155544",
    },
  },
  "pct-international": {
    hero: {
      title: "PCT & International Patent Filing",
      summary:
        "Preserve international filing options while you evaluate where global protection is worth the investment. Consultation-led support. Fixed-fee guidance.",
      image:
        "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1600&q=80",
      formHeadline: "Start your international filing plan.",
      formDescription: "",
      formSubmitLabel: "START APPLICATION",
      registerSubmissionMessage: "PCT international page submission",
    },
    process: {
      title: "PCT Filing Process",
      steps: [
        {
          title: "Review the current filing position",
          description:
            "Start with the existing provisional or utility application and the commercial timeline driving international decisions.",
        },
        {
          title: "Map markets and timing priorities",
          description:
            "Discuss where protection may matter, which jurisdictions are realistic, and how timing aligns with budget and growth goals.",
        },
        {
          title: "Decide PCT versus direct national filing",
          description:
            "Choose whether a PCT route makes sense or if the business is better served by a narrower direct-filing strategy.",
        },
        {
          title: "Prepare and submit the filing",
          description:
            "PatentZoom coordinates the filing package and gets the application submitted through the right international path.",
        },
        {
          title: "Plan the national-phase decisions",
          description:
            "Use the extra runway intentionally so country-by-country protection choices are made with better business context.",
        },
      ],
    },
    offers: {
      title: "PCT International Filing",
      footnote:
        "*Government fees vary by applicant status, receiving office, and international stage requirements. Pricing shown is for rebuild layout review.",
      cards: [
        {
          name: "PCT filing",
          imageSrc: "/service-pct.svg",
          imageAlt: "International patent filing illustration",
          price: "$2,200",
          fee: "+WIPO/USPTO Govt Fees*",
          ctaLabel: "Start Application",
          bullets: [
            "Preserve international filing options under one coordinated path",
            "Timing guidance around foreign filing priorities and deadlines",
            "Consultation on PCT fit, cost logic, and national-phase planning",
          ],
          featured: true,
        },
      ],
    },
    includes: {
      title: "All Plans Include",
      items: [
        {
          title: "Consultation on international strategy",
          description:
            "Discuss where protection may matter and whether broader international preservation is actually justified.",
        },
        {
          title: "Timing and deadline guidance",
          description:
            "Plan around priority dates, market rollout, fundraising, and the timing pressure created by foreign filing windows.",
        },
        {
          title: "Coordinated filing preparation",
          description:
            "The filing package is assembled with a cleaner handoff from the original application into the international stage.",
        },
        {
          title: "Live team Monday-Friday",
          description:
            "Get support by phone or email during the work week while filing and planning questions are still moving.",
        },
        {
          title: "Government receipt",
          description:
            "Receive official confirmation showing that the international filing was accepted through the selected channel.",
        },
        {
          title: "National-phase planning",
          description:
            "Use the PCT window to decide which countries matter most before heavier country-by-country costs arrive.",
        },
      ],
    },
    trustStrip: {
      title: "Built for globally minded growth",
      items: [
        "Investor diligence",
        "Cross-border expansion",
        "Future licensing",
        "Market prioritization",
      ],
    },
    reviews: {
      title: "When global options matter, but capital still matters too",
      description:
        "Placeholder review copy for the rollout. Final PatentZoom testimonials can replace these later.",
      quotes: [
        "The page helps founders understand that international filing is really a timing and market-priority decision, not just a legal checkbox.",
        "A cleaner explanation of PCT logic makes the cost and strategy tradeoffs much easier to understand.",
        "This structure feels much more useful for startups that need optionality without rushing into every jurisdiction at once.",
      ],
    },
    proof: {
      stat: "30 months",
      title: "Use the international window strategically",
      description:
        "A PCT filing is often most valuable when it buys the team time to validate markets, budget intelligently, and make country decisions with real traction data.",
      bullets: [
        "Preserve options before committing to every market too early.",
        "Align country-level protection with expansion strategy instead of guesswork.",
        "Reduce rushed decisions around expensive foreign filing paths.",
      ],
      ctaLabel: "Book an international filing consultation",
      ctaHref: "/patent-search#consultation",
    },
    searchPrompt: {
      title: "Should you file internationally after a search, provisional, or utility filing?",
      description:
        "The right sequence depends on where the invention stands now and how much commercial certainty you already have. PatentZoom can help map the order.",
      ctaLabel: "Ask about international timing",
      ctaHref: "/patent-search",
    },
    resources: {
      title: "Knowledge Center",
      description:
        "Read practical guidance on foreign filing deadlines, priority strategy, PCT timing, and international IP budgeting.",
      ctaLabel: "Visit Knowledge Center",
      ctaHref: "/knowledge-center",
    },
    finalCta: {
      title: "Talk with PatentZoom about international protection strategy",
      description:
        "If the business may need protection beyond the U.S., the next move should be timed around actual market potential and cost discipline, not urgency alone.",
      primaryLabel: "Request consultation",
      primaryHref: "/patent-search#consultation",
      secondaryLabel: "Call PatentZoom",
      secondaryHref: "tel:4089155544",
    },
  },
  "office-action-responses": {
    hero: {
      title: "Office Action Responses",
      summary:
        "Respond to USPTO objections with a strategy that protects claim strength, not just speed to closure. Consultation-first support.",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
      formHeadline: "Start your response review.",
      formDescription: "",
      formSubmitLabel: "START RESPONSE",
      registerSubmissionMessage: "Office action response page submission",
    },
    process: {
      title: "Office Action Response Process",
      steps: [
        {
          title: "Share the office action notice",
          description:
            "Start with the examiner's letter, filing history, and any timing pressure so the response path is clear from the beginning.",
        },
        {
          title: "Review the examiner position",
          description:
            "Assess the rejection type, prior art references, and where the real pressure is on claim scope or support.",
        },
        {
          title: "Choose the response strategy",
          description:
            "Decide whether amendment, argument, clarification, or a more strategic prosecution move best protects the value of the application.",
        },
        {
          title: "Draft and file the response",
          description:
            "PatentZoom prepares the response package and coordinates the filing within the required USPTO deadline.",
        },
        {
          title: "Plan the next prosecution step",
          description:
            "Use the response to strengthen the long-term path forward, including what may happen in the next examiner round.",
        },
      ],
    },
    offers: {
      title: "Office Action Response Support",
      footnote:
        "*Complexity varies by rejection type and filing history. Pricing shown is a temporary rebuild value and final scope may vary.",
      cards: [
        {
          name: "Office action response",
          imageSrc: "/service-office-action.svg",
          imageAlt: "Office action response illustration",
          price: "$850",
          fee: "Flat-fee starting point*",
          ctaLabel: "Start Response",
          bullets: [
            "Review of the office action and filing history before response drafting",
            "Claim amendment and argument strategy shaped around prosecution goals",
            "Prepared response filing with deadline-aware coordination",
          ],
          featured: true,
        },
      ],
    },
    includes: {
      title: "All Plans Include",
      items: [
        {
          title: "Consultation on examiner objections",
          description:
            "Discuss what the rejection means, where the real risk sits, and which response direction is most defensible.",
        },
        {
          title: "Response drafting strategy",
          description:
            "The response is built around stronger argument logic and practical prosecution outcomes, not a generic template reply.",
        },
        {
          title: "Claim amendment review",
          description:
            "Where amendments are needed, they are evaluated with attention to claim value and downstream prosecution impact.",
        },
        {
          title: "Live team Monday-Friday",
          description:
            "Get support by phone or email during the work week while deadlines and prosecution decisions are moving.",
        },
        {
          title: "Filing coordination",
          description:
            "The response package is finalized and filed in line with USPTO timing and procedural requirements.",
        },
        {
          title: "Next-step guidance",
          description:
            "Plan for likely examiner follow-up, continued prosecution, and whether broader claim strategy should shift.",
        },
      ],
    },
    trustStrip: {
      title: "Built for prosecution moments that matter",
      items: [
        "102 and 103 rejections",
        "Claim amendments",
        "Deadline-sensitive filings",
        "Scope preservation",
      ],
    },
    reviews: {
      title: "When prosecution quality matters as much as prosecution speed",
      description:
        "Placeholder review copy for the rollout. Final PatentZoom testimonials can replace these later.",
      quotes: [
        "The difference here is that the response is framed around protecting the value of the claims, not just replying to the examiner.",
        "This page makes office actions feel less like an emergency and more like a strategic prosecution decision.",
        "For startups, it is useful to see prosecution support presented in business terms instead of purely legal jargon.",
      ],
    },
    proof: {
      stat: "Claim scope",
      title: "Responses should protect what actually matters",
      description:
        "Office actions are not just about getting through the next deadline. They shape how strong, narrow, or commercially useful the application becomes later.",
      bullets: [
        "Protect the real value of the claims wherever possible.",
        "Reduce reactive amendments that weaken long-term leverage.",
        "Align prosecution moves with roadmap, fundraising, and portfolio goals.",
      ],
      ctaLabel: "Book an office action review",
      ctaHref: "/patent-search#consultation",
    },
    searchPrompt: {
      title: "Should you revisit patentability before responding?",
      description:
        "Sometimes the best response comes from a deeper look at the cited prior art and what still remains protectable. PatentZoom can help decide when that extra review is worth it.",
      ctaLabel: "Ask about prior art review",
      ctaHref: "/patent-search",
    },
    resources: {
      title: "Knowledge Center",
      description:
        "Read practical guidance on prosecution, examiner objections, response timing, and how office actions influence claim quality.",
      ctaLabel: "Visit Knowledge Center",
      ctaHref: "/knowledge-center",
    },
    finalCta: {
      title: "Talk with PatentZoom before replying to the examiner",
      description:
        "If an office action has arrived, the next move should protect the strongest version of the application you can still defend, not just clear the notice quickly.",
      primaryLabel: "Request consultation",
      primaryHref: "/patent-search#consultation",
      secondaryLabel: "Call PatentZoom",
      secondaryHref: "tel:4089155544",
    },
  },
  "ip-portfolio-strategy": {
    hero: {
      title: "IP Portfolio Strategy",
      summary:
        "Build an IP roadmap around launches, diligence, and funding milestones instead of making disconnected filing decisions.",
      image:
        "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1600&q=80",
      formHeadline: "Start your portfolio strategy review.",
      formDescription: "",
      formSubmitLabel: "BOOK STRATEGY SESSION",
      registerSubmissionMessage: "IP portfolio strategy page submission",
    },
    process: {
      title: "Portfolio Strategy Process",
      steps: [
        {
          title: "Audit current IP and product plans",
          description:
            "Start by reviewing what has already been filed, what is in development, and where the product roadmap is headed next.",
        },
        {
          title: "Map milestones and exposure points",
          description:
            "Discuss launches, fundraising events, diligence checkpoints, and disclosure risks that should influence filing timing.",
        },
        {
          title: "Prioritize what deserves protection first",
          description:
            "Separate high-value core inventions from lower-priority ideas so budget and legal attention go where they matter most.",
        },
        {
          title: "Build the filing roadmap",
          description:
            "Turn the strategy into a practical sequence covering near-term filings, deferred decisions, and resource planning.",
        },
        {
          title: "Use the roadmap as the company grows",
          description:
            "Update the portfolio logic as new products, diligence pressure, or competitive realities change what protection matters most.",
        },
      ],
    },
    offers: {
      title: "Portfolio Strategy Session",
      footnote:
        "*Strategy engagement pricing is a temporary rebuild value and can be refined once the final consulting package is approved.",
      cards: [
        {
          name: "IP roadmap session",
          imageSrc: "/service-strategy.svg",
          imageAlt: "Portfolio strategy illustration",
          price: "$750",
          fee: "Strategy engagement*",
          ctaLabel: "Book Strategy Session",
          bullets: [
            "Review current filings, invention pipeline, and product roadmap together",
            "Prioritize what to file now, what to stage later, and what may not deserve investment",
            "Turn scattered IP decisions into a clearer 6-12 month roadmap",
          ],
          featured: true,
        },
      ],
    },
    includes: {
      title: "All Plans Include",
      items: [
        {
          title: "Consultation on business-aligned IP timing",
          description:
            "Discuss how launches, investor conversations, and diligence pressure should shape the filing order.",
        },
        {
          title: "Roadmap review",
          description:
            "Map current products, future releases, and invention clusters into a more intentional protection plan.",
        },
        {
          title: "Priority setting",
          description:
            "Identify which inventions matter most commercially so budget and legal effort are not spread too thin.",
        },
        {
          title: "Live team Monday-Friday",
          description:
            "Get support by phone or email during the work week while strategy and follow-up questions are still moving.",
        },
        {
          title: "Risk and gap review",
          description:
            "Spot where disclosure exposure, weak sequencing, or missing protection could become a problem later.",
        },
        {
          title: "Action summary",
          description:
            "Leave with a clearer set of next actions instead of isolated legal tasks disconnected from the business timeline.",
        },
      ],
    },
    trustStrip: {
      title: "Built for roadmap-driven protection",
      items: [
        "Fundraising timing",
        "Product launches",
        "Diligence readiness",
        "Portfolio sequencing",
      ],
    },
    reviews: {
      title: "When filings need to work together, not separately",
      description:
        "Placeholder review copy for the rollout. Final PatentZoom testimonials can replace these later.",
      quotes: [
        "This kind of page helps founders understand that portfolio strategy is about timing and prioritization, not just filing more patents.",
        "It feels more useful when IP is framed around roadmap milestones and investor pressure instead of abstract legal theory.",
        "For startups with multiple inventions, this is the sort of consultation page that can actually reduce wasted filing spend.",
      ],
    },
    proof: {
      stat: "12 months",
      title: "Plan the next year of protection intentionally",
      description:
        "A stronger portfolio usually comes from better sequencing, not just more activity. The value is in deciding what matters now, what can wait, and what deserves deeper investment.",
      bullets: [
        "Align filing decisions with the product and fundraising calendar.",
        "Reduce scattered IP spend across lower-priority ideas.",
        "Build a defensibility story investors can understand faster.",
      ],
      ctaLabel: "Book a portfolio strategy session",
      ctaHref: "/patent-search#consultation",
    },
    searchPrompt: {
      title: "Should search come before a broader portfolio strategy discussion?",
      description:
        "Sometimes yes, especially when the company is still validating where novelty sits. Other times the bigger issue is filing order and budget discipline. PatentZoom can help decide.",
      ctaLabel: "Ask about search and strategy",
      ctaHref: "/patent-search",
    },
    resources: {
      title: "Knowledge Center",
      description:
        "Read practical guidance on portfolio planning, valuation, diligence readiness, and how filing choices support long-term leverage.",
      ctaLabel: "Visit Knowledge Center",
      ctaHref: "/knowledge-center",
    },
    finalCta: {
      title: "Talk with PatentZoom about your next filing roadmap",
      description:
        "If the company has more than one invention or more than one milestone coming up, the next step should be a strategy conversation that puts the filings in the right order.",
      primaryLabel: "Request consultation",
      primaryHref: "/patent-search#consultation",
      secondaryLabel: "Call PatentZoom",
      secondaryHref: "tel:4089155544",
    },
  },
} as const;

export const homepageServices = [
  {
    href: "/provisional-patent",
    title: "Provisional Patent",
    description:
      "Structured to preserve priority while supporting roadmap expansion.",
  },
  {
    href: "/utility-patent",
    title: "Utility Patent",
    description:
      "Claims engineered for defensibility, not just approval.",
  },
  {
    href: "/pct-international",
    title: "PCT & International",
    description:
      "Global protection aligned with expansion strategy.",
  },
  {
    href: "/office-action-responses",
    title: "Office Action Responses",
    description:
      "Strategic responses protecting claim strength and scope.",
  },
  {
    href: "/design-patent",
    title: "Design Patent",
    description:
      "Protect the visible product identity when design carries value.",
  },
  {
    href: "/trademark",
    title: "Trademark",
    description:
      "Brand security alongside technology protection.",
  },
  {
    href: "/ip-portfolio-strategy",
    title: "IP Portfolio Strategy",
    description:
      "Long-term roadmap planning aligned with valuation milestones.",
  },
];

export const differentiators = [
  {
    title: "Startup-native strategy",
    description:
      "Patent planning shaped around fundraising timelines, product velocity, and investor scrutiny.",
  },
  {
    title: "Clear communication",
    description:
      "A simpler client experience with direct next steps, fewer dead ends, and faster visibility into progress.",
  },
  {
    title: "Claims with commercial context",
    description:
      "Filing strategy built around what matters to the roadmap, market position, and future diligence.",
  },
];

export const founderSignals = [
  "Investor-ready defensibility narrative",
  "Filings aligned with roadmap milestones",
  "Faster communication than traditional firms",
  "Protection strategy that grows with the company",
];

export const founderConcerns = [
  "You are preparing for diligence and do not want IP gaps to surface late.",
  "Your product is moving faster than a traditional legal workflow can support.",
  "You need claims that protect real differentiation, not just a filing on record.",
];

export const processSteps = [
  {
    step: "01",
    title: "Frame the invention",
    description:
      "Map the commercial advantage, technical core, and what should be protected first.",
  },
  {
    step: "02",
    title: "Choose the filing path",
    description:
      "Select the right route based on timing, maturity, fundraising stage, and product velocity.",
  },
  {
    step: "03",
    title: "Build the protection story",
    description:
      "Translate product details into stronger claim language, supporting diagrams, and a credible narrative.",
  },
  {
    step: "04",
    title: "Stay aligned as you grow",
    description:
      "Use each filing as part of a larger IP roadmap instead of a one-time transaction.",
  },
];

export const resourceCards = [
  {
    title: "When to file, and when not to",
    description:
      "Timing decisions shape patent value. Filing too early or too late can both create risk.",
  },
  {
    title: "How patents affect valuation",
    description:
      "A stronger IP narrative can influence diligence, investor confidence, and long-term leverage.",
  },
  {
    title: "Common IP mistakes funded startups make",
    description:
      "Founders move fast. The wrong sequence or weak claims can create avoidable risk later.",
  },
];

