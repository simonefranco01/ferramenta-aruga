import type { APIRoute } from 'astro';
import { site } from '../lib/site';
import { absoluteUrl } from '../lib/url';

// In staging blocca tutto; in produzione consente tutto e indica la sitemap.
export const GET: APIRoute = ({ site: siteUrl }) => {
  const body = site.staging
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${absoluteUrl('/sitemap-index.xml', siteUrl)}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
