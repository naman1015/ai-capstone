'use strict';

(function () {
  const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  const PHONE_ALLOWED_CHARS = /^\+?[\d\s().-]+$/;

  const form = document.getElementById('settings-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn') || form.querySelector('button[type="submit"]');

  /**
   * Coerces value to a trimmed string.
   * @param {unknown} value
   * @returns {string}
   */
  function trim(value) {
    return value == null ? '' : String(value).trim();
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
   * @param {string} name
   * @returns {{ valid: boolean, message: string }}
   */
  function validateFullName(name) {
    const value = trim(name);
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
   * @param {string} email
   * @returns {{ valid: boolean, message: string }}
   */
  function validateEmail(email) {
    const value = trim(email);
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
   * @param {string} phone
   * @returns {{ valid: boolean, message: string }}
   */
  function validatePhone(phone) {
    const value = trim(phone);
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

  const validators = {
    fullName: validateFullName,
    email: validateEmail,
    phone: validatePhone,
  };

  /**
   * Displays status message with styling.
   * @param {string} message
   * @param {'success' | 'error' | ''} kind
   */
  function setStatus(message, kind) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    if (kind) {
      statusEl.classList.add(kind === 'success' ? 'is-success' : 'is-error');
    }
  }

  /**
   * Validates a single form field and updates its accessibility and visual states.
   * @param {string} fieldName
   * @param {boolean} showEmptyErrors
   * @returns {boolean}
   */
  function validateField(fieldName, showEmptyErrors) {
    const fieldContainer = form.querySelector(`[data-field="${fieldName}"]`);
    if (!fieldContainer) return true;

    const input = fieldContainer.querySelector('input');
    const errorEl = fieldContainer.querySelector('.error');
    if (!input || !errorEl) return true;

    const rawValue = input.value;
    const isEmpty = !trim(rawValue);

    // If typing and field is currently empty, defer showing "required" error until blur or submit
    if (isEmpty && !showEmptyErrors) {
      fieldContainer.classList.remove('is-invalid', 'is-valid');
      errorEl.hidden = true;
      errorEl.textContent = '';
      input.removeAttribute('aria-invalid');
      return true;
    }

    const validator = validators[fieldName];
    const result = validator ? validator(rawValue) : { valid: true, message: '' };

    if (!result.valid) {
      fieldContainer.classList.add('is-invalid');
      fieldContainer.classList.remove('is-valid');
      errorEl.textContent = result.message;
      errorEl.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      return false;
    }

    fieldContainer.classList.remove('is-invalid');
    fieldContainer.classList.add('is-valid');
    errorEl.textContent = '';
    errorEl.hidden = true;
    input.setAttribute('aria-invalid', 'false');
    return true;
  }

  /**
   * Validates all fields for form submission.
   * @returns {boolean}
   */
  function validateAll() {
    let allValid = true;
    let firstInvalidInput = null;

    ['fullName', 'email', 'phone'].forEach((fieldName) => {
      const isValid = validateField(fieldName, true);
      if (!isValid) {
        allValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = form.querySelector(`[data-field="${fieldName}"] input`);
        }
      }
    });

    if (!allValid && firstInvalidInput) {
      firstInvalidInput.focus();
    }

    return allValid;
  }

  // Attach live and blur listeners
  ['fullName', 'email', 'phone'].forEach((fieldName) => {
    const input = form.elements.namedItem(fieldName);
    if (!input) return;

    input.addEventListener('blur', () => {
      validateField(fieldName, true);
    });

    input.addEventListener('input', () => {
      validateField(fieldName, false);
      if (statusEl && statusEl.classList.contains('is-error')) {
        setStatus('', '');
      }
    });
  });

  // Handle form submission
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', '');

    const isValid = validateAll();
    if (!isValid) {
      setStatus('Please correct the highlighted fields before submitting.', 'error');
      return;
    }

    const fullNameInput = form.elements.namedItem('fullName');
    const emailInput = form.elements.namedItem('email');
    const phoneInput = form.elements.namedItem('phone');

    const payload = {
      fullName: trim(fullNameInput.value),
      email: trim(emailInput.value),
      phone: trim(phoneInput.value),
    };

    submitBtn.disabled = true;
    setStatus('Saving settings…', '');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.errors) {
          Object.keys(data.errors).forEach((key) => {
            if (!data.errors[key]) return;
            const container = form.querySelector(`[data-field="${key}"]`);
            if (!container) return;
            container.classList.add('is-invalid');
            container.classList.remove('is-valid');
            const errorEl = container.querySelector('.error');
            const input = container.querySelector('input');
            if (errorEl) {
              errorEl.textContent = data.errors[key];
              errorEl.hidden = false;
            }
            if (input) {
              input.setAttribute('aria-invalid', 'true');
            }
          });
        }
        setStatus(data.message || 'Validation failed. Please review your entries.', 'error');
        return;
      }

      setStatus(data.message || 'Settings saved successfully.', 'success');
    } catch (_error) {
      setStatus('Unable to save settings. Please check your connection and try again.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
