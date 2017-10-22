<?php
$location = $_SERVER['DOCUMENT_ROOT'];
require_once($location . '/wp-load.php');

function notepad_check_chat_admin() {
  $location = $_SERVER['DOCUMENT_ROOT'];
  require_once($location . '/wp-config.php');
  $current_user = wp_get_current_user();
  if(current_user_can('activate_plugins')) {
    return TRUE;
  }
  $a = iflychat_get_option('iflychat_chat_admins_array');
  if(!empty($a) && ($current_user->ID)) {
    $a_names = explode(",", $a);
    foreach($a_names as $an) {
      $aa = trim($an);
      if($aa == $current_user->user_login) {
        return TRUE;
        break;
      }
    }
  }
  return FALSE;
}
?>
