<?php
include_once('util.php');
include_once('functions.php');
function stock_alert_percent_shortcode() {
ob_start();
global $wpdb;

echo stockalert_get_success_percentage();

$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
