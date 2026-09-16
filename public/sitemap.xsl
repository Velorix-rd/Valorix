<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
  xmlns:html="http://www.w3.org/TR/REC-html40"
  xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>Velorix XML Sitemap</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body {
            background-color: #09090b;
            color: #f4f4f5;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 32px 16px;
            line-height: 1.5;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            padding-bottom: 24px;
            border-bottom: 1px solid #27272a;
            margin-bottom: 24px;
          }
          .badge {
            display: inline-block;
            background: rgba(0, 255, 157, 0.1);
            color: #00FF9D;
            border: 1px solid rgba(0, 255, 157, 0.2);
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
          }
          h1 {
            font-size: 24px;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 6px;
          }
          p {
            font-size: 14px;
            color: #a1a1aa;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: #18181b;
            border-radius: 12px;
            overflow: hidden;
            border: 1px solid #27272a;
          }
          th {
            background: #1f1f23;
            color: #d4d4d8;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            text-align: left;
            padding: 12px 16px;
          }
          td {
            padding: 14px 16px;
            border-bottom: 1px solid #27272a;
            font-size: 13px;
          }
          tr:last-child td {
            border-bottom: none;
          }
          a {
            color: #00FF9D;
            text-decoration: none;
            word-break: break-all;
          }
          a:hover {
            text-decoration: underline;
          }
          .tag {
            background: #27272a;
            color: #a1a1aa;
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-family: monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="badge">Google Search Compatible</span>
            <h1>Velorix XML Sitemap</h1>
            <p>This is the official XML sitemap index for search engines (Googlebot, Bingbot). Styled for browser preview.</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Canonical URL</th>
                <th>Last Modified</th>
                <th>Change Frequency</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td>
                    <span class="tag"><xsl:value-of select="sitemap:lastmod"/></span>
                  </td>
                  <td>
                    <span class="tag"><xsl:value-of select="sitemap:changefreq"/></span>
                  </td>
                  <td>
                    <span class="tag"><xsl:value-of select="sitemap:priority"/></span>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
