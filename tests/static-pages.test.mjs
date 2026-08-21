import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const root = new URL('../', import.meta.url);

function read(relativePath) {
  return readFileSync(new URL(relativePath, root), 'utf8');
}

test('core html pages exist', () => {
  for (const file of ['index.html', 'about.html', 'services.html', 'academy.html', 'contact.html', 'privacy.html', 'terms.html', '404.html']) {
    assert.equal(existsSync(new URL(file, root)), true, `${file} should exist`);
  }
});

test('html entry points load the shared stylesheet and module renderer without paystack config', () => {
  for (const file of ['index.html', 'about.html', 'services.html', 'academy.html', 'privacy.html', 'terms.html']) {
    const html = read(file);
    assert.match(html, /<div id="app"><\/div>/);
    assert.match(html, /<script type="module" src="\.\/main\.js"><\/script>/);
    assert.doesNotMatch(html, /Paystack|__FASHION_HUB_CONFIG__|paystack/i);
  }
});

test('new static pages use the correct Beccatee Atelier metadata', () => {
  assert.match(read('index.html'), /Beccatee Atelier \| Bespoke Fashion & Training Academy Nigeria/);
  assert.match(read('about.html'), /About Beccatee Atelier/);
  assert.match(read('services.html'), /Our Services \| Beccatee Atelier/);
  assert.match(read('academy.html'), /Apply Now \| 12 Weekends Fashion Training — Beccatee Atelier/);
  assert.match(read('privacy.html'), /Privacy Policy \| Beccatee Atelier/);
  assert.match(read('terms.html'), /Terms & Conditions \| Beccatee Atelier/);
  assert.doesNotMatch(read('index.html'), /Beccatee Fashion Hub|GitHub Pages-ready|Built as a static HTML/i);
});

test('404 page redirects visitors back to the home page', () => {
  const html = read('404.html');
  assert.match(html, /url=\.\/index\.html/);
  assert.match(html, /home page/i);
});
