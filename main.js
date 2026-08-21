import {
  aboutSnippet,
  academyProgram,
  applicationFields,
  brand,
  brandAssets,
  buildMailtoUrl,
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

const state = {
  activePage: document.body.dataset.page || 'home',
  menuOpen: false,
  openFaq: 0,
  contactStatus: null,
  applicationStatus: null,
};

render();

app.addEventListener('click', async (event) => {
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
          <a class="brand" href="${pageUrl('home')}">
            <img class="brand-mark" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
            <span>
              <strong>${escapeHtml(brand.name)}</strong>
              <small>${escapeHtml(brand.tagline)}</small>
            </span>
          </a>

          <nav class="nav-desktop" aria-label="Primary">
            ${pages.map((page) => navLink(page)).join('')}
          </nav>

          <div class="nav-actions">
            <a class="btn btn-whatsapp nav-cta" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
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

      <main class="page-main">
        ${renderPageBody()}
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
            <p>Instagram: <a href="https://instagram.com/beccatee_atelier" target="_blank" rel="noreferrer">${escapeHtml(brand.instagram)}</a></p>
            <p>Email: <a href="mailto:${brand.email}">${escapeHtml(brand.email)}</a></p>
            <p>Location: ${escapeHtml(brand.location)}</p>
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
      <img
        class="hero-flyer"
        src="${brandAssets.trainingFlyer}"
        alt="12 Weekends Intermediate Fashion Training flyer"
      />
      <a class="hero-cover-link" href="${heroContent.applyHref}" aria-label="${escapeHtml(heroContent.title)}"></a>
      <div class="hero-overlay"></div>
      <div class="container hero-content">
        <p class="hero-eyebrow">${escapeHtml(heroContent.eyebrow)}</p>
        <h1>${escapeHtml(heroContent.title)}</h1>
        <p class="hero-detail">${escapeHtml(heroContent.detail)}</p>
        <a class="btn btn-gold hero-cta" href="${heroContent.applyHref}">${escapeHtml(heroContent.ctaLabel)}</a>
      </div>
      <a class="scroll-indicator" href="#home-about" aria-label="Scroll to more details">
        <span>Scroll</span>
        ${iconChevronDown()}
      </a>
    </section>

    <section class="ticker-bar" aria-label="${escapeHtml(brand.tagline)}">
      <div class="ticker-track">
        ${Array.from({ length: 8 }, () => `<span>${escapeHtml(brand.tagline)}</span>`).join('')}
      </div>
    </section>

    <section class="page-section">
      <div class="container">
        <section class="about-snippet" id="home-about">
          <img class="about-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
          <div>
            <p class="section-kicker">${escapeHtml(aboutSnippet.title)}</p>
            <p>${escapeHtml(aboutSnippet.body)}</p>
          </div>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'Services',
            'Bespoke fashion services for weddings, events, and everyday elegance.',
            'Explore custom pieces, bridal looks, aso ebi, children wears, and ready-to-wear options from Beccatee Atelier.'
          )}
          <a
            class="flyer-card"
            href="${buildWhatsAppUrl(servicesWhatsappMessage)}"
            target="_blank"
            rel="noreferrer"
          >
            <img
              class="flyer-image flyer-services"
              src="${brandAssets.servicesFlyer}"
              alt="Beccatee Atelier services flyer"
            />
          </a>
          <div class="cards-grid three-up compact-top">
            ${serviceHighlights.map((item) => simpleCard(item)).join('')}
          </div>
          <div class="section-actions">
            <a class="btn btn-whatsapp" href="${buildWhatsAppUrl(servicesWhatsappMessage)}" target="_blank" rel="noreferrer">
              Book a Service on WhatsApp
            </a>
          </div>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'Academy',
            '12 Weekends Intermediate Fashion Training',
            academyProgram.preview
          )}
          <article class="preview-card">
            <p>Learn structured garment construction, advanced pattern adaptation, finishing, and presentation in a practical weekend format.</p>
            <a class="btn btn-gold" href="${pageUrl('academy')}#apply-form">View Full Curriculum & Apply</a>
          </article>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'Contact',
            'Have questions? Chat with us on WhatsApp.',
            'Reach out for bespoke orders, bridal consultations, ready-to-wear inquiries, and academy applications.'
          )}
          <div class="cards-grid contact-preview-grid compact-top">
            ${previewContactItems.map((item) => `<article class="info-card"><p>${escapeHtml(item)}</p></article>`).join('')}
          </div>
          <div class="section-actions">
            <a class="btn btn-whatsapp" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
              Chat on WhatsApp
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
        ${pageIntro('Our Services', 'Bridal, aso ebi, bespoke, and ready-to-wear fashion by Beccatee Atelier.')}
        <div class="services-hero">
          <img class="flyer-image flyer-full" src="${brandAssets.servicesFlyer}" alt="Beccatee Atelier services flyer" />
        </div>
        <div class="cards-grid three-up stack-section">
          ${services
            .map(
              (service) => `
                <article class="service-card">
                  <h3>${escapeHtml(service.title)}</h3>
                  <p>${escapeHtml(service.description)}</p>
                  <a class="btn btn-whatsapp" href="${buildWhatsAppUrl(`Hi Beccatee Atelier, I want to book ${service.title}. Please share the next steps.`)}" target="_blank" rel="noreferrer">
                    Book on WhatsApp
                  </a>
                </article>
              `
            )
            .join('')}
        </div>
      </div>
    </section>
  `;
}

function renderAcademyPage() {
  return `
    <section class="page-section">
      <div class="container">
        ${pageIntro(academyProgram.heading, 'This is the conversion page for the next Beccatee Atelier academy cohort.')}
        <div class="academy-flyer-wrap">
          <img class="flyer-image flyer-medium" src="${brandAssets.trainingFlyer}" alt="12 Weekends Intermediate Fashion Training flyer" />
        </div>

        <section class="stack-section">
          <article class="detail-card">
            <h2>Program Details</h2>
            <dl class="detail-list">
              ${academyProgram.details
                .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
                .join('')}
            </dl>
          </article>
        </section>

        <section class="stack-section">
          ${sectionHeading('Curriculum', 'What You Will Learn', 'A practical intermediate curriculum built around skirts, necklines, sleeves, pants, bodices, capes, and collars.')}
          <div class="cards-grid three-up compact-top">
            ${curriculum
              .map(
                (group) => `
                  <article class="curriculum-card">
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

        <section class="stack-section">
          <article class="form-card" id="apply-form">
            <h2>Application Form</h2>
            <p>Complete the form below and send your application directly on WhatsApp.</p>
            ${renderApplicationStatus()}
            <form class="form-grid compact-top" data-application-form>
              <label>
                <span>Full Name</span>
                <input type="text" name="name" required />
              </label>
              <label>
                <span>Phone Number</span>
                <input type="tel" name="phone" required />
              </label>
              <label>
                <span>Email Address</span>
                <input type="email" name="email" required />
              </label>
              <label>
                <span>WhatsApp Number</span>
                <input type="tel" name="whatsapp" placeholder="If different from phone" />
              </label>
              <label>
                <span>Prior Experience</span>
                <select name="experience" required>
                  ${applicationFields.experienceOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label>
                <span>How did you hear about us?</span>
                <select name="referral" required>
                  ${applicationFields.referralOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label class="full-span">
                <span>Why do you want to learn fashion design?</span>
                <textarea name="reason" rows="5"></textarea>
              </label>
              <div class="full-span form-actions">
                <p>Need help with your application fee? Use the Contact page or WhatsApp to ask for payment guidance.</p>
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
        ${pageIntro('Contact Beccatee Atelier', 'Have questions? Chat with us on WhatsApp or send a quick inquiry below.')}
        <div class="contact-logo-wrap">
          <img class="contact-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
        </div>

        <section class="contact-layout stack-section">
          <div class="stack-list">
            ${contactCards
              .map(
                (card, index) => `
                  <article class="contact-card ${index === 0 ? 'contact-card-primary' : ''}">
                    <p class="section-kicker">${escapeHtml(card.label)}</p>
                    <p>${escapeHtml(card.value)}</p>
                    ${
                      index === 0
                        ? `<a class="btn btn-whatsapp" href="${card.href}" target="_blank" rel="noreferrer">Chat on WhatsApp</a>`
                        : card.href
                          ? `<a class="text-link" href="${card.href}" target="${card.href.startsWith('http') ? '_blank' : '_self'}" rel="noreferrer">Open</a>`
                          : ''
                    }
                  </article>
                `
              )
              .join('')}
          </div>

          <article class="form-card">
            <h2>Quick Inquiry</h2>
            <p>Send your question directly to Beccatee Atelier on WhatsApp.</p>
            ${renderContactStatus()}
            <form class="form-grid compact-top" data-contact-form>
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
                <textarea name="message" rows="6" required></textarea>
              </label>
              <div class="full-span form-actions">
                <p>Primary response channel: WhatsApp.</p>
                <button class="btn btn-whatsapp" type="submit">Send via WhatsApp</button>
              </div>
            </form>
          </article>
        </section>

        <section class="stack-section">
          ${sectionHeading('FAQ', 'Frequently Asked Questions', 'Answers to common questions about measurements, bridal timelines, the academy, payments, and delivery.')}
          <div class="faq-list compact-top">
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

function handleContactSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const body = [
    'Hi Beccatee Atelier, I have an inquiry.',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Message: ${message || 'No additional details provided.'}`,
  ].join('\n');

  state.contactStatus = {
    name,
    whatsappHref: buildWhatsAppUrl(body),
  };
  openExternalTarget(state.contactStatus.whatsappHref);
  render();
}

function handleApplicationSubmit(form) {
  const formData = new FormData(form);
  const name = String(formData.get('name') || '').trim();
  const phone = String(formData.get('phone') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const whatsapp = String(formData.get('whatsapp') || '').trim() || phone;
  const experience = String(formData.get('experience') || '').trim();
  const referral = String(formData.get('referral') || '').trim();
  const reason = String(formData.get('reason') || '').trim();
  const message = [
    'Hi Beccatee Atelier, I want to apply for the 12 Weekends Intermediate Fashion Training.',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `WhatsApp: ${whatsapp}`,
    `Experience: ${experience}`,
    `Referral: ${referral}`,
    `Why fashion: ${reason || 'No additional message provided.'}`,
  ].join('\n');
  const whatsappHref = buildWhatsAppUrl(message);
  const mailtoHref = buildMailtoUrl(
    'Academy Application - 12 Weekends Intermediate Fashion Training',
    message
  );

  state.applicationStatus = {
    whatsappHref,
    mailtoHref,
  };
  openExternalTarget(whatsappHref, mailtoHref);
  render();
}

function renderContactStatus() {
  if (!state.contactStatus) {
    return '';
  }

  return `
    <div class="status success">
      <p class="status-title">Message prepared for ${escapeHtml(state.contactStatus.name || 'you')}.</p>
      <p>Your inquiry is ready on WhatsApp. If it did not open automatically, use the button below.</p>
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
      <p class="status-title">Application sent! We'll contact you within 24 hours to confirm your slot.</p>
      <p>If WhatsApp did not open automatically, use one of the actions below.</p>
      <div class="button-row compact-top">
        <a class="btn btn-whatsapp" href="${state.applicationStatus.whatsappHref}" target="_blank" rel="noreferrer">Open WhatsApp</a>
        <a class="btn btn-outline" href="${state.applicationStatus.mailtoHref}">Email Instead</a>
      </div>
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

function pageIntro(title, description) {
  return `
    <div class="page-intro">
      <p class="section-kicker">${escapeHtml(brand.fullName)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function simpleCard(text) {
  return `
    <article class="info-card">
      <p>✓ ${escapeHtml(text)}</p>
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

function setFavicon() {
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', brandAssets.favicon);
}

function openExternalTarget(primaryHref, fallbackHref = '') {
  try {
    const opened = window.open(primaryHref, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = fallbackHref || primaryHref;
    }
  } catch (error) {
    window.location.href = fallbackHref || primaryHref;
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

function iconChevronDown() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.7 9.3a1 1 0 0 1 1.4 0l3.9 3.9 3.9-3.9a1 1 0 1 1 1.4 1.4l-4.6 4.6a1 1 0 0 1-1.4 0L6.7 10.7a1 1 0 0 1 0-1.4Z" fill="currentColor"/>
    </svg>
  `;
}
