# Keroro Network Security Dashboard

Production frontend source for the Keroro Network security dashboard. The repository contains the refactored HTML components, page sections, CSS, JavaScript modules, build tools, and deployable bundles currently used by the dashboard.

## Structure

```text
components/   shared HTML components
pages/        dashboard page sections
src/          index template
styles/       maintainable CSS source
scripts/      application JavaScript source
dist/         production CSS and JavaScript bundles
tools/        build and release validation
assets/       project-owned static assets
vendor/       pinned third-party browser library
index.html    generated production entry point
```

## Build

Node.js:

```bash
npm run build
```

Python 3, including production servers without Node.js:

```bash
python3 tools/build-dashboard.py
```

Both builders generate `index.html`, `dist/dashboard.css`, and `dist/dashboard.js`. The build fails when duplicate DOM IDs, missing assets, inline styles, or inline scripts are detected.

## Validate

```bash
python3 tools/validate-release.py
node --check dist/dashboard.js
```

## Runtime data

The backend writes `analysis.json` and `blocks_summary.json` in production. These files can contain operational security data and are intentionally excluded from Git. API credentials, OTP state, SMTP credentials, logs, block state, and server configuration are not part of this repository.

## Deployment

Build in a staging directory, validate the generated output, deploy static assets first, and replace `index.html` last using an atomic move. Never place secrets in frontend source or commit production runtime data.

