jQuery(document).ready(function($){

    $('.toggle-title').bind('click', function(){
        var $t = $(this);
        if($t.hasClass('opened')){
            ($t.parent().find('.toggle-content').slideUp('fast'));
            $t.removeClass('opened');
        }else{
            ($t.parent().find('.toggle-content').slideDown('fast'));
            $t.addClass('opened');
        }
    })




    $('.save-button').bind('click', function(){
        //console.log(jQuery(this).parent().children('.preloader'));


        jQuery('#save-ajax-loading').css('opacity', '1');
        var mainarray = jQuery('.settings-html5vg').serialize();
        var data = {
            action: 'dzsvg_ajax_options_dc',
            postdata: mainarray
        };

        if($('.settings-html5vg').hasClass('for-aurora')){
            data.action = 'dzsvg_ajax_options_dc_aurora';
        }
        jQuery('.saveconfirmer').html('Options saved.');
        jQuery('.saveconfirmer').fadeIn('fast').delay(2000).fadeOut('fast');
        jQuery.post(ajaxurl, data, function(response) {
            if(window.console !=undefined ){
                console.log('Got this from the server: ' + response);
            }
            jQuery('#save-ajax-loading').css('opacity', '0');
        });

        return false;

    })

    $('.dc-input').bind('change', function(){
        var aux = '';

        var sname ='';
        sname = 'background';

        console.warn(get_query_arg(window.location.href, 'skin'));
        if($('input[name="'+sname+'"]').val()!=''){

            if(get_query_arg(window.location.href, 'skin')=='aurora'){

                aux+='#html5vp-preview{ background-color: '+$('input[name="'+sname+'"]').val()+'; } ';
            }else{

                aux+='#html5vg-preview.videogallery{ background-color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .navMain{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }
        }
        sname = 'controls_background';
        if($('input[name="'+sname+'"]').val()!=''){
            if(get_query_arg(window.location.href, 'skin')=='aurora'){

                aux+='#html5vp-preview.skin_aurora .background{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }else{

                aux+='#html5vg-preview.videogallery .background{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }
        }
        sname = 'scrub_background';
        if($('input[name="'+sname+'"]').val()!=''){
            if(get_query_arg(window.location.href, 'skin')=='aurora'){

                aux+='#html5vp-preview.skin_aurora .scrub-bg{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }else{
                aux+='#html5vg-preview.videogallery .scrub-bg{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }

        }
        sname = 'scrub_buffer';
        if($('input[name="'+sname+'"]').val()!=''){
            if(get_query_arg(window.location.href, 'skin')=='aurora'){

                aux+='#html5vp-preview.skin_aurora .scrub-buffer{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }else{
                aux+='#html5vg-preview.videogallery .scrub-buffer{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }
        }
        sname = 'scrub_progress';
        if($('input[name="'+sname+'"]').val()!=''){
            if(get_query_arg(window.location.href, 'skin')=='aurora'){

                aux+=' ';
            }else{
                aux+='#html5vg-preview.videogallery .scrub-buffer{ background-color: '+$('input[name="'+sname+'"]').val()+'; }';
            }
        }
        sname = 'controls_color';
        if($('input[name="'+sname+'"]').val()!=''){


            if(get_query_arg(window.location.href, 'skin')=='aurora'){

                aux+='#html5vp-preview.skin_aurora .playSimple path{ fill: '+$('input[name="'+sname+'"]').val()+'; } #html5vp-preview.skin_aurora .pauseSimple path{ fill: '+$('input[name="'+sname+'"]').val()+'; }   #html5vp-preview.skin_aurora .volumeicon path{ fill: '+$('input[name="'+sname+'"]').val()+'; }     #html5vp-preview.skin_aurora .fscreencontrols rect,#html5vp-preview.skin_aurora .fscreencontrols polygon{ fill: '+$('input[name="'+sname+'"]').val()+'; }    #html5vp-preview.skin_aurora .hdbutton-con .hdbutton-normal{ color: '+$('input[name="'+sname+'"]').val()+'; } #html5vp-preview.skin_aurora .scrub{ background-color: '+$('input[name="'+sname+'"]').val()+'; }     #html5vp-preview.skin_aurora .volume_active{ background-color: '+$('input[name="'+sname+'"]').val()+'; }   ';
            }else{
                aux+='#html5vg-preview.videogallery .playSimple{ border-left-color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .stopSimple .pause-part-1{ background-color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .stopSimple .pause-part-2{ background-color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .volumeicon{ background: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .volumeicon:before{ border-right-color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .volume_static{ background: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .hdbutton-con .hdbutton-normal{ color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .total-timetext{ color: '+$('input[name="'+sname+'"]').val()+'; } ';
            }

        }
        sname = 'controls_hover_color';
        if($('input[name="'+sname+'"]').val()!=''){
            if(get_query_arg(window.location.href, 'skin')=='aurora'){

                aux+='#html5vp-preview.skin_aurora .playcontrols:hover .playSimple path{ fill: '+$('input[name="'+sname+'"]').val()+'; } #html5vp-preview.skin_aurora .playcontrols:hover .pauseSimple path{ fill: '+$('input[name="'+sname+'"]').val()+'; }   #html5vp-preview.skin_aurora .volumecontrols:hover .volumeicon path{ fill: '+$('input[name="'+sname+'"]').val()+'; }     #html5vp-preview.skin_aurora .fscreencontrols:hover rect,#html5vp-preview.skin_aurora .fscreencontrols:hover polygon{ fill: '+$('input[name="'+sname+'"]').val()+'; }    #html5vp-preview.skin_aurora .hdbutton-con:hover .hdbutton-normal{ color: '+$('input[name="'+sname+'"]').val()+'; } ';
            }else {
                aux += '#html5vg-preview.videogallery .playSimple:hover{ border-left-color: ' + $('input[name="' + sname + '"]').val() + '; } #html5vg-preview.videogallery .stopSimple:hover .pause-part-1{ background-color: ' + $('input[name="' + sname + '"]').val() + '; } #html5vg-preview.videogallery .stopSimple:hover .pause-part-2{ background-color: ' + $('input[name="' + sname + '"]').val() + '; } #html5vg-preview.videogallery .volumeicon:hover{ background: ' + $('input[name="' + sname + '"]').val() + '; } #html5vg-preview.videogallery .volumeicon:hover:before{ border-right-color: ' + $('input[name="' + sname + '"]').val() + '; } ';
            }
        }
        sname = 'controls_highlight_color';
        if($('input[name="'+sname+'"]').val()!=''){
            aux+='#html5vg-preview.videogallery .volume_active{ background-color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .scrub{ background-color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .hdbutton-con .hdbutton-hover{ color: '+$('input[name="'+sname+'"]').val()+'; } ';
        }
        sname = 'timetext_curr_color';
        if($('input[name="'+sname+'"]').val()!=''){
            aux+='#html5vg-preview.videogallery .curr-timetext{ color: '+$('input[name="'+sname+'"]').val()+'; } ';
        }
        sname = 'thumbs_bg';
        if($('input[name="'+sname+'"]').val()!=''){
            aux+='#html5vg-preview.videogallery .navigationThumb{ background-color: '+$('input[name="'+sname+'"]').val()+'; } ';
        }
        sname = 'thumbs_active_bg';
        if($('input[name="'+sname+'"]').val()!=''){
            aux+='#html5vg-preview.videogallery .navigationThumb.active{ background-color: '+$('input[name="'+sname+'"]').val()+'; } ';
        }
        sname = 'thumbs_text_color';
        if($('input[name="'+sname+'"]').val()!=''){
            aux+='#html5vg-preview.videogallery .navigationThumb{ color: '+$('input[name="'+sname+'"]').val()+'; } #html5vg-preview.videogallery .navigationThumb .the-title{ color: '+$('input[name="'+sname+'"]').val()+'; } ';
        }


        sname = 'thumbnail_image_width';
        if($('input[name="'+sname+'"]').val()!=''){
            aux+='#html5vg-preview.videogallery .imgblock{ width: '+$('input[name="'+sname+'"]').val()+'px;; }  ';
        }
        sname = 'thumbnail_image_height';
        if($('input[name="'+sname+'"]').val()!=''){
            aux+='#html5vg-preview.videogallery .imgblock{ height: '+$('input[name="'+sname+'"]').val()+'px; }  ';
        }
        $('#html5vg-preview-style').html(aux);
    });

    $('.dc-input').trigger('change');



});