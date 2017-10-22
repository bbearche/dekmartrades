<?php
/**
 * Plugin Name: Dekmartrades Chat Alerts
 * Description: Displays DekmarTrades chat alerts in seperate chat box.
 * Version: 1.0.0
 * Author: Evan Graham
 * Author URI: http://luakt.net
 * License: GPL2
 */

efine( 'CHAT_ALERTS_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

function chat_alerts_install() {
    //global $wpdb;

    //$table_name = $wpdb->prefix . "chat_alerts";

    //$charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
	id int NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(80) NOT NULL,
        stars tinyint(3) DEFAULT '0',
        PRIMARY KEY (user_name)
    ) $charset_collate;";

    //require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    //dbDelta($sql);

    //add_option('chat_alerts_db_version', $chat_alerts_db_version);

}


function chat_alerts_setup_menu() {
    add_menu_page( 'Top Traders Options', 'Top Traders', 'manage_options', 'chat-alerts', 'chat_alerts_options_page' );

}

function chat_alerts_init() {
    register_setting( 'chat_alerts_options', 'chat_alerts_options', 'chat_alerts_options_validate' );

}


function chat_alerts_options_page() {
?>
<div>
    <iframe id='iframe2' src="/wp-content/plugins/chat-alerts/admin.php" frameborder="0" style="overflow: hidden; height: 100%;
        width: 100%; position: absolute;" height="100%" width="100%"></iframe>
</div>
<?php
}




//register_activation_hook( __FILE__, 'chat_alerts_install' );
//add_action('admin_init', 'chat_alerts_init');
//add_action('admin_menu', 'chat_alerts_setup_menu');

include_once('chat-alerts-shortcode.php');
add_shortcode('chat-alerts', 'chat_alerts_embed_shortcode');

/*include_once('alert-box-shortcode.php');
include_once('alert-box-audit-shortcode.php');
include_once('alert-box-percent-shortcode.php');
include_once('alert-box-percent-monthly-shortcode.php');
add_shortcode('stock_alert', 'stock_alert_embed_shortcode');
add_shortcode('stock_alert_audit', 'stock_alert_audit_shortcode');
add_shortcode('stock_alert_percent', 'stock_alert_percent_shortcode');
add_shortcode('stock_alert_percent_monthly', 'stock_alert_percent_monthly_shortcode');
*/
