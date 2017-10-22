$( document ).ready(function() {
	var $btns = $('.btn').click(function() {
	  if (this.id == 'all') {
		$('.sliderCon > div').fadeIn(450);
	  } else {
		var $el = $('[class*=' + this.id + ']').fadeIn(450);
		$('.sliderCon > div').not($el).hide();
	  }
	  $btns.removeClass('active');
	  $(this).addClass('active');
	})
});
