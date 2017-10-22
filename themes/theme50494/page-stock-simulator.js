$(document).on("submit",function(e){
    e.preventDefault();
    if ($('#terms-check-main').is(':checked')) {
        e.target.submit(); // submit bypassing the jQuery bound event
    }
});

