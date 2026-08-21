import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pages,
  resolvePageFromHash,
  getPageMeta,
  paymentPlans,
  operationsMetrics,
  createPaymentReference,
  buildPaystackInlineConfig,
} from '../site-data.mjs';

test('resolvePageFromHash falls back to home for unknown routes', () => {
  assert.equal(resolvePageFromHash('#/unknown'), 'home');
});

test('resolvePageFromHash resolves supported slugs', () => {
  assert.equal(resolvePageFromHash('#/academy'), 'academy');
  assert.equal(resolvePageFromHash('#/payments'), 'payments');
  assert.equal(resolvePageFromHash('#contact'), 'contact');
});

test('pages expose a complete multi-page navigation model', () => {
  assert.ok(pages.length >= 7);
  assert.deepEqual(
    pages.map((page) => page.slug),
    ['home', 'services', 'academy', 'atelier', 'journal', 'payments', 'contact']
  );
  assert.deepEqual(
    pages.map((page) => page.label),
    ['Home', 'Services', 'Academy', 'Atelier', 'Journal', 'Payments', 'Contact']
  );
});

test('getPageMeta returns the active page definition', () => {
  assert.equal(getPageMeta('atelier').title, 'Bespoke Atelier');
});

test('payment plans expose premium checkout options', () => {
  assert.ok(paymentPlans.length >= 3);
  assert.equal(paymentPlans[0].currency, 'NGN');
  assert.match(paymentPlans[0].amountLabel, /NGN/i);
});

test('operations metrics support real-time studio storytelling', () => {
  assert.ok(operationsMetrics.length >= 3);
  assert.ok(operationsMetrics.every((metric) => metric.label && metric.value));
});

test('createPaymentReference generates a prefixed unique reference', () => {
  const reference = createPaymentReference();

  assert.match(reference, /^FH-/);
  assert.ok(reference.length > 12);
});

test('buildPaystackInlineConfig converts amounts to kobo and keeps metadata', () => {
  const config = buildPaystackInlineConfig({
    key: 'pk_test_example',
    email: 'client@example.com',
    amount: 125000,
    planCode: 'bridal-bespoke',
    metadata: { source: 'website' },
    callbackUrl: 'https://fashionhub.example/payments/callback',
    reference: 'FH-123',
  });

  assert.equal(config.key, 'pk_test_example');
  assert.equal(config.email, 'client@example.com');
  assert.equal(config.amount, 12500000);
  assert.equal(config.plan, 'bridal-bespoke');
  assert.equal(config.ref, 'FH-123');
  assert.deepEqual(config.metadata, { source: 'website' });
  assert.equal(config.callback_url, 'https://fashionhub.example/payments/callback');
 });
