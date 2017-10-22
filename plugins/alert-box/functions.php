<?php
define( 'SHORTINIT', true );
$location = $_SERVER['DOCUMENT_ROOT'];
require_once($location . '/wp-load.php');
date_default_timezone_set("America/New_York");


function stockalert_add_alert($stock, $position, $entry_price, $stop_loss, $exit_price) {
    global $wpdb;
    $current_user = wp_get_current_user();

    $results = $wpdb->insert(
	$wpdb->prefix . 'stockalert',
	array(
            'user_name' => $current_user->user_login,
	    'time' => current_time('mysql'),
	    'expired' => 0,
	    'highlight' => 0,
	    'stock' => $stock,
	    'position' => $position,
	    'entry_price' => $entry_price,
	    'stop_loss' => $stop_loss,
	    'exit_price' => $exit_price
	),
	array(
	    '%s',
	    '%s',
	    '%d',
	    '%d',
	    '%s',
	    '%s',
	    '%f',
	    '%f',
	    '%f'
	)
    );

}

function stockalert_add_alert_audit($user_name, $time, $verdict, $stock, $position, $entry_price, $stop_loss, $exit_price) {
    global $wpdb;

    $results = $wpdb->insert(
	$wpdb->prefix . 'stockalert_audit',
	array(
            'user_name' => $user_name,
	    'time' => $time,
	    'verdict' => $verdict,
	    'stock' => $stock,
	    'position' => $position,
	    'entry_price' => $entry_price,
	    'stop_loss' => $stop_loss,
	    'exit_price' => $exit_price
	),
	array(
	    '%s',
	    '%s',
	    '%d',
	    '%s',
	    '%s',
	    '%f',
	    '%f',
	    '%f'
	)
    );

}

function stockalert_remove_alert($id) {
    global $wpdb;
    $results = $wpdb->delete(
        $wpdb->prefix . 'stockalert',
        array( // Where
            'id' => $id
        )
    );
}
function stockalert_remove_audit_alert($id) {
    global $wpdb;
    $results = $wpdb->delete(
        $wpdb->prefix . 'stockalert_audit',
        array( // Where
            'id' => $id
        )
    );
}
function stockalert_expire_alert($id, $verdict) {
    global $wpdb;
    $alert_table = $wpdb->prefix . 'stockalert';
    $alert = $wpdb->get_row("SELECT * FROM $alert_table WHERE id = $id");
    stockalert_add_alert_audit($alert->user_name, $alert->time, $verdict, $alert->stock, $alert->position, $alert->entry_price, $alert->stop_loss, $alert->exit_price);

    $results = $wpdb->update(
        $wpdb->prefix . 'stockalert',
	array( //Data
	    'expired' => '1',
	    'verdict' => $verdict
	),
        array( // Where
            'id' => $id
        ),
	array( // Format
	    '%d',
	    '%d'
	),
	array( // Where format
	    '%d'
	)
    );

}
function stockalert_highlight_alert($id) {
    global $wpdb;
    $results = $wpdb->update(
        $wpdb->prefix . 'stockalert',
	array( //Data
	    'highlight' => '1'
	),
        array( // Where
            'id' => $id
        ),
	array( // Format
	    '%d'
	),
	array( // Where format
	    '%d'
	)
    );

}
function stockalert_stop_highlight_alert($id) {
    global $wpdb;
    $results = $wpdb->update(
        $wpdb->prefix . 'stockalert',
	array( //Data
	    'highlight' => '0'
	),
        array( // Where
            'id' => $id
        ),
	array( // Format
	    '%d'
	),
	array( // Where format
	    '%d'
	)
    );

}
function stockalert_get_alerts() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "stockalert ORDER BY expired ASC, time DESC LIMIT 20"
    );
    return $results;
}
function stockalert_get_audit() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "stockalert_audit ORDER BY time DESC"
    );

    return $results;
}
function stockalert_get_success_percentage() {
    global $wpdb;
    $table_name = $wpdb->prefix . "stockalert_audit";
    $success_percent = $wpdb->get_var("SELECT  count(*) / (SELECT count(*) from " . $table_name  . ") * 100 as percentage from " . $table_name ." where verdict = 1 group by verdict");
    return round($success_percent);
}
function stockalert_get_success_percentage_monthly() {
    global $wpdb;
    $table_name = $wpdb->prefix . "stockalert_audit";
    $success_percent = $wpdb->get_var("SELECT  count(*) / (SELECT count(*) from " . $table_name  . " WHERE time BETWEEN NOW() - INTERVAL 30 day and NOW()) * 100 as percentage from " . $table_name ." where verdict = 1 AND time BETWEEN NOW() - INTERVAL 30 day and NOW() group by verdict");
    return round($success_percent);
}
