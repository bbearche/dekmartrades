<?php

/**
 * Element Definition
 */


//          extends Cornerstone_Element_Base
class CS_DZSVG_PLAYLIST  {



	public function ui() {
//		global $dzstln; print_r($dzstln->post_types);
		return array(
      'title'       => __( 'Video Player Playlist', 'dzsvg' ),
      'autofocus' => array(
    		'heading' => 'h4.my-first-element-heading',
    		'content' => '.dzsvg-element'
    	),
    	'icon_group' => 'dzsvg'
    );
	}

	public function update_build_shortcode_atts( $atts ) {

		// This allows us to manipulate attributes that will be assigned to the shortcode
		// Here we will inject a background-color into the style attribute which is
		// already present for inline user styles
		if ( !isset( $atts['style'] ) ) {
			$atts['style'] = '';
		}


		if ( isset( $atts['background_color'] ) ) {
			$atts['style'] .= ' background-color: ' . $atts['background_color'] . ';';
			unset( $atts['background_color'] );
		}

		return $atts;

	}

    public function controls(){

        global $dzsvg;

//        error_log(print_rr($dzsvg->options_array_player, array('echo'=>false)));




        $options_array = array();
        foreach($dzsvg->options_array_playlist as $lab => $opt){

            $options_array[$lab] = array(
                'type'=>$opt['type'],
                'ui' => array(
                    'title' => $opt['title'],
                ),
                'context' => $opt['context'],
            );

            if(isset($opt['sidenote'])){
                $options_array[$lab]['ui']['tooltip'] = $opt['sidenote'];
            }
            if(isset($opt['default'])){
                $options_array[$lab]['suggest'] = $opt['default'];
            }
            if(isset($opt['options'])){
                $options_array[$lab]['options']['choices'] = $opt['options'];
            }
        }

//        error_log(print_rr($options_array, array('echo'=>false)));

        return $options_array;



    }

    public function render( $atts ) {

		// This allows us to manipulate attributes that will be assigned to the shortcode
		// Here we will inject a background-color into the style attribute which is
		// already present for inline user styles


//        print_r($atts);

	}





}






//class CS_Dzsvg extends Cornerstone_Element_Base {
//
//    public function data() {
////        return array(
////            'name'        => 'tabs',
////            'title'       => __( 'Tabs2', 'cornerstone' ),
////            'section'     => 'content',
////            'description' => __( 'Tabs description2.', 'cornerstone' ),
////            'supports'    => array( 'class' ),
////            'renderChild' => true
////        );
//
//        return array(
//            'name'        => 'tabs',
//            'title'       => __( 'Dzsvg', 'dzsvg' ),
//            'section'       => 'content',
//            'autofocus' => array(
//                'heading' => 'h4.my-first-element-heading',
//                'content' => '.dzsvg-element'
//            ),
//            'icon_group' => 'dzsvg'
//        );
//
//    }
//
//    public function controls() {
//
////        $this->addControl(
////            'elements',
////            'sortable',
////            __( 'Tabs', 'cornerstone' ),
////            __( 'Add a new tab.', 'cornerstone' ),
////            array(
////                array( 'title' => __( 'Tab 1', 'cornerstone' ), 'content' => __( 'The content for your Tab goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pretium, nisi ut volutpat mollis, leo risus interdum arcu, eget facilisis quam felis id mauris. Ut convallis, lacus nec ornare volutpat, velit turpis scelerisque purus, quis mollis velit purus ac massa. Fusce quis urna metus. Donec et lacus et sem lacinia cursus.', 'cornerstone' ), 'active' => true ),
////                array( 'title' => __( 'Tab 2', 'cornerstone' ), 'content' => __( 'The content for your Tab goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque pretium, nisi ut volutpat mollis, leo risus interdum arcu, eget facilisis quam felis id mauris. Ut convallis, lacus nec ornare volutpat, velit turpis scelerisque purus, quis mollis velit purus ac massa. Fusce quis urna metus. Donec et lacus et sem lacinia cursus.', 'cornerstone' ) )
////            ),
////            array(
////                'element'  => 'tab',
////                'newTitle' => __( 'Tab %s', 'cornerstone' ),
////                'floor'    => 2,
////                'capacity' => 5
////            )
////        );
////
////        $this->addControl(
////            'nav_position',
////            'choose',
////            __( 'Navigation Position', 'cornerstone' ),
////            __( 'Choose the positioning of your navigation for your tabs.', 'cornerstone' ),
////            'top',
////            array(
////                'columns' => '3',
////                'choices' => array(
////                    array( 'value' => 'top',   'tooltip' => __( 'Top', 'cornerstone' ),   'icon' => fa_entity( 'arrow-up' ) ),
////                    array( 'value' => 'left',  'tooltip' => __( 'Left', 'cornerstone' ),  'icon' => fa_entity( 'arrow-left' ) ),
////                    array( 'value' => 'right', 'tooltip' => __( 'Right', 'cornerstone' ), 'icon' => fa_entity( 'arrow-right' ) )
////                )
////            )
////        );
//
//
//
//
//        $this->addControl('mode','select',__( 'Mode', 'zoomtimeline' ), __( 'Choose to display the heading vertically or horizonatally', 'zoomtimeline' ),'mode-default',array(
//            'choices' => array(
//                array( 'value' => 'mode-default', 'label' => __('Default')),
//                array( 'value' => 'mode-oncenter', 'label' => __('On Center')),
//                array( 'value' => 'mode-slider', 'label' => __('Timeline Slider')),
//                array( 'value' => 'mode-slider-variation', 'label' => __('Slider Variation')),
//                array( 'value' => 'mode-yearslist', 'label' => __('Years List')),
//                array( 'value' => 'mode-blackwhite', 'label' => __('Black and White')),
//                array( 'value' => 'mode-masonry', 'label' => __('Masonry')),
//            ),
//        ));
//
//
//
//    }
//
//    public function render( $atts ) {
//
//        print_r($atts);
//
//        $fout = '';
//
//        return $fout;
//
//    }
//
//}
