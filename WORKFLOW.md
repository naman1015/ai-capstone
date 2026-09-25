# AI-Assisted Development Experiment: Settings Form

This document evaluates an AI-assisted development experiment comparing vague versus precise prompts when building a user Settings Form with Full Name, Email, and Phone Number fields.

## Round 1: Vague Prompt (`feature/settings-vague`)

Round 1 used minimal guidance:
> *"Create a settings form with name, email, and phone fields. Add validation and make it look good."*

### Observed AI Assumptions
Because requirements were unspecified, the AI filled in gaps with arbitrary assumptions. Most notably, the AI independently chose a phone validation range of 7–15 digits (`digits < 7 || digits > 15`) even though no length was specified. This allowed 7-digit local numbers and arbitrary international lengths. In addition, test coverage was sparse (7 basic unit assertions), accessibility was minimal without systematic ARIA roles, and no build or verification steps were executed.

## Round 2: Precise Prompt (`feature/settings-precise`)

Round 2 supplied explicit, unambiguous specifications:
- **Validation**: Full Name required (minimum 2 characters); Email required (valid format); Phone Number required (exactly 10 digits).
- **Accessibility**: Visible labels with `for`/`id` associations, keyboard navigation with focus on the first invalid field, `aria-required`, `aria-invalid`, `aria-describedby` error linkages, and `role="alert"` / `aria-live="polite"` regions.
- **Scope & Verification**: Strict instructions not to touch unrelated files, mandatory tests for empty fields, invalid emails, phone numbers under and over 10 digits, and successful submission.

### Results
Round 2 produced 22 tests across unit and HTTP submission suites (`tests/validation.test.js` and `tests/submission.test.js`). All 22 tests passed, and the build check (`node --check`) completed successfully.

## Comparative Analysis

| Dimension | Round 1 (`feature/settings-vague`) | Round 2 (`feature/settings-precise`) |
|---|---|---|
| **Requirements** | Open-ended ("make it look good") | Explicit boundaries, field rules, and scope limits |
| **Validation** | AI assumed 7–15 digit phone range | Enforced >= 2 name chars, valid email, exactly 10 phone digits |
| **Accessibility** | Basic HTML markup without full ARIA lifecycle | Explicit labels, focus management, ARIA states, live regions |
| **Testing** | 7 basic assertions, no submission tests | 22 tests for boundary conditions, errors, and submission |
| **Verification** | No build or test execution requested | `npm test` (22/22 passing) and `npm run build` executed |

## Key Learnings

1. **Precise Specifications Eliminate Unintended Assumptions**: When details are omitted, AI models guess plausible defaults. In Round 1, the AI chose a 7–15 digit phone rule. Specifying clear rules prevents unvetted assumptions.
2. **Verification Must Be Directed**: AI output cannot be assumed correct without validation. Requiring tests and build checks exposed edge cases early and verified that all 22 tests passed cleanly.
