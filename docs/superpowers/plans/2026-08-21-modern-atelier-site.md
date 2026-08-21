# Modern Atelier Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the current single-page fashion site into a polished multi-page experience with premium visuals, glassmorphism, richer content, and stronger conversion flows.

**Architecture:** Keep the project lightweight by preserving the single React entry file, but add a dedicated content-and-routing module that powers client-side page switching. Rebuild the UI around reusable sections, animated visual layers, and realistic business content for home, academy, atelier, journal, and contact views.

**Tech Stack:** React, lucide-react icons, Tailwind utility classes, browser History/hash routing, Node built-in test runner

---

### Task 1: Add a tested route and content model

**Files:**
- Create: `site-data.mjs`
- Create: `tests/site-data.test.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
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
});

test('getPageMeta returns the active page definition', () => {
  assert.equal(getPageMeta('atelier').title, 'Bespoke Atelier');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-data.test.mjs`
Expected: FAIL with module-not-found for `site-data.mjs`

- [ ] **Step 3: Write minimal implementation**

```javascript
export const pages = [
  { slug: 'home', label: 'Home', title: 'Luxury Fashion House' },
  { slug: 'academy', label: 'Academy', title: 'Fashion Academy' },
  { slug: 'atelier', label: 'Atelier', title: 'Bespoke Atelier' },
  { slug: 'journal', label: 'Journal', title: 'Studio Journal' },
  { slug: 'contact', label: 'Contact', title: 'Book a Consultation' },
];

export function resolvePageFromHash(hash = '') {
  const normalized = hash.replace(/^#\/?/, '').trim().toLowerCase();
  return pages.some((page) => page.slug === normalized) ? normalized : 'home';
}

export function getPageMeta(slug) {
  return pages.find((page) => page.slug === slug) ?? pages[0];
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site-data.test.mjs`
Expected: PASS with 4 passing tests

- [ ] **Step 5: Commit**

```bash
git add tests/site-data.test.mjs site-data.mjs
git commit -m "test: add route data coverage"
```

### Task 2: Rebuild the app shell into a multi-page premium experience

**Files:**
- Modify: `index.html`
- Use data from: `site-data.mjs`

- [ ] **Step 1: Write the failing test**

```javascript
import test from 'node:test';
import assert from 'node:assert/strict';
import { pages } from '../site-data.mjs';

test('site model supports all primary navigation destinations', () => {
  assert.deepEqual(
    pages.map((page) => page.label),
    ['Home', 'Academy', 'Atelier', 'Journal', 'Contact']
  );
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/site-data.test.mjs`
Expected: FAIL until labels in `site-data.mjs` match the final navigation model

- [ ] **Step 3: Write minimal implementation**

```javascript
import React, { useEffect, useMemo, useState } from 'react';
import { pages, resolvePageFromHash, getPageMeta } from './site-data.mjs';

const [activePage, setActivePage] = useState(resolvePageFromHash(window.location.hash));

useEffect(() => {
  const syncPage = () => setActivePage(resolvePageFromHash(window.location.hash));
  window.addEventListener('hashchange', syncPage);
  return () => window.removeEventListener('hashchange', syncPage);
}, []);

function navigateTo(slug) {
  window.location.hash = slug === 'home' ? '#/' : `#/${slug}`;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node --test tests/site-data.test.mjs`
Expected: PASS with labels aligned to the final nav

- [ ] **Step 5: Commit**

```bash
git add index.html site-data.mjs tests/site-data.test.mjs
git commit -m "feat: redesign atelier website experience"
```

### Task 3: Verify the implementation

**Files:**
- Verify: `index.html`
- Verify: `site-data.mjs`
- Verify: `tests/site-data.test.mjs`

- [ ] **Step 1: Run automated verification**

```bash
node --test tests/site-data.test.mjs
```

- [ ] **Step 2: Inspect git diff**

```bash
git diff -- index.html site-data.mjs tests/site-data.test.mjs docs/superpowers/plans/2026-08-21-modern-atelier-site.md
```

- [ ] **Step 3: Confirm expected outcome**

Expected:
- Multi-page navigation model exists
- Route helpers are tested
- App content is substantially upgraded
- No syntax or import mistakes appear in touched files

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/plans/2026-08-21-modern-atelier-site.md index.html site-data.mjs tests/site-data.test.mjs
git commit -m "docs: add modern atelier site plan"
```
