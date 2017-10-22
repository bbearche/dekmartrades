<?php
/**
* Template Name: Chatrooms Page
*/

get_header(); ?>

<div class="motopress-wrapper content-holder clearfix">
	<div style="width: 95%; margin: 0 auto;" class="chatroom-container container">
		<div style="margin: 0 !important;" class="row">
			<div class="<?php echo cherry_get_layout_class( 'full_width_content' ); ?>" data-motopress-wrapper-file="page-fullwidth.php" data-motopress-wrapper-type="content" style="width: 100%; margin: 0px;">
				<div style="margin: 0 !important;" class="row">
					<div class="<?php echo cherry_get_layout_class( 'full_width_content' ); ?>" data-motopress-type="static" data-motopress-static-file="static/static-title.php">
						<?php get_template_part("static/static-title"); ?>
					</div>
				</div>
				<div style="margin-left: 0px; padding-top: 5px;" id="content" class="row">
					<div class="<?php echo cherry_get_layout_class( 'full_width_content' ); ?>" data-motopress-type="loop" data-motopress-loop-file="loop/loop-page.php" style="width: 100%; margin: 0px;">
						<?php get_template_part("loop/loop-page"); ?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<?php 
get_footer(); 
echo do_shortcode('[notepad_embed]');
?>
