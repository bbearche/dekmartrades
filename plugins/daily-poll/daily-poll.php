<?php
/**
 * Plugin Name: Dekmartrades Daily Poll
 * Description: Displays a poll with option for custom message and hiding results
 * Version: 1.0.0
 * Author: Evan Graham
 * Author URI: http://luakt.net
 * License: GPL2
 */

global $daily_poll_db_version;
$daily_poll_db_version = '1.0';
define( 'daily_poll_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

function daily_poll_install() {
    global $wpdb;

    //$table_name_prefix = $wpdb->prefix . "daily_poll";

    $charset_collate = $wpdb->get_charset_collate();

    $poll_table = "CREATE TABLE " . $wpdb->prefix . "daily_poll_polls (
	    id int(11) NOT NULL AUTO_INCREMENT,
        name VARCHAR(250) NOT NULL,
        display_results tinyint(3) DEFAULT '0' NOT NULL,
        PRIMARY KEY (id)
    ) $charset_collate;
        INSERT INTO " . $wpdb->prefix ."daily_poll_polls(name) VALUES ('Default');";

    $choices_table = "CREATE TABLE " . $wpdb->prefix . "daily_poll_choices (
	    id int(11) NOT NULL AUTO_INCREMENT,
        poll_id int(11) NOT NULL,
        name VARCHAR(100) NOT NULL,
        PRIMARY KEY (id)
    ) $charset_collate;
        INSERT INTO " . $wpdb->prefix ."daily_poll_choices(poll_id, name) VALUES (1, '');
        INSERT INTO " . $wpdb->prefix ."daily_poll_choices(poll_id, name) VALUES (1, '');
        INSERT INTO " . $wpdb->prefix ."daily_poll_choices(poll_id, name) VALUES (1, '');
        INSERT INTO " . $wpdb->prefix ."daily_poll_choices(poll_id, name) VALUES (1, '');
        INSERT INTO " . $wpdb->prefix ."daily_poll_choices(poll_id, name) VALUES (1, '');";

    $votes_table = "CREATE TABLE " . $wpdb->prefix . "daily_poll_votes (
	    id int NOT NULL AUTO_INCREMENT,
        poll_id int(11) NOT NULL,
        user_id int(5) NOT NULL,
        choice int(11) NOT NULL,
        reason VARCHAR(500) DEFAULT '',
        PRIMARY KEY (id)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta($poll_table);
    dbDelta($choices_table);
    dbDelta($votes_table);

    add_option('daily_poll_db_version', $daily_poll_db_version);

}


function daily_poll_setup_menu() {
    add_menu_page( 'Daily Poll Options', 'Daily Poll', 'manage_options', 'daily-poll', 'daily_poll_options_page' );

}

function daily_poll_init() {
    register_setting( 'daily_poll_options', 'daily_poll_options', 'daily_poll_options_validate' );

}


function daily_poll_options_page() {
?>
<div>
<iframe id='iframe2' src="<?=site_url();?>/wp-content/plugins/daily-poll/admin.php" frameborder="0" style="overflow: hidden; height: 100%;
        width: 100%; position: absolute;" height="100%" width="100%"></iframe>
</div>
<?php
}




register_activation_hook( __FILE__, 'daily_poll_install' );
add_action('admin_init', 'daily_poll_init');
add_action('admin_menu', 'daily_poll_setup_menu');

include_once('daily_poll_shortcode.php');
add_shortcode('daily-poll', 'daily_poll_shortcode');

/*include_once('alert-box-shortcode.php');
include_once('alert-box-audit-shortcode.php');
include_once('alert-box-percent-shortcode.php');
include_once('alert-box-percent-monthly-shortcode.php');
add_shortcode('stock_alert', 'stock_alert_embed_shortcode');
add_shortcode('stock_alert_audit', 'stock_alert_audit_shortcode');
add_shortcode('stock_alert_percent', 'stock_alert_percent_shortcode');
add_shortcode('stock_alert_percent_monthly', 'stock_alert_percent_monthly_shortcode');
*/
