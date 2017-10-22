<?php /* Wrapper Name: Header */ ?>

<div class="header_box">

	<div class="row">
		<div class="span9">
			<div class="header_widget"><?php dynamic_sidebar("header-sidebar"); ?></div>
		</div>
		
		<div class="span3">
			<!-- Social Links -->
			<div class="social-nets-wrapper" data-motopress-type="static" data-motopress-static-file="static/static-social-networks.php">
				<?php get_template_part("static/static-social-networks"); ?>
			</div>
			<!-- /Social Links -->
		</div>
	</div>
	
</div>

<div class="header_block">
	<div class="row">
		<div class="span2" data-motopress-type="static" data-motopress-static-file="static/static-logo.php">
			<?php get_template_part("static/static-logo"); ?>
		</div>
		
		<div class="span10">
			<div data-motopress-type="static" data-motopress-static-file="static/static-nav.php">
				<?php get_template_part("static/static-nav"); ?>
			</div>
			<div class="hidden-phone" data-motopress-type="static" data-motopress-static-file="static/static-search.php">
				<?php get_template_part("static/static-search"); ?>
			</div>
		</div>
	</div>
</div>
