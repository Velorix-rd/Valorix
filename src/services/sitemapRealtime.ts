/**
 * Real-time Dynamic Sitemap Listener and Sync Service for Velorix
 * 
 * Listens to public files in Firestore and updates the dynamic sitemap XML in memory/state
 * and notifies the backend/local cache whenever a new public file is uploaded, modified, or made private.
 */

import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { generateDynamicSitemapXml, isEligibleForPublicSitemap, SitemapFileEntry } from '../utils/sitemapGenerator';
import { getApiUrl } from '../config/api';

let cachedSitemapXml: string = '';
let activeListeners: (() => void)[] = [];

/**
 * Initialize real-time sitemap sync listener across the application
 */
export function initRealtimeSitemapSync(onSitemapUpdated?: (xml: string, eligibleCount: number) => void): () => void {
  try {
    const q = query(
      collection(db, 'files'),
      where('isPublic', '==', true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const publicFiles: SitemapFileEntry[] = [];
      
      snapshot.docs.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id) {
          publicFiles.push({
            id: String(data.id),
            name: data.name ? String(data.name) : undefined,
            isPublic: data.isPublic === true,
            createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
            expiryDate: data.expiryDate ? String(data.expiryDate) : null,
            password: data.password ? String(data.password) : null,
            isEncrypted: data.isEncrypted === true,
            isGuest: data.isGuest === true,
            ownerId: data.ownerId ? String(data.ownerId) : undefined
          });
        }
      });

      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://velorix-rd.github.io/Valorix';
      const isGitHub = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
      const baseUrl = isGitHub ? 'https://velorix-rd.github.io/Valorix' : currentOrigin;

      const updatedXml = generateDynamicSitemapXml(publicFiles, { baseUrl });
      cachedSitemapXml = updatedXml;

      const eligibleCount = publicFiles.filter(isEligibleForPublicSitemap).length;
      
      if (onSitemapUpdated) {
        onSitemapUpdated(updatedXml, eligibleCount);
      }

      // Sync with server memory if backend API is reachable
      notifyServerSitemapUpdate(publicFiles).catch(() => {
        // Safe silent fail for static deployments
      });
    }, (err) => {
      console.warn('[Sitemap] Public files live listener notice:', err);
    });

    activeListeners.push(unsubscribe);
    return () => {
      unsubscribe();
      activeListeners = activeListeners.filter(l => l !== unsubscribe);
    };
  } catch (err) {
    console.warn('[Sitemap] Init error:', err);
    return () => {};
  }
}

/**
 * Notify the server backend about updated public file records to refresh server-side sitemap cache
 */
async function notifyServerSitemapUpdate(files: SitemapFileEntry[]): Promise<void> {
  if (typeof window === 'undefined') return;
  const isStaticOnly = window.location.hostname.includes('github.io') || window.location.hostname.includes('netlify.app');
  if (isStaticOnly) return;

  try {
    const eligibleOnly = files.filter(isEligibleForPublicSitemap);
    const syncUrl = getApiUrl('/api/sitemap-sync');
    await fetch(syncUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicFiles: eligibleOnly })
    });
  } catch {
    // Non-blocking
  }
}

/**
 * Get current cached sitemap XML
 */
export function getCachedSitemapXml(): string {
  return cachedSitemapXml;
}

/**
 * Perform a one-time manual refresh of public files and return the dynamic XML
 */
export async function refreshSitemapXml(): Promise<{ xml: string; count: number }> {
  try {
    const q = query(
      collection(db, 'files'),
      where('isPublic', '==', true)
    );
    const snapshot = await getDocs(q);
    const publicFiles: SitemapFileEntry[] = [];
    
    snapshot.docs.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.id) {
        publicFiles.push({
          id: String(data.id),
          name: data.name ? String(data.name) : undefined,
          isPublic: data.isPublic === true,
          createdAt: data.createdAt ? String(data.createdAt) : new Date().toISOString(),
          expiryDate: data.expiryDate ? String(data.expiryDate) : null,
          password: data.password ? String(data.password) : null,
          isEncrypted: data.isEncrypted === true,
          isGuest: data.isGuest === true
        });
      }
    });

    const isGitHub = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    const baseUrl = isGitHub 
      ? 'https://velorix-rd.github.io/Valorix' 
      : (typeof window !== 'undefined' ? window.location.origin : 'https://velorix-rd.github.io/Valorix');

    const xml = generateDynamicSitemapXml(publicFiles, { baseUrl });
    cachedSitemapXml = xml;
    const count = publicFiles.filter(isEligibleForPublicSitemap).length;
    return { xml, count };
  } catch (err) {
    console.warn('[Sitemap] One-time refresh error:', err);
    return { xml: cachedSitemapXml, count: 0 };
  }
}
