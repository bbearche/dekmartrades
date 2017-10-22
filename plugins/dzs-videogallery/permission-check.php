<?php

function get_membership_level() {
	//$auth = SwpmAuth::get_instance();
	//$member = SwpmMemberUtils::get_instance();
	//$level = get_logged_in_members_level();
	//return $level;
	return SwpmMemberUtils::get_logged_in_members_level();
}

function is_trial() {
	$user_id = get_current_user_id();
	$skip_trial = get_user_meta($user_id, "swpm_skip_trial", true);
	if ($skip_trial) {
		return false;
	}
	$id = SwpmMemberUtils::get_logged_in_members_id();
	$sub_start = new DateTime(SwpmMemberUtils::get_member_field_by_id($id, "subscription_starts"));
	$now = new DateTime("now");
	$interval = $sub_start->diff($now)->format('%a');
	//echo $now->format("%a");
	//echo $sub_start;
	//echo $interval;
	$out = "<!--";
	$out .= "Member ID: " . $id . "<br>";
	$out .= "Sub Start: " . $sub_start->format("Y-m-d") . "<br>";
	$out .= "Now: " . $now->format("Y-m-d") . "<br>";
	$out .= "Interval: " . $interval . "<br>";
	$out .= "-->";
	//echo $out;
	if ($interval <= 14) {
		return true;
	} else {
		return false;
	}
	
}
//var_dump(is_trial(SwpmMemberUtils::get_logged_in_members_id()));
