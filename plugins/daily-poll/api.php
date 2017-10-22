<?php
require_once('util.php');
require_once('functions.php');


if (isset($_GET['action'])) {
    
    switch ($_GET['action']) {
        case 'get_results':
            $results = daily_poll_get_results($_GET['poll_id']);
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        case 'get_results_admin':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            $results = daily_poll_get_results($_GET['poll_id']);
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        case 'get_polls':
            $results = daily_poll_get_polls();
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        case 'get_choices':
            $results = daily_poll_get_choices($_GET['poll_id']);
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        case 'get_display_results':
            $results = daily_poll_display_results($_GET['poll_id']);
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        default:
            echo "Invalid action";
    }
} else if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'add_poll':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['name'])) {
                $results = daily_poll_add_poll($_POST['name']);
                echo $results;
            }
            break;
        case 'add_choice':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['poll_id']) && isset($_POST['name'])) {
                $results = daily_poll_add_choice($_POST['poll_id'], $_POST['name']);
                echo $results;
            }
            break;
        case 'set_choices':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['poll_id']) && isset($_POST['data'])) {
                $results = daily_poll_set_choices($_POST['poll_id'], $_POST['data']);
                echo $results;
            }
            break;
        case 'add_vote':
            if (isset($_POST['poll_id']) && isset($_POST['choice'])) {
                $results = daily_poll_add_vote($_POST['poll_id'], $_POST['choice'], (isset($_POST['reason']) ? $_POST['reason'] : ""));
                echo $results;
            }
            break;
        case 'toggle_display_results':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['poll_id'])) {
                $results = daily_poll_toggle_results_visible($_POST['poll_id']);
                echo $results;
            }
            break;
        case 'reset_results':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['poll_id'])) {
                $results = daily_poll_reset_results($_POST['poll_id']);
                echo $results;
            }
            break;
        case 'update':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['username']) && isset($_POST['stars'])) {
                $results = top_traders_set_stars($_POST['username'], $_POST['stars']);
                echo $results;
            }
            break;
        default:
            echo "Invalid action";
    }
} else {
    die('Invalid action');
}

