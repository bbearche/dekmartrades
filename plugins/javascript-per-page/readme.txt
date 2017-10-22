=== Javascript Per Page ===
Contributors: jkohlbach
Donate link: http://www.codemyownroad.com
Tags: javascript, javascript per page, ie, ie javascript, ios javascript, ios, post javascript, page javascript, category javascript, tag javascript
Requires at least: 3.0
Tested up to: 4.2
Stable tag: trunk

Add custom javascript, IE specific javascript and even iOS specific javascript, to any page or post on your Wordpress website.

== Description ==

Javascript Per Page adds a custom javascript file to all of the pages on your WordPress install with options to check for the existence of the javascript file before adding.

Allows for adding IE specific javascript all the way back to version 6. Just enable in the plugin options and add the javascript files to your theme directory.

Javascript Per Page also allows adding of an iOS specific javascript file. Simply enable in the plugin options and add the javascript to your theme directory.

This plugin supports use with custom post types, category, and tag pages.

== Installation ==

1. Upload the plugin to the `/wp-content/plugins/` directory
1. Activate the plugin through the 'Plugins' menu in WordPress

To use this plugin, just add javascript files in the following formats to your theme's base directory or a "js" subdirectory inside your theme's base directory:

* For pages create a file called page-[page_name].js where "[page_name]" is replaced with the slug of the page. Eg: page-about.js.

* For author pages create a file called user.js and for individual user pages user-[username].js where "[username]" is replaced with the user's login name.

* For different post types user [post_type].js where "[post_type]" is replaced with the name of the custom post type. You can also use just 'post' for regular posts. Eg. post.js.

* For individual posts use [post_type]-[post_name].js where "[post_type]" is replaced with the name of the custom post type or just 'post' for regular posts, and "[post_name]" is the slug of the post. Eg. post-10-tips-for-baking-pies.js, or, say if you had a "recipes" post type use something like recipes-classic-french-cheesecake.js.

* For tag pages use tag.js or tag-[tag_name].js where "[tag_name]" is replaced with the slug of the tag

* For category pages use category.js or category-[category_name].js where "[category_name]" is replaced with the slug of the category

* For archive pages use archive.js

* For home and front pages use home.js and front-page.js respectively

* To activate IE specific javascript files just create js files with the following naming: ie.js (covers all IE versions), ie8.js (covers IE 8 and below), ie7.js (covers IE 7 and below), ie6.js (covers IE 6 and below).

* To activate a iOS specific javascript create ios.js and enable in the plugin options.

NOTE: You can place your custom JS files in either the base directory of your theme, or in a "js" subdirectory inside your theme, but try to be consistent with where you place them.

== Frequently Asked Questions ==

= How do I activate IE javascript files? =
To activate javascript files enable the option in the plugin options and create js files with the following naming convention:
ie.js (overrides for all IE versions), ie8.js (overrides for IE 8 and below), ie7.js (overrides for IE 7 and below), ie6.js (overrides for IE 6 and below).

= How do I get Javascript Per Page to check for the files first before trying to include them? =

Easy, just tick the option under the Javascript Per Page admin options under found under the Settings menu.

= How do I enable an iOS javascript? =

To activate an iOS specific javascript create ios.js and place it in your theme's base directory or js subdirectory inside your theme's base directory. You will also need to enable the checkbox in the plugin options.

== Screenshots ==

N/A

== Upgrade Notice ==

N/A

== Changelog ==

* 1.0.1 Minor bug fixes
 - Loop bug when no scripts defined
 - Incorrect setting name caused ios and ie scripts not to show

* 1.0 Initial version
 - Code base copied from [Stylesheet Per Page](http://wordpress.org/plugins/stylesheet-per-page/) plugin and adjusted for Javascript
