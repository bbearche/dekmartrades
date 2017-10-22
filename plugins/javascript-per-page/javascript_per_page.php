<?php
/*
* Plugin Name: Javascript Per Page
*
* Description: Add custom javascript, IE specific javascript and even iOS specific javascript, to any page or post on your Wordpress website.
*
* Author: Josh Kohlbach
* Author URI: http://www.codemyownroad.com
* Plugin URI: http://www.codemyownroad.com/products/javascript-per-page-wordpress-plugin/ 
* Version: 1.0.1
*/


/*******************************************************************************
** addCustomJS()
**
** Echos a javascript to the header if it exists
**
** @since 0.2
*******************************************************************************/
function addCustomJS($jsName, $delimiter = '') {
	if (empty($jsName))
		return;
	
	$possible_src_1 = trailingslashit(get_stylesheet_directory()) . 'js/' . 
		$delimiter . $jsName . '.js';
		
	$possible_src_2 = trailingslashit(get_stylesheet_directory()) . 
		$delimiter . $jsName . '.js';
	
	$use_src_1 = false;	
	
	// Retrieve plugin options
	$javascriptPerPage = get_option('javascriptPerPage');
	
	// Optionally, check if the file exists or not
	if ($javascriptPerPage['check_for_file'] == 'on') {
		if (file_exists($possible_src_1)) {
			// file exists in /js directory, give preference to that sheet
			$use_src_1 = true;
		} else {
			// file doesn't exists in /js dir, check the root dir
			if (!file_exists($possible_src_2)) {
				// file doesn't exist in the root dir either
				return;
			}
		}
	} else {
		// need both files because we're just print it regardless of whether it
		// exists or not
		$src1 = trailingslashit(get_bloginfo('stylesheet_directory')) . 'js/' . 
			$delimiter . $jsName . '.js';
		$src2 = trailingslashit(get_bloginfo('stylesheet_directory')) . 
			$delimiter . $jsName . '.js';
	}
	
	if ($use_src_1) {
		// File exists in /js dir
		$src = trailingslashit(get_bloginfo('stylesheet_directory')) . 'js/' . 
			$delimiter . $jsName . '.js';
	} else {
		// Use file in root dir
		$src = trailingslashit(get_bloginfo('stylesheet_directory')) . 
			$delimiter . $jsName . '.js';
	}
	
	if ($javascriptPerPage['check_for_file'] == 'on') {
		echo '<script type="text/javascript" src="' . $src . '"></script>';
	} else {
		echo '<script type="text/javascript" src="' . $src1 . '"></script>';
		echo '<script type="text/javascript" src="' . $src2 . '"></script>';
	}
		
}

/*******************************************************************************
** addCustomJavascripts()
**
** Echo a javascript or optionally an array of javascripts back to the browser
**
** @since 0.1
*******************************************************************************/
function addCustomJavascripts($javascripts) {
	if (!is_array($javascripts)) {
		addCustomJS($javascripts, 'page-');
	} else {
		foreach ($javascripts as $jsName) {
			addCustomJS($jsName,(is_page() ? 'page-' : '')); 
		}
	}
}

/*******************************************************************************
** addIEJavascripts()
**
** Allows you to define ie.js, ie9.js, ie8.js, ie7.js and ie6.js files in your theme 
** directory (or theme directory plus /js) for isolating IE only Javascript.
**
** @since 0.3
*******************************************************************************/
function addIEJavascripts() {
	$ieScripts = array(
		'IE' => 'ie',
		'lte IE 8' => 'ie8',
		'lte IE 7' => 'ie7',
		'lte IE 6' => 'ie6'
	);
	
	foreach ($ieScripts as $key => $value) {
		echo '<!--[if ' . $key . ']>';
		addCustomJS($value);
		echo "<![endif]-->\n";
	}
	
}

/*******************************************************************************
** addIosJavascript()
**
** Allows you to define a ios.js file in your theme 
** directory (or theme directory plus /js) for isolating iOS devices (ipad,
** iphone, ipod).
**
** @since 0.5
*******************************************************************************/
function addIosJavascript() {
	if (strpos($_SERVER['HTTP_USER_AGENT'], 'iPad') ||
		strpos($_SERVER['HTTP_USER_AGENT'], 'iPhone') ||
		strpos($_SERVER['HTTP_USER_AGENT'], 'iPod')) {
		addCustomJS('ios');
	}
}

/*******************************************************************************
** javascriptPerPage()
**
** Echo a javascript file for the current page
**
** @since 0.1
*******************************************************************************/
function javascriptPerPage() {
	global $wp_query;
	$page_obj = $wp_query->get_queried_object();
	
	if (is_page()) {
		addCustomJavascripts(
			$page_obj->post_name
		);
	} else if (is_author()) {
		addCustomJavascripts(
			array(
				'user', 
				'user-' . $page_obj->user_login
			)
		);
	} else if (is_singular()) {
		addCustomJavascripts(
			array(
				$page_obj->post_type, 
				$page_obj->post_type . '-' . $page_obj->post_name
			)
		);
	} else if (is_category()) {
		addCustomJavascripts(
			array(
				'category',
				'category-' . $page_obj->slug
			)
		);
	} else if (is_tag()) {
		addCustomJavascripts(
			array(
				'tag',
				'tag-' . $page_obj->slug
			)
		);
	} else if (is_archive()) {
		addCustomJavascripts(
			array(
				'archive'
			)
		);
	} else if (is_home()) {
		addCustomJavascripts(
			array(
				'home'
			)
		);
	} else if (is_front_page()) {
		addCustomJavascripts(
			array(
				'front-page'
			)
		);
	}
	
	$javascriptPerPage = get_option('javascriptPerPage');
	
	if (!is_admin() && $javascriptPerPage['add_ie_javascripts'] == 'on'){
		addIEJavascripts();
	}
	
	if (!is_admin() && $javascriptPerPage['add_ios_javascript'] == 'on'){
		addIosJavascript();
	}
}

/*******************************************************************************
** javascriptPerPageMenu()
**
** Setup the plugin options menu
**
** @since 0.2
*******************************************************************************/
function javascriptPerPageMenu() {
	if (is_admin()) {
		register_setting('javascript-per-page', 'javascriptPerPage');
		add_options_page('Javascript Per Page Settings', 'Javascript Per Page', 'administrator', __FILE__, 'javascriptPerPageOptions', plugins_url('/images/icon.png', __FILE__));
	}
}

/*******************************************************************************
** javascriptPerPageOptions()
**
** Present the options page
**
** @since 0.2
*******************************************************************************/
function javascriptPerPageOptions() {
	if (!current_user_can('manage_options'))  {
		wp_die( __('You do not have suffifient permissions to access this page.') );
	}
	
	echo '<div class="wrap">' . screen_icon() . '<h2>Javascript Per Page</h2>';
	
	$javascriptPerPage = get_option('javascriptPerPage');
	$javascriptPerPage['check_for_file'] = $javascriptPerPage['check_for_file'] ? 'checked="checked"' : '';
	$javascriptPerPage['add_ie_javascripts'] = $javascriptPerPage['add_ie_javascripts'] ? 'checked="checked"' : '';
	$javascriptPerPage['add_ios_javascript'] = $javascriptPerPage['add_ios_javascript'] ? 'checked="checked"' : '';
	
	echo '<form method="post" action="options.php">';
	
	wp_nonce_field('update-options');
	settings_fields( 'javascript-per-page' );
	
	echo '<table class="form-table">
	<tr valign="top">
	<th scope="row" style="white-space: nowrap;">Check for files before placing in header?</th>
	<td>
	<input type="checkbox" name="javascriptPerPage[check_for_file]" id="check_for_file" ' . 
	$javascriptPerPage['check_for_file'] . ' />
	</td></tr>
	
	<tr valign="top">
	<th scope="row" style="white-space: nowrap;"><label for="javascriptPerPage[add_ie_javascripts]">Add IE specific javascript files?</label></th>
	<td>
	<input type="checkbox" name="javascriptPerPage[add_ie_javascripts]" id="add_ie_javascripts" ' . 
	$javascriptPerPage['add_ie_javascripts'] . ' />
	<p><span class="description">Allows you to define ie.js, ie9.js, ie8.js, ie7.js and ie6.js files in your theme directory (or a /js subdirectory in your theme)<br />
	for isolating IE only Javascript.</span></p>
	</td></tr>
	
	<tr valign="top">
	<th scope="row" style="white-space: nowrap;"><label for="javascriptPerPage[add_ios_javascript]">Add iOS javascript?</label></th>
	<td>
	<input type="checkbox" name="javascriptPerPage[add_ios_javascript]" id="add_ios_javascript" ' . 
	$javascriptPerPage['add_ios_javascript'] . ' />
	<p><span class="description">Allows you to define ios.js in your theme directory to add a specific Javascript for iOS devices (ipad, iphone, ipod)</span></p>
	</td></tr>
	
	</table>
	
	<input type="hidden" name="page_options" value="javascriptPerPage" />
		
	<p class="submit">
	<input type="submit" class="button-primary" value="Save Changes" />
	</p>
	
	</form>
	</div>';

}


/*******************************************************************************
** initjavascriptPerPage()
**
** Initialize the stylesheet per page plugin
**
** @since 0.1
*******************************************************************************/
function initJavascriptPerPage() {
	add_filter('wp_head', 'javascriptPerPage', 999);
	add_action('admin_menu', 'javascriptPerPageMenu');	
}

add_action('init', 'initJavascriptPerPage', 1);

?>
