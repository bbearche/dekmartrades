(function($){
    // Bind the function to global jQuery object.
    $.fn.reveal = function(){
        // Arguments is a variable which is available within all functions
        // and returns an object which holds the arguments passed.
        // It is not really an array, so by calling Array.prototype
        // he is actually casting it into an array.
        var args = Array.prototype.slice.call(arguments);

        // For each elements that matches the selector:
        return this.each(function(){
            // this is the dom element, so encapsulate the element with jQuery.
            var img = $(this),
                src = img.data("src");

            // If there is a data-src attribute, set the attribute
            // src to make load the image and bind an onload event.
            src && img.attr("src", src).load(function(){
                // Call the first argument passed (like fadeIn, slideIn, default is 'show').
                // This piece is like doing img.fadeIn(1000) but in a more dynamic way.
                img[args[0]||"show"].apply(img, args.splice(1));
            });
        });
    }
}(jQuery));
$(document).on("mouseover", ".stock_tooltip", function() {
	$("img", this).reveal();
});
