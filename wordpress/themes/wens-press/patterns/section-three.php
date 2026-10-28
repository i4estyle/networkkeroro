<?php
/**
 * Title: Section Three
 * Slug: wens-press/section-three
 * Categories: wens-press
 *
 * @package WENS Press
 * @since 1.0.0
 */

?>

<!-- wp:group {"align":"wide","style":{"spacing":{"padding":{"top":"30px","bottom":"30px","left":"24px","right":"24px"},"margin":{"top":"40px"},"blockGap":"0"}},"backgroundColor":"base","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide has-base-background-color has-background" style="margin-top:40px;padding-top:30px;padding-right:24px;padding-bottom:30px;padding-left:24px"><!-- wp:heading {"align":"wide","style":{"typography":{"textTransform":"uppercase"}}} -->
<h2 class="wp-block-heading alignwide" style="text-transform:uppercase"><?php echo __( 'Articles', 'wens-press' ); ?></h2>
<!-- /wp:heading -->

<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide"><!-- wp:query {"queryId":17,"query":{"perPage":6,"pages":0,"offset":0,"postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"taxQuery":null,"parents":[],"format":[]},"align":"wide"} -->
<div class="wp-block-query alignwide"><!-- wp:post-template {"className":"load-more-active  custom-query","layout":{"type":"grid","columnCount":3,"minimumColumnWidth":null}} -->
<!-- wp:group {"style":{"border":{"radius":"20px"},"spacing":{"padding":{"right":"0","left":"0"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group" style="border-radius:20px;padding-right:0;padding-left:0"><!-- wp:columns {"verticalAlignment":"center","style":{"spacing":{"blockGap":{"left":"var:preset|spacing|30"}}}} -->
<div class="wp-block-columns are-vertically-aligned-center"><!-- wp:column {"verticalAlignment":"center","width":"33.33%"} -->
<div class="wp-block-column is-vertically-aligned-center" style="flex-basis:33.33%"><!-- wp:cover {"useFeaturedImage":true,"dimRatio":20,"overlayColor":"contrast","isUserOverlayColor":true,"minHeight":140,"isDark":false,"style":{"border":{"radius":{"topLeft":"6px","topRight":"6px","bottomLeft":"6px","bottomRight":"6px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover is-light" style="border-top-left-radius:6px;border-top-right-radius:6px;border-bottom-left-radius:6px;border-bottom-right-radius:6px;min-height:140px"><span aria-hidden="true" class="wp-block-cover__background has-contrast-background-color has-background-dim-20 has-background-dim"></span><div class="wp-block-cover__inner-container"><!-- wp:paragraph {"placeholder":"Write title…","style":{"typography":{"textAlign":"center"}},"fontSize":"large"} -->
<p class="has-text-align-center has-large-font-size"></p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:cover --></div>
<!-- /wp:column -->

<!-- wp:column {"verticalAlignment":"center"} -->
<div class="wp-block-column is-vertically-aligned-center"><!-- wp:group {"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:group {"style":{"spacing":{"blockGap":"10px"}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:post-terms {"term":"category","style":{"typography":{"fontSize":"12px","textTransform":"uppercase"}}} /-->

<!-- wp:post-title {"level":3,"isLink":true,"style":{"typography":{"fontSize":"20px"}}} /-->

<!-- wp:group {"className":"wens-prova-wrap","style":{"spacing":{"blockGap":"20px"},"elements":{"link":{"color":{"text":"#676767"}}},"color":{"text":"#676767"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"left","orientation":"horizontal"}} -->
<div class="wp-block-group wens-prova-wrap has-text-color has-link-color" style="color:#676767"><!-- wp:group {"style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"fontSize":"12px"}}} -->
<p style="font-size:12px"><?php echo __( 'By:', 'wens-press' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:post-author-name {"style":{"typography":{"fontSize":"12px"}}} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"fontSize":"12px"}}} -->
<p style="font-size:12px"><?php echo __( 'Date:', 'wens-press' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:post-date {"metadata":{"bindings":{"datetime":{"source":"core/post-data","args":{"field":"date"}}}},"style":{"typography":{"fontSize":"12px"}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:column --></div>
<!-- /wp:columns --></div>
<!-- /wp:group -->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:group --></div>
<!-- /wp:group -->