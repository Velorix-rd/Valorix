import express from 'express';
import { createServer as createViteServer } from 'vite';
import multer from 'multer';
import path from 'path';
import fs from 'fs-extra';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import nodemailer from 'nodemailer';
import compression from 'compression';
import { generateDynamicSitemapXml, isEligibleForPublicSitemap, SitemapFileEntry } from './src/utils/sitemapGenerator.js';

const PORT = 3000;
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Prevent unexpected process exits on unhandled errors or closed sockets
process.on('uncaughtException', (err) => {
  console.error('[Process] Uncaught exception caught safely:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Process] Unhandled rejection caught safely:', reason);
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

async function sendUploadNotification(uploaderName: string, files: any[]) {
  const fileList = files.map(f => `- ${f.name} (${(f.size / 1024 / 1024).toFixed(2)} MB)`).join('\n');
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'rd8538689@gmail.com',
    subject: `🚀 New Upload from ${uploaderName}`,
    text: `User ${uploaderName} has uploaded the following files:\n\n${fileList}\n\nTime: ${new Date().toLocaleString()}`
  };

  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
      console.log('Notification email sent successfully');
    } else {
      console.warn('Email credentials not set. Skipping notification.');
    }
  } catch (error) {
    console.error('Error sending notification email:', error);
  }
}

// Ensure uploads directory exists
fs.ensureDirSync(UPLOADS_DIR);

// Multer storage config - streams directly to disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 } // 5GB per-file limit
});

// Global in-memory registry of public files for dynamic sitemap serving
const serverPublicFilesMap = new Map<string, SitemapFileEntry>();

async function startServer() {
  const app = express();

  // High performance compression
  app.use(compression());

  // Enable CORS for custom domain & external origins
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Range, X-Requested-With');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges, Content-Length');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  app.use(express.json());

  // --- API Routes ---

  // Dynamic sitemap.xml route
  app.get('/sitemap.xml', (req, res) => {
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const host = (req.headers.host || req.hostname || '').toLowerCase();
    let protocol = 'https';
    if (req.headers['x-forwarded-proto']) {
      protocol = String(req.headers['x-forwarded-proto']).split(',')[0];
    } else if (req.protocol) {
      protocol = req.protocol;
    }

    let baseUrl = 'https://velorix-rd.github.io/Valorix';
    if (host && !host.includes('github.io')) {
      baseUrl = `${protocol}://${host}`;
    }
    baseUrl = baseUrl.replace(/\/+$/, '');

    // Gather public files from in-memory store
    const publicFilesList = Array.from(serverPublicFilesMap.values());
    const xml = generateDynamicSitemapXml(publicFilesList, { baseUrl });

    res.send(xml);
  });

  // robots.txt route
  app.get('/robots.txt', (req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600');

    const host = (req.headers.host || req.hostname || '').toLowerCase();
    let protocol = 'https';
    if (req.headers['x-forwarded-proto']) {
      protocol = String(req.headers['x-forwarded-proto']).split(',')[0];
    } else if (req.protocol) {
      protocol = req.protocol;
    }

    let baseUrl = 'https://velorix-rd.github.io/Valorix';
    if (host && !host.includes('github.io')) {
      baseUrl = `${protocol}://${host}`;
    }
    baseUrl = baseUrl.replace(/\/+$/, '');

    const robotsContent = `User-agent: *

# Explicitly Allowed Public Pages & Assets
Allow: /
Allow: /Valorix/
Allow: /Valorix/share/
Allow: /share/
Allow: /assets/
Allow: /*.js$
Allow: /*.css$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$
Allow: /*.svg$
Allow: /*.ico$
Allow: /*.json$

# Disallow Internal Backend, Upload Buffers & Non-Public Data
Disallow: /api/
Disallow: /uploads/
Disallow: /admin/
Disallow: /private/
Disallow: /*?*token=
Disallow: /*?*key=
Disallow: /*?*secret=
Disallow: /*?*pwd=
Disallow: /*?*password=

# Ignore URL Fragment Identifiers & Client-Side Routing Anchors
Disallow: /*#*
Disallow: /#*
Disallow: /Valorix/#*
Disallow: /*/#/

# Official Clean Canonical XML Sitemap
Sitemap: ${baseUrl}/sitemap.xml`.trim();

    res.send(robotsContent);
  });

  // Ping endpoint for latency check
  app.get('/api/ping', (req, res) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.status(200).send('pong');
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      env: process.env.NODE_ENV || 'development', 
      time: new Date().toISOString(),
      port: PORT
    });
  });

  // Upload endpoint
  app.post('/api/upload', upload.array('files', 10), async (req, res) => {
    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploaderName = req.body.uploaderName || 'Unknown User';

    const uploadedFiles = (req.files as Express.Multer.File[]).map(file => ({
      id: file.filename,
      name: file.originalname,
      size: file.size,
      type: file.mimetype,
      path: file.path,
      createdAt: new Date().toISOString(),
      isGuest: req.body.isGuest === 'true'
    }));

    // Send email notification
    await sendUploadNotification(uploaderName, uploadedFiles);

    // Register uploaded public files in dynamic sitemap map
    uploadedFiles.forEach(file => {
      serverPublicFilesMap.set(file.id, {
        id: file.id,
        name: file.name,
        isPublic: true,
        createdAt: file.createdAt,
        isGuest: file.isGuest
      });
    });

    res.json(uploadedFiles);
  });

  // Sitemap sync endpoint for live client updates
  app.post('/api/sitemap-sync', (req, res) => {
    try {
      const { publicFiles } = req.body;
      if (Array.isArray(publicFiles)) {
        publicFiles.forEach((file: SitemapFileEntry) => {
          if (file && file.id && isEligibleForPublicSitemap(file)) {
            serverPublicFilesMap.set(file.id, file);
          } else if (file && file.id && file.isPublic === false) {
            serverPublicFilesMap.delete(file.id);
          }
        });
      }
      res.json({ status: 'synced', totalPublicFiles: serverPublicFilesMap.size });
    } catch {
      res.status(500).json({ error: 'Failed to sync sitemap' });
    }
  });

  // Helper to safely resolve uploaded file by ID, decoded filename, or basename
  const resolveUploadFilePath = (filename: string): string | null => {
    if (!filename) return null;
    let decoded = filename;
    try { decoded = decodeURIComponent(filename); } catch (e) {}

    const candidates = [
      filename,
      decoded,
      path.basename(filename),
      path.basename(decoded)
    ];

    for (const candidate of candidates) {
      const safeName = path.basename(candidate);
      const targetPath = path.join(UPLOADS_DIR, safeName);
      if (fs.existsSync(targetPath)) {
        return targetPath;
      }
    }

    try {
      const files = fs.readdirSync(UPLOADS_DIR);
      const matched = files.find(f => 
        f === filename || 
        f === decoded || 
        f.endsWith(filename) || 
        f.endsWith(decoded) || 
        f.startsWith(filename) ||
        f.startsWith(decoded)
      );
      if (matched) {
        return path.join(UPLOADS_DIR, matched);
      }
    } catch {}

    return null;
  };

  // Delete endpoint
  app.delete('/api/delete/:filename', async (req, res) => {
    const filename = req.params.filename;
    const filePath = resolveUploadFilePath(filename);
    
    // Remove from sitemap map
    serverPublicFilesMap.delete(filename);
    try {
      serverPublicFilesMap.delete(decodeURIComponent(filename));
    } catch {}
    
    try {
      if (filePath && await fs.pathExists(filePath)) {
        await fs.remove(filePath);
        res.status(200).json({ message: 'File deleted successfully' });
      } else {
        res.status(404).json({ error: 'File not found' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete file' });
    }
  });

  // File metadata info endpoint for instant share link resolution
  app.get('/api/file-info/:filename', (req, res) => {
    const filePath = resolveUploadFilePath(req.params.filename);
    if (!filePath) {
      return res.status(404).json({ error: 'File not found' });
    }

    try {
      const stat = fs.statSync(filePath);
      const baseName = path.basename(filePath);
      const parts = baseName.split('-');
      const originalName = parts.length > 2 ? parts.slice(2).join('-') : baseName;
      res.json({
        id: baseName,
        name: originalName,
        size: stat.size,
        type: 'application/octet-stream',
        createdAt: stat.birthtime ? stat.birthtime.toISOString() : new Date().toISOString(),
        isPublic: true
      });
    } catch (e) {
      res.status(500).json({ error: 'Could not inspect file' });
    }
  });

  // HEAD download endpoint for instant existence and size checks
  app.head('/api/download/:filename', (req, res) => {
    const filePath = resolveUploadFilePath(req.params.filename);
    if (!filePath) {
      return res.status(404).end();
    }
    try {
      const stat = fs.statSync(filePath);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Type', 'application/octet-stream');
      res.setHeader('Accept-Ranges', 'bytes');
      res.status(200).end();
    } catch {
      res.status(500).end();
    }
  });

  // Download endpoint with Range Request support
  app.get('/api/download/:filename', (req, res) => {
    const filePath = resolveUploadFilePath(req.params.filename);
    
    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).send('File not found');
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    const baseName = path.basename(filePath);
    const parts = baseName.split('-');
    const downloadFilename = parts.length > 2 ? parts.slice(2).join('-') : baseName;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': 'application/octet-stream',
      };
      res.writeHead(206, head);
      file.on('error', (streamErr) => {
        console.warn('[Stream] Range read error on client abort:', streamErr.message);
        if (!res.headersSent) res.status(500).end();
      });
      res.on('close', () => {
        file.destroy();
      });
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${downloadFilename}"`
      };
      res.writeHead(200, head);
      const fullStream = fs.createReadStream(filePath);
      fullStream.on('error', (streamErr) => {
        console.warn('[Stream] Full read error on client abort:', streamErr.message);
        if (!res.headersSent) res.status(500).end();
      });
      res.on('close', () => {
        fullStream.destroy();
      });
      fullStream.pipe(res);
    }
  });

  // Permanent storage: No auto-deletion or expiration job
  // All uploaded files are preserved permanently without expiry

  // --- Vite Middleware & Static Serving ---
  if (process.env.NODE_ENV !== 'production') {
    console.log('Starting in development mode with Vite middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Starting in production mode...');
    const distPath = path.join(process.cwd(), 'dist');
    console.log('Resolved distPath:', distPath);
    if (fs.existsSync(distPath)) {
      console.log('Serving static files from:', distPath);
      app.use(express.static(distPath, {
        maxAge: '1d',
        index: false
      }));

      // Prevent 404 assets from returning index.html
      app.use('/assets', (req, res) => {
        res.status(404).send('Asset not found');
      });

      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/ws')) {
          return next();
        }
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.error('CRITICAL: Production mode enabled but dist folder not found at:', distPath);
      console.log('Falling back to Vite middleware...');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  }

  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });

  let activeUsers = new Set<WebSocket>();
  const peers = new Map<string, { ws: WebSocket; name: string }>();

  wss.on('connection', (ws) => {
    activeUsers.add(ws);
    broadcastCount();

    let registeredPeerId: string | null = null;

    ws.on('error', (wsErr) => {
      console.warn('[WS] Client socket connection error:', wsErr.message);
    });

    ws.on('message', (messageData) => {
      try {
        const raw = messageData.toString();
        const data = JSON.parse(raw);

        if (typeof data !== 'object' || data === null) return;

        if (data.type === 'register-peer') {
          const { peerId, name } = data;
          if (typeof peerId === 'string' && peerId.length <= 128) {
            registeredPeerId = peerId;
            const sanitizedName = typeof name === 'string' ? name.slice(0, 50) : 'Device';
            peers.set(peerId, { ws, name: sanitizedName });
            broadcastPeers();
          }
        } 
        else if (data.type === 'webrtc-signal') {
          const { to, signal } = data;
          if (typeof to === 'string' && peers.has(to)) {
            const target = peers.get(to);
            if (target && target.ws.readyState === WebSocket.OPEN) {
              try {
                target.ws.send(JSON.stringify({
                  type: 'webrtc-signal',
                  from: registeredPeerId,
                  signal
                }));
              } catch (sendErr) {
                console.warn('[WS] Failed to send webrtc-signal to peer:', sendErr);
              }
            }
          }
        }
        else if (data.type === 'relay-message') {
          const { to, payload } = data;
          if (typeof to === 'string' && peers.has(to)) {
            const target = peers.get(to);
            if (target && target.ws.readyState === WebSocket.OPEN) {
              try {
                target.ws.send(JSON.stringify({
                  type: 'relay-message',
                  from: registeredPeerId,
                  payload
                }));
              } catch (sendErr) {
                console.warn('[WS] Failed to send relay-message to peer:', sendErr);
              }
            }
          }
        }
      } catch (err) {
        console.error('Error handling WebSocket message:', err);
      }
    });

    ws.on('close', () => {
      activeUsers.delete(ws);
      if (registeredPeerId) {
        peers.delete(registeredPeerId);
        broadcastPeers();
      }
      broadcastCount();
    });
  });

  let fakeBase = Math.floor(Math.random() * 47) + 34; // Random initially 34 to 80

  function scheduleNextFakeUpdate() {
    const minMs = 15 * 60 * 1000; // 15 mins
    const maxMs = 34 * 60 * 1000; // 34 mins
    const nextInterval = Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;

    setTimeout(() => {
      fakeBase = Math.floor(Math.random() * 56) + 30; // Randomly 30 to 85+
      broadcastCount();
      scheduleNextFakeUpdate();
    }, nextInterval);
  }
  scheduleNextFakeUpdate();

  function broadcastCount() {
    const realCount = activeUsers.size;
    const message = JSON.stringify({ type: 'count', value: realCount, fakeBase });
    wss.clients.forEach((client) => {
      try {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      } catch (e) {
        console.error('[WS] Error sending count broadcast:', e);
      }
    });
  }

  function broadcastPeers() {
    const list = Array.from(peers.entries()).map(([id, p]) => ({
      id,
      name: p.name
    }));
    const message = JSON.stringify({ type: 'peers-list', peers: list });
    peers.forEach((p) => {
      try {
        if (p.ws.readyState === WebSocket.OPEN) {
          p.ws.send(message);
        }
      } catch (e) {
        console.error('[WS] Error sending peer broadcast:', e);
      }
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
