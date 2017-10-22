<?php
/**
 * Plugin Name: Buddypress SWMP Profile Settings
 * Description: Displays SWMP settings on the buddypress profile
 * Version: 1.0.0
 * Author: Evan Graham
 * Author URI: http://luakt.net
 * License: GPL2
 */

global $bp_swmp_profile_db_version;
$bp_swmp_profile_db_version = '1.0';
define( 'BP_SWMP_PROFILE_PLUGIN_PATH', plugin_dir_path( __FILE__ ) );

function bp_swmp_profile_install() {
    add_option('bp_swmp_profile_db_version', $bp_swmp_profile_db_version);

}



function add_profile_tabs() {
	global $bp;
	
	bp_core_new_nav_item( array(
		'name'                  => 'Settings',
		'slug'                  => 'settings',
		'parent_url'            => $bp->displayed_user->domain,
		'parent_slug'           => $bp->profile->slug,
		'screen_function'       => 'settings_screen',			
		'position'              => 200,
		'default_subnav_slug'   => 'settings'
	) );
	bp_core_new_nav_item( array(
		'name'                  => 'Subscription',
		'slug'                  => 'subscription',
		'parent_url'            => $bp->displayed_user->domain,
		'parent_slug'           => $bp->profile->slug,
		'screen_function'       => 'subscription_screen',			
		'position'              => 200,
		'default_subnav_slug'   => 'subscription'
	) );
		

}
add_action( 'bp_setup_nav', 'add_profile_tabs', 100 );



function settings_screen() {
    add_action( 'bp_template_title', 'settings_screen_title' );
    add_action( 'bp_template_content', 'settings_screen_content' );
    bp_core_load_template( apply_filters( 'bp_core_template_plugin', 'members/single/plugins' ) );
}
function settings_screen_title() { 
	echo 'Settings<br/>';
}
function settings_screen_content() { 
	echo '<meta http-equiv="refresh" content="0; url=//dekmartrades.com/membership-login/membership-profile" />';
}

function subscription_screen() {
    add_action( 'bp_template_title', 'subscription_screen_title' );
    add_action( 'bp_template_content', 'subscription_screen_content' );
    bp_core_load_template( apply_filters( 'bp_core_template_plugin', 'members/single/plugins' ) );
}
function subscription_screen_title() { 
	echo 'Subscription<br/>';
}
function subscription_screen_content() { 
	//echo 'Subscription';
	$member = SwpmMemberUtils::get_logged_in_members_id();
	$subscr_id = SwpmMemberUtils::get_member_field_by_id(member, 'subscr_id');
	require($_SERVER['DOCUMENT_ROOT'] . '/../paypal_config.php');
	echo "<!--" . $pp_merchant_id . "-->";
?>
<a href="https://www.paypal.com/cgi-bin/webscr?cmd=_subscr-find&alias=4BD4ECG62A6CE">
	<img src="https://www.paypalobjects.com/en_US/i/btn/btn_unsubscribe_LG.gif" BORDER="0">
</a>
<?
}



register_activation_hook( __FILE__, 'bp_swmp_profile_install' );
