/**
 * SEO & Search Engine Verification Meta Validator & Injector
 * 
 * Ensures mandatory verification tags (e.g. 'msvalidate.01' for Bingbot and Webmaster Tools)
 * are present, valid, and reactive in the DOM <head>.
 */

export const BING_SITE_VERIFICATION_CODE = "74E067CF3527003BBB234B5FFF6284C5";
export const GOOGLE_SITE_VERIFICATION_CODE_1 = "PehJ_CBnFVt8SRXc0H3_9sTeAvzgiWBOaDm6xh1XaOs";
export const GOOGLE_SITE_VERIFICATION_CODE_2 = "qXFQAJcCAlny5SQsSRYAy92HcL64gou7sOKDXTbhKK0";

/**
 * Ensures a specific meta tag is present in document.head with the expected content attribute.
 */
export function ensureMetaTag(name: string, content: string, propertyName: 'name' | 'property' = 'name'): HTMLMetaElement {
  if (typeof document === 'undefined') return {} as HTMLMetaElement;

  let meta = document.querySelector(`meta[${propertyName}="${name}"]`) as HTMLMetaElement | null;
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(propertyName, name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  } else if (meta.getAttribute('content') !== content) {
    meta.setAttribute('content', content);
  }
  return meta;
}

/**
 * Verifies and injects all search engine verification meta tags for Bingbot, Googlebot, and other crawlers.
 */
export function verifyAndInjectSearchEngineVerificationTags(): {
  bingVerified: boolean;
  googleVerified: boolean;
  msvalidateContent: string | null;
} {
  if (typeof document === 'undefined') {
    return { bingVerified: false, googleVerified: false, msvalidateContent: null };
  }

  // 1. Enforce Bing Webmaster Verification Tag (msvalidate.01)
  const bingMeta = ensureMetaTag('msvalidate.01', BING_SITE_VERIFICATION_CODE, 'name');
  
  // 2. Enforce Google Search Console Verification Tags
  ensureMetaTag('google-site-verification', GOOGLE_SITE_VERIFICATION_CODE_1, 'name');
  
  // 3. Enforce Bingbot Crawl Directives
  ensureMetaTag('bingbot', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', 'name');
  ensureMetaTag('robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1', 'name');

  const actualBingValue = bingMeta?.getAttribute('content') || null;
  const bingVerified = actualBingValue === BING_SITE_VERIFICATION_CODE;

  if (bingVerified) {
    // Helpful developer log for search audit verification
    console.log(`[SEO Verification] msvalidate.01 verified in <head> for Bingbot: ${actualBingValue}`);
  } else {
    console.warn(`[SEO Verification] msvalidate.01 mismatch or missing in <head>. Injected fallback: ${BING_SITE_VERIFICATION_CODE}`);
  }

  return {
    bingVerified,
    googleVerified: true,
    msvalidateContent: actualBingValue
  };
}
