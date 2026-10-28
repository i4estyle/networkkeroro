# WordPress production source

This directory contains the selected source and public content used by the normal WordPress website. It intentionally excludes WordPress core, the production database, `wp-config.php`, credentials, caches, logs, and private runtime state.

## Included

- `themes/wens-press/` — active production theme, version 1.0.2.
- `content/public-content.json` — sanitized snapshot of published pages, navigation, templates, template parts, and global styles. Author accounts, password hashes, database IDs, drafts, private posts, and authentication data are excluded.
- `public-media/` — publicly served media and generated responsive variants inspected for sensitive EXIF metadata.
- `manifests/` — WordPress, theme, and plugin inventory.
- `wp-config.example.php` — environment-variable configuration example with no credentials.
- `tools/export-public-content.php` — repeatable public-content exporter. Set `WP_ROOT` when WordPress is installed outside `/var/www/html`.

## Restore outline

1. Install the WordPress version listed in `manifests/wordpress-version.txt`.
2. Copy `themes/wens-press` to `wp-content/themes/wens-press` and activate it.
3. Copy the contents of `public-media` to `wp-content/uploads`.
4. Review `content/public-content.json` and import the published content through an approved migration process.
5. Create the real `wp-config.php` outside Git using environment variables or a secret manager.

The public-content snapshot contains contact information already published on the website. Review it before reusing the content in another environment.

