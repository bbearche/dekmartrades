<?php
require_once('functions.php');


if (isset($_GET['action'])) {
    
    switch ($_GET['action']) {
        case 'commentary':
            $results = livestream_commentary();
            header('Content-Type: application/json');
            echo json_encode($results);
            break;
        default:
            echo "Invalid action";
    }
} else {
    die('Invalid action');
}

