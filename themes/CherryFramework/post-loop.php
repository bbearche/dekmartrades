<?php
	wp_reset_query(); 
	query_posts(array('posts_per_page' => 3));
	if(have_posts() ) : 
?>
	<section class="recent-posts">
		<div class="post-container">
			<h1 class="centered section-title blue">RECENT BLOG POSTS</h1>

			<?php while(have_posts()) : the_post(); 	?>
				<div class="blog-post left-float third-width">
					<a href="<?php the_permalink(); ?>">
						<div class="post-thumb">
							<?php the_post_thumbnail(); ?>
							<span class="overlay black viewmore"></span>
						</div>
					</a>
					<div class="post-text">
						<a href="<?php the_permalink(); ?>">
							<h2><?php the_title(); ?></h2>
						</a>
						<a href="<?php the_permalink(); ?>" class="post-more">Read More</a>
					</div>
				</div>
			<?php endwhile; ?>
			<div class="flt-clr"></div>
		</div>
	</section>
<?php endif; 
	wp_reset_query(); 
?> 