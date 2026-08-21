import {
  academyTimeline,
  academyTracks,
  atelierProcess,
  atelierServices,
  buildPaystackInlineConfig,
  contactChannels,
  createPaymentReference,
  faqs,
  featuredMoments,
  getPageMeta,
  journalStories,
  operationsMetrics,
  pages,
  paymentPlans,
  paymentSteps,
  serviceCategories,
  socialProof,
  testimonials,
  websiteImage,
} from './site-data.mjs';

const heroCopy = {
  home: {
    badge: 'Premium fashion hub',
    title: 'A premium fashion website built as a real static multi-page experience.',
    description:
      'Beccatee Fashion Hub now presents couture services, academy training, editorial storytelling, and guided payments through a polished GitHub Pages-ready website.',
    primaryLabel: 'Explore services',
    primaryPage: 'services',
    secondaryLabel: 'Make a payment',
    secondaryPage: 'payments',
    image: websiteImage(
      'luxury African fashion house interior with couture gowns, glass walls, ambient purple and amber lighting, premium modern website hero image',
      'portrait_4_3'
    ),
  },
  services: {
    badge: 'Premium services',
    title: 'Fashion services packaged with more clarity, trust, and value.',
    description:
      'This page helps visitors understand the studio offer quickly, from bridal work to consulting support and premium event dressing.',
    primaryLabel: 'Start an inquiry',
    primaryPage: 'contact',
    secondaryLabel: 'See payments',
    secondaryPage: 'payments',
    image: websiteImage(
      'luxury fashion service presentation in premium studio with bridal gown, eveningwear, and consultation setup, realistic website image',
      'portrait_4_3'
    ),
  },
  academy: {
    badge: 'Structured academy',
    title: 'A practical training experience that looks organized and industry-ready.',
    description:
      'The academy page explains learning outcomes, progression, timelines, and next steps so the offer feels serious and premium.',
    primaryLabel: 'Apply now',
    primaryPage: 'contact',
    secondaryLabel: 'Pay seat deposit',
    secondaryPage: 'payments',
    image: websiteImage(
      'fashion design academy workshop in polished luxury studio with students and mentor, realistic editorial education website image',
      'portrait_4_3'
    ),
  },
  atelier: {
    badge: 'Couture atelier',
    title: 'A bespoke atelier page with visible process, pricing anchors, and trust cues.',
    description:
      'Clients can see how discovery, fittings, refinement, and delivery work before they book a project.',
    primaryLabel: 'Book a fitting',
    primaryPage: 'contact',
    secondaryLabel: 'Explore services',
    secondaryPage: 'services',
    image: websiteImage(
      'couture fitting in luxury African fashion atelier with designer adjusting bridal dress, premium realistic website image',
      'portrait_4_3'
    ),
  },
  journal: {
    badge: 'Editorial journal',
    title: 'A living brand journal that keeps the website current and credible.',
    description:
      'Editorial content gives the studio stronger brand voice, better freshness, and more return-value for visitors.',
    primaryLabel: 'Book consultation',
    primaryPage: 'contact',
    secondaryLabel: 'Explore academy',
    secondaryPage: 'academy',
    image: websiteImage(
      'fashion editorial planning desk with swatches, sketchbook, styling notes and luxe ambient light, realistic premium website image',
      'portrait_4_3'
    ),
  },
  payments: {
    badge: 'Guided checkout',
    title: 'A GitHub Pages-friendly payment page with optional Paystack inline checkout.',
    description:
      'Visitors can choose a payment lane, submit details, and either launch Paystack with a public key or use a clear manual follow-up path.',
    primaryLabel: 'Choose a plan',
    primaryPage: 'payments',
    secondaryLabel: 'Contact studio',
    secondaryPage: 'contact',
    image: websiteImage(
      'luxury payment desk in fashion studio with tablet card and elegant packaging, premium glassmorphism modern website image',
      'portrait_4_3'
    ),
  },
  contact: {
    badge: 'Client intake',
    title: 'A complete inquiry page for couture, academy, consulting, and payment follow-up.',
    description:
      'Because the site is static-hosted, the contact flow prepares an email or WhatsApp message instead of depending on a backend.',
    primaryLabel: 'Return home',
    primaryPage: 'home',
    secondaryLabel: 'See payments',
    secondaryPage: 'payments',
    image: websiteImage(
      'luxury consultation desk in premium fashion studio with tablet sketchbook fabric and soft ambient light, realistic website image',
      'portrait_4_3'
    ),
  },
};

const galleryShots = [
  {
    title: 'Reception couture',
    image: websiteImage(
      'elegant reception dress on mannequin in luxury fashion studio with glassmorphism accents, realistic website portfolio image',
      'square_hd'
    ),
  },
  {
    title: 'Studio detailing',
    image: websiteImage(
      'close up couture beading and sewing details in premium fashion atelier, realistic luxury website detail shot',
      'square_hd'
    ),
  },
  {
    title: 'Fabric curation',
    image: websiteImage(
      'bridal fabric curation table in modern couture atelier with lace satin crystals and sketches, realistic premium website image',
      'square_hd'
    ),
  },
];

const academyBenefits = [
  'Industry-style weekend structure with mentor critique',
  'Pattern confidence, finishing discipline, and better presentation quality',
  'Portfolio-minded assignments and stronger client-readiness',
];

const journalHighlights = [
  'Weekly content keeps the brand active and current',
  'Editorial storytelling creates a better SEO surface',
  'Voice, authority, and taste feel more believable to premium clients',
];

const app = document.getElementById('app');

const state = {
  activePage: document.body.dataset.page || 'home',
  menuOpen: false,
  selectedPlan: paymentPlans[0]?.slug || '',
  activeMoment: 0,
  activeTestimonial: 0,
  openFaq: 0,
  contactStatus: null,
  paymentStatus: null,
  newsletterStatus: null,
};

hydratePaymentStatusFromUrl();
render();

app.addEventListener('click', async (event) => {
  const menuToggle = event.target.closest('[data-menu-toggle]');
  if (menuToggle) {
    state.menuOpen = !state.menuOpen;
    render();
    return;
  }

  const planButton = event.target.closest('[data-plan]');
  if (planButton) {
    state.selectedPlan = planButton.dataset.plan;
    render();
    return;
  }

  const faqButton = event.target.closest('[data-faq]');
  if (faqButton) {
    const faqIndex = Number(faqButton.dataset.faq);
    state.openFaq = state.openFaq === faqIndex ? -1 : faqIndex;
    render();
    return;
  }

  const momentButton = event.target.closest('[data-moment]');
  if (momentButton) {
    state.activeMoment = Number(momentButton.dataset.moment);
    render();
    return;
  }

  const testimonialButton = event.target.closest('[data-testimonial]');
  if (testimonialButton) {
    state.activeTestimonial = Number(testimonialButton.dataset.testimonial);
    render();
  }
});

app.addEventListener('submit', async (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (form.matches('[data-contact-form]')) {
    event.preventDefault();
    handleContactSubmit(form);
    return;
  }

  if (form.matches('[data-newsletter-form]')) {
    event.preventDefault();
    const email = String(new FormData(form).get('email') || '').trim();
    state.newsletterStatus = email
      ? `Thanks. ${email} can now be added to your mailing workflow or newsletter provider.`
      : 'Enter an email address to continue.';
    render();
    return;
  }

  if (form.matches('[data-payment-form]')) {
    event.preventDefault();
    await handlePaymentSubmit(form);
  }
});

function render() {
  const pageMeta = getPageMeta(state.activePage);
  const hero = heroCopy[state.activePage] || heroCopy.home;
  document.title = `${pageMeta.title} | Beccatee Fashion Hub`;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', pageMeta.description);
  }

  app.innerHTML = `
    <div class="site-shell">
      <div class="ambient ambient-left"></div>
      <div class="ambient ambient-right"></div>
      <div class="ambient ambient-bottom"></div>

      <div class="topbar">
        <div class="container topbar-inner">
          <p>Premium fashion hub with services, academy, and GitHub Pages-ready static hosting.</p>
          <a class="chip-link" href="${pageUrl('payments')}">Pay securely</a>
        </div>
      </div>

      <header class="site-header">
        <div class="container nav-shell">
          <a class="brand" href="${pageUrl('home')}">
            <span class="brand-mark">BA</span>
            <span>
              <strong>Beccatee</strong>
              <small>Fashion Hub</small>
            </span>
          </a>

          <nav class="nav-desktop" aria-label="Primary">
            ${pages.map((page) => navLink(page)).join('')}
          </nav>

          <div class="nav-actions">
            <a class="btn btn-ghost nav-cta" href="${pageUrl('contact')}">Contact</a>
            <a class="btn btn-primary nav-cta" href="${pageUrl('payments')}">Pay now</a>
            <button class="menu-toggle" type="button" data-menu-toggle aria-label="Toggle menu">
              ${state.menuOpen ? 'Close' : 'Menu'}
            </button>
          </div>
        </div>

        ${
          state.menuOpen
            ? `
          <div class="container mobile-menu">
            ${pages.map((page) => navLink(page, true)).join('')}
          </div>
        `
            : ''
        }
      </header>

      <main>
        <section class="hero-section">
          <div class="container hero-grid">
            <div class="hero-copy">
              <p class="eyebrow">${escapeHtml(hero.badge)}</p>
              <h1>${escapeHtml(hero.title)}</h1>
              <p class="lead">${escapeHtml(hero.description)}</p>

              <div class="button-row">
                <a class="btn btn-primary" href="${pageUrl(hero.primaryPage)}">${escapeHtml(hero.primaryLabel)}</a>
                <a class="btn btn-ghost" href="${pageUrl(hero.secondaryPage)}">${escapeHtml(hero.secondaryLabel)}</a>
              </div>

              <div class="chip-row">
                <span class="chip">${escapeHtml(pageMeta.eyebrow)}</span>
                <span class="chip">Static multi-page site</span>
                <span class="chip">GitHub Pages ready</span>
              </div>
            </div>

            <div class="hero-card card">
              <img class="hero-image" src="${hero.image}" alt="${escapeHtml(pageMeta.title)}" />
              <div class="hero-card-grid">
                <div class="mini-card">
                  <p class="mini-label">Page focus</p>
                  <h2>${escapeHtml(pageMeta.title)}</h2>
                  <p>${escapeHtml(pageMeta.description)}</p>
                </div>
                <div class="mini-card accent-card">
                  <p class="mini-label">Studio quick facts</p>
                  <ul class="simple-list">
                    <li>Next academy cohort: September 2026</li>
                    <li>Consultation turnaround: within 2 hours</li>
                    <li>Studio base: RCCG Camp, Lagos-Ibadan Expressway</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="page-section">
          <div class="container">
            ${renderPageBody()}
          </div>
        </section>
      </main>

      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <p class="eyebrow footer-kicker">Beccatee Fashion Hub</p>
            <p class="footer-copy">
              Built as a static HTML, CSS, and JavaScript website for direct deployment on GitHub Pages.
            </p>
          </div>
          <div class="footer-links">
            ${pages.map((page) => `<a class="footer-pill" href="${pageUrl(page.slug)}">${escapeHtml(page.label)}</a>`).join('')}
            <a class="footer-pill" href="mailto:beccatee.atelier@gmail.com">Email</a>
            <a class="footer-pill" href="tel:+2349077456229">Call</a>
          </div>
        </div>
      </footer>
    </div>
  `;
}

function renderPageBody() {
  switch (state.activePage) {
    case 'services':
      return renderServicesPage();
    case 'academy':
      return renderAcademyPage();
    case 'atelier':
      return renderAtelierPage();
    case 'journal':
      return renderJournalPage();
    case 'payments':
      return renderPaymentsPage();
    case 'contact':
      return renderContactPage();
    default:
      return renderHomePage();
  }
}

function renderHomePage() {
  const spotlight = featuredMoments[state.activeMoment] || featuredMoments[0];
  const currentTestimonial = testimonials[state.activeTestimonial] || testimonials[0];

  return `
    <section class="content-grid two-up">
      <div class="card panel">
        ${sectionHeading(
          'Flagship platform',
          'Now positioned like a premium fashion business with real client pathways.',
          'The home page balances studio storytelling, business proof, service discovery, and direct conversion routes.'
        )}
        <div class="stats-grid compact-top">
          ${socialProof.map((item) => statCard(item.value, item.label)).join('')}
        </div>
      </div>

      <div class="card panel floating">
        <p class="eyebrow">Rotating spotlight</p>
        <img class="feature-image" src="${spotlight.image}" alt="${escapeHtml(spotlight.title)}" />
        <p class="mini-label top-gap">${escapeHtml(spotlight.tag)}</p>
        <h3>${escapeHtml(spotlight.title)}</h3>
        <p>${escapeHtml(spotlight.description)}</p>
        <div class="dot-row">
          ${featuredMoments
            .map(
              (item, index) => `
                <button
                  type="button"
                  class="dot-button ${index === state.activeMoment ? 'active' : ''}"
                  data-moment="${index}"
                  aria-label="${escapeHtml(item.title)}"
                ></button>
              `
            )
            .join('')}
        </div>
      </div>
    </section>

    <section class="stack-section">
      ${sectionHeading(
        'Operations pulse',
        'Live-style operational cues make the studio feel active and current.',
        'These cards help the business feel real, organized, and conversion-ready.'
      )}
      <div class="stats-grid">
        ${operationsMetrics.map((metric) => statCard(metric.value, metric.label, metric.detail)).join('')}
      </div>
    </section>

    <section class="cards-grid four-up">
      ${featureCard(
        'Services',
        'Bridal, couture, strategy, and premium service packaging with better conversion logic.',
        'Explore services',
        pageUrl('services')
      )}
      ${featureCard(
        'Academy',
        'Structured learning tracks, mentorship, and visible outcomes for serious students.',
        'Explore academy',
        pageUrl('academy')
      )}
      ${featureCard(
        'Payments',
        'Guided checkout flows for deposits, consultations, and academy seat reservations.',
        'Open payments',
        pageUrl('payments')
      )}
      ${featureCard(
        'Journal',
        'Editorial notes, studio stories, and launch-ready content to keep the brand fresh.',
        'Read journal',
        pageUrl('journal')
      )}
    </section>

    <section class="content-grid two-up stack-section">
      <div>
        ${sectionHeading(
          'Client proof',
          'More believable, more premium, and easier to trust.',
          'The redesign helps services feel organized, high-value, and ready for real clients.'
        )}
        <div class="card testimonial-card">
          <p class="stars">★★★★★</p>
          <p class="quote">"${escapeHtml(currentTestimonial.quote)}"</p>
          <p class="quote-author">${escapeHtml(currentTestimonial.name)} · ${escapeHtml(currentTestimonial.role)}</p>
          <div class="tab-row">
            ${testimonials
              .map(
                (item, index) => `
                  <button
                    type="button"
                    class="tab-button ${index === state.activeTestimonial ? 'active' : ''}"
                    data-testimonial="${index}"
                  >
                    ${escapeHtml(item.name)}
                  </button>
                `
              )
              .join('')}
          </div>
        </div>
      </div>

      <div class="gallery-grid">
        ${galleryShots
          .map(
            (item) => `
              <article class="card gallery-card">
                <img class="gallery-image" src="${item.image}" alt="${escapeHtml(item.title)}" />
                <p>${escapeHtml(item.title)}</p>
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function renderServicesPage() {
  return `
    <section class="cards-grid three-up">
      ${serviceCategories
        .map(
          (service) => `
            <article class="card panel">
              <span class="tag">${escapeHtml(service.highlight)}</span>
              <h3>${escapeHtml(service.title)}</h3>
              <p>${escapeHtml(service.summary)}</p>
              <ul class="feature-list">
                ${service.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
              </ul>
            </article>
          `
        )
        .join('')}
    </section>

    <section class="content-grid two-up stack-section">
      <div class="card panel">
        ${sectionHeading(
          'Why this works',
          'Clear service packaging lifts trust and conversion quality.',
          'Premium clients buy clarity, and this page explains what each service lane is for.'
        )}
        <div class="stack-list compact-top">
          ${operationsMetrics
            .slice(0, 3)
            .map(
              (item) => `
                <article class="mini-card outline-card">
                  <div class="row-split">
                    <strong>${escapeHtml(item.label)}</strong>
                    <span>${escapeHtml(item.value)}</span>
                  </div>
                  <p>${escapeHtml(item.detail)}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </div>

      <div class="card panel dark-panel">
        <p class="eyebrow">Conversion channels</p>
        <div class="cards-grid two-up compact-top">
          ${smallFeatureCard(
            'Custom projects',
            'Bridal and couture clients can move from browsing to inquiry in one guided path.'
          )}
          ${smallFeatureCard(
            'Secure deposits',
            'Payment routing is now visible instead of hidden inside conversations.'
          )}
          ${smallFeatureCard(
            'Live operations',
            'Business cues make the studio feel active rather than dormant.'
          )}
          ${smallFeatureCard(
            'Premium trust',
            'Better information architecture reduces hesitation before outreach.'
          )}
        </div>
      </div>
    </section>
  `;
}

function renderAcademyPage() {
  return `
    <section class="cards-grid three-up">
      ${academyTracks
        .map(
          (track) => `
            <article class="card panel">
              <div class="icon-badge">AC</div>
              <h3>${escapeHtml(track.title)}</h3>
              <p>${escapeHtml(track.summary)}</p>
              <ul class="feature-list">
                ${track.bullets.map((bullet) => `<li>${escapeHtml(bullet)}</li>`).join('')}
              </ul>
            </article>
          `
        )
        .join('')}
    </section>

    <section class="content-grid two-up stack-section">
      <div class="card panel">
        ${sectionHeading(
          'Student outcomes',
          'A clearer curriculum makes the academy offer feel serious.',
          'Instead of a loose topic list, the program shows how students move from basics to polished work.'
        )}
        <ul class="feature-list compact-top">
          ${academyBenefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join('')}
        </ul>
      </div>

      <div class="card panel dark-panel">
        <p class="eyebrow">12-weekend learning path</p>
        <div class="stack-list compact-top">
          ${academyTimeline
            .map(
              (item) => `
                <article class="mini-card outline-card">
                  <p class="mini-label">${escapeHtml(item.week)}</p>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.detail)}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderAtelierPage() {
  return `
    <section class="cards-grid three-up">
      ${atelierServices
        .map(
          (service) => `
            <article class="card panel">
              <h3>${escapeHtml(service.title)}</h3>
              <p>${escapeHtml(service.description)}</p>
              <p class="price">${escapeHtml(service.price)}</p>
            </article>
          `
        )
        .join('')}
    </section>

    <section class="content-grid two-up stack-section">
      <div class="card panel dark-panel">
        ${sectionHeading(
          'How projects move',
          'A visible process makes premium pricing easier to understand.',
          'The atelier page explains what happens between the first conversation and final handoff.'
        )}
        <div class="stack-list compact-top">
          ${atelierProcess
            .map(
              (item) => `
                <article class="mini-card outline-card">
                  <p class="mini-label">${escapeHtml(item.step)}</p>
                  <h3>${escapeHtml(item.title)}</h3>
                  <p>${escapeHtml(item.detail)}</p>
                </article>
              `
            )
            .join('')}
        </div>
      </div>

      <div class="gallery-grid atelier-gallery">
        ${galleryShots
          .map(
            (item) => `
              <article class="card gallery-card">
                <img class="gallery-image" src="${item.image}" alt="${escapeHtml(item.title)}" />
                <p>${escapeHtml(item.title)}</p>
              </article>
            `
          )
          .join('')}
        <article class="card panel wide-card">
          <p class="eyebrow">Client view</p>
          <p class="quote">"${escapeHtml(testimonials[0].quote)}"</p>
          <p class="quote-author">${escapeHtml(testimonials[0].name)} · ${escapeHtml(testimonials[0].role)}</p>
        </article>
      </div>
    </section>
  `;
}

function renderJournalPage() {
  return `
    <section class="cards-grid three-up">
      ${journalStories
        .map(
          (story) => `
            <article class="card panel">
              <p class="mini-label">${escapeHtml(story.category)}</p>
              <h3>${escapeHtml(story.title)}</h3>
              <p>${escapeHtml(story.excerpt)}</p>
              <a class="inline-link" href="${pageUrl('contact')}">Turn this into a consultation</a>
            </article>
          `
        )
        .join('')}
    </section>

    <section class="content-grid two-up stack-section">
      <div class="card panel">
        ${sectionHeading(
          'Why this matters',
          'The journal makes the site feel current, real, and lived-in.',
          'Professional websites feel active, and this content layer creates that feeling.'
        )}
        <ul class="feature-list compact-top">
          ${journalHighlights.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
        </ul>
      </div>

      <div class="card panel newsletter-panel">
        <p class="eyebrow">Studio newsletter</p>
        <h3>Get styling notes, launch alerts, and new cohort announcements.</h3>
        <p>A modern fashion site usually includes an audience-growth layer. This static version keeps the sign-up UI ready.</p>
        ${
          state.newsletterStatus
            ? `<div class="status info compact-top"><p>${escapeHtml(state.newsletterStatus)}</p></div>`
            : ''
        }
        <form class="newsletter-form compact-top" data-newsletter-form>
          <label>
            <span class="sr-only">Email address</span>
            <input type="email" name="email" placeholder="Enter email address" required />
          </label>
          <button class="btn btn-light" type="submit">Join the list</button>
        </form>
      </div>
    </section>
  `;
}

function renderPaymentsPage() {
  const activePlan = paymentPlans.find((plan) => plan.slug === state.selectedPlan) || paymentPlans[0];
  const statusCard = renderPaymentStatus();

  return `
    <section class="cards-grid three-up">
      ${paymentPlans
        .map(
          (plan) => `
            <button
              type="button"
              class="card panel selectable-card ${plan.slug === state.selectedPlan ? 'selected' : ''}"
              data-plan="${plan.slug}"
            >
              <p class="mini-label">${escapeHtml(plan.subtitle)}</p>
              <h3>${escapeHtml(plan.title)}</h3>
              <p>${escapeHtml(plan.description)}</p>
              <p class="price">${escapeHtml(plan.amountLabel)}</p>
            </button>
          `
        )
        .join('')}
    </section>

    <section class="content-grid payment-layout stack-section">
      <div class="stack-list">
        <div class="card panel">
          ${sectionHeading(
            'Static hosting note',
            'This payment page works on GitHub Pages without a build step.',
            'Set a Paystack public key in the config snippet for inline checkout, or use the manual follow-up path for assisted payment.'
          )}
          <div class="stack-list compact-top">
            ${paymentSteps
              .map(
                (item) => `
                  <article class="mini-card outline-card">
                    <p class="mini-label">${escapeHtml(item.step)}</p>
                    <h3>${escapeHtml(item.title)}</h3>
                    <p>${escapeHtml(item.detail)}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </div>

        <div class="card panel">
          <p class="eyebrow">Setup help</p>
          <ul class="feature-list compact-top">
            <li>Keep only the Paystack public key in the frontend config.</li>
            <li>Use <code>payments.html</code> as the callback page for this static deployment.</li>
            <li>For server-side verification, move the API handlers to a serverless host later.</li>
          </ul>
        </div>
      </div>

      <div class="card payment-card">
        <div class="row-split">
          <div>
            <p class="mini-label payment-kicker">Selected payment</p>
            <h3>${escapeHtml(activePlan.title)}</h3>
          </div>
          <span class="price-chip">${escapeHtml(activePlan.amountLabel)}</span>
        </div>
        <p class="payment-copy">
          Complete this form to launch Paystack checkout for the selected payment lane or prepare a manual follow-up reference.
        </p>
        ${statusCard}
        <form class="form-grid compact-top" data-payment-form>
          <label>
            <span>Full name</span>
            <input type="text" name="name" placeholder="Jane Doe" required />
          </label>
          <label>
            <span>Phone number</span>
            <input type="tel" name="phone" placeholder="+234 XXX XXX XXXX" required />
          </label>
          <label class="full-span">
            <span>Email address</span>
            <input type="email" name="email" placeholder="jane@example.com" required />
          </label>
          <div class="summary-box full-span">
            <strong>${escapeHtml(activePlan.title)}</strong>
            <p>${escapeHtml(activePlan.description)}</p>
          </div>
          <div class="form-actions full-span">
            <p>Supports card, bank transfer, USSD, and supported channels via Paystack.</p>
            <button class="btn btn-dark" type="submit">Launch checkout</button>
          </div>
        </form>
      </div>
    </section>
  `;
}

function renderContactPage() {
  return `
    <section class="content-grid contact-layout">
      <div class="stack-list">
        ${contactChannels
          .map(
            (channel) => `
              <article class="card panel">
                <p class="mini-label">${escapeHtml(channel.label)}</p>
                <p>${escapeHtml(channel.value)}</p>
              </article>
            `
          )
          .join('')}
        <article class="card panel">
          <p class="mini-label">Fast path</p>
          <p>Use the form for academy applications, couture inquiries, consultation requests, or post-payment follow-up.</p>
        </article>
      </div>

      <div class="card payment-card">
        <h3>Start your inquiry</h3>
        <p class="payment-copy">
          This static form prepares your follow-up message so the site still works cleanly on GitHub Pages without a backend.
        </p>
        ${renderContactStatus()}
        <form class="form-grid compact-top" data-contact-form>
          <label>
            <span>Full name</span>
            <input type="text" name="name" placeholder="Jane Doe" required />
          </label>
          <label>
            <span>Phone number</span>
            <input type="tel" name="phone" placeholder="+234 XXX XXX XXXX" required />
          </label>
          <label>
            <span>Email address</span>
            <input type="email" name="email" placeholder="jane@example.com" required />
          </label>
          <label>
            <span>Interest</span>
            <select name="interest" required>
              <option>Academy application</option>
              <option selected>Bespoke tailoring</option>
              <option>Bridal project</option>
              <option>Private consultation</option>
              <option>Payment follow-up</option>
            </select>
          </label>
          <label class="full-span">
            <span>Project notes</span>
            <textarea name="message" rows="5" placeholder="Tell us about your event, timeline, learning goal, or payment reference."></textarea>
          </label>
          <div class="form-actions full-span">
            <p>Responses typically start within two hours.</p>
            <button class="btn btn-dark" type="submit">Prepare inquiry</button>
          </div>
        </form>
      </div>
    </section>

    <section class="stack-section">
      ${sectionHeading(
        'Frequently asked',
        'FAQ panels make the contact area feel complete.',
        'These answers handle common concerns before a visitor sends a message.'
      )}
      <div class="faq-list">
        ${faqs
          .map(
            (item, index) => `
              <article class="card faq-item">
                <button type="button" class="faq-trigger" data-faq="${index}">
                  <span>${escapeHtml(item.question)}</span>
                  <span>${state.openFaq === index ? '−' : '+'}</span>
                </button>
                ${
                  state.openFaq === index
                    ? `<p class="faq-answer">${escapeHtml(item.answer)}</p>`
                    : ''
                }
              </article>
            `
          )
          .join('')}
      </div>
    </section>
  `;
}

function handleContactSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const interest = String(formData.get('interest') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const subject = `Website inquiry: ${interest}`;
  const body = [
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Interest: ${interest}`,
    '',
    'Project notes:',
    message || 'No additional notes provided.',
  ].join('\n');

  state.contactStatus = {
    name,
    interest,
    emailHref: `mailto:beccatee.atelier@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    whatsappHref: `https://wa.me/2349077456229?text=${encodeURIComponent(body)}`,
  };
  render();
}

async function handlePaymentSubmit(form) {
  const activePlan = paymentPlans.find((plan) => plan.slug === state.selectedPlan) || paymentPlans[0];
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const reference = createPaymentReference();
  const paystackKey =
    window.__FASHION_HUB_CONFIG__?.paystackPublicKey || window.PAYSTACK_PUBLIC_KEY || '';
  const callbackUrl =
    window.__FASHION_HUB_CONFIG__?.paymentCallbackUrl ||
    `${window.location.origin}${window.location.pathname}`;

  if (!paystackKey) {
    state.paymentStatus = {
      type: 'warning',
      title: 'Paystack public key not configured.',
      message:
        'Add your public key to window.__FASHION_HUB_CONFIG__.paystackPublicKey in the HTML file to enable inline checkout on GitHub Pages.',
      reference,
      actionHref: pageUrl('contact'),
      actionLabel: 'Contact studio instead',
    };
    render();
    return;
  }

  try {
    state.paymentStatus = {
      type: 'info',
      title: 'Launching checkout...',
      message: 'The payment modal is being prepared.',
    };
    render();

    const PaystackPop = await loadPaystackScript();
    const checkout = buildPaystackInlineConfig({
      key: paystackKey,
      email,
      amount: activePlan.amount,
      planCode: activePlan.planCode,
      callbackUrl,
      reference,
      metadata: {
        customer_name: name,
        customer_phone: phone,
        plan_slug: activePlan.slug,
        plan_title: activePlan.title,
        source: 'github-pages-static-site',
      },
    });

    const handler = PaystackPop.setup({
      ...checkout,
      firstname: name,
      callback: () => {
        state.paymentStatus = {
          type: 'success',
          title: 'Checkout completed.',
          message: `Reference ${reference} was captured successfully.`,
          reference,
        };
        render();
      },
      onClose: () => {
        state.paymentStatus = {
          type: 'info',
          title: 'Checkout closed.',
          message: 'You can retry payment later or contact the studio for assisted payment.',
          reference,
        };
        render();
      },
    });

    handler.openIframe();
  } catch (error) {
    state.paymentStatus = {
      type: 'error',
      title: 'Unable to start checkout.',
      message: error instanceof Error ? error.message : 'Payment failed to start.',
      reference,
    };
    render();
  }
}

function hydratePaymentStatusFromUrl() {
  const url = new URL(window.location.href);
  const reference = url.searchParams.get('reference') || url.searchParams.get('trxref');
  if (!reference) {
    return;
  }

  state.activePage = 'payments';
  state.paymentStatus = {
    type: 'success',
    title: 'Payment callback received.',
    message: 'A Paystack callback returned to this page. Use the reference below for confirmation and follow-up.',
    reference,
  };

  window.history.replaceState({}, document.title, window.location.pathname);
}

function renderContactStatus() {
  if (!state.contactStatus) {
    return '';
  }

  return `
    <div class="status success">
      <p class="status-title">Inquiry prepared for ${escapeHtml(state.contactStatus.name || 'you')}.</p>
      <p>Send it by email or WhatsApp to complete the static-site contact flow.</p>
      <div class="button-row compact-top">
        <a class="btn btn-dark" href="${state.contactStatus.emailHref}">Send email</a>
        <a class="btn btn-ghost-dark" href="${state.contactStatus.whatsappHref}" target="_blank" rel="noreferrer">Open WhatsApp</a>
      </div>
    </div>
  `;
}

function renderPaymentStatus() {
  if (!state.paymentStatus) {
    return '';
  }

  return `
    <div class="status ${escapeHtml(state.paymentStatus.type)}">
      <p class="status-title">${escapeHtml(state.paymentStatus.title)}</p>
      <p>${escapeHtml(state.paymentStatus.message)}</p>
      ${
        state.paymentStatus.reference
          ? `<p class="reference">Reference: ${escapeHtml(state.paymentStatus.reference)}</p>`
          : ''
      }
      ${
        state.paymentStatus.actionHref
          ? `<a class="inline-link compact-top inline-block" href="${state.paymentStatus.actionHref}">${escapeHtml(
              state.paymentStatus.actionLabel || 'Continue'
            )}</a>`
          : ''
      }
    </div>
  `;
}

function sectionHeading(eyebrow, title, description) {
  return `
    <div class="section-heading">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function statCard(value, label, detail = '') {
  return `
    <article class="card stat-card">
      <p class="stat-value">${escapeHtml(value)}</p>
      <p class="stat-label">${escapeHtml(label)}</p>
      ${detail ? `<p class="stat-detail">${escapeHtml(detail)}</p>` : ''}
    </article>
  `;
}

function featureCard(title, description, cta, href) {
  return `
    <article class="card panel">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
      <a class="inline-link" href="${href}">${escapeHtml(cta)}</a>
    </article>
  `;
}

function smallFeatureCard(title, description) {
  return `
    <article class="mini-card">
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(description)}</p>
    </article>
  `;
}

function navLink(page, mobile = false) {
  const isActive = page.slug === state.activePage;
  return `
    <a
      class="${mobile ? 'mobile-link' : 'nav-link'} ${isActive ? 'active' : ''}"
      href="${pageUrl(page.slug)}"
      aria-current="${isActive ? 'page' : 'false'}"
    >
      ${escapeHtml(page.label)}
    </a>
  `;
}

function pageUrl(slug) {
  return slug === 'home' ? './index.html' : `./${slug}.html`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function loadPaystackScript() {
  if (window.PaystackPop) {
    return Promise.resolve(window.PaystackPop);
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[data-paystack-script="true"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.PaystackPop), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Paystack failed to load.')), {
        once: true,
      });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.dataset.paystackScript = 'true';
    script.onload = () => resolve(window.PaystackPop);
    script.onerror = () => reject(new Error('Paystack failed to load.'));
    document.body.appendChild(script);
  });
}
