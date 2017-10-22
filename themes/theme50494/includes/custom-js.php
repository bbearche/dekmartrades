<?php
add_action( 'wp_enqueue_scripts', 'custom_scripts' );

function custom_scripts() {
	wp_enqueue_script( 'parallaxSlider', get_stylesheet_directory_uri() . '/js/parallaxSlider.js', array('jquery'), '1.0' );
    wp_enqueue_script( 'wpcf7', get_stylesheet_directory_uri() . '/js/wpcf7.js', array('jquery'), '1.0' );
    wp_enqueue_script( 'chrome-smoothing-scroll', get_stylesheet_directory_uri() . '/js/smoothing-scroll.js', array('jquery'), '1.0', true );
} ?>