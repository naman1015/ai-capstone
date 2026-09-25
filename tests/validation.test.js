'use strict';

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  validateFullName,
  validateEmail,
  validatePhone,
  validateSettings,
} = require('../src/utils/validation');

describe('Full Name Validation', () => {
  it('rejects empty full name', () => {
    const emptyCases = ['', '   ', null, undefined];
    for (const val of emptyCases) {
      const result = validateFullName(val);
      assert.equal(result.valid, false);
      assert.equal(result.message, 'Full Name is required.');
    }
  });

  it('rejects full name with fewer than 2 characters', () => {
    const result = validateFullName('A');
    assert.equal(result.valid, false);
    assert.equal(result.message, 'Full Name must contain at least 2 characters.');
  });

  it('accepts valid full name with at least 2 characters', () => {
    const validNames = ['Al', 'Alex Morgan', 'Mary-Jane Watson', "O'Connor", 'Dr. John Doe'];
    for (const name of validNames) {
      const result = validateFullName(name);
      assert.equal(result.valid, true, `Expected "${name}" to be valid`);
      assert.equal(result.message, '');
    }
  });
});

describe('Email Validation', () => {
  it('rejects empty email', () => {
    const emptyCases = ['', '   ', null, undefined];
    for (const val of emptyCases) {
      const result = validateEmail(val);
      assert.equal(result.valid, false);
      assert.equal(result.message, 'Email is required.');
    }
  });

  it('rejects invalid email formats', () => {
    const invalidEmails = [
      'plainaddress',
      'user@',
      '@example.com',
      'user@example',
      'user@.com',
      'user @example.com',
      'user@example..com',
    ];
    for (const email of invalidEmails) {
      const result = validateEmail(email);
      assert.equal(result.valid, false, `Expected "${email}" to be invalid`);
      assert.equal(result.message, 'Email must use a valid email format.');
    }
  });

  it('accepts valid email formats', () => {
    const validEmails = [
      'alex@example.com',
      'john.doe@company.org',
      'support+tag@service.io',
      'user@domain.co.uk',
    ];
    for (const email of validEmails) {
      const result = validateEmail(email);
      assert.equal(result.valid, true, `Expected "${email}" to be valid`);
      assert.equal(result.message, '');
    }
  });
});

describe('Phone Number Validation', () => {
  it('rejects empty phone number', () => {
    const emptyCases = ['', '   ', null, undefined];
    for (const val of emptyCases) {
      const result = validatePhone(val);
      assert.equal(result.valid, false);
      assert.equal(result.message, 'Phone Number is required.');
    }
  });

  it('rejects phone numbers with fewer than 10 digits', () => {
    const shortPhones = ['123', '123456789', '555-1234', '(555) 12'];
    for (const phone of shortPhones) {
      const result = validatePhone(phone);
      assert.equal(result.valid, false, `Expected "${phone}" to be invalid (fewer than 10 digits)`);
      assert.match(result.message, /exactly 10 digits/i);
    }
  });

  it('rejects phone numbers with more than 10 digits', () => {
    const longPhones = ['12345678901', '123456789012', '+1 (555) 123-45678', '555123456789'];
    for (const phone of longPhones) {
      const result = validatePhone(phone);
      assert.equal(result.valid, false, `Expected "${phone}" to be invalid (more than 10 digits)`);
      assert.match(result.message, /exactly 10 digits/i);
    }
  });

  it('rejects phone numbers with invalid characters', () => {
    const invalidChars = ['555-abc-1234', '555!@#4567', 'phone12345'];
    for (const phone of invalidChars) {
      const result = validatePhone(phone);
      assert.equal(result.valid, false, `Expected "${phone}" to be rejected due to invalid characters`);
      assert.match(result.message, /Phone Number/);
    }
  });

  it('accepts phone numbers with exactly 10 digits', () => {
    const validPhones = [
      '5551234567',
      '(555) 123-4567',
      '555-123-4567',
      '555.123.4567',
      '555 123 4567',
    ];
    for (const phone of validPhones) {
      const result = validatePhone(phone);
      assert.equal(result.valid, true, `Expected "${phone}" to be valid`);
      assert.equal(result.message, '');
    }
  });
});

describe('Full Settings Form Validation (validateSettings)', () => {
  it('rejects when fields are empty', () => {
    const result = validateSettings({
      fullName: '',
      email: '',
      phone: '',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.fullName, 'Full Name is required.');
    assert.equal(result.errors.email, 'Email is required.');
    assert.equal(result.errors.phone, 'Phone Number is required.');
  });

  it('rejects invalid email in form', () => {
    const result = validateSettings({
      fullName: 'Alex Morgan',
      email: 'not-an-email',
      phone: '5551234567',
    });
    assert.equal(result.valid, false);
    assert.equal(result.errors.email, 'Email must use a valid email format.');
  });

  it('rejects phone number with fewer than 10 digits in form', () => {
    const result = validateSettings({
      fullName: 'Alex Morgan',
      email: 'alex@example.com',
      phone: '123456789',
    });
    assert.equal(result.valid, false);
    assert.match(result.errors.phone, /exactly 10 digits/i);
  });

  it('rejects phone number with more than 10 digits in form', () => {
    const result = validateSettings({
      fullName: 'Alex Morgan',
      email: 'alex@example.com',
      phone: '12345678901',
    });
    assert.equal(result.valid, false);
    assert.match(result.errors.phone, /exactly 10 digits/i);
  });

  it('accepts valid full settings payload', () => {
    const result = validateSettings({
      fullName: 'Alex Morgan',
      email: 'alex@example.com',
      phone: '(555) 123-4567',
    });
    assert.equal(result.valid, true);
    assert.equal(result.errors.fullName, '');
    assert.equal(result.errors.email, '');
    assert.equal(result.errors.phone, '');
  });
});
