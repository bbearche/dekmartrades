<?php

//print_r($this);

$items = $this->mainitems;
$arr_sliders2 = array();


for ($i = 0; $i < count($items); $i++) {
//print_r($items[$i]);
    $aux = array(
        'label'=>$items[$i]['settings']['id'],
        'value'=>$items[$i]['settings']['id'],
    );

    array_push($arr_sliders2, $aux);
}
//print_r($arr_sliders2);

$arr_separations = array(
    array(
        'label'=>__("none"),
        'value'=>"normal",
    ),
    array(
        'label'=>__("Pages"),
        'value'=>"pages",
    ),
    array(
        'label'=>__("Scroll"),
        'value'=>"scroll",
    ),
    array(
        'label'=>__("Button"),
        'value'=>"button",
    ),
);

$arr_dbs = array();


foreach ($this->dbs as $mainitem) {
    array_push($arr_dbs,$mainitem);
}

$this->options_array_playlist = array(


    'slider' => array(
        'type' => 'select',
        'title' => __("Gallery"),
        'sidenote' => __("create galleries in video gallery admin"),

        'holder' => 'div',
        'context' => 'content',
        'options' => $arr_sliders2,
        'default' => 'default',
    ),

    'db' => array(
        'type' => 'select',
        'title' => __("Gallery Database"),
        'sidenote' => __("create galleries in video gallery admin"),

        'context' => 'content',
        'options' => $arr_dbs,
        'default' => 'main',
    ),
    'settings_separation_mode' => array(
        'type' => 'select',
        'title' => __("Pagination Type"),
        'sidenote' => __("autoplay the videos"),

        'context' => 'content',
        'options' => $arr_separations,
        'default' => 'normal',
    ),
    'settings_separation_pages_number' => array(
        'type' => 'text',
        'title' => __("Videos per Page"),
        'sidenote' => __("the number of items per 'page'"),

        'context' => 'content',
        'default' => '5',
    ),
);