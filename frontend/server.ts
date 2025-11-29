import 'zone.js/node';
import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import bootstrap from './src/main.server';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  //const browserDistFolder = resolve(process.cwd(), 'dist/frontend/browser/browser/');
  const browserDistFolder = resolve(process.cwd(), 'dist/frontend/browser');
  const indexHtml = join(browserDistFolder, 'browser', 'index.html');
  //const indexHtml = join(browserDistFolder, 'index.html');

  const commonEngine = new CommonEngine();
  const BACKEND_INTERNAL_URL = process.env['API_RENDER_INTERNAL_URL'] || 'http://localhost:8080';
  console.log(`[DIAG] Proxy Target URL configurada: ${BACKEND_INTERNAL_URL}`);
  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  // Example Express Rest API endpoints
  server.use('/api', createProxyMiddleware({
  target: BACKEND_INTERNAL_URL,
  changeOrigin: true
  }));

  // Serve static files from /browser
  server.use(express.static(join(browserDistFolder, 'browser')));
  server.get('*.*', express.static(browserDistFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    console.log('Proxying request to backend:', req.url);
    console.log('Using indexHtml:', indexHtml);
    console.log('SSR rendering route:', originalUrl);
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: originalUrl,
        publicPath: join(browserDistFolder, 'browser'),
        providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4200;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();
