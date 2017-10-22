<?php
$path = $_SERVER['DOCUMENT_ROOT'];
define( 'SHORTINIT', true );
require_once('../../../wp-load.php');

function chatmute_mute_user($username, $length = 0) {
    global $wpdb;
    $type = 0; // Mute forever
    if ($length != 0) {
        $type = 1;
    }
    $cur_time = current_time('timestamp');
    $timeout = $cur_time + ($length * 60);
    //$timeout = date("Y-m-d H:i:s", strtotime('+' . $length . 'hours'));
    $timeout = new DateTime('@'.$timeout);
    $timeout->setTimeZone(new DateTimeZone(wp_get_timezone_string())); 
    $timeout = $timeout->format("Y-m-d H:i:s");

    $results = $wpdb->replace(
        $wpdb->prefix . 'chatmute',
        array(
            'user_name' => $username,
            'time' => current_time('mysql'),
            'timeout' => $timeout,
            'type' => $type
        ),
        array (
            '%s',
            '%s',
            '%s',
            '%d'
        )
    );


}

function chatmute_unmute_user($username) {
    global $wpdb;
    $results = $wpdb->delete(
        $wpdb->prefix . 'chatmute',
        array(
            'user_name' => $username
        )
    );

}

function chatmute_get_mutes() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "chatmute
        "
    );

    return $results;
}

function chatmute_get_mute_names() {
    global $wpdb;
    $results = $wpdb->get_col(
        "
        SELECT user_name
        FROM " . $wpdb->prefix . "chatmute
        "
    );

    return $results;
}
