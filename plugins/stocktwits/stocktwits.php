<?php
/**
 * Plugin Name: Dekmartrades Stock Twits
 * Description: Allows users to specify stocks to track using the StockTwits service.
 * Version: 1.0.0
 * Author: Evan Graham
 * Author URI: http://luakt.net
 * License: GPL2
 */

global $stocktwits_db_version;
$stocktwits_db_version = '1.0';
define( 'STOCKTWITS_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

function stocktwits_install() {
/*    global $wpdb;

    $table_name = $wpdb->prefix . "stocktwits";

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
	id int NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(80) NOT NULL,
        stars tinyint(3) DEFAULT '0',
        PRIMARY KEY (user_name)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta($sql);

    add_option('stocktwits_db_version', $stocktwits_db_version);
*/
}


function stocktwits_setup_menu() {
    add_menu_page( 'Top Traders Options', 'Top Traders', 'manage_options', 'top-traders', 'stocktwits_options_page' );

}

function stocktwits_init() {
    register_setting( 'stocktwits_options', 'stocktwits_options', 'stocktwits_options_validate' );

}


function stocktwits_options_page() {
?>
<div>
    <iframe id='iframe2' src="/wp-content/plugins/top-traders/admin.php" frameborder="0" style="overflow: hidden; height: 100%;
        width: 100%; position: absolute;" height="100%" width="100%"></iframe>
</div>
<?php
}




register_activation_hook( __FILE__, 'stocktwits_install' );
//add_action('admin_init', 'stocktwits_init');
//add_action('admin_menu', 'stocktwits_setup_menu');

include_once('stocktwits-shortcode.php');
add_shortcode('stocktwits-feed', 'stocktwits_embed_shortcode');

/*include_once('alert-box-shortcode.php');
include_once('alert-box-audit-shortcode.php');
include_once('alert-box-percent-shortcode.php');
include_once('alert-box-percent-monthly-shortcode.php');
add_shortcode('stock_alert', 'stock_alert_embed_shortcode');
add_shortcode('stock_alert_audit', 'stock_alert_audit_shortcode');
add_shortcode('stock_alert_percent', 'stock_alert_percent_shortcode');
add_shortcode('stock_alert_percent_monthly', 'stock_alert_percent_monthly_shortcode');
*/
