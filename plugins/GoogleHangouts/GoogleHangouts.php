<?php
/*
Plugin Name: Google Hangouts Embed
Description: A plugin to allow embedding of a Google Hangouts stream via a shortcode
Author: Evan Graham
Version: 0.1
*/
add_action('admin_init', 'google_hangouts_init');
add_action('admin_menu', 'google_hangouts_setup_menu');

add_shortcode('google_hangout_embed', 'google_hangouts_embed_shortcode');

function google_hangouts_setup_menu() {
	add_menu_page( 'Google Hangouts Options', 'Google Hangouts', 'manage_options', 'google-hangouts', 'google_hangouts_options_page' );
}
 
function google_hangouts_embed_shortcode() {
	$options = get_option('google_hangouts_options');
    $online = $options['online'];
	$video_code = $options['embed_url'];
    if ($online == '1') {
        return '<iframe style="margin: 0 auto; display: block;" width="600" height="338" src="https://www.youtube.com/embed/' . $video_code . '" frameborder="0" allowfullscreen></iframe>';
    } else {
        return "";
    }
}
function google_hangouts_init() {
register_setting( 'google_hangouts_options', 'google_hangouts_options', 'google_hangouts_options_validate' );
add_settings_section('google_hangouts_main', 'Main Settings', 'google_hangouts_section_text', 'google_hangouts');
add_settings_field('google_hangouts_online', 'Online', 'google_hangouts_setting_online', 'google_hangouts', 'google_hangouts_main');
add_settings_field('google_hangouts_embed_url', 'Video URL', 'google_hangouts_setting_embed_url', 'google_hangouts', 'google_hangouts_main');
}

function google_hangouts_section_text() {
    $options = get_option('google_hangouts_options');
    echo "<p>Enter online status and youtube video url. e.g http://youtu.be/zPK7kHmAndG</p>";
    //echo "<p>Currently: " . $options['online'] . "</p>";
    //echo "<p>URL: http://youtu.be/" . $options['embed_url'] . "</p>";
}

function google_hangouts_setting_online() {
    $options = get_option('google_hangouts_options');
    ?>
	<input id='google_hangouts_online' name='google_hangouts_options[online]' type='checkbox' value='1' <?php checked( 1 == $options['online'] );?> />
<?php

}
function google_hangouts_setting_embed_url() {
    $options = get_option('google_hangouts_options');
    echo "<input id='google_hangouts_embed_url' name='google_hangouts_options[embed_url]' size='40' type='text' value='http://youtu.be/{$options['embed_url']}' />";
}

function google_hangouts_options_validate($input) {
	$options = get_option('google_hangouts_options');
	$options['embed_url'] = trim($input['embed_url']);
    	$options['online'] = trim($input['online']);
	$matches = null;
	if(!preg_match('/^http.+youtu.+\/(.+)$/i', $options['embed_url'], $matches)) {
		$options['embed_url'] = '';
		$options['online'] = null;
    } else {
        $options['embed_url'] = $matches[1];
    }
	return $options;
}
function google_hangouts_options_page() {
?>
<div>
<h2>Google Hangouts Options</h2>
<form action="options.php" method="post">
<?php settings_fields('google_hangouts_options'); ?>
<?php do_settings_sections('google_hangouts'); ?>
 
<input name="Submit" type="submit" value="<?php esc_attr_e('Save Changes'); ?>" />
</form></div>
<?php
}
 
?>