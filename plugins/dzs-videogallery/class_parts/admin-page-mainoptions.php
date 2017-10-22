<?php

//print_r($this->mainoptions);


if (isset($_GET['dzsvp_shortcode_builder']) && $_GET['dzsvp_shortcode_builder'] == 'on') {

do_action('dzsvg_mainoptions_before_wrap');
} elseif (isset($_GET['dzsvg_shortcode_builder']) && $_GET['dzsvg_shortcode_builder'] == 'on') {
dzsvg_shortcode_builder();
} elseif (isset($_GET['dzsvg_reclam_builder']) && $_GET['dzsvg_reclam_builder'] == 'on') {
dzsvg_ad_builder();
} elseif (isset($_GET['dzsvg_shortcode_showcase_builder']) && $_GET['dzsvg_shortcode_showcase_builder'] == 'on') {
dzsvg_shortcode_showcase_builder();
} else {

if (isset($_REQUEST['dzsvg_delete_cache']) && $_REQUEST['dzsvg_delete_cache'] == 'on') {
delete_option('dzsvg_cache_ytuserchannel');
delete_option('dzsvg_cache_ytplaylist');
delete_option('dzsvg_cache_ytkeywords');
delete_option('cache_dzsvg_vmuser');
delete_option('cache_dzsvg_vmchannel');
delete_option('cache_dzsvg_vmalbum');
delete_option('dzsvg_cache_vmalbum');
delete_option('dzsvg_cache_vmchannel');
delete_option('dzsvg_cache_vmuser');
}

if (isset($_POST['dzsvg_delete_all_options']) && $_POST['dzsvg_delete_all_options'] == 'on') {
delete_option('dzsvg_cache_ytuserchannel');
delete_option('dzsvg_cache_ytplaylist');
delete_option('dzsvg_cache_ytkeywords');
delete_option('cache_dzsvg_vmuser');
delete_option('cache_dzsvg_vmchannel');
delete_option('cache_dzsvg_vmalbum');
delete_option('dzsvg_cache_vmalbum');
delete_option('dzsvg_cache_vmchannel');
delete_option('dzsvg_cache_vmuser');
delete_option($this->dbitemsname);
delete_option($this->dbvpconfigsname);
delete_option($this->dboptionsname);
delete_option($this->dbdcname);
delete_option($this->dbdbsname);



    global $wpdb;
    $table_name = $wpdb->prefix.'posts';

    $user_id = get_current_user_id();


    $wpdb->delete( $table_name, array( 'post_type' => 'dzsvideo' ) );;



}





    $arr_vpconfigs = array();
    $i = 0;
    $arr_vpconfigs[$i] = array('lab' => __('Default Configuration', 'dzsvp'), 'val' => 'default');
    $i++;
    foreach ($this->mainvpconfigs as $vpconfig) {
        //print_r($vpconfig);
//            $vpconfigsstr .='<option value="' . $vpconfig['settings']['id'] . '">' . $vpconfig['settings']['id'] . '</option>';
        $arr_vpconfigs[$i] = array('lab' => $vpconfig['settings']['id'], 'val' => $vpconfig['settings']['id']);
        $i++;
    };
//        print_r($this->mainoptions);
?>

<div class="wrap">
    <h2><?php echo __('Video Gallery Main Settings', 'dzsvg'); ?></h2>
    <br/>

    <form class="mainsettings">

        <a class="zoombox button-secondary" href="<?php echo $this->thepath; ?>readme/index.html"
           data-bigwidth="1100" data-scaling="fill"
           data-bigheight="700"><?php echo __("Documentation"); ?></a>

        <a href="<?php echo admin_url('admin.php?page=dzsvg-mo&dzsvg_shortcode_showcase_builder=on'); ?>" target="_blank"
           class="button-secondary action"><?php _e('Showcase Shortcode Generator', 'dzsvg'); ?></a>

        <a href="<?php echo admin_url('admin.php?page=dzsvg-mo&dzsvg_shortcode_builder=on'); ?>" target="_blank"
           class="button-secondary action"><?php _e(' Gallery Shortcode Generator', 'dzsvg'); ?></a>


        <?php
        do_action('dzsvg_mainoptions_before_tabs');
        ?>

        <h3><?php echo __("Admin Options"); ?></h3>

        <div class="dzs-tabs auto-init" data-options="{ 'design_tabsposition' : 'top'
                ,design_transition: 'fade'
                ,design_tabswidth: 'default'
                ,toggle_breakpoint : '400'
                 ,toggle_type: 'accordion'
                 ,toggle_type: 'accordion'
                         ,settings_enable_linking : 'on'
                 ,settings_appendWholeContent: true
                 ,refresh_tab_height: '1000'
                 }">

            <div class="dzs-tab-tobe">
                <div class="tab-menu with-tooltip">
                    <i class="fa fa-tachometer"></i> <?php echo __("Settings"); ?>
                </div>
                <div class="tab-content">
                    <br>


                    <div class="setting">

                        <?php
                        $lab = 'always_embed';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Always Embed Scripts?', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('by default scripts and styles from this gallery are included only when needed for optimizations reasons, but you can choose to always use them ( useful for when you are using a ajax theme that does not reload the whole page on url change )', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'disable_fontawesome';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Disable FontAwesome', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('do not include the fontawesome library', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'settings_trigger_resize';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Force Refresh Size Every 1000ms', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('sometimes sizes need to be recalculated ( for example if you use the gallery in tabs )', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'replace_wpvideo';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Replace [video] Shortcode for Simple Videos', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('render simple wp videos with DZS Video Gallery', 'dzsapp'); ?></div>
                    </div>

                    <div class="setting">

                        <?php
                        $lab = 'enable_widget';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Enable Widget', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('enable widget for including in sidebar', 'dzsapp'); ?></div>
                    </div>

                    <div class="setting">

                        <?php
                        $lab = 'loop_playlist';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Loop Playlist', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('loop the playlist after the last video has finished', 'dzsapp'); ?></div>
                    </div>

                    <div class="setting">

                        <?php
                        $lab = 'enable_cs';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Enable CornerStone Support', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('enable CornerStone support', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'enable_auto_backup';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Enable Autobackup', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('enable once per day autobackup of the main database', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'enable_video_showcase';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Enable Video Showcase', 'dzsvg'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('enable Video Items and special Showcase options', 'dzsvg'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'track_views';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Track Views', 'dzsvg'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div class="sidenote"><?php echo __('Track views on video posts', 'dzsvg'); ?></div>
                    </div>

                    <h3><?php echo __('Video Page', 'dzsvg'); ?></h3>




                    <div class="setting">
                        <h4 class="setting-label"><?php echo __('Video Player Configuration', 'dzsvp'); ?></h4>
                        <?php
                        $lab = 'dzsvp_video_config';
                        $val = $this->mainoptions[$lab];
                        echo DZSHelpers::generate_select($lab, array('options' => $arr_vpconfigs, 'class' => 'dzs-style-me skin-beige', 'seekval' => $val));
                        ?>

                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'videopage_show_views';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Show Play Count ', 'dzsvg'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div class="sidenote"><?php echo __('Yes / No', 'dzsvg'); ?></div>
                    </div>
                    <div class="setting">

                        <?php
                        $lab = 'videopage_autoplay';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Autoplay', 'dzsvg'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div class="sidenote"><?php echo __('autoplay videos on video page', 'dzsvg'); ?></div>
                    </div>
                    <div class="setting">

                        <?php
                        $lab = 'videopage_resize_proportional';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Resize proportional ?', 'dzsvg'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div class="sidenote"><?php echo __('resize proportionally to try and hide black bars', 'dzsvg'); ?></div>
                    </div>

                    <h3><?php echo __('Lightbox Settings', 'dzsvg'); ?></h3>
                    <div class="setting">

                        <?php
                        $lab = 'zoombox_autoplay';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Autoplay Video in Zoombox', 'dzsvg'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div class="sidenote"><?php echo __('Yes / No', 'dzsvg'); ?></div>
                    </div>





                    <div class="setting">
                        <h4 class="setting-label"><?php echo __('Video Player Configuration', 'dzsvp'); ?></h4>
                        <?php
                        $lab = 'zoombox_video_config';
                        $val = $this->mainoptions[$lab];
                        echo DZSHelpers::generate_select($lab, array('options' => $arr_vpconfigs, 'class' => 'dzs-style-me skin-beige', 'seekval' => $val));
                        ?>

                    </div>


                    <!-- end general settings -->


                </div>
            </div>

            <div class="dzs-tab-tobe tab-disabled">
                <div class="tab-menu ">
                    &nbsp;&nbsp;
                </div>
                <div class="tab-content">

                </div>
            </div>

            <div class="dzs-tab-tobe">
                <div class="tab-menu with-tooltip">
                    <i class="fa fa-gear"></i> <?php echo __("Developer"); ?>
                </div>
                <div class="tab-content">
                    <br>


                    <?php
                    $lab = 'is_safebinding';
                    echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                    ?>
                    <div class="setting">
                        <h4 class="setting-label"><?php echo __('Safe binding?', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php

                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('the galleries admin can use a complex ajax backend to ensure fast editing, but this can cause limitation issues on php servers. Turn this to on if you want a faster editing experience ( and if you have less then 20 videos accross galleries ) '); ?></div>
                    </div>


                    <?php
                    $lab = 'disable_api_caching';
                    echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                    ?>
                    <div class="setting">
                        <h4 class="setting-label"><?php echo __('Do Not Use Caching', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php

                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('use caching for vimeo / youtube api ( recommended - on )'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'admin_enable_for_users';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Enable Visitors Gallery Access', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('your logged in users will be able to have their own galleries', 'dzsapp'); ?></div>
                    </div>

                        <?php

                        if(ini_get('allow_url_fopen')){
                            $lab = 'force_file_get_contents';
                            ?>

                    <div class="setting">

                        <?php

                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Force File Get Contents', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('sometimes curl will not work for retrieving youtube user name / playlist - try enabling this option if so...', 'dzsapp'); ?></div>
                    </div>

                            <?php

                        }else{
                            echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));

                        }
                            ?>


                    <div class="setting">

                        <?php
                        $lab = 'replace_jwplayer';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Replace JWPlayer', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('render jw player shortcodes with DZS Video Gallery', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'include_featured_gallery_meta';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Include Featured Gallery Option', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('only works on certain themes', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'tinymce_enable_preview_shortcodes';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Enable Preview Shortcodes in TinyMce Editor', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('add a box with the shortcode in the tinymce Visual Editor', 'dzsapp'); ?></div>
                    </div>


                    <div class="setting">

                        <?php
                        $lab = 'debug_mode';
                        echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                        ?>
                        <h4 class="setting-label"><?php echo __('Debug Mode', 'dzsapp'); ?></h4>
                        <div class="dzscheckbox skin-nova">
                            <?php
                            echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                            <label for="<?php echo $lab; ?>"></label>
                        </div>
                        <div
                            class="sidenote"><?php echo __('activate debug mode ( advanced mode )', 'dzsapp'); ?></div>
                    </div>


                    <!-- end developer settings -->


                </div>
            </div>

            <div class="dzs-tab-tobe tab-disabled">
                <div class="tab-menu ">
                    &nbsp;&nbsp;
                </div>
                <div class="tab-content">

                </div>
            </div>

            <div class="dzs-tab-tobe">
                <div class="tab-menu with-tooltip">
                    <i class="fa fa-paint-brush"></i> <?php echo __("Appearance") ?>
                </div>
                <div class="tab-content">
                    <br>


                    <?php
                    $lab = 'translate_skipad';
                    echo '
                                   <div class="setting">
                                       <div class="label">' . __('Translate Skip Ad', 'dzsvg') . '</div>
                                       ' . $this->misc_input_text($lab, array('val' => '', 'seekval' => $this->mainoptions[$lab])) . '
                                   </div>';
                    ?>

                    <div class="setting">
                        <div class="label"><?php echo __('Extra CSS', 'dzsp'); ?></div>
                        <?php echo $this->misc_input_textarea('extra_css', array('val' => '', 'seekval' => $this->mainoptions['extra_css'])); ?>
                        <div class="sidenote"><?php echo __('', 'dzsp'); ?></div>
                    </div>

                </div>
            </div>

            <div class="dzs-tab-tobe tab-disabled">
                <div class="tab-menu ">
                    &nbsp;&nbsp;
                </div>
                <div class="tab-content">

                </div>
            </div>

            <div class="dzs-tab-tobe">
                <div class="tab-menu with-tooltip">
                    <i class="fa fa-vimeo"></i> <?php echo __("Vimeo") ?>
                </div>
                <div class="tab-content">
                    <br>


                    <div class="setting">
                        <div class="label"><?php echo __('Vimeo Thumbnail Quality', 'dzsvp'); ?></div>
                        <?php
                        $arr_opts = array(array('lab' => __('Low Quality'), 'val' => 'low',), array('lab' => __('Medium Quality'), 'val' => 'medium',), array('lab' => __('High Quality'), 'val' => 'high',),);

                        $lab = 'vimeo_thumb_quality';
                        $val = $this->mainoptions[$lab];
                        echo DZSHelpers::generate_select($lab, array('options' => $arr_opts, 'class' => 'styleme', 'seekval' => $val));
                        ?>
                    </div>


                    <?php
                    $lab = 'vimeo_api_user_id';
                    echo '
                                   <div class="setting">
                                       <div class="label">' . __('Your User ID', 'dzsvg') . '</div>
                                       ' . $this->misc_input_text($lab, array('val' => '', 'seekval' => $this->mainoptions[$lab])) . '
                                       <div class="sidenote">' . __('get it from https://vimeo.com/settings, must be in the form of user123456 ', 'dzsvg') . '</div>
                                   </div>';

                    $lab = 'vimeo_api_client_id';
                    echo '
                                   <div class="setting">
                                       <div class="label">' . __('Client ID', 'dzsvg') . '</div>
                                       ' . $this->misc_input_text($lab, array('val' => '', 'seekval' => $this->mainoptions[$lab])) . '
                                       <div class="sidenote">' . sprintf(__('you can get an api key from %shere%s - section %soAuth2%s from the app ', 'dzsvg'),'<a href="https://developer.vimeo.com/apps">','</a>','<strong>','</strong>') . ' / '. sprintf( __(' additional tutorial %s here %s'), '<a target="_blank" href="http://digitalzoomstudio.net/docs/wpvideogallery/#faq-vimeoapi">', '</a>'). '</div>
                                   </div>';


                    $lab = 'vimeo_api_client_secret';
                    echo '
                                   <div class="setting">
                                       <div class="label">' . __('Client Secret', 'dzsvg') . '</div>
                                       ' . $this->misc_input_text($lab, array('val' => '', 'seekval' => $this->mainoptions[$lab])) . '
                                   </div>';


                    $lab = 'vimeo_api_access_token';
                    echo '
                                   <div class="setting">
                                       <div class="label">' . __('Access Token', 'dzsvg') . '</div>
                                       ' . $this->misc_input_text($lab, array('val' => '', 'seekval' => $this->mainoptions[$lab])) . '
                                       <div class="sidenote">
                                       '.sprintf(__(' make sure API key is correct - see %s here %s - make sure it DOES NOT look like this -  %s'),'<a target="_blank" href="http://digitalzoomstudio.net/docs/wpvideogallery/#faq-vimeoapi">','</a>','https://api.vimeo.com/oauth/access_token').'
                                       </div>
                                   </div>';


                     ;
                    ?>


                </div>


            </div>

            <div class="dzs-tab-tobe tab-disabled">
                <div class="tab-menu ">
                    &nbsp;&nbsp;
                </div>
                <div class="tab-content">

                </div>
            </div>

            <div class="dzs-tab-tobe">
                <div class="tab-menu with-tooltip">
                    <i class="fa fa-youtube"></i> <?php echo __("YouTube") ?>
                </div>
                <div class="tab-content">
                    <br>


                    <?php


                    echo '
                <div class="setting">
                    <div class="label">' . __('YouTube API Key', 'dzsvg') . '</div>
                    ' . $this->misc_input_text('youtube_api_key', array('val' => '', 'seekval' => $this->mainoptions['youtube_api_key'])) . '
                    <div class="sidenote">' . sprintf(__('get a api key %shere%s, create a new project, access API > %sAPIs%s and enabled YouTube Data API, then create your Public API Access from API > Credentials', 'dzsvg'),'<a href="https://console.developers.google.com">','</a>','<strong>','</strong>') . '</div>
                    <div class="sidenote">' . sprintf(__('remember, do not enter anything in referers field, unless you know what you are doing, leave it clear like so - %shere%s', 'dzsvg'),'<a href="https://lh3.googleusercontent.com/5eps7rIYzxwpO5ftxy4D6GiMdimShMRWM7XE0-pQ5lI=w1221-h950-no">','</a>') . '</div>
                </div>';

                    ?>


                </div>
            </div>


            <div class="dzs-tab-tobe tab-disabled">
                <div class="tab-menu ">
                    &nbsp;&nbsp;
                </div>
                <div class="tab-content">
                    <br>


                </div>
            </div>

            <div class="dzs-tab-tobe">
                <div class="tab-menu with-tooltip">
                    <i class="fa fa-bar-chart"></i> <?php echo __("Analytics") ?>
                </div>
                <div class="tab-content">
                    <br>


                    <div class="dzs-container">
                        <div class="one-half">
                            <div class="setting">

                                <?php
                                $lab = 'analytics_enable';
                                echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                                ?>
                                <h4 class="setting-label"><?php echo __('Enable Analytics', 'dzsapp'); ?></h4>
                                <div class="dzscheckbox skin-nova">
                                    <?php
                                    echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                                    <label for="<?php echo $lab; ?>"></label>
                                </div>
                                <div
                                    class="sidenote"><?php echo __('activate analytics for the galleries', 'dzsapp'); ?></div>
                            </div>


                            <div class="setting">

                                <?php
                                $lab = 'analytics_enable_location';
                                echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                                ?>
                                <h4 class="setting-label"><?php echo __('Track Users Country?', 'dzsapp'); ?></h4>
                                <div class="dzscheckbox skin-nova">
                                    <?php
                                    echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                                    <label for="<?php echo $lab; ?>"></label>
                                </div>
                                <div
                                    class="sidenote"><?php echo __('use geolocation to track users country', 'dzsapp'); ?></div>
                            </div>

                            <div class="setting">

                                <?php
                                $lab = 'analytics_enable_user_track';
                                echo DZSHelpers::generate_input_text($lab, array('id' => $lab, 'val' => 'off', 'input_type' => 'hidden'));
                                ?>
                                <h4 class="setting-label"><?php echo __('Track Statistic by User?', 'dzsapp'); ?></h4>
                                <div class="dzscheckbox skin-nova">
                                    <?php
                                    echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => 'on', 'seekval' => $this->mainoptions[$lab])); ?>
                                    <label for="<?php echo $lab; ?>"></label>
                                </div>
                                <div
                                    class="sidenote"><?php echo __('track views and minutes watched of each user', 'dzsapp'); ?></div>
                            </div>


                        </div>


                        <div class="one-half">


                            <div class="setting">

                                <h4 class="setting-label"><?php echo __('Enabled Galleries', 'dzsapp'); ?></h4>
                                <?php
                                $lab = 'analytics_galleries[]';


                                $vals = $this->mainoptions['analytics_galleries'];

                                //                                               print_r($vals);


                                foreach ($this->mainitems as $lab2 => $it) {
                                    //,'seekval' => $this->mainoptions[$lab]
                                    ?>

                                    <div class="dzscheckbox ">
                                        <?php
                                        echo DZSHelpers::generate_input_checkbox($lab, array('id' => $lab, 'val' => $lab2, 'seekval' => $vals)); ?>
                                        <label><?php echo __("Gallery"); ?><?php echo($lab2 + 1); ?></label>
                                    </div>


                                    <?php
                                }
                                ?>

                            </div>

                        </div>

                    </div>


                </div>
            </div>



            <!-- system check -->
            <div class="dzs-tab-tobe tab-disabled">
                <div class="tab-menu ">
                    &nbsp;&nbsp;
                </div>
                <div class="tab-content">

                </div>
            </div>

            <div class="dzs-tab-tobe">
                <div class="tab-menu with-tooltip">
                    <i class="fa fa-gear"></i> <?php echo __("System Check"); ?>
                </div>
                <div class="tab-content">
                    <br>



                    <div class="setting">

                        <h4 class="setting-label">GetText <?php echo __("Support"); ?></h4>


                        <?php
                        if (function_exists("gettext")) {
                            echo '<div class="setting-text-ok"><i class="fa fa-thumbs-up"></i> '.''.__("supported").'</div>';
                        } else {

                            echo '<div class="setting-text-notok">'.''.__("not supported").'</div>';
                        }
                        ?>

                        <div class="sidenote"><?php echo __('translation support'); ?></div>
                    </div>


                    <div class="setting">

                        <h4 class="setting-label">ZipArchive <?php echo __("Support"); ?></h4>


                        <?php
                        if (class_exists("ZipArchive")) {
                            echo '<div class="setting-text-ok"><i class="fa fa-thumbs-up"></i> '.''.__("supported").'</div>';
                        } else {

                            echo '<div class="setting-text-notok">'.''.__("not supported").'</div>';
                        }
                        ?>

                        <div class="sidenote"><?php echo __('zip making for album download support'); ?></div>
                    </div>
                    <div class="setting">

                        <h4 class="setting-label">Curl <?php echo __("Support"); ?></h4>


                        <?php
                        if (function_exists('curl_version')) {
                            echo '<div class="setting-text-ok"><i class="fa fa-thumbs-up"></i> '.''.__("supported").'</div>';
                        } else {

                            echo '<div class="setting-text-notok">'.''.__("not supported").'</div>';
                        }
                        ?>

                        <div class="sidenote"><?php echo __('for making youtube / vimeo api calls'); ?></div>
                    </div>
                    <div class="setting">

                        <h4 class="setting-label">allow_url_fopen <?php echo __("Support"); ?></h4>


                        <?php
                        if (ini_get('allow_url_fopen')) {
                            echo '<div class="setting-text-ok"><i class="fa fa-thumbs-up"></i> '.''.__("supported").'</div>';
                        } else {

                            echo '<div class="setting-text-notok">'.''.__("not supported").'</div>';
                        }
                        ?>

                        <div class="sidenote"><?php echo __('for making youtube / vimeo api calls'); ?></div>
                    </div>



                    <div class="setting">

                        <h4 class="setting-label"><?php echo __("PHP Version"); ?></h4>

                        <div class="setting-text-ok">
                            <?php
                            echo phpversion();
                            ?>
                        </div>

                        <div class="sidenote"><?php echo __('the install php version, 5.4 or greater required for facebook api'); ?></div>
                    </div>



                    <div class="setting">

                        <h4 class="setting-label"><?php echo __("SSL Version"); ?></h4>

                        <div class="setting-text-ok">
                            <?php
//                            echo $this->main_settings['ssl_protocol'];
                            ?>
                        </div>

                        <div class="sidenote"><?php echo __('the ssl version - will be needed for correct communication to PayPal'); ?></div>
                    </div>



                    <div class="setting">

                        <h4 class="setting-label"><?php echo __("TLS Version"); ?></h4>

                        <div class="setting-text-ok">
                            <?php
//                            echo $this->main_settings['tls_protocol'];
                            ?>
                        </div>

                        <div class="sidenote"><?php echo __('the tls version - will be needed for correct communication to PayPal'); ?></div>
                    </div>







                </div>
            </div>
            <!-- system check END --><?php

            do_action('dzsvg_mainoptions_extra_in_tab');

            ?>

        </div><!-- end .dzs-tabs -->


        <?php

        wp_enqueue_style('dzstoggle', $this->thepath . 'dzstoggle/dzstoggle.css');
        wp_enqueue_script('dzstoggle', $this->thepath . 'dzstoggle/dzstoggle.js');

        do_action('dzsvg_mainoptions_extra');
        ?>
        <br/>
        <a href='#'
           class="button-primary dzsvg-mo-save-mainoptions"><?php echo __('Save Options', 'dzsvg'); ?></a>
    </form>
    <br/><br/>
    <div class="dzstoggle toggle1" rel="">
        <div class="toggle-title" style=""><?php echo __('Delete Settings', 'dzsvg'); ?></div>
        <div class="toggle-content">
            <form class="mainsettings" method="POST" style="display: inline-block; margin-right: 5px;">
                <button name="dzsvg_delete_cache" value="on"
                        class="button-secondary"><?php echo __('Delete All Caches', 'dzsvg'); ?></button>
            </form>

            <form class="delete-all-settings" method="POST" style="display: inline-block; margin-right: 5px;">
                <button name="dzsvg_delete_all_options" value="on"
                        class="button-secondary"><?php echo __('Delete All Content', 'dzsvg'); ?></button>
            </form>
        </div>
    </div>

    <div class="sidenote">Delete all YouTube and Vimeo channel feeds caches</div>
    <br/>

    <div class="saveconfirmer" style=""><img alt="" style="" id="save-ajax-loading2"
                                             src="<?php echo site_url(); ?>/wp-admin/images/wpspin_light.gif"/>
    </div>
</div>
<div class="clear"></div><br/>
<?php
}
