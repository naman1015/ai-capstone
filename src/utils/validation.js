'use strict';

/**
 * Validation helpers for the settings form fields.
 * @module utils/validation
 */

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]{1,79}$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

/**
 * @param {unknown} value
 * @returns {string}
 */
function asTrimmedString(value) {
  if (value == null) {
    return '';
  }
  return String(value).trim();
}

/**
 * @param {unknown} name
 * @returns {{ valid: boolean, message: string }}
 */
function validateName(name) {
  const value = asTrimmedString(name);

  if (!value) {
    return { valid: false, message: 'Name is required.' };
  }
  if (value.length < 2) {
    return { valid: false, message: 'Name must be at least 2 characters.' };
  }
  if (!NAME_PATTERN.test(value)) {
    return {
      valid: false,
      message: 'Use letters, spaces, hyphens, or apostrophes only.',
    };
  }

  return { valid: true, message: '' };
}

/**
 * @param {unknown} email
 * @returns {{ valid: boolean, message: string }}
 */
function validateEmail(email) {
  const value = asTrimmedString(email);

  if (!value) {
    return { valid: false, message: 'Email is required.' };
  }
  if (!EMAIL_PATTERN.test(value)) {
    return { valid: false, message: 'Enter a valid email address.' };
  }

  return { valid: true, message: '' };
}

/**
 * Digits-only length after stripping formatting characters.
 * @param {string} phone
 * @returns {number}
 */
function digitCount(phone) {
  return phone.replace(/\D/g, '').length;
}

/**
 * @param {unknown} phone
 * @returns {{ valid: boolean, message: string }}
 */
function validatePhone(phone) {
  const value = asTrimmedString(phone);

  if (!value) {
    return { valid: false, message: 'Phone number is required.' };
  }
  if (!PHONE_PATTERN.test(value)) {
    return {
      valid: false,
      message: 'Use digits with optional +, spaces, dashes, or parentheses.',
    };
  }

  const digits = digitCount(value);
  if (digits < 7 || digits > 15) {
    return {
      valid: false,
      message: 'Phone number must have between 7 and 15 digits.',
    };
  }

  return { valid: true, message: '' };
}

/**
 * Validate the full settings payload.
 * @param {{ name?: unknown, email?: unknown, phone?: unknown }} fields
 * @returns {{
 *   valid: boolean,
 *   errors: { name: string, email: string, phone: string }
 * }}
 */
function validateSettings(fields = {}) {
  const nameResult = validateName(fields.name);
  const emailResult = validateEmail(fields.email);
  const phoneResult = validatePhone(fields.phone);

  return {
    valid: nameResult.valid && emailResult.valid && phoneResult.valid,
    errors: {
      name: nameResult.message,
      email: emailResult.message,
      phone: phoneResult.message,
    },
  };
}

module.exports = {
  validateName,
  validateEmail,
  validatePhone,
  validateSettings,
};
