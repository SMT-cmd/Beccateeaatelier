export const brand = {
  name: 'Beccatee Atelier',
  tagline: '...FASHION THAT POPS',
  whatsappNumber: '2347065854471',
  whatsappUrl: 'https://wa.me/2347065854471',
  phoneDisplay: '+234 706 585 4471',
  phoneHref: 'tel:+2347065854471',
  email: 'beccatee.atelier@gmail.com',
  instagram: '@beccatee_atelier',
  instagramUrl: 'https://instagram.com/beccatee_atelier',
  location: 'RCCG Redemption Camp, Along Lagos-Ibadan Expressway',
  locationExtended: 'RCCG Redemption Camp Along Lagos-Ibadan Expressway',
  mapsUrl: 'https://maps.google.com/?q=RCCG+Redemption+Camp+Along+Lagos-Ibadan+Expressway',
  topbarMessage: 'Next Academy Cohort: Sept 12 – Nov 28, 2026 | WhatsApp: +234 706 585 4471',
};

export const brandAssets = {
  logo: './1004134995.png',
  favicon: './1004134995.png',
  trainingFlyer: './1004135543.jpg',
  servicesFlyer: './1004134994.jpg',
};

export const pages = [
  {
    slug: 'home',
    label: 'Home',
    path: './index.html',
    title: 'Beccatee Atelier | Bespoke Fashion & Training Academy Nigeria',
    description:
      'Beccatee Atelier is a premium Nigerian fashion house for bespoke tailoring, bridal wear, aso ebi, childrenswear, and structured weekend fashion training.',
  },
  {
    slug: 'services',
    label: 'Services',
    path: './services.html',
    title: 'Our Services | Beccatee Atelier',
    description:
      'Explore bespoke bridal dresses, aso ebi, childrenswear, tailored-to-wear, ready-to-wear, and occasion fashion services from Beccatee Atelier.',
  },
  {
    slug: 'academy',
    label: 'Academy',
    path: './academy.html',
    title: 'Apply Now | 12 Weekends Fashion Training — Beccatee Atelier',
    description:
      'Apply for Beccatee Atelier’s 12 weekends intermediate fashion training in Nigeria with practical pattern adaptation and garment construction sessions.',
  },
  {
    slug: 'contact',
    label: 'Contact',
    path: './contact.html',
    title: 'Contact | Beccatee Atelier',
    description:
      'Contact Beccatee Atelier for bespoke bookings, academy applications, WhatsApp support, and fashion training inquiries in Nigeria.',
  },
];

export const homeAbout = {
  eyebrow: 'About Beccatee Atelier',
  title: 'Premium Nigerian fashion with precision, structure, and standout finishing.',
  body:
    'Beccatee Atelier is a premium Nigerian fashion house offering bespoke tailoring, bridal wear, aso ebi, childrenswear, and structured weekend fashion training. With 10+ industrial machines and a passion for precision, we bring your fashion vision to life.',
};

export const homeHero = {
  imageAlt: 'Beccatee Atelier 12 Weekends Intermediate Fashion Training flyer',
  ctaLabel: 'Apply Now — ₦250,000',
  ctaHref: './academy.html#application-form',
};

export const servicesFlyerMessage =
  'Hello Beccatee Atelier, I would like to book one of your bespoke fashion services. Please guide me.';

export const services = [
  {
    title: 'Bridal Dresses',
    description: 'Custom bridal dresses tailored for elegant entrances, flattering structure, and memorable finishing.',
    href: buildWhatsAppUrl('Hello Beccatee Atelier, I want to book a bridal dress consultation.'),
  },
  {
    title: 'Aso Ebi',
    description: 'Polished aso ebi outfits designed to help you stand out beautifully at weddings and celebrations.',
    href: buildWhatsAppUrl('Hello Beccatee Atelier, I want to book an aso ebi outfit.'),
  },
  {
    title: 'Children Wears',
    description: 'Chic childrenswear for birthdays, weddings, and special occasions with comfort built into the finish.',
    href: buildWhatsAppUrl('Hello Beccatee Atelier, I want to order children wears.'),
  },
  {
    title: 'Bespoke Dresses',
    description: 'Made-to-measure dresses shaped around your event, fit preferences, and preferred silhouette.',
    href: buildWhatsAppUrl('Hello Beccatee Atelier, I want to order a bespoke dress.'),
  },
  {
    title: 'Tailored-to-Wear',
    description: 'Refined tailored-to-wear looks adjusted for cleaner fit, easier ordering, and polished everyday luxury.',
    href: buildWhatsAppUrl('Hello Beccatee Atelier, I want a tailored-to-wear piece.'),
  },
  {
    title: 'Ready-to-Wear',
    description: 'Available ready-to-wear pieces for clients who want immediate access to the atelier’s signature finish.',
    href: buildWhatsAppUrl('Hello Beccatee Atelier, I want to shop ready-to-wear pieces.'),
  },
];

export const academyPreview = {
  eyebrow: 'Academy',
  title: '12 Weekends Intermediate Fashion Training — Sept 12 – Nov 28, 2026 — ₦250,000',
  href: './academy.html#application-form',
};

export const academyProgram = {
  title: '12 Weekends Intermediate Fashion Training',
  description:
    'A focused intermediate program for aspiring fashion designers who want to improve execution, structure, finishing, and confidence in garment construction.',
  details: [
    ['Dates', '12 Sept – 28 Nov 2026'],
    ['Schedule', 'Sat & Sun 2pm–6pm'],
    ['Duration', '12 Weekends'],
    ['Level', 'Intermediate'],
    ['Fee', '₦250,000'],
    ['Location', 'RCCG Redemption Camp Along Lagos-Ibadan Expressway'],
  ],
};

export const curriculum = [
  {
    title: 'Skirt',
    items: ['Tulip skirt', 'Skirt with vent', 'Godets in skirt'],
  },
  {
    title: 'Neckline',
    items: ['Built-up', 'Cowl', 'Illusion neckline', 'Surplice', 'Halter neck'],
  },
  {
    title: 'Sleeve',
    items: ['Kimono', 'Raglan', 'Bell', 'Balloon', 'Slash and spread'],
  },
  {
    title: 'Pants',
    items: ['Palazzo pant', 'Bootcut', 'Barrel', 'Cargo pant'],
  },
  {
    title: 'Bodice',
    items: ['Classic blazer', 'Victoria corset', 'Slash and spread', 'Waist snatching'],
  },
  {
    title: 'Capes and Collars',
    items: ['Capes', 'Collars'],
  },
];

export const academyApplicationFields = {
  experienceOptions: ['No experience', 'Beginner', 'Some experience', 'Advanced'],
  referralOptions: ['Instagram', 'WhatsApp', 'Friend or family', 'Google search', 'Other'],
};

export const academyFaqs = [
  {
    question: 'Do you take measurements remotely?',
    answer:
      'Yes. For selected services we can work remotely with guided measurements and style clarification through WhatsApp.',
  },
  {
    question: 'How long does a bridal gown take?',
    answer:
      'Bridal production time depends on the design and fittings, so early booking is strongly recommended.',
  },
  {
    question: 'Do I need experience for the academy?',
    answer:
      'The current cohort is intermediate level, but you can still chat with us on WhatsApp if you need guidance on readiness.',
  },
  {
    question: 'Can I pay the academy fee in installments?',
    answer:
      'Send us a WhatsApp message to discuss the current payment structure and available options for the cohort.',
  },
  {
    question: 'What materials should I bring to class?',
    answer:
      'The required materials list is shared after your application is received and your seat process begins.',
  },
];

export const contactItems = [
  { label: 'Phone', value: brand.phoneDisplay, href: brand.phoneHref },
  { label: 'Email', value: brand.email, href: `mailto:${brand.email}` },
  { label: 'Instagram', value: brand.instagram, href: brand.instagramUrl },
  { label: 'Location', value: brand.location, href: brand.mapsUrl },
];

export const contactFaqs = academyFaqs;

export function getPageMeta(slug) {
  return pages.find((page) => page.slug === slug) ?? pages[0];
}

export function buildWhatsAppUrl(message, number = brand.whatsappNumber) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
