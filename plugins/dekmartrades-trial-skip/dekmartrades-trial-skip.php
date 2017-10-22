<?php
/*
Plugin Name: Dekmartrades Simple Membership Plugin Subscription Management
Description: Adds custom subsription management options.
Version: 1.0.0
Author: Evan Graham
*/


require($_SERVER['DOCUMENT_ROOT']. '/../paypal_config.php');
function PPHttpPost($methodName_, $req) {
    global $pp_environment, $pp_API_UserName, $pp_API_Password, $pp_API_Signature;
    // Set up your API credentials, PayPal end point, and API version.
    $API_UserName_ = urlencode($pp_API_UserName);
    $API_Password_ = urlencode($pp_API_Password);
    $API_Signature_ = urlencode($pp_API_Signature);

    $API_Endpoint = "https://api-3t.paypal.com/nvp";
    if("sandbox" === $pp_environment || "beta-sandbox" === $pp_environment) {
        $API_Endpoint = "https://api-3t.$environment.paypal.com/nvp";
    }
    $version = urlencode('51.0');

    // Set the curl parameters.
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $API_Endpoint);
    curl_setopt($ch, CURLOPT_VERBOSE, 1);

    // Turn off the server and peer verification (TrustManager Concept).
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, FALSE);

    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);

    // Set the API operation, version, and API signature in the request.
    $nvpreq = "$req&METHOD=$methodName_&VERSION=$version&PWD=$API_Password_&USER=$API_UserName_&SIGNATURE=$API_Signature_";
        echo $nvpreq;
    // Set the request as a POST FIELD for curl.
    curl_setopt($ch, CURLOPT_POSTFIELDS, $nvpreq);

    // Get response from the server.
    $httpResponse = curl_exec($ch);

    if(!$httpResponse) {
        exit("$methodName_ failed: ".curl_error($ch).'('.curl_errno($ch).')');
    }

    // Extract the response details.
    $httpResponseAr = explode("&", $httpResponse);

    $httpParsedResponseAr = array();
    foreach ($httpResponseAr as $i => $value) {
        $tmpAr = explode("=", $value);
        if(sizeof($tmpAr) > 1) {
            $httpParsedResponseAr[$tmpAr[0]] = urldecode($tmpAr[1]);
        }
    }

    if((0 == sizeof($httpParsedResponseAr)) || !array_key_exists('ACK', $httpParsedResponseAr)) {
        exit("Invalid HTTP Response for POST request($nvpreq) to $API_Endpoint.");
    }
        curl_reset($ch);
    return $httpParsedResponseAr;
}


function dekmartrial_simple_membership_upgraded($ipn_data)
{
    $custom_data = $ipn_data['custom'];
    $custom_values = array();
    parse_str($custom_data, $custom_values);
    if(isset($custom_values['skip_trial']))
    {
		$skip_trial_value = $custom_values['skip_trial'];
		$user = get_user_by('email', $ipn_data['payer_email']);
		$user_id = $user->ID;
		$member = SwpmMemberUtils::get_user_by_email($ipn_data['payer_email']);
		$subcr_id = $member->subscr_id;
		//Cancel original profile
		dekmartrades_simple_membership_subscription_status($subscr_id, $status, "Account Upgrade");
        
		update_user_meta(absint($user_id), 'swpm_skip_trial', true);
		
    }
}
function dekmartrial_simple_membership_subscription_status($profile_id, $status, $note_msg)
{
	//Status = Cancel, Suspend, Reactivate
        $req1 = http_build_query(["PROFILEID" => $profile_id, "ACTION" => $status, "NOTE" => $note_msg]);
        $transactionDetails = PPHttpPost("ManageRecurringPaymentsProfileStatus", $req1);
}
add_action("swpm_upgrade_ipn", "dekmartrial_simple_membership_upgraded", 10, 1);

add_action( 'show_user_profile', 'dekmartrial_simple_membership_admin_field' );
add_action( 'edit_user_profile', 'dekmartrial_simple_membership_admin_field' );

function dekmartrial_simple_membership_admin_field($user) {
	$skip_trial = (get_user_meta($user->ID, 'swpm_skip_trial', true) ? 'checked' : '');
?>


    <h3>Member Fields</h3>
    <table class="form-table">
        <tr>
            <th><label>Skip Trial</label></th>
            <td><input name="swpm_skip_trial_data" type="checkbox" <?php echo $skip_trial; ?>/></td>
        </tr>
    </table>
    <?php
}

add_action('edit_user_profile_update', 'dekmartrial_simple_membership_update_admin_field');

function dekmartrial_simple_membership_update_admin_field($user_id) {
	if (current_user_can('edit_user', $user_id)) {
        	update_user_meta($user_id, 'swpm_skip_trial', $_POST['swpm_skip_trial_data']);
	}
}
