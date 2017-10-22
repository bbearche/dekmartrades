<?php

//print_r($this->mainoptions);


?>
<style>
    .about-text{
        font-size: 16px;
        color: #444444;
        margin-top: 15px;
    }
    .white-bg{
        background-color: #ffffff;
        padding: 15px;
        box-shadow: 0 1px 3px 0 rgba(0,0,0,0.15);

    }
    .white-bg .vplayer{
        transform: scale(1);
        transform-origin: center center;
        box-shadow: 0 0 5px 0 rgba(0,0,0,0);
        transition-property: opacity, visibility, top, height, transform,box-shadow;
    }
    .white-bg .vplayer:hover{
        transform: scale(1.3);
        z-index: 9999999999;
        box-shadow: 0 0 5px 0 rgba(0,0,0,0.5);

    }
    .white-bg h4{
        margin-top:0;

    }
</style>
<script>
    jQuery(document).ready(function($){
        $(document).on('mouseover','.vplayer', function(){
            if($(this).get(0) && $(this).get(0).api_playMovie){

                $(this).get(0).api_playMovie();
            }
        })
    })
</script>
    <div class="wrap wrap-dzsvg-about">
        <h1><?php echo __("Welcome to DZS Video Gallery "); echo DZSVG_VERSION; ?></h1>
        <div class="about-text"><?php echo __("
            Congratulations! You are about to use the most powerful video gallery."); ?>	</div>
        <p class="useful-links">
            <a href="<?php echo admin_url('admin.php?page=dzsvg_menu'); ?>" target=""
               class="button-primary action"><?php _e('Gallery Admin', 'dzsvg'); ?></a>
            <a href="<?php echo $this->thepath; ?>readme/index.html"
               class="button-secondary action"><?php _e('Documentation', 'dzsvg'); ?></a>
            <a href="<?php echo admin_url('admin.php?page=dzsvg-dc'); ?>" target="_blank"
               class="button-secondary action"><?php _e('Go to Designer Center', 'dzsvg'); ?></a>
        </p>
<div class="dzs-row">
    <div class="dzs-col-md-6">

        <div class="white-bg">

            <div  class="vplayer-tobe auto-init skin_noskin" data-videoTitle="How to setup gallery quick demo" data-type="youtube" data-src="https://www.youtube.com/watch?v=HtvJp80qE74" data-loop="on" data-responsive_ratio="0.562" data-options='{
            autoplay: "off"
            ,autoplay_on_mobile_too_with_video_muted: "on"
            ,settings_suggestedQuality: "hd1080"
}'></div>

            <p>
<?php
echo sprintf(__("This is how easy it is to create new galleries. Just add your items, choose your settings, and embed the gallery into any page. "));
?>
            </p>
            <p>
<?php
echo sprintf(__("Multiple options like menu position, display mode, video description style, video items sorting can be chosen for each gallery. And options like looping, autoplay, cover images can be chosen for each individual item" ));
?>
            </p>
        </div>
    </div>
    <div class="dzs-col-md-6">

        <div class="white-bg">
            <div  class="vplayer-tobe auto-init skin_noskin" data-videoTitle="How to setup video items" data-type="youtube" data-src="https://www.youtube.com/watch?v=ZV9SfTCqgBc" data-loop="on" data-responsive_ratio="detect" data-options='{
            autoplay: "off"
            ,autoplay_on_mobile_too_with_video_muted: "on"
}'></div>
<p>
<?php
echo sprintf(__("For creating video items with their own page and comments, you can use the custom video items page. These items have multiple layouts and can be added to any page via the awesome Video Showcase shortcode generator"));
?></p>
<p>
<?php
echo sprintf(__("You can even allow your visitors to upload videos from youtube or self hosted if the %sVideo Portal%s addon is installed"),'<strong>','</strong>');
?></p>
        </div>
    </div>
</div>
        <br>
<div class="dzs-row">
    <div class="dzs-col-md-6">

        <div class="white-bg">

            <h4><?php echo __("One click sample data"); ?></h4>

            <img src="http://i.imgur.com/g3TzzAX.png" class="fullwidth"/>

            <p>
<?php
echo sprintf(__("Want to import some sample content from the video gallery demo ? Shortcode generator comes to your help with sample data. The sample data tab allows for quick one click import of some demos."));
?>
            </p>

        </div>
    </div>
    <div class="dzs-col-md-6">

        <div class="white-bg">

            <h4><?php echo __("Shortcode Generator"); ?></h4>

            <img src="http://i.imgur.com/ywIMGVg.jpg" class="fullwidth"/>

            <p>
<?php
echo sprintf(__("DZS Video Gallery is very easy to use - it is based on shortcodes but you do not need to remember any shortcodes - the included shortcode generator makes life easy by getting a visual interface for selecting / customizing settings of the gallery."));
?>
            </p>

        </div>
    </div>

</div>

        <br>
        <a href="<?php echo admin_url('admin.php?page=dzsvg_menu&donotshowaboutagain=on'); ?>" target=""
           class="button-primary action"><?php _e('Got it! Lets go.', 'dzsvg'); ?></a>
    </div>
<?php
