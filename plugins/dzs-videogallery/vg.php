<?php
/*
  Plugin Name: DZS Video Gallery
  Plugin URI: http://digitalzoomstudio.net/
  Description: Creates and manages cool video galleries. Has a admin panel and tons of options and skins.
  Version: 9.69
  Author: Digital Zoom Studio
  Author URI: http://digitalzoomstudio.net/ 
 */



include_once(dirname(__FILE__).'/dzs_functions.php');
if(!class_exists('DZSVideoGallery')){
    include_once(dirname(__FILE__).'/class-dzsvg.php');
}


define("DZSVG_VERSION", "9.69");
define("DZSVG_PREVIEW", "NO");
define( 'DZSVG_PATH', plugin_dir_path( __FILE__ ) );
define( 'DZSVG_URL', plugin_dir_url( __FILE__ ) );

$dzsvg = new DZSVideoGallery();

//echo 'ceva22';



//$dzsvg->is_preview=true;



if (isset($dzsvg->mainoptions['enable_cs']) && $dzsvg->mainoptions['enable_cs']=='on') {





    add_action( 'wp_enqueue_scripts', 'dzsvg_enqueue' );
    add_action( 'cornerstone_register_elements', 'dzsvg_register_elements' );
    add_filter( 'cornerstone_icon_map', 'dzsvg_icon_map' );
    add_action( '_cornerstone_home_before' , 'dzsvg_home_before');
    add_action( 'cornerstone_before_wp_editor' , 'dzsvg_home_before');
    add_action( 'cornerstone_load_builder' , 'dzsvg_home_before');




    function dzsvg_home_before(){
//    echo 'hmmdada';
        // -- enqueue in cusotmizer

        wp_enqueue_script( 'dzsvg-admin-for-cornerstone', DZSVG_URL . 'assets/admin/admin-for-cornerstone.js', array('jquery'));
        wp_enqueue_script( 'dzsvg-admin-global', DZSVG_URL . 'admin/admin_global.js', array('jquery'));
        wp_enqueue_style( 'dzsvg-admin-global', DZSVG_URL . '/admin/admin_global.css');

    }

    function dzsvg_register_elements() {

        cornerstone_register_element( 'CS_DZSVG', 'dzsvg', DZSVG_PATH . 'includes/dzsvg' );
        cornerstone_register_element( 'CS_DZSVG_PLAYLIST', 'dzsvg_playlist', DZSVG_PATH . 'includes/dzsvg_playlist' );

    }

    function dzsvg_enqueue() {
        wp_enqueue_style( 'dzsvg', DZSVG_URL . '/videogallery/vplayer.css');
        wp_enqueue_script( 'dzsvg', DZSVG_URL . 'videogallery/vplayer.js', array('jquery'));


//    wp_enqueue_style( 'dzs.scroller', DZSVG_URL . 'assets/dzsscroller/scroller.css');
//    wp_enqueue_script( 'dzs.scroller', DZSVG_URL . 'assets/dzsscroller/scroller.js');
    }

    function dzsvg_icon_map( $icon_map ) {
        $icon_map['dzsvg'] = DZSVG_URL . '/assets/svg/icons.svg';
        return $icon_map;
    }

}



if(function_exists('dzsvg_handle_activated_plugin')==false){
    function dzsvg_handle_activated_plugin($plugin=''){
        $redirect = false;
        if( $plugin == plugin_basename( __FILE__ ) ) {

            if (get_option('dzsvg_shown_intro')) {

            } else {

                $redirect = true;
            }

        }
        if(DZSVG_PREVIEW=='YES'){

            $redirect = true;
        }


        if ($redirect){


//                $dzsvg->redirect_to_intro_page = true;
//                header("Location: ".admin_url( 'admin.php?page=dzsvg-about' )."");
            exit( wp_redirect( admin_url( 'admin.php?page=dzsvg-about' ) ) );
//            error_log("TRY TO SHOW");
        }
    }
}



if(DZSVG_PREVIEW=="YES"){

    add_action('wp_login', 'dzsvg_handle_activated_plugin', 10, 2);
}



add_action('activated_plugin', 'dzsvg_handle_activated_plugin');
register_activation_hook(__FILE__, array($dzsvg, 'handle_plugin_activate'));
register_deactivation_hook(__FILE__, array($dzsvg, 'handle_plugin_deactivate'));




if (isset($dzsvg->mainoptions['enable_widget']) && $dzsvg->mainoptions['enable_widget']=='on' && file_exists($dzsvg->base_path.'widget.php')) {
    include_once('widget.php');
}


if(isset($_GET['dzsvg_show_generator_export_slider']) && $_GET['dzsvg_show_generator_export_slider']=='on'){
    $dzsvg->show_generator_export_slider();
    die();
}



