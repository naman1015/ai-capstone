'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { validateSettings } = require('./utils/validation');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

/**
 * @param {import('http').ServerResponse} res
 * @param {number} status
 * @param {string} contentType
 * @param {string | Buffer} body
 */
function send(res, status, contentType, body) {
  res.writeHead(status, {
    'Content-Type': contentType,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

/**
 * @param {import('http').ServerResponse} res
 * @param {number} status
 * @param {object} payload
 */
function sendJson(res, status, payload) {
  send(res, status, 'application/json; charset=utf-8', JSON.stringify(payload));
}

/**
 * @param {string} urlPath
 * @returns {string}
 */
function resolvePublicPath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  let relative = decoded === '/' ? '/settings.html' : decoded;

  if (relative === '/settings') {
    relative = '/settings.html';
  }

  const absolute = path.normalize(path.join(PUBLIC_DIR, relative));
  if (!absolute.startsWith(PUBLIC_DIR)) {
    return '';
  }
  return absolute;
}

/**
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<string>}
 */
function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
      if (Buffer.concat(chunks).length > 1e6) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
async function handleSettingsApi(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { ok: false, message: 'Method not allowed.' });
    return;
  }

  let raw;
  try {
    raw = await readBody(req);
  } catch (_error) {
    sendJson(res, 413, { ok: false, message: 'Request body too large.' });
    return;
  }

  let payload;
  try {
    payload = raw ? JSON.parse(raw) : {};
  } catch (_error) {
    sendJson(res, 400, { ok: false, message: 'Invalid JSON body.' });
    return;
  }

  const result = validateSettings(payload);
  if (!result.valid) {
    sendJson(res, 400, {
      ok: false,
      message: 'Validation failed.',
      errors: result.errors,
    });
    return;
  }

  sendJson(res, 200, {
    ok: true,
    message: 'Settings saved successfully.',
    data: {
      name: String(payload.name).trim(),
      email: String(payload.email).trim(),
      phone: String(payload.phone).trim(),
    },
  });
}

/**
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 */
function handleStatic(req, res) {
  const filePath = resolvePublicPath(req.url || '/');
  if (!filePath) {
    send(res, 403, 'text/plain; charset=utf-8', 'Forbidden');
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      send(res, 404, 'text/plain; charset=utf-8', 'Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    send(res, 200, MIME_TYPES[ext] || 'application/octet-stream', data);
  });
}

const server = http.createServer((req, res) => {
  const urlPath = (req.url || '/').split('?')[0];

  if (urlPath === '/api/settings') {
    handleSettingsApi(req, res).catch(() => {
      sendJson(res, 500, { ok: false, message: 'Internal server error.' });
    });
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    send(res, 405, 'text/plain; charset=utf-8', 'Method not allowed');
    return;
  }

  handleStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Settings form ready at http://localhost:${PORT}/settings`);
});
