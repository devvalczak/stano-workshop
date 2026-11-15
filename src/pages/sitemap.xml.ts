import type { APIRoute } from 'astro';
import { absolute } from '../site';
import { defaultLang, languages, routes } from '../i18n';

export const GET: APIRoute = () => {
  const entries = Object.values(routes).flatMap((page) => {
    const alternates = [
      ...languages.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${absolute(page[l])}"/>`),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${absolute(page[defaultLang])}"/>`,
    ].join('');
    return languages.map((lang) => `<url><loc>${absolute(page[lang])}</loc>${alternates}</url>`);
  });

  const urlset = 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"';
  const xml = `<?xml version="1.0" encoding="UTF-8"?><urlset ${urlset}>${entries.join('')}</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml' } });
};
