<?php
/**
 * Plugin Name: Security User & Identity Protection
 * Description: Prevents user enumeration, masks author data, hides REST user endpoints, removes version disclosures, and disables author archives.
 * Author: Antigravity Security Hardening
 * Version: 1.1.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// 1. Block REST API User Endpoints for unauthenticated users
add_filter( 'rest_endpoints', function( $endpoints ) {
    if ( ! is_user_logged_in() ) {
        if ( isset( $endpoints['/wp/v2/users'] ) ) {
            unset( $endpoints['/wp/v2/users'] );
        }
        if ( isset( $endpoints['/wp/v2/users/(?P<id>[\\d]+)'] ) ) {
            unset( $endpoints['/wp/v2/users/(?P<id>[\\d]+)'] );
        }
    }
    return $endpoints;
} );

// 2. Intercept query-string rest_route (?rest_route=/wp/v2/users...)
add_filter( 'rest_authentication_errors', function( $result ) {
    if ( ! empty( $result ) ) {
        return $result;
    }
    if ( ! is_user_logged_in() ) {
        $raw_route = isset( $_GET['rest_route'] ) ? sanitize_text_field( (string) $_GET['rest_route'] ) : '';
        if ( preg_match( '#^(/|%2F)?wp(/|%2F)v2(/|%2F)users#i', $raw_route ) ) {
            return new WP_Error(
                'rest_cannot_access',
                'Resource not found.',
                array( 'status' => 404 )
            );
        }
    }
    return $result;
} );

// 3. Block ?author=N enumeration and /author/* archive pages
add_action( 'template_redirect', function() {
    if ( is_admin() ) {
        return;
    }
    if ( is_author() || isset( $_GET['author'] ) || isset( $_GET['author_name'] ) ) {
        global $wp_query;
        $wp_query->set_404();
        status_header( 404 );
        nocache_headers();
        include( get_query_template( '404' ) );
        exit;
    }
} );

// 4. Mask author data and strip author endpoint links in REST responses (posts, pages, media, comments)
$mask_author_fn = function( $response, $item, $request ) {
    if ( ! is_user_logged_in() ) {
        if ( isset( $response->data['author'] ) ) {
            $response->data['author'] = 0;
        }
        if ( method_exists( $response, 'remove_link' ) ) {
            $response->remove_link( 'author' );
        }
    }
    return $response;
};

add_filter( 'rest_prepare_page', $mask_author_fn, 10, 3 );
add_filter( 'rest_prepare_post', $mask_author_fn, 10, 3 );
add_filter( 'rest_prepare_attachment', $mask_author_fn, 10, 3 );

add_filter( 'rest_prepare_comment', function( $response, $item, $request ) {
    if ( ! is_user_logged_in() ) {
        if ( isset( $response->data['author'] ) ) {
            $response->data['author'] = 0;
        }
        if ( isset( $response->data['author_name'] ) ) {
            $response->data['author_name'] = 'Anonymous';
        }
        if ( isset( $response->data['author_email'] ) ) {
            unset( $response->data['author_email'] );
        }
        if ( isset( $response->data['author_ip'] ) ) {
            unset( $response->data['author_ip'] );
        }
        if ( method_exists( $response, 'remove_link' ) ) {
            $response->remove_link( 'author' );
        }
    }
    return $response;
}, 10, 3 );

// 5. Mask oEmbed Author Data (prevents user enumeration via /wp-json/oembed/1.0/embed)
add_filter( 'oembed_response_data', function( $data ) {
    if ( isset( $data['author_name'] ) ) {
        unset( $data['author_name'] );
    }
    if ( isset( $data['author_url'] ) ) {
        unset( $data['author_url'] );
    }
    return $data;
} );

// 6. Remove REST API discovery and user links from HTML <head> and headers
remove_action( 'wp_head', 'rest_output_link_wp_head', 10 );
remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
remove_action( 'template_redirect', 'rest_output_link_header', 11 );
remove_action( 'wp_head', 'rsd_link' );
remove_action( 'wp_head', 'wlwmanifest_link' );

// 7. Remove WordPress generator / version info from HTML head and RSS feeds
remove_action( 'wp_head', 'wp_generator' );
add_filter( 'the_generator', '__return_empty_string' );

// 8. Mask login error messages to prevent username harvesting via wp-login.php (UTF-8 safe via hex2bin)
add_filter( 'login_errors', function() {
    return hex2bin('e0b88ae0b8b7e0b988e0b8ade0b89ce0b8b9e0b989e0b983e0b88ae0b989e0b8abe0b8a3e0b8b7e0b8ade0b8a3e0b8abe0b8b1e0b8aae0b89ce0b988e0b8b2e0b899e0b984e0b8a1e0b988e0b896e0b8b9e0b881e0b895e0b989e0b8ade0b88720e0b982e0b89be0b8a3e0b894e0b8a5e0b8ade0b887e0b8ade0b8b5e0b881e0b884e0b8a3e0b8b1e0b989e0b8872028496e76616c696420757365726e616d65206f722070617373776f726429');
} );

// 9. Disable user sitemap provider
add_filter( 'wp_sitemaps_add_provider', function( $provider, $name ) {
    if ( 'users' === $name ) {
        return false;
    }
    return $provider;
}, 10, 2 );
