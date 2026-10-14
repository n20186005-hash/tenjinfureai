import type { APIRoute } from 'astro';

const pages = ['', '/about', '/events', '/access', '/food', '/nearby', '/card', '/privacy', '/events/chikugogawa-megumi-2026', '/events/kankyo-festival-2026'];

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://tenjinfureai.com');
  const urls = pages.map((path) => `  <url><loc>${new URL(path || '/', base).href}</loc></url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
