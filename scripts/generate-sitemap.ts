#!/usr/bin/env node

/**
 * Build-time / Standalone Dynamic Sitemap Generator Script
 * 
 * Usage:
 *   npx tsx scripts/generate-sitemap.ts
 * 
 * Fetches current public files from Firestore / local uploads registry and generates public/sitemap.xml
 */

import fs from 'fs-extra';
import path from 'path';
import { generateDynamicSitemapXml, SitemapFileEntry } from '../src/utils/sitemapGenerator.js';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const SITEMAP_PATH = path.join(PUBLIC_DIR, 'sitemap.xml');
const ROOT_SITEMAP_PATH = path.join(process.cwd(), 'sitemap.xml');
const SITEMAP_INDEX_PATH = path.join(PUBLIC_DIR, 'sitemap_index.xml');
const ROOT_SITEMAP_INDEX_PATH = path.join(process.cwd(), 'sitemap_index.xml');
const BASE_URL = process.env.SITE_URL || 'https://velorix-rd.github.io/Valorix';

async function fetchPublicFilesFromFirestore(): Promise<SitemapFileEntry[]> {
  try {
    const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
    if (!fs.existsSync(configPath)) {
      console.log('[Sitemap Script] firebase-applet-config.json not found, using static entries.');
      return [];
    }

    const config = fs.readJsonSync(configPath);
    const projectId = config.projectId;
    const databaseId = config.firestoreDatabaseId || '(default)';
    
    if (!projectId) return [];

    console.log(`[Sitemap Script] Querying public files from Firestore database: ${databaseId}...`);
    
    // Use Firestore REST API to query public files without requiring node SDK auth credentials
    const endpoint = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/${databaseId}/documents:runQuery`;
    
    const queryPayload = {
      structuredQuery: {
        from: [{ collectionId: 'files' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'isPublic' },
            op: 'EQUAL',
            value: { booleanValue: true }
          }
        },
        limit: 500
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(queryPayload)
    });

    if (!response.ok) {
      console.warn(`[Sitemap Script] Firestore REST query returned status ${response.status}.`);
      return [];
    }

    const results = await response.json();
    if (!Array.isArray(results)) return [];

    const publicFiles: SitemapFileEntry[] = [];
    for (const item of results) {
      if (!item.document || !item.document.fields) continue;
      const fields = item.document.fields;
      
      const id = fields.id?.stringValue || path.basename(item.document.name || '');
      const isPublic = fields.isPublic?.booleanValue ?? false;
      const createdAt = fields.createdAt?.stringValue || item.document.createTime || new Date().toISOString();
      const password = fields.password?.stringValue || null;
      const expiryDate = fields.expiryDate?.stringValue || null;
      const isEncrypted = fields.isEncrypted?.booleanValue;

      if (id && isPublic) {
        publicFiles.push({
          id,
          isPublic,
          createdAt,
          password,
          expiryDate,
          isEncrypted
        });
      }
    }

    console.log(`[Sitemap Script] Successfully retrieved ${publicFiles.length} public file records.`);
    return publicFiles;
  } catch (err) {
    console.warn('[Sitemap Script] Firestore fetch note:', err instanceof Error ? err.message : err);
    return [];
  }
}

async function main() {
  console.log('[Sitemap Script] Starting clean sitemap.xml generation for GitHub Pages...');
  fs.ensureDirSync(PUBLIC_DIR);

  const publicFiles = await fetchPublicFilesFromFirestore();
  // Static GitHub Pages serves SPA - includeShareLinks false ensures zero 404 URLs
  const xml = generateDynamicSitemapXml(publicFiles, { 
    baseUrl: BASE_URL,
    includeShareLinks: false 
  });

  await fs.writeFile(SITEMAP_PATH, xml, 'utf8');
  await fs.writeFile(ROOT_SITEMAP_PATH, xml, 'utf8');
  console.log(`[Sitemap Script] sitemap.xml written to ${SITEMAP_PATH} and ${ROOT_SITEMAP_PATH}`);

  // Generate standard sitemap_index.xml pointing to sitemap.xml (standard for search engines and tools expecting sitemapindex)
  const today = new Date().toISOString().split('T')[0];
  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${BASE_URL}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>
`;
  await fs.writeFile(SITEMAP_INDEX_PATH, sitemapIndexXml, 'utf8');
  await fs.writeFile(ROOT_SITEMAP_INDEX_PATH, sitemapIndexXml, 'utf8');
  console.log(`[Sitemap Script] sitemap_index.xml written to ${SITEMAP_INDEX_PATH} and ${ROOT_SITEMAP_INDEX_PATH}`);
}

main().catch((err) => {
  console.error('[Sitemap Script] Fatal error generating sitemap:', err);
  process.exit(1);
});
