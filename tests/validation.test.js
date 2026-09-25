'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateName,
  validateEmail,
  validatePhone,
  validateSettings,
} = require('../src/utils/validation');

describe('validateName', () => {
  it('accepts a normal name', () => {
    assert.equal(validateName('Jordan Lee').valid, true);
  });

  it('rejects empty name', () => {
    assert.equal(validateName('').valid, false);
  });

  it('rejects names with digits', () => {
    assert.equal(validateName('Jordan2').valid, false);
  });
});

describe('validateEmail', () => {
  it('accepts a valid email', () => {
    assert.equal(validateEmail('you@example.com').valid, true);
  });

  it('rejects missing domain', () => {
    assert.equal(validateEmail('you@').valid, false);
  });
});

describe('validatePhone', () => {
  it('accepts formatted numbers', () => {
    assert.equal(validatePhone('+1 (555) 123-4567').valid, true);
  });

  it('rejects too few digits', () => {
    assert.equal(validatePhone('123').valid, false);
  });
});

describe('validateSettings', () => {
  it('passes when all fields are valid', () => {
    const result = validateSettings({
      name: 'Jordan Lee',
      email: 'jordan@example.com',
      phone: '+15551234567',
    });
    assert.equal(result.valid, true);
  });

  it('collects field errors', () => {
    const result = validateSettings({
      name: '',
      email: 'bad',
      phone: '12',
    });
    assert.equal(result.valid, false);
    assert.ok(result.errors.name);
    assert.ok(result.errors.email);
    assert.ok(result.errors.phone);
  });
});
