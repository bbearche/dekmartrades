<?php
	
	/* Template Name: Follow Tester */
	
	get_header(); 
	?>
	
<form type="post" action="<?php $_SERVER['PHP_SELF'];?>" id="followForm">

	<input name="follow" type="text" placeholder="follower" />
	<input name="un" type="text" placeholder="username" />
	
	<input type="hidden" name="action" value="followuser"/>
	<input type="submit" value="Follow">

</form>

<?php
	
	global $wpdb;
	
	$table_name = $wpdb->prefix . 'dt_follow';
	$username = $_POST['un'];
	$follower = $_POST['follow'];
	
	
	if($wpdb->insert($table_name, array(
		'id' => 'NULL',
		'user_name' => $username,
		'following' => $follower
	))===FALSE){
		echo 'error';
	} else{
		echo 'success';
	}
	?>

<br/><br/>
<div id="feedback"></div>
<br/><br/>

<?php get_footer(); ?>