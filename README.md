# Keroro Network

Selected production source for the Keroro Network website. The repository contains the refactored security dashboard and the active WordPress theme, sanitized public content snapshot, and reviewed public media used by the normal website.

## Structure

```text
dashboard/    security dashboard source, build tools, and production bundles
wordpress/    active theme and sanitized public website content
```

The `dashboard/` and `wordpress/` directories are independent production components. Repository-level documentation and security policy stay at the root.

## Build

Node.js:

```bash
cd dashboard
npm run build
```

Python 3, including production servers without Node.js:

```bash
cd dashboard
python3 tools/build-dashboard.py
```

Both builders generate `index.html`, `dist/dashboard.css`, and `dist/dashboard.js`. The build fails when duplicate DOM IDs, missing assets, inline styles, or inline scripts are detected.

## Validate

```bash
python3 dashboard/tools/validate-release.py
node --check dashboard/dist/dashboard.js
```

## Runtime data

The backend writes `analysis.json` and `blocks_summary.json` in production. These files can contain operational security data and are intentionally excluded from Git. API credentials, OTP state, SMTP credentials, logs, block state, and server configuration are not part of this repository.

WordPress core, the production database, `wp-config.php`, user accounts, password hashes, drafts, private content, caches, and server credentials are also excluded. See `wordpress/README.md` for the selected WordPress source and restore outline.

## Deployment

Build `dashboard/` in a staging directory, validate the generated output, deploy static assets first, and replace the production `index.html` last using an atomic move. Never place secrets in frontend source or commit production runtime data.

