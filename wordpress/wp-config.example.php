<?php
declare(strict_types=1);

function required_environment(string $name): string {
    $value = getenv($name);
    if (!is_string($value) || $value === '') {
        throw new RuntimeException("Missing required environment variable: {$name}");
    }
    return $value;
}

define('DB_NAME', required_environment('WORDPRESS_DB_NAME'));
define('DB_USER', required_environment('WORDPRESS_DB_USER'));
define('DB_PASSWORD', required_environment('WORDPRESS_DB_PASSWORD'));
define('DB_HOST', getenv('WORDPRESS_DB_HOST') ?: 'localhost');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', '');

foreach ([
    'AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY',
    'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT',
] as $constant) {
    define($constant, required_environment('WORDPRESS_' . $constant));
}

$table_prefix = getenv('WORDPRESS_TABLE_PREFIX') ?: 'wp_';
define('WP_DEBUG', filter_var(getenv('WORDPRESS_DEBUG') ?: 'false', FILTER_VALIDATE_BOOL));

// Production Security Hardening
define('DISALLOW_FILE_EDIT', true);
define('DISABLE_WP_CRON', true);

if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/');
}
require_once ABSPATH . 'wp-settings.php';

