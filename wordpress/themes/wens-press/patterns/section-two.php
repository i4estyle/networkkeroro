<?php
/**
 * Title: Section Two
 * Slug: wens-press/section-two
 * Categories: wens-press
 *
 * @package WENS Press
 * @since 1.0.0
 */

?>

<!-- wp:group {"align":"wide","layout":{"type":"constrained"}} -->
<div class="wp-block-group alignwide"><!-- wp:heading {"align":"wide","style":{"typography":{"textTransform":"uppercase"}}} -->
<h2 class="wp-block-heading alignwide" style="text-transform:uppercase"><strong><?php echo __( 'Trending Now', 'wens-press' ); ?></strong></h2>
<!-- /wp:heading -->

<!-- wp:query {"queryId":54,"query":{"perPage":3,"pages":0,"offset":"","postType":"post","order":"desc","orderBy":"date","author":"","search":"","exclude":[],"sticky":"","inherit":false,"parents":[],"format":[]},"align":"wide"} -->
<div class="wp-block-query alignwide"><!-- wp:post-template {"style":{"spacing":{"blockGap":"var:preset|spacing|50","padding":{"top":"0","bottom":"0"}}},"layout":{"type":"grid","columnCount":3}} -->
<!-- wp:cover {"useFeaturedImage":true,"dimRatio":80,"isUserOverlayColor":true,"minHeight":320,"minHeightUnit":"px","customGradient":"linear-gradient(180deg,rgba(238,238,238,0) 34%,rgb(14,14,14) 100%)","style":{"spacing":{"padding":{"right":"16px","left":"16px","top":"16px","bottom":"16px"}},"border":{"radius":{"topLeft":"6px","topRight":"6px","bottomLeft":"6px","bottomRight":"6px"}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-cover" style="border-top-left-radius:6px;border-top-right-radius:6px;border-bottom-left-radius:6px;border-bottom-right-radius:6px;padding-top:16px;padding-right:16px;padding-bottom:16px;padding-left:16px;min-height:320px"><span aria-hidden="true" class="wp-block-cover__background has-background-dim-80 has-background-dim has-background-gradient" style="background:linear-gradient(180deg,rgba(238,238,238,0) 34%,rgb(14,14,14) 100%)"></span><div class="wp-block-cover__inner-container"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"4px","margin":{"top":"163px"}},"border":{"radius":"5px"}},"layout":{"type":"constrained","justifyContent":"left"}} -->
<div class="wp-block-group alignwide" style="border-radius:5px;margin-top:163px"><!-- wp:group {"align":"wide","style":{"spacing":{"blockGap":"8px"}},"layout":{"type":"flex","orientation":"vertical"}} -->
<div class="wp-block-group alignwide"><!-- wp:post-terms {"term":"category","className":"text-decoration-cat","style":{"typography":{"fontSize":"12px"},"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"spacing":{"padding":{"top":"4px","bottom":"4px","left":"8px","right":"8px"}},"border":{"radius":{"topLeft":"6px","topRight":"6px","bottomLeft":"6px","bottomRight":"6px"}}},"backgroundColor":"primary","textColor":"base"} /-->

<!-- wp:post-title {"textAlign":"left","isLink":true,"align":"wide","style":{"spacing":{"padding":{"top":"0px"}},"elements":{"link":{"color":{"text":"var:preset|color|base"}}},"typography":{"fontSize":"22px"}},"textColor":"base"} /-->

<!-- wp:group {"className":"wens-prova-wrap","style":{"spacing":{"blockGap":"20px"}},"layout":{"type":"flex","flexWrap":"wrap","justifyContent":"left","orientation":"horizontal"}} -->
<div class="wp-block-group wens-prova-wrap"><!-- wp:group {"style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"fontSize":"14px"}}} -->
<p style="font-size:14px"><?php echo __( 'By:', 'wens-press' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:post-author-name {"style":{"typography":{"fontSize":"14px"}}} /--></div>
<!-- /wp:group -->

<!-- wp:group {"style":{"spacing":{"blockGap":"6px"}},"layout":{"type":"flex","flexWrap":"nowrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"style":{"typography":{"fontSize":"14px"}}} -->
<p style="font-size:14px"><?php echo __( 'Date:', 'wens-press' ); ?></p>
<!-- /wp:paragraph -->

<!-- wp:post-date {"metadata":{"bindings":{"datetime":{"source":"core/post-data","args":{"field":"date"}}}},"style":{"typography":{"fontSize":"14px"}}} /--></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div>
<!-- /wp:group --></div></div>
<!-- /wp:cover -->
<!-- /wp:post-template --></div>
<!-- /wp:query --></div>
<!-- /wp:group -->