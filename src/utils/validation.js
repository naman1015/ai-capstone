'use strict';

/**
 * Validation utilities for the settings form.
 * @module utils/validation
 */

const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const PHONE_ALLOWED_CHARS = /^\+?[\d\s().-]+$/;

/**
 * Coerces value to a trimmed string.
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
 * Counts the number of numeric digits in a string.
 * @param {string} str
 * @returns {number}
 */
function countDigits(str) {
  return str.replace(/\D/g, '').length;
}

/**
 * Validates Full Name.
 * Requirements:
 * - Required
 * - Must contain at least 2 characters
 *
 * @param {unknown} name
 * @returns {{ valid: boolean, message: string }}
 */
function validateFullName(name) {
  const value = asTrimmedString(name);

  if (!value) {
    return { valid: false, message: 'Full Name is required.' };
  }

  if (value.length < 2) {
    return { valid: false, message: 'Full Name must contain at least 2 characters.' };
  }

  return { valid: true, message: '' };
}

/**
 * Validates Email.
 * Requirements:
 * - Required
 * - Must use a valid email format
 *
 * @param {unknown} email
 * @returns {{ valid: boolean, message: string }}
 */
function validateEmail(email) {
  const value = asTrimmedString(email);

  if (!value) {
    return { valid: false, message: 'Email is required.' };
  }

  if (!EMAIL_PATTERN.test(value)) {
    return { valid: false, message: 'Email must use a valid email format.' };
  }

  return { valid: true, message: '' };
}

/**
 * Validates Phone Number.
 * Requirements:
 * - Required
 * - Must contain exactly 10 digits
 *
 * @param {unknown} phone
 * @returns {{ valid: boolean, message: string }}
 */
function validatePhone(phone) {
  const value = asTrimmedString(phone);

  if (!value) {
    return { valid: false, message: 'Phone Number is required.' };
  }

  if (!PHONE_ALLOWED_CHARS.test(value)) {
    return {
      valid: false,
      message: 'Phone Number can only contain digits and standard separators (spaces, dashes, parentheses).',
    };
  }

  const digits = countDigits(value);

  if (digits < 10) {
    return {
      valid: false,
      message: 'Phone Number must contain exactly 10 digits (fewer than 10 provided).',
    };
  }

  if (digits > 10) {
    return {
      valid: false,
      message: 'Phone Number must contain exactly 10 digits (more than 10 provided).',
    };
  }

  return { valid: true, message: '' };
}

/**
 * Validates the full settings payload.
 * Accepts { fullName, email, phone } and aliases { name, phoneNumber }.
 *
 * @param {{ fullName?: unknown, name?: unknown, email?: unknown, phone?: unknown, phoneNumber?: unknown }} fields
 * @returns {{
 *   valid: boolean,
 *   errors: { fullName: string, name: string, email: string, phone: string, phoneNumber: string }
 * }}
 */
function validateSettings(fields = {}) {
  const nameVal = fields.fullName !== undefined ? fields.fullName : fields.name;
  const emailVal = fields.email;
  const phoneVal = fields.phone !== undefined ? fields.phone : fields.phoneNumber;

  const nameResult = validateFullName(nameVal);
  const emailResult = validateEmail(emailVal);
  const phoneResult = validatePhone(phoneVal);

  const valid = nameResult.valid && emailResult.valid && phoneResult.valid;

  return {
    valid,
    errors: {
      fullName: nameResult.message,
      name: nameResult.message,
      email: emailResult.message,
      phone: phoneResult.message,
      phoneNumber: phoneResult.message,
    },
  };
}

module.exports = {
  validateFullName,
  validateName: validateFullName, // alias for flexible naming
  validateEmail,
  validatePhone,
  validatePhoneNumber: validatePhone, // alias for flexible naming
  validateSettings,
  countDigits,
};
