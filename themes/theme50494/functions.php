<?php
function scripts() {
if ( is_page(array('chat-room', 'chat-test')) ) {
	wp_enqueue_script('jquery-ui-core');
	wp_enqueue_script('jquery-effects-core');
	wp_enqueue_script('jquery-effects-highlight');
	wp_enqueue_script('jquery-ui-tabs');
	wp_enqueue_script('jquery-ui-dialog');
	wp_enqueue_style('jquery-ui-smoothness', 'https://code.jquery.com/ui/1.10.4/themes/smoothness/jquery-ui.css');
}
}
add_action( 'wp_print_scripts', 'scripts'); // now just run the function

add_filter('wspsc_product_box_thumbnail_code', 'wspsc_my_custom_thumbnail_code', 10, 2);
function wspsc_my_custom_thumbnail_code($img_code, $args)
{
    $thumbnail_src = $args['thumbnail'];
    $thumbnail_alt_src = $args['thumbnail_alt'];
    if (!$thumbnail_alt_src) {
	$thumbnail_alt_src = $thumbnail_src;
    }
    $img_code = '<img src="'.$thumbnail_src.'" alt="'.$args['name'].'" onmouseover="this.src=\''.$thumbnail_alt_src.'\'" onmouseout="this.src=\''.$thumbnail_src.'\'">';
    return $img_code;
}
