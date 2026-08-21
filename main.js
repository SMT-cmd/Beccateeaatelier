import {
  aboutSnippet,
  academyBenefits,
  academyProgram,
  applicationFields,
  bookAndPay,
  brand,
  brandAssets,
  buildWhatsAppUrl,
  contactCards,
  curriculum,
  faqs,
  getPageMeta,
  heroContent,
  pages,
  previewContactItems,
  serviceHighlights,
  services,
  servicesWhatsappMessage,
} from './site-data.mjs';

const app = document.getElementById('app');
let revealObserver;

const state = {
  activePage: document.body.dataset.page || 'home',
  menuOpen: false,
  openFaq: 0,
  contactStatus: null,
  applicationStatus: null,
};

render();

app.addEventListener('click', (event) => {
  const menuToggle = event.target.closest('[data-menu-toggle]');
  if (menuToggle) {
    state.menuOpen = !state.menuOpen;
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

  const pageLink = event.target.closest('a[data-page-link]');
  if (pageLink instanceof HTMLAnchorElement) {
    handlePageTransition(event, pageLink);
  }
});

app.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (form.matches('[data-contact-form]')) {
    event.preventDefault();
    handleContactSubmit(form);
    return;
  }

  if (form.matches('[data-application-form]')) {
    event.preventDefault();
    handleApplicationSubmit(form);
  }
});

function render() {
  const pageMeta = getPageMeta(state.activePage);
  document.title = pageMeta.title;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', pageMeta.description);
  }

  setFavicon();
  document.body.classList.remove('page-leaving');

  app.innerHTML = `
    <div class="site-shell">
      <div class="topbar">
        <div class="container topbar-inner">
          <p>${escapeHtml(brand.topbarMessage)}</p>
          <a class="topbar-link" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
            ${iconWhatsapp()}
            <span>${escapeHtml(brand.whatsappDisplay)}</span>
          </a>
        </div>
      </div>

      <header class="site-header">
        <div class="container nav-shell">
          <a class="brand" href="${pageUrl('home')}" data-page-link>
            <img class="brand-mark" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
            <span class="brand-copy">
              <strong>${escapeHtml(brand.name)}</strong>
              <small>${escapeHtml(brand.tagline)}</small>
            </span>
          </a>

          <nav class="nav-desktop" aria-label="Primary">
            ${pages.map((page) => navLink(page)).join('')}
          </nav>

          <div class="nav-actions">
            <a
              class="btn btn-whatsapp nav-cta"
              href="https://wa.me/${brand.whatsappNumber}"
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
            <button
              class="menu-toggle ${state.menuOpen ? 'is-open' : ''}"
              type="button"
              data-menu-toggle
              aria-expanded="${state.menuOpen ? 'true' : 'false'}"
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
              <span class="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>

        ${
          state.menuOpen
            ? `
          <div class="container mobile-menu">
            ${pages.map((page) => navLink(page, true)).join('')}
            <a class="btn btn-whatsapp mobile-whatsapp" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
          </div>
        `
            : ''
        }
      </header>

      <main class="page-main">
        <div class="page-transition-shell" data-page-transition>
          ${renderPageBody()}
        </div>
      </main>

      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand">
            <img class="footer-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
            <div>
              <p class="footer-title">${escapeHtml(brand.name)}</p>
              <p class="footer-tagline">${escapeHtml(brand.tagline)}</p>
            </div>
          </div>
          <div class="footer-details">
            <p>WhatsApp: <a href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">${escapeHtml(brand.whatsappDisplay)}</a></p>
            <p>Phone: <a href="tel:+2347065854471">${escapeHtml(brand.phoneDisplay)}</a></p>
            <p>Email: <a href="mailto:${brand.email}">${escapeHtml(brand.email)}</a></p>
            <p>Instagram: <a href="${brand.instagramUrl}" target="_blank" rel="noreferrer">${escapeHtml(brand.instagram)}</a></p>
            <p>Location: <a href="${brand.mapsUrl}" target="_blank" rel="noreferrer">${escapeHtml(brand.location)}</a></p>
            <p>© 2026 ${escapeHtml(brand.name)}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <a
        class="floating-whatsapp"
        href="https://wa.me/${brand.whatsappNumber}"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with Beccatee Atelier on WhatsApp"
      >
        ${iconWhatsapp()}
        <span>WhatsApp</span>
      </a>
    </div>
  `;

  hydrateUi();
}

function renderPageBody() {
  switch (state.activePage) {
    case 'services':
      return renderServicesPage();
    case 'academy':
      return renderAcademyPage();
    case 'contact':
      return renderContactPage();
    default:
      return renderHomePage();
  }
}

function renderHomePage() {
  return `
    <section class="hero-banner">
      <div class="container hero-stack">
        <a
          class="hero-flyer-link"
          href="${heroContent.ctaHref}"
          data-page-link
          aria-label="Open academy application"
        >
          <img
            class="hero-flyer"
            src="${brandAssets.trainingFlyer}"
            data-fallback-src="${brandAssets.trainingFlyerFallback}"
            alt="12 Weekends Intermediate Fashion Training flyer"
          />
          <div class="hero-overlay"></div>
        </a>

        <div class="hero-copy accent-panel" data-reveal-group>
          <div data-reveal>
            <p class="eyebrow">${escapeHtml(heroContent.eyebrow)}</p>
            <h1>${escapeHtml(heroContent.title)}</h1>
            <p class="hero-detail">${escapeHtml(heroContent.detail)}</p>
          </div>
          <div class="hero-actions" data-reveal>
            <a class="btn btn-gold" href="${heroContent.ctaHref}" data-page-link>${escapeHtml(heroContent.ctaLabel)}</a>
            <a
              class="btn btn-outline"
              href="${buildWhatsAppUrl(heroContent.secondaryMessage)}"
              target="_blank"
              rel="noreferrer"
            >
              ${escapeHtml(heroContent.secondaryLabel)}
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="ticker-bar" aria-label="${escapeHtml(brand.tagline)}">
      <div class="ticker-track">
        ${Array.from({ length: 10 }, () => `<span>${escapeHtml(brand.tagline)}</span>`).join('')}
      </div>
    </section>

    <section class="page-section">
      <div class="container">
        <section class="about-snippet" id="home-about" data-reveal-group>
          <img class="about-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" data-reveal />
          <div data-reveal>
            <p class="eyebrow">${escapeHtml(aboutSnippet.eyebrow)}</p>
            <h2>${escapeHtml(aboutSnippet.title)}</h2>
            <p>${escapeHtml(aboutSnippet.body)}</p>
            <p class="about-note">${escapeHtml(aboutSnippet.note)}</p>
            <a class="text-link compact-link" href="${brandAssets.brandLabelPdf}" target="_blank" rel="noreferrer">
              View brand label
            </a>
          </div>
        </section>

        <section class="stack-section" data-reveal-group>
          ${sectionHeading(
            'Services',
            'Luxury womenswear for weddings, events, and statement everyday dressing.',
            'The services flyer below opens a WhatsApp conversation instantly so you can book the right service without delay.',
            true
          )}
          <a
            class="flyer-card"
            href="${buildWhatsAppUrl(servicesWhatsappMessage)}"
            target="_blank"
            rel="noreferrer"
            data-reveal
          >
            <img
              class="flyer-image flyer-services"
              src="${brandAssets.servicesFlyer}"
              alt="Beccatee Atelier services flyer"
            />
          </a>
          <div class="cards-grid three-up compact-top" data-reveal>
            ${serviceHighlights.map((item) => simpleCard(item)).join('')}
          </div>
          <div class="section-actions" data-reveal>
            <a class="btn btn-whatsapp" href="${buildWhatsAppUrl(servicesWhatsappMessage)}" target="_blank" rel="noreferrer">
              Book a Service
            </a>
            <a class="btn btn-outline" href="${pageUrl('services')}" data-page-link>
              Explore Services
            </a>
          </div>
        </section>

        <section class="stack-section" data-reveal-group>
          ${sectionHeading(
            'Academy',
            academyProgram.heading,
            academyProgram.preview,
            true
          )}
          <div class="cards-grid two-up compact-top" data-reveal>
            <article class="preview-card accent-panel">
              <p>${escapeHtml(academyProgram.intro)}</p>
              <p>${escapeHtml(academyProgram.accent)}</p>
            </article>
            <article class="preview-card">
              <ul class="feature-list">
                ${academyBenefits.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
            </article>
          </div>
          <div class="section-actions" data-reveal>
            <a class="btn btn-gold" href="${pageUrl('academy')}#apply-form" data-page-link>
              ${escapeHtml(heroContent.ctaLabel)}
            </a>
            <a
              class="btn btn-whatsapp"
              href="${buildWhatsAppUrl('Hi Beccatee Atelier, I want details about the 12 Weekends Intermediate Fashion Training.')}"
              target="_blank"
              rel="noreferrer"
            >
              Ask on WhatsApp
            </a>
          </div>
        </section>

        <section class="stack-section" data-reveal-group>
          ${sectionHeading(
            'Contact',
            'One primary number for bookings, enquiries, and academy applications.',
            'Use WhatsApp, phone, or email, but the fastest path is still a direct WhatsApp message to the studio.',
            true
          )}
          <div class="cards-grid contact-preview-grid compact-top" data-reveal>
            ${previewContactItems.map((item) => `<article class="info-card"><p>${escapeHtml(item)}</p></article>`).join('')}
          </div>
          <div class="section-actions" data-reveal>
            <a class="btn btn-whatsapp" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
            <a class="btn btn-outline" href="${pageUrl('contact')}" data-page-link>
              Contact the Studio
            </a>
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderServicesPage() {
  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro(
          'Services',
          'Bridal, aso ebi, children wears, bespoke dresses, tailored-to-wear, and ready-to-wear pieces crafted with a premium Beccatee Atelier finish.'
        )}

        <div class="services-hero stack-section" data-reveal-group>
          <a
            class="flyer-card flyer-card-wide"
            href="${buildWhatsAppUrl(servicesWhatsappMessage)}"
            target="_blank"
            rel="noreferrer"
            data-reveal
          >
            <img class="flyer-image flyer-full" src="${brandAssets.servicesFlyer}" alt="Beccatee Atelier services flyer" />
          </a>
          <div class="section-actions" data-reveal>
            <a class="btn btn-whatsapp" href="${buildWhatsAppUrl(servicesWhatsappMessage)}" target="_blank" rel="noreferrer">
              Book from WhatsApp
            </a>
          </div>
        </div>

        <section class="stack-section" data-reveal-group>
          <div class="cards-grid three-up" data-reveal>
            ${services
              .map(
                (service) => `
                  <article class="service-card">
                    <p class="eyebrow">Service</p>
                    <h3>${escapeHtml(service.title)}</h3>
                    <p>${escapeHtml(service.description)}</p>
                    <a
                      class="btn btn-whatsapp"
                      href="${buildWhatsAppUrl(`Hi Beccatee Atelier, I want to book ${service.title}. Please share the next steps.`)}"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Book on WhatsApp
                    </a>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="stack-section" data-reveal-group>
          <div class="cards-grid two-up" data-reveal>
            <article class="preview-card">
              <p class="eyebrow">How It Works</p>
              <h2>Share your brief, measurements, event date, and references.</h2>
              <p>We use WhatsApp to confirm the style direction, production flow, and the next step for your booking.</p>
            </article>
            <article class="preview-card accent-panel">
              <p class="eyebrow">Primary Contact</p>
              <h2>${escapeHtml(brand.whatsappDisplay)}</h2>
              <p>Use this same number for service bookings, academy questions, payment guidance, and follow-up enquiries.</p>
            </article>
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderAcademyPage() {
  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro(academyProgram.heading, academyProgram.intro)}

        <div class="academy-flyer-wrap stack-section" data-reveal-group>
          <img
            class="flyer-image flyer-medium"
            src="${brandAssets.trainingFlyer}"
            data-fallback-src="${brandAssets.trainingFlyerFallback}"
            alt="12 Weekends Intermediate Fashion Training flyer"
            data-reveal
          />
          <div class="section-actions" data-reveal>
            <a class="btn btn-gold" href="#apply-form">${escapeHtml(heroContent.ctaLabel)}</a>
            <a
              class="btn btn-whatsapp"
              href="${buildWhatsAppUrl('Hi Beccatee Atelier, I want to ask a question before applying for the fashion training.')}"
              target="_blank"
              rel="noreferrer"
            >
              Ask Before Applying
            </a>
          </div>
        </div>

        <section class="stack-section" data-reveal-group>
          <article class="detail-card accent-panel" data-reveal>
            <p class="eyebrow">Program Details</p>
            <h2>Weekend training with direct WhatsApp follow-up.</h2>
            <p>${escapeHtml(academyProgram.accent)}</p>
            <dl class="detail-list compact-top">
              ${academyProgram.details
                .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
                .join('')}
            </dl>
          </article>
        </section>

        <section class="stack-section" data-reveal-group>
          ${sectionHeading(
            'Benefits',
            'Why this academy path works for serious learners.',
            'The program is structured for practical weekend momentum, not passive watching.',
            true
          )}
          <div class="cards-grid two-up compact-top" data-reveal>
            ${academyBenefits.map((item) => simpleCard(item)).join('')}
          </div>
        </section>

        <section class="stack-section" data-reveal-group>
          ${sectionHeading(
            'Curriculum',
            'What you will learn across the 12 weekends.',
            'Each curriculum block builds technical confidence in fit, shaping, variation, and finishing.',
            true
          )}
          <div class="cards-grid three-up compact-top" data-reveal>
            ${curriculum
              .map(
                (group) => `
                  <article class="curriculum-card">
                    <p class="eyebrow">Module</p>
                    <h3>${escapeHtml(group.title)}</h3>
                    <ul class="feature-list">
                      ${group.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
                    </ul>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="stack-section" data-reveal-group>
          <article class="form-card" id="apply-form" data-reveal>
            <p class="eyebrow">Apply Now</p>
            <h2>Send your full application to WhatsApp.</h2>
            <p>Complete the form below. We will prepare a formatted WhatsApp message with your application details.</p>
            ${renderApplicationStatus()}
            <form class="form-grid compact-top" data-application-form>
              <label>
                <span>Full Name</span>
                <input type="text" name="name" autocomplete="name" required />
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" autocomplete="tel" required />
              </label>
              <label>
                <span>WhatsApp Number</span>
                <input type="tel" name="whatsapp" autocomplete="tel" placeholder="Use the same number if preferred" />
              </label>
              <label>
                <span>Email Address</span>
                <input type="email" name="email" autocomplete="email" required />
              </label>
              <label>
                <span>City / State</span>
                <input type="text" name="location" required />
              </label>
              <label>
                <span>Experience Level</span>
                <select name="experience" required>
                  ${applicationFields.experienceOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label>
                <span>Main Goal</span>
                <select name="focus" required>
                  ${applicationFields.focusOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label>
                <span>Weekend Availability</span>
                <select name="availability" required>
                  ${applicationFields.availabilityOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label>
                <span>How did you hear about us?</span>
                <select name="referral" required>
                  ${applicationFields.referralOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label class="full-span">
                <span>Tell us why you want to join this training.</span>
                <textarea name="reason" rows="5" required></textarea>
              </label>
              <label class="full-span">
                <span>Anything else we should know?</span>
                <textarea name="notes" rows="4" placeholder="Optional"></textarea>
              </label>
              <div class="full-span form-actions">
                <p>Need fee guidance before payment? Submit the application, then continue the conversation on WhatsApp.</p>
                <button class="btn btn-gold" type="submit">Send Application via WhatsApp</button>
              </div>
            </form>
          </article>
        </section>
      </div>
    </section>
  `;
}

function renderContactPage() {
  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro(
          'Contact',
          'Use the same primary number for bespoke orders, academy applications, payment guidance, and all general enquiries.'
        )}

        <section class="contact-layout stack-section" data-reveal-group>
          <div class="stack-list" data-reveal>
            ${contactCards
              .map(
                (card, index) => `
                  <article class="contact-card ${index === 0 ? 'contact-card-primary' : ''}">
                    <p class="eyebrow">${escapeHtml(card.label)}</p>
                    <h2>${escapeHtml(card.value)}</h2>
                    ${
                      card.href
                        ? `<a class="${index === 0 ? 'btn btn-whatsapp' : 'text-link'}" href="${card.href}" target="${card.href.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">${index === 0 ? 'Chat on WhatsApp' : 'Open'}</a>`
                        : ''
                    }
                  </article>
                `
              )
              .join('')}
          </div>

          <div class="stack-list" data-reveal>
            <article class="preview-card accent-panel">
              <p class="eyebrow">${escapeHtml(bookAndPay.eyebrow)}</p>
              <h2>${escapeHtml(bookAndPay.title)}</h2>
              <p>${escapeHtml(bookAndPay.body)}</p>
              <ul class="feature-list">
                ${bookAndPay.points.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}
              </ul>
              <div class="section-actions">
                <a
                  class="btn btn-gold"
                  href="${buildWhatsAppUrl(bookAndPay.ctaMessage)}"
                  target="_blank"
                  rel="noreferrer"
                >
                  ${escapeHtml(bookAndPay.ctaLabel)}
                </a>
              </div>
            </article>

            <article class="form-card">
              <p class="eyebrow">Quick Inquiry</p>
              <h2>Send your message straight to WhatsApp.</h2>
              <p>Share what you need and we will prepare the message for you instantly.</p>
              ${renderContactStatus()}
              <form class="form-grid compact-top" data-contact-form>
                <label>
                  <span>Name</span>
                  <input type="text" name="name" autocomplete="name" required />
                </label>
                <label>
                  <span>Phone</span>
                  <input type="tel" name="phone" autocomplete="tel" required />
                </label>
                <label>
                  <span>What do you need?</span>
                  <select name="interest" required>
                    <option>Bespoke booking</option>
                    <option>Bridal enquiry</option>
                    <option>Academy application</option>
                    <option>Payment guidance</option>
                  </select>
                </label>
                <label>
                  <span>Preferred response</span>
                  <select name="response" required>
                    <option>WhatsApp</option>
                    <option>Phone call</option>
                  </select>
                </label>
                <label class="full-span">
                  <span>Message</span>
                  <textarea name="message" rows="6" required></textarea>
                </label>
                <div class="full-span form-actions">
                  <p>Primary response channel: WhatsApp on ${escapeHtml(brand.whatsappDisplay)}.</p>
                  <button class="btn btn-whatsapp" type="submit">Send via WhatsApp</button>
                </div>
              </form>
            </article>
          </div>
        </section>

        <section class="stack-section" data-reveal-group>
          ${sectionHeading(
            'FAQ',
            'Answers before you send your message.',
            'Use these quick notes for common service, academy, and booking questions.',
            true
          )}
          <div class="faq-list compact-top" data-reveal>
            ${faqs
              .map(
                (item, index) => `
                  <article class="faq-item">
                    <button type="button" class="faq-trigger" data-faq="${index}">
                      <span>${escapeHtml(item.question)}</span>
                      <span>${state.openFaq === index ? '−' : '+'}</span>
                    </button>
                    ${state.openFaq === index ? `<p class="faq-answer">${escapeHtml(item.answer)}</p>` : ''}
                  </article>
                `
              )
              .join('')}
          </div>
        </section>
      </div>
    </section>
  `;
}

function hydrateUi() {
  setupPageReadyState();
  setupImageFallbacks();
  setupRevealAnimations();
}

function setupPageReadyState() {
  const transitionShell = app.querySelector('[data-page-transition]');
  if (!transitionShell) {
    return;
  }

  requestAnimationFrame(() => {
    transitionShell.classList.add('is-ready');
  });
}

function setupImageFallbacks() {
  app.querySelectorAll('img[data-fallback-src]').forEach((image) => {
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackBound === 'true') {
      return;
    }

    image.dataset.fallbackBound = 'true';
    image.addEventListener('error', () => {
      const fallbackSrc = image.dataset.fallbackSrc;
      if (fallbackSrc && image.getAttribute('src') !== fallbackSrc) {
        image.setAttribute('src', fallbackSrc);
      }
    });
  });
}

function setupRevealAnimations() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  app.querySelectorAll('[data-reveal-group]').forEach((group) => {
    const revealChildren = Array.from(group.children).filter((child) => child.hasAttribute('data-reveal'));
    revealChildren.forEach((child, index) => {
      child.style.setProperty('--reveal-delay', `${index * 0.1}s`);
    });
  });

  const revealTargets = app.querySelectorAll('[data-reveal]');
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  revealTargets.forEach((target) => {
    revealObserver.observe(target);
  });
}

function handlePageTransition(event, anchor) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  const href = anchor.getAttribute('href');
  if (!href) {
    return;
  }

  const nextUrl = new URL(href, window.location.href);
  const sameDestination =
    nextUrl.pathname === window.location.pathname && nextUrl.hash === window.location.hash;

  if (sameDestination) {
    if (state.menuOpen) {
      state.menuOpen = false;
      render();
    }
    return;
  }

  event.preventDefault();
  document.body.classList.add('page-leaving');

  window.setTimeout(() => {
    window.location.href = nextUrl.toString();
  }, 200);
}

function handleContactSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const interest = String(formData.get('interest') || '').trim();
  const response = String(formData.get('response') || '').trim();
  const message = String(formData.get('message') || '').trim();

  const whatsappMessage = [
    'Hello Beccatee Atelier, I have a new website enquiry.',
    '',
    'CONTACT FORM DETAILS',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Interest: ${interest}`,
    `Preferred response: ${response}`,
    `Message: ${message || 'No additional message provided.'}`,
  ].join('\n');

  state.contactStatus = {
    name,
    whatsappHref: buildWhatsAppUrl(whatsappMessage),
  };

  openExternalTarget(state.contactStatus.whatsappHref);
  render();
}

function handleApplicationSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const whatsapp = String(formData.get('whatsapp') || '').trim() || phone;
  const email = String(formData.get('email') || '').trim();
  const location = String(formData.get('location') || '').trim();
  const experience = String(formData.get('experience') || '').trim();
  const focus = String(formData.get('focus') || '').trim();
  const availability = String(formData.get('availability') || '').trim();
  const referral = String(formData.get('referral') || '').trim();
  const reason = String(formData.get('reason') || '').trim();
  const notes = String(formData.get('notes') || '').trim();

  const whatsappMessage = [
    'Hello Beccatee Atelier, I am applying for the 12 Weekends Intermediate Fashion Training.',
    '',
    'ACADEMY APPLICATION',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `WhatsApp: ${whatsapp}`,
    `Email: ${email}`,
    `Location: ${location}`,
    `Experience: ${experience}`,
    `Main goal: ${focus}`,
    `Weekend availability: ${availability}`,
    `Referral source: ${referral}`,
    `Why I want to join: ${reason}`,
    `Additional notes: ${notes || 'None'}`,
  ].join('\n');

  state.applicationStatus = {
    whatsappHref: buildWhatsAppUrl(whatsappMessage),
  };

  openExternalTarget(state.applicationStatus.whatsappHref);
  render();
}

function renderContactStatus() {
  if (!state.contactStatus) {
    return '';
  }

  return `
    <div class="status success">
      <p class="status-title">WhatsApp message prepared for ${escapeHtml(state.contactStatus.name || 'you')}.</p>
      <p>If WhatsApp did not open automatically, use the button below to continue.</p>
      <div class="button-row compact-top">
        <a class="btn btn-whatsapp" href="${state.contactStatus.whatsappHref}" target="_blank" rel="noreferrer">Open WhatsApp</a>
      </div>
    </div>
  `;
}

function renderApplicationStatus() {
  if (!state.applicationStatus) {
    return '';
  }

  return `
    <div class="status success">
      <p class="status-title">Application message prepared for WhatsApp.</p>
      <p>Open WhatsApp to submit your details and continue with payment guidance and slot confirmation.</p>
      <div class="button-row compact-top">
        <a class="btn btn-whatsapp" href="${state.applicationStatus.whatsappHref}" target="_blank" rel="noreferrer">Open WhatsApp</a>
      </div>
    </div>
  `;
}

function sectionHeading(eyebrow, title, description, reveal = false) {
  return `
    <div class="section-heading${reveal ? ' is-reveal-block' : ''}"${reveal ? ' data-reveal' : ''}>
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function pageIntro(title, description) {
  return `
    <div class="page-intro" data-reveal-group>
      <div data-reveal>
        <p class="eyebrow">${escapeHtml(brand.fullName)}</p>
        <h1>${escapeHtml(title)}</h1>
        <p>${escapeHtml(description)}</p>
      </div>
    </div>
  `;
}

function simpleCard(text) {
  return `
    <article class="info-card">
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function navLink(page, mobile = false) {
  const isActive = page.slug === state.activePage;
  const baseClass = mobile ? 'mobile-link' : 'nav-link';

  return `
    <a
      class="${baseClass} ${isActive ? 'active' : ''}"
      href="${pageUrl(page.slug)}"
      data-page-link
      aria-current="${isActive ? 'page' : 'false'}"
    >
      ${escapeHtml(page.label)}
    </a>
  `;
}

function pageUrl(slug) {
  return slug === 'home' ? './index.html' : `./${slug}.html`;
}

function setFavicon() {
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    document.head.appendChild(favicon);
  }

  favicon.setAttribute('href', brandAssets.favicon);
  favicon.setAttribute('type', 'image/png');
}

function openExternalTarget(primaryHref) {
  try {
    const opened = window.open(primaryHref, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = primaryHref;
    }
  } catch {
    window.location.href = primaryHref;
  }
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function iconWhatsapp() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2.2A9.78 9.78 0 0 0 3.64 17.1L2 22l5.02-1.57A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8.03 8.03 0 0 1-4.07-1.11l-.29-.17-2.98.93.97-2.9-.19-.3A8.06 8.06 0 1 1 12 20Zm4.41-5.95c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.24 1.01.38 1.36.49.57.18 1.08.15 1.49.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" fill="currentColor"/>
    </svg>
  `;
}
