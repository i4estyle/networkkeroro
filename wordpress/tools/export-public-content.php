<?php
declare(strict_types=1);

$wordpressRoot = rtrim((string) (getenv('WP_ROOT') ?: '/var/www/html'), '/');
require $wordpressRoot . '/wp-load.php';

function public_page_slug(int $id): string {
    if ($id <= 0) {
        return '';
    }
    $post = get_post($id);
    return $post instanceof WP_Post ? $post->post_name : '';
}

$postTypes = ['page', 'post', 'wp_navigation', 'wp_template', 'wp_template_part', 'wp_global_styles'];
$posts = get_posts([
    'post_type' => $postTypes,
    'post_status' => ['publish'],
    'numberposts' => -1,
    'orderby' => ['post_type' => 'ASC', 'menu_order' => 'ASC', 'post_name' => 'ASC'],
    'suppress_filters' => false,
]);

$content = [];
foreach ($posts as $post) {
    if (!$post instanceof WP_Post) {
        continue;
    }
    $parent = $post->post_parent ? get_post($post->post_parent) : null;
    $content[] = [
        'type' => $post->post_type,
        'slug' => $post->post_name,
        'title' => $post->post_title,
        'content' => $post->post_content,
        'excerpt' => $post->post_excerpt,
        'parent_slug' => $parent instanceof WP_Post ? $parent->post_name : '',
        'menu_order' => (int) $post->menu_order,
    ];
}

$uploads = wp_get_upload_dir();
$attachments = get_posts([
    'post_type' => 'attachment',
    'post_status' => 'inherit',
    'numberposts' => -1,
    'orderby' => 'ID',
    'order' => 'ASC',
]);
$media = [];
foreach ($attachments as $attachment) {
    if (!$attachment instanceof WP_Post) {
        continue;
    }
    $file = get_attached_file($attachment->ID);
    if (!is_string($file) || !str_starts_with($file, $uploads['basedir'] . '/')) {
        continue;
    }
    $media[] = [
        'file' => substr($file, strlen($uploads['basedir']) + 1),
        'title' => $attachment->post_title,
        'caption' => $attachment->post_excerpt,
        'alt' => (string) get_post_meta($attachment->ID, '_wp_attachment_image_alt', true),
    ];
}

$result = [
    'export_format' => 1,
    'wordpress_version' => get_bloginfo('version'),
    'theme' => [
        'template' => get_option('template'),
        'stylesheet' => get_option('stylesheet'),
        'version' => wp_get_theme()->get('Version'),
    ],
    'site' => [
        'name' => get_option('blogname'),
        'description' => get_option('blogdescription'),
        'show_on_front' => get_option('show_on_front'),
        'front_page_slug' => public_page_slug((int) get_option('page_on_front')),
        'posts_page_slug' => public_page_slug((int) get_option('page_for_posts')),
        'permalink_structure' => get_option('permalink_structure'),
    ],
    'content' => $content,
    'media' => $media,
];

echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE), PHP_EOL;
