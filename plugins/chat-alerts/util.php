<?php
$location = $_SERVER['DOCUMENT_ROOT'];
require_once($location . '/wp-load.php');

function top_traders_check_chat_admin() {
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
/**
 * Returns the timezone string for a site, even if it's set to a UTC offset
 *
 * Adapted from http://www.php.net/manual/en/function.timezone-name-from-abbr.php#89155
 *
 * @return string valid PHP timezone string
 */
function wp_get_timezone_string() {
 
    // if site timezone string exists, return it
    if ( $timezone = get_option( 'timezone_string' ) )
        return $timezone;
 
    // get UTC offset, if it isn't set then return UTC
    if ( 0 === ( $utc_offset = get_option( 'gmt_offset', 0 ) ) )
        return 'UTC';
 
    // adjust UTC offset from hours to seconds
    $utc_offset *= 3600;
 
    // attempt to guess the timezone string from the UTC offset
    if ( $timezone = timezone_name_from_abbr( '', $utc_offset, 0 ) ) {
        return $timezone;
    }
 
    // last try, guess timezone string manually
    $is_dst = date( 'I' );
 
    foreach ( timezone_abbreviations_list() as $abbr ) {
        foreach ( $abbr as $city ) {
            if ( $city['dst'] == $is_dst && $city['offset'] == $utc_offset )
                return $city['timezone_id'];
        }
    }
     
    // fallback to UTC
    return 'UTC';
}
