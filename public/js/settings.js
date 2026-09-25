'use strict';

(function () {
  const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}\s'.-]{1,79}$/u;
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

  const form = document.getElementById('settings-form');
  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  /**
   * @param {unknown} value
   * @returns {string}
   */
  function trim(value) {
    return value == null ? '' : String(value).trim();
  }

  /**
   * @param {string} name
   * @returns {{ valid: boolean, message: string }}
   */
  function validateName(name) {
    const value = trim(name);
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
   * @param {string} email
   * @returns {{ valid: boolean, message: string }}
   */
  function validateEmail(email) {
    const value = trim(email);
    if (!value) {
      return { valid: false, message: 'Email is required.' };
    }
    if (!EMAIL_PATTERN.test(value)) {
      return { valid: false, message: 'Enter a valid email address.' };
    }
    return { valid: true, message: '' };
  }

  /**
   * @param {string} phone
   * @returns {{ valid: boolean, message: string }}
   */
  function validatePhone(phone) {
    const value = trim(phone);
    if (!value) {
      return { valid: false, message: 'Phone number is required.' };
    }
    if (!PHONE_PATTERN.test(value)) {
      return {
        valid: false,
        message: 'Use digits with optional +, spaces, dashes, or parentheses.',
      };
    }
    const digits = value.replace(/\D/g, '').length;
    if (digits < 7 || digits > 15) {
      return {
        valid: false,
        message: 'Phone number must have between 7 and 15 digits.',
      };
    }
    return { valid: true, message: '' };
  }

  const validators = {
    name: validateName,
    email: validateEmail,
    phone: validatePhone,
  };

  /**
   * @param {string} fieldName
   * @param {boolean} showEmptyErrors
   * @returns {boolean}
   */
  function validateField(fieldName, showEmptyErrors) {
    const field = form.querySelector(`[data-field="${fieldName}"]`);
    const input = field.querySelector('input');
    const errorEl = field.querySelector('.error');
    const value = input.value;
    const empty = !trim(value);

    if (empty && !showEmptyErrors) {
      field.classList.remove('is-invalid', 'is-valid');
      errorEl.hidden = true;
      errorEl.textContent = '';
      input.removeAttribute('aria-invalid');
      return true;
    }

    const result = validators[fieldName](value);
    field.classList.toggle('is-invalid', !result.valid);
    field.classList.toggle('is-valid', result.valid && !empty);
    errorEl.textContent = result.message;
    errorEl.hidden = result.valid;
    input.setAttribute('aria-invalid', result.valid ? 'false' : 'true');
    return result.valid;
  }

  /**
   * @returns {boolean}
   */
  function validateAll() {
    return ['name', 'email', 'phone'].every((name) => validateField(name, true));
  }

  /**
   * @param {string} message
   * @param {'success' | 'error' | ''} kind
   */
  function setStatus(message, kind) {
    statusEl.textContent = message;
    statusEl.classList.remove('is-success', 'is-error');
    if (kind) {
      statusEl.classList.add(kind === 'success' ? 'is-success' : 'is-error');
    }
  }

  ['name', 'email', 'phone'].forEach((fieldName) => {
    const input = form.elements.namedItem(fieldName);
    input.addEventListener('blur', () => {
      validateField(fieldName, true);
    });
    input.addEventListener('input', () => {
      validateField(fieldName, false);
      if (statusEl.textContent) {
        setStatus('', '');
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setStatus('', '');

    if (!validateAll()) {
      setStatus('Please fix the highlighted fields.', 'error');
      const firstInvalid = form.querySelector('.field.is-invalid input');
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    const payload = {
      name: trim(form.elements.namedItem('name').value),
      email: trim(form.elements.namedItem('email').value),
      phone: trim(form.elements.namedItem('phone').value),
    };

    submitBtn.disabled = true;
    setStatus('Saving…', '');

    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok || !data.ok) {
        if (data.errors) {
          Object.keys(data.errors).forEach((key) => {
            if (!data.errors[key]) {
              return;
            }
            const field = form.querySelector(`[data-field="${key}"]`);
            if (!field) {
              return;
            }
            field.classList.add('is-invalid');
            field.classList.remove('is-valid');
            const errorEl = field.querySelector('.error');
            errorEl.textContent = data.errors[key];
            errorEl.hidden = false;
          });
        }
        setStatus(data.message || 'Could not save settings.', 'error');
        return;
      }

      setStatus('Settings saved successfully.', 'success');
    } catch (_error) {
      setStatus('Network error. Try again in a moment.', 'error');
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
