<?php
/**
 * Functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package wens-press
 * @since 1.0.0
 */

/**
 * Enqueue the CSS files.
 *
 * @since 1.0.0
 *
 * @return void
 */
function wens_press_styles() {
	wp_enqueue_style(
		'wens-press-style',
		get_stylesheet_uri(),
		[],
		wp_get_theme()->get( 'Version' )
	);
}
add_action( 'wp_enqueue_scripts', 'wens_press_styles' );


function wens_press_register_block_pattern_categories(){
    register_block_pattern_category(
        'wens-press',
        array( 'label' => __( 'Theme Patterns', 'wens-press' ) )
    );

}
add_action('init', 'wens_press_register_block_pattern_categories');
