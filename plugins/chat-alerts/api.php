<?php
require_once('util.php');
require_once('functions.php');


if (isset($_GET['action'])) {
    
    switch ($_GET['action']) {
        case 'list':
            $results = top_traders_get_users();
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        case 'top10':
            $results = top_traders_get_top_10();
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        default:
            echo "Invalid action";
    }
} else if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'add':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['username'])) {
                $results = top_traders_add_user($_POST['username']);
                echo $results;
            }
            break;
        case 'add_star':
            if (!top_traders_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['username'])) {
                $results = top_traders_add_star($_POST['username']);
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

