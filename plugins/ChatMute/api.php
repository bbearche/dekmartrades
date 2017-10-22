<?php
require_once('util.php');
require_once('functions.php');


if (isset($_GET['action'])) {

    switch($_GET['action']) {
	case 'mute_list':
		$results = chatmute_get_mute_names();
		header('Content-Type: application/json');
		echo json_encode($results);
		break;
	case 'list':
		$results = chatmute_get_mutes();
		header('Content-Type: application/json');
		echo json_encode($results);
	break;
    case 'mute':
		if (!chatmute_check_chat_admin()) {
			die("Unauthorized access");
		}
        if (isset($_GET['username'])) {
            $length = 0;
            if (isset($_GET['length'])) {
                $length = $_GET['length'];
            }
            $results = chatmute_mute_user($_GET['username'], $length);
            echo $results;
        }
        break;
    case 'unmute':
		if (!chatmute_check_chat_admin()) {
			die("Unauthorized access");
		}
        if (isset($_GET['username'])) {
            $results = chatmute_unmute_user($_GET['username']);
            echo $results;
        }
        break;
    default:
        echo "Invalid action";
    }
} else {
    die('Invalid action');
}
