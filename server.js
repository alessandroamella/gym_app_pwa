import express from 'express';
import { join } from 'path';
import ViteExpress from 'vite-express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import helmet from 'helmet';
import cors from 'cors';
import { cleanEnv, str, url, port as portEnv } from 'envalid';
import { cwd } from 'process';
import 'dotenv/config';

// eslint-disable-next-line no-undef
const env = cleanEnv(process.env, {
  NODE_ENV: str(),
  PORT: portEnv(),
  BACKEND_URL: url(),
});

const app = express();
ViteExpress.config({
  mode: 'production',
});

const port = Number(env.PORT);

const backendUrl = env.BACKEND_URL;

if (!port) {
  throw new Error('PORT environment variable is required');
} else if (!backendUrl) {
  throw new Error('BACKEND_URL environment variable is required');
}

console.log('NODE_ENV:', env.NODE_ENV);
console.log('PORT:', port);
console.log('BACKEND_URL:', backendUrl);

// Generate nonces for csp (required for PayPal & Google)
// app.use((req, res, next) => {
//   res.locals.cspNonce = randomBytes(16).toString('base64');
//   next();
// });

// `'nonce-${res.locals.cspNonce}'`, // PayPal

// Secure the app with Helmet
app.use(helmet());

// Enable CORS
app.use(cors());

// Proxy /v1 requests to the backend
app.use(
  '/v1',
  createProxyMiddleware({
    target: backendUrl,
    changeOrigin: true,
    secure: false,
  }),
);

// Serve public directory and set MIME type for manifest.webmanifest
app.use((req, res, next) => {
  if (req.url.endsWith('.webmanifest')) {
    res.setHeader('Content-Type', 'application/manifest+json');
  }
  next();
});

// Serve public directory
app.use(express.static(join(cwd(), './public')));

ViteExpress.listen(app, port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
