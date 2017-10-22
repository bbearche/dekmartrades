


jQuery(document).ready(function($){
  "use strict";

    if (window.dzsuploader_single_init) {
        //console.info('ceva', $('span:not(.for-clone-item) .dzs-single-upload'));
        window.dzsuploader_single_init('.dzs-single-upload', {
            action_file_uploaded: action_file_uploaded
            , action_file_upload_start: action_file_upload_start
        });
    }


    $(document).on('change', '.submit-track-form select[name=type],.submit-track-form *[name=source]', handle_change);
    $(document).on('click', '.cancel-upload-btn , .submit-track-form .btn-submit', handle_click);


    $('.shortcode-upload').addClass('loaded');


    function handle_change(e) {

        var _t = $(this);
        var _con = null;
        //console.info(_t);

        if (e.type == 'change') {
            if (_t.attr('name') == 'is_buyable') {
                //console.info(_t, _t.prop('checked'));

                if (_t.prop('checked')) {

                    $('.price-conglomerate').addClass('active');
                } else {
                    // -- you can see typing is slow now ... lets see later...
                    $('.price-conglomerate').removeClass('active');
                }
            }
            if (_t.attr('name') == 'thumbnail') {
                //console.info(_t, _t.prop('checked'));

                if (_t.val()) {
                    if (_t.parent().find('.preview-thumb-con').length > 0) {
                        var _cach = _t.parent().find('.preview-thumb-con').eq(0);

                        _cach.addClass('has-image');
                        _cach.css('background-image', 'url(' + _t.val() + ')');
                    }
                }
            }
            if (_t.attr('name') == 'type') {
                //console.info(_t, _t.prop('checked'));

                if (_t.parent().parent().hasClass('submit-track-form')) {
                    _con = _t.parent().parent();


                    _con.removeClass('type-video type-youtube  type-vimeo ');

                    _con.addClass('type-' + _t.val());

                    var uploader_type = _t.val();
                    if (_t.val() == 'video') {
                        //_con.find('.the-real-uploader').removeAttr('multiple');
                    }

                    if (_t.val() == 'youtube') {
                        //_con.find('.the-real-uploader').attr('multiple', '');
                    }
                }
            }
            if (_t.attr('name') == 'source') {
                var _con = null;


                if(_t.parent().parent().parent().hasClass('submit-track-form')){
                    _con = _t.parent().parent().parent();
                }
                if(_con.hasClass('type-youtube') || _con.hasClass('type-vimeo')){
                    return false;
                }


                upload_hide_upload_field(_t);
            }
        }
    }



    function handle_click(e) {

        var _t = $(this);
        var _con = null;
        //console.info(_t);

        if (e.type == 'click') {


            if (_t.hasClass('cancel-upload-btn')) {
                //console.log('ceva');



                var _c = $('.dzs-upload-con').eq(0);

                _c.removeClass('disabling');
                _c.css('height', 'auto');

//                console.info(_c, _c.height());

                var _con = null;

                if(_t.parent().parent().parent().hasClass('submit-track-form')){
                    _con = _t.parent().parent().parent();
                }


                if(_con){
                    _con.removeClass('phase2');
                    //_con.slideUp('fast');
                }

                var _cach = _t.parent().parent();
                if(_cach.hasClass('parameters-con')){
                    _cach.find('.main-upload-options-con').eq(0).removeClass('active').slideUp('fast');
                }

                return false;
            }
            if (_t.hasClass('btn-submit')) {
                //console.log('ceva');



                var _c = $('.id-upload-mp3').eq(0);
                upload_hide_upload_field(_c);
                return false;
            }


        }
    }






    function init_tinymces(_con){


        console.info(_con);

        _con.find('.with-tinymce').each(function(){
            var _t = $(this);
            console.info(_t);

            var _con = _t.parent().parent().parent().parent();



            var trackid = (_con.find('*[name=track_id]').eq(0).val());

            console.warn(trackid);
            _t.attr('id','fortinymce'+trackid);
            init_try_tinymce(_t);
        })
    }

    function upload_hide_upload_field(arg) {

        var _t = arg;
        var _con = null;
        var _c = null;
        console.info(_t, _t.prop('checked'), _t.parent().parent().parent());

        if (_t.parent().parent().parent().hasClass('submit-track-form')) {
            _con = _t.parent().parent().parent();


            _c = _con.find('.main-upload-options-con');


        }




        if(_con){


            _c.addClass('active');
            _c.show();

            var ch = _c.height();

            _c.css('height','0');


            _c.animate({
                'height': ch
            }, {
                queue: false
                , duration: 300
                ,complete:function(){
                    $(this).css('height','auto');
                }
            });


            var _auxcon = _con;
            setTimeout(function(){

                console.info(_auxcon.find('.dzs-tabs').get(0));

                if(_auxcon.find('.dzs-tabs').get(0).api_handle_resize){

                    _auxcon.find('.dzs-tabs').get(0).api_handle_resize();
                }
            },50);
            setTimeout(function(){

                console.info(_auxcon.find('.dzs-tabs').get(0));

                if(_auxcon.find('.dzs-tabs').get(0).api_handle_resize){

                    _auxcon.find('.dzs-tabs').get(0).api_handle_resize();
                    _auxcon.find('.dzs-tabs').eq(0).find('.tab-content').eq(0).addClass('active');
                }
            },150);
            setTimeout(function(){

                _auxcon.addClass('phase2');
            },100);

        }

        if (_t.parent().hasClass('dzs-upload-con')) {
            _con = _t.parent();

            _con.addClass('disabling');

            _con.animate({
                'height': 0
            }, {
                queue: false
                , duration: 300
            });
        }
    }
    function init_try_tinymce(_c){

        if(_c.hasClass('tinymce-activated')){
            return false;
        }

        if(window.tinyMCE){


            console.info("HMM");
            tinyMCE.baseURL = window.dzsvg_plugin_url+'tinymce';
            tinyMCE.init({
                selector: '#'+_c.attr('id')
                ,base: window.dzsvg_plugin_url+'tinymce/'
                ,menubar: false
                ,toolbar: 'styleselect | bold italic | link image code bullist numlist'
                ,plugins: 'code,lists,link'
                ,selection_toolbar: 'bold italic | quicklink h2 h3 blockquote code fontsize '
            });

            _c.addClass('tinymce-activated');


        }else{

            if(window.tinymce_trying_to_load!=true){

                window.tinymce_trying_to_load = true;

                $.getScript(window.dzsvg_plugin_url+'tinymce/tinymce.min.js', function (data, textStatus, jqxhr) {

                    init_try_tinymce(_c);
                })
            }
        }
    }





    function action_file_upload_start(pfile, pargs) {


        var uploader_type='video';

        console.info('action_file_upload_start from PORTAL uploader_type ( ' + uploader_type + ' ) - ', pfile, pargs);


        if (uploader_type == 'video') {
            if (String(pfile.name).indexOf('.mp4') > -1 || String(pfile.name).indexOf('.m4v')) {
                upload_hide_upload_field($('input[name="source"]'));
                $('.main-upload-options').addClass('loader-active');
                window.dzs_uploader_force_progress($('.main-upload-options'));
            }
            var name = String(pfile.name);
            name = name.replace('.mp3', '');
            name = name.replace('.mp4', '');
            name = name.replace('.m4v', '');


            if(pargs.cthis.prev().hasClass('id-upload-mp3')){

                $('*[name="title"]').val(name);
            }
        }

        if (uploader_type == 'album') {
            if (String(pfile.name).indexOf('.mp3') > -1) {


                var name = String(pfile.name);
                name = name.replace('.mp3', '');

                $('*[name="title"]').val(name);

                upload_hide_upload_field($('input[name="source"]'));


                $('.upload-track-options-con').append('<div class="upload-track-options"><input type="hidden" name="track_source[]"><div class="preloader-bar dzs-upload--progress--barprog"></div><div class="handle-con"><i class="fa fa-bars"></i></div><div class="input-con"><input type="text" name="track_title[]"> </div><div class="delete-track-con"><i class="fa fa-times"></i></div></div>');
                var _c = $('.upload-track-options-con').find('.upload-track-options').last();
                _c.addClass('loader-active');
                window.dzs_uploader_force_progress(_c);

                _c.find('input[name*="track_title"]').val(name);
            }
        }



        var _c = $('.main-upload-options').eq(0);


        console.info('_C - ',_c);
        init_tinymces(_c);

        _c.css('height', 'auto');

        var h = (_c.height());


        _c.css('height','1px');

        setTimeout(function(){
            _c.animate({
                'height':h
            },{
                queue:false
                ,duration: 300
                ,complete:function(){
                    $(this).css('height', 'auto');
                }
            });

            _c.addClass('main-option-active');
        },100);
        _c.addClass('main-option-active');


        //show_notice(arg);
        //


    }



    function action_file_uploaded(argresp, pargs, matches) {

        var uploader_type = 'video';
        console.info('action_file_uploaded from PORTAL', argresp, pargs);


        if (uploader_type == 'album') {

            var name = String(pargs.file.name);
            name = name.replace('.mp3', '');

            var _c = $('.upload-track-options-con').eq(0);
            _c.find('input[name*="track_title"]').each(function(){
                var _t2 = $(this);

                if(name==_t2.val()){
                    var _c2 = _t2.parent().parent();

                    _c2.find('input[name*="track_source"]').eq(0).val(pargs.final_location);
                }

                //console.info('testing name', name, _t2.val());
            })
        }




        var _c = $('.main-upload-options').eq(0);
        _c.addClass('main-option-active');





        //show_notice(arg);
        //

    }
    $('.simple-fade-carousel').each(function(){
        var cthis = $(this);
        var currNr = 0 ;
        var time_interval = 5000;
        var int_changer = 0;

        cthis.children().eq(currNr).addClass('active');

        int_changer = setInterval(function(){
            currNr++;
            if(currNr>=cthis.children().length){
                currNr=0;
            };
            cthis.children().removeClass('active');
            cthis.children().eq(currNr).addClass('active');

        }, time_interval);

    })
});



