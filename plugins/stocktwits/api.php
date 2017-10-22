<?php
//include_once('../purge_cache.php');
require_once('util.php');
require_once('functions.php');

if(!is_user_logged_in()) {
	die('Not logged in');
}
if (isset($_GET['action'])) {
    switch ($_GET['action']) {
        case 'load':
            $results = stocktwits_load();
            header('Content-Type: application/json');
            echo json_encode($results);
            //echo $results;
            break;
        default:
            echo "Invalid action";
	    break;
    }
} else if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'save':
            if (isset($_POST['data'])) {
                $results = stocktwits_save($_POST['data']);
                echo $results;
            }
            break;
        default:
            echo "Invalid action";
	    break;
    }
} else {
    die('Invalid action');
}

