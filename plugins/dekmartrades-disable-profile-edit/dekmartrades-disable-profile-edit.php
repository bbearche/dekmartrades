<?php
/*
Plugin Name: Dekmartrades Disable User Profile Edit
Description: Prevents users from editing their own profiles.
Version: 1.0.0
Author: Evan Graham
*/
add_action( 'wp_before_admin_bar_render', 'rpa_profile_adminbar_remove' );
add_action( 'load-profile.php', 'rpa_profile_banned_check' );
add_action( 'load-index.php', 'rpa_profile_banned_msg' );
add_action( 'all_admin_notices', 'rpa_profile_banned_msg' );

function rpa_profile_adminbar_remove() {
  $remove = get_user_meta( get_current_user_id(), '_profile_banned', TRUE );
  if ( (int) $remove !== 1 || current_user_can( 'edit_users' ) ) return;
  global $wp_admin_bar;
  $account = (array) $wp_admin_bar->get_node('my-account');
  $info = (array) $wp_admin_bar->get_node('user-info');
  $logout = (array) $wp_admin_bar->get_node('logout');
  $account['href'] = $info['href'] = '#';
  $wp_admin_bar->remove_node('my-account');
  $wp_admin_bar->remove_node('user-info');
  $wp_admin_bar->remove_node('edit-profile');
  $wp_admin_bar->remove_node('logout');
  $wp_admin_bar->add_node($account);
  $wp_admin_bar->add_node($info);
  $wp_admin_bar->add_node($logout);
}

function rpa_profile_banned_check() {
  if (!current_user_can( 'edit_users' ) ) {
    wp_redirect( add_query_arg( array( 'pbanned' => 1), admin_url('index.php') ) );
    exit();
  }
}

function rpa_profile_banned_msg() {
  if ( current_user_can( 'edit_users' ) ) return;
  static $show = false;
  if ( current_filter() === 'all_admin_notices' ) {
    echo '<div class="error"><p>Sorry, you are not allowed to edit your profile.</p></div>';
  }
}
