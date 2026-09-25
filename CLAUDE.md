# AI Capstone — Project Guide

This file provides context for AI assistants (Cursor AI) working in this repository.

## Tech Stack

| Tool | Purpose |
|------|---------|
| **Node.js** | Runtime for scripts and tooling |
| **JavaScript** | Primary language (CommonJS modules) |
| **Git** | Version control and collaboration |
| **Cursor AI** | AI-assisted development |

## Coding Conventions

### Language & Style

- Use **JavaScript** with **CommonJS** (`require` / `module.exports`) unless the project moves to ESM.
- Target the Node.js version specified in the project (or LTS when unspecified).
- Prefer `const` by default; use `let` when reassignment is required. Avoid `var`.
- Use `async/await` over raw Promise chains when handling asynchronous code.
- Use meaningful, descriptive names for variables, functions, and files.

### Formatting

- Use 2-space indentation.
- Use single quotes for strings unless interpolation or escaping makes double quotes clearer.
- End statements with semicolons.
- Keep functions small and focused on a single responsibility.
- Add comments only for non-obvious logic — prefer self-documenting code.

### Files & Modules

- One primary export per module when practical.
- Place shared utilities in `src/utils/` (or `lib/` once created).
- Keep entry points thin; move business logic into dedicated modules.

### Error Handling

- Validate inputs at module boundaries.
- Throw or return errors with clear, actionable messages.
- Do not swallow errors silently.

### UI & Accessibility

- Every form input must have a proper visible `<label>` tied via matching `for` and `id` attributes.
- Inputs must be keyboard accessible with clear focus states (`:focus-visible`).
- Use appropriate semantic input types (`text`, `email`, `tel`) and accessibility attributes (`aria-required`, `aria-invalid`, `aria-describedby`).
- Error messages must clearly identify the relevant field and use live regions (`role="alert"` or `aria-live="polite"`).
- Manage focus accessibility by moving focus to the first invalid field upon validation failure.

### Testing & Verification

- New functionality, validation rules, or API endpoints must have automated tests.
- Write tests for both happy paths and edge cases (empty fields, invalid formats, boundary conditions).
- Run tests (`npm test`) and the project build (`npm run build`) before declaring any feature complete.
- Never claim verification passed without actually executing the verification commands and inspecting output.
- Fix all test or build failures before completing the task.

## Conventional Commits

All commit messages follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|------|-------------|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change that is not a fix or feature |
| `test` | Adding or updating tests |
| `chore` | Maintenance, tooling, dependencies |

### Examples

```
feat: add user authentication module
fix(parser): handle empty input arrays
docs: update README with setup instructions
chore: add eslint configuration
```

### Guidelines

- Use the imperative mood in the subject line ("add feature" not "added feature").
- Keep the subject line under 72 characters.
- Reference issues in the footer when applicable: `Closes #123`.

## Folder Structure

Current layout and intended organization:

```
ai-capstone/
├── CLAUDE.md          # AI assistant project guide (this file)
├── LICENSE
├── README.md          # Project overview and setup
├── package.json       # Node.js project metadata and scripts
├── index.js           # Main entry point (when added)
├── src/               # Application source code
│   ├── index.js       # Primary application entry
│   ├── utils/         # Shared helper functions
│   └── ...            # Feature-specific modules
├── tests/             # Test files (when added)
└── .git/              # Git metadata (do not edit manually)
```

### Conventions

- **`src/`** — All application logic lives here, not in the project root.
- **`tests/`** — Mirror the `src/` structure where possible (e.g. `tests/utils/`).
- **Root config files** — Keep `package.json`, `README.md`, and license at the root only.
- **No committed secrets** — Never commit `.env` files, API keys, or credentials.

## Working with Cursor AI

- Read this file and `README.md` before making changes.
- Inspect existing files, directories, and dependencies before making changes.
- Match existing patterns in the codebase before introducing new ones.
- Reuse existing components and utilities where possible.
- Keep changes minimal and focused on the requested task — do not modify unrelated files.
- Ensure form inputs have proper visible, accessible labels and ARIA attributes.
- New functionality should have accompanying automated tests.
- Run tests and the build before declaring a feature complete.
- Do not claim verification passed without actually running it and checking the results.
- Do not commit unless explicitly asked.

