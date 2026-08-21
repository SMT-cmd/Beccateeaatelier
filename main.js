import {
  aboutSnippet,
  academyBenefits,
  academyProgram,
  applicationFields,
  bookAndPayOptions,
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

  const faqButton = event.target.closest('[data-faq]');
  if (faqButton) {
    const faqIndex = Number(faqButton.dataset.faq);
    state.openFaq = state.openFaq === faqIndex ? -1 : faqIndex;
    render();
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
          <a class="brand" href="./index.html" data-page-link aria-label="${escapeHtml(brand.name)} home">
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
            <a class="btn btn-whatsapp nav-cta" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
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
          ${pages.map((page) => navLink(page, true)).join('')}
        </div>
      </header>

      <main class="page-main">
        ${renderPageBody()}
      </main>

      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-brand reveal" style="--reveal-delay:0.05s">
            <img class="footer-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
            <div>
              <p class="footer-title">${escapeHtml(brand.name)}</p>
              <p class="footer-tagline">${escapeHtml(brand.tagline)}</p>
            </div>
          </div>
          <div class="footer-details reveal" style="--reveal-delay:0.12s">
            <p>WhatsApp: <a href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">${escapeHtml(brand.whatsappDisplay)}</a></p>
            <p>Phone: <a href="${brand.phoneHref}">${escapeHtml(brand.localPhoneDisplay)}</a></p>
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

  enhanceUi();
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
    <section class="hero-section">
      <div class="container hero-layout">
        <div class="hero-copy reveal" style="--reveal-delay:0.05s">
          <p class="eyebrow">${escapeHtml(heroContent.eyebrow)}</p>
          <h1>${escapeHtml(heroContent.title)}</h1>
          <p class="hero-detail">${escapeHtml(heroContent.detail)}</p>
          <div class="hero-copy-actions">
            <a class="btn btn-outline" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
              ${escapeHtml(heroContent.secondaryCtaLabel)}
            </a>
          </div>
        </div>

        <div class="hero-visual reveal" style="--reveal-delay:0.15s">
          <a class="hero-flyer-link" href="${heroContent.ctaHref}" data-page-link aria-label="Open academy application page">
            <img
              class="hero-flyer"
              src="${brandAssets.trainingFlyer}"
              data-fallback-src="${brandAssets.trainingFlyerFallback}"
              alt="12 Weekends Intermediate Fashion Training flyer"
            />
          </a>
          <div class="hero-cta-row">
            <a class="btn btn-gold" href="${heroContent.ctaHref}" data-page-link>${escapeHtml(heroContent.ctaLabel)}</a>
            <a class="btn btn-whatsapp" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
              Book via WhatsApp
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
      <div class="container section-stack">
        <section class="about-card reveal" id="home-about" style="--reveal-delay:0.05s">
          <div class="about-logo-wrap">
            <img class="about-logo" src="${brandAssets.logo}" alt="${escapeHtml(brand.name)} logo" />
          </div>
          <div>
            <p class="eyebrow">${escapeHtml(aboutSnippet.eyebrow)}</p>
            <h2>${escapeHtml(aboutSnippet.title)}</h2>
            <p>${escapeHtml(aboutSnippet.body)}</p>
          </div>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'Services',
            'Crafted for weddings, events, and standout personal style.',
            'Choose from bridal dresses, aso ebi, childrenswear, bespoke dresses, tailored-to-wear, and ready-to-wear pieces.'
          )}
          <a
            class="flyer-card reveal"
            style="--reveal-delay:0.12s"
            href="${buildWhatsAppUrl(servicesWhatsappMessage)}"
            target="_blank"
            rel="noreferrer"
          >
            <img class="flyer-image flyer-services" src="${brandAssets.servicesFlyer}" alt="Beccatee Atelier services flyer" />
          </a>
          <div class="cards-grid compact-top">
            ${serviceHighlights.map((item, index) => simpleCard(item, index)).join('')}
          </div>
          <div class="section-actions reveal" style="--reveal-delay:0.22s">
            <a class="btn btn-gold" href="./services.html" data-page-link>Explore Services</a>
            <a class="btn btn-whatsapp" href="${buildWhatsAppUrl(servicesWhatsappMessage)}" target="_blank" rel="noreferrer">
              Book a Service
            </a>
          </div>
        </section>

        <section class="stack-section">
          ${sectionHeading('Academy', academyProgram.heading, academyProgram.preview)}
          <div class="cards-grid compact-top academy-preview-grid">
            ${academyProgram.details
              .slice(0, 4)
              .map(
                ([label, value], index) => `
                  <article class="accent-card reveal" style="--reveal-delay:${0.08 + index * 0.08}s">
                    <p class="card-label">${escapeHtml(label)}</p>
                    <p class="card-value">${escapeHtml(value)}</p>
                  </article>
                `
              )
              .join('')}
          </div>
          <article class="preview-card reveal compact-top" style="--reveal-delay:0.24s">
            <p>${escapeHtml(academyProgram.description)}</p>
            <div class="section-actions">
              <a class="btn btn-gold" href="./academy.html#apply-form" data-page-link>View Curriculum & Apply</a>
              <a class="btn btn-outline" href="${buildWhatsAppUrl(academyProgram.bookAndPayMessage)}" target="_blank" rel="noreferrer">
                Ask About Payment
              </a>
            </div>
          </article>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'Contact',
            'WhatsApp-first support for bookings, academy questions, and fittings.',
            'Reach Beccatee Atelier through one primary number across WhatsApp, call, and every site CTA.'
          )}
          <div class="cards-grid contact-preview-grid compact-top">
            ${previewContactItems
              .map(
                (item, index) => `
                  <article class="info-card reveal" style="--reveal-delay:${0.05 + index * 0.08}s">
                    <p>${escapeHtml(item)}</p>
                  </article>
                `
              )
              .join('')}
          </div>
          <div class="section-actions reveal" style="--reveal-delay:0.24s">
            <a class="btn btn-whatsapp" href="https://wa.me/${brand.whatsappNumber}" target="_blank" rel="noreferrer">
              Chat on WhatsApp
            </a>
            <a class="btn btn-outline" href="./contact.html" data-page-link>Open Contact Page</a>
          </div>
        </section>
      </div>
    </section>
  `;
}

function renderServicesPage() {
  return `
    <section class="page-section">
      <div class="container section-stack">
        ${pageIntro(
          'Luxury services for bridal moments, event dressing, and polished everyday looks.',
          'Beccatee Atelier creates expressive silhouettes with rich colour, flattering structure, and refined finishing.'
        )}

        <a
          class="services-hero reveal"
          style="--reveal-delay:0.08s"
          href="${buildWhatsAppUrl(servicesWhatsappMessage)}"
          target="_blank"
          rel="noreferrer"
        >
          <img class="flyer-image flyer-full" src="${brandAssets.servicesFlyer}" alt="Beccatee Atelier services flyer" />
        </a>

        <div class="cards-grid compact-top">
          ${services
            .map(
              (service, index) => `
                <article class="service-card reveal" style="--reveal-delay:${0.06 + index * 0.08}s">
                  <p class="card-label">Service</p>
                  <h3>${escapeHtml(service.title)}</h3>
                  <p>${escapeHtml(service.description)}</p>
                  <a class="btn btn-whatsapp" href="${buildWhatsAppUrl(service.message)}" target="_blank" rel="noreferrer">
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
      <div class="container section-stack">
        ${pageIntro(academyProgram.heading, academyProgram.description)}

        <div class="academy-hero-grid compact-top">
          <div class="academy-flyer-wrap reveal" style="--reveal-delay:0.08s">
            <img
              class="flyer-image flyer-medium"
              src="${brandAssets.trainingFlyer}"
              data-fallback-src="${brandAssets.trainingFlyerFallback}"
              alt="12 Weekends Intermediate Fashion Training flyer"
            />
          </div>
          <article class="detail-card reveal" style="--reveal-delay:0.16s">
            <p class="eyebrow">Program Details</p>
            <dl class="detail-list">
              ${academyProgram.details
                .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
                .join('')}
            </dl>
            <div class="section-actions compact-top">
              <a class="btn btn-gold" href="#apply-form">${escapeHtml(heroContent.ctaLabel)}</a>
              <a class="btn btn-whatsapp" href="${buildWhatsAppUrl(academyProgram.bookAndPayMessage)}" target="_blank" rel="noreferrer">
                Ask About Booking
              </a>
            </div>
          </article>
        </div>

        <section class="stack-section">
          ${sectionHeading(
            'Benefits',
            'Weekend structure with practical learning at the centre.',
            'Each training block is designed to improve execution, finishing, and confidence in intermediate garment work.'
          )}
          <div class="cards-grid compact-top">
            ${academyBenefits
              .map(
                (item, index) => `
                  <article class="accent-card reveal" style="--reveal-delay:${0.05 + index * 0.08}s">
                    <p class="card-value">${escapeHtml(item)}</p>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'Curriculum',
            'What you will learn during the 12 weekends.',
            'The current flyer covers skirts, necklines, sleeves, pants, bodices, caps, and collars.'
          )}
          <div class="cards-grid compact-top">
            ${curriculum
              .map(
                (group, index) => `
                  <article class="curriculum-card reveal" style="--reveal-delay:${0.06 + index * 0.08}s">
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
          <article class="form-card reveal" style="--reveal-delay:0.08s" id="apply-form">
            <p class="eyebrow">Academy Application</p>
            <h2>Apply via WhatsApp</h2>
            <p>Complete the form below to prepare a formatted application message for Beccatee Atelier on WhatsApp.</p>
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
                <span>WhatsApp Number</span>
                <input type="tel" name="whatsapp" placeholder="If different from phone" />
              </label>
              <label>
                <span>Email Address</span>
                <input type="email" name="email" required />
              </label>
              <label>
                <span>City / State</span>
                <input type="text" name="location" required />
              </label>
              <label>
                <span>Prior Experience</span>
                <select name="experience" required>
                  ${applicationFields.experienceOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label>
                <span>How Did You Hear About Us?</span>
                <select name="referral" required>
                  ${applicationFields.referralOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label>
                <span>Weekend Availability</span>
                <select name="availability" required>
                  ${applicationFields.availabilityOptions.map((option) => `<option>${escapeHtml(option)}</option>`).join('')}
                </select>
              </label>
              <label class="full-span">
                <span>Why do you want to join this training?</span>
                <textarea name="goals" rows="5" required></textarea>
              </label>
              <div class="full-span form-actions">
                <p>Need payment guidance before submitting? Use the WhatsApp button below and we will help you book and pay.</p>
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
      <div class="container section-stack">
        ${pageIntro(
          'Contact the atelier for bookings, academy applications, and payment guidance.',
          'WhatsApp is the fastest response channel for service inquiries, academy questions, and booking support.'
        )}

        <section class="contact-layout compact-top">
          <div class="stack-list">
            ${contactCards
              .map(
                (card, index) => `
                  <article class="contact-card ${index === 0 ? 'contact-card-primary' : ''} reveal" style="--reveal-delay:${0.05 + index * 0.08}s">
                    <p class="card-label">${escapeHtml(card.label)}</p>
                    <p class="card-value">${escapeHtml(card.value)}</p>
                    <a
                      class="${index === 0 ? 'btn btn-whatsapp' : 'text-link'}"
                      href="${card.href}"
                      target="${card.href.startsWith('http') || card.href.startsWith('mailto') ? '_blank' : '_self'}"
                      rel="noreferrer"
                    >
                      ${index === 0 ? 'Chat on WhatsApp' : 'Open'}
                    </a>
                  </article>
                `
              )
              .join('')}
          </div>

          <article class="form-card reveal" style="--reveal-delay:0.16s">
            <p class="eyebrow">Quick Inquiry</p>
            <h2>Send a message on WhatsApp</h2>
            <p>Your inquiry is formatted and opened directly in WhatsApp for fast response.</p>
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
                <span>What do you need?</span>
                <select name="subject" required>
                  <option>Bespoke service booking</option>
                  <option>Bridal consultation</option>
                  <option>Academy inquiry</option>
                  <option>Book and pay support</option>
                  <option>General inquiry</option>
                </select>
              </label>
              <label class="full-span">
                <span>Message</span>
                <textarea name="message" rows="6" required></textarea>
              </label>
              <div class="full-span form-actions">
                <p>Primary response number: ${escapeHtml(brand.localPhoneDisplay)}.</p>
                <button class="btn btn-whatsapp" type="submit">Send via WhatsApp</button>
              </div>
            </form>
          </article>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'Book & Pay',
            'A simple WhatsApp path for booking support and payment questions.',
            'The former payments page has been folded into contact so every booking conversation starts in one place.'
          )}
          <div class="cards-grid compact-top">
            ${bookAndPayOptions
              .map(
                (option, index) => `
                  <article class="accent-card reveal" style="--reveal-delay:${0.05 + index * 0.1}s">
                    <p class="card-label">${escapeHtml(option.title)}</p>
                    <p>${escapeHtml(option.body)}</p>
                    <a class="btn btn-whatsapp" href="${option.href}" target="_blank" rel="noreferrer">${escapeHtml(option.label)}</a>
                  </article>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="stack-section">
          ${sectionHeading(
            'FAQ',
            'Frequently asked questions',
            'Helpful answers about booking, bridal timelines, the academy, and current ready-to-wear availability.'
          )}
          <div class="faq-list compact-top">
            ${faqs
              .map(
                (item, index) => `
                  <article class="faq-item reveal" style="--reveal-delay:${0.04 + index * 0.06}s">
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
  const subject = String(formData.get('subject') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const body = [
    'Hi Beccatee Atelier, I have an inquiry.',
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Subject: ${subject}`,
    `Message: ${message}`,
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
  const whatsapp = String(formData.get('whatsapp') || '').trim() || phone;
  const email = String(formData.get('email') || '').trim();
  const location = String(formData.get('location') || '').trim();
  const experience = String(formData.get('experience') || '').trim();
  const referral = String(formData.get('referral') || '').trim();
  const availability = String(formData.get('availability') || '').trim();
  const goals = String(formData.get('goals') || '').trim();
  const message = [
    'Hi Beccatee Atelier, I want to apply for the 12 Weekends Intermediate Fashion Training.',
    `Full Name: ${name}`,
    `Phone Number: ${phone}`,
    `WhatsApp Number: ${whatsapp}`,
    `Email Address: ${email}`,
    `City / State: ${location}`,
    `Prior Experience: ${experience}`,
    `Referral Source: ${referral}`,
    `Weekend Availability: ${availability}`,
    `Training Goals: ${goals}`,
  ].join('\n');

  state.applicationStatus = {
    whatsappHref: buildWhatsAppUrl(message),
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
      <p class="status-title">Application prepared successfully.</p>
      <p>Your formatted academy application is ready on WhatsApp. If it did not open automatically, use the button below.</p>
      <div class="button-row compact-top">
        <a class="btn btn-whatsapp" href="${state.applicationStatus.whatsappHref}" target="_blank" rel="noreferrer">Open WhatsApp</a>
      </div>
    </div>
  `;
}

function sectionHeading(eyebrow, title, description) {
  return `
    <div class="section-heading reveal" style="--reveal-delay:0.04s">
      <p class="eyebrow">${escapeHtml(eyebrow)}</p>
      <h2>${escapeHtml(title)}</h2>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function pageIntro(title, description) {
  return `
    <div class="page-intro reveal" style="--reveal-delay:0.04s">
      <p class="eyebrow">${escapeHtml(brand.fullName)}</p>
      <h1>${escapeHtml(title)}</h1>
      <p>${escapeHtml(description)}</p>
    </div>
  `;
}

function simpleCard(text, index) {
  return `
    <article class="info-card reveal" style="--reveal-delay:${0.05 + index * 0.08}s">
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function navLink(page, mobile = false) {
  const isActive = page.slug === state.activePage;
  return `
    <a
      class="${mobile ? 'mobile-link' : 'nav-link'} ${isActive ? 'active' : ''}"
      href="${page.path}"
      data-page-link
      aria-current="${isActive ? 'page' : 'false'}"
    >
      ${escapeHtml(page.label)}
    </a>
  `;
}

function enhanceUi() {
  setFavicon();
  bindImageFallbacks();
  initRevealObserver();
  requestAnimationFrame(() => document.body.classList.add('is-page-visible'));
}

function bindImageFallbacks() {
  const fallbackImages = app.querySelectorAll('img[data-fallback-src]');
  fallbackImages.forEach((image) => {
    image.addEventListener(
      'error',
      () => {
        const fallbackSrc = image.getAttribute('data-fallback-src');
        if (fallbackSrc && image.getAttribute('src') !== fallbackSrc) {
          image.setAttribute('src', fallbackSrc);
        }
      },
      { once: true }
    );
  });
}

function initRevealObserver() {
  if (revealObserver) {
    revealObserver.disconnect();
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: '0px 0px -40px 0px' }
  );

  app.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
}

function shouldHandlePageTransition(link) {
  const href = link.getAttribute('href') || '';
  if (!href || href.startsWith('#')) {
    return false;
  }

  const targetUrl = new URL(href, window.location.href);
  const targetOrigin = targetUrl.origin === window.location.origin;
  if (!targetOrigin) {
    return false;
  }

  const targetPath = normalizePath(targetUrl.pathname);
  const currentPath = normalizePath(window.location.pathname);
  return targetPath !== currentPath || Boolean(targetUrl.hash);
}

function navigateWithTransition(href) {
  document.body.classList.remove('is-page-visible');
  document.body.classList.add('is-page-exiting');
  window.setTimeout(() => {
    window.location.href = href;
  }, 200);
}

function normalizePath(pathname) {
  const parts = pathname.split('/');
  return parts[parts.length - 1] || 'index.html';
}

function setFavicon() {
  let favicon = document.querySelector('link[rel="icon"]');
  if (!favicon) {
    favicon = document.createElement('link');
    favicon.setAttribute('rel', 'icon');
    favicon.setAttribute('type', 'image/png');
    document.head.appendChild(favicon);
  }
  favicon.setAttribute('href', brandAssets.favicon);
}

function openExternalTarget(primaryHref) {
  try {
    const opened = window.open(primaryHref, '_blank', 'noopener,noreferrer');
    if (!opened) {
      window.location.href = primaryHref;
    }
  } catch (error) {
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
