import fs from 'fs-extra';
import path from 'path';

interface PageDefinition {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  h1: string;
  subtitle: string;
  badge: string;
  features: Array<{ title: string; desc: string; icon: string }>;
  faqs: Array<{ q: string; a: string }>;
  appView: string;
}

const PAGES: PageDefinition[] = [
  {
    slug: 'vault',
    title: 'Cloud Vault - Encrypted Cloud Storage',
    metaTitle: 'Velorix Cloud Vault - Zero-Knowledge Encrypted Cloud Storage',
    metaDescription: 'Secure cloud storage with client-side 256-bit AES-GCM encryption. Upload, manage, and share files with automatic expiry and zero storage caps on Velorix.',
    keywords: 'Velorix Vault, encrypted cloud storage, secure cloud vault, AES-256 storage, zero-knowledge storage, free file storage',
    h1: 'Velorix Encrypted Cloud Vault',
    subtitle: 'Store, organize, and access files securely from any device with client-side zero-knowledge encryption.',
    badge: 'AES-256-GCM Military Encryption',
    appView: 'vault',
    features: [
      {
        title: 'Client-Side Encryption',
        desc: 'Files are encrypted in your browser before uploading. Your raw data never touches intermediate servers unencrypted.',
        icon: '🔒'
      },
      {
        title: 'Auto-Expiring Links',
        desc: 'Set custom expiration times (1 hour, 24 hours, 7 days) to ensure temporary files vanish automatically.',
        icon: '⏱️'
      },
      {
        title: 'Password Vault Protection',
        desc: 'Add optional master password protection to any file or folder share link for dual-layer authorization.',
        icon: '🔑'
      },
      {
        title: 'Cross-Device File Manager',
        desc: 'Organize files into nested folders, tag assets, preview media instantly, and filter by file category.',
        icon: '📁'
      }
    ],
    faqs: [
      {
        q: 'How does Velorix Cloud Vault encrypt my files?',
        a: 'Every file is encrypted client-side using Web Crypto API with 256-bit AES-GCM prior to transmission, ensuring true zero-knowledge privacy.'
      },
      {
        q: 'Can Velorix or third parties view my stored vault files?',
        a: 'No. Because encryption keys are generated in your local browser runtime, only recipients with your decryption passphrase can unlock the files.'
      },
      {
        q: 'Is there any file size limit in the Cloud Vault?',
        a: 'The Vault supports unlimited file sizes with multi-part streaming support for documents, 4K videos, archives, and datasets.'
      }
    ]
  },
  {
    slug: 'transfer',
    title: 'P2P File Transfer - Direct WebRTC Sharing',
    metaTitle: 'Velorix P2P Transfer - Ultra-Fast Direct WebRTC File Sharing',
    metaDescription: 'Send unlimited files directly between browsers using WebRTC peer-to-peer data channels. Zero cloud storage required, zero file size limits, maximum bandwidth.',
    keywords: 'Velorix P2P, peer to peer file share, WebRTC file transfer, direct file share, unlimited file transfer, browser to browser file transfer',
    h1: 'Direct Peer-to-Peer File Transfer',
    subtitle: 'Stream gigabytes of data directly from your device to your recipient with maximum hardware bandwidth.',
    badge: 'WebRTC Direct Streaming Protocol',
    appView: 'activity',
    features: [
      {
        title: 'Direct Browser-to-Browser',
        desc: 'Data flows directly over WebSockets and WebRTC data channels between devices without intermediary cloud servers.',
        icon: '⚡'
      },
      {
        title: 'Zero File Size Limits',
        desc: 'Stream 100MB, 10GB, or 50GB files directly. The only limit is the available storage space on recipient devices.',
        icon: '🚀'
      },
      {
        title: 'Local Wi-Fi & Remote Sharing',
        desc: 'Transfer files locally over high-speed Wi-Fi hotspots or connect remotely worldwide using 6-digit room codes or QR pairing.',
        icon: '📶'
      },
      {
        title: 'Real-Time Speed & Progress',
        desc: 'Live transfer speedometer, chunk integrity verification, pause/resume mechanisms, and instant completion receipts.',
        icon: '📊'
      }
    ],
    faqs: [
      {
        q: 'How fast is Velorix P2P transfer?',
        a: 'P2P transfers stream at the maximum capacity of your local Wi-Fi or internet uplink, frequently surpassing 100MB/s on LAN networks.'
      },
      {
        q: 'Do files uploaded via P2P stay saved on the internet?',
        a: 'No. P2P transfers are ephemeral: once the transfer finishes, the connection terminates and no files linger on external servers.'
      }
    ]
  },
  {
    slug: 'tools',
    title: 'Tech Tools & Web Utilities',
    metaTitle: 'Velorix Tech Tools - Modern Developer Utilities & Web Apps',
    metaDescription: 'Discover free, privacy-first web utilities and developer tools by Velorix. File encryption, QR code generators, storage calculators, and hash validators.',
    keywords: 'Velorix tech tools, web utilities, online developer tools, file encryption tool, QR code generator, hash validator, free web apps',
    h1: 'Velorix Web Tools & Digital Utilities',
    subtitle: 'A suite of free, lightweight, privacy-focused utilities designed for creators, developers, and power users.',
    badge: 'Open-Source & Privacy-First',
    appView: 'tools',
    features: [
      {
        title: 'Client-Side File Encryptor',
        desc: 'Standalone AES-GCM file encryption utility allowing you to encrypt any local file before sharing via email or messaging apps.',
        icon: '🛡️'
      },
      {
        title: 'Instant QR Code Generator',
        desc: 'Generate high-resolution SVG/PNG QR codes for instant device pairing, Wi-Fi configuration, or URL sharing.',
        icon: '📱'
      },
      {
        title: 'Checksum & Hash Validator',
        desc: 'Verify SHA-256 and MD5 hashes locally to guarantee downloaded files have not been modified or corrupted.',
        icon: '🔍'
      },
      {
        title: 'Bandwidth & Storage Estimator',
        desc: 'Calculate estimated transfer times across various network speeds (4G, 5G, Fiber, Gigabit LAN) for large archives.',
        icon: '⏱️'
      }
    ],
    faqs: [
      {
        q: 'Are Velorix tools free to use?',
        a: 'Yes, 100% free with no registration, subscription tiers, or invasive tracking scripts.'
      },
      {
        q: 'Do Velorix tools work offline?',
        a: 'Yes, our PWA architecture caches all core utilities locally so you can use them even without an internet connection.'
      }
    ]
  },
  {
    slug: 'security',
    title: 'Security & Encryption Architecture',
    metaTitle: 'Velorix Security Architecture - 256-Bit AES-GCM Zero-Knowledge Model',
    metaDescription: 'In-depth overview of the Velorix security model. Discover how client-side cryptography, ephemeral handshakes, and zero-knowledge protocols protect your data.',
    keywords: 'Velorix security, AES-256 encryption, zero-knowledge architecture, client-side cryptography, Web Crypto API, secure file sharing',
    h1: 'Enterprise-Grade Zero-Knowledge Security',
    subtitle: 'How Velorix protects your privacy with mathematical guarantees, client-side cryptographic keys, and end-to-end encryption.',
    badge: 'Zero-Knowledge Protocol',
    appView: 'vault',
    features: [
      {
        title: 'Authenticated AES-256-GCM',
        desc: 'Galois/Counter Mode provides both confidentiality and tamper-proof message integrity authentication.',
        icon: '🔐'
      },
      {
        title: 'Client-Side Key Derivation',
        desc: 'Passphrases are salted with PBKDF2 (100,000+ iterations) inside Web Workers so passwords never leave client memory.',
        icon: '🧩'
      },
      {
        title: 'Zero Server Knowledge',
        desc: 'Neither Velorix nor cloud storage providers possess the keys necessary to decrypt your files.',
        icon: '👁️'
      },
      {
        title: 'Auditable Open Architecture',
        desc: 'Our cryptographic flows utilize the standardized W3C Web Crypto API, fully auditable and verified.',
        icon: '📜'
      }
    ],
    faqs: [
      {
        q: 'Can law enforcement or third parties request my files from Velorix?',
        a: 'Because of our zero-knowledge architecture, we only hold ciphertext blocks. We have no mathematical capability to decrypt user files.'
      },
      {
        q: 'What happens if I lose my file password?',
        a: 'Because keys are client-derived and never saved, lost passwords cannot be reset. We advise keeping secure backups of your encryption keys.'
      }
    ]
  },
  {
    slug: 'docs',
    title: 'Documentation & User Guide',
    metaTitle: 'Velorix Documentation - User Manual & Technical Reference',
    metaDescription: 'Complete documentation for Velorix. Learn how to transfer large files, configure Wi-Fi direct rooms, manage encrypted cloud backups, and install the PWA.',
    keywords: 'Velorix documentation, Velorix guide, how to use Velorix, P2P transfer guide, cloud vault manual, Velorix PWA install',
    h1: 'Velorix User Guide & Documentation',
    subtitle: 'Learn how to get the most out of Velorix file sharing, local device pairing, and encrypted vault storage.',
    badge: 'Technical Reference',
    appView: 'home',
    features: [
      {
        title: 'Quick Start Guide',
        desc: 'Step-by-step instructions for sending your first file in under 10 seconds without creating an account.',
        icon: '📖'
      },
      {
        title: 'Local Wi-Fi Hotspot Pairing',
        desc: 'Connect two phones or computers on the same router for direct wire-speed file transfers without mobile data usage.',
        icon: '📶'
      },
      {
        title: 'Progressive Web App (PWA)',
        desc: 'Install Velorix onto Android, iOS, Windows, or macOS for native app performance and offline capability.',
        icon: '📲'
      },
      {
        title: 'Troubleshooting & NAT Traversal',
        desc: 'Guidelines for STUN/TURN traversal when connecting across enterprise firewalls or symmetric NAT networks.',
        icon: '🛠️'
      }
    ],
    faqs: [
      {
        q: 'How do I install Velorix as a desktop or mobile app?',
        a: 'Open Velorix in Chrome, Edge, or Safari, click the Install or Add to Home Screen button in your browser address bar.'
      },
      {
        q: 'Why does my transfer pause when switching apps?',
        a: 'Mobile operating systems may throttle background WebRTC connections. Keep the screen active or install the PWA for enhanced background persistence.'
      }
    ]
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    metaTitle: 'Velorix Privacy Policy - Zero-Knowledge Data Protection',
    metaDescription: 'Read the official Velorix Privacy Policy. Learn about our strict zero-logging stance, client-side encryption, and total commitment to user confidentiality.',
    keywords: 'Velorix privacy policy, zero-logging policy, GDPR compliance, zero-knowledge privacy, data protection',
    h1: 'Velorix Privacy Policy',
    subtitle: 'Your privacy is our core engineering foundation. We do not track, sell, or inspect user data.',
    badge: 'Updated September 2026',
    appView: 'vault',
    features: [
      {
        title: 'No Mandatory Accounts',
        desc: 'Use guest mode to transfer files without providing an email, phone number, or personal identifiers.',
        icon: '👤'
      },
      {
        title: 'No Activity Logging',
        desc: 'We do not log IP addresses, filenames, or transfer histories. Ephemeral transfer sessions expire automatically.',
        icon: '🚫'
      },
      {
        title: 'GDPR & Privacy First',
        desc: 'Engineered from day one in compliance with global data sovereignty and user privacy directives.',
        icon: '⚖️'
      },
      {
        title: 'Client Cryptographic Shield',
        desc: 'All file contents are encrypted client-side. The service operators have zero access to file contents.',
        icon: '🛡️'
      }
    ],
    faqs: [
      {
        q: 'Do you sell user data to advertising networks?',
        a: 'Never. Velorix contains no third-party ad networks, telemetry trackers, or data-broker integrations.'
      },
      {
        q: 'How long do temporary share links stay online?',
        a: 'By default, links expire within 24 hours or upon reaching their configured expiry limit, after which storage blocks are purged.'
      }
    ]
  },
  {
    slug: 'terms',
    title: 'Terms of Service',
    metaTitle: 'Velorix Terms of Service & Acceptable Use Policy',
    metaDescription: 'Review the Terms of Service and Acceptable Use Policy for Velorix. Clear, transparent guidelines for fair, lawful use of our platform.',
    keywords: 'Velorix terms of service, acceptable use policy, user agreement, terms of use',
    h1: 'Velorix Terms of Service',
    subtitle: 'Clear, fair, and transparent guidelines for using the Velorix file sharing platform and web tools.',
    badge: 'Updated September 2026',
    appView: 'vault',
    features: [
      {
        title: 'Lawful Use Only',
        desc: 'Velorix must only be used for legal file distribution. Distribution of malicious code or unlawful content is strictly prohibited.',
        icon: '⚖️'
      },
      {
        title: 'Fair Bandwidth Use',
        desc: 'P2P transfers are peer-hosted; cloud vault uploads are subject to standard automated abuse-prevention rate limits.',
        icon: '🌐'
      },
      {
        title: 'Zero Warranty Disclaimer',
        desc: 'Velorix is provided as-is with industry-standard uptime targets and open cryptographic implementations.',
        icon: '📜'
      },
      {
        title: 'Account Control',
        desc: 'You retain full copyright and ownership of any files and assets you process through Velorix.',
        icon: '⭐'
      }
    ],
    faqs: [
      {
        q: 'Who owns the files transferred via Velorix?',
        a: 'You do. Velorix claims no intellectual property rights or licensing claims over any files transmitted or stored.'
      },
      {
        q: 'Can an account be terminated for abuse?',
        a: 'Yes, automated systems will block keys and IP ranges associated with automated spam or denial of service attacks.'
      }
    ]
  }
];

function generateHtmlPage(page: PageDefinition): string {
  const canonicalUrl = `https://velorix-rd.github.io/Valorix/${page.slug}/`;
  const launchAppUrl = `https://velorix-rd.github.io/Valorix/?view=${page.appView}`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': page.faqs.map(f => ({
      '@type': 'Question',
      'name': f.q,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': f.a
      }
    }))
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Velorix Home',
        'item': 'https://velorix-rd.github.io/Valorix/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': page.title,
        'item': canonicalUrl
      }
    ]
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${page.metaTitle}</title>
  <meta name="title" content="${page.metaTitle}" />
  <meta name="description" content="${page.metaDescription}" />
  <meta name="keywords" content="${page.keywords}" />
  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
  <meta name="author" content="Velorix" />
  <link rel="canonical" href="${canonicalUrl}" />

  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:site_name" content="Velorix" />
  <meta property="og:title" content="${page.metaTitle}" />
  <meta property="og:description" content="${page.metaDescription}" />
  <meta property="og:image" content="https://velorix-rd.github.io/Valorix/preview.png" />
  <meta property="og:image:alt" content="${page.title}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${page.metaTitle}" />
  <meta name="twitter:description" content="${page.metaDescription}" />
  <meta name="twitter:image" content="https://velorix-rd.github.io/Valorix/preview.png" />

  <!-- Verification -->
  <meta name="msvalidate.01" content="74E067CF3527003BBB234B5FFF6284C5" />
  <meta name="google-site-verification" content="qXFQAJcCAlny5SQsSRYAy92HcL64gou7sOKDXTbhKK0" />

  <!-- Favicon -->
  <link rel="icon" href="https://velorix-rd.github.io/Valorix/favicon.ico" sizes="any" />
  <link rel="icon" href="https://velorix-rd.github.io/Valorix/favicon.svg" type="image/svg+xml" />

  <!-- Structured Data -->
  <script type="application/ld+json">
  ${JSON.stringify(breadcrumbSchema)}
  </script>
  <script type="application/ld+json">
  ${JSON.stringify(faqSchema)}
  </script>

  <style>
    :root {
      --bg: #050507;
      --card: #0d0d12;
      --border: #1f1f28;
      --accent: #00FF9D;
      --text: #f4f4f5;
      --muted: #a1a1aa;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg);
      color: var(--text);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    .container { max-width: 1040px; margin: 0 auto; padding: 0 24px; }
    
    /* Navigation */
    header {
      border-bottom: 1px solid var(--border);
      background: rgba(5, 5, 7, 0.9);
      backdrop-filter: blur(12px);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 68px;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 20px;
      letter-spacing: 0.05em;
      color: #fff;
    }
    .logo span { color: var(--accent); }
    nav ul {
      display: flex;
      gap: 20px;
      list-style: none;
      align-items: center;
    }
    nav a {
      color: var(--muted);
      font-size: 14px;
      font-weight: 500;
      transition: color 0.2s;
    }
    nav a:hover, nav a.active {
      color: #fff;
      text-decoration: none;
    }
    .btn-cta {
      background: var(--accent);
      color: #000;
      font-weight: 700;
      font-size: 14px;
      padding: 8px 18px;
      border-radius: 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.2s, transform 0.1s;
    }
    .btn-cta:hover {
      opacity: 0.9;
      text-decoration: none;
      transform: translateY(-1px);
    }

    /* Hero */
    .hero {
      padding: 64px 0 40px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      padding: 4px 14px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--accent);
      background: rgba(0, 255, 157, 0.1);
      border: 1px solid rgba(0, 255, 157, 0.25);
      border-radius: 20px;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
      color: #fff;
      line-height: 1.25;
    }
    .subtitle {
      font-size: 18px;
      color: var(--muted);
      max-width: 680px;
      margin: 0 auto 28px;
    }

    /* Grid */
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 20px;
      margin: 40px 0;
    }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }
    .card-icon {
      font-size: 28px;
      margin-bottom: 12px;
    }
    .card h3 {
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }
    .card p {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.6;
    }

    /* FAQ */
    .faq-section {
      margin: 50px 0;
    }
    .faq-section h2 {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 24px;
      color: #fff;
    }
    .faq-item {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 18px 22px;
      margin-bottom: 12px;
    }
    .faq-item h4 {
      font-size: 16px;
      color: #fff;
      margin-bottom: 6px;
    }
    .faq-item p {
      font-size: 14px;
      color: var(--muted);
    }

    /* Footer */
    footer {
      border-top: 1px solid var(--border);
      padding: 40px 0;
      margin-top: 80px;
      font-size: 13px;
      color: var(--muted);
    }
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      gap: 18px;
      margin-bottom: 20px;
    }
    .footer-links a { color: var(--muted); }
    .footer-links a:hover { color: var(--accent); }

    @media (max-width: 768px) {
      h1 { font-size: 28px; }
      .nav-inner { flex-direction: column; height: auto; padding: 16px 0; gap: 12px; }
      nav ul { flex-wrap: wrap; justify-content: center; gap: 12px; }
    }
  </style>
</head>
<body>
  <header>
    <div class="container nav-inner">
      <a href="https://velorix-rd.github.io/Valorix/" class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00FF9D" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        VELORIX<span>.TECH</span>
      </a>
      <nav>
        <ul>
          <li><a href="https://velorix-rd.github.io/Valorix/">Home</a></li>
          <li><a href="https://velorix-rd.github.io/Valorix/vault/" ${page.slug === 'vault' ? 'class="active"' : ''}>Vault</a></li>
          <li><a href="https://velorix-rd.github.io/Valorix/transfer/" ${page.slug === 'transfer' ? 'class="active"' : ''}>P2P Transfer</a></li>
          <li><a href="https://velorix-rd.github.io/Valorix/tools/" ${page.slug === 'tools' ? 'class="active"' : ''}>Web Tools</a></li>
          <li><a href="https://velorix-rd.github.io/Valorix/security/" ${page.slug === 'security' ? 'class="active"' : ''}>Security</a></li>
          <li><a href="https://velorix-rd.github.io/Valorix/docs/" ${page.slug === 'docs' ? 'class="active"' : ''}>Docs</a></li>
          <li><a href="${launchAppUrl}" class="btn-cta">Launch App →</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <span class="badge">${page.badge}</span>
      <h1>${page.h1}</h1>
      <p class="subtitle">${page.subtitle}</p>
      <div>
        <a href="${launchAppUrl}" class="btn-cta" style="padding: 12px 28px; font-size: 15px;">Open ${page.title} in Velorix →</a>
      </div>
    </section>

    <section class="grid">
      ${page.features.map(f => `
      <div class="card">
        <div class="card-icon">${f.icon}</div>
        <h3>${f.title}</h3>
        <p>${f.desc}</p>
      </div>
      `).join('')}
    </section>

    <section class="faq-section">
      <h2>Frequently Asked Questions</h2>
      ${page.faqs.map(f => `
      <div class="faq-item">
        <h4>${f.q}</h4>
        <p>${f.a}</p>
      </div>
      `).join('')}
    </section>
  </main>

  <footer>
    <div class="container">
      <div class="footer-links">
        <a href="https://velorix-rd.github.io/Valorix/">Home</a>
        <a href="https://velorix-rd.github.io/Valorix/vault/">Encrypted Vault</a>
        <a href="https://velorix-rd.github.io/Valorix/transfer/">P2P Transfer</a>
        <a href="https://velorix-rd.github.io/Valorix/tools/">Web Utilities</a>
        <a href="https://velorix-rd.github.io/Valorix/security/">Security Architecture</a>
        <a href="https://velorix-rd.github.io/Valorix/docs/">Documentation</a>
        <a href="https://velorix-rd.github.io/Valorix/privacy/">Privacy Policy</a>
        <a href="https://velorix-rd.github.io/Valorix/terms/">Terms of Service</a>
        <a href="https://velorix-rd.github.io/Valorix/sitemap.xml">XML Sitemap</a>
        <a href="https://velorix-rd.github.io/Valorix/sitemap_index.xml">Sitemap Index</a>
        <a href="https://github.com/velorix-rd/Valorix" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <p>© 2026 Velorix (VeloriX Technologies). Free, open, zero-knowledge file sharing and web developer tools. Built for performance and absolute privacy.</p>
    </div>
  </footer>
</body>
</html>
`;
}

export async function buildStaticPlatformPages() {
  const publicDir = path.join(process.cwd(), 'public');
  const rootDir = process.cwd();

  console.log(`[Static Pages] Generating ${PAGES.length} indexable HTML pages for Bing & Google...`);

  for (const page of PAGES) {
    const html = generateHtmlPage(page);
    
    // 1. Write inside public/<slug>/index.html (Vite bundles this to dist/<slug>/index.html)
    const pagePublicDir = path.join(publicDir, page.slug);
    fs.ensureDirSync(pagePublicDir);
    const publicPath = path.join(pagePublicDir, 'index.html');
    await fs.writeFile(publicPath, html, 'utf8');

    // 2. Also write inside ./<slug>/index.html for repositories serving from branch root
    const pageRootDir = path.join(rootDir, page.slug);
    fs.ensureDirSync(pageRootDir);
    const rootPath = path.join(pageRootDir, 'index.html');
    await fs.writeFile(rootPath, html, 'utf8');

    console.log(`[Static Pages] Created: /${page.slug}/index.html`);
  }

  console.log('[Static Pages] All static pages successfully generated!');
}

// Auto-run if executed directly
if (process.argv[1]?.includes('generate-static-pages')) {
  buildStaticPlatformPages().catch(err => {
    console.error('Error generating static pages:', err);
    process.exit(1);
  });
}
