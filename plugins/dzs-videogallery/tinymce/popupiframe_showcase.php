<?php




function dzsvg_shortcode_showcase_builder(){

    global $dzsvg;

    $url_admin = get_admin_url();
//<script src="<?php echo site_url(); "></script>

    $categories = get_terms( 'dzsvideo_category', 'orderby=count&hide_empty=0' );


//    print_r($categories);

    
    $cats_checkboxes = '';

    if(count($categories)>0){
        foreach($categories as $cat){
//            print_r($cat);
            $cats_checkboxes .='<input type="checkbox" name="cat[]" id="cat'.$cat->term_id.'" value="'.$cat->term_id.'"> <label for="cat'.$cat->term_id.'">'.$cat->name.'</label><br><br> ';
        }
    }

    ?>
<div class="sc-con sc-con-for-showcase-builder">
    <div class="sc-menu">


        <div class="main-type-container">


            <div class="setting  mode-any">
                <h3><?php echo __("Type"); ?></h3>
                <?php


                $lab = "type";


                $arr_opts = array(
                    'video_items',
                    'youtube',
                    'vimeo',
                    'video_gallery',
                );


                echo DZSHelpers::generate_select($lab, array(
                    'options'=>$arr_opts,
                    'class'=>'dzs-style-me opener-listbuttons dzs-dependency-field',
                    'seekval'=>'',
                ));

                ?>
                <ul class="dzs-style-me-feeder">
                    <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>tinymce/img/type1.png"/><span class="option-label"><?php echo __("Video Items"); ?></span></span></li>
                    <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>tinymce/img/type2.png"/><span class="option-label"><?php echo __("YouTube Feed"); ?></span></span></li>
                    <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>tinymce/img/type3.png"/><span class="option-label"><?php echo __("Vimeo Feed"); ?></span></span></li>
                    <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>tinymce/img/type_video_gallery.png"/><span class="option-label"><?php echo __("Video Gallery"); ?></span></span></li>
                </ul>
                <div class="sidenote"><?php echo __("This is where the showcase items will come from... "); ?></div>
            </div>



<!--            <div class="setting type-any ">-->
<!--                <h3>--><?php //echo __("Type"); ?><!--</h3>-->
<!--                --><?php
//
//
//                $lab = "type";
//
//
//                $arr_opts = array(
//                    array(
//                        'lab'=>__('Latest Videos'),
//                        'val'=>'latest',
//                    ),
//                    array(
//                        'lab'=>__('Most Viewed'),
//                        'val'=>'mostviewed',
//                    ),
//                    array(
//                        'lab'=>__('Most Liked'),
//                        'val'=>'mostliked',
//                    ),
//                    array(
//                        'lab'=>__("Playlist"),
//                        'val'=>'mostliked',
//                    ),
//                );
//
//
//                echo DZSHelpers::generate_select($lab, array(
//                    'options'=>$arr_opts,
//                    'class'=>'dzs-style-me skin-beige',
//                ));
//
//                ?>
<!--            </div>-->

            <?php

            // -- for future we can do a logical set like "(" .. ")" .. "AND" .. "OR"
            $dependency = array(

                array(
                    'lab'=>'type',
                    'val'=>array('video_gallery'),
                ),
            );
            
            

            ?>


            <div class="setting type-any" data-dependency='<?php echo json_encode($dependency); ?>'>
                <h3><?php echo __("Select a Gallery to Insert"); ?></h3>
                <select class="styleme dzs-dependency-field" name="dzsvg_selectid">
                    <?php foreach ($dzsvg->mainitems as $mainitem) {
                        echo '<option>' . ($mainitem['settings']['id']) . '</option>';
                    } ?>
                </select>
            </div>

            <?php if($cats_checkboxes) { ?>
                <div class="setting type-video_items ">
                    <h3><?php echo __("Category"); ?></h3>
                    <?php echo $cats_checkboxes; ?>
                </div>
            <?php } ?>



            <div class="setting type-youtube ">
                <h3><?php echo __("Link"); ?></h3>
                <input class="regular-text  dzs-dependency-field" name="youtube_link" value=""/>
                <div class="sidenote"><?php printf(__('ie. %1$s - for a user channel feed').'<br>','<strong>https://www.youtube.com/user/digitalzoomstudio</strong>');
                    printf(__('ie. %1$s - for a playlist feed').'<br>','<strong>https://www.youtube.com/playlist?list=PLBsCKuJJu1pbD4ONNTHgNsVebK4ughuch</strong>');
                    printf(__('ie. %1$s - for a search feed').'<br>','<strong>https://www.youtube.com/results?search_query=cat+funny</strong>'); ?></div>
            </div>

            <div class="setting type-youtube ">
                <h3><?php echo __("Max. Videos"); ?></h3>
                <input class="regular-text" name="max_videos" value=""/>
            </div>




            <div class="setting type-vimeo ">
                <h3><?php echo __("Link"); ?></h3>
                <input class="regular-text  dzs-dependency-field" name="vimeo_link" value=""/>
                <div class="sidenote"><?php printf(__('ie. %1$s - for a user channel feed').'<br>','<strong>https://vimeo.com/user5137664</strong>');
                    printf(__('ie. %1$s - for a channel feed').'<br>','<strong>https://vimeo.com/channels/636900</strong>');
                    printf(__('ie. %1$s - for a album feed').'<br>','<strong>https://vimeo.com/album/2633720</strong>'); ?></div>
            </div>


            <div class="setting  type-video_items">
                <h3><?php echo __("Order By"); ?></h3>
                <?php


                $lab = "orderby";


                $arr_opts = array(
                    array(
                        'value'=>'none',
                        'label'=>__("Default"),
                    ),
                    array(
                        'value'=>'date',
                        'label'=>__("Date"),
                    ),
                    array(
                        'value'=>'views',
                        'label'=>__("Views"),
                    ),
                    array(
                        'value'=>'similar',
                        'label'=>__("Similar"),
                    ),
                );


                echo DZSHelpers::generate_select($lab, array(
                    'options'=>$arr_opts,
                    'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                    'seekval'=>'',
                ));
                ?>
            </div>

            <div class="setting  type-video_items">
                <h3><?php echo __("Order"); ?></h3>
                <?php


                $lab = "order";


                $arr_opts = array(
                    array(
                        'value'=>'DESC',
                        'label'=>__("Descending"),
                    ),
                    array(
                        'value'=>'ASC',
                        'label'=>__("Ascending"),
                    ),
                );


                echo DZSHelpers::generate_select($lab, array(
                    'options'=>$arr_opts,
                    'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                    'seekval'=>'',
                ));
                ?>
            </div>



            <!-- end type-container-->
        </div>
        <div class="setting  mode-any">
            <h3><?php echo __("Mode"); ?></h3>
            <?php


            $lab = "mode";


            $arr_opts = array(
                'ullist',
                'list',
                'list-2',
                'featured',
                'scroller',
                'scrollmenu',
                'zfolio',
                'gallery_view',
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_opts,
                'class'=>'dzs-style-me opener-listbuttons  dzs-dependency-field',
                'seekval'=>'',
            ));

            ?>
            <ul class="dzs-style-me-feeder">
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/style_ullist.svg"/><span class="option-label"><?php echo __("UL LIST"); ?></span></span></li>
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/style_list.svg"/><span class="option-label"><?php echo __("LIST");?></span></span></li>
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/style_list-2.svg"/><span class="option-label"><?php echo __("LIST");?> 2</span></span></li>
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/style_featured.svg"/><span class="option-label"><?php echo __("FEATURED"); ?></span></span></li>
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/style_scroller.svg"/><span class="option-label"><?php echo __("SCROLLER"); ?></span></span></li>
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/scrollmenu.svg"/><span class="option-label"><?php echo __("SCROLL MENU"); ?></span></span></li>
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/style_zfolio.svg"/><span class="option-label"><?php echo __("ZFOLIO");?></span></span></li>
                <li ><span class="option-con"><img src="<?php echo $dzsvg->base_url; ?>assets/svg/style_gallery_view.svg"/><span class="option-label"><?php echo __("GALLERY VIEW");?></span></span></li>
            </ul>
        </div>

        <div class="setting  mode-scrollmenu">
            <h4><?php echo __("Scroll Menu Height");?></h4>
            <input class="regular-text" name="mode_scrollmenu_height" value="300"/>


        </div>



        <div class="setting  mode-zfolio">
            <h3><?php echo __("Skin"); ?></h3>
            <?php


            $lab = "mode_zfolio_skin";


            $arr_opts = array(
                array(
                    'value'=>'skin-forwall',
                    'label'=>__("Skin Forwall"),
                ),
                array(
                    'value'=>'skin-alba',
                    'label'=>__("Skin Alba"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_opts,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>
        </div>

        <div class="setting  mode-zfolio">
            <h3><?php echo __("Gap Size"); ?></h3>
            <?php


            $lab = "mode_zfolio_gap";


            $arr_opts = array(
                array(
                    'value'=>'30px',
                    'label'=>__("30px"),
                ),
                array(
                    'value'=>'1px',
                    'label'=>__("1px"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_opts,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>
        </div>

        <div class="setting  mode-zfolio">
            <h3><?php echo __("Layout"); ?></h3>
            <?php


            $lab = "mode_zfolio_layout";


            $arr_opts = array(
                array(
                    'value'=>'3columns',
                    'label'=>__("3 Columns"),
                ),
                array(
                    'value'=>'5columns',
                    'label'=>__("5 Columns"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_opts,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Navigation Type"); ?></h3>
            <?php


            $lab = "mode_gallery_view_nav_type";


            $arr_opts = array(
                array(
                    'value'=>'thumbs',
                    'label'=>__("Normal"),
                ),
                array(
                    'value'=>'thumbsandarrows',
                    'label'=>__("Thumbnails and Arrows"),
                ),
                array(
                    'value'=>'scroller',
                    'label'=>__("Scrollbar"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_opts,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Gallery Skin"); ?></h3>
            <?php


            $lab = 'mode_gallery_view_gallery_skin';
            $arr_opts = array(
                array(
                    'value'=>'skin_default',
                    'label'=>__("Default"),
                ),
                array(
                    'value'=>'skin_navtransparent',
                    'label'=>__("Navigation Transparent"),
                ),
                array(
                    'value'=>'skin_pro',
                    'label'=>__("Skin Pro"),
                ),
                array(
                    'value'=>'skin_boxy',
                    'label'=>__("Skin Boxy"),
                ),
                array(
                    'value'=>'skin_custom',
                    'label'=>__("Skin Custom"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_opts,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('Skin Custom can be modified via Designer Center.', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Gallery Skin"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_set_responsive_ratio_to_detect';

            $arr_off_on = array(
                array(
                    'value'=>'off',
                    'label'=>__("Off"),
                ),
                array(
                    'value'=>'on',
                    'label'=>__("On"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('The player can adjust to keep aspect ratio / no black bars', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Autoplay"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_autoplay';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('auto play the first video', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Autoplay Next Video"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_autoplaynext';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('auto play the first video', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Autoload First Video"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_cueFirstVideo';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('auto load the first video', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Enable Analytics"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_analytics_enable';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Force Width"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_width';


            echo DZSHelpers::generate_input_text($lab, array(
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('input a width - ie. "900" ( pixels ) or "100%" ', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Force Height"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_height';


            echo DZSHelpers::generate_input_text($lab, array(
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('input a height - ie. "900" ( pixels ) or "100%" - this will get overwritten if responsive ratio is set ', 'dzsvg'); ?></div>
        </div>




        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Navigation Type"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_nav_type';

            $arr_positions = array(
                array(
                    'value'=>'thumbs',
                    'label'=>__("Thumbnails"),
                ),
                array(
                    'value'=>'thumbsandarrows',
                    'label'=>__("Thumbnails and Arrows"),
                ),
                array(
                    'value'=>'scroller',
                    'label'=>__("Scroller"),
                ),
                array(
                    'value'=>'outer',
                    'label'=>__("Top"),
                ),
                array(
                    'value'=>'none',
                    'label'=>__("None"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_positions,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('choose the navigation between items type', 'dzsvg'); ?></div>
        </div>



        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Menu Item Width"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_html5designmiw';


            echo DZSHelpers::generate_input_text($lab, array(
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'val'=>'275',
            ));
            ?>

            <div class="sidenote"><?php echo __('input a width - ie. "200" ( pixels ) or "100%" - this will get overwritten if responsive ratio is set ', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Menu Item Height"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_html5designmih';


            echo DZSHelpers::generate_input_text($lab, array(
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'val'=>'100',
            ));
            ?>

            <div class="sidenote"><?php echo __('input a height - ie. "200" ( pixels ) or "100%" - this will get overwritten if responsive ratio is set ', 'dzsvg'); ?></div>
        </div>

        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Navigation Space"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_nav_space';


            echo DZSHelpers::generate_input_text($lab, array(
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'val'=>'0',
            ));
            ?>

            <div class="sidenote"><?php echo __('navigation space between video and navigation', 'dzsvg'); ?></div>
        </div>










        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Menu Position"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_menuposition';

            $arr_positions = array(
                array(
                    'value'=>'right',
                    'label'=>__("Right"),
                ),
                array(
                    'value'=>'bottom',
                    'label'=>__("Bottom"),
                ),
                array(
                    'value'=>'left',
                    'label'=>__("Left"),
                ),
                array(
                    'value'=>'top',
                    'label'=>__("Top"),
                ),
                array(
                    'value'=>'none',
                    'label'=>__("None"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_positions,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('Only available for the thumbnails / thumbnails and arrows / scroller navigation type', 'dzsvg'); ?></div>
        </div>



        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Play order"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_playorder';

            $arr_positions = array(
                array(
                    'value'=>'normal',
                    'label'=>__("Normal"),
                ),
                array(
                    'value'=>'reverse',
                    'label'=>__("Reverse"),
                ),
            );


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_positions,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('', 'dzsvg'); ?></div>
        </div>



        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Disable Video Title"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_disable_video_title';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('hide the video title', 'dzsvg'); ?></div>
        </div>


        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Enable Easing on Navigation Thumbnails"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_design_navigationuseeasing';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('', 'dzsvg'); ?></div>
        </div>


        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Enable Search Field"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_enable_search_field';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('', 'dzsvg'); ?></div>
        </div>


        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Enable Linking"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_settings_enable_linking';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('enable so that each video has it\'s own link and can be shared.', 'dzsvg'); ?></div>
        </div>


        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Autoplay Advertisment"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_autoplay_ad';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('autoplay adverts', 'dzsvg'); ?></div>
        </div>


        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Enable Embed Button"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_embedbutton';


            echo DZSHelpers::generate_select($lab, array(
                'options'=>$arr_off_on,
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('', 'dzsvg'); ?></div>
        </div>



        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Logo"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_logo';


            echo DZSHelpers::generate_input_text($lab, array(
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('', 'dzsvg'); ?></div>
        </div>



        <div class="setting  mode-gallery_view">
            <h3><?php echo __("Logo Link"); ?></h3>
            <?php

            $lab = 'mode_gallery_view_logoLink';


            echo DZSHelpers::generate_input_text($lab, array(
                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                'seekval'=>'',
            ));
            ?>

            <div class="sidenote"><?php echo __('', 'dzsvg'); ?></div>
        </div>



        <div class="setting  mode-zfolio">
            <h3><?php echo __("Enable Special Layout"); ?></h3>
            <?php


            $lab = "mode_zfolio_enable_special_layout";


            ?><div class="dzscheckbox skin-nova"><?php
            echo DZSHelpers::generate_input_checkbox($lab,array(
                'id' => $lab,
                'val' => 'on',
                'class' => ' dzs-dependency-field',));
            ?>
                <label for="<?php echo $lab; ?>"></label>
            </div>
        </div>

        <div class="setting  mode-list">
            <h3><?php echo __("Enable View Count"); ?></h3>
            <?php


            $lab = "mode_list_enable_view_count";


            ?><div class="dzscheckbox skin-nova"><?php
            echo DZSHelpers::generate_input_checkbox($lab,array(
                'id' => $lab,
                'val' => 'on',
                'class' => ' dzs-dependency-field ',));
            ?>
                <label for="<?php echo $lab; ?>"></label>
            </div>
        </div>


            <br>


        <link href='https://fonts.googleapis.com/css?family=Open+Sans:700' rel='stylesheet' type='text/css'>
        <style id="dzstabs_accordio_styling"></style>
        <div id="dzstabs_accordio" class="dzs-tabs auto-init skin-melbourne tab-menu-content-con---no-padding" data-options="{ 'design_tabsposition' : 'top'
,design_transition: 'fade'
,design_tabswidth: 'default'
,toggle_breakpoint : '10000'    
,refresh_tab_height: '2000'
,design_tabswidth: 'fullwidth'
,toggle_type: 'accordion'}">

            <div class="dzs-tab-tobe">
                <div class="tab-menu "><?php echo __("Linking Settings"); ?></div>
                <div class="tab-content">

                    <div class="sidenote" style="font-size:14px;"><?php echo __('Choose what clicking on the video item does','dzsvg'); ?></div>

                    <div class="linking_type-con">
                        <div class="setting  linking_type-all">
                            <h3><?php echo __("Link Type"); ?></h3>
                            <?php


                            $lab = "linking_type";


                            $arr_opts = array(
                                array(
                                    'value'=>'default',
                                    'label'=>__("Default"),
                                ),
                                array(
                                    'value'=>'zoombox',
                                    'label'=>__("Zoombox"),
                                ),
                                array(
                                    'value'=>'direct_link',
                                    'label'=>__("Direct Link"),
                                ),
                                array(
                                    'value'=>'vg_change',
                                    'label'=>__("Change Video Player"),
                                ),
                            );


                            echo DZSHelpers::generate_select($lab, array(
                                'options'=>$arr_opts,
                                'class'=>'dzs-style-me skin-beige  dzs-dependency-field',
                                'seekval'=>'',
                            ));
                            ?>
                            <div class="sidenote" style=";"><?php echo __('<strong>Default</strong> - means that the item click action will depend on the mode you chose and choose its default mode.  <br><strong>Zoombox</strong> - open the video in a lightbox. <br><strong>Direct Link</strong> - clicking will get the user to the video page.  <br><strong>Change Video Player</strong> - clicking will change a player current video.  ','dzsvg'); ?></div>
                        </div>



                        <div class="setting  linking_type-vg_change">
                            <h3><?php echo __("ID of Target Gallery");?></h3>
                            <input name="gallery_target" value="default"/>

                            <div class="sidenote" style=";"><?php echo __('','dzsvg'); ?></div>
                        </div>



                    </div>

                    <br>
                    <br>





                </div>
            </div>

            <div class="dzs-tab-tobe">
                <div class="tab-menu "><?php echo __("Video Player Settings"); ?></div>
                <div class="tab-content">

                    <?php


                    $vpconfigsstr = '';
                    foreach ($dzsvg->mainvpconfigs as $vpconfig) {
                        //print_r($vpconfig);
                        $vpconfigsstr .='<option value="'.$vpconfig['settings']['id'].'">'.$vpconfig['settings']['id'].'</option>';
                    }

                    ?>

                    <div class="sidenote" style="font-size:14px;"><?php echo __('Choose what clicking on the video item does','dzsvg'); ?></div>

                        <div class="setting mode-any">
                            <h3 class="setting-label"><?php echo __('Video Player Configuration','dzsvg'); ?></h3>
                            <select class=" dzs-style-me skin-beige  dzs-dependency-field" name="vpconfig">
                                <option value="default"><?php echo __('default','dzsvg'); ?></option>
                                <?php echo $vpconfigsstr; ?>
                            </select>
                            <div class="sidenote" style=""><?php echo __('setup these inside the <strong>Video Player Configs</strong> admin','dzsvg'); ?></div>
                        </div>








                    <br>
                    <br>





                </div>
            </div>




            <div class="dzs-tab-tobe">
                <div class="tab-menu "><?php echo __("Description Settings"); ?></div>
                <div class="tab-content">

                    <div class="sidenote" style="font-size:14px;"><?php echo __('Use these settings to control how many characters get shown from the video content.','dzsvg'); ?></div>

                    <div class="setting  mode-any">
                        <h3><?php echo __("Number of Characters");?></h3>
                        <input name="desc_count" value="default"/>

                        <div class="sidenote" style=";"><?php echo __('Leave this to <strong>default</strong> in order for the number of characters to get best displayed based on the Mode.. ','dzsvg'); ?></div>
                    </div>

                    <br>
                    <br>





                </div>
            </div>

            <div class="dzs-tab-tobe ">
                <div class="tab-menu ">
                    <?php echo __("Pagination Settings"); ?>
                </div>
                <div class="tab-content">
                    <div class="sidenote" style="font-size:14px;"><?php echo __('Useful if you have many videos and you want to separate them somehow.','dzsvg'); ?></div>

                    <!--                <div class="setting  mode-any">-->
                    <!--                    <h3>--><?php //echo __("Select a Pagination Method"); ?><!--</h3>-->
                    <!--                    <select class="styleme" name="dzsvg_settings_separation_mode">-->
                    <!--                        <option>normal</option>-->
                    <!--                        <option>pages</option>-->
                    <!--                        <option>scroll</option>-->
                    <!--                        <option>button</option>-->
                    <!--                    </select>-->
                    <!---->
                    <!--                </div>-->
                    <div class="setting  mode-any">
                        <h3><?php echo __("Select Number of Items per Page");?></h3>
                        <input name="count" value="5"/>


                    </div>
                    <br>
                    <br>
                </div>
            </div>



            <div class="dzs-tab-tobe">
                <div class="tab-menu ">
                    <?php echo __("Sample Data"); ?>
                </div>
                <div class="tab-content">

                    <div class="sidenote" style="font-size:14px;"><?php echo __('Import any of these examples with one click. ','dzsvg'); ?><form class="no-style import-sample-galleries" method="post"><button name="action" value="dzsvg_import_galleries"><?php echo ("Import sample galeries"); ?></button></form></div>

                    <div class="dzs-container">
                        <div class="one-fourth ">
                            <div class="feat-sample-con  import-sample import-showcase-sample-1">

                                <img class="feat-sample " src="https://c3.staticflickr.com/8/7381/28034570402_7c4cd15dbe.jpg"/>
                                <h4><?php echo __("9GAG.TV example"); ?></h4>
                            </div>
                        </div>
                        <div class="one-fourth ">
                            <div class="feat-sample-con  import-sample import-showcase-sample-2">

                                <img class="feat-sample " src="http://i.imgur.com/iO1P255.png"/>
                                <h4><?php echo __("Vimeo User Channel Wall"); ?></h4>
                            </div>
                        </div>
<!--                        <div class="one-fourth ">-->
<!--                            <div class="feat-sample-con  import-sample import-sample-2">-->
<!---->
<!--                                <img class="feat-sample " src="--><?php //echo $dzsvg->base_url; ?><!--img/sample_2.jpg"/>-->
<!--                                <h4>--><?php //echo __("YouTube Channel"); ?><!--</h4>-->
<!--                            </div>-->
<!--                        </div>-->
<!---->
<!---->
<!--                        <div class="one-fourth ">-->
<!--                            <div class="feat-sample-con  import-sample import-sample-3">-->
<!---->
<!--                                <img class="feat-sample " src="--><?php //echo $dzsvg->base_url; ?><!--img/sample_3.jpg"/>-->
<!--                                <h4>--><?php //echo __("Ad Before Video"); ?><!--</h4>-->
<!--                            </div>-->
<!--                        </div>-->
<!--                        <div class="one-fourth ">-->
<!--                            <div class="feat-sample-con  import-sample import-sample-4">-->
<!---->
<!--                                <img class="feat-sample " src="--><?php //echo $dzsvg->base_url; ?><!--img/sample_4.jpg"/>-->
<!--                                <h4>--><?php //echo __("Balne Layout"); ?><!--</h4>-->
<!--                            </div>-->
<!--                        </div>-->
                    </div>



                </div>
            </div>


        </div>
        <div class="clear"></div>
        <br/>
        <br/>
        <button id="insert_tests" class="button-primary insert-tests"><?php echo __("Insert Gallery"); ?></button>
        <div class="shortcode-output"></div>
    </div>
    <div class="feedbacker"><i class="fa fa-circle-o-notch fa-spin"></i><?php echo __(" Loading... "); ?></div>
</div><?php
}