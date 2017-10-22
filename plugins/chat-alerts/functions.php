<?php
define( 'SHORTINIT', true );
$location = $_SERVER['DOCUMENT_ROOT'];
require_once($location . '/wp-load.php');


function top_traders_add_user($username) {
    global $wpdb;

    $results = $wpdb->insert(
	$wpdb->prefix . 'top_traders',
	array(
            'user_name' => $username,
	),
	array(
	    '%s',
	)
    );

}

function top_traders_set_stars($username, $stars) {
    global $wpdb;

    $results = $wpdb->update(
        $wpdb->prefix . 'top_traders',
	array( //Data
	    'stars' => $stars,
	),
        array( // Where
            'user_name' => $username
        ),
	array( // Format
	    '%d'
	),
	array( // Where format
	    '%s'
	)
    );

}

function top_traders_add_star($username) {
    global $wpdb;
    //Check if in db
    $check = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "top_traders WHERE user_name = '$username'", ARRAY_A);
    if (!$check) {
	top_traders_add_user($username);
    }
    $star_count = $check['stars'];
    $results = $wpdb->update(
        $wpdb->prefix . 'top_traders',
	array( //Data
	    'stars' => (int) $star_count+1,
	),
        array( // Where
            'user_name' => $username
        ),
	array( // Format
	    '%d'
	),
	array( // Where format
	    '%s'
	)
    );
    top_traders_star_notify($username);

}

function top_traders_star_notify($username) {

    $args = array(
        'sender_id' => 10,
        'thread_id' => false,
        'recipients' => $username,
        'subject' => 'You have received a star!',
        'content' => 'You have received a star!',
        'date_sent' => bp_core_current_time()
    );
    $result = messages_new_message( $args );


}
function top_traders_get_users() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "top_traders ORDER BY stars DESC"
    );

    return $results;
}

function top_traders_get_top_10() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "top_traders WHERE stars > 0 ORDER BY stars DESC LIMIT 5"
    );
    return $results;
}

