import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const DIST = join(__dirname, 'dist');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.txt': 'text/plain',
};

const server = createServer(async (req, res) => {
    const url = req.url.split('?')[0];
    const filePath = join(DIST, url === '/' ? 'index.html' : url);

                              try {
                                    const data = await readFile(filePath);
                                    const ext = extname(filePath);
                                    res.writeHead(200, {
                                            'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
                                            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
                                    });
                                    res.end(data);
                              } catch {
                                    // SPA fallback — serve index.html for client-side routing
      try {
              const data = await readFile(join(DIST, 'index.html'));
              res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
              res.end(data);
      } catch {
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Server error');
      }
                              }
});

server.listen(process.env.PORT || 3000);
