


function get_query_arg(purl, key){
    //console.log(purl, key)
    if (purl.indexOf(key + '=') > -1) {
        //faconsole.log('testtt');
        var regexS = "[?&]" + key + "(.+?)(?=&|$)";
        var regex = new RegExp(regexS);
        var regtest = regex.exec(purl);


        //console.info(regex, regtest);
        if (regtest != null) {
            //var splitterS = regtest;


            if (regtest[1]) {
                var aux = regtest[1].replace(/=/g, '');
                return aux;
            } else {
                return '';
            }


        }
        //$('.zoombox').eq
    }
}




function get_query_arg_nr(purl){
    //console.log(purl, key)

    var nr = 0;
    if (purl.indexOf( '=') > -1) {
        //faconsole.log('testtt');
        var regexS = "[?&]";
        var regex = new RegExp(/[?&]/g);
        var regtest = null;


        var ibreaker = 10;
        while( regtest = regex.exec(purl)){
            //console.info(regtest);
            ibreaker--;
            if(ibreaker<0){
                break;
            }

            nr++;
        }



    }

    return nr;
}



jQuery(document).ready(function($){






    $(document).on('click', '.import-dzscfs-sample, .import-form--head > .option, .colorpicker-con .color-spectrum, .sort-up-down-conglomerate > *', handle_mouse);


    var thumbdisplay_arr = [];


    try{
        thumbdisplay_arr = JSON.parse(window.dzs_term_order.thumbdisplay);
    }catch(err){
        console.info(err);
    }


    var cat_sort_arr = [];


    try{
        cat_sort_arr = JSON.parse(window.dzs_term_order.cat_sort);
    }catch(err){
        console.info(err);
    }




    console.info('thumbdisplay_arr - ',thumbdisplay_arr);




    // -- q admin functionality



    var is_thumb_display_page = false;



    if(get_query_arg_nr(window.location.href)==1){


        for(var lab in thumbdisplay_arr){
            if(get_query_arg(window.location.href,'post_type')==thumbdisplay_arr[lab]){
                is_thumb_display_page = true;
            }
        }
    }

    for(var lab in thumbdisplay_arr){
        if(thumbdisplay_arr[lab]=='post'){

            if(window.location.href.indexOf('edit.php')>-1 && get_query_arg_nr(window.location.href)==0){

                is_thumb_display_page = true;
            }
        }
    }

    //console.log(get_query_arg(window.location.href,'taxonomy'));
    //console.log(get_query_arg(window.location.href,'post_type'));
    console.log('is_thumb_display_page -  ', is_thumb_display_page);
    if(is_thumb_display_page){


        var i3 = 0;

        //console.warn($('#the-list > tr'))


        var id_arr = [];
        $('#the-list > tr').each(function(){
            var _t4 = $(this);

            var id = String(_t4.attr('id')).replace('post-','');
            id_arr.push(id);

            //console.info('id - ', id);

            i3++;

        })

        //$('.parent-cats-shower').eq(0).after('<br>');


        /*

         var _c = _t4.find('.column-title');

         _c.prepend('<div class="divimage" style="background-image: url(' + response.responseText + '); "></div>');

         setTimeout(function () {

         _c.addClass('has-image');
         }, 100)

         */



        setTimeout(function(){

            function delay_it(arg){

                setTimeout(function () {

                    arg.addClass('has-image');
                }, 100)
            }

            var data = {
                action: 'dzs_get_all_post_thumb_url'
                ,postdata: JSON.stringify(id_arr)
            };
            jQuery('.saveconfirmer').fadeIn('fast').delay(2000).fadeOut('fast');
            jQuery.ajax({
                url: ajaxurl
                , data: data
                , method: "POST"
                ,dataType: "html"
                , complete: function (response) {
                    if (window.console != undefined) {
                        console.log('Got this from the server: ' + response.responseText);
                    }


                    //console.info(response);
                    if (response && response.responseText) {

                        var json_string = response.responseText;
                        try{

                            var thumb_arr = JSON.parse(json_string);

                            //console.info(thumb_arr);

                            for(var i5 in thumb_arr){
                                var cac = thumb_arr[i5];


                                if(cac.thumb){

                                    var _c234 = $('#post-'+cac.id).find('.column-title');


                                    //console.info('_c234 - ',_c234, cac.thumb);

                                    _c234.prepend('<div class="divimage" style="background-image: url(' + cac.thumb + '); "></div>');

                                    //_c234.addClass('has-image');
                                    delay_it(_c234);
                                }
                            }
                        }catch(err){
                            console.log('error at json parsing - ',json_string)
                        }
                    }
                }
            });
        }, 100);


    }


    function handle_mouse(e){
        "use strict";


        var _t = $(this);




        if(_t.hasClass('meta-sort-up')){

            var _con = null;

            if(_t.parent().parent().parent().parent().hasClass('meta-order-tr')){
                _con = _t.parent().parent().parent().parent();
            }

            //console.info('_con - ',_con, _con.prev().length);

            if(_con.prev().length){
                _con.prev().before(_con);

                update_dzs_meta_order();
            }


        }
        if(_t.hasClass('meta-sort-down')){

            var _con = null;

            if(_t.parent().parent().parent().parent().hasClass('meta-order-tr')){
                _con = _t.parent().parent().parent().parent();
            }

            //console.info('_con - ',_con, _con.prev().length);

            if(_con.next().length){
                _con.next().after(_con);

                update_dzs_meta_order();
            }


        }
    }





    $('.subsubsub').before($('.parent-cats-shower').eq(0))

    setTimeout(function(){
        $('.parent-cats-shower').eq(0).addClass('loaded');
    },500);





    for(var lab in cat_sort_arr){

        if(get_query_arg(window.location.href,'taxonomy')==cat_sort_arr[lab]){


            $('.column-posts').each(function(){
                var _t = $(this);

                var hre = _t.children('a').attr('href');
                hre = add_query_arg(hre,'zoom-term-reorder','on');
                _t.children('a').attr('href',hre);
            })

            console.info("THIS IS IT prepare for reorder");
        }

    }





    if(get_query_arg(window.location.href,'zoom-term-reorder')=='on' ){

        console.info("THIS IS IT", 'zoom-term-reorder');



        $('.wrap').append($('.dzs-sort-portfolio').eq(0));

        setTimeout(function(){

            $('.dzs-sort-portfolio').eq(0).addClass('loaded');
        },100)




        if($.fn.sortable){

            console.warn('$(\'.the-sortable-list\') -> prepare for sort', $('.the-sortable-list'));

            $('.the-sortable-list').sortable({
                items: 'tr',
                scrollSensitivity:50,
                forcePlaceholderSize: true,
                forceHelperSize: false,
                handle: '.fa-arrows'
                //helper: 'clone',
                ,opacity: 0.7
                //,axis: 'y'
                ,placeholder: 'dzs_sort_term_list-placeholder'
                ,update: function(event, ui) {

                    console.info(this);


                    var _t = $(this);
                    var len = $(this).children().length;



                    console.info(len);

                    window.update_dzs_meta_order();
                }
            });
        }


        $('.meta-order-new-set').each(function(){
            var _t2 = $(this);

            var ord = Number(_t2.attr('data-meta-order'));

            console.info('_t2 - ',_t2);

            $('tr[data-meta-order="'+(ord-1)+'"]').before(_t2);
        })

        if(window.needs_js_reorder){
            setTimeout(function(){

                window.update_dzs_meta_order();
            },500)
        }
    }



});





window.update_dzs_meta_order = function(){
    // -- @arg is the .dzs_item_gallery_list element

    //console.info('update_dzs_meta_order', _arg);

    var mainarray = [];


    var iorder = 0;

    var len = jQuery('.meta-order-tr').length

    jQuery('.meta-order-tr').each(function(){
        var _t2 = jQuery(this);

        var neworder = len - iorder;
        _t2.attr('data-meta-order',neworder);

        _t2.find('.column-order').html(neworder)

        iorder++;
    })


    jQuery('.meta-order-tr').each(function(){

        var _t = jQuery(this);
        var aux = {
            'order': _t.attr('data-meta-order')
            ,'id': _t.attr('data-post-id')
        }
        mainarray.push(aux);
    })


    //console.info(mainarray);


    var data = {
        action: 'dzs_update_term_order'
        ,postdata: JSON.stringify(mainarray)
        ,meta_key: jQuery('.dzs-sort-portfolio').attr('data-meta-key')
    };
    jQuery('.saveconfirmer').html('Options saved.');
    jQuery('.saveconfirmer').fadeIn('fast').delay(2000).fadeOut('fast');
    jQuery.post(ajaxurl, data, function(response) {
        if(window.console ){
            console.log('Got this from the server: ' + response);
        }



    });
}