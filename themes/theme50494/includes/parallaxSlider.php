<?php
	$rand_id = uniqid();

	// WPML filter
	$suppress_filters = get_option('suppress_filters');

	// Get Order & Orderby Parameters
	$orderby = ( of_get_option('slider_posts_orderby') ) ? of_get_option('slider_posts_orderby') : 'date';
	$order   = ( of_get_option('slider_posts_order') ) ? of_get_option('slider_posts_order') : 'DESC';
	

	// query
	$args = array(
		'post_type'        => 'slider',
		'posts_per_page'   => -1,
		'post_status'      => 'publish',
		'orderby'          => $orderby,
		'order'            => $order,
		'suppress_filters' => $suppress_filters
		);
	$slides = get_posts($args);
	if (empty($slides)) return;
?>

<script type="text/javascript">
		jQuery(function() {
			var isparallax = true;
			if(!device.mobile() && !device.tablet()){
				isparallax = true;
			}else{
				isparallax = false;
			}

				jQuery('#parallax-slider-<?php echo $rand_id ?>').parallaxSlider({
					animateLayout: "<?php echo of_get_option( 'px_slider_effect', 'simple-fade-eff' ); ?>"
				,	parallaxEffect: isparallax
				,	duration: <?php echo of_get_option( 'px_slider_speed', 1500 ); ?>
				,	autoSwitcher: <?php echo of_get_option( 'px_slider_auto', true ); ?>
				,	autoSwitcherDelay: <?php echo of_get_option( 'px_slider_pause', 7000 ); ?>
				,	slider_navs: <?php echo of_get_option( 'px_slider_navs', true ); ?>
				,	slider_pagination: <?php echo of_get_option( 'px_slider_pags', true ); ?>
				,	parallaxInvert: false
				});
			
		});
</script>

<?php
	$resutlOutput.= '<div id="parallax-slider-'.$rand_id.'" class="parallax-slider">';
		$resutlOutput.= '<ul class="baseList">';
			foreach( $slides as $k => $slide ) {
				$url                = get_post_meta($slide->ID, 'my_slider_url', true);
				//$sl_image_url       = wp_get_attachment_image_src( get_post_thumbnail_id($slide->ID), 'slider-post-thumbnail');
				$sl_image_url       = wp_get_attachment_image_src( get_post_thumbnail_id($slide->ID), 'full');
				$caption            = get_post_meta($slide->ID, 'my_slider_caption', true);

				if ( $sl_image_url[0]=='' ) {
					$sl_image_url[0] = PARENT_URL."/images/blank.gif";
				}
				if ( $url=='' ) {
					$url = "#";
				}
				$resutlOutput.= '<li data-preview="'. $sl_image_url[0] .'" data-img-width="'. $sl_image_url[1] .'" data-img-height="'. $sl_image_url[2] .'" data-ulr-link="'. $url .'">';
					if ($caption) {
						$resutlOutput.= '<div class="slider_caption>">';
						$resutlOutput.= stripslashes(htmlspecialchars_decode($caption));
						$resutlOutput.= '</div>';
					}
				$resutlOutput.= '</li>';
				
			}
		$resutlOutput.= '</ul>';
	$resutlOutput.= '</div>';

	echo $resutlOutput;
	wp_reset_postdata();
?>

