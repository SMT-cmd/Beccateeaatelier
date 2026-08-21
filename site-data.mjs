const imageEndpoint =
  'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=';

export function websiteImage(prompt, imageSize = 'landscape_16_9') {
  return `${imageEndpoint}${encodeURIComponent(prompt)}&image_size=${imageSize}`;
}

export const pages = [
  {
    slug: 'home',
    label: 'Home',
    title: 'Luxury Fashion House',
    eyebrow: 'Modern couture studio',
    description:
      'A cinematic overview of the atelier, academy, and premium service experience.',
  },
  {
    slug: 'services',
    label: 'Services',
    title: 'Fashion Hub Services',
    eyebrow: 'Luxury client journeys',
    description:
      'Premium styling, bridal design, production support, and event-ready creative services.',
  },
  {
    slug: 'academy',
    label: 'Academy',
    title: 'Fashion Academy',
    eyebrow: 'Practical fashion education',
    description:
      'Program structure, learning outcomes, studio mentorship, and enrollment details.',
  },
  {
    slug: 'atelier',
    label: 'Atelier',
    title: 'Bespoke Atelier',
    eyebrow: 'Custom craftsmanship',
    description:
      'Premium bridal, occasionwear, fittings, and personal styling services.',
  },
  {
    slug: 'journal',
    label: 'Journal',
    title: 'Studio Journal',
    eyebrow: 'Editorial storytelling',
    description:
      'Lookbooks, process notes, trend insights, and seasonal feature stories.',
  },
  {
    slug: 'payments',
    label: 'Payments',
    title: 'Secure Payments',
    eyebrow: 'Deposits and balances',
    description:
      'Pay securely for consultations, couture deposits, and academy slots with guided checkout.',
  },
  {
    slug: 'contact',
    label: 'Contact',
    title: 'Book a Consultation',
    eyebrow: 'Ready to begin',
    description:
      'Fast contact paths, project intake, FAQs, and studio visit planning.',
  },
];

export function resolvePageFromHash(hash = '') {
  const normalized = hash.replace(/^#\/?/, '').trim().toLowerCase();
  return pages.some((page) => page.slug === normalized) ? normalized : 'home';
}

export function getPageMeta(slug) {
  return pages.find((page) => page.slug === slug) ?? pages[0];
}

export function getRouteHref(slug) {
  return slug === 'home' ? '#/' : `#/${slug}`;
}

export function normalizeAmountToKobo(amount) {
  return Math.round(Number(amount || 0) * 100);
}

export function createPaymentReference(prefix = 'FH') {
  const stamp = Date.now().toString(36).toUpperCase();
  const nonce = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}-${stamp}${nonce}`;
}

export function buildPaystackInlineConfig({
  key,
  email,
  amount,
  planCode,
  metadata = {},
  callbackUrl,
  reference = createPaymentReference(),
}) {
  const config = {
    key,
    email,
    amount: normalizeAmountToKobo(amount),
    ref: reference,
    metadata,
  };

  if (planCode) {
    config.plan = planCode;
  }

  if (callbackUrl) {
    config.callback_url = callbackUrl;
  }

  return config;
}

export const socialProof = [
  { label: 'Clients dressed', value: '480+' },
  { label: 'Graduates mentored', value: '160+' },
  { label: 'Bridal fittings', value: '92' },
  { label: 'Average response time', value: '2 hrs' },
];

export const operationsMetrics = [
  { label: 'Active fittings this week', value: '14', detail: 'Dress, bridal, and final delivery sessions in progress.' },
  { label: 'Orders in production', value: '28', detail: 'Live garment production queue across couture and occasionwear.' },
  { label: 'Student studio seats left', value: '06', detail: 'Available places in the next academy cohort this month.' },
  { label: 'Today response SLA', value: '18 min', detail: 'Average first-response time for premium website inquiries.' },
];

export const serviceCategories = [
  {
    title: 'Bridal Fashion',
    summary: 'Signature bridal looks from concept boards to final fittings.',
    bullets: ['Luxury bridal gowns', 'Reception and second-look styling', 'Fitting management and delivery planning'],
    highlight: 'Most requested',
  },
  {
    title: 'Occasion & Red Carpet',
    summary: 'High-impact garments for launches, weddings, editorial campaigns, and private events.',
    bullets: ['Statement dresses', 'Tailored eveningwear', 'Styling coordination and accessories guidance'],
    highlight: 'Event ready',
  },
  {
    title: 'Fashion Business Support',
    summary: 'Studio consulting for learners and growing labels that want better systems and finishing.',
    bullets: ['Private creative direction', 'Production workflow audits', 'Launch support for collections and campaigns'],
    highlight: 'Growth layer',
  },
];

export const featuredMoments = [
  {
    tag: 'Couture fittings',
    title: 'Precision draping for wedding, red carpet, and celebration looks.',
    description:
      'Every silhouette is refined through fabric trials, body mapping, and finishing passes.',
    image: websiteImage(
      'luxury African fashion atelier fitting session, seamstress adjusting couture gown on client, warm editorial studio lighting, premium realistic website hero image',
      'portrait_16_9'
    ),
  },
  {
    tag: 'Studio education',
    title: 'Weekend academy sessions built around practical garment construction.',
    description:
      'Students learn pattern adaptation, finishing, and presentation with mentor critique built in.',
    image: websiteImage(
      'fashion design academy class in elegant modern studio, African women learning pattern making and garment construction, realistic editorial website photo',
      'landscape_16_9'
    ),
  },
  {
    tag: 'Fabric curation',
    title: 'Premium sourcing support for structured occasionwear and bridal pieces.',
    description:
      'From lace to mikado, each textile is matched to motion, finish, and event setting.',
    image: websiteImage(
      'luxury textile selection table with bridal fabrics, beads, lace, satin, modern fashion studio, realistic product style website image',
      'landscape_16_9'
    ),
  },
];

export const academyTracks = [
  {
    title: 'Pattern Confidence',
    summary: 'Transform blocks into polished silhouettes for skirts, sleeves, bodices, and trousers.',
    bullets: ['Skirt engineering', 'Sleeve variation systems', 'Structured bodice shaping'],
  },
  {
    title: 'Construction Precision',
    summary: 'Use industry finishing methods to improve fit, structure, and durability.',
    bullets: ['Clean seams and lining', 'Boning and support', 'Professional pressing workflow'],
  },
  {
    title: 'Creative Direction',
    summary: 'Build collections with stronger styling logic, client presentation, and finishing taste.',
    bullets: ['Moodboards and edits', 'Look presentation', 'Pricing and delivery basics'],
  },
];

export const academyTimeline = [
  { week: 'Weeks 1-2', title: 'Foundation reset', detail: 'Measurements, fit logic, core pattern corrections.' },
  { week: 'Weeks 3-5', title: 'Silhouette building', detail: 'Sleeves, necklines, trousers, and advanced skirt volume.' },
  { week: 'Weeks 6-8', title: 'Structure and support', detail: 'Corsetry, finishing systems, and couture-level assembly.' },
  { week: 'Weeks 9-12', title: 'Presentation and polish', detail: 'Final look production, critique, photography, and client readiness.' },
];

export const atelierServices = [
  {
    title: 'Bridal & Reception',
    description: 'Custom bridal gowns, bridal trains, second looks, and fitting-intensive reception silhouettes.',
    price: 'From 650k',
    amount: 650000,
    planCode: 'bridal-bespoke',
  },
  {
    title: 'Occasion Couture',
    description: 'Statement dresses, tailored eveningwear, and event-specific styling for memorable entrances.',
    price: 'From 280k',
    amount: 280000,
    planCode: 'occasion-couture',
  },
  {
    title: 'Private Consultations',
    description: 'Fabric review, wardrobe planning, fit rescue, and event styling strategy sessions.',
    price: 'From 75k',
    amount: 75000,
    planCode: 'private-consultation',
  },
];

export const paymentPlans = [
  {
    slug: 'consultation',
    title: 'Consultation Session',
    subtitle: 'Fast-track advisory call or studio session',
    amount: 75000,
    amountLabel: 'NGN 75,000',
    currency: 'NGN',
    planCode: 'private-consultation',
    description: 'Secure your preferred slot for styling, fabric, or project strategy guidance.',
  },
  {
    slug: 'academy-seat',
    title: 'Academy Seat Deposit',
    subtitle: 'Reserve a seat in the next structured cohort',
    amount: 120000,
    amountLabel: 'NGN 120,000',
    currency: 'NGN',
    planCode: 'academy-seat',
    description: 'Locks in enrollment review, onboarding, and your first studio preparation pack.',
  },
  {
    slug: 'bridal-deposit',
    title: 'Bridal Project Deposit',
    subtitle: 'Begin a bridal couture production timeline',
    amount: 350000,
    amountLabel: 'NGN 350,000',
    currency: 'NGN',
    planCode: 'bridal-deposit',
    description: 'Starts your moodboard, fabric strategy, body measurements, and fitting calendar.',
  },
];

export const paymentSteps = [
  {
    step: '01',
    title: 'Select a package',
    detail: 'Choose the consultation, academy, or couture payment lane that matches your need.',
  },
  {
    step: '02',
    title: 'Complete secure checkout',
    detail: 'Use Paystack to pay with card, bank transfer, USSD, or supported wallet options.',
  },
  {
    step: '03',
    title: 'Receive instant follow-up',
    detail: 'Your receipt, next steps, and studio response are triggered immediately after payment.',
  },
];

export const atelierProcess = [
  { step: '01', title: 'Discovery call', detail: 'Project goals, occasion, references, and delivery window.' },
  { step: '02', title: 'Concept & fabric', detail: 'Sketch direction, fabric curation, and construction mapping.' },
  { step: '03', title: 'Fittings & refinement', detail: 'Shape balance, support points, movement, and finish control.' },
  { step: '04', title: 'Final styling handoff', detail: 'Garment delivery, care notes, and coordinated accessories guidance.' },
];

export const journalStories = [
  {
    category: 'Trend Brief',
    title: 'Glass textures, liquid satin, and why reflective finishes feel current.',
    excerpt:
      'A studio note on combining softness with structure to keep modern eveningwear elevated instead of flashy.',
  },
  {
    category: 'Behind The Seams',
    title: 'How we turn a sketch into a fitting-ready prototype in seven studio moves.',
    excerpt:
      'From reference editing to toile testing, this breaks down the professional process clients rarely see.',
  },
  {
    category: 'Student Spotlight',
    title: 'What changes when a weekend learner begins working like a studio professional.',
    excerpt:
      'The biggest leap is not speed. It is decision quality, finishing discipline, and confident revisions.',
  },
];

export const testimonials = [
  {
    name: 'Ada N.',
    role: 'Bridal Client',
    quote:
      'The finish was exceptional. Every fitting felt organized, and the final dress looked expensive from every angle.',
  },
  {
    name: 'Feyi O.',
    role: 'Academy Graduate',
    quote:
      'I stopped guessing. The program gave me a repeatable system for fit, finishing, and presenting my work professionally.',
  },
  {
    name: 'Tosin A.',
    role: 'Consulting Client',
    quote:
      'The consultation saved me from costly fabric mistakes and helped me plan a full event wardrobe with confidence.',
  },
];

export const faqs = [
  {
    question: 'Do you work with clients outside Lagos?',
    answer: 'Yes. We support remote consultations first, then confirm fitting logistics and production milestones.',
  },
  {
    question: 'Is the academy suitable for total beginners?',
    answer: 'The current flagship cohort is best for learners with basic sewing familiarity who want intermediate structure.',
  },
  {
    question: 'Can I book both tailoring and consulting?',
    answer: 'Yes. Many clients begin with strategy, then move into garment creation once direction and budget are clear.',
  },
];

export const contactChannels = [
  { label: 'Call or WhatsApp', value: '+234 907 745 6229' },
  { label: 'Email', value: 'beccatee.atelier@gmail.com' },
  { label: 'Studio Base', value: 'RCCG Camp, Along Lagos-Ibadan Expressway' },
  { label: 'Hours', value: 'Mon-Sat, 10am - 6pm' },
];
