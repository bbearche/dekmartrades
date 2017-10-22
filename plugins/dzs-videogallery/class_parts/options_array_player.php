<?php

//print_r($this);


$arr_off_on = array(
    array(
        'label'=>__("Off"),
        'value'=>'off',
    ),
    array(
        'label'=>__("On"),
        'value'=>'on',
    ),
);

$arr_on_off = array(
    array(
        'label'=>__("On"),
        'value'=>'on',
    ),
    array(
        'label'=>__("Off"),
        'value'=>'off',
    ),
);
$arr_default_detect = array(
    array(
        'label'=>__("Default"),
        'value'=>'default',
    ),
    array(
        'label'=>__("Detect"),
        'value'=>'detect',
    ),
);

$types = array(
    array(
        'label'=>__("Video"),
        'value'=>'normal',
    ),
    array(
        'value'=>'youtube',
        'label'=>__("YouTube"),
    ),
    array(
        'value'=>'vimeo',
        'label'=>__("Vimeo"),
    ),
    array(
        'value'=>'image',
        'label'=>__("Image"),
    ),
);
$this->options_array_player = array(



    'source' => array(
        'type' => 'upload',
        'library_type' => 'video',
        'class' => '',
        'title' => __("Source"),
        'sidenote' => __("The source, input a mp4 or a youtube link or a youtube id or a vimeo link or a vimeo id"),

        'context' => 'content',
        'default' => __( 'The link to a mp4', 'dzsvg' ),
    ),
    'config' => array(
        'type' => 'select',
        'title' => __("Video Player Configuration"),
        'sidenote' => __("the video player configuration , can be edited in Video Gallery > Player Configurations"),

        'context' => 'content',
        'options' => $this->video_player_configs,
        'default' => 'default',
    ),
    'cover' => array(
        'type' => 'image',
        'title' => __("Cover"),
        'sidenote' => __("cover image to show before video play"),

        'context' => 'content',
        'default' => '',
    ),
    'autoplay' => array(
        'type' => 'select',
        'title' => __("Autoplay"),
        'sidenote' => __("autoplay the videos"),

        'context' => 'content',
        'options' => $arr_off_on,
        'default' => 'off',
    ),
    'cue' => array(
        'type' => 'select',
        'title' => __("Preload Video"),
        'sidenote' => __("preload the video"),

        'context' => 'content',
        'options' => $arr_off_on,
        'default' => 'off',
    ),
    'loop' => array(
        'type' => 'select',
        'title' => __("Loop"),
        'sidenote' => __("loop the video on end"),

        'context' => 'content',
        'options' => $arr_off_on,
        'default' => 'off',
    ),
    'type' => array(
        'type' => 'select',
        'title' => __("Type"),
        'sidenote' => __("media type"),

        'context' => 'content',
        'options' => $types,
        'default' => 'normal',
    ),
    'link' => array(
        'type' => 'text',
        'title' => __("Link"),
        'sidenote' => __("If link button is enabled in the player configurations, then you can set a link here"),

        'context' => 'content',
        'default' => '',
    ),
    'link_label' => array(
        'type' => 'text',
        'title' => __("Link Label"),
        'sidenote' => __("If link button is enabled in the player configurations, then you can set a link here"),

        'context' => 'content',
        'default' => '',
    ),
    'logo' => array(
        'type' => 'image',
        'title' => __("Logo"),
        'sidenote' => __("logo"),

        'context' => 'content',
        'default' => '',
    ),
    'extra_classes_player' => array(
        'type' => 'text',
        'title' => __("Extra Classes to the Player"),
        'sidenote' => __("enter a extra css class for the player for example, entering \"with-bottom-shadow\" will create a shadow underneath the player"),

        'context' => 'content',
        'default' => '',
    ),
    'height' => array(
        'type' => 'text',
        'title' => __("Height"),
        'sidenote' => __("Force a height in pixels"),

        'context' => 'content',
        'default' => '',
    ),
    'responsive_ratio' => array(
        'type' => 'select',
        'title' => __("Resize Proportionally"),
        'sidenote' => __("Try to remove black bars of the video by resizing height proportional to width"),

        'context' => 'content',
        'default' => '',
        'options' => $arr_default_detect,
    ),
    'title' => array(
        'type' => 'text',
        'title' => __("Title"),
        'sidenote' => __("title to appear on the left top"),

        'context' => 'content',
        'default' => 'default',
    ),
    'description' => array(
        'type' => 'text',
        'title' => __("Description"),
        'sidenote' => __("description to appear if the info button is enabled in video player configurations"),

        'context' => 'content',
        'default' => '',
    ),
    'mediaid' => array(
        'type' => 'text',
        'title' => __("Link to Product"),
        'sidenote' => __("link to a media element ID or woocommerce product ID"),

        'context' => 'content',
        'default' => '',
    ),
);