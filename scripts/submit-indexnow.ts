/**
 * Automated IndexNow Submission Script
 * Submits all official Velorix platform URLs to Bing & IndexNow search engines.
 */

const INDEXNOW_KEY = '45b5b52ea2554f9abdf0e4912816c6db';
const KEY_LOCATION = 'https://velorix-rd.github.io/Valorix/45b5b52ea2554f9abdf0e4912816c6db.txt';
const HOST = 'velorix-rd.github.io';

const URL_LIST = [
  'https://velorix-rd.github.io/Valorix/',
  'https://velorix-rd.github.io/Valorix/vault/',
  'https://velorix-rd.github.io/Valorix/transfer/',
  'https://velorix-rd.github.io/Valorix/offline-share/',
  'https://velorix-rd.github.io/Valorix/tools/',
  'https://velorix-rd.github.io/Valorix/dock/',
  'https://velorix-rd.github.io/Valorix/storage/',
  'https://velorix-rd.github.io/Valorix/security/',
  'https://velorix-rd.github.io/Valorix/features/',
  'https://velorix-rd.github.io/Valorix/backup/',
  'https://velorix-rd.github.io/Valorix/servers/',
  'https://velorix-rd.github.io/Valorix/docs/',
  'https://velorix-rd.github.io/Valorix/faq/',
  'https://velorix-rd.github.io/Valorix/contact/',
  'https://velorix-rd.github.io/Valorix/privacy/',
  'https://velorix-rd.github.io/Valorix/terms/'
];

async function submitToIndexNow() {
  console.log(`[IndexNow] Preparing submission for ${URL_LIST.length} URLs...`);
  console.log(`[IndexNow] Host: ${HOST}`);
  console.log(`[IndexNow] Key Location: ${KEY_LOCATION}`);

  const payload = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: URL_LIST
  };

  const endpoints = [
    'https://api.indexnow.org/indexnow',
    'https://www.bing.com/indexnow'
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[IndexNow] Submitting payload to ${endpoint}...`);
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(payload)
      });

      console.log(`[IndexNow] Response from ${endpoint}: ${res.status} ${res.statusText}`);
      if (res.ok || res.status === 200 || res.status === 202) {
        console.log(`[IndexNow] ✅ Successfully submitted to ${endpoint}!`);
      } else {
        const text = await res.text().catch(() => '');
        console.warn(`[IndexNow] ⚠️ Note from ${endpoint}: ${res.status} - ${text}`);
      }
    } catch (err: any) {
      console.error(`[IndexNow] ❌ Error submitting to ${endpoint}:`, err?.message || err);
    }
  }
}

submitToIndexNow();

