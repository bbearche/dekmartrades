<?php
///get the items via ajax
require_once('get_wp.php');
//echo 'ceva';echo $_GET['wpqargs'];
$ajax_args = json_decode(stripslashes($_GET['args']));

//print_r($dzsp);

function objectToArray($d) {
		if (is_object($d)) {
			// Gets the properties of the given object
			// with get_object_vars function
			$d = get_object_vars($d);
		}
 
		if (is_array($d)) {
			/*
			* Return array converted to object
			* Using __FUNCTION__ (Magic constant)
			* for recursive call
			*/
			return array_map(__FUNCTION__, $d);
		}
		else {
			// Return array
			return $d;
		}
	}
        //print_r($ajax_wpqargs);
        //===sanitize vals
        //print_r($ajax_wpqargs);

        $ajax_args = objectToArray($ajax_args);

        $ajax_args['return_onlyitems']='on';
        //print_r($ajax_args);
        
            $aux = $dzsvg->show_shortcode($ajax_args);
            echo $aux;
die();