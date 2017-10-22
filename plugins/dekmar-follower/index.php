<?php
/*
Plugin Name: DekmarTrades Follower
Plugin URI: http://www.staygrind.com
Description: Allow users to follow and un-follow eachother giving them the filtering ability to control who shows up in their 'Followers' Chat Feed for each chat-room. 
Author: Jon Hendershot
Version: 1.0
Author URI: http://www.staygrind.com
*/


function dekmar_follow_activate(){
	
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'dt_follow';
	
	if( $wpdb->get_var('SHOW TABLES LIKE ' . $table_name) != $table_name){
		
		$sql = 'CREATE TABLE ' . $table_name . '(
			id INTEGER(10) UNSIGNED AUTO_INCREMENT,
			user_name VARCHAR(80),
			following VARCHAR(80),
			PRIMARY KEY (id) )';
			
		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}
}

register_activation_hook(__FILE__, 'dekmar_follow_activate');



?>