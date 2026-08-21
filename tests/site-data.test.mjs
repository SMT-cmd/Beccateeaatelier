import test from 'node:test';
import assert from 'node:assert/strict';
import {
  pages,
  resolvePageFromHash,
  getPageMeta,
} from '../site-data.mjs';

test('resolvePageFromHash falls back to home for unknown routes', () => {
  assert.equal(resolvePageFromHash('#/unknown'), 'home');
});

test('resolvePageFromHash resolves supported slugs', () => {
  assert.equal(resolvePageFromHash('#/academy'), 'academy');
  assert.equal(resolvePageFromHash('#contact'), 'contact');
});

test('pages expose a complete multi-page navigation model', () => {
  assert.ok(pages.length >= 5);
  assert.deepEqual(
    pages.map((page) => page.slug),
    ['home', 'academy', 'atelier', 'journal', 'contact']
  );
  assert.deepEqual(
    pages.map((page) => page.label),
    ['Home', 'Academy', 'Atelier', 'Journal', 'Contact']
  );
});

test('getPageMeta returns the active page definition', () => {
  assert.equal(getPageMeta('atelier').title, 'Bespoke Atelier');
});
