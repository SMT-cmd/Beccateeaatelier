import test from 'node:test';
import assert from 'node:assert/strict';
import {
  academyApplicationFields,
  academyFaqs,
  academyPreview,
  academyProgram,
  brand,
  buildWhatsAppUrl,
  contactFaqs,
  contactItems,
  curriculum,
  footerPages,
  getPageMeta,
  navPages,
  pages,
  services,
} from '../site-data.mjs';

test('pages expose the required navigation and footer model', () => {
  assert.deepEqual(
    pages.map((page) => page.slug),
    ['home', 'about', 'services', 'academy', 'contact', 'privacy', 'terms']
  );
  assert.deepEqual(
    navPages.map((page) => page.slug),
    [
      'home',
      'about',
      'services',
      'academy',
      'contact',
    ]
  );
  assert.deepEqual(
    footerPages.map((page) => page.slug),
    ['home', 'about', 'services', 'academy', 'contact', 'privacy', 'terms']
  );
});

test('getPageMeta falls back to home and resolves supported pages', () => {
  assert.equal(getPageMeta('unknown').slug, 'home');
  assert.equal(getPageMeta('about').path, './about.html');
  assert.equal(getPageMeta('academy').path, './academy.html');
  assert.equal(getPageMeta('terms').title, 'Terms & Conditions | Beccatee Atelier');
});

test('brand contact details use one WhatsApp number everywhere', () => {
  assert.equal(brand.name, 'Beccatee Atelier');
  assert.equal(brand.tagline, '...FASHION THAT POPS');
  assert.equal(brand.whatsappNumber, '2347065854471');
  assert.equal(brand.whatsappUrl, 'https://wa.me/2347065854471');
  assert.equal(brand.phoneDisplay, '+234 706 585 4471');
  assert.equal(brand.email, 'beccatee.atelier@gmail.com');
});

test('services cover the six requested fashion offerings', () => {
  assert.deepEqual(
    services.map((service) => service.title),
    [
      'Bridal Dresses',
      'Aso Ebi',
      'Children Wears',
      'Bespoke Dresses',
      'Tailored-to-Wear',
      'Ready-to-Wear',
    ]
  );
  assert.ok(services.every((service) => service.href.startsWith('https://wa.me/2347065854471')));
});

test('academy preview and program details match the training brief', () => {
  assert.equal(
    academyPreview.title,
    '12 Weekends Intermediate Fashion Training — Sept 12 – Nov 28, 2026 — ₦250,000'
  );
  assert.deepEqual(academyProgram.details, [
    ['Dates', '12 Sept – 28 Nov 2026'],
    ['Schedule', 'Sat & Sun 2pm–6pm'],
    ['Duration', '12 Weekends'],
    ['Level', 'Intermediate'],
    ['Fee', '₦250,000'],
    ['Location', 'RCCG Redemption Camp Along Lagos-Ibadan Expressway'],
  ]);
});

test('curriculum fixes the flyer content and typo corrections', () => {
  assert.deepEqual(curriculum[0].items, ['Tulip skirt', 'Skirt with vent', 'Godets in skirt']);
  assert.deepEqual(curriculum[1].items, [
    'Built-up',
    'Cowl',
    'Illusion neckline',
    'Surplice',
    'Halter neck',
  ]);
  assert.deepEqual(curriculum[2].items, [
    'Kimono',
    'Raglan',
    'Bell',
    'Balloon',
    'Slash and spread',
  ]);
  assert.equal(curriculum[5].title, 'Capes and Collars');
});

test('academy and contact forms expose the required options and FAQs', () => {
  assert.deepEqual(academyApplicationFields.experienceOptions, [
    'No experience',
    'Beginner',
    'Some experience',
    'Advanced',
  ]);
  assert.ok(academyApplicationFields.referralOptions.length >= 4);
  assert.equal(contactFaqs.length, 5);
  assert.equal(academyFaqs.length, 5);
});

test('contact items include phone, email, instagram, and location', () => {
  assert.deepEqual(
    contactItems.map((item) => item.label),
    ['Phone', 'Email', 'Instagram', 'Location']
  );
});

test('buildWhatsAppUrl encodes prefilled messages for the official number', () => {
  const href = buildWhatsAppUrl('Hello Beccatee Atelier\nName: Jane Doe');
  assert.equal(
    href,
    'https://wa.me/2347065854471?text=Hello%20Beccatee%20Atelier%0AName%3A%20Jane%20Doe'
  );
});
