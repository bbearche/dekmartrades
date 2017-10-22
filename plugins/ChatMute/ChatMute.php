<?php
/**
 * Plugin Name: Dekmartrades Chat Mute
 * Description: Allows the muting of specific users in an iFlyChat chatroom.
 * Version: 1.0.0
 * Author: Evan Graham
 * Author URI: http://luakt.net
 * License: GPL2
 */

global $chatmute_db_version;
$chatmute_db_version = '1.0';

function chatmute_install() {
    global $wpdb;

    $table_name = $wpdb->prefix . "chatmute";

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
        user_name VARCHAR(80),
        time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        timeout datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
        type tinyint(2) DEFAULT '0',
        UNIQUE KEY user_name (user_name)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta($sql);

    add_option('chatmute_db_version', $chatmute_db_version);

}

register_activation_hook( __FILE__, 'chatmute_install' );


