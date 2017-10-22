function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
jQuery(document).ready(function($) {


    var dragelement = null;

    var cthis = $('.dzsvg-reclam-builder').eq(0);

    cthis.on('mousedown', '.reclam-marker > .icon',handle_mouse);
    cthis.on('click', '.scrub-bg, .dzstooltip--content > .delete-btn',handle_mouse);
    cthis.on('mousemove',handle_mouse);
    cthis.on('submit',handle_submit);
    $(document).on('mouseup', '.reclam-marker',handle_mouse);






    var start_array = [];

    console.info(window.ad_builder_start_array)
    if(window.ad_builder_start_array){
        // window.ad_builder_start_array = String(window.ad_builder_start_array).replace(/(<iframe.*?src=)(\\".*?)(\\")(.*?<\/iframe>)/g, "$1\\$2\\$3$4");
        window.ad_builder_start_array = String(window.ad_builder_start_array).replace(/(<iframe.*?src=)(".*?)(")(.*?<\/iframe>)/g, "$1\\$2\\$3$4");
        console.info('transformed - ',window.ad_builder_start_array)
        try{
            start_array = JSON.parse(window.ad_builder_start_array);
        }catch(err){

            console.info('parse error - ',err);
        }
    }

    console.info(start_array);
    for(var i2 in start_array){

        generate_ad_marker(start_array[i2])
    }



    // generate_ad_marker({
    //
    //     source:''
    //     ,type:'image'
    //     ,time:'0.75'
    //     ,ad_link:''
    //     ,skip_delay:''
    // })


    function generate_ad_marker(pargs){


        var margs = {
            source:''
            ,type:'detect'
            ,time:'0'
            ,ad_link:''
            ,skip_delay:''
        }


        if(pargs){
            margs = $.extend(margs,pargs);
        }




        margs.time = Number(margs.time);

        var aux = '';

        aux+='<div class="reclam-marker dzstooltip-con" style="left: '+(margs.time*100)+'%;"> <div class="icon"></div> <div class="dzstooltip align-center skin-black arrow-top" style="top: 100%; margin-top: 20px; width: 200px; text-align: center;"> <div class="dzstooltip--selector-top"></div> <div class="dzstooltip--content"> <h6>SOURCE</h6> <input class="dzs-input" type="text" name="source[]" value="'+htmlEntities(margs.source)+'"> <button class="dzsvg-wordpress-uploader button-secondary">Upload</button> <h6>TYPE</h6> <select class="dzs-style-me skin-beige" name="type[]"> <option>detect</option> <option>video</option> <option>youtube</option> <option>vimeo</option> <option>image</option> <option>inline</option> </select> <h6>TIME</h6> <input class="dzs-input" type="text" name="time[]" value="'+margs.time+'">  <h6>Ad Link</h6> <input class="dzs-input" type="text" name="ad_link[]" value="'+margs.ad_link+'">  <h6>Skip Delay</h6> <input class="dzs-input" type="text" name="skip_delay[]" value="'+margs.skip_delay+'"> <br> <br> <div class="delete-btn">x</div> </div> </div> </div>';

        cthis.find('.scrubbar-con').append(aux);


        cthis.find('select[name="type[]"]').last().val(margs.type);

        dzssel_init('select.dzs-style-me', {init_each: true});

    }


    function handle_mouse(e){
        var _t = $(this);

        if(e.type=='mousedown'){

            dragelement = _t.parent();

        }
        if(e.type=='mousemove'){

            var mx = e.clientX - cthis.offset().left;

            if(dragelement){
                var rat = mx/_t.width();

                console.info(dragelement, mx, rat);
                dragelement.css({
                    'left':rat*100+'%'
                })

                dragelement.find('input[name="time[]"]').val(Number(rat).toFixed(3));
            }

        }
        if(e.type=='mouseup'){
            dragelement = null;

        }
        if(e.type=='click'){


            if(_t.hasClass('scrub-bg')){

                var mx = e.clientX - cthis.offset().left;

                var rat = mx/_t.width();


                console.info(rat);

                generate_ad_marker({
                    time: rat
                })

            }

            if(_t.hasClass('delete-btn')){

                _t.parent().parent().parent().remove();
            }

        }
    }


    function handle_submit(e){
        var _t = $(this);

        if(e.type=='submit'){

            if(_t.hasClass('dzsvg-reclam-builder')){


                var mainarray = _t.serialize();

                var data = {
                    action: 'dzsvg_ajax_json_encode_ad'
                    ,postdata: mainarray
                };


                var ajaxurl = '';
                if(window.ajaxurl){

                    ajaxurl =window.ajaxurl;
                }else{

                    ajaxurl="ajax_json_encode_ad.php";
                }

                jQuery.post(ajaxurl, data, function(response) {
                    if(window.console ){
                        console.log('Got this from the server: ' + response);
                    }

                    $('.output').text(response);
                    console.info(parent.ad_target_field, parent.close_ultibox)
                    if(parent.ad_target_field){
                        parent.ad_target_field.val(response);
                    }

                    if(parent.close_ultibox){
                        parent.close_ultibox();
                    }
                });






                return false;
            }

        }
    }
});
