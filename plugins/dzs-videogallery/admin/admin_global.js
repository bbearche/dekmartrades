jQuery(document).ready(function($){
    //return;
     // Create the media frame.

    setTimeout(reskin_select, 10);
    $(document).undelegate(".select-wrapper select", "change");
    $(document).delegate(".select-wrapper select", "change",  change_select);


    $(document).on('change','.wpb-input[name="db"]', handle_input);
    $(document).on('submit','.delete-all-settings', handle_input);



    function handle_input(e){
        var _t = $(this);


        if(e.type=='change'){
            if(_t.hasClass('wpb-input')){

                var mainarray = _t.val();
                var data = {
                    action: 'dzsvg_get_db_gals',
                    postdata: mainarray
                };
                jQuery.post(ajaxurl, data, function(response) {
                    if(window.console !=undefined ){  console.log('Got this from the server: ' + response); }
                    jQuery('#save-ajax-loading').css('opacity', '0');

                    var aux = '';
                    var auxa = response.split(';');
                    for(i=0;i<auxa.length;i++){
                        aux+='<option>'+auxa[i]+'</option>'
                    }
                    jQuery('.wpb-input[name=id]').html(aux);
                    jQuery('.wpb-input[name=id]').trigger('change');
                    jQuery('.wpb-input[name=slider]').html(aux);
                    jQuery('.wpb-input[name=slider]').trigger('change');

                });
            }
        }
        if(e.type=='submit'){
            if(_t.hasClass('delete-all-settings')){


                var r = confirm("Are you sure you want to delete all video gallery data ? ");

                if(r){

                }else{
                    return false;
                }
            }
        }
    }






    console.info('hmm - ',$('.dzsvg-wordpress-uploader'));

    $(document).off('click','.dzsvg-wordpress-uploader');
    $(document).on('click','.dzsvg-wordpress-uploader', function(e){
        var _t = $(this);
        var _targetInput = _t.prev();

        console.info(_t);

        var searched_type = '';

        if(_targetInput.hasClass('upload-type-audio')){
            searched_type = 'audio';
        }
        if(_targetInput.hasClass('upload-type-video')){
            searched_type = 'video';
        }
        if(_targetInput.hasClass('upload-type-image')){
            searched_type = 'image';
        }


        frame = wp.media.frames.dzsp_addimage = wp.media({
            title: "Insert Media",
            library: {
                type: searched_type
            },

            // Customize the submit button.
            button: {
                // Set the text of the button.
                text: "Insert Media",
                close: true
            }
        });

        // When an image is selected, run a callback.
        frame.on( 'select', function() {
            // Grab the selected attachment.
            var attachment = frame.state().get('selection').first();

            //console.log(attachment.attributes.url);
            var arg = attachment.attributes.url;
            _targetInput.val(arg);
            _targetInput.trigger('change');
//            frame.close();
        });

        // Finally, open the modal.
        frame.open();

        e.stopPropagation();
        e.preventDefault();
        return false;
    });





    $(document).off('click','.dzs-btn-add-media-att');
    $(document).on('click','.dzs-btn-add-media-att',  function(){
        var _t = $(this);

        var args = {
            title: 'Add Item',
            button: {
                text: 'Select'
            },
            multiple: false
        };

        if(_t.attr('data-library_type')){
            args.library = {
                'type':_t.attr('data-library_type')
            }
        }

        console.info(_t);

        var item_gallery_frame = wp.media.frames.downloadable_file = wp.media(args);

        item_gallery_frame.on( 'select', function() {

            var selection = item_gallery_frame.state().get('selection');
            selection = selection.toJSON();

            var ik=0;
            for(ik=0;ik<selection.length;ik++){

                var _c = selection[ik];
                //console.info(_c);
                if(_c.id==undefined){
                    continue;
                }

                if(_t.hasClass('button-setting-input-url')){

                    _t.parent().parent().find('input').eq(0).val(_c.url);
                }else{

                    _t.parent().parent().find('input').eq(0).val(_c.id);
                }


                _t.parent().parent().find('input').eq(0).trigger('change');

            }
        });



        // Finally, open the modal.
        item_gallery_frame.open();

        return false;
    });



    function change_select(){
        var selval = ($(this).find(':selected').text());
        $(this).parent().children('span').text(selval);
    }
    function reskin_select(){
        for(i=0;i<$('select').length;i++){
            var _cache = $('select').eq(i);
            //console.log(_cache.parent().attr('class'));

            if(_cache.hasClass('styleme')==false || _cache.parent().hasClass('select_wrapper') || _cache.parent().hasClass('select-wrapper')){
                continue;
            }
            var sel = (_cache.find(':selected'));
            _cache.wrap('<div class="select-wrapper"></div>')
            _cache.parent().prepend('<span>' + sel.text() + '</span>')
        }



    }


    var aux =window.location.href;


    if(aux.indexOf('plugins.php')>-1){



        setTimeout(function(){
            jQuery.get( "http://zoomthe.me/cronjobs/cache/dzsvg_get_version.static.html", function( data ) {

//            console.info(data);
                var newvrs = Number(data);
                if(newvrs > Number(dzsvg_settings.version)){
                    jQuery('.version-number').append('<span class="new-version info-con" style="width: auto;"> <span class="new-version-text">/ new version '+data+'</span><div class="sidenote">Download the new version by going to your CodeCanyon accound and accessing the Downloads tab.</div></div> </span>')

                    if($('#the-list > #dzs-video-gallery').next().hasClass('plugin-update-tr')==false){
                        $('#the-list > #dzs-video-gallery').addClass('update');
                        $('#the-list > #dzs-video-gallery').after('<tr class="plugin-update-tr"><td colspan="3" class="plugin-update colspanchange"><div class="update-message">There is a new version of DZS Video Gallery available. <form action="admin.php?page=dzsvg-autoupdater" class="mainsettings" method="post"> &nbsp; <br> <button class="button-primary" name="action" value="dzsvg_update_request">Update</button></form></td></tr>');
                    }
                }
            });
        }, 300);
    }

    if(aux.indexOf('&dzsvg_purchase_remove_binded=on')>-1){

        aux = aux.replace('&dzsvg_purchase_remove_binded=on','');
        var stateObj = { foo: "bar" };
        if(history){

            history.pushState(stateObj, null, aux);
        }
    }


















    $('.refresh-main-thumb').bind('click', function(){
        var _t = $(this);
        var _con = _t.parent().parent();


        if(_con.hasClass('select-hidden-con')){

            if(_con.hasClass('mode_youtube')){
//            console.info(_con.find('.main-thumb').eq(0))
                if(_con.find('.main-thumb').eq(0).val()==''){
                    _con.find('.main-thumb').eq(0).val('http://img.youtube.com/vi/'+_con.find('.main-source').eq(0).val()+'/0.jpg');
                    _con.find('.main-thumb').eq(0).trigger('change');
                }
            }
            if(_con.hasClass('mode_vimeo')){
                if(_con.find('.main-thumb').eq(0).val()==''){
                    //_con.find('.main-thumb').eq(0).val('http://img.youtube.com/vi/'+_t.val()+'/0.jpg');



                    var data = {
                        action: 'get_vimeothumb',
                        postdata: _con.find('.main-source').eq(0).val()
                    };

                    jQuery.post(ajaxurl, data, function(response) {
                        //console.log(response);
                        if(window.console !=undefined ){
                            //console.log(response);
                        }
                        if(response.substr(0,6)=='error:'){
                            //console.log('ceva');
                            jQuery('.import-error').html(response.substr(7));
                            jQuery('.import-error').fadeIn('fast').delay(5000).fadeOut('slow');
                            return false;
                        }
                        _con.find('.main-thumb').eq(0).val(response);
                        _con.find('.main-thumb').eq(0).trigger('change');
                    });
                }
            };
        }else{
            console.info(_con, 'does not have class select-hidden-con')
        }

        return false;
    })





    function con_generate_buttons(){
        $('#generate-upload-page').bind('click', function(){
            var _t = $(this);

            _t.css('opacity',0.5);



            var data = {
                action: 'dzsvp_insert_upload_page'
                ,postdata: '1'
            };
            $.post(ajaxurl, data, function(response) {
                if(window.console != undefined){
                    console.log('Got this from the server: ' + response);
                }

                $('select[name=dzsvp_page_upload]').prepend('<optgroup label="Generated Pages"><option value="'+response+'">Upload</option></optgroup>')

                $('select[name=dzsvp_page_upload]').find('option').eq(0).prop('selected',true);
                $('select[name=dzsvp_page_upload]').trigger('change');

                _t.parent().parent().remove();

            });

            return false;
        })
    }

    con_generate_buttons();
    extra_skin_hiddenselect();

});





function extra_skin_hiddenselect(){
    for(i=0;i<jQuery('.select-hidden-metastyle').length;i++){
        var _t = jQuery('.select-hidden-metastyle').eq(i);
        if(_t.hasClass('inited')){
            continue;
        }
        //console.log(_t);
        _t.addClass('inited');
        _t.children('select').eq(0).bind('change', change_selecthidden);
        change_selecthidden(null, _t.children('select').eq(0));
        _t.find('.an-option').bind('click', click_anoption);
    }
    function change_selecthidden(e, arg){
        var _c = jQuery(this);
        if(arg!=undefined){
            _c = arg;
        }
        var _con = _c.parent();
        var selind = _c.children().index(_c.children(':selected'));
        var _slidercon = _con.parent().parent();
        //console.log(selind);
        _con.find('.an-option').removeClass('active');
        _con.find('.an-option').eq(selind).addClass('active');
        //console.log(_con);
        do_changemainsliderclass(_slidercon, selind);
    }
    function click_anoption(e){
        var _c = jQuery(this);
        var ind = _c.parent().children().index(_c);
        var _con = _c.parent().parent();
        var _slidercon = _con.parent().parent();
        _c.parent().children().removeClass('active');
        _c.addClass('active');
        _con.children('select').eq(0).children().removeAttr('selected');
        _con.children('select').eq(0).children().eq(ind).attr('selected', 'selected');
        do_changemainsliderclass(_slidercon, ind);
        //console.log(_c, ind, _con, _slidercon);
    }
    function do_changemainsliderclass(arg, argval){
        //extra function - handmade
        //console.log(arg, argval, arg.find('.mainsetting').eq(0).children().eq(argval).val());

        if(arg.hasClass('select-hidden-con')){
            arg.removeClass('mode_thumb'); arg.removeClass('mode_gallery');  arg.removeClass('mode_audio'); arg.removeClass('mode_video'); arg.removeClass('mode_youtube'); arg.removeClass('mode_vimeo'); arg.removeClass('mode_link'); arg.removeClass('mode_testimonial'); arg.removeClass('mode_link'); arg.removeClass('mode_twitter');

            arg.addClass('mode_' + arg.find('.mainsetting').eq(0).children().eq(argval).val());

        }
        if(arg.hasClass('item-settings-con')){
            arg.removeClass('type_youtube'); arg.removeClass('type_normal'); arg.removeClass('type_vimeo'); arg.removeClass('type_audio'); arg.removeClass('type_image'); arg.removeClass('type_link');

            if(argval==0){
                arg.addClass('mode_youtube')
            }
            if(argval==1){
                arg.addClass('mode_normal')
            }
            if(argval==2){
                arg.addClass('mode_vimeo')
            }
            if(argval==3){
                arg.addClass('mode_audio')
            }
            if(argval==4){
                arg.addClass('mode_image')
            }
            if(argval==5){
                arg.addClass('mode_link')
            }
        }
    }

}
