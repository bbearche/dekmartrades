jQuery(document).ready(function($){


    console.warn('what what');


    // ajax_get_all_post_types();





    setTimeout(function(){


        if(window.cs){

            cs.listenTo( cs.events, 'inspect:element', function(e,e2,e3){
                console.info('inspect element', e,e2,e3);

                //ajax_get_all_post_types();


                console.info($('.cs-control[data-name="source"]'));
                if(e.attributes._type=='dzsvg') {
                    $('.cs-control[data-name="source"]').each(function () {
                        var _t = $(this);

                        _t.find('input[type="text"]').addClass('input-big-image upload-target-prev upload-type-video ');

                        if (_t.find('.upload-for-target').length == 0) {
                            console.info("YESYES");
                            _t.find('input[type="text"]').after('<a href="#" class="button-secondary dzsvg-wordpress-uploader">Upload</a>');
                        }
                    })
                }
            } );
        }
    },10);



    // function ajax_get_all_post_types(){
    //
    //     var data = {
    //         action: 'dzstln_get_all_post_types',
    //         //postdata: mainarray
    //     };
    //
    //
    //
    //     // console.info(ajaxurl);
    //     $.post(ajaxurl , data, function(response) {
    //         if(window.console !=undefined ){
    //             console.log('Got this from the server: ' + response);
    //         }
    //
    //         //console.log($('.cs-control-select[data-name="post_type"]'));
    //
    //         //$('.cs-control-select[data-name="post_type"] select').append(response);
    //     });
    // }
});

