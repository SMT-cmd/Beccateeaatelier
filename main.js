import {
  academyApplicationFields,
  academyPreview,
  academyProgram,
  brand,
  brandAssets,
  buildWhatsAppUrl,
  contactFaqs,
  contactItems,
  curriculum,
  footerPages,
  getPageMeta,
  homeAbout,
  homeHero,
  navPages,
  services,
  servicesFlyerMessage,
} from './site-data.mjs';

const app = document.getElementById('app');

const state = {
  activePage: document.body.dataset.page || 'home',
  menuOpen: false,
  openFaq: 0,
  contactStatus: null,
  applicationStatus: null,
};

let revealObserver;

render();

app.addEventListener('click', (event) => {
  const transitionLink = event.target.closest('a[data-page-link]');
  if (transitionLink && shouldHandlePageTransition(transitionLink)) {
    event.preventDefault();
    navigateWithTransition(transitionLink.getAttribute('href') || transitionLink.href);
    return;
  }

  const menuToggle = event.target.closest('[data-menu-toggle]');
  if (menuToggle) {
    state.menuOpen = !state.menuOpen;
    render();
    return;
  }

  const faqTrigger = event.target.closest('[data-faq]');
  if (faqTrigger) {
    const index = Number(faqTrigger.dataset.faq);
    state.openFaq = state.openFaq === index ? -1 : index;
    render();
  }
});

app.addEventListener('submit', (event) => {
  const form = event.target;
  if (!(form instanceof HTMLFormElement)) {
    return;
  }

  if (form.matches('[data-application-form]')) {
    event.preventDefault();
    handleApplicationSubmit(form);
    return;
  }

  if (form.matches('[data-contact-form]')) {
    event.preventDefault();
    handleContactSubmit(form);
  }
});

function render() {
  const pageMeta = getPageMeta(state.activePage);
  document.title = pageMeta.title;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.setAttribute('content', pageMeta.description);
  }

  app.innerHTML = `
    <div class="site-shell">
      <div class="topbar">
        <div class="container topbar-inner">
          <p>${escapeHtml(brand.topbarMessage)}</p>
          <a class="topbar-link" href="${brand.whatsappUrl}" target="_blank" rel="noreferrer">
            ${iconWhatsapp()}
            <span>${escapeHtml(brand.phoneDisplay)}</span>
          </a>
        </div>
      </div>

      <header class="site-header">
        <div class="container nav-shell">
          <a class="brand" href="./index.html" data-page-link aria-label="${escapeHtml(brand.name)} home">
            <img class="brand-mark" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
            <span class="brand-copy">
              <strong>${escapeHtml(brand.name)}</strong>
              <small>${escapeHtml(brand.tagline)}</small>
            </span>
          </a>

          <nav class="nav-desktop" aria-label="Primary">
            ${navPages.map((page) => navLink(page)).join('')}
          </nav>

          <div class="nav-actions">
            <a class="btn btn-whatsapp nav-cta" href="${brand.whatsappUrl}" target="_blank" rel="noreferrer">
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
            </button>
          </div>
        </div>

        <div class="container mobile-menu ${state.menuOpen ? 'is-open' : ''}">
          ${navPages.map((page) => navLink(page, true)).join('')}
        </div>
      </header>

      <main class="page-main">
        ${renderPage()}
      </main>

      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand reveal" style="--reveal-delay:0s">
            <img class="footer-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
            <div>
              <p class="footer-title">${escapeHtml(brand.name)}</p>
              <p class="footer-tagline">${escapeHtml(brand.tagline)}</p>
            </div>
          </div>
          <div class="footer-details reveal" style="--reveal-delay:0.1s">
            <p>WhatsApp: <a href="${brand.whatsappUrl}" target="_blank" rel="noreferrer">${escapeHtml(brand.phoneDisplay)}</a></p>
            <p>Phone: <a href="${brand.phoneHref}">${escapeHtml(brand.phoneDisplay)}</a></p>
            <p>Email: <a href="mailto:${brand.email}">${escapeHtml(brand.email)}</a></p>
            <p>Instagram: <a href="${brand.instagramUrl}" target="_blank" rel="noreferrer">${escapeHtml(brand.instagram)}</a></p>
            <p>Location: <a href="${brand.mapsUrl}" target="_blank" rel="noreferrer">${escapeHtml(brand.location)}</a></p>
            <p>Pages: ${footerPages.map((page) => footerLink(page)).join(' <span aria-hidden="true">|</span> ')}</p>
          </div>
        </div>
      </footer>

      <a class="floating-whatsapp" href="${brand.whatsappUrl}" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
        ${iconWhatsapp()}
        <span>WhatsApp</span>
      </a>
    </div>
  `;

  enhanceUi();
}

function renderPage() {
  switch (state.activePage) {
    case 'about':
      return renderAboutPage();
    case 'services':
      return renderServicesPage();
    case 'academy':
      return renderAcademyPage();
    case 'contact':
      return renderContactPage();
    case 'privacy':
      return renderPrivacyPage();
    case 'terms':
      return renderTermsPage();
    default:
      return renderHomePage();
  }
}

function renderHomePage() {
  return `
    <section class="hero-banner">
      <img class="hero-image" src="${brandAssets.trainingFlyer}" alt="${escapeHtml(homeHero.imageAlt)}" />
    </section>

    <section class="hero-action-strip">
      <div class="container hero-action-wrap reveal" style="--reveal-delay:0s">
        <a class="btn btn-gold hero-cta-button" href="${homeHero.ctaHref}" data-page-link>${escapeHtml(homeHero.ctaLabel)}</a>
      </div>
    </section>

    <section class="marquee-bar" aria-label="${escapeHtml(brand.tagline)}">
      <div class="marquee-track">
        ${Array.from({ length: 10 }, () => `<span>${escapeHtml(brand.tagline)}</span>`).join('')}
      </div>
    </section>

    <section class="page-section">
      <div class="container">
        <section class="section-block">
          ${sectionHeading(homeAbout.eyebrow, homeAbout.title, homeAbout.body)}
        </section>

        <section class="section-block">
          ${sectionHeading(
            'Services',
            'Bespoke fashion services for weddings, events, and standout everyday style.',
            'Browse our signature services and book directly on WhatsApp.'
          )}
          <a class="flyer-frame reveal" style="--reveal-delay:0.1s" href="${buildWhatsAppUrl(servicesFlyerMessage)}" target="_blank" rel="noreferrer">
            <img class="section-flyer" src="${brandAssets.servicesFlyer}" alt="Beccatee Atelier services flyer" />
          </a>
          <div class="card-grid card-grid-services">
            ${services.map((service, index) => serviceCard(service, index)).join('')}
          </div>
        </section>

        <section class="section-block">
          ${sectionHeading(
            academyPreview.eyebrow,
            'Weekend training for aspiring fashion designers who want stronger finishing and better structure.',
            'Apply for the upcoming intermediate cohort and send your details on WhatsApp.'
          )}
          <article class="glass-card academy-preview-card reveal" style="--reveal-delay:0.1s">
            <p class="card-label">Upcoming Cohort</p>
            <h3>${escapeHtml(academyPreview.title)}</h3>
            <div class="button-row">
              <a class="btn btn-gold" href="${academyPreview.href}" data-page-link>Open Academy Page</a>
            </div>
          </article>
        </section>

        <section class="section-block">
          ${sectionHeading(
            'Contact',
            'Reach Beccatee Atelier quickly for bookings, academy questions, and styling inquiries.',
            'WhatsApp is the fastest way to get started.'
          )}
          <div class="contact-preview reveal" style="--reveal-delay:0.1s">
            <a class="btn btn-whatsapp" href="${brand.whatsappUrl}" target="_blank" rel="noreferrer">Chat on WhatsApp</a>
            <div class="contact-preview-list">
              <p>${escapeHtml(brand.phoneDisplay)}</p>
              <p>${escapeHtml(brand.email)}</p>
              <p>${escapeHtml(brand.location)}</p>
            </div>
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderAboutPage() {
  const differentiators = [
    'Bespoke & Training under one roof',
    '10+ industrial machines',
    'Weekend academy for working professionals',
    'Precision fitting and finishing',
  ];

  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro('About Beccatee Atelier', brand.tagline)}

        <section class="section-block">
          ${sectionHeading(
            'Our Story',
            'Premium Nigerian fashion built on precision, creativity, and craftsmanship.',
            'Beccatee Atelier is a premium Nigerian fashion house built on precision, creativity, and craftsmanship. With 10+ industrial sewing machines and a dedicated studio at RCCG Redemption Camp, we deliver bespoke tailoring, bridal wear, aso ebi, childrenswear, and structured weekend fashion training.'
          )}
        </section>

        <section class="section-block">
          ${sectionHeading(
            'What Sets Us Apart',
            'Why clients and students choose Beccatee Atelier.',
            'Our atelier combines expert garment production with practical weekend training in one polished studio experience.'
          )}
          <div class="card-grid card-grid-services">
            ${differentiators
              .map(
                (item, index) => `
                  <article class="glass-card service-card reveal" style="--reveal-delay:${(index * 0.08).toFixed(2)}s">
                    <p class="card-label">Beccatee Atelier</p>
                    <h3>${escapeHtml(item)}</h3>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="section-block">
          ${sectionHeading(
            'Visit The Studio',
            'Find us at RCCG Redemption Camp.',
            'We welcome fittings, bookings, and academy inquiries from our studio along the Lagos-Ibadan Expressway.'
          )}
          <article class="glass-card reveal" style="--reveal-delay:0.08s">
            <p class="card-label">Location</p>
            <p class="detail-value">${escapeHtml(brand.location)}</p>
            <div class="button-row">
              <a class="btn btn-gold" href="./services.html" data-page-link>Book a Service</a>
              <a class="btn btn-whatsapp" href="./academy.html" data-page-link>Join the Academy</a>
            </div>
          </article>
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
          'Our Services',
          'Bridal dresses, aso ebi, childrenswear, bespoke dresses, tailored-to-wear, and ready-to-wear pieces made with precision.'
        )}
        <a class="flyer-frame reveal" style="--reveal-delay:0.08s" href="${buildWhatsAppUrl(servicesFlyerMessage)}" target="_blank" rel="noreferrer">
          <img class="section-flyer" src="${brandAssets.servicesFlyer}" alt="Beccatee Atelier services flyer" />
        </a>
        <div class="card-grid card-grid-services">
          ${services.map((service, index) => serviceCard(service, index)).join('')}
        </div>
      </div>
    </section>
  `;
}

function renderAcademyPage() {
  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro(
          academyProgram.title,
          'A 12-weekends intermediate fashion training focused on practical pattern adaptation, construction, and finishing.'
        )}

        <div class="academy-layout">
          <div class="academy-flyer reveal" style="--reveal-delay:0.05s">
            <img class="academy-image" src="${brandAssets.trainingFlyer}" alt="${escapeHtml(homeHero.imageAlt)}" />
          </div>
          <article class="glass-card reveal" style="--reveal-delay:0.15s">
            <p class="eyebrow">Program Details</p>
            <div class="detail-grid">
              ${academyProgram.details
                .map(
                  ([label, value]) => `
                    <div class="detail-item">
                      <p class="detail-label">${escapeHtml(label)}</p>
                      <p class="detail-value">${escapeHtml(value)}</p>
                    </div>
                  `
                )
                .join('')}
            </div>
          </article>
        </div>

        <section class="section-block">
          ${sectionHeading(
            'Curriculum',
            'Intermediate construction and pattern topics covered during the program.',
            'The curriculum below reflects the corrected flyer content.'
          )}
          <div class="card-grid curriculum-grid">
            ${curriculum
              .map(
                (group, index) => `
                  <article class="glass-card reveal" style="--reveal-delay:${(index * 0.1).toFixed(2)}s">
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

        <section class="section-block" id="application-form">
          <article class="glass-card reveal" style="--reveal-delay:0.05s">
            <p class="eyebrow">Application Form</p>
            <h2>Apply for the next cohort</h2>
            <p class="section-copy">Complete the form and your application will open in WhatsApp with all fields pre-filled.</p>
            ${renderApplicationStatus()}
            <form class="form-grid" data-application-form>
              <label>
                <span>Full Name</span>
                <input type="text" name="fullName" required />
              </label>
              <label>
                <span>Phone</span>
                <input type="tel" name="phone" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" required />
              </label>
              <label>
                <span>WhatsApp (if different)</span>
                <input type="tel" name="whatsapp" />
              </label>
              <label>
                <span>Prior Experience</span>
                <select name="experience" required>
                  ${academyApplicationFields.experienceOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label>
                <span>How did you hear about us?</span>
                <select name="referral" required>
                  ${academyApplicationFields.referralOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label class="full-span">
                <span>Why fashion design</span>
                <textarea name="reason" rows="5" required></textarea>
              </label>
              <div class="full-span form-actions">
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
        <section class="contact-hero">
          <img class="contact-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
          <div class="reveal" style="--reveal-delay:0.05s">
            <p class="eyebrow">Contact</p>
            <h1>Talk to Beccatee Atelier</h1>
            <p class="section-copy">Book your service, ask academy questions, or send a quick inquiry on WhatsApp.</p>
            <a class="btn btn-whatsapp btn-whatsapp-large" href="${brand.whatsappUrl}" target="_blank" rel="noreferrer">
              ${iconWhatsapp()}
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </section>

        <div class="card-grid contact-detail-grid">
          ${contactItems
            .map(
              (item, index) => `
                <article class="glass-card reveal" style="--reveal-delay:${(index * 0.08).toFixed(2)}s">
                  <p class="card-label">${escapeHtml(item.label)}</p>
                  <p class="detail-value">${escapeHtml(item.value)}</p>
                  <a class="text-link" href="${item.href}" target="${item.href.startsWith('tel:') ? '_self' : '_blank'}" rel="noreferrer">Open</a>
                </article>
              `
            )
            .join('')}
        </div>

        <section class="section-block">
          <article class="glass-card reveal" style="--reveal-delay:0.05s">
            <p class="eyebrow">Inquiry Form</p>
            <h2>Send an inquiry via WhatsApp</h2>
            <p class="section-copy">Share your name, phone, and message, then send it directly on WhatsApp.</p>
            ${renderContactStatus()}
            <form class="form-grid" data-contact-form>
              <label>
                <span>Name</span>
                <input type="text" name="name" required />
              </label>
              <label>
                <span>Phone</span>
                <input type="tel" name="phone" required />
              </label>
              <label class="full-span">
                <span>Message</span>
                <textarea name="message" rows="5" required></textarea>
              </label>
              <div class="full-span form-actions">
                <button class="btn btn-whatsapp" type="submit">Send via WhatsApp</button>
              </div>
            </form>
          </article>
        </section>

        <section class="section-block">
          ${sectionHeading('FAQ', 'Frequently asked questions', 'Quick answers for ordering and academy planning.')}
          <div class="faq-list">
            ${contactFaqs
              .map(
                (faq, index) => `
                  <article class="glass-card faq-item reveal" style="--reveal-delay:${(index * 0.08).toFixed(2)}s">
                    <button class="faq-trigger" type="button" data-faq="${index}" aria-expanded="${state.openFaq === index ? 'true' : 'false'}">
                      <span>${escapeHtml(faq.question)}</span>
                      <span>${state.openFaq === index ? '−' : '+'}</span>
                    </button>
                    ${state.openFaq === index ? `<p class="faq-answer">${escapeHtml(faq.answer)}</p>` : ''}
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

function renderPrivacyPage() {
  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro('Privacy Policy | Beccatee Atelier', 'How we use your inquiry and application details.')}

        <section class="section-block">
          <article class="glass-card reveal" style="--reveal-delay:0.05s">
            <p class="eyebrow">Privacy Policy</p>
            <h2>Contact data is used only to respond to your request.</h2>
            <p class="section-copy">
              When you submit the contact or academy form, the information you provide is used only for WhatsApp or email communication related to your inquiry, booking, or enrollment.
            </p>
            <p class="section-copy">
              Beccatee Atelier does not sell, rent, or share your personal information with third parties. We keep your details only for follow-up conversations, service coordination, and academy communication.
            </p>
            <p class="section-copy">
              If you want your details removed from our records, contact us directly using the details below.
            </p>
          </article>
        </section>

        <section class="section-block">
          <article class="glass-card reveal" style="--reveal-delay:0.12s">
            <p class="eyebrow">Contact Information</p>
            <div class="detail-grid">
              ${contactItems
                .map(
                  (item) => `
                    <div class="detail-item">
                      <p class="detail-label">${escapeHtml(item.label)}</p>
                      <p class="detail-value">${escapeHtml(item.value)}</p>
                    </div>
                  `
                )
                .join('')}
            </div>
          </article>
        </section>
      </div>
    </section>
  `;
}

function renderTermsPage() {
  const terms = [
    'Service bookings are confirmed after your design details, fitting needs, and production timeline are agreed with Beccatee Atelier.',
    'Academy enrollment is subject to seat availability and completion of the required registration process.',
    'Payments for services or academy fees must be made according to the agreed structure shared during booking or enrollment.',
    'Cancellations or rescheduling requests should be communicated early so we can review available options based on the stage of your booking or training slot.',
  ];

  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro('Terms & Conditions | Beccatee Atelier', 'Important booking, enrollment, payment, and cancellation terms.')}

        <section class="section-block">
          <article class="glass-card reveal" style="--reveal-delay:0.05s">
            <p class="eyebrow">Terms & Conditions</p>
            <h2>Use of our services and academy spaces is subject to these basic terms.</h2>
            <ul class="feature-list">
              ${terms.map((term) => `<li>${escapeHtml(term)}</li>`).join('')}
            </ul>
            <p class="section-copy">
              By booking a service or enrolling in the academy, you agree to communicate accurate information and respond promptly to fitting, payment, and scheduling updates.
            </p>
          </article>
        </section>

        <section class="section-block">
          <article class="glass-card reveal" style="--reveal-delay:0.12s">
            <p class="eyebrow">Contact Information</p>
            <div class="detail-grid">
              ${contactItems
                .map(
                  (item) => `
                    <div class="detail-item">
                      <p class="detail-label">${escapeHtml(item.label)}</p>
                      <p class="detail-value">${escapeHtml(item.value)}</p>
                    </div>
                  `
                )
                .join('')}
            </div>
          </article>
        </section>
      </div>
    </section>
  `;
}

function serviceCard(service, index) {
  return `
    <article class="glass-card service-card reveal" style="--reveal-delay:${(index * 0.08).toFixed(2)}s">
      <p class="card-label">Service</p>
      <h3>${escapeHtml(service.title)}</h3>
      <p class="section-copy">${escapeHtml(service.description)}</p>
      <a class="btn btn-whatsapp" href="${service.href}" target="_blank" rel="noreferrer">Book on WhatsApp</a>
    </article>
  `;
}

function handleApplicationSubmit(form) {
  const formData = new FormData(form);
  const fullName = String(formData.get('fullName') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const whatsapp = String(formData.get('whatsapp') || '').trim() || phone;
  const experience = String(formData.get('experience') || '').trim();
  const referral = String(formData.get('referral') || '').trim();
  const reason = String(formData.get('reason') || '').trim();

  const message = [
    'Hello Beccatee Atelier, I want to apply for the 12 Weekends Intermediate Fashion Training.',
    `Full Name: ${fullName}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `WhatsApp: ${whatsapp}`,
    `Prior Experience: ${experience}`,
    `Why Fashion Design: ${reason}`,
    `How Did You Hear About Us: ${referral}`,
  ].join('\n');

  state.applicationStatus = { href: buildWhatsAppUrl(message) };
  openExternalTarget(state.applicationStatus.href);
  render();
}

function handleContactSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const message = String(formData.get('message') || '').trim();

  const formatted = [
    'Hello Beccatee Atelier, I would like to make an inquiry.',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Message: ${message}`,
  ].join('\n');

  state.contactStatus = { href: buildWhatsAppUrl(formatted) };
  openExternalTarget(state.contactStatus.href);
  render();
}

function renderApplicationStatus() {
  if (!state.applicationStatus) {
    return '';
  }

  return `
    <div class="status-box">
      <p class="status-title">Application sent! We'll contact you within 24 hours.</p>
      <a class="btn btn-whatsapp" href="${state.applicationStatus.href}" target="_blank" rel="noreferrer">Open WhatsApp Again</a>
    </div>
  `;
}

function renderContactStatus() {
  if (!state.contactStatus) {
    return '';
  }

  return `
    <div class="status-box">
      <p class="status-title">Inquiry prepared successfully. Please complete the send action on WhatsApp.</p>
      <a class="btn btn-whatsapp" href="${state.contactStatus.href}" target="_blank" rel="noreferrer">Open WhatsApp Again</a>
    </div>
  `;
}

function sectionHeading(eyebrow, title, body) {
  return `
    <div class="section-heading reveal" style="--reveal-delay:0s">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      <p class="section-copy">${escapeHtml(body)}</p>
    </div>
  `;
}

function pageIntro(title, body) {
  return `
    <div class="page-intro reveal" style="--reveal-delay:0s">
      <p class="eyebrow">${escapeHtml(brand.tagline)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p class="section-copy">${escapeHtml(body)}</p>
    </div>
  `;
}

function navLink(page, mobile = false) {
  const active = page.slug === state.activePage ? 'active' : '';
  const className = mobile ? 'mobile-link' : 'nav-link';
  return `<a class="${className} ${active}" href="${page.path}" data-page-link aria-current="${page.slug === state.activePage ? 'page' : 'false'}">${escapeHtml(page.label)}</a>`;
}

function footerLink(page) {
  return `<a href="${page.path}" data-page-link aria-current="${page.slug === state.activePage ? 'page' : 'false'}">${escapeHtml(page.label)}</a>`;
}

function enhanceUi() {
  setFavicon();
  initRevealObserver();
  animateHeroImage();
  window.requestAnimationFrame(() => {
    document.body.classList.add('is-page-visible');
    document.body.classList.remove('is-page-exiting');
  });
}

function animateHeroImage() {
  const heroImage = app.querySelector('.hero-image');
  if (!heroImage) {
    return;
  }

  const activate = () => heroImage.classList.add('is-loaded');
  if (heroImage.complete) {
    activate();
    return;
  }

  heroImage.addEventListener('load', activate, { once: true });
}

function initRevealObserver() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
  );

  app.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

function shouldHandlePageTransition(link) {
  const href = link.getAttribute('href');
  if (!href || href.startsWith('#')) {
    return false;
  }

  const targetUrl = new URL(href, window.location.href);
  if (targetUrl.origin !== window.location.origin) {
    return false;
  }

  const current = normalizePath(window.location.pathname);
  const target = normalizePath(targetUrl.pathname);
  return current !== target || targetUrl.hash !== window.location.hash;
}

function navigateWithTransition(href) {
  document.body.classList.remove('is-page-visible');
  document.body.classList.add('is-page-exiting');
  window.setTimeout(() => {
    window.location.href = href;
  }, 220);
}

function normalizePath(pathname) {
  const parts = pathname.split('/');
  return parts[parts.length - 1] || 'index.html';
}

function setFavicon() {
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/png';
    document.head.appendChild(favicon);
  }
  favicon.href = brandAssets.favicon;
}

function openExternalTarget(href) {
  try {
    const popup = window.open(href, '_blank', 'noopener,noreferrer');
    if (!popup) {
      window.location.href = href;
    }
  } catch {
    window.location.href = href;
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
      <path d="M12 2.2A9.78 9.78 0 0 0 3.64 17.1L2 22l5.02-1.57A9.8 9.8 0 1 0 12 2.2Zm0 17.8a8.03 8.03 0 0 1-4.07-1.11l-.29-.17-2.98.93.97-2.9-.19-.3A8.06 8.06 0 1 1 12 20Zm4.41-5.95c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1-.37-1.9-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.48-.4-.42-.54-.43h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.24 1.01.38 1.36.49.57.18 1.08.15 1.49.09.46-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" fill="currentColor"></path>
    </svg>
  `;
}
