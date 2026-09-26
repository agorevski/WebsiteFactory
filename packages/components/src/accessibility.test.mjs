import assert from 'node:assert/strict';
import test from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  root: new URL('..', import.meta.url).pathname,
  server: { middlewareMode: true }
});

try {
  const [{ Navigation }, { Hero }, { FAQ }, { Hours }] = await Promise.all([
    server.ssrLoadModule('/src/Navigation.tsx'),
    server.ssrLoadModule('/src/Hero.tsx'),
    server.ssrLoadModule('/src/FAQ.tsx'),
    server.ssrLoadModule('/src/Utility.tsx')
  ]);

  test('mobile navigation exposes links and CTA through a native disclosure', () => {
    const html = renderToStaticMarkup(createElement(Navigation, {
      data: {
        brand: { name: 'Example' },
        links: [{ href: '/services', label: 'Services', current: true, external: false }],
        cta: { href: '/contact', label: 'Contact' }
      }
    }));

    assert.match(html, /<details class="w-full md:hidden"><summary[^>]*>Menu<\/summary>/);
    assert.match(html, /<div class="flex flex-col items-start gap-4 border-t border-slate-200 py-4"><a href="\/services" aria-current="page"/);
    assert.match(html, /<a href="\/contact"[^>]*>Contact<\/a><\/div><\/details>/);
  });

  test('hero background is decorative while foreground media retains its description', () => {
    const html = renderToStaticMarkup(createElement(Hero, {
      data: {
        title: 'Welcome',
        backgroundImage: { src: '/background.jpg', alt: 'Decorative pattern' },
        image: { src: '/team.jpg', alt: 'Our team' }
      }
    }));

    assert.match(html, /src="\/background.jpg" alt="" aria-hidden="true"/);
    assert.match(html, /src="\/team.jpg" alt="Our team"/);
  });

  test('FAQ retains the native disclosure marker', () => {
    const html = renderToStaticMarkup(createElement(FAQ, {
      data: { title: 'Questions', items: [{ question: 'When?', answer: 'Today.' }] }
    }));

    assert.match(html, /<details[^>]*><summary[^>]*>When\?<\/summary>/);
    assert.doesNotMatch(html, /list-none|marker:hidden/);
  });

  test('hours section is named with or without a supplied title', () => {
    const entries = [{ days: 'Monday', opens: '09:00', closes: '17:00' }];

    assert.match(renderToStaticMarkup(createElement(Hours, { data: { entries } })), /<section aria-label="Business hours"/);
    assert.match(renderToStaticMarkup(createElement(Hours, { data: { title: 'Opening times', entries } })), /<section aria-label="Opening times"/);
  });
} finally {
  await server.close();
}
