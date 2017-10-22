<?php
define( 'SHORTINIT', true );
$location = $_SERVER['DOCUMENT_ROOT'];
require_once($location . '/wp-load.php');
//require_once('LiveStream.php');

function livestream_commentary() {
    $options = get_option('live_stream_options');
    $live_commentary = $options['live_commentary'];

    return $live_commentary;
}
