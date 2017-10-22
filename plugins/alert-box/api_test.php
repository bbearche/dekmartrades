<?php
include_once('../purge_cache.php');
require_once('util.php');
require_once('functions.php');


if (isset($_GET['action'])) {
header("X-Accel-Expires: 15");    
echo time();
    switch ($_GET['action']) {
        case 'list':
            $results = stockalert_get_alerts();
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        case 'audit':
            $results = stockalert_get_audit();
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
	case 'testadmin':
	   echo stockalert_check_chat_admin();
	   break;
        default:
            echo "Invalid action";
    }
} else if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'add':
            if (!stockalert_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['stock']) && isset($_POST['stock']) &&  isset($_POST['entry_price']) && isset($_POST['stop_loss']) && isset($_POST['exit_price'])) {
                $results = stockalert_add_alert($_POST['stock'], $_POST['position'], $_POST['entry_price'], $_POST['stop_loss'], $_POST['exit_price']);
                echo $results;
            }
            break;
        case 'highlight':
            if (!stockalert_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['id'])) {
                $results = stockalert_highlight_alert($_POST['id']);
                echo $results;
            }
            break;
        case 'stop_highlight':
            if (!stockalert_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['id'])) {
                $results = stockalert_stop_highlight_alert($_POST['id']);
                echo $results;
            }
            break;
        case 'expire':
            if (!stockalert_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['id']) && isset($_POST['verdict'])) {
                $results = stockalert_expire_alert($_POST['id'], $_POST['verdict']);
                echo $results;
            }
            break;
        case 'remove':
            if (!stockalert_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['id'])) {
                $results = stockalert_remove_alert($_POST['id']);
                echo $results;
            }
            break;
        case 'remove_audit':
            if (!stockalert_check_chat_admin()) {
                die("Unauthorized access");
            }
            if (isset($_POST['id'])) {
                $results = stockalert_remove_audit_alert($_POST['id']);
                echo $results;
            }
            break;
        default:
            echo "Invalid action";
	purge_cache();
    }
} else {
    die('Invalid action');
}

