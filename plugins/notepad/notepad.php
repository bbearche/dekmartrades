<?php
/**
 * Plugin Name: Dekmartrades Notepad
 * Description: Displays a live notepad powered by Etherpad
 * Version: 1.0.0
 * Author: Evan Graham
 * Author URI: http://luakt.net
 * License: GPL2
 */

global $notepad_db_version;
$notepad_db_version = '1.0';
define( 'NOTEPAD_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

function notepad_install() {
    /*global $wpdb;

    $table_name = $wpdb->prefix . "notepad";

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE $table_name (
	id int NOT NULL AUTO_INCREMENT,
        user_name VARCHAR(80) NOT NULL,
        stars tinyint(3) DEFAULT '0',
        PRIMARY KEY (user_name)
    ) $charset_collate;";

    require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
    dbDelta($sql);
    */

    add_option('notepad_db_version', $notepad_db_version);

}


function notepad_setup_menu() {
    add_menu_page( 'Notepad', 'Notepad', 'manage_options', 'notepad', 'notepad_options_page' );

}

function notepad_init() {
    register_setting( 'notepad_options', 'notepad_options', 'notepad_options_validate' );

}


function notepad_options_page() {
?>
<div>
<iframe style="overflow: hidden; height: 700px; width: 98%; position: absolute;" name="embed_readwrite" src="http://dekmartrades.com:8888/p/RUtql2T3LB?showControls=true&showChat=true&showLineNumbers=true&useMonospaceFont=false" width=100% height=100%></iframe>
    <!--<iframe id='iframe2' src="/wp-content/plugins/top-traders/admin.php" frameborder="0" style="overflow: hidden; height: 100%;
        width: 100%; position: absolute;" height="100%" width="100%"></iframe>-->
</div>
<?php
}




register_activation_hook( __FILE__, 'notepad_install' );
add_action('admin_init', 'notepad_init');
add_action('admin_menu', 'notepad_setup_menu');


include_once('notepad-shortcode.php');
function chatroom_add_to_footer() {
    add_action('wp_footer', 'notepad_embed_shortcode');
}

add_shortcode('notepad_embed', 'notepad_embed_shortcode');
//add_action('chatrooms_page', 'chatroom_add_to_footer');

/*include_once('alert-box-shortcode.php');
include_once('alert-box-audit-shortcode.php');
include_once('alert-box-percent-shortcode.php');
include_once('alert-box-percent-monthly-shortcode.php');
add_shortcode('stock_alert', 'stock_alert_embed_shortcode');
add_shortcode('stock_alert_audit', 'stock_alert_audit_shortcode');
add_shortcode('stock_alert_percent', 'stock_alert_percent_shortcode');
add_shortcode('stock_alert_percent_monthly', 'stock_alert_percent_monthly_shortcode');
*/
