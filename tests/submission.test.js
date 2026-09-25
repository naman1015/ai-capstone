'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const { createServer } = require('../src/index');

/**
 * Helper to make HTTP requests against the test server.
 * @param {import('http').Server} server
 * @param {{ path: string, method?: string, headers?: Record<string, string>, body?: any }} options
 * @returns {Promise<{ status: number, headers: import('http').IncomingHttpHeaders, body: string, json: any }>}
 */
function request(server, options) {
  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 3000;

  return new Promise((resolve, reject) => {
    const payload = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : null;

    const req = http.request(
      {
        host: '127.0.0.1',
        port,
        path: options.path,
        method: options.method || 'GET',
        headers: {
          ...(payload ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } : {}),
          ...options.headers,
        },
      },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString('utf8');
          let json = null;
          try {
            json = JSON.parse(body);
          } catch (_e) {
            // Not JSON
          }
          resolve({
            status: res.statusCode || 0,
            headers: res.headers,
            body,
            json,
          });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

describe('Settings API and Submission Workflow', () => {
  let server;

  before(async () => {
    server = createServer();
    await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  });

  after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('serves the settings form page with accessible elements', async () => {
    const res = await request(server, { path: '/settings' });
    assert.equal(res.status, 200);
    assert.ok(res.body.includes('id="settings-form"'));
    assert.ok(res.body.includes('for="fullName"'));
    assert.ok(res.body.includes('for="email"'));
    assert.ok(res.body.includes('for="phone"'));
  });

  it('rejects submission with empty fields', async () => {
    const res = await request(server, {
      path: '/api/settings',
      method: 'POST',
      body: {
        fullName: '',
        email: '',
        phone: '',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.json.ok, false);
    assert.equal(res.json.message, 'Validation failed.');
    assert.equal(res.json.errors.fullName, 'Full Name is required.');
    assert.equal(res.json.errors.email, 'Email is required.');
    assert.equal(res.json.errors.phone, 'Phone Number is required.');
  });

  it('rejects submission with invalid email', async () => {
    const res = await request(server, {
      path: '/api/settings',
      method: 'POST',
      body: {
        fullName: 'Alex Morgan',
        email: 'invalid-email-address',
        phone: '5551234567',
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.json.ok, false);
    assert.equal(res.json.errors.email, 'Email must use a valid email format.');
  });

  it('rejects submission with phone having fewer than 10 digits', async () => {
    const res = await request(server, {
      path: '/api/settings',
      method: 'POST',
      body: {
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        phone: '123456789', // 9 digits
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.json.ok, false);
    assert.match(res.json.errors.phone, /exactly 10 digits/i);
  });

  it('rejects submission with phone having more than 10 digits', async () => {
    const res = await request(server, {
      path: '/api/settings',
      method: 'POST',
      body: {
        fullName: 'Alex Morgan',
        email: 'alex@example.com',
        phone: '12345678901', // 11 digits
      },
    });

    assert.equal(res.status, 400);
    assert.equal(res.json.ok, false);
    assert.match(res.json.errors.phone, /exactly 10 digits/i);
  });

  it('successfully submits valid settings and returns confirmation', async () => {
    const validData = {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '5551234567',
    };

    const res = await request(server, {
      path: '/api/settings',
      method: 'POST',
      body: validData,
    });

    assert.equal(res.status, 200);
    assert.equal(res.json.ok, true);
    assert.equal(res.json.message, 'Settings saved successfully.');
    assert.deepEqual(res.json.data, {
      fullName: 'Alex Morgan',
      email: 'alex.morgan@example.com',
      phone: '5551234567',
    });
  });
});
