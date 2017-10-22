<?php
define( 'SHORTINIT', true );
$location = $_SERVER['DOCUMENT_ROOT'];
 
$parse_uri = explode( 'wp-content', $_SERVER['SCRIPT_FILENAME'] );
//require_once( $parse_uri[0] . 'wp-load.php' );
 

function user_logged_in() {
    $logged_in = is_user_logged_in();
    return $logged_in;
}
function allowed_to_vote($userid) {
    //return true; //DEBUG
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT user_id
        FROM " . $wpdb->prefix . "daily_poll_votes WHERE user_id = '". $userid . "'"
    );
    if (count ($results) > 0) {
        return false;
    } else {
        return true;
    }

}
function daily_poll_display_results($poll_id) {
    global $wpdb;
    $current_status = $wpdb->get_var("SELECT display_results FROM " . $wpdb->prefix . "daily_poll_polls WHERE id = " . $poll_id);

    return ($current_status == 0)? false : true;
}

function daily_poll_get_poll_choice_percentage($poll_id, $choice) {
    global $wpdb;
    $success_percent = $wpdb->get_var("SELECT  count(*) / (SELECT count(*) from " . $wpdb->prefix. "daily_poll_votes) * 100 as percentage from " . $wpdb->prefix. "daily_poll_votes where poll_id = " . $poll_id . " AND choice = " . $choice . " group by choice");

    return round($success_percent);
}
function daily_poll_add_poll($name) {
    global $wpdb;

    $results = $wpdb->insert(
        $wpdb->prefix . 'daily_poll_polls',
        array(
                'name' => esc_html($name),
        ),
        array(
            '%s'
        )
    );

}

function daily_poll_add_vote($poll_id, $choice, $reason) {
    global $wpdb;

    $current_user = get_current_user_id();

    if (is_user_logged_in() && allowed_to_vote($current_user)) {
        $results = $wpdb->insert(
            $wpdb->prefix . 'daily_poll_votes',
            array(
                    'poll_id' => $poll_id,
                    'user_id' => $current_user,
                    'choice' => esc_html($choice),
                    'reason' => esc_html($reason),
            ),
            array(
                '%d',
                '%d',
                '%d',
                '%s'
            )
        );
    }

}
function daily_poll_reset_results($poll_id) {
    global $wpdb;

    $results = $wpdb->delete(
        $wpdb->prefix . 'daily_poll_votes',
        array(
                'poll_id' => $poll_id,
        )
    );

}

function daily_poll_get_choice_by_id($id) {
    global $wpdb;
    return $wpdb->get_var("SELECT name FROM " . $wpdb->prefix . "daily_poll_choices WHERE id = " . $id);

}
function daily_poll_get_results_admin($poll_id) {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "daily_poll_votes WHERE poll_id = " . $poll_id
    );

    return $results;
}
function daily_poll_get_result_counts($poll_id) {
    global $wpdb;
    if (daily_poll_display_results($poll_id)) {
        $results = $wpdb->get_results(
            "
            SELECT choice, COUNT(*) as count
            FROM " . $wpdb->prefix . "daily_poll_votes WHERE poll_id = " . $poll_id . " GROUP BY choice", ARRAY_A
        );

        return $results;
    } else {
        return [];
    }
}
function daily_poll_get_results($poll_id) {
    global $wpdb;
    if (daily_poll_display_results($poll_id)) {
        $results = $wpdb->get_results(
            "
            SELECT *
            FROM " . $wpdb->prefix . "daily_poll_votes WHERE poll_id = " . $poll_id
        );

        return $results;
    } else {
        return [];
    }
}
function daily_poll_get_choices($poll_id) {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "daily_poll_choices WHERE poll_id = ". $poll_id, ARRAY_A
    );

    return $results;
}
function daily_poll_get_polls() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "daily_poll_polls"
    );

    return $results;
}
function daily_poll_toggle_results_visible($poll_id) {
    global $wpdb;
    $current_status = $wpdb->get_var("SELECT display_results FROM " . $wpdb->prefix . "daily_poll_polls WHERE id = " . $poll_id);
    $new_status = ($current_status == 0) ? 1 : 0;

    $results = $wpdb->update(
    $wpdb->prefix . 'daily_poll_polls',
        array( //Data
            'display_results' => $new_status,
        ),
        array( // Where
            'id' => $poll_id
        ),
        array( // Format
            '%d'
        ),
        array( // Where format
            '%d'
        )
    );

}
function daily_poll_set_choices($poll_id, $data) {
    global $wpdb;
    $datad = json_decode(stripslashes($data), true);

    foreach ($datad as $key => $value) {
        $results = $wpdb->update(
            $wpdb->prefix . 'daily_poll_choices',
                array( //Data
                    'name' => $value["value"],
                ),
                array( // Where
                    'id' => $value['name'],
                    'poll_id' => $poll_id
                ),
                array( // Format
                    '%s'
                ),
                array( // Where format
                    '%d'
            )
        );
    }

}
function daily_poll_set_name($poll_id, $name) {
    global $wpdb;
    $results = $wpdb->update(
    $wpdb->prefix . 'daily_poll_polls',
        array( //Data
            'name' => $name,
        ),
        array( // Where
            'poll_id' => $poll_id
        ),
        array( // Format
            '%s'
        ),
        array( // Where format
            '%d'
        )
    );

}
function daily_poll_add_choice($poll_id, $choice) {
    global $wpdb;

    $results = $wpdb->insert(
        $wpdb->prefix . 'daily_poll_choices',
        array(
                'poll_id' => $poll_id,
                'name' => $choice,
        ),
        array(
            '%d',
            '%s'
        )
    );

}

function daily_poll_set_stars($username, $stars) {
    global $wpdb;

    $results = $wpdb->update(
        $wpdb->prefix . 'daily_poll',
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

function daily_poll_add_star($username) {
    global $wpdb;
    //Check if in db
    $check = $wpdb->get_row("SELECT * FROM " . $wpdb->prefix . "daily_poll WHERE user_name = '$username'", ARRAY_A);
    if (!$check) {
	daily_poll_add_user($username);
    }
    $star_count = $check['stars'];
    $results = $wpdb->update(
        $wpdb->prefix . 'daily_poll',
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
    daily_poll_star_notify($username);

}

function daily_poll_star_notify($username) {

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
function daily_poll_get_users() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "daily_poll ORDER BY stars DESC"
    );

    return $results;
}

function daily_poll_get_top_10() {
    global $wpdb;
    $results = $wpdb->get_results(
        "
        SELECT *
        FROM " . $wpdb->prefix . "daily_poll WHERE stars > 0 ORDER BY stars DESC LIMIT 5"
    );
    return $results;
}

