//console.log('ceva');

window.htmleditor_sel = 'notset';
window.mceeditor_sel = 'notset';
window.dzsvg_widget_shortcode = null;

jQuery(document).ready(function($){
    if(typeof(dzsvg_settings)=='undefined'){
        if(window.console){ console.log('dzsvg_settings not defined'); };
        return;
    }



    $('#wp-content-media-buttons').append('<a class="shortcode_opener" id="dzsvg_shortcode" style="cursor:pointer; display: inline-block; vertical-align: middle;width:auto; height:28px; margin-right: 5px; background-color: #ffffff; color: #726b6b; padding-right: 10px; border: 1px solid rgba(0,0,0,0.3); border-radius:3px; line-height: 1; font-size:13px; padding-left:0;"><i class="" style="  background-size:cover; background-repeat: no-repeat; background-position: center center; background-image: url('+dzsvg_settings.the_url+'tinymce/img/shortcodes-small-retina.png); width:28px; height: 28px; display:inline-block;  vertical-align: middle; margin-right: 5px; " ></i> <span style="display: inline-block; vertical-align: middle; font-size: 12px; font-weight: bold;">'+window.dzsvg_settings.translate_add_videogallery+'</span></a>');

    $('#wp-content-media-buttons').append('<a class="shortcode_opener" id="dzsvg_shortcode_addvideoshowcase" style="cursor:pointer; display: inline-block; vertical-align: middle;width:auto; height:28px; margin-right: 5px; background-color: #ffffff; color: #726b6b; padding-right: 10px; border: 1px solid rgba(0,0,0,0.3); border-radius:3px; line-height: 1; font-size:13px; padding-left:0;"><i class="" style="  background-size:cover; background-repeat: no-repeat; background-position: center center; background-image: url('+dzsvg_settings.the_url+'tinymce/img/shortcodes-small-retina.png); width:28px; height: 28px; display:inline-block;  vertical-align: middle; margin-right: 5px; " ></i> <span style="display: inline-block; vertical-align: middle; font-size: 12px; font-weight: bold;">'+window.dzsvg_settings.translate_add_videoshowcase+'</span></a>');

    $('#wp-content-media-buttons').append('<a class="shortcode_opener" id="dzsvg_shortcode_addvideoplayer" style="cursor:pointer; display: inline-block; vertical-align: middle; background-size:cover; background-repeat: no-repeat; background-position: center center; width:28px; height:28px; background-image: url('+dzsvg_settings.thepath+'tinymce/img/shortcodes-small-addvideoplayer-retina.png);"></a>');
    //$('#dzsvg_shortcode').bind('click');
    $('#dzsvg_shortcode').bind('click', function(){
        //tb_show('ZSVG Shortcodes', dzsvg_settings.thepath + 'tinymce/popupiframe.php?width=630&height=800');


        var parsel = '';
        if(jQuery('#wp-content-wrap').hasClass('tmce-active') && window.tinyMCE ){

            //console.log(window.tinyMCE.activeEditor);
            var ed = window.tinyMCE.activeEditor;
            var sel=ed.selection.getContent();

            if(sel!=''){
                parsel+='&sel=' + encodeURIComponent(sel);
                window.mceeditor_sel = sel;
            }else{
                window.mceeditor_sel = '';
            }
            //console.log(aux);


            window.htmleditor_sel = 'notset';


        }else{




            var textarea = document.getElementById("content");
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var sel = textarea.value.substring(start, end);

            //console.log(sel);

            //textarea.value = 'ceva';
            if(sel!=''){
                parsel+='&sel=' + encodeURIComponent(sel);
                window.htmleditor_sel = sel;
            }else{
                window.htmleditor_sel = '';
            }

            window.mceeditor_sel = 'notset';
        }


        window.open_ultibox(null, {suggested_width: 1200, suggested_height: 700,forcenodeeplink: 'on', dims_scaling: 'fill', source:dzsvg_settings.shortcode_generator_url+parsel, type: 'iframe'});
    })


    $('#dzsvg_shortcode_addvideoshowcase').bind('click', function(){
        //tb_show('ZSVG Shortcodes', dzsvg_settings.thepath + 'tinymce/popupiframe.php?width=630&height=800');


        var parsel = '';


        console.info(jQuery('#wp-content-wrap').hasClass('tmce-active'), window.tinyMCE, window.tinyMCE.activeEditor)
        if(jQuery('#wp-content-wrap').hasClass('tmce-active') && window.tinyMCE ){

            //console.log(window.tinyMCE.activeEditor);
            var ed = window.tinyMCE.activeEditor;
            var sel=ed.selection.getContent();

            if(sel!=''){
                parsel+='&sel=' + encodeURIComponent(sel);
                window.mceeditor_sel = sel;
            }else{
                window.mceeditor_sel = '';
            }
            console.log(sel);


            window.htmleditor_sel = 'notset';


        }else{




            var textarea = document.getElementById("content");
            var start = textarea.selectionStart;
            var end = textarea.selectionEnd;
            var sel = textarea.value.substring(start, end);

            //console.log(sel);

            //textarea.value = 'ceva';
            if(sel!=''){
                parsel+='&sel=' + encodeURIComponent(sel);
                window.htmleditor_sel = sel;
            }else{
                window.htmleditor_sel = '';
            }

            window.mceeditor_sel = 'notset';
        }






        window.open_ultibox(null, {suggested_width: 1200, suggested_height: 700,forcenodeeplink: 'on', dims_scaling: 'fill', source:dzsvg_settings.shortcode_showcase_generator_url+parsel, type: 'iframe'});
    });



    $('#dzsvg_shortcode_addvideoplayer').bind('click', function(){
            //console.log('click');

            frame = wp.media.frames.dzsvg_addplayer = wp.media({
                // Set the title of the modal.
                title: "Insert Video Player",

                // Tell the modal to show only images.
                library: {
                    type: 'video'
                },

                // Customize the submit button.
                button: {
                    // Set the text of the button.
                    text: "Insert Video",
                    // Tell the button not to close the modal, since we're
                    // going to refresh the page when the image is selected.
                    close: false
                }
            });

            // When an image is selected, run a callback.
            frame.on( 'select', function() {
                // Grab the selected attachment.
                var attachment = frame.state().get('selection').first();

                //console.log(attachment.attributes, $('*[name*="video-player-config"]'));
                var arg = '[dzs_video source="'+attachment.attributes.url+'" config="'+$('*[name*="video-player-config"]').val()+'" height="'+$('*[name*="video-player-height"]').val()+'" responsive_ratio="off"]';
                    if(typeof(top.dzsvg_receiver)=='function'){
                        top.dzsvg_receiver(arg);
                    }
                    frame.close();
            });

            // Finally, open the modal.
            frame.open();
    });



    $(document).delegate('.btn-shortcode-generator-dzsvg-showcase','click', function(){
        var _t = $(this);
        var parsel = '';

        console.info(_t.prev());

        if(_t.prev().hasClass('shortcode-generator-target')){

            window.dzsvg_widget_shortcode = _t.prev();
            parsel+='&sel=' + encodeURIComponent(_t.prev().val());
        }



        window.open_ultibox(null, {suggested_width: 1200, suggested_height: 700,forcenodeeplink: 'on', dims_scaling: 'fill', source:dzsvg_settings.shortcode_showcase_generator_url+parsel, type: 'iframe'});

        return false;
    })
})