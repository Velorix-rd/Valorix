/**
 * Dynamic Sitemap XML Generator & Privacy Guard for Velorix
 * 
 * Safely generates SEO-standard XML sitemaps containing only validated public share URLs.
 * Strictly prevents inclusion of private, sensitive, password-protected, or expired paths.
 */

export interface SitemapFileEntry {
  id: string;
  name?: string;
  isPublic: boolean;
  createdAt: string;
  expiryDate?: string | null;
  password?: string | null;
  isEncrypted?: boolean;
  isGuest?: boolean;
  ownerId?: string;
}

export interface SitemapGenerationOptions {
  baseUrl?: string;
  includeStaticPages?: boolean;
  includeShareLinks?: boolean;
}

export interface StaticSitemapRoute {
  path: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: string;
}

export const OFFICIAL_PLATFORM_ROUTES: StaticSitemapRoute[] = [
  { path: 'vault/', changefreq: 'daily', priority: '0.9' },
  { path: 'transfer/', changefreq: 'daily', priority: '0.9' },
  { path: 'offline-share/', changefreq: 'daily', priority: '0.9' },
  { path: 'tools/', changefreq: 'weekly', priority: '0.9' },
  { path: 'dock/', changefreq: 'weekly', priority: '0.8' },
  { path: 'storage/', changefreq: 'monthly', priority: '0.8' },
  { path: 'security/', changefreq: 'monthly', priority: '0.8' },
  { path: 'features/', changefreq: 'weekly', priority: '0.8' },
  { path: 'backup/', changefreq: 'monthly', priority: '0.8' },
  { path: 'servers/', changefreq: 'weekly', priority: '0.8' },
  { path: 'docs/', changefreq: 'weekly', priority: '0.8' },
  { path: 'faq/', changefreq: 'weekly', priority: '0.8' },
  { path: 'contact/', changefreq: 'monthly', priority: '0.7' },
  { path: 'privacy/', changefreq: 'monthly', priority: '0.6' },
  { path: 'terms/', changefreq: 'monthly', priority: '0.6' }
];

const DEFAULT_BASE_URL = 'https://velorix-rd.github.io/Valorix';

/**
 * Filter and validate whether a file is strictly eligible for public indexing
 */
export function isEligibleForPublicSitemap(file: SitemapFileEntry): boolean {
  if (!file || typeof file !== 'object') return false;

  // 1. Must be explicitly public
  if (file.isPublic !== true) return false;

  // 2. Must not have an active password protection
  if (file.password && String(file.password).trim().length > 0) return false;

  // 3. Must not be expired
  if (file.expiryDate) {
    try {
      const expiryTime = new Date(file.expiryDate).getTime();
      if (!isNaN(expiryTime) && expiryTime <= Date.now()) {
        return false;
      }
    } catch {
      return false;
    }
  }

  // 4. File ID must match safe alphanumerical pattern (anti-injection guard)
  if (!file.id || typeof file.id !== 'string') return false;
  const safeIdRegex = /^[a-zA-Z0-9_\-\.]+$/;
  if (!safeIdRegex.test(file.id) || file.id.length > 128) return false;

  // 5. Must not contain sensitive tokens or secret prefixes
  const lowerId = file.id.toLowerCase();
  if (
    lowerId.includes('secret') || 
    lowerId.includes('private') || 
    lowerId.includes('token') || 
    lowerId.includes('temp-') || 
    lowerId.includes('admin')
  ) {
    return false;
  }

  return true;
}

/**
 * Format ISO date string into standard sitemap W3C YYYY-MM-DD format
 */
export function formatSitemapDate(dateStr?: string | number | Date): string {
  try {
    if (!dateStr) return new Date().toISOString().split('T')[0];
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
    return d.toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

/**
 * Escape special XML characters to prevent malformed XML or injection
 */
export function escapeXml(unsafeStr: string): string {
  return unsafeStr
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate fully compliant XML sitemap string from public files according to Bing & Google Webmaster Guidelines:
 * - Absolute canonical URLs only
 * - No hash fragments (#) or query strings
 * - Normalized trailing slashes (root has trailing slash, file paths do not)
 * - Accurate W3C formatted lastmod tags
 * - Deduplicated unique URL paths
 */
export function generateDynamicSitemapXml(
  files: SitemapFileEntry[], 
  options: SitemapGenerationOptions = {}
): string {
  const rawBaseUrl = options.baseUrl || DEFAULT_BASE_URL;
  // Normalize base URL without trailing slash
  const cleanBaseUrl = rawBaseUrl.trim().replace(/\/+$/, '');
  const today = formatSitemapDate();

  // Filter only eligible public files
  const eligibleFiles = files.filter(isEligibleForPublicSitemap);

  // Sort files by creation date descending (newest first)
  eligibleFiles.sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  // Track unique URLs to guarantee zero duplicate paths
  const seenUrls = new Set<string>();
  const entries: Array<{ loc: string; lastmod: string; changefreq: string; priority: string }> = [];

  // 1. Root Application Canonical URL (Must have trailing slash for domain/repo root)
  const rootUrl = `${cleanBaseUrl}/`;
  seenUrls.add(rootUrl);
  entries.push({
    loc: rootUrl,
    lastmod: today,
    changefreq: 'daily',
    priority: '1.0'
  });

  // 2. Official Platform Section & Tool Pages (Guaranteed HTTP 200 OK static destinations)
  if (options.includeStaticPages !== false) {
    OFFICIAL_PLATFORM_ROUTES.forEach((route) => {
      const pageUrl = `${cleanBaseUrl}/${route.path}`;
      if (!seenUrls.has(pageUrl)) {
        seenUrls.add(pageUrl);
        entries.push({
          loc: pageUrl,
          lastmod: today,
          changefreq: route.changefreq,
          priority: route.priority
        });
      }
    });
  }

  // 3. Canonical Public Share URLs (only if explicit SSR/static prerender is enabled)
  if (options.includeShareLinks === true) {
    eligibleFiles.forEach((file) => {
      const cleanId = String(file.id).trim().replace(/^\/+|\/+$/g, '');
      if (!cleanId) return;

      // Canonical direct URL without hash (#) or trailing slash
      const fileShareUrl = `${cleanBaseUrl}/share/${encodeURIComponent(cleanId)}`;

      if (!seenUrls.has(fileShareUrl)) {
        seenUrls.add(fileShareUrl);
        const fileLastMod = formatSitemapDate(file.createdAt);
        entries.push({
          loc: fileShareUrl,
          lastmod: fileLastMod,
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
    });
  }

  let xmlUrls = '';
  entries.forEach((entry) => {
    xmlUrls += `  <url>\n    <loc>${escapeXml(entry.loc)}</loc>\n    <lastmod>${entry.lastmod}</lastmod>\n    <changefreq>${entry.changefreq}</changefreq>\n    <priority>${entry.priority}</priority>\n  </url>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls.trimEnd()}\n</urlset>`.trim();
}
