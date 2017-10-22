<?php
/**
 * Plugin Name: Dekmartrades Alert Box
 * Description: Displays stock alerts
 * Version: 1.5.0
 * Author: Evan Graham
 * Author URI: http://luakt.net
 * License: GPL2
 */

global $stockalert_db_version;
$stockalert_db_version = '1.5';

function stockalert_install() {
    global $wpdb;

    $table_name = $wpdb->prefix . "stockalert";
    $audit_table_name = $wpdb->prefix . "stockalert_audit";

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
	id int NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(80) NOT NULL,
        time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
	expired BOOLEAN DEFAULT '0' NOT NULL,
	highlight BOOLEAN DEFAULT '0' NOT NULL,
	stock VARCHAR(5) NOT NULL,
	position VARCHAR(5) NOT NULL,
        entry_price decimal(9, 3) DEFAULT '0',
        stop_loss decimal(9, 3) DEFAULT '0',
        exit_price decimal(9, 3) DEFAULT '0',
        PRIMARY KEY (id)
    ) $charset_collate;";

    $audit_sql = "CREATE TABLE $audit_table_name (
	id int NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(80) NOT NULL,
        time datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
	verdict BOOLEAN DEFAULT '0' NOT NULL,
	stock VARCHAR(5) NOT NULL,
	position VARCHAR(5) NOT NULL,
        entry_price decimal(9, 3) DEFAULT '0',
        stop_loss decimal(9, 3) DEFAULT '0',
        exit_price decimal(9, 3) DEFAULT '0',
        PRIMARY KEY (id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta($sql);
    dbDelta($audit_sql);

    add_option('stockalert_db_version', $stockalert_db_version);

}

function alert_create_schedule() {
    wp_schedule_event(time(), 'daily', 'alert_daily_cleanup');
}

function alert_delete_schedule() {
	wp_clear_scheduled_hook('alert_cleanup');
}

add_action('alert_daily_cleanup', 'alert_cleanup');

function alert_cleanup() {
    global $wpdb;
    $table_name = $wpdb->prefix . "stockalert";
    $wpdb->query("DELETE FROM $table_name WHERE DATEDIFF(now(), `time`) > 1;");
}
register_deactivation_hook(__FILE__, 'alert_delete_schedule');

register_activation_hook( __FILE__, 'stockalert_install' );
register_activation_hook( __FILE__, 'alert_create_schedule' );
include_once('alert-box-shortcode.php');
include_once('alert-box-audit-shortcode.php');
include_once('alert-box-percent-shortcode.php');
include_once('alert-box-percent-monthly-shortcode.php');
add_shortcode('stock_alert', 'stock_alert_embed_shortcode');
add_shortcode('stock_alert_scripts', 'stock_alert_embed_shortcode_scripts');
add_shortcode('stock_alert_audit', 'stock_alert_audit_shortcode');
add_shortcode('stock_alert_percent', 'stock_alert_percent_shortcode');
add_shortcode('stock_alert_percent_monthly', 'stock_alert_percent_monthly_shortcode');

