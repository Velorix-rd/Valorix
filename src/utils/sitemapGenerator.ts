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
}

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
 * Generate fully compliant XML sitemap string from public files
 */
export function generateDynamicSitemapXml(
  files: SitemapFileEntry[], 
  options: SitemapGenerationOptions = {}
): string {
  const rawBaseUrl = options.baseUrl || DEFAULT_BASE_URL;
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const today = formatSitemapDate();

  // Filter only eligible public files
  const eligibleFiles = files.filter(isEligibleForPublicSitemap);

  // Sort files by creation date descending (newest first)
  eligibleFiles.sort((a, b) => {
    const timeA = new Date(a.createdAt || 0).getTime();
    const timeB = new Date(b.createdAt || 0).getTime();
    return timeB - timeA;
  });

  const isGitHubPages = baseUrl.includes('github.io');

  let xmlUrls = '';

  // 1. Root Application URL (Always Highest Priority)
  xmlUrls += `  <url>
    <loc>${escapeXml(`${baseUrl}/`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>\n`;

  // 2. Canonical Public Share URLs for each eligible public file
  eligibleFiles.forEach((file) => {
    const fileLastMod = formatSitemapDate(file.createdAt);
    // Construct clean canonical share URL
    const fileShareUrl = isGitHubPages 
      ? `${baseUrl}/#/share/${encodeURIComponent(file.id)}`
      : `${baseUrl}/share/${encodeURIComponent(file.id)}`;

    xmlUrls += `  <url>
    <loc>${escapeXml(fileShareUrl)}</loc>
    <lastmod>${fileLastMod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls.trimEnd()}
</urlset>`.trim();
}
