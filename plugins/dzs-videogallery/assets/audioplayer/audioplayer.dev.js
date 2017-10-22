
/*
 * Author: Audio Player with Playlist
 * Website: http://digitalzoomstudio.net/
 * Portfolio: http://bit.ly/nM4R6u
 * Version: 2.65
 * */


function htmlEncode(arg){
    return jQuery('<div/>').text(arg).html();
}

function htmlDecode(value){
    return jQuery('<div/>').html(arg).text();
}


var dzsap_list = [];
var dzsap_ytapiloaded = false;
var dzsap_globalidind = 20;

var dzsap_list_for_sync_players = [];
var dzsap_list_for_sync_sw_build = false;
var dzsap_list_for_sync_inter_build = 0;


window.dzsap_audio_ctx = null;

window.dzsap_self_options = {};

(function($) {

    window.dzsap_list_for_sync_build = function(){


    }

    $.fn.prependOnce = function(arg, argfind) {
        var _t = $(this) // It's your element


//        console.info(argfind);
        if(typeof(argfind) =='undefined'){
            var regex = new RegExp('class="(.*?)"');
            var auxarr = regex.exec(arg);


            if(typeof auxarr[1] !='undefined'){
                argfind = '.'+auxarr[1];
            }
        }


        // we compromise chaining for returning the success
        if(_t.children(argfind).length<1){
            _t.prepend(arg);
            return true;
        }else{
            return false;
        }
    };
    $.fn.appendOnce = function(arg, argfind) {
        var _t = $(this) // It's your element


        if(typeof(argfind) =='undefined'){
            var regex = new RegExp('class="(.*?)"');
            var auxarr = regex.exec(arg);


            if(typeof auxarr[1] !='undefined'){
                argfind = '.'+auxarr[1];
            }
        }
        // we compromise chaining for returning the success
        if(_t.children(argfind).length<1){
            _t.append(arg);
            return true;
        }else{
            return false;
        }
    };
    $.fn.audioplayer = function(o) {
        var defaults = {
            design_skin: 'skin-default'
            ,autoplay: 'off'
            ,cue: 'on'
            ,loop: 'off'
            ,swf_location: "ap.swf"//==the location of the flash backup
            ,swffull_location: "apfull.swf"//==the location of the flash backup
            ,settings_backup_type: 'light' // == light or full

            ,settings_extrahtml: '' // == some extra html - can be rates, plays, likes
            ,settings_extrahtml_in_float_left: '' // -- some extra html that you may want to add inside the player, to the right
            ,settings_extrahtml_in_float_right: '' // -- some extra html that you may want to add inside the player, to the right

            ,settings_trigger_resize : '0'
            ,design_thumbh: "default"//thumbnail size
            ,design_thumbw: "200"
            ,disable_volume: 'default'
            ,disable_scrub: 'default'
            ,disable_player_navigation: 'off'
            ,disable_timer: 'default'
            ,type: 'audio'
            ,embed_code: ''
            ,skinwave_dynamicwaves: 'off' // -- dynamic scale based on volume for no spectrum wave
            ,soundcloud_apikey: '' // -- set the sound cloud api key
            ,parentgallery: null
            ,skinwave_enableSpectrum: 'off' // off or on
            ,skinwave_enableReflect: 'on'
            ,settings_useflashplayer: 'auto' // off or on or auto
            ,skinwave_spectrummultiplier: '1' // == number
            ,settings_php_handler: '' // -- the path of the publisher.php file, this is used to handle comments, likes etc.
            ,php_retriever: 'soundcloudretriever.php'
            ,skinwave_mode: 'normal' // --- "normal" or "small"

            ,skinwave_comments_enable: 'off' // -- enable the comments, publisher.php must be in the same folder as this html
            ,skinwave_comments_playerid: ''
            ,skinwave_comments_account: 'none'
            ,skinwave_comments_process_in_php: 'off' // -- select wheter the comment text should be processed in javascript "off" / or in php, later "on"
            ,skinwave_comments_retrievefromajax: 'off'// --- retrieve the comment form ajax
            ,skinwave_comments_displayontime: 'on'// --- display the comment when the scrub header is over it
            ,skinwave_comments_avatar: 'http://www.gravatar.com/avatar/00000000000000000000000000000000?s=20'// -- default image
            ,skinwave_comments_allow_post_if_not_logged_in: 'on'// -- default image

            ,skinwave_timer_static: 'off'
            ,skinwave_spectrum_wavesbg: '4f4949' // == number
            ,skinwave_spectrum_wavesprog: 'ae1919' // == number
            ,default_volume: '1' // -- number / set the default volume 0-1 or "last" for the last known volume
            ,design_menu_show_player_state_button: 'off' // -- show a button that allows to hide or show the menu
            ,playfrom: 'off' //off or specific number of settings or set to "last"
            ,scrubbar_tweak_overflow_hidden: 'off' // -- replace overflow hidden that is used for  with a
            ,design_animateplaypause: 'default'
            ,embedded: 'off' // // -- if embedded in a iframe
            ,embedded_iframe_id: '' // // -- if embedded in a iframe, specify the iframe id here
            ,sample_time_start: '0' // --- if this is a sample to a complete song, you can write here start times, if not, leave to 0.
            ,sample_time_end: '0' // -- if this is a sample to a complete song, you can write here start times, if not, leave to 0.
            ,sample_time_total: '0'// -- if this is a sample to a complete song, you can write here start times, if not, leave to 0.
            ,google_analytics_send_play_event: 'off' // -- send the play event to google analytics, you need to have google analytics script already on your page
            ,fakeplayer: null // -- if this is a fake player, it will feed
            ,type_for_fake_feed: '' // -- if this is a fake player, this is the type he is reffering to
            ,failsafe_repair_media_element: '' // -- some scripts might effect the media element used by zoomsounds, this is how we replace the media element in a certain time
            ,action_audio_play: null // -- set a outer play function ( for example for tracking your analytics )
            ,action_audio_play2: null // -- set a outer play function ( for example for tracking your analytics )
            ,action_audio_end: null // -- set a outer ended function ( for example for tracking your analytics )
            ,action_audio_comment: null // -- set a outer commented function ( for example for tracking your analytics )
            ,action_audio_loaded_metadata: null // -- set a outer commented function ( for example for tracking your analytics )
            ,type_audio_stop_buffer_on_unfocus: 'off' // -- if set to on, when the audio player goes out of focus, it will unbuffer the file so that it will not load anymore, useful if you want to stop buffer on large files
            ,construct_player_list_for_sync: 'off' // -- construct a player list from the page that features single players playing one after another. searches for the .is-single-player class in the DOM


            ,settings_exclude_from_list: 'off' // -- a audioplayer list is formed at runtime so that when
            ,design_color_highlight: 'ea8c52' // -- a audioplayer list is formed at runtime so that when


        };



        //console.info(o);
        if(typeof o =='undefined'){
            if(typeof $(this).attr('data-options')!='undefined'  && $(this).attr('data-options')!=''){
                var aux = $(this).attr('data-options');
                aux = 'window.dzsap_self_options  = ' + aux;
                eval(aux);
                o = $.extend({},window.dzsap_self_options );
                window.window.dzsap_self_options = $.extend({},{});
            }
        }

        o = $.extend(defaults, o);
        //console.info(o);


        this.each(function() {
            var cthis = $(this);
            var cchildren = cthis.children()
                ,cthisId = 'ap1'
                ;
            var currNr = -1;
            var busy = true;
            var i = 0;
            var ww
                , wh
                , tw
                , th
                ,cw //controls width
                ,ch //controls height
                ,sw = 0//scrubbar width
                ,sh
                ,spos = 0 //== scrubbar prog pos
                ;
            var _audioplayerInner
                ,_apControls = null
                ,_apControlsLeft = null
                ,_apControlsRight = null
                ,_conControls
                ,_conPlayPause
                ,_controlsVolume
                ,_scrubbar
                ,_theMedia
                ,_cmedia
                ,_theThumbCon
                ,_metaArtistCon
                ,_scrubBgReflect = null
                ,_scrubBgReflectCanvas = null
                ,_scrubBgReflectCtx = null
                ,_scrubProgReflect = null
                ,_scrubProgCanvasReflect = null
                ,_scrubProgCanvasReflectCtx = null
                ,_scrubBgCanvas = null
                ,_scrubBgCanvasCtx = null
                ,_scrubProgCanvas = null
                ,_scrubProgCanvasCtx = null
                ,_commentsHolder = null
                ,_commentsWriter = null
                ,_currTime = null
                ,_totalTime = null
                ,_feed_fakePlayer = null
                ;
            var busy = false
                ,playing = false
                ,muted = false
                ,loaded=false
                ,destroyed = false
                ,google_analytics_sent_play_event = false
                ,destroyed_for_rebuffer = false
                ;
            var time_total = 0
                ,time_curr=0
                ,real_time_curr=0
                ,real_time_total = 0
                ,sample_time_start=0
                ,sample_time_end=0
                ,sample_time_total=0
                ,sample_perc_start=0
                ,sample_perc_end=0
                ,currTime_outerWidth = 0
                ;
            var index_extrahtml_toloads = 0;
            var last_vol = 1
                ,last_vol_before_mute = 1
                ,the_player_id = ''
                ;
            var inter_check
                ,inter_checkReady
                ,inter_audiobuffer_workaround_id = 0
                ,inter_trigger_resize
                ;
            var skin_minimal_canvasplay
                ,skin_minimal_canvaspause
                ;
            var is_flashplayer = false
                ;
            var data_source
                ;

            var res_thumbh = false
                ,debug_var = false
                ,volume_dragging = false


                ; // resize thumb height

            var str_ie8 = '';

            //===spectrum stuff

            var javascriptNode = null;
            var audioCtx = null;
            var audioBuffer = null;
            var sourceNode = null;
            var analyser = null;
            var lastarray = null;
            var webaudiosource = null;
            var canw = 100;
            var canh = 100;
            var barh = 100
                ,design_thumbh
                ;
            var type = '';

            var sposarg = 0; // the % at which the comment will be placed

            var arr_the_comments = [];

            var str_audio_element = '';

            var lasttime_inseconds = 0;

            var controls_left_pos = 0;
            var controls_right_pos = 0;

            var ajax_view_submitted = 'auto'
                ,increment_views = 0
                ;

            var starrating_index = 0
                ,starrating_nrrates = 0
                ,starrating_alreadyrated = -1
                ;

            var playfrom = 'off'
                ,playfrom_ready = false
                ;

            var defaultVolume = 1;

            var currIp = '127.0.0.1';
            var action_audio_end = null
                ,action_audio_play = null
                ,action_audio_play2 = null
                ,action_audio_comment = null
                ; // -- set a outer ended function ( for example for tracking your analytics


            var sw_suspend_enter_frame = false
                ;

            if(isNaN(parseInt(o.design_thumbh, 10))==false){
                o.design_thumbh = parseInt(o.design_thumbh, 10);

            }
            if(String(o.design_thumbw).indexOf('%')==-1){
                o.design_thumbw = parseInt(o.design_thumbw, 10);

            }

            if(Number(o.sample_time_start)>0){
                sample_time_start = Number(o.sample_time_start);
                if(Number(o.sample_time_end)>0){
                    sample_time_end = Number(o.sample_time_end);

                    if(Number(o.sample_time_total)>0){
                        sample_time_total = Number(o.sample_time_total);


                        sample_perc_start = sample_time_start/ sample_time_total;
                        sample_perc_end = sample_time_end/ sample_time_total;

                    }
                }

            }




            //console.info(sample_perc_start,sample_perc_end);

            o.settings_trigger_resize = parseInt(o.settings_trigger_resize, 10);

            if(cthis.children('.extra-html').length>0 && o.settings_extrahtml==''){
                o.settings_extrahtml = cthis.children('.extra-html').eq(0).html();



                var re_ratesubmitted = /{{ratesubmitted=(.?)}}/g;
                if(re_ratesubmitted.test(String(o.settings_extrahtml))){
                    re_ratesubmitted.lastIndex = 0;
                    var auxa = (re_ratesubmitted.exec(String(o.settings_extrahtml)));


                    starrating_alreadyrated = auxa[1];

                    o.settings_extrahtml = String(o.settings_extrahtml).replace(re_ratesubmitted, '');

                    if(o.parentgallery && $(o.parentgallery).get(0)!=undefined && $(o.parentgallery).get(0).api_player_rateSubmitted!=undefined){
                        $(o.parentgallery).get(0).api_player_rateSubmitted();
                    }
                }


                cthis.children('.extra-html').remove();
            }

            if(cthis.children('.extra-html-in-controls-right').length>0 && o.settings_extrahtml_in_float_right==''){
                o.settings_extrahtml_in_float_right = cthis.children('.extra-html-in-controls-right').eq(0).html();


            }

            if(cthis.children('.extra-html-in-controls-left').length>0 && o.settings_extrahtml_in_float_left==''){
                o.settings_extrahtml_in_float_left = cthis.children('.extra-html-in-controls-left').eq(0).html();


            }




            init();
            function init(){
                //console.log(typeof(o.parentgallery)=='undefined');

                if(o.design_skin==''){
                    o.design_skin = 'skin-default';
                }

                if(cthis.attr('class').indexOf("skin-")==-1){
                    cthis.addClass(o.design_skin);
                }
                if(cthis.hasClass('skin-default')){
                    o.design_skin = 'skin-default';
                }
                if(cthis.hasClass('skin-wave')){
                    o.design_skin = 'skin-wave';
                }
                if(cthis.hasClass('skin-justthumbandbutton')){
                    o.design_skin = 'skin-justthumbandbutton';
                }
                if(cthis.hasClass('skin-pro')){
                    o.design_skin = 'skin-pro';
                }
                if(cthis.hasClass('skin-aria')){
                    o.design_skin = 'skin-aria';
                }
                if(cthis.hasClass('skin-silver')){
                    o.design_skin = 'skin-silver';
                }
                if(cthis.hasClass('skin-redlights')){
                    o.design_skin = 'skin-redlights';
                }
                if(cthis.hasClass('skin-steel')){
                    o.design_skin = 'skin-steel';
                }
                if(cthis.hasClass('skin-customcontrols')){
                    o.design_skin = 'skin-customcontrols';
                }

                //console.info(o.design_skin, o.disable_volume);

                if(cthis.attr('data-viewsubmitted')=='on'){
                    ajax_view_submitted='on';
                }
                if(cthis.attr('data-userstarrating')){
                    starrating_alreadyrated=Number(cthis.attr('data-userstarrating'));
                }
//                console.info(starrating_alreadyrated);

                if(cthis.hasClass('skin-minimal')){
                    o.design_skin = 'skin-minimal';
                    if(o.disable_volume=='default'){
                        o.disable_volume='on';
                    }

                    if(o.disable_scrub=='default'){
                        o.disable_scrub='on';
                    }
                    o.disable_timer='on';
                }
                if(cthis.hasClass('skin-minion')){
                    o.design_skin = 'skin-minion';
                    if(o.disable_volume=='default'){
                        o.disable_volume='on';
                    }

                    if(o.disable_scrub=='default'){
                        o.disable_scrub='on';
                    }

                    o.disable_timer='on';
                }

                if(o.design_skin=='skin-default'){
                    if(o.design_thumbh=='default'){
                        design_thumbh = cthis.height() - 40;
                        res_thumbh = true;
                    }
                }
                if(o.design_skin=='skin-wave'){
                    cthis.addClass('skin-wave-mode-'+ o.skinwave_mode);


                    if(o.skinwave_mode == 'small'){
                        if(o.design_thumbh=='default'){
                            design_thumbh= 80;
                        }
                    }

                }
                if(o.design_skin=='skin-justthumbandbutton'){
                    if(o.design_thumbh=='default'){
                        o.design_thumbh = '';
//                        res_thumbh = true;
                    }
                    o.disable_timer='on';
                    o.disable_volume='on';

                    if(o.design_animateplaypause=='default'){
                        o.design_animateplaypause = 'on';
                    }
                }
                if(o.design_skin=='skin-redlights'){
                    o.disable_timer='on';
                    o.disable_volume='off';
                    if(o.design_animateplaypause=='default'){
                        o.design_animateplaypause = 'on';
                    }

                }
                if(o.design_skin=='skin-steel'){
                    if(o.disable_timer=='default'){

                        o.disable_timer='off';
                    }
                    o.disable_volume='on';
                    if(o.design_animateplaypause=='default'){
                        o.design_animateplaypause = 'on';
                    }


                    if(o.disable_scrub=='default'){
                        o.disable_scrub='on';
                    }

                }
                if(o.design_skin=='skin-customcontrols'){
                    if(o.disable_timer=='default'){

                        o.disable_timer='on';
                    }
                    o.disable_volume='on';
                    if(o.design_animateplaypause=='default'){
                        o.design_animateplaypause = 'on';
                    }


                    if(o.disable_scrub=='default'){
                        o.disable_scrub='on';
                    }

                }


                if(o.design_thumbh=='default'){
                    design_thumbh= 200;
                }
                if(o.embed_code==''){
                    if(cthis.find('div.feed-embed-code').length>0){
                        o.embed_code = cthis.find('div.feed-embed-code').eq(0).html();
                    }
                }

                if(o.design_animateplaypause=='default'){
                    o.design_animateplaypause = 'off';
                }

                if(o.design_animateplaypause=='on'){
                    cthis.addClass('design-animateplaypause');
                }
//                console.info(the_player_id, o.skinwave_comments_enable, o.skinwave_comments_playerid);

                if(o.skinwave_comments_playerid==''){
                    if(typeof(cthis.attr('id'))!='undefined'){
                        the_player_id = cthis.attr('id');
                    }
                }else{
                    the_player_id = o.skinwave_comments_playerid;

                    if(typeof(cthis.attr('id'))=='undefined'){
                        cthis.attr('id', the_player_id);
                    }
                }

                if(the_player_id==''){
                    o.skinwave_comments_enable='off';

                }


                if(cthis.attr('data-fakeplayer')){
                    if(cthis.attr('data-type') && (is_android() || is_ios())==false){

                        o.fakeplayer = $(cthis.attr('data-fakeplayer')).eq(0);
                        o.type_for_fake_feed=  cthis.attr('data-type');
                        cthis.attr('data-type','fake');
                        o.type='fake';
                        type='fake';

                    }
                }

                if(o.construct_player_list_for_sync=='on'){

                    if(dzsap_list_for_sync_sw_build==false){

                        dzsap_list_for_sync_players = [];

                        dzsap_list_for_sync_sw_build = true;

                        $('.audioplayer.is-single-player,.audioplayer-tobe.is-single-player').each(function(){
                            var _t23 = $(this);

                            // console.info(_t23);
                            dzsap_list_for_sync_players.push(_t23);
                        })

                        // console.info(dzsap_list_for_sync_players);

                        clearTimeout(dzsap_list_for_sync_inter_build);

                        dzsap_list_for_sync_inter_build = setTimeout(function(){
                            dzsap_list_for_sync_sw_build=false;
                        }, 500);

                    }
                }


                playfrom = o.playfrom;

                if(isValid(cthis.attr('data-playfrom'))){
                    playfrom = cthis.attr('data-playfrom');
                }

                if(isNaN(parseInt(playfrom,10))==false){
                    playfrom = parseInt(playfrom,10);
                }



//                console.info(the_player_id, o.skinwave_comments_enable);

                if(cthis.attr('data-type')=='youtube'){
                    o.type='youtube';

                    type='youtube';
                }
                if(cthis.attr('data-type')=='soundcloud'){
                    o.type='soundcloud';
                    type = 'soundcloud';
                }
                if(cthis.attr('data-type')=='shoutcast'){
                    o.type='shoutcast';
                    type = 'audio';
                    o.disable_timer='on';
                    //===might still use it for skin-wave

                    if(o.design_skin=='skin-default'){
                        o.disable_scrub='on';
                    }
//                    o.disable_scrub = 'on';
                }

                if(type==''){
                    type='audio';
                }

                //====we disable the function if audioplayer inited
                if(cthis.hasClass('audioplayer')){
                    return;
                }
                //console.info('ceva');

                if(cthis.attr('id')!=undefined){
                    cthisId = cthis.attr('id');
                }else{
                    cthisId = 'ap' + dzsap_globalidind++;
                }

                if(is_ie8()){
                    if(o.cue=='off'){
                        o.cue='on';
                    }
                }



                cthis.removeClass('audioplayer-tobe');
                cthis.addClass('audioplayer');


                if(cthis.find('.the-comments').length>0 && cthis.find('.the-comments').eq(0).children().length>0){
                    arr_the_comments = cthis.find('.the-comments').eq(0).children();
                }else{
                    if(o.skinwave_comments_retrievefromajax=='on'){

                        var data = {
                            action: 'dzsap_get_comments',
                            postdata: '1',
                            playerid: the_player_id
                        };





                        if(o.settings_php_handler){
                            $.ajax({
                                type: "POST",
                                url: o.settings_php_handler,
                                data: data,
                                success: function(response) {
                                    //if(typeof window.console != "undefined" ){ console.log('Ajax - get - comments - ' + response); }

                                    cthis.prependOnce('<div class="the-comments"></div>', '.the-comments');

                                    if(response.indexOf('a-comment')>-1){

                                        response = response.replace(/a-comment/g, 'a-comment dzstooltip-con');
                                        response = response.replace(/dzstooltip arrow-bottom/g, 'dzstooltip arrow-from-start transition-slidein arrow-bottom');

                                    }
                                    cthis.find('.the-comments').eq(0).html(response);

                                    arr_the_comments = cthis.find('.the-comments').eq(0).children();

                                    setup_controls_commentsHolder();

                                },
                                error:function(arg){
                                    if(typeof window.console != "undefined" ){ console.log('Got this from the server: ' + arg, arg); };
                                }
                            });
                        }

                    }
                }



                //===ios does not support volume controls so just let it die
                //====== .. or autoplay FORCE STAFF


                if(is_ios() || is_android()){

                    o.autoplay = 'off';
                    o.disable_volume='on';


                    if(o.cue=='off'){
                        o.cue='on';
                    }
                    o.cue='on';
                }

                if(type=='youtube'){
                    if(dzsap_ytapiloaded==false){
                        var tag = document.createElement('script');

                        tag.src = "https://www.youtube.com/iframe_api";
                        var firstScriptTag = document.getElementsByTagName('script')[0];
                        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
                        dzsap_ytapiloaded = true;
                    }
                }
                data_source = cthis.attr('data-source');



                //====sound cloud INTEGRATION //
                if(cthis.attr('data-source')!=undefined && String(cthis.attr('data-source')).indexOf('https://soundcloud.com/')>-1){
                    type='soundcloud';
                }
                //console.info(o.type);
                if(type=='soundcloud'){

                    if(o.soundcloud_apikey==''){
                        alert('soundcloud api key not defined, read docs!');
                    }
                    var aux = 'http://api.' + 'soundcloud.com' + '/resolve?url='+data_source+'&format=json&consumer_key=' + o.soundcloud_apikey;
                    //console.info(aux);

                    if( (o.design_skin=='skin-wave' && !cthis.attr('data-scrubbg')) || is_ie8()){
                        o.skinwave_enableReflect='off';
                    }

                    aux = encodeURIComponent(aux);
                    $.getJSON((o.php_retriever+'?scurl='+aux), function(data) {
                        //console.log(data, data.waveform_url);
                        type='audio';




                        if(o.design_skin=='skin-wave' && cthis.attr('data-scrubbg')==undefined){

                            cthis.attr('data-scrubbg', data.waveform_url);
                            cthis.attr('data-scrubprog', data.waveform_url);
                            _scrubbar.find('.scrub-bg').eq(0).append('<div class="scrub-bg-div"></div>');
                            _scrubbar.find('.scrub-bg').eq(0).append('<img src="'+cthis.attr('data-scrubbg')+'" class="scrub-bg-img"/>');
                            _scrubbar.children('.scrub-prog').eq(0).append('<div class="scrub-prog-div"></div>');

                            _scrubbar.find('.scrub-bg').css({
                                //'height' : '100%'
                                'top' : 0
                            })
                        }

//                        if(window.console) { console.info(data); };

                        cthis.attr('data-source', data.stream_url + '?consumer_key='+ o.soundcloud_apikey+'&origin=localhost');


                        if(o.cue=='on'){
                            setup_media();
                        }



                    });
//                    type='audio';
                }
                //====END soundcloud INTEGRATION//


                if((can_play_mp3()==false && cthis.attr('data-sourceogg')==undefined) || is_ie8() || o.settings_useflashplayer=='on'){
                    is_flashplayer=true;
                }

                setup_structure();

                //console.info(cthis, is_ios(), o.type);
                //trying to access the youtube api with ios did not work

                //console.log(is_flashplayer)


                if(o.scrubbar_tweak_overflow_hidden=='on'){

                    cthis.addClass('scrubbar-tweak-overflow-hidden-on');
                }else{

                    cthis.removeClass('scrubbar-tweak-overflow-hidden-on');
                }





//                console.info(o.design_skin, type, o.skinwave_comments_enable, o.design_skin=='skin-wave' && (type=='audio'||type=='soundcloud') && o.skinwave_comments_enable=='on');

                //console.log(o.design_skin, type, o.skinwave_comments_enable)

                if(o.design_skin=='skin-wave' && (type=='audio'||type=='soundcloud'||type=='fake') && o.skinwave_comments_enable=='on'){
                    cthis.appendOnce('<div class="comments-holder"><div class="the-bg"></div></div><div class="clear"></div><div class="comments-writer"><div class="comments-writer-inner"><div class="setting"><div class="setting-label"></div><textarea name="comment-text" placeholder="Your comment.." type="text" class="comment-input"></textarea><div class="float-right"><button class="submit-ap-comment dzs-button float-right">Submit</button><button class="cancel-ap-comment dzs-button float-right">Cancel</button></div><div class="overflow-it"><input placeholder="Your email.." name="comment-email" type="text" class="comment-input"/></div><div class="clear"></div></div></div></div>');
                    _commentsHolder = cthis.find('.comments-holder').eq(0);
                    _commentsWriter = cthis.find('.comments-writer').eq(0);



                    setup_controls_commentsHolder();
                    _commentsHolder.find('.the-bg').bind('click', click_comments_bg);
                    _commentsWriter.find('.cancel-ap-comment').bind('click', click_cancel_comment);
                    _commentsWriter.find('.submit-ap-comment').bind('click', click_submit_comment);
                }


                if(o.settings_extrahtml!=''){

                    //if(cthis.hasClass('alternate-layout')){
                    //    _apControls.append('<div class="extra-html">'+o.settings_extrahtml+'</div>');
                    //}else{
                    //}
                    cthis.append('<div class="extra-html">'+o.settings_extrahtml+'</div>');

                }

                if(type=='youtube'){
                    if(dzsap_list){
                        dzsap_list.push(cthis);
                    }

                    _theMedia.append('<div id="ytplayer_'+cthisId+'"></div>');
                    cthis.get(0).fn_yt_ready = check_yt_ready;

                    if(window.YT){
                        check_yt_ready();
                    }
                }




                //console.info();






                if(type=='audio'){


//                    img = document.createElement('img');
//                    img.onerror = function(){
//                        return;
//                        if(cthis.children('.meta-artist').length>0){
//                            _audioplayerInner.children('.meta-artist').html('audio not found...');
//                        }else{
//                            _audioplayerInner.append('<div class="meta-artist">audio not found...</div>');
//                            _audioplayerInner.children('.meta-artist').eq(0).wrap('<div class="meta-artist-con"></div>');
//                        }
//                    };
//                    img.src= cthis.attr('data-source');

                }

                if(o.autoplay=='on' && o.cue=='on'){
                    increment_views=1;
                }


                if(type=='youtube' && is_ios()){
                    if(cthis.height()<200){
                        cthis.height(200);
                    }
                    aux = '<iframe width="100%" height="100%" src="//www.youtube.com/embed/'+data_source+'" frameborder="0" allowfullscreen></iframe>';
                    cthis.html(aux);
                    return;
                }else{
                    //soundcloud will setupmedia when api done

                    // console.info(o.cue, type);
                    if(o.cue=='on' && type!='soundcloud'){


                        if(is_android() || is_ios()){

                            cthis.find('.playbtn').bind('click', play_media);
                        }
                        setup_media();


                    }else{

                        cthis.find('.playbtn').bind('click', click_for_setup_media);
                        cthis.find('.scrubbar').bind('click', click_for_setup_media);
                        handleResize();
                    }

                }

                setInterval(function(){
                    debug_var = true;
                },1000);

                // -- we call the api functions here
                //console.info('api sets');

                cthis.get(0).api_destroy = destroy_it; // -- destroy the player and the listeners
                cthis.get(0).api_play = play_media; // -- play the media
                cthis.get(0).api_click_for_setup_media = click_for_setup_media; // -- play the media
                cthis.get(0).api_handleResize = handleResize; // -- force resize event
                cthis.get(0).api_set_playback_speed = set_playback_speed; // -- set the playback speed, only works for local hosted mp3
                cthis.get(0).api_change_media = change_media; // -- change the media file from the API
                cthis.get(0).api_seek_to_perc = seek_to_perc; // -- seek to percentage ( for example seek to 0.5 skips to half of the song )
                cthis.get(0).api_seek_to_onlyvisual = seek_to_onlyvisual; // -- seek to perchange but only visually ( does not actually skip to that ) , good for a fake player
                cthis.get(0).api_set_volume = set_volume; // -- set a volume
                cthis.get(0).api_destroy_listeners = destroy_listeners; // -- set a volume

                cthis.get(0).api_pause_media = pause_media; // -- pause the media
                cthis.get(0).api_pause_media_visual = pause_media_visual; // -- pause the media, but only visually
                cthis.get(0).api_play_media = play_media;// -- play the media
                cthis.get(0).api_play_media_visual = play_media_visual; // -- play the media, but only visually
                cthis.get(0).api_change_visual_target = change_visual_target; // -- play the media, but only visually

                cthis.get(0).api_set_action_audio_play = function(arg){
                    action_audio_play = arg;
                };
                cthis.get(0).api_set_action_audio_end = function(arg){
                    action_audio_end = arg;
                };
                cthis.get(0).api_set_action_audio_comment = function(arg){
                    action_audio_comment = arg;
                };

                //console.log(cthis.get(0));

                //console.info(o);
                if(o.action_audio_play){  action_audio_play = o.action_audio_play;  };
                if(o.action_audio_play2){ action_audio_play2 = o.action_audio_play2;  };

                if(o.action_audio_end){
                    action_audio_end = o.action_audio_end;
                }



                //console.log(o.design_skin);
                if(o.design_skin=='skin-minimal'){
                    check_time({
                        'fire_only_once': true
                    });
                }


                $(window).bind('resize', handleResize);
                handleResize();


                cthis.find('.prev-btn').eq(0).bind('click',click_prev_btn);
                cthis.find('.next-btn').eq(0).bind('click',click_next_btn);
                cthis.find('.btn-menu-state').eq(0).bind('click',click_menu_state);
            }

            function select_all(el) {
                if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
                    var range = document.createRange();
                    range.selectNodeContents(el);
                    var sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                } else if (typeof document.selection != "undefined" && typeof document.body.createTextRange != "undefined") {
                    var textRange = document.body.createTextRange();
                    textRange.moveToElementText(el);
                    textRange.select();
                }
            }

            function change_visual_target(arg,pargs){
                // -- change the visual target, the main is the main palyer playing and the visual target is the player which is a visual representation of this

                //console.info(arg);

                var margs = {

                }




                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                _feed_fakePlayer = arg;

            }


            function change_media(arg,pargs){
                // -- change media source for the player / change_media("song.mp3", {type:"audio", fakeplayer_is_feeder:"off"});


                var margs = {
                    type: ''
                    ,fakeplayer_is_feeder : 'off'
                    ,call_from : 'default'
                }

                var handle_resize_delay = 500;
                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                // console.info(_feed_fakePlayer,margs.fakeplayer_is_feeder);
                if(_feed_fakePlayer){
                    _feed_fakePlayer.get(0).api_pause_media_visual();
                }

                //console.log(cthis, _feed_fakePlayer, arg);
                if(margs.fakeplayer_is_feeder=='on'){
                    _feed_fakePlayer = arg;
                }else{
                    _feed_fakePlayer = null;
                }



                // --- if the media is the same DON'T CHANGE IT
                if(cthis.attr('data-source')==arg.attr('data-source')){
                    return false;
                }

                console.info('change_media()',arg,margs, cthis);

                if(cthis.parent().hasClass('audioplayer-was-loaded')){

                    cthis.parent().addClass('audioplayer-loaded');
                    cthis.parent().removeClass('audioplayer-was-loaded');
                }


                cthis.removeClass('errored-out');




                destroy_media();



                var _arg = arg;


                //console.info(cthis);
                cthis.attr('data-source', arg.attr('data-source'));
                if(margs.type){

                    if(margs.type=='soundcloud'){
                        margs.type = 'audio';
                    }
                    cthis.attr('data-type', margs.type);
                    type = margs.type;
                    o.type = margs.type;
                }

                loaded=false;

                if(o.design_skin=='skin-wave' && o.skinwave_mode=='small'){
                    cthis.addClass('transitioning-change-media');



                    // -- artist
                    if(_arg.find('.meta-artist').length>0){

                        var aux_l = 0;
                        if(_metaArtistCon && _metaArtistCon.offset()){

                            var aux_l = _metaArtistCon.offset().left - cthis.offset().left-13;
                        }
                        //console.log(aux_l);
                        _metaArtistCon.css({

                            'position' : 'absolute'
                            ,'top': '16px'
                            ,'left' : aux_l+'px'
                        });
                        _metaArtistCon.animate({

                            'top': '-50px'
                            ,'opacity': '0'
                        }, {
                            duration: 300
                        })


                        if(cthis.find('.the-thumb-con').length>0){
                            cthis.find('.the-thumb-con').addClass('transitioning-out');
                        }else{

                        }

                        _apControlsLeft.append('<div class="meta-artist-con transitioning" style="top:55px;"><div class="meta-artist">'+_arg.find('.meta-artist').eq(0).html()+'</div></div>');

                        cthis.find('.meta-artist-con.transitioning').eq(0).animate({

                            'top': '18px'
                        }, {
                            duration: 300
                            ,complete:function(){
                                //console.info(this);
                                $(this).css('top','');
                                $(this).removeClass('transitioning');
                                _metaArtistCon = $(this);

                            }
                        })


                    }
                    console.log(_arg, _arg.attr('data-thumb'));

                    if(_arg.attr('data-thumb')){
                        if(cthis.find('.the-thumb-con').length>0){
                            cthis.find('.the-thumb-con').addClass('transitioning-out');
                        }else{

                        }


                        var aux_mec = ';';


                        cthis.find('.the-thumb-con.transitioning-out').css({

                            'position' : 'absolute'
                            ,'top': '0px'
                            ,'left' : 0+'px'
                        });

                        //console.log(_theThumbCon);
                        cthis.find('.the-thumb-con.transitioning-out').animate({

                            'top': '-80px'
                        }, {
                            duration: 500
                        })



                        var aux_thumb_con_str = '';
                        var str_thumbh = 'width: 80px;';

                        if(_arg.attr('data-thumb_link')){
                            aux_thumb_con_str += '<a href="'+_arg.attr('data-thumb_link')+'"';
                        }else{
                            aux_thumb_con_str += '<div';
                        }
                        aux_thumb_con_str+=' class="the-thumb-con" style="top: 80px;"><div class="the-thumb" style="'+str_thumbh+'  background-image:url('+_arg.attr('data-thumb')+')"></div>';


                        if(_arg.attr('data-thumb_link')){
                            aux_thumb_con_str += '</a>';
                        }else{
                            aux_thumb_con_str += '</div>';
                        }

                        _apControlsLeft.prepend(aux_thumb_con_str);


                        cthis.find('.the-thumb-con').eq(0).animate({

                            'top': '0'
                        }, {
                            duration: 700
                        })

                    }else{

                    }





                    if(cthis.find('.scrub-bg').length>0 && _arg.attr('data-scrubbg')){

                        var aux_mec = ';';


                        //console.log(_theThumbCon);
                        cthis.find('.scrub-bg,.scrub-prog,.scrub-bg-reflect,.scrub-prog-reflect').animate({

                            'opacity':0
                        }, {
                            duration: 500
                        })

                        var aux_str_scrubbar = '';



                        aux_str_scrubbar+='<div class="scrub-bg is-new" style="opacity: 0;"></div><div class="scrub-buffer"></div><div class="scrub-prog is-new"  style="opacity: 0;"></div>';

                        if(o.design_skin == 'skin-wave' && o.skinwave_enableReflect=='on'){
                            aux_str_scrubbar+='<div class="scrub-bg-reflect is-new" style="opacity: 0;"></div>';
                            aux_str_scrubbar+='<div class="scrub-prog-reflect is-new" style="opacity: 0;"></div>';

                        }

                        if(sample_perc_start){

                            aux_str_scrubbar+='<div class="sample-block-start is-new" style="width: '+(sample_perc_start*100)+'%"></div>'
                        }
                        if(sample_perc_end){

                            aux_str_scrubbar+='<div class="sample-block-end is-new" style="left: '+(sample_perc_end*100)+'%; width: '+(100 - (sample_perc_end*100) )+'%"></div>'
                        }

                        _scrubbar.children('.total-time').before(aux_str_scrubbar);



                        if(_arg.attr('data-scrubbg')!=undefined){
                            _scrubbar.children('.scrub-bg.is-new').append('<img class="scrub-bg-img" src="'+_arg.attr('data-scrubbg')+'"/>');
                        }
                        if(_arg.attr('data-scrubprog')!=undefined){
                            _scrubbar.children('.scrub-prog.is-new').eq(0).append('<img class="scrub-prog-img" src="'+_arg.attr('data-scrubprog')+'"/>');
                        }
                        _scrubbar.find('.scrub-bg-img').css({
                            'width' : _scrubbar.children('.scrub-bg.is-new').width()
                        });
                        _scrubbar.find('.scrub-prog-img').css({
                            'width' : _scrubbar.children('.scrub-bg.is-new').width()
                        });
                        //console.info(o.skinwave_enableReflect);
                        if(o.skinwave_enableReflect=='on'){
                            _scrubbar.children('.scrub-bg-reflect.is-new').eq(0).append('<img class="scrub-bg-img-reflect" src="'+_arg.attr('data-scrubbg')+'"/>');
                            if(cthis.attr('data-scrubprog')!=undefined){
                                _scrubbar.children('.scrub-prog-reflect.is-new').eq(0).append('<img class="scrub-prog-img-reflect" src="'+_arg.attr('data-scrubprog')+'"/>');
                            }


                            _scrubbar.find('.scrub-bg-img').css({
                                'transform-origin' : '100% 100%'
                            })
                            _scrubbar.find('.scrub-prog-img').css({
                                'transform-origin' : '100% 100%'
                            })
                            _scrubbar.find('.scrub-prog-img-reflect').css({
                                'width' : _scrubbar.children('.scrub-bg.is-new').width()
                            });
                        }


                        setTimeout(function(){



                            //console.info(cthis.find('.scrub-bg.is-new,.scrub-prog.is-new,.scrub-bg-reflect.is-new,.scrub-prog-reflect.is-new'));

                            cthis.find('.scrub-bg.is-new,.scrub-prog.is-new').animate({

                                'opacity':1
                            }, {
                                duration: 500
                                ,queue:false
                            })
                            cthis.find('.scrub-bg-reflect.is-new,.scrub-prog-reflect.is-new').animate({

                                'opacity':0.5
                            }, {
                                duration: 500
                                ,queue:false
                            })
                        },100)

                    }


                    setTimeout(function(){
                        if(cthis.find('.meta-artist-con').length>1){
                            cthis.find('.meta-artist-con').eq(0).remove();
                            _metaArtistCon = cthis.find('.meta-artist-con').eq(0);

                        }
                        if(cthis.find('.the-thumb-con').length>1){
                            cthis.find('.the-thumb-con').eq(1).remove();
                            _theThumbCon = cthis.find('.the-thumb-con').eq(0);
                        }

                        _scrubbar.find('.scrub-bg:not(.is-new)').remove();
                        _scrubbar.find('.scrub-prog:not(.is-new)').remove();
                        _scrubbar.find('.scrub-bg-reflect:not(.is-new)').remove();
                        _scrubbar.find('.scrub-prog-reflect:not(.is-new)').remove();
                        _scrubbar.find('.is-new').removeClass('is-new');


                        cthis.removeClass('transitioning-change-media');
                    }, 900);
                }




                if(o.design_skin=='skin-silver'){





                    var aux_l = 0;



                    if(_metaArtistCon && _metaArtistCon.length>0){

                        aux_l = _metaArtistCon.offset().left - cthis.offset().left - 13;


                        //console.log(aux_l);
                        _metaArtistCon.css({

                            'position': 'absolute'
                            , 'top': '0px'
                            , 'left': aux_l + 'px'
                        });
                        _metaArtistCon.animate({

                            'top': '-50px'
                            , 'opacity': '0'
                        }, {
                            duration: 300
                        })

                    }else{
                        aux_l = 0;
                    }
                    if(_arg.find('.meta-artist').length>0) {

                    }



                    // -- still skin-silver

                    var meta_artist_html = '';
                    var meta_artist_thumb = '';

                    if(_arg.find('.meta-artist').eq(0).html()){
                        meta_artist_html = _arg.find('.meta-artist').eq(0).html();
                    }



                    if(_arg.attr('data-thumb')){
                        if(cthis.find('.the-thumb-con').length>0){
                            cthis.find('.the-thumb-con').addClass('transitioning-out');
                        }else{

                        }


                        meta_artist_thumb+='<div class="the-thumb-con" style=""><div class="the-thumb" style="  background-image:url('+_arg.attr('data-thumb')+')"></div></div>';


                        // if(_arg.attr('data-thumb_link')){
                        //     aux_thumb_con_str += '</a>';
                        // }else{
                        //     aux_thumb_con_str += '</div>';
                        // }




                    }else{

                    }





                    cthis.addClass('transitioning-change-media');
                    _apControlsRight.append('<div class="meta-artist-con transitioning" style="top:55px;">'+meta_artist_thumb+'<div class="meta-artist">'+meta_artist_html+'</div></div>');

                    if(aux_l==0){
                        aux_l = cthis.width() - _apControlsRight.find('.meta-artist-con.transitioning').last().width()
                    }

                    cthis.find('.meta-artist-con').last().css({
                        'top' : '50px'
                        ,'position': 'relative'
                    })
                    cthis.find('.meta-artist-con').last().animate({

                        'top':'0px'
                    }, {
                        duration: 500
                    });

                    setTimeout(function(){
                        if(cthis.find('.meta-artist-con').length>1){
                            cthis.find('.meta-artist-con').eq(0).remove();
                            _metaArtistCon = cthis.find('.meta-artist-con').eq(0);
                            _metaArtistCon.css({
                                'position':'relative'
                                ,'left':'0'
                            })

                        }else{

                            _metaArtistCon = cthis.find('.meta-artist-con').eq(0);
                            _metaArtistCon.css({
                                'position':'relative'
                                ,'left':'0'
                            })
                        }


                        cthis.removeClass('transitioning-change-media');
                    }, 900);
                }

                handle_resize_delay = 100;
                if(_arg.find('.meta-artist').eq(0).html()){
                }


                setup_media();


                if(type=='fake') {
                    return false;

                }


                setTimeout(function(){

                    play_media();
                },500)
                setTimeout(function(){

                    handleResize();
                },handle_resize_delay)
            }


            function setup_controls_commentsHolder(){


                for(i=0;i<arr_the_comments.length;i++){
                    if(_commentsHolder && arr_the_comments[i]!=null){
                        _commentsHolder.append(arr_the_comments[i]);

                    }
                }
            }

            function destroy_listeners(){


                if(destroyed) { return false; }



                sw_suspend_enter_frame = true;

            }

            function destroy_it(){


                if(destroyed) { return false; }

                if(playing){
                    pause_media();
                }

                cthis.remove();
                cthis = null;

                destroyed = true;
            }

            function click_for_setup_media(e, pargs){
                // console.info('click_for_setup_media', cthis, pargs);

                //console.info(e.target);
                //cthis.unbind('click', click_for_setup_media);



                var margs = {

                    'do_not_autoplay' : false
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                cthis.find('.playbtn').unbind('click', click_for_setup_media);
                cthis.find('.scrubbar').unbind('click', click_for_setup_media);

                setup_media(margs);


                if(is_android() || is_ios()){

                    play_media();
                }
            }

            function blur_ap(){
                //console.log('ceva');
                hide_comments_writer();
            }

            function click_menu_state(e){

                if(o.parentgallery && typeof(o.parentgallery.get(0))!="undefined"){
                    o.parentgallery.get(0).api_toggle_menu_state();
                }
            }

            function click_comments_bg(e){
                var _t = $(this);
                var lmx = parseInt(e.clientX, 10) - _t.offset().left;
                sposarg = (lmx / _t.width()) * 100 + '%';
                var argcomm = htmlEncode('');

                if(o.skinwave_comments_allow_post_if_not_logged_in=='off' && o.skinwave_comments_account=='none'){

                    return false;
                }

                var sw = true;

                _commentsHolder.children().each(function(){
                    var _t2 = $(this);
                    //console.info(_t2);

                    if(_t2.hasClass('placeholder') || _t2.hasClass('the-bg')){
                        return;
                    }

                    var lmx2 = _t2.offset().left - _t.offset().left;

                    //console.info(lmx2, Math.abs(lmx2-lmx));

                    if(Math.abs(lmx2-lmx) < 20){
                        _commentsHolder.find('.dzstooltip-con.placeholder').remove();
                        sw = false;

                        return false;
                    }
                })


                if(!sw){
                    return false;
                }

                if(_commentsWriter.hasClass('active')==false){
                    _commentsWriter.css({
                        'height' : _commentsWriter.find('.comments-writer-inner').eq(0).outerHeight() + 20
                    })
                    _commentsWriter.addClass('active');

                    cthis.addClass('comments-writer-active');

                    if(o.parentgallery && $(o.parentgallery).get(0)!=undefined && $(o.parentgallery).get(0).api_handleResize!=undefined){
                        $(o.parentgallery).get(0).api_handleResize();
                    }
                }

                if(o.skinwave_comments_account!='none'){
                    cthis.find('input[name=comment-email]').remove();
                }

                _commentsHolder.find('.dzstooltip-con.placeholder').remove();
                _commentsHolder.append('<span class="dzstooltip-con placeholder" style="left:'+sposarg+';"><div class="the-avatar" style="background-image: url('+o.skinwave_comments_avatar+')"></div></span>');



                //cthis.unbind('focusout', blur_ap);
                //cthis.bind('blur', blur_ap);
            }
            function click_cancel_comment(e){
                hide_comments_writer();
            }
            function click_submit_comment(e){

                var comm_author = '';
                if(cthis.find('input[name=comment-email]').length>0){
                    var regex_mail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                    if(regex_mail.test(cthis.find('input[name=comment-email]').eq(0).val())==false){
                        alert('please insert email, your email is just used for gravatar. it will not be sent or stored anywhere');
                        return false;
                    }

                    comm_author = String(cthis.find('input[name=comment-email]').eq(0).val()).split('@')[0];
                    o.skinwave_comments_account = comm_author;
                    //console.info(comm_author);
                    o.skinwave_comments_avatar = 'https://secure.gravatar.com/avatar/'+MD5(String(cthis.find('input[name=comment-email]').eq(0).val()).toLowerCase())+'?s=20';
                }else{

                }
                comm_author = o.skinwave_comments_account;

                var aux = '';



                if(o.skinwave_comments_process_in_php!='on'){

                    // -- process the comment now, in javascript

                    aux+='<span class="dzstooltip-con" style="left:'+sposarg+'"><span class="dzstooltip arrow-from-start transition-slidein arrow-bottom skin-black" style="width: 250px;"><span class="the-comment-author">@'+comm_author+'</span> says:<br>';
                    aux+=htmlEncode(cthis.find('*[name=comment-text]').eq(0).val());


                    aux+='</span><div class="the-avatar" style="background-image: url('+o.skinwave_comments_avatar+')"></div></span>';
                }else{

                    // -- process php

                    aux+=cthis.find('*[name=comment-text]').eq(0).val();
                }


                cthis.find('*[name=comment-text]').eq(0).val('');





                skinwave_comment_publish(aux)

                hide_comments_writer();

                if(o.parentgallery && $(o.parentgallery).get(0)!=undefined && $(o.parentgallery).get(0).api_player_commentSubmitted!=undefined){
                    $(o.parentgallery).get(0).api_player_commentSubmitted();
                }




                return false;
            }
            function hide_comments_writer(){

                //console.log(_commentsWriter);
                cthis.removeClass('comments-writer-active');
                _commentsHolder.find('.dzstooltip-con.placeholder').remove();
                _commentsWriter.removeClass('active');
                _commentsWriter.css({
                    'height' : 0
                })


                if(o.parentgallery && $(o.parentgallery).get(0)!=undefined && $(o.parentgallery).get(0).api_handleResize!=undefined){
                    $(o.parentgallery).get(0).api_handleResize();
                }
                //cthis.unbind('focusout', blur_ap);
            }
            function check_yt_ready(){
                //console.info(loaded);
                if(loaded==true){
                    return;
                }
                //console.log('ceva');
                //var player;
                _cmedia = new YT.Player('ytplayer_'+cthisId+'', {
                    height: '200',
                    width: '200',
                    videoId: cthis.attr('data-source'),
                    playerVars: { origin: ''},
                    events: {
                        'onReady': check_yt_ready_phase_two,
                        'onStateChange': change_yt_state
                    }
                });
                //init_loaded();
            }
            function check_yt_ready_phase_two(arg){

                //console.log(arg);
                init_loaded();
            }
            function change_yt_state(arg){
                //console.log(arg);
            }
            function check_ready(pargs){
                // console.log('check_ready()', cthis, _cmedia, _cmedia.readyState);
                //=== do a little ready checking



                var margs = {

                    'do_not_autoplay' : false
                };


                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                // console.log(_cmedia.readyState);
                if(type=='youtube'){

                }else{
                    if(typeof(_cmedia)!='undefined'){//|| o.type=='soundcloud'

                        //console.info(_cmedia.readyState, o.type, is_safari());


//                        return false;
                        if(_cmedia.nodeName!="AUDIO" || o.type=='shoutcast' ){
                            init_loaded(margs);
                        }else{
                            if(is_safari()){

                                if(_cmedia.readyState>=1){
                                    //console.info("CALL INIT LOADED FROM ",_cmedia.readyState);
                                    init_loaded(margs);
                                    clearInterval(inter_checkReady);

                                    if(o.action_audio_loaded_metadata){
                                        o.action_audio_loaded_metadata(cthis);
                                    }
                                }
                            }else{
                                if(_cmedia.readyState>=2){
                                    //console.info("CALL INIT LOADED FROM ",_cmedia.readyState);
                                    init_loaded(margs);
                                    clearInterval(inter_checkReady);


                                    // console.info(o.action_audio_loaded_metadata)
                                    if(o.action_audio_loaded_metadata){
                                        o.action_audio_loaded_metadata(cthis);
                                    }
                                }
                            }

                        }
                    }

                }

            }
            function setup_structure(){
                //alert('ceva');
                cthis.append('<div class="audioplayer-inner"></div>');
                _audioplayerInner = cthis.children('.audioplayer-inner');
                _audioplayerInner.append('<div class="the-media"></div>');


                if(o.design_skin!='skin-customcontrols'){

                    _audioplayerInner.append('<div class="ap-controls"></div>');
                }
                _theMedia = _audioplayerInner.children('.the-media').eq(0);
                _apControls = _audioplayerInner.children('.ap-controls').eq(0);


                var aux_str_scrubbar = '<div class="scrubbar">';
                var aux_str_con_controls = '';
                var aux_str_con_controls_part2 = '';


                aux_str_scrubbar+='<div class="scrub-bg"></div><div class="scrub-buffer"></div><div class="scrub-prog"></div><div class="scrubBox"></div><div class="scrubBox-prog"></div><div class="scrubBox-hover"></div>';

                if(o.design_skin == 'skin-wave' && o.skinwave_enableReflect=='on'){
                    aux_str_scrubbar+='<div class="scrub-bg-reflect"></div>';
                    aux_str_scrubbar+='<div class="scrub-prog-reflect"></div>';

                }
                if(o.design_skin=='skin-wave' && o.disable_timer!='on'){
                    aux_str_scrubbar+='<div class="total-time">00:00</div><div class="curr-time">00:00</div>';

                }

                if(sample_perc_start){

                    aux_str_scrubbar+='<div class="sample-block-start" style="width: '+(sample_perc_start*100)+'%"></div>'
                }
                if(sample_perc_end){

                    aux_str_scrubbar+='<div class="sample-block-end" style="left: '+(sample_perc_end*100)+'%; width: '+(100 - (sample_perc_end*100) )+'%"></div>'
                }

                aux_str_scrubbar+='</div>';// -- end scrubbar

                aux_str_con_controls+='<div class="con-controls"><div class="the-bg"></div><div class="con-playpause"><div class="playbtn"><div class="play-icon"></div><div class="play-icon-hover"></div></div><div class="pausebtn" style="display:none"><div class="pause-icon"><div class="pause-part-1"></div><div class="pause-part-2"></div></div><div class="pause-icon-hover"></div></div></div>';

                if(o.settings_extrahtml_in_float_left){
                    aux_str_con_controls+= o.settings_extrahtml_in_float_left;
                }


                //console.info(o.disable_timer, aux_str_con_controls);
                if(o.design_skin!='skin-wave' && o.disable_timer!='on'){
                    aux_str_con_controls+='<div class="curr-time">00:00</div><div class="total-time">00:00</div>';

                }



                if(o.design_skin=='skin-default' || o.design_skin=='skin-wave'){

                    aux_str_con_controls+='<div class="ap-controls-right">';
                    if(o.disable_volume!='on'){
                        aux_str_con_controls+='<div class="controls-volume"><div class="volumeicon"></div><div class="volume_static"></div><div class="volume_active"></div><div class="volume_cut"></div></div>';
                    }


                    if(o.settings_extrahtml_in_float_right){
                        aux_str_con_controls+= o.settings_extrahtml_in_float_right;
                    }

                    aux_str_con_controls+='</div>';
                    aux_str_con_controls+='<div class="clear"></div>';


                }

                aux_str_con_controls+='</div>';// -- end con-controls
                //console.info(o.disable_timer, aux_str_con_controls);


                if(o.design_skin == 'skin-wave' && o.skinwave_mode=='small'){
                    aux_str_con_controls = '<div class="the-bg"></div><div class="ap-controls-left"><div class="con-playpause"><div class="playbtn"><div class="play-icon"></div><div class="play-icon-hover"></div></div><div class="pausebtn" style="display:none"><div class="pause-icon"><div class="pause-part-1"></div><div class="pause-part-2"></div></div><div class="pause-icon-hover"></div></div></div></div><div class="ap-controls-right"><div class="controls-volume"><div class="volumeicon"></div><div class="volume_static"></div><div class="volume_active"></div><div class="volume_cut"></div></div></div>';


                    _apControls.append(aux_str_con_controls+aux_str_scrubbar);



                }else{

                    if(o.design_skin == 'skin-aria' || o.design_skin=='skin-silver' || o.design_skin=='skin-redlights' || o.design_skin=='skin-steel'){


                        var playbtn_svg = '<svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="30px" viewBox="0 0 25 30" xml:space="preserve"> <path d="M24.156,13.195L2.406,0.25C2.141,0.094,1.867,0,1.555,0C0.703,0,0.008,0.703,0.008,1.562H0v26.875h0.008 C0.008,29.297,0.703,30,1.555,30c0.32,0,0.586-0.109,0.875-0.266l21.727-12.93C24.672,16.375,25,15.727,25,15 S24.672,13.633,24.156,13.195z"/> </svg>';
                        var pausebtn_svg = '<svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="25px" height="30px" viewBox="0 0 25 30" xml:space="preserve"> <path d="M24.156,13.195L2.406,0.25C2.141,0.094,1.867,0,1.555,0C0.703,0,0.008,0.703,0.008,1.562H0v26.875h0.008 C0.008,29.297,0.703,30,1.555,30c0.32,0,0.586-0.109,0.875-0.266l21.727-12.93C24.672,16.375,25,15.727,25,15 S24.672,13.633,24.156,13.195z"/> </svg>';

                        if(o.design_skin=='skin-silver'){
                            playbtn_svg = '<svg version="1.2" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="30px" viewBox="0 0 25 30" xml:space="preserve"> <path d="M24.156,13.195L2.406,0.25C2.141,0.094,1.867,0,1.555,0C0.703,0,0.008,0.703,0.008,1.562H0v26.875h0.008 C0.008,29.297,0.703,30,1.555,30c0.32,0,0.586-0.109,0.875-0.266l21.727-12.93C24.672,16.375,25,15.727,25,15 S24.672,13.633,24.156,13.195z"/> </svg>';
                            pausebtn_svg = '<svg version="1.2" baseProfile="tiny" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="30px" viewBox="0 0 25 30" xml:space="preserve"> <path d="M9.812,29.7c0,0.166-0.178,0.3-0.398,0.3H2.461c-0.22,0-0.398-0.134-0.398-0.3V0.3c0-0.166,0.178-0.3,0.398-0.3h6.953 c0.22,0,0.398,0.134,0.398,0.3V29.7z"/> <path d="M23.188,29.7c0,0.166-0.178,0.3-0.398,0.3h-6.953c-0.22,0-0.398-0.134-0.398-0.3V0.3c0-0.166,0.178-0.3,0.398-0.3h6.953 c0.22,0,0.398,0.134,0.398,0.3V29.7z"/> </svg>';
                        }

                        if(o.design_skin=='skin-redlights'||o.design_skin=='skin-steel'){
                            playbtn_svg = '';
                            pausebtn_svg = '';
                        }

                        aux_str_con_controls = '<div class="the-bg"></div><div class="ap-controls-left"><div class="con-playpause"><div class="playbtn"><div class="play-icon">'+playbtn_svg+'</div><div class="play-icon-hover"></div></div><div class="pausebtn" style="display:none"><div class="pause-icon">'+pausebtn_svg+'</div><div class="pause-icon-hover"></div></div></div>';


                        if(o.design_skin=='skin-silver'){

                            aux_str_con_controls+='<div class="curr-time">00:00</div>';
                        }


                        aux_str_con_controls+='</div>';

                        //console.info(o.settings_extrahtml_in_float_right);


                        if(o.settings_extrahtml_in_float_right){
                            aux_str_con_controls+='<div class="controls-right">'+o.settings_extrahtml_in_float_right+'</div>';

                            //console.info(o._gall)
                            //console.info('dada');

                            if(o.design_skin=='skin-redlights'){

                                //console.info(o.parentgallery, o.parentgallery.get(0).api_skin_redlights_give_controls_right_to_all);
                                if(o.parentgallery && o.parentgallery.get(0).api_skin_redlights_give_controls_right_to_all){
                                    o.parentgallery.get(0).api_skin_redlights_give_controls_right_to_all();
                                }
                            }
                        }
                        //console.info('ceva');


                        aux_str_con_controls+='<div class="ap-controls-right">';

                        if(o.design_skin=='skin-silver'){

                            aux_str_con_controls+='<div class="controls-volume controls-volume-vertical"><div class="volumeicon"></div><div class="volume-holder"><div class="volume_static"></div><div class="volume_active"></div><div class="volume_cut"></div></div></div>';

                            if(o.disable_timer!='on'){
                                aux_str_con_controls+='<div class="total-time">00:00</div>';
                            }

                            aux_str_con_controls+='</div>'+aux_str_scrubbar;
                        }else{



                            if(o.design_skin=='skin-redlights' ){

                                if(o.disable_volume!='on'){
                                    aux_str_con_controls+='<div class="controls-volume"><div class="volumeicon"></div><div class="volume_static"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="57px" height="12px" viewBox="0 0 57 12" enable-background="new 0 0 57 12" xml:space="preserve"> <rect y="9" fill="#414042" width="3" height="3"/> <rect x="6" y="8" fill="#414042" width="3" height="4"/> <rect x="12" y="7" fill="#414042" width="3" height="5"/> <rect x="18" y="5.958" fill="#414042" width="3" height="6"/> <rect x="24" y="4.958" fill="#414042" width="3" height="7"/> <rect x="30" y="4" fill="#414042" width="3" height="8"/> <rect x="36" y="3" fill="#414042" width="3" height="9"/> <rect x="42" y="2" fill="#414042" width="3" height="10"/> <rect x="48" y="1" fill="#414042" width="3" height="11"/> <rect x="54" fill="#414042" width="3" height="12"/> </svg></div><div class="volume_active"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="57px" height="12px" viewBox="0 0 57 12" enable-background="new 0 0 57 12" xml:space="preserve"> <rect y="9" fill="#414042" width="3" height="3"/> <rect x="6" y="8" fill="#414042" width="3" height="4"/> <rect x="12" y="7" fill="#414042" width="3" height="5"/> <rect x="18" y="5.958" fill="#414042" width="3" height="6"/> <rect x="24" y="4.958" fill="#414042" width="3" height="7"/> <rect x="30" y="4" fill="#414042" width="3" height="8"/> <rect x="36" y="3" fill="#414042" width="3" height="9"/> <rect x="42" y="2" fill="#414042" width="3" height="10"/> <rect x="48" y="1" fill="#414042" width="3" height="11"/> <rect x="54" fill="#414042" width="3" height="12"/> </svg></div><div class="volume_cut"></div></div>';
                                }

                                aux_str_con_controls+='<div class="clear"></div>';
                            }

                            aux_str_con_controls+=aux_str_scrubbar;


                            if(o.disable_timer!='on'){
                                aux_str_con_controls+='<div class="total-time">00:00</div>';
                            }
                        }







                        if(o.design_skin=='skin-silver'){

                        }else{
                            aux_str_con_controls+='</div>';
                        }


                        _apControls.append(aux_str_con_controls);



                    }else{





                        if(cthis.hasClass('alternate-layout')){

                            _apControls.append(aux_str_con_controls+aux_str_scrubbar);

                        }else{
                            _apControls.append(aux_str_scrubbar+aux_str_con_controls);
                        }
                    }


                }

                if(_apControls.find('.ap-controls-left').length>0){
                    _apControlsLeft = _apControls.find('.ap-controls-left').eq(0);
                }
                if(_apControls.find('.ap-controls-right').length>0){
                    _apControlsRight = _apControls.find('.ap-controls-right').eq(0);
                }





                if(o.disable_timer!='on'){
                    _currTime = cthis.find('.curr-time').eq(0);
                    _totalTime = cthis.find('.total-time').eq(0);

                    if(o.design_skin == 'skin-steel'){
                        if(_currTime.length==0){
                            _totalTime.before('<div class="curr-time">00:00</div> <span class="separator-slash">/</span> ');
                            //console.info('WHAT WHAT IN THE BUTT', _totalTime, _totalTime.prev(),  cthis.find('.curr-time'));

                            _currTime = _totalTime.prev().prev();

                        }
                    }

                    //console.info(_currTime, _totalTime);
                }



                if(Number(o.sample_time_total)>0){

                    time_total = Number(o.sample_time_total);

                    //console.info(_currTime,time_total);
                    if(_totalTime){
                        _totalTime.html(formatTime(time_total));
                    }

                    //console.info(_totalTime.html());

                    //return false;
                }

                _scrubbar = _apControls.find('.scrubbar').eq(0);
                _conControls = _apControls.children('.con-controls');
                _conPlayPause = cthis.find('.con-playpause').eq(0);


                _controlsVolume = cthis.find('.controls-volume').eq(0);

                if(!_metaArtistCon){
                    if(cthis.children('.meta-artist').length>0){
                        //console.info(cthis.hasClass('alternate-layout'));
                        if(cthis.hasClass('alternate-layout')){
                            //console.info(_conControls.children().last());

                            if(_conControls.children().last().hasClass('clear')){
                                _conControls.children().last().remove();
                            }
                            _conControls.append(cthis.children('.meta-artist'));
                        }else{
                            _audioplayerInner.append(cthis.children('.meta-artist'));
                        }

                    }
                    _audioplayerInner.find('.meta-artist').eq(0).wrap('<div class="meta-artist-con"></div>');

                    //console.info('ceva');

                    _metaArtistCon = _audioplayerInner.children('.meta-artist-con').eq(0);

                    if(o.design_skin == 'skin-wave'){
                        _conPlayPause.after(_metaArtistCon);

                    }
                    if(o.design_skin == 'skin-aria'){
                        _apControlsRight.prepend(_metaArtistCon);

                    }
                    if(o.design_skin == 'skin-redlights' || o.design_skin=='skin-steel'){
                        _apControlsRight.prepend('<div class="clear"></div>');
                        _apControlsRight.prepend(_metaArtistCon);


                    }
                    if(o.design_skin == 'skin-silver'){

                        _apControlsRight.append(_metaArtistCon);
                    }
                    if(o.design_skin == 'skin-default'){


                        _apControlsRight.before(_metaArtistCon);
                    }
                }

                cthis.addClass('meta-loaded');


                var str_thumbh = "";
                if(design_thumbh!=''){
                    str_thumbh = ' height:'+o.design_thumbh+'px;';
                }


                if(cthis.attr('data-thumb')!=undefined && cthis.attr('data-thumb')!=''){


                    var aux_thumb_con_str = '';

                    if(cthis.attr('data-thumb_link')){
                        aux_thumb_con_str += '<a href="'+cthis.attr('data-thumb_link')+'"';
                    }else{
                        aux_thumb_con_str += '<div';
                    }
                    aux_thumb_con_str+=' class="the-thumb-con"><div class="the-thumb" style="'+str_thumbh+' background-image:url('+cthis.attr('data-thumb')+')"></div>';


                    if(cthis.attr('data-thumb_link')){
                        aux_thumb_con_str += '</a>';
                    }else{
                        aux_thumb_con_str += '</div>';
                    }


                    if(o.design_skin!='skin-customcontrols') {
                        if (o.design_skin == 'skin-wave' && o.skinwave_mode == 'small') {

                            _apControlsLeft.prepend(aux_thumb_con_str);
                        } else if (o.design_skin == 'skin-steel') {


                            _apControlsLeft.append(aux_thumb_con_str);
                        } else {

                            _audioplayerInner.prepend(aux_thumb_con_str);
                        }
                    }

                    _theThumbCon = _audioplayerInner.children('.the-thumb-con').eq(0);
                }

                //console.info(cthis, o.disable_volume,_controlsVolume);
                if(o.disable_volume=='on'){
                    _controlsVolume.hide();
                }
                if(o.disable_volume=='off'){
                    _controlsVolume.show();
                }
                if(o.disable_scrub=='on'){
                    _scrubbar.hide();
                }



                if(o.design_skin=='skin-wave' && o.parentgallery && typeof(o.parentgallery)!='undefined' && o.design_menu_show_player_state_button=='on'){



                    if(o.design_skin == 'skin-wave'){

                        _apControlsRight.appendOnce('<div class="btn-menu-state"> <svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="13.25px" height="13.915px" viewBox="0 0 13.25 13.915" enable-background="new 0 0 13.25 13.915" xml:space="preserve"> <path d="M1.327,4.346c-0.058,0-0.104-0.052-0.104-0.115V2.222c0-0.063,0.046-0.115,0.104-0.115H11.58 c0.059,0,0.105,0.052,0.105,0.115v2.009c0,0.063-0.046,0.115-0.105,0.115H1.327z"/> <path d="M1.351,8.177c-0.058,0-0.104-0.051-0.104-0.115V6.054c0-0.064,0.046-0.115,0.104-0.115h10.252 c0.058,0,0.105,0.051,0.105,0.115v2.009c0,0.063-0.047,0.115-0.105,0.115H1.351z"/> <path d="M1.351,12.182c-0.058,0-0.104-0.05-0.104-0.115v-2.009c0-0.064,0.046-0.115,0.104-0.115h10.252 c0.058,0,0.105,0.051,0.105,0.115v2.009c0,0.064-0.047,0.115-0.105,0.115H1.351z"/> </svg>    </div></div>');
                    }else{
                        _audioplayerInner.appendOnce('<div class="btn-menu-state"></div>');
                    }
                }
//                console.info(o.embed_code);


                if(o.design_skin=='skin-wave' && o.embed_code!=''){
                    if(o.design_skin == 'skin-wave'){
                        _apControlsRight.appendOnce('<div class="btn-embed-code-con dzstooltip-con "><div class="btn-embed-code"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10.975px" height="14.479px" viewBox="0 0 10.975 14.479" enable-background="new 0 0 10.975 14.479" xml:space="preserve"> <g> <path d="M2.579,1.907c0.524-0.524,1.375-0.524,1.899,0l4.803,4.804c0.236-0.895,0.015-1.886-0.687-2.587L5.428,0.959 c-1.049-1.05-2.75-1.05-3.799,0L0.917,1.671c-1.049,1.05-1.049,2.751,0,3.801l3.167,3.166c0.7,0.702,1.691,0.922,2.587,0.686 L1.867,4.52c-0.524-0.524-0.524-1.376,0-1.899L2.579,1.907z M5.498,13.553c1.05,1.05,2.75,1.05,3.801,0l0.712-0.713 c1.05-1.05,1.05-2.75,0-3.8L6.843,5.876c-0.701-0.7-1.691-0.922-2.586-0.686l4.802,4.803c0.524,0.525,0.524,1.376,0,1.897 l-0.713,0.715c-0.523,0.522-1.375,0.522-1.898,0L1.646,7.802c-0.237,0.895-0.014,1.886,0.686,2.586L5.498,13.553z"/> </g> </svg></div><span class="dzstooltip transition-slidein arrow-bottom align-right skin-black " style="width: 350px; "><span style="max-height: 150px; overflow:hidden; display: block;">'+o.embed_code+'</span></span></div>');
                    }else{
                        _audioplayerInner.appendOnce('<div class="btn-embed-code-con dzstooltip-con "><div class="btn-embed-code"><svg version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15px" viewBox="0 0 15 15" xml:space="preserve"> <g id="Layer_1"> <polygon fill="#E6E7E8" points="1.221,7.067 0.494,5.422 4.963,1.12 5.69,2.767 "/> <polygon fill="#E6E7E8" points="0.5,5.358 1.657,4.263 3.944,10.578 2.787,11.676 "/> <polygon fill="#E6E7E8" points="13.588,9.597 14.887,8.34 12.268,2.672 10.969,3.93 "/> <polygon fill="#E6E7E8" points="14.903,8.278 14.22,6.829 9.714,11.837 10.397,13.287 "/> </g> <g id="Layer_2"> <rect x="6.416" y="1.713" transform="matrix(0.9663 0.2575 -0.2575 0.9663 2.1699 -1.6329)" fill="#E6E7E8" width="1.805" height="11.509"/> </g> </svg></div><span class="dzstooltip transition-slidein arrow-bottom align-right skin-black " style="width: 350px; "><span style="max-height: 150px; overflow:hidden; display: block;">'+o.embed_code+'</span></span></div>');
                    }

                    cthis.find('.btn-embed-code-con').bind('click', function(){
                        var _t = $(this);
                        select_all(_t.find('.dzstooltip').get(0));
                    })
                }

                if(o.design_skin=='skin-wave'){
                    //console.info((o.design_thumbw + 20));
                    //console.info('url('+cthis.attr('data-scrubbg')+')');
                    if(o.skinwave_enableSpectrum!='on'){
                        if(cthis.attr('data-scrubbg')!=undefined){
                            _scrubbar.children('.scrub-bg').eq(0).append('<img class="scrub-bg-img" src="'+cthis.attr('data-scrubbg')+'"/>');
                        }
                        if(cthis.attr('data-scrubprog')!=undefined){
                            _scrubbar.children('.scrub-prog').eq(0).append('<img class="scrub-prog-img" src="'+cthis.attr('data-scrubprog')+'"/>');
                        }
                        _scrubbar.find('.scrub-bg-img').eq(0).css({
                            'width' : _scrubbar.children('.scrub-bg').width()
                        });
                        _scrubbar.find('.scrub-prog-img').eq(0).css({
                            'width' : _scrubbar.children('.scrub-bg').width()
                        });
                        //console.info(o.skinwave_enableReflect);
                        if(o.skinwave_enableReflect=='on'){
                            _scrubbar.children('.scrub-bg-reflect').eq(0).append('<img class="scrub-bg-img-reflect" src="'+cthis.attr('data-scrubbg')+'"/>');
                            if(cthis.attr('data-scrubprog')!=undefined){
                                _scrubbar.children('.scrub-prog-reflect').eq(0).append('<img class="scrub-prog-img-reflect" src="'+cthis.attr('data-scrubprog')+'"/>');
                            }


                            _scrubbar.find('.scrub-bg-img').eq(0).css({
                                'transform-origin' : '100% 100%'
                            })
                            _scrubbar.find('.scrub-prog-img').eq(0).css({
                                'transform-origin' : '100% 100%'
                            })
                        }
                    }else{
                        _scrubbar.children('.scrub-bg').eq(0).append('<canvas class="scrub-bg-canvas" style="width: 100%; height: 100%;"></canvas><div class="wave-separator"></div>');
                        _scrubBgCanvas = cthis.find('.scrub-bg-canvas').eq(0);
                        _scrubBgCanvasCtx = _scrubBgCanvas.get(0).getContext("2d");

                        if(type=='audio'){
                            _scrubbar.children('.scrub-prog').eq(0).append('<canvas class="scrub-prog-canvas" style="width: 100%; height: 100%;"></canvas>');
                            _scrubProgCanvas = cthis.find('.scrub-prog-canvas').eq(0);
                            _scrubProgCanvasCtx = _scrubProgCanvas.get(0).getContext("2d");
                        }

                        if(o.skinwave_enableReflect=='on'){
                            _scrubbar.children('.scrub-bg-reflect').eq(0).append('<canvas class="scrub-bg-canvas-reflect" style="width: 100%; height: 100%;"></canvas>');
                            _scrubBgReflectCanvas = _scrubbar.find('.scrub-bg-canvas-reflect').eq(0);
                            _scrubBgReflectCtx = _scrubBgReflectCanvas.get(0).getContext("2d");

                            if(type=='audio'){
                                _scrubbar.children('.scrub-prog-reflect').eq(0).append('<canvas class="scrub-prog-canvas-reflect" style="width: 100%; height: 100%;"></canvas>');

                                _scrubProgCanvasReflect = _scrubbar.find('.scrub-prog-canvas-reflect').eq(0);
                                _scrubProgCanvasReflectCtx = _scrubProgCanvasReflect.get(0).getContext("2d");
                            }

                        }

                    }



                    if(o.skinwave_timer_static=='on'){
                        if(_currTime){
                            _currTime.addClass('static');
                        }
                        if(_totalTime){
                            _totalTime.addClass('static');
                        }
                    }


                    _apControls.css({
                        //'height': design_thumbh
                    })



                    //console.info('setup_lsiteners()');
                    var auximg = new Image();

                    auximg.onload = function(e){

                        cthis.addClass('scrubbar-loaded');
                        handleResize();
                    }

                    auximg.src = (cthis.attr('data-scrubbg'));

                    setTimeout(function(){
                        cthis.addClass('scrubbar-loaded');
                    }, 2500); // -- tbc
                }
                // --- END skin-wave


                if(cthis.hasClass('skin-minimal')){
                    _conPlayPause.children('.playbtn').append('<canvas width="100" height="100" class="playbtn-canvas"/>');
                    skin_minimal_canvasplay = _conPlayPause.find('.playbtn-canvas').eq(0).get(0);
                    _conPlayPause.children('.pausebtn').append('<canvas width="100" height="100" class="pausebtn-canvas"/>');
                    skin_minimal_canvaspause = _conPlayPause.find('.pausebtn-canvas').eq(0).get(0);
                }

                //console.info(o.parentgallery, o.disable_player_navigation);
                if(typeof(o.parentgallery)!='undefined' && o.disable_player_navigation!='on'){
//                    _conControls.appendOnce('<div class="prev-btn"></div><div class="next-btn"></div>','.prev-btn');

                }

                if(cthis.hasClass('skin-minion')){
                    if(cthis.find('.menu-description').length>0){
                        //console.log('ceva');
                        _conPlayPause.addClass('with-tooltip');
                        _conPlayPause.prepend('<span class="dzstooltip" style="left:-7px;">'+cthis.find('.menu-description').html()+'</span>');
                        //console.info(_conPlayPause.children('span').eq(0), _conPlayPause.children('span').eq(0).textWidth());
                        _conPlayPause.children('span').eq(0).css('width', _conPlayPause.children('span').eq(0).textWidth() + 10);
                    }
                }



                // === setup_structore for both flash and html5
                if(o.parentgallery && typeof(o.parentgallery)!='undefined' && o.disable_player_navigation!='on'){
                    //console.info('ceva', is_flashplayer , o.settings_backup_type);

                    var prev_btn_str = '<div class="prev-btn"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="13.325px" viewBox="0 0 10 13.325" enable-background="new 0 0 10 13.325" xml:space="preserve"> <g id="Layer_2"> <polygon opacity="0.5" fill="#E6E7E8" points="3.208,7.674 5.208,9.104 5.208,5.062 3.208,5.652 "/> </g> <g id="Layer_1"> <rect x="0.306" y="3.074" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -1.4203 4.7299)" fill="#E6E7E8" width="9.386" height="2.012"/> <rect x="0.307" y="8.29" transform="matrix(0.7072 0.707 -0.707 0.7072 8.0362 -0.8139)" fill="#E6E7E8" width="9.387" height="2.012"/> </g> </svg></div>';

                    var next_btn_str = '<div class="next-btn"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="13.325px" viewBox="0 0 10 13.325" enable-background="new 0 0 10 13.325" xml:space="preserve"> <g id="Layer_2"> <polygon opacity="0.5" fill="#E6E7E8" points="7.035,5.695 5.074,4.292 5.074,8.257 7.035,7.678 "/> </g> <g id="Layer_1"> <rect x="0.677" y="8.234" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 15.532 12.0075)" fill="#E6E7E8" width="9.204" height="1.973"/> <rect x="0.674" y="3.118" transform="matrix(-0.7072 -0.707 0.707 -0.7072 6.1069 10.7384)" fill="#E6E7E8" width="9.206" height="1.974"/> </g> </svg></div>';

                    if(o.design_skin == 'skin-steel'){

                        prev_btn_str = '<div class="prev-btn"><svg class="svg1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="13.325px" viewBox="0 0 10 13.325" enable-background="new 0 0 10 13.325" xml:space="preserve"> <g id="Layer_2"> <polygon opacity="0.5" fill="#E6E7E8" points="3.208,7.674 5.208,9.104 5.208,5.062 3.208,5.652 "/> </g> <g id="Layer_1"> <rect x="0.306" y="3.074" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -1.4203 4.7299)" fill="#E6E7E8" width="9.386" height="2.012"/> <rect x="0.307" y="8.29" transform="matrix(0.7072 0.707 -0.707 0.7072 8.0362 -0.8139)" fill="#E6E7E8" width="9.387" height="2.012"/> </g> </svg> <svg class="svg2"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="13.325px" viewBox="0 0 10 13.325" enable-background="new 0 0 10 13.325" xml:space="preserve"> <g id="Layer_2"> <polygon opacity="0.5" fill="#E6E7E8" points="3.208,7.674 5.208,9.104 5.208,5.062 3.208,5.652 "/> </g> <g id="Layer_1"> <rect x="0.306" y="3.074" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -1.4203 4.7299)" fill="#E6E7E8" width="9.386" height="2.012"/> <rect x="0.307" y="8.29" transform="matrix(0.7072 0.707 -0.707 0.7072 8.0362 -0.8139)" fill="#E6E7E8" width="9.387" height="2.012"/> </g> </svg></div>';


                        next_btn_str = '<div class="next-btn"><svg class="svg1" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="13.325px" viewBox="0 0 10 13.325" enable-background="new 0 0 10 13.325" xml:space="preserve"> <g id="Layer_2"> <polygon opacity="0.5" fill="#E6E7E8" points="7.035,5.695 5.074,4.292 5.074,8.257 7.035,7.678 "/> </g> <g id="Layer_1"> <rect x="0.677" y="8.234" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 15.532 12.0075)" fill="#E6E7E8" width="9.204" height="1.973"/> <rect x="0.674" y="3.118" transform="matrix(-0.7072 -0.707 0.707 -0.7072 6.1069 10.7384)" fill="#E6E7E8" width="9.206" height="1.974"/> </g> </svg><svg class="svg2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="13.325px" viewBox="0 0 10 13.325" enable-background="new 0 0 10 13.325" xml:space="preserve"> <g id="Layer_2"> <polygon opacity="0.5" fill="#E6E7E8" points="7.035,5.695 5.074,4.292 5.074,8.257 7.035,7.678 "/> </g> <g id="Layer_1"> <rect x="0.677" y="8.234" transform="matrix(-0.7071 0.7071 -0.7071 -0.7071 15.532 12.0075)" fill="#E6E7E8" width="9.204" height="1.973"/> <rect x="0.674" y="3.118" transform="matrix(-0.7072 -0.707 0.707 -0.7072 6.1069 10.7384)" fill="#E6E7E8" width="9.206" height="1.974"/> </g> </svg></div>';

                    }




                    var auxs = prev_btn_str + next_btn_str;


                    //console.info(o.parentgallery);

                    if(o.parentgallery.hasClass('mode-showall')==false){
                        if(o.design_skin == 'skin-wave' && o.skinwave_mode=='small') {
                            _apControlsLeft.appendOnce(auxs,'.prev-btn');
                        }else{
                            if(o.design_skin == 'skin-wave'){

                                _conPlayPause.after(auxs);
                            }else if(o.design_skin == 'skin-steel'){

                                _apControlsLeft.prependOnce(prev_btn_str,'.prev-btn');

                                if(_apControlsLeft.children('.the-thumb-con').length>0){
                                    //console.info(_theThumbCon.prev());

                                    if(_apControlsLeft.children('.the-thumb-con').eq(0).length>0){
                                        if(_apControlsLeft.children('.the-thumb-con').eq(0).prev().hasClass('next-btn')==false){
                                            _apControlsLeft.children('.the-thumb-con').eq(0).before(next_btn_str);
                                        }
                                    }

                                }else{

                                    _apControlsLeft.appendOnce(next_btn_str,'.next-btn');
                                }
                            }else{

                                _audioplayerInner.appendOnce(auxs,'.prev-btn');
                            }
                        }
                    }


                }





                if(cthis.children('.afterplayer').length>0){
                    //console.log(cthis.children('.afterplayer'));

                    cthis.append(cthis.children('.afterplayer'));
                }

                //console.log(o.settings_extrahtml);

                if(o.settings_extrahtml!=''){

                    //console.log(o.settings_extrahtml, index_extrahtml_toloads);

                    if(String(o.settings_extrahtml).indexOf('{{get_likes}}')>-1 && is_ie8()==false){
                        index_extrahtml_toloads++;
                        ajax_get_likes();
                    }
                    if(String(o.settings_extrahtml).indexOf('{{get_plays}}')>-1 && is_ie8()==false){
                        index_extrahtml_toloads++;
                        ajax_get_views();
                    }else{
                        if(increment_views===1){
                            ajax_submit_views();
                            increment_views=2;
                        }
                    }

                    if(String(o.settings_extrahtml).indexOf('{{get_rates}}')>-1){
                        index_extrahtml_toloads++;
                        ajax_get_rates();
                    }

                    if(index_extrahtml_toloads==0){
                        //console.info('lel',cthis.find('.extra-html'))

                        cthis.find('.extra-html').addClass('active');
                    }
                    setTimeout(function(){

                        //console.info('lel',cthis.find('.extra-html'))
                        cthis.find('.extra-html').addClass('active');
                    },2000);

                }


            }
            function ajax_get_likes(argp){
                //only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_get_likes',
                    postdata: mainarg,
                    playerid: the_player_id
                };




                if(o.settings_php_handler){


                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function(response) {
                            if(typeof window.console != "undefined" ){ console.log('Got this from the server: ' + response); }

                            var auxls = false;
                            if(response.indexOf('likesubmitted')>-1){
                                response = response.replace('likesubmitted', '');
                                auxls = true;
                            }


                            if(response==''){
                                response=0;
                            }


                            var auxhtml = cthis.find('.extra-html').eq(0).html();
                            auxhtml = auxhtml.replace('{{get_likes}}', response);
                            cthis.find('.extra-html').eq(0).html(auxhtml);
                            index_extrahtml_toloads--;
                            if(auxls){
                                cthis.find('.extra-html').find('.btn-like').addClass('active');
                            }



                            //console.log(index_extrahtml_toloads);
                            if(index_extrahtml_toloads==0){
                                cthis.find('.extra-html').addClass('active');
                            }

                        },
                        error:function(arg){
                            if(typeof window.console != "undefined" ){ console.log('Got this from the server: ' + arg, arg); };
                            index_extrahtml_toloads--;
                            if(index_extrahtml_toloads==0){
                                cthis.find('.extra-html').addClass('active');
                            }
                        }
                    });
                }

            }
            function ajax_get_rates(argp){
                //only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_get_rate',
                    postdata: mainarg,
                    playerid: the_player_id
                };


                if(o.settings_php_handler) {

                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }

                            var auxls = false;
                            if (response.indexOf('likesubmitted') > -1) {
                                response = response.replace('likesubmitted', '');
                                auxls = true;
                            }


                            if (response == '') {
                                response = '0|0';
                            }


                            var auxresponse = response.split('|');


                            starrating_nrrates = auxresponse[1];
                            cthis.find('.extra-html .counter-rates .the-number').eq(0).html(starrating_nrrates);
                            index_extrahtml_toloads--;


                            cthis.find('.star-rating-set-clip').width(auxresponse[0] * (parseInt(cthis.find('.star-rating-bg').width(), 10) / 5));


                            //===ratesubmitted
                            if (typeof(auxresponse[2]) != 'undefined') {
                                starrating_alreadyrated = auxresponse[2];


                                if (o.parentgallery && $(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_player_rateSubmitted != undefined) {
                                    $(o.parentgallery).get(0).api_player_rateSubmitted();
                                }
                            }


                            if (index_extrahtml_toloads <= 0) {
                                cthis.find('.extra-html').addClass('active');
                            }

                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;
                            index_extrahtml_toloads--;
                            if (index_extrahtml_toloads <= 0) {
                                cthis.find('.extra-html').addClass('active');
                            }
                        }
                    });
                }
            }
            function ajax_get_views(argp){
                //only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_get_views',
                    postdata: mainarg,
                    playerid: the_player_id
                };




                if(o.settings_php_handler) {

                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }

//                        console.info(response);


                            if (response.indexOf('viewsubmitted') > -1) {
                                response = response.replace('viewsubmitted', '');
                                ajax_view_submitted = 'on';
                                increment_views = 0;
                            }

                            if (response == '') {
                                response = 0;
                            }


                            if (String(response).indexOf('{{theip') > -1) {

                                var auxa = /{{theip-(.*?)}}/g.exec(response);
                                if (auxa[1]) {
                                    currIp = auxa[1];
                                }

                                response = response.replace(/{{theip-(.*?)}}/g, '');


                            }


                            //console.info('increment_views', increment_views);
                            if (increment_views == 1) {
                                ajax_submit_views();
                                //console.info('response iz '+response);
                                response = Number(response) + increment_views;
                                ;
                                //console.info(response);
                                increment_views = 2;
                            }

                            var auxhtml = cthis.find('.extra-html').eq(0).html();
                            auxhtml = auxhtml.replace('{{get_plays}}', response);
                            cthis.find('.extra-html').eq(0).html(auxhtml);
                            index_extrahtml_toloads--;


                            if (index_extrahtml_toloads == 0) {
                                cthis.find('.extra-html').addClass('active');
                            }

                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;
                            index_extrahtml_toloads--;
                            if (index_extrahtml_toloads == 0) {
                                cthis.find('.extra-html').addClass('active');
                            }
                        }
                    });
                }
            }


            function ajax_submit_rating(argp){
                //only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_submit_rate',
                    postdata: mainarg,
                    playerid: the_player_id
                };

                if(starrating_alreadyrated>-1){
                    return;
                }



                if(o.settings_php_handler) {
                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }
                            ;


                            var aux = cthis.find('.star-rating-set-clip').outerWidth() / cthis.find('.star-rating-bg').outerWidth();
                            var nrrates = parseInt(cthis.find('.counter-rates .the-number').html(), 10);

                            nrrates++;

                            var aux2 = ( (nrrates - 1) * (aux * 5) + starrating_index) / (nrrates)

//                        console.info(aux, aux2, nrrates);
                            cthis.find('.star-rating-set-clip').width(aux2 * (parseInt(cthis.find('.star-rating-bg').width(), 10) / 5));
                            cthis.find('.counter-rates .the-number').html(nrrates);

                            if (o.parentgallery  && $(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_player_rateSubmitted != undefined) {
                                $(o.parentgallery).get(0).api_player_rateSubmitted();
                            }

                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;


                            var aux = cthis.find('.star-rating-set-clip').outerWidth() / cthis.find('.star-rating-bg').outerWidth();
                            var nrrates = parseInt(cthis.find('.counter-rates .the-number').html(), 10);

                            nrrates++;

                            var aux2 = ( (nrrates - 1) * (aux * 5) + starrating_index) / (nrrates)

//                        console.info(aux, aux2, nrrates);
                            cthis.find('.star-rating-set-clip').width(aux2 * (parseInt(cthis.find('.star-rating-bg').width(), 10) / 5));
                            cthis.find('.counter-rates .the-number').html(nrrates);

                            if (o.parentgallery && $(o.parentgallery).get(0) != undefined && $(o.parentgallery).get(0).api_player_rateSubmitted != undefined) {
                                $(o.parentgallery).get(0).api_player_rateSubmitted();
                            }

                        }
                    });
                }
            };


            function ajax_submit_download(argp){
                //only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_submit_download',
                    postdata: mainarg,
                    playerid: the_player_id
                };

                if(starrating_alreadyrated>-1){
                    return;
                }

                if(o.settings_php_handler) {

                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }
                            ;


                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;


                        }
                    });
                }
            };


            function ajax_submit_views(argp){

                //console.info('ajax_submit_views()',argp);

                var data = {
                    action: 'dzsap_submit_views',
                    postdata: 1,
                    playerid: the_player_id,
                    currip : currIp
                };


//                console.info(ajax_view_submitted);


                if(o.settings_php_handler) {
                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }

                            var auxnr = cthis.find('.counter-hits .the-number').html();
                            auxnr = parseInt(auxnr, 10);
                            if (increment_views != 2) {
                                auxnr++;
                            }

                            cthis.find('.counter-hits .the-number').html(auxnr);

                            ajax_view_submitted = 'on';
                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;


                            var auxlikes = cthis.find('.counter-hits .the-number').html();
                            auxlikes = parseInt(auxlikes, 10);
                            auxlikes++;
                            cthis.find('.counter-hits .the-number').html(auxlikes);

                            ajax_view_submitted = 'on';
                        }
                    });
                }
            }

            function ajax_submit_like(argp){
                //only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_submit_like',
                    postdata: mainarg,
                    playerid: the_player_id
                };


                if(o.settings_php_handler || cthis.hasClass('is-preview')) {

                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }

                            cthis.find('.btn-like').addClass('active');
                            var auxlikes = cthis.find('.counter-likes .the-number').html();
                            auxlikes = parseInt(auxlikes, 10);
                            auxlikes++;
                            cthis.find('.counter-likes .the-number').html(auxlikes);
                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;


                            cthis.find('.btn-like').addClass('active');
                            var auxlikes = cthis.find('.counter-likes .the-number').html();
                            auxlikes = parseInt(auxlikes, 10);
                            auxlikes++;
                            cthis.find('.counter-likes .the-number').html(auxlikes);
                        }
                    });
                }
            }
            function ajax_retract_like(argp){
                //only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_retract_like',
                    postdata: mainarg,
                    playerid: the_player_id
                };



                if(o.settings_php_handler) {
                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }

                            cthis.find('.btn-like').removeClass('active');
                            var auxlikes = cthis.find('.counter-likes .the-number').html();
                            auxlikes = parseInt(auxlikes, 10);
                            auxlikes--;
                            cthis.find('.counter-likes .the-number').html(auxlikes);
                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;

                            cthis.find('.btn-like').removeClass('active');
                            var auxlikes = cthis.find('.counter-likes .the-number').html();
                            auxlikes = parseInt(auxlikes, 10);
                            auxlikes--;
                            cthis.find('.counter-likes .the-number').html(auxlikes);
                        }
                    });
                }
            }
            function skinwave_comment_publish(argp){
                // -- only handles ajax call + result
                var mainarg = argp;
                var data = {
                    action: 'dzsap_front_submitcomment',
                    postdata: mainarg,
                    playerid: the_player_id
                    ,comm_position: sposarg
                    ,skinwave_comments_process_in_php: o.skinwave_comments_process_in_php
                    ,skinwave_comments_avatar: o.skinwave_comments_avatar
                    ,skinwave_comments_account: o.skinwave_comments_account
                };

                if(cthis.find('*[name=comment-email]').length>0){

                    data.email = cthis.find('*[name=comment-email]').eq(0).val();
                }



                if(o.settings_php_handler) {
                    $.ajax({
                        type: "POST",
                        url: o.settings_php_handler,
                        data: data,
                        success: function (response) {
                            if (response.charAt(response.length - 1) == '0') {
                                response = response.slice(0, response.length - 1);
                            }
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + response);
                            }

                            //console.info(data.postdata);


                            var aux = '';
                            if (o.skinwave_comments_process_in_php != 'on') {

                                // -- process the comment now, in javascript
                                aux = (data.postdata);

                            } else {

                                // -- process php
                                aux = '';


                                aux += '<span class="dzstooltip-con" style="left:' + sposarg + '"><span class="dzstooltip arrow-from-start transition-slidein arrow-bottom skin-black" style="width: 250px;"><span class="the-comment-author">@' + o.skinwave_comments_account + '</span> says:<br>';
                                aux += htmlEncode(data.postdata);


                                aux += '</span><div class="the-avatar" style="background-image: url(' + o.skinwave_comments_avatar + ')"></div></span>';


                            }
                            _commentsHolder.append(aux);


                            if(action_audio_comment){
                                action_audio_comment(cthis, aux);
                            }


                            //jQuery('#save-ajax-loading').css('visibility', 'hidden');
                        },
                        error: function (arg) {
                            if (typeof window.console != "undefined") {
                                console.log('Got this from the server: ' + arg, arg);
                            }
                            ;
                            _commentsHolder.append(data.postdata);
                        }
                    });
                }
            }
            function setup_media(pargs){
                // -- order = init, setup_media, init_loaded


//                return;


                var margs = {

                    'do_not_autoplay' : false
                };


                if(pargs){
                    margs = $.extend(margs,pargs);
                }
                //console.info('--- setup_media()', o.cue,ajax_view_submitted, margs, loaded, cthis);

                if(o.cue=='off'){
                    //console.info(ajax_view_submitted);
                    if(ajax_view_submitted=='auto'){


                        // -- why is view submitted ?
                        increment_views = 1;

                        if(String(o.settings_extrahtml).indexOf('{{get_plays}}')>-1){
                            ajax_view_submitted = 'on'
                        }else{
                            ajax_view_submitted = 'off';
                        };
                    }
                }






                //console.info(type, o.type, loaded);

                if(loaded==true){
                    return;
                }




                if(type=='youtube'){
                    if(is_ie()){
                        _theMedia.css({
                            'left' : '-478em'
                        })
                    }
                    return;
                }


                var aux = '';


                aux+= '<audio';
                aux+=' preload="metadata"';

                if(is_ios() || is_android()){

                }else{
                }

                aux+='>';

                if(cthis.attr('data-source')!=undefined){
                    data_source = cthis.attr('data-source');
                    aux+='<source src="'+data_source+'" type="audio/mpeg">';
                    if(cthis.attr('data-sourceogg')!=undefined){
                        aux+='<source src="'+cthis.attr('data-sourceogg')+'" type="audio/ogg">';
                    }
                }
                aux+= '</audio>';

                //alert(is_ie8());
                if(is_ie8() && dzsap_list && dzsap_list.length>0){

                    str_ie8 = '&isie8=on';
                }
                if(is_flashplayer){
                    if(o.settings_backup_type=='light'){
                        aux='<object type="application/x-shockwave-flash" data="'+ o.swf_location+'" width="100" height="50" id="flashcontent_'+cthisId+'" allowscriptaccess="always" style="visibility: visible; "><param name="movie" value="ap.swf"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="flashvars" value="media='+cthis.attr("data-source")+"&fvid="+cthisId+str_ie8+'"><embed src="'+ o.swf_location+'" width="100" height="100" allowScriptAccess="always"></object>';
                        cthis.addClass('lightflashbackup');
                    }else{
//                        console.info(cthis.attr('data-source'));
                        var str_vol = '';
                        var str_skip_buttons = '';
                        var str_design_menu_show_player_state_button = '';



                        if(o.parentgallery && typeof(o.parentgallery)!='undefined' && o.disable_player_navigation!='on'){
                            str_skip_buttons='&design_skip_buttons=on';
                        }
                        if(o.parentgallery && typeof(o.parentgallery)!='undefined' && o.design_menu_show_player_state_button!='on'){
                            str_design_menu_show_player_state_button='&design_menu_show_player_state_button=on';
                        }

                        if(o.disable_volume=='on'){
                            str_vol+='&settings_enablevolume=off';
                        }





                        aux='<object class="the-full-flash-backup" type="application/x-shockwave-flash" data="'+ o.swffull_location+'" width="100%" height="100%" style="height:50px" id="flashcontent_'+cthisId+'" allowscriptaccess="always" style="visibility: visible; "><param name="movie" value="'+ o.swffull_location+'"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="transparent"><param name="flashvars" value="media='+cthis.attr("data-source")+"&fvid="+cthisId+str_ie8+str_vol+'&autoplay='+o.autoplay+'&skinwave_mode'+ o.skinwave_mode+str_skip_buttons+str_design_menu_show_player_state_button;
                        cthis.addClass('fullflashbackup');
                        if(typeof(cthis.attr("data-scrubbg"))!='undefined'){
                            aux+='&scrubbg='+cthis.attr("data-scrubbg");
                        }
                        if(typeof(cthis.attr("data-scrubprog"))!='undefined'){
                            aux+='&scrubprog='+cthis.attr("data-scrubprog");
                        }
                        if(typeof(cthis.attr("data-thumb"))!='undefined' && cthis.attr("data-thumb")!=''){
                            aux+='&thumb='+cthis.attr("data-thumb");
                        }
                        aux+='&settings_enablespectrum='+ o.skinwave_enableSpectrum;
                        aux+='&skinwave_enablereflect='+ o.skinwave_enableReflect;

                        aux+='&skin='+ o.design_skin;
                        aux+='&settings_multiplier='+ o.skinwave_spectrummultiplier;



                        aux+='">You need Flash Player.</object>';

                        _audioplayerInner.find('.the-thumb-con,.ap-controls,.the-media').remove();
                        _audioplayerInner.prepend(aux);

                        if(o.design_skin=='skin-wave'){
                            _audioplayerInner.find('.the-full-flash-backup').css("height", 200);
                        }
                        if(typeof(cthis.attr("data-thumb"))!='undefined' && cthis.attr("data-thumb")!=''){
                            _audioplayerInner.find('.the-full-flash-backup').css("height", 200);
                        }

                        aux='';

                        //return;
                    }
                }
                //<embed src="'+ o.swf_location+'" width="100" height="100" allowScriptAccess="always">
                //console.log(aux, _theMedia);

                str_audio_element = aux;
                _theMedia.append(aux);

                //return;
                //_theMedia.children('audio').get(0).autoplay = false;
                _cmedia = (_theMedia.children('audio').get(0));

                if(_cmedia && _cmedia.addEventListener){
                    _cmedia.addEventListener('error', function(e) {
                        var noSourcesLoaded = (this.networkState===HTMLMediaElement.NETWORK_NO_SOURCE);
                        if(noSourcesLoaded) console.log("could not load audio source");

                        cthis.addClass('errored-out');
                        cthis.append('<div class="feedback-text">error - file does not exist.. </div>');
                    }, true);
                }

                if(is_flashplayer && o.settings_backup_type=='light'){
                    setTimeout(function(){
                        _cmedia = (_theMedia.find('object').eq(0).get(0));
                    }, 500)
                }


                //console.info(cthis,type);
                if(type!='fake'){

                    //return false;
                }

                //alert(_cmedia);




                //console.info("TRY TO CHECK READY", cthis);

                // console.info("CEVA");
                if(is_ios() || is_ie8() || is_flashplayer==true){
                    if(o.settings_backup_type=='full'){
                        init_loaded(margs);
                    }else{
                        setTimeout(function(){
                            init_loaded(margs);
                        },1000);
                    }

                }else{

                    // -- check_ready() will fire init_loaded()
                    inter_checkReady = setInterval(function(){
                        check_ready(margs);
                    },50);
                    //= setInterval(check_ready, 50);
                }

                if(o.failsafe_repair_media_element){
                    setTimeout(function(){

                        if(_theMedia.children().eq(0).get(0) && _theMedia.children().eq(0).get(0).nodeName == "AUDIO"){
                            //console.info('ceva');
                            return false;
                        }
                        _theMedia.html('');
                        _theMedia.append(str_audio_element);

                        var aux_wasplaying = playing;

                        pause_media();
                        //return;
                        //_theMedia.children('audio').get(0).autoplay = false;
                        _cmedia = (_theMedia.children('audio').get(0));
                        if(is_flashplayer && o.settings_backup_type=='light'){
                            setTimeout(function(){

                                _cmedia = (_theMedia.find('object').eq(0).get(0));

                            }, 10)
                        }


                        if(aux_wasplaying){
                            aux_wasplaying=false;
                            setTimeout(function(){

                                play_media();
                            },20);
                        }
                    }, o.failsafe_repair_media_element);

                    o.failsafe_repair_media_element='';

                }


                cthis.addClass('media-setuped');

            }

            function destroy_media(){
                //console.info("destroy_media()", cthis)
                pause_media();



                if(_cmedia){

                    //console.log(_cmedia, _cmedia.src);
                    if(_cmedia.children){

                        //_cmedia.children().remove();
                    }

                    //console.log(_cmedia.innerHTML);
                    if(o.type=='audio'){
                        _cmedia.innerHTML='';
                        _cmedia.load();
                    }
                    //console.log(_cmedia.innerHTML);

                    //_cmedia.remove();
                }
                if(_theMedia){

                    _theMedia.children().remove();
                    loaded = false;
                }
            }
            function setup_listeners(){


                //console.info('setup_listeners()');


                _scrubbar.bind('mousemove', mouse_scrubbar);
                _scrubbar.bind('mouseleave', mouse_scrubbar);
                _scrubbar.bind('click', mouse_scrubbar);


                _controlsVolume.find('.volumeicon').bind('click', click_mute);

                if(o.design_skin=='skin-redlights'){
                    _controlsVolume.bind('mousemove',mouse_volumebar);
                    _controlsVolume.bind('mousedown',mouse_volumebar);


                    $(document).undelegate(window, 'mouseup', mouse_volumebar);
                    $(document).delegate(window, 'mouseup', mouse_volumebar);
                }else{

                    _controlsVolume.find('.volume_active').bind('click', mouse_volumebar);
                    _controlsVolume.find('.volume_static').bind('click', mouse_volumebar);
                }

                cthis.find('.playbtn').unbind('click');
                _conPlayPause.bind('click', click_playpause);

                if(o.design_skin=='skin-customcontrols'){
                    cthis.find('.custom-play-btn,.custom-pause-btn').bind('click', click_playpause);
                }

                var scrubbar_moving = false;
                var scrubbar_moving_x =0 ;

                var aux3 = 0;

                _scrubbar.bind('touchstart', function(e){
                    scrubbar_moving = true;
                })
                $(document).bind('touchmove', function(e){
                    if(scrubbar_moving){
                        scrubbar_moving_x = e.originalEvent.touches[0].pageX;


                        aux3 = scrubbar_moving_x - _scrubbar.offset().left;

                        if(aux3<0){ aux3 = 0; }
                        if(aux3>_scrubbar.width()){ aux3 = _scrubbar.width(); }

                        seek_to_perc(aux3/_scrubbar.width());


                        //console.info(aux3);


                    }
                })

                $(document).bind('touchend', function(e){
                    scrubbar_moving = false;
                })

                $(document).delegate('.btn-like','click', click_like);


                $(document).delegate('.star-rating-con', 'mousemove', mouse_starrating);
                $(document).delegate('.star-rating-con', 'mouseleave', mouse_starrating);
                $(document).delegate('.star-rating-con', 'click', mouse_starrating);


//                console.log('setup_listeners()');

                setTimeout(handleResize,1000);
                setTimeout(handleResize,2000);

                if(o.settings_trigger_resize > 0){
                    inter_trigger_resize = setInterval(handleResize, o.settings_trigger_resize);
                }






                return false;

//                console.info('ceva');
            }

            function click_like(){
                console.info('click_like()');
                var _t = $(this);
                if(cthis.has(_t).length==0){
                    return;
                }

                if(_t.hasClass('active')){
                    ajax_retract_like();
                }else{
                    ajax_submit_like();
                }
            }

            function init_loaded(pargs){

                if(cthis.attr('id')=='apminimal'){
                    //console.info('init_loaded()', pargs, cthis, cthis.hasClass('loaded'));
                }



                var margs = {

                    'do_not_autoplay' : false
                };


                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                if(cthis.hasClass('dzsap-loaded')){
                    return;
                }


                if(is_flashplayer==false){
                    totalDuration = _cmedia.duration;
                }else{
                    if(o.settings_backup_type=='light'){

                        if(typeof(_cmedia)!="undefined" && _cmedia.fn_getSoundDuration){
                            eval("totalDuration = parseFloat(_cmedia.fn_getsoundduration"+cthisId+"())");
                        }
                    }
                }
                if(typeof(_cmedia)!="undefined"){
                    if(_cmedia.nodeName=='AUDIO'){
                        //console.info(_cmedia);
                        _cmedia.addEventListener('ended', handle_end);
                    }else{

                    }
                }


                //console.info("CLEAR THE TIMEOUT HERE")
                clearInterval(inter_checkReady);
                clearTimeout(inter_checkReady);
                setup_listeners();
                //console.info('setuped_listeners', cthis.hasClass('dzsap-loaded'), cthis)

                if(is_ie8()){
                    cthis.addClass('lte-ie8')
                }

                setTimeout(function(){

                    //console.log(_currTime, )
                    if(_currTime && _currTime.outerWidth()>0){
                        currTime_outerWidth = _currTime.outerWidth();
                    }
                },1000);





                //===ie7 and ie8 does not have the indexOf property so let us add it
                if(is_ie8()){
                    if (!Array.prototype.indexOf)
                    {
                        Array.prototype.indexOf = function(elt)
                        {
                            var len = this.length >>> 0;

                            var from = Number(arguments[1]) || 0;
                            from = (from < 0)
                                ? Math.ceil(from)
                                : Math.floor(from);
                            if (from < 0)
                                from += len;

                            for (; from < len; from++)
                            {
                                if (from in this &&
                                    this[from] === elt)
                                    return from;
                            }
                            return -1;
                        };
                    }
                }

                //console.info('type - ',type);
                if(type!='fake'){
                    if(o.settings_exclude_from_list!='on' && dzsap_list && dzsap_list.indexOf(cthis)==-1){
                        if(o.fakeplayer==null){

                            dzsap_list.push(cthis);
                        }
                    }



                    if(o.type_audio_stop_buffer_on_unfocus=='on'){


                        cthis.data('type_audio_stop_buffer_on_unfocus', 'on');

                        cthis.get(0).api_destroy_for_rebuffer = function(){

                            if(o.type=='audio'){
                                playfrom = _cmedia.currentTime;
                            }
                            //console.log(playfrom);
                            destroy_media();

                            destroyed_for_rebuffer = true;
                        }

                    }
                }

                //console.info("CHECK TIME",cthis);


                if(o.design_skin=='skin-wave'){
                    if(o.skinwave_enableSpectrum=='on'){

                        //console.info(typeof AudioContext);

                        console.info("USED AUDIO CONTEXT");



                        // trying to use only one audio ctx per page.
                        if(window.dzsap_audio_ctx==null){
                            if (typeof AudioContext !== 'undefined') {
                                audioCtx = new AudioContext();
                                window.dzsap_audio_ctx = audioCtx;
                            } else if (typeof webkitAudioContext !== 'undefined') {
                                audioCtx = new webkitAudioContext();
                                window.dzsap_audio_ctx = audioCtx;
                            } else {
                                audioCtx = null;
                            }

                        }else{

                            audioCtx = window.dzsap_audio_ctx;
                        }

                        //console.info(audioCtx);

                        if(audioCtx){



                            function loadSound(url) {
                                var request = new XMLHttpRequest();
                                request.open('GET', url, true);
                                request.responseType = 'arraybuffer';
                                // . . . step 3 code above this line, step 4 code below
                                request.onload = function() {

                                    //if(window.console){ console.info('sound load'); };
                                    audioCtx.decodeAudioData(request.response, function(buffer) {
                                        //alert("sound decode"); //test
                                        //console.log(buffer);

                                        webaudiosource = audioCtx.createBufferSource()
                                        webaudiosource.buffer = buffer;
                                        audioBuffer = buffer;
                                        webaudiosource.connect(analyser)
                                        analyser.connect(audioCtx.destination);
                                        // Start playing the buffer.

                                        inter_audiobuffer_workaround_id = setInterval(function(){
                                            if(playing){
                                                time_curr+=0.1;

                                            }
                                        },100);


//                                            console.info(audioBuffer);
                                        webaudiosource.connect(audioCtx.destination);
                                        //webaudiosource.start(0);
                                    }, onError);

                                    _conControls.css({
                                        'opacity':1
                                    });

                                }
                                request.send();
                            }



                            //if(!)
                            if(typeof audioCtx.createJavaScriptNode!='undefined'){
                                javascriptNode = audioCtx.createJavaScriptNode(2048, 1, 1);
                            }
                            if(typeof audioCtx.createScriptProcessor!='undefined'){
                                javascriptNode = audioCtx.createScriptProcessor(4096, 1, 1);
                                //console.log(javascriptNode);
                            }


                            function generateFakeArray(){

                                console.info('generateFakeArray()');
                                var maxlen = 256;

                                var arr = [];

                                for (var it1 = 0 ;it1<maxlen;it1++){
                                    arr[it1] = (maxlen-it1)/2 + Math.random()*100;

                                }

                                return arr;
                            }

                            if(is_android()){


                                analyser = audioCtx.createAnalyser();
                                analyser.smoothingTimeConstant = 0.3;
                                analyser.fftSize = 512;


                                //oscillator = audioCtx.createOscillator();
                                //oscillator.start(0);

// Set up a script node that sets output to white noise
                                var url = data_source;


                                javascriptNode.onaudioprocess = function(event) {
                                    //var output = event.outputBuffer.getChannelData(0);
                                    //for (i = 0; i < output.length; i++) {
                                    //    output[i] = Math.random() / 10;
                                    //}



                                    var array =  new Uint8Array(analyser.frequencyBinCount);
                                    //console.info(analyser, analyser.getByteFrequencyData(array), new Uint8Array(analyser.frequencyBinCount));
                                    //console.log('Processing buffer', array);
                                    analyser.getByteFrequencyData(array);

                                    lastarray = array;

                                    if(playing){
                                        lastarray = generateFakeArray();
                                    }

                                    //console.info(playing, lastarray);


                                };

// Connect oscillator to script node and script node to destination
// (should output white noise)
//                                oscillator.connect(javascriptNode);


                                webaudiosource = audioCtx.createMediaElementSource(_cmedia);
                                webaudiosource.connect(analyser);
                                //console.log(webaudiosource);
                                analyser.connect(audioCtx.destination);


                                javascriptNode.connect(audioCtx.destination);



                                //console.info('ceva');
                            }else{
                                if(javascriptNode){


                                    // setup a analyzer
                                    analyser = audioCtx.createAnalyser();
                                    analyser.smoothingTimeConstant = 0.3;
                                    analyser.fftSize = 512;

                                    //console.log(analyser);

                                    // create a buffer source node


                                    //Steps 3 and 4
                                    //console.log(data_source);
                                    //console.log('hmm');
                                    var url = data_source;
                                    //if( is_ios()){
                                    //    //console.log('is_safari');
                                    //    loadSound(url);
                                    //    audioBuffer = 'placeholder';
                                    //    _conControls.css({
                                    //        'opacity':0.5
                                    //    });
                                    //}




                                    //console.log('cevaal');
                                    javascriptNode.onaudioprocess = function() {

                                        if(stopaudioprocessfordebug){
                                            return;
                                        }

                                        // - not implemented in safari yet.
                                        // get the average for the first channel
                                        var array =  new Uint8Array(analyser.frequencyBinCount);
                                        //console.info(analyser, analyser.getByteFrequencyData(array), new Uint8Array(analyser.frequencyBinCount));
                                        //console.info(array);
                                        analyser.getByteFrequencyData(array);
                                        lastarray = array;

                                        //console.info(array);
                                        // clear the current state

                                        // set the fill style


                                        if(playing && (is_ios())){
                                            lastarray = generateFakeArray();
                                        }


                                    }

                                    //console.log(_cmedia, _cmedia.get(0))
                                    //console.info(is_chrome(), is_firefox());
                                    if(type=='audio' && ( is_chrome() || is_firefox() || is_safari() || is_ios()) ){
                                        webaudiosource = audioCtx.createMediaElementSource(_cmedia);
                                        webaudiosource.connect(analyser)
                                        analyser.connect(audioCtx.destination);


                                        //var node = audioCtx.createGain(4096, 2, 2);
                                        //node.connect(javascriptNode);

                                        javascriptNode.connect(audioCtx.destination);

                                        //console.log(_cmedia, analyser, audioCtx.destination);
                                    }
                                    //playSound();

                                    var stopaudioprocessfordebug = false;
                                    setTimeout(function(){
                                        //stopaudioprocessfordebug = true;
                                    },3000);


                                }
                            }


                        }
                    }
                }

                //console.info(ajax_view_submitted);

                if(ajax_view_submitted=='auto'){
                    setTimeout(function(){
                        if(ajax_view_submitted=='auto'){
                            ajax_view_submitted = 'off';
                        }
                    }, 1000);
                }

                //console.info('---- ADDED LOADED BUT FROM WHERE', cthis);
                loaded=true;
                cthis.addClass('dzsap-loaded');

//                console.info(playfrom);

                if(isNaN(Number(o.default_volume))==false){
                    o.default_volume = Number(o.default_volume);
                    defaultVolume = o.default_volume;
                }else{
                    if(o.default_volume=='last'){


                        if (localStorage != null && the_player_id) {

                            //console.info(the_player_id);


                            if(localStorage.getItem('dzsap_last_volume_'+the_player_id)){

                                defaultVolume = localStorage.getItem('dzsap_last_volume_'+the_player_id);
                            }else{

                                defaultVolume = 1;
                            }
                        }else{

                            defaultVolume = 1;
                        }
                    }
                }


                set_volume(defaultVolume);

                if(isInt(playfrom)){
                    seek_to(playfrom);
                }
                if(playfrom=='last'){
                    if(typeof Storage!='undefined'){
                        setTimeout(function(){
                            playfrom_ready = true;
                        })


                        if(typeof localStorage['dzsap_'+the_player_id+'_lastpos']!='undefined'){
                            seek_to(localStorage['dzsap_'+the_player_id+'_lastpos']);
                        }
                    }
                }

//                console.info(cthis, o.autoplay);

                //console.info(margs);
                if(margs.do_not_autoplay!=true){

                    if(is_ie8()==false && o.autoplay=='on'){
                        play_media();
                    };
                }



                check_time();

                setTimeout(function(){
                    //console.info(cthis.find('.wave-download'));
                    cthis.find('.wave-download').bind('click',handle_mouse);
                },500);


            }


            function isInt(n) {
                return typeof n == 'number' && Math.round(n) % 1 == 0;
            }
            function isValid(n) {
                return typeof n != 'undefined' && n!='';
            }

            function handle_mouse(e){
                var _t = $(this);
                if(e.type=='click'){
                    if(_t.hasClass('wave-download')){
                        ajax_submit_download();
                    }
                }
            }

            function mouse_starrating(e){
                var _t = $(this);


                if(cthis.has(_t).length==0){
                    return;
                }

                if(e.type=='mouseout' || e.type=='mouseleave'){
                    cthis.find('.star-rating-prog-clip').css({
                        'width': 0
                    })


                    cthis.find('.star-rating-set-clip').css({
                        'opacity': 1
                    })


                }
                if(e.type=='mousemove'){
                    //console.log(_t);
                    var mx = e.pageX - _t.offset().left;
                    var my = e.pageX - _t.offset().left;

                    //console.info(Math.round(mx/ (_t.outerWidth()/5)) );


                    if(starrating_alreadyrated>-1){
                        starrating_index = starrating_alreadyrated;
                    }else{
                        starrating_index = mx/ (_t.outerWidth()/5);
                    }



                    if(starrating_index> 4){
                        starrating_index = 5;
                    }else{
                        starrating_index = Math.round(starrating_index);
                    }

//                    console.info(starrating_index, cthis.find('.star-rating-prog-clip'));
                    cthis.find('.star-rating-prog-clip').css({
                        'width': _t.outerWidth()/5 * starrating_index
                    })



                    cthis.find('.star-rating-set-clip').css({
                        'opacity': 0
                    })
                }
                if(e.type=='click'){


                    if(starrating_alreadyrated>-1){
                        return;
                    }

                    ajax_submit_rating(starrating_index);
                }


            }



            function onError(){

            }

            function drawSpectrum(array) {
                //console.info(array);
                //console.info()
                //console.log($('.scrub-bg-canvas').eq(0).get(0).width, canw);

                //console.log(_scrubBgCanvas.get(0).width, _scrubBgCanvas.width())



                _scrubBgCanvas.get(0).width = _scrubBgCanvas.width();
                _scrubBgCanvas.get(0).height = _scrubBgCanvas.height();

                if(_scrubProgCanvas){
                    _scrubProgCanvas.get(0).width = _scrubBgCanvas.width();
                    _scrubProgCanvas.get(0).height = _scrubBgCanvas.height();

                }
                if(o.skinwave_enableReflect=='on'){

                    _scrubBgReflectCanvas.get(0).width = _scrubBgCanvas.width();
                    _scrubBgReflectCanvas.get(0).height = _scrubBgCanvas.height();

                    if(_scrubProgCanvasReflect){
                        _scrubProgCanvasReflect.get(0).width = _scrubBgCanvas.width();
                        _scrubProgCanvasReflect.get(0).height = _scrubBgCanvas.height();
                    }
                };


                var gradient = _scrubBgCanvasCtx.createLinearGradient(0,0,canw,canh);
                /*
                 gradient.addColorStop(1,'#000000');
                 gradient.addColorStop(0.75,'#ff0000');
                 gradient.addColorStop(0.25,'#ffff00');
                 gradient.addColorStop(0,'#ffffff');
                 */
                _scrubBgCanvasCtx.clearRect(0, 0, canw, canh);
                _scrubBgCanvasCtx.fillStyle='#'+ o.skinwave_spectrum_wavesbg;

                if(_scrubProgCanvasCtx){
                    _scrubProgCanvasCtx.clearRect(0, 0, canw, canh);
                    _scrubProgCanvasCtx.fillStyle='#'+ o.skinwave_spectrum_wavesprog;
                }



                for ( var i = 0; i < (array.length); i++ ){
                    var value = array[i];
                    //console.log(i, value, canh - (canh-value/256));
                    _scrubBgCanvasCtx.fillRect(i/256 * canw,canh-((value/256)*canh),canw/array.length,canh);
                    // console.log([i,value])

                    if(_scrubProgCanvasCtx){
                        _scrubProgCanvasCtx.fillRect(i/256 * canw,canh-((value/256)*canh),canw/array.length,canh);
                    }
                }
                if(o.skinwave_enableReflect=='on'){

                    //console.info(_scrubBgReflectCtx);
                    _scrubBgReflectCtx.clearRect(0, 0, canw, canh);
                    _scrubBgReflectCtx.drawImage(_scrubBgCanvas.get(0), 0, 0);

                    if(_scrubProgCanvasReflect){
                        _scrubProgCanvasReflectCtx.clearRect(0, 0, canw, canh);
                        _scrubProgCanvasReflectCtx.drawImage(_scrubProgCanvas.get(0), 0, 0);
                    }
                }

            };




            // log if an error occurs
            function onError(e) {
                console.log(e);
            }

            function click_prev_btn(){

                if(o.parentgallery && typeof(o.parentgallery.get(0))!="undefined"){
                    o.parentgallery.get(0).api_goto_prev();
                }
            }
            function click_next_btn(){
                if(o.parentgallery && typeof(o.parentgallery.get(0))!="undefined"){
                    o.parentgallery.get(0).api_goto_next();
                }
            }
            function check_time(pargs){


                var margs = {
                    'fire_only_once': false
                }

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                //console.info('check_time()');

                if(cthis.attr('id')=='apminimal'){

                    //console.log(cthis,'check');
                }
                if(destroyed ) { return false; }

                if(debug_var){
                    //console.info('check_time()' , cthis);
                    debug_var=false;
                }


                if(sw_suspend_enter_frame){
                    return false;
                }


                if(type=='youtube'){
                    if(_cmedia && _cmedia.getDuration){
                        real_time_total = _cmedia.getDuration();
                        real_time_curr = _cmedia.getCurrentTime();
                    }



                    if(playfrom=='last' && playfrom_ready){
                        if(typeof Storage!='undefined'){
                            localStorage['dzsap_'+the_player_id+'_lastpos'] = time_curr;
                        }
                    }
                }
                if(type=='audio'){
                    if(is_flashplayer==true){
                        if(o.settings_backup_type=='light'){
                            if(str_ie8=='' && typeof(_cmedia)!="undefined"){

                                eval("if(typeof _cmedia.fn_getsoundduration"+cthisId+" != 'undefined'){time_total = parseFloat(_cmedia.fn_getsoundduration"+cthisId+"())};");
                                eval("if(typeof _cmedia.fn_getsoundcurrtime"+cthisId+" != 'undefined'){time_curr = parseFloat(_cmedia.fn_getsoundcurrtime"+cthisId+"())};");
                            }
                        }


                        //console.log(_cmedia.fn_getSoundCurrTime());
                    }else{
                        if(o.type!='shoutcast'){
                            if(_cmedia){
                                real_time_total = _cmedia.duration;
                                if(inter_audiobuffer_workaround_id==0){

                                    real_time_curr = _cmedia.currentTime;
                                }
                            }

//                            console.info(time_curr, time_total, inter_audiobuffer_workaround_id);
//                            console.info(audioBuffer, audioCtx, webaudiosource);
                            if(audioBuffer && audioBuffer!='placeholder'){
//                                console.info(time_curr);
//                                time_total = audioBuffer.duration;
//                                time_curr = audioCtx.currentTime;
//                                console.log(audioBuffer, audioBuffer.currentTime, audioBuffer.duration);

                            }

                            if(audioCtx && is_firefox()){
//                                time_curr = audioCtx.currentTime;
                            }

                            if(playfrom=='last' && playfrom_ready){
                                if(typeof Storage!='undefined'){
                                    localStorage['dzsap_'+the_player_id+'_lastpos'] = time_curr;
//                                    console.info(localStorage['dzsap_'+the_player_id+'_lastpos']);
                                }
                            }

                            if(o.design_skin=='skin-wave'){
                                if(o.skinwave_comments_displayontime=='on'){

                                    var timer_curr_perc = Math.round((real_time_curr / real_time_total) * 100) / 100

//                                    console.info(timer_curr_perc);

                                    if(_commentsHolder){

                                        _commentsHolder.children().each(function(){
                                            var _t = $(this);
                                            if(_t.hasClass('dzstooltip-con')){
                                                var aux = Math.round((parseFloat(_t.css('left')) / _commentsHolder.outerWidth()) * 100) / 100;
                                                if(aux){

                                                    if(Math.abs(aux - timer_curr_perc) < 0.02 ){
                                                        _commentsHolder.find('.dzstooltip').removeClass('active');
                                                        _t.find('.dzstooltip').addClass('active');
                                                    }else{
                                                        _t.find('.dzstooltip').removeClass('active');
                                                    }
                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        }

                    }
                }


                if(cthis.hasClass('first-played')==false){

                    if(!(cthis.attr('data-playfrom')) || cthis.attr('data-playfrom')=='0'){
                        real_time_curr = 0;
                        if($(_cmedia) && $(_cmedia).html() && $(_cmedia).html().indexOf('api.soundcloud.com')>-1){
                            seek_to(0);
                        }
                    }


                    // console.info(_cmedia, cthis, $(_cmedia).html());
                }

                //if(cthis.hasClass("skin-minimal")){ console.log(time_curr, time_total) };

//                console.info(time_curr, time_total, sw);

                //console.info(time_curr,type);
                if(type=='fake' || o.fakeplayer){


                    // console.info(time_curr,_cmedia.currentTime,_cmedia);


                    if(time_total==0){

                        //if(cthis.attr('id')=='ap26'){
                        //    console.info(time_total, _cmedia, _cmedia.duration);
                        //}
                        if(_cmedia){
                            time_total = _cmedia.duration;
                            if(inter_audiobuffer_workaround_id==0){

                                time_curr = _cmedia.currentTime;
                            }
                        }
                    }
                    if(time_curr==5){
                        time_curr = 0;
                    }


                    // console.info(time_curr);
                    // -- trying to fix some soundcloud wrong reporting





                    // console.info(time_curr,cthis.hasClass('first-played'), cthis.attr('data-playfrom'), cthis)
                    real_time_curr = time_curr;
                    real_time_total = time_total;
                }

                time_curr = real_time_curr;
                time_total = real_time_total;

                if(sample_time_start>0){
                    time_curr = sample_time_start + real_time_curr;
                }
                if(sample_time_total>0){
                    time_total = sample_time_total;
                }

                if(cthis.hasClass('is-playing')){

                    //console.info(sw);
                }
                //--- incase of new skin - watch sw it will be 0
                spos = (time_curr / time_total) * sw;
                if(isNaN(spos)){
                    spos = 0;
                }
                if(spos>sw){
                    spos = sw;
                }

                //console.info(time_curr, time_total, sw);

                //console.log(_scrubbar, _scrubbar.children('.scrub-prog'), spos, time_total, '-timecurr ', time_curr, sw);


//                console.info(audioBuffer);


                if(audioBuffer==null){
                    //console.info(spos, _scrubbar.width());
                    _scrubbar.children('.scrub-prog').css({
                        'width' : spos
                    })
                    if(o.skinwave_enableReflect=='on'){
                        _scrubbar.children('.scrub-prog-reflect').css({
                            'width' : spos
                        })
                    }
                }

                if(debug_var){

                    //console.info(cthis, _feed_fakePlayer, time_curr/time_total);
                    //debug_var = false;
                }


                //console.log(cthis, _feed_fakePlayer);

                if(_feed_fakePlayer){
                    //console.log(cthis, _feed_fakePlayer);
                    _feed_fakePlayer.get(0).api_seek_to_onlyvisual(time_curr/time_total);
                }

                if(o.design_skin=='skin-pro'){
//                    console.info(spos,sw,spos/sw,Math.easeOutQuart(spos/sw, 0, sw,1));

                    // var spos_eased = parseInt(Math.easeOutQuad(spos/sw, 0, sw,1), 10);
                    // // var spos_eased = parseInt(Math.easeOutQuad(spos/sw, 0, sw,1), 10);
                    // //
                    // _scrubbar.children('.scrub-prog').css({
                    //     'width' : spos_eased
                    // })
                }



                if(cthis.hasClass('skin-minimal')){
                    //console.log(skin_minimal_canvasplay);
                    //alert(can_canvas());

                    if(is_ie8() || !can_canvas() || is_opera()){
                        _conPlayPause.addClass('canvas-fallback');
                    }else{
                        var ctx = skin_minimal_canvasplay.getContext('2d');
                        //console.log(ctx);

                        var ctx_w = $(skin_minimal_canvasplay).width();
                        var ctx_h = $(skin_minimal_canvasplay).height();
                        var pw = ctx_w/100;
                        var ph = ctx_h/100;
                        spos = Math.PI*2 * (time_curr / time_total);
                        if(isNaN(spos)){
                            spos = 0;
                        }
                        if(spos>Math.PI*2){
                            spos = Math.PI*2;
                        }

                        ctx.clearRect(0,0,ctx_w, ctx_h);
                        //console.log(ctx_w, ctx_h);




                        var gradient = gradient = ctx.createLinearGradient(0, 0, 0, ctx_h);


                        var aux1 = parseInt(o.design_color_highlight,16);


                        var color1 = aux1;
                        var color2 = aux1+40;

                        //console.info(aux1.toString(16));


                        gradient.addColorStop("0", "#"+color1.toString(16));
                        gradient.addColorStop("1.0", "#"+color2.toString(16));


                        ctx.beginPath();
                        ctx.arc((50*pw),(50*ph),(40*pw),0,Math.PI*2,false);
                        ctx.fillStyle = "rgba(0,0,0,0.1)";
                        ctx.fill();



                        ctx.beginPath();
                        ctx.arc((50*pw),(50*ph),(30*pw),0,Math.PI*2,false);
                        //ctx.moveTo(110,75);
                        ctx.fillStyle = gradient;

                        ctx.fill();

                        //console.log(spos);
                        ctx.beginPath();
                        ctx.arc((50*pw),(50*ph),(34*pw),0,spos,false);
                        //ctx.fillStyle = "rgba(0,0,0,0.3)";
                        ctx.lineWidth=(10*pw);
                        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                        ctx.stroke();



                        ctx.beginPath();
                        ctx.strokeStyle = "red";

                        //==draw the triangle
                        ctx.moveTo((44*pw),(40*pw));
                        ctx.lineTo((57*pw),(50*pw));
                        ctx.lineTo((44*pw),(60*pw));
                        ctx.lineTo((44*pw),(40*pw));
                        ctx.fillStyle="#ddd";
                        ctx.fill();


                        ctx = skin_minimal_canvaspause.getContext('2d');
                        //console.log(ctx);

                        ctx_w = $(skin_minimal_canvaspause).width();
                        ctx_h = $(skin_minimal_canvaspause).height();
                        pw = ctx_w/100;
                        ph = ctx_h/100;

                        ctx.clearRect(0,0,ctx_w, ctx_h);
                        //console.log(ctx_w, ctx_h);

                        //console.log((time_curr / time_total));

                        ctx.beginPath();
                        ctx.arc((50*pw),(50*ph),(40*pw),0,Math.PI*2,false);
                        ctx.fillStyle = "rgba(0,0,0,0.1)";
                        ctx.fill();



                        ctx.beginPath();
                        ctx.arc((50*pw),(50*ph),(30*pw),0,Math.PI*2,false);
                        //ctx.moveTo(110,75);
                        ctx.fillStyle = gradient;

                        ctx.fill();

                        //console.log(spos);
                        ctx.beginPath();
                        ctx.arc((50*pw),(50*ph),(34*pw),0,spos,false);
                        //ctx.fillStyle = "rgba(0,0,0,0.3)";
                        ctx.lineWidth=(10*pw);
                        ctx.strokeStyle = 'rgba(0,0,0,0.35)';
                        ctx.stroke();

                        ctx.fillStyle="#ddd";
                        ctx.fillRect((43*pw),(40*pw),(6*pw),(20*pw));
                        ctx.fillRect((53*pw),(40*pw),(6*pw),(20*pw));
                    }
                    //console.log('ceva');
                }


//                console.info(o.design_skin);
                if(o.design_skin=='skin-wave'){
                    if(o.skinwave_enableSpectrum=='on'){
                        //console.info(_scrubBgCanvas.width());
                        if(lastarray){
                            drawSpectrum(lastarray);
                        }

                    }

                    if(_currTime){
//                        console.info(_currTime, time_curr, time_total, formatTime(time_curr))

                        if(o.skinwave_timer_static!='on'){

                            _currTime.css({
                                'left':spos
                            });
                            if(spos>sw-currTime_outerWidth){
                                //console.info(sw, currTime_outerWidth);
                                _currTime.css({
                                    'left':sw - currTime_outerWidth
                                })
                            }
                            if(spos>sw-30){
                                _totalTime.css({
                                    'opacity':1-( ((spos-(sw-30)) / 30) )
                                });
                            }else{
                                if(_totalTime.css('opacity')!='1'){
                                    _totalTime.css({
                                        'opacity':''
                                    });
                                }
                            };
                        };
                    }
                }
                if(_currTime){
                    //console.info(_currTime, time_curr, formatTime(time_curr))
                    //console.info("CEVA");
                    _currTime.html(formatTime(time_curr));
                    _totalTime.html(formatTime(time_total));
                }

//                console.log(time_curr, time_total);
                if(time_total>0 && time_curr >= time_total - 0.07){
                    handle_end();
                }



                // -- debug check_time
                // inter_check = setTimeout(check_time, 2000);
                if(margs.fire_only_once!=true){
                    if(is_flashplayer==true || type=='youtube'){
                        inter_check = setTimeout(check_time, 500);
                    }else{
                        requestAnimFrame(check_time);
                    }
                }



            }
            function click_playpause(e){
                //console.log('click_playpause');
                var _t = $(this);
                //console.log(_t);


                if(o.design_skin == 'skin-minimal'){

                    var center_x = _t.offset().left + 50;
                    var center_y = _t.offset().top + 50;
                    var mouse_x = e.pageX;
                    var mouse_y = e.pageY;
                    var pzero_x = center_x + 50;
                    var pzero_y = center_y;

                    //var angle = Math.acos(mouse_x - center_x);

                    //console.log(pzero_x, pzero_y, mouse_x, mouse_y, center_x, center_y, mouse_x - center_x, angle);

                    //A = center, B = mousex, C=pointzero

                    var AB = Math.sqrt(Math.pow((mouse_x - center_x),2) + Math.pow((mouse_y - center_y),2));
                    var AC = Math.sqrt(Math.pow((pzero_x - center_x),2) + Math.pow((pzero_y - center_y),2));
                    var BC = Math.sqrt(Math.pow((pzero_x - mouse_x),2) + Math.pow((pzero_y - mouse_y),2));


                    var angle = Math.acos((AB + AC + BC)/(2*AC*AB));
                    var angle2 = Math.acos((mouse_x - center_x)/50);

                    //console.info(AB, AC, BC, angle, (mouse_x - center_x), angle2, Math.PI);

                    var perc = -(mouse_x - center_x - 50) * 0.005;//angle2 / Math.PI / 2;


                    if(mouse_y < center_y){
                        perc = 0.5 + (0.5 - perc)
                    }

                    if( !(is_flashplayer==true && is_firefox()) && AB > 20){
                        seek_to_perc(perc);
                        return;
                    }
                }



                //unghi = acos (x - centruX) = asin(centruY - y)


                if(playing==false){
                    play_media();
                }else{
                    pause_media();
                }

            }
            function handle_end(){
                //console.log('end');
                seek_to(0);


                if(o.loop=='on'){
                    play_media();
                    return false;
                }else{
                    pause_media();
                }

                if(o.parentgallery && typeof(o.parentgallery)!='undefined'){
                    //console.log(o.parentgallery);
                    o.parentgallery.get(0).api_handle_end();
                }







                setTimeout(function(){
                    if(cthis.hasClass('is-single-player')){
                        if(dzsap_list_for_sync_players.length>0){
                            for(var i24 in dzsap_list_for_sync_players){
                                if(dzsap_list_for_sync_players[i24].get(0)==cthis.get(0)){
                                    // console.info('THIS IS ',i24,dzsap_list_for_sync_players.length-1);

                                    if(i24<dzsap_list_for_sync_players.length-1){
                                        i24 = parseInt(i24,10);
                                        var _c_ = dzsap_list_for_sync_players[i24+1].get(0);

                                        // console.info(_c_, i24, dzsap_list_for_sync_players[i24+1]);
                                        if(_c_ && _c_.api_play_media){
                                            setTimeout(function(){
                                                _c_.api_play_media();
                                            },200);

                                        }
                                    }
                                }
                            }
                        }
                    }
                },100);

                setTimeout(function(){
                    if(action_audio_end){
                        action_audio_end(cthis);
                    }
                },200);

            }

            Math.easeOutQuart = function (t, b, c, d) {
                t /= d;
                t--;
                return -c * (t*t*t*t - 1) + b;
            };
            Math.easeOutQuad = function (t, b, c, d) {
                return -c * t/d*(t/d-2) + b;
            };
            Math.easeOutQuad_rev = function (t, b, c, d) {
                // t /= d;
                return (c*d+d*Math.sqrt(c*(c+b-t))) / c;
            };


            function handleResize(e, pargs) {



                var margs = {

                }

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                ww = $(window).width();
                tw = cthis.width();
                th = cthis.height();


                if(_scrubBgCanvas){
                    canw = _scrubBgCanvas.width();
                    canh = _scrubBgCanvas.height();

                }

                //console.info('handleResize', _commentsHolder)

                if(tw<=720){
                    cthis.addClass('under-720');
                }else{

                    cthis.removeClass('under-720');
                }


                sw = tw;
                if(o.design_skin=='skin-default'){
                    sw = tw;
                }
                if(o.design_skin=='skin-pro'){
                    sw = tw;
                }
                if(o.design_skin=='skin-silver'){
                    sw = tw;

                    sw = _scrubbar.width();
                    //console.info(sw);




                    if(o.scrubbar_tweak_overflow_hidden=='on'){
                        sw = tw - _apControlsLeft.width() - _apControlsRight.outerWidth()-15;
                        _scrubbar.css({
                            'left' : _apControlsLeft.width()
                            ,'width' : sw
                        })
                    }

                }

                if(o.design_skin=='skin-justthumbandbutton'){
                    tw = cthis.children('.audioplayer-inner').outerWidth();
                    sw = tw;
                }
                if(o.design_skin=='skin-redlights' || o.design_skin=='skin-steel') {
                    sw = _scrubbar.width();
                }


                //console.info(sw);




                if(o.design_skin=='skin-wave'){
                    sw = _scrubbar.outerWidth(false);
                    //console.info(sw);

                    if(_commentsHolder){

                        var aux = _scrubbar.offset().left - cthis.offset().left;

                        //console.log(aux);

                        _commentsHolder.css({
                            'width' : sw,
                            'left' : aux+'px'
                        })
                        //return;
                        _commentsHolder.addClass('active');

//                        _commentsHolder.find('.a-comment').each(function(){
//                            var _t = $(this);
//
//
////                            console.info(_t, _t.offset(), _t.find('.dzstooltip').eq(0).width(), _t.offset().left + _t.find('.dzstooltip').eq(0).width(), _t.offset().left + _t.find('.dzstooltip').eq(0).width() > ww - 50)
//                            if(_t.offset().left + _t.find('.dzstooltip').eq(0).width() > ww - 50){
//                                _t.find('.dzstooltip').eq(0).addClass('align-right');
//                            }else{
//
//                                _t.find('.dzstooltip').eq(0).removeClass('align-right');
//                            }
//                        })
                    }

                    if(cthis.hasClass('fullflashbackup')){
                        if(_commentsHolder){
                            _commentsHolder.css({
                                'width' : tw-212,
                                'left' : 212
                            })
                            if(tw<=480){
                                _commentsHolder.css({
                                    'width' : tw-112,
                                    'left' : 112
                                })
                            }
                            _commentsHolder.addClass('active');
                        }

                    }
                }

                //console.info(o.design_skin, tw, sw);


                if(res_thumbh==true){

//                    console.info(cthis.get(0).style.height);


                    if(o.design_skin=='skin-default'){


                        if(cthis.get(0)!=undefined){
                            // if the height is auto then
                            if(cthis.get(0).style.height=='auto'){
                                cthis.height(200);
                            }
                        }

                        var cthis_height = _audioplayerInner.height();
                        if(typeof cthis.attr('data-initheight') == 'undefined' && cthis.attr('data-initheight')!=''){
                            cthis.attr('data-initheight', _audioplayerInner.height());
                        }else{
                            cthis_height = Number(cthis.attr('data-initheight'));
                        }

                        console.info('cthis_height - ',cthis_height, cthis.attr('data-initheight'));

                        if(o.design_thumbh=='default'){

                            design_thumbh = cthis_height - 44;
                        }

                    }

                    _audioplayerInner.find('.the-thumb').eq(0).css({
                        'height': design_thumbh
                    })
                }


                //===display none + overflow hidden hack does not work .. yeah
                //console.log(cthis, _scrubbar.children('.scrub-bg').width());

                if(cthis.css('display')!='none'){
                    _scrubbar.find('.scrub-bg-img').eq(0).css({
                        'width' : _scrubbar.children('.scrub-bg').width()
                    });
                    _scrubbar.find('.scrub-prog-img').eq(0).css({
                        'width' : _scrubbar.children('.scrub-bg').width()
                    });
                    _scrubbar.find('.scrub-prog-canvas').eq(0).css({
                        'width' : _scrubbar.children('.scrub-bg').width()
                    });
                    _scrubbar.find('.scrub-prog-img-reflect').eq(0).css({
                        'width' : _scrubbar.children('.scrub-bg').width()
                    });
                    _scrubbar.find('.scrub-prog-canvas-reflect').eq(0).css({
                        'width' : _scrubbar.children('.scrub-bg').width()
                    });
                }



                cthis.removeClass('under-240 under-400');
                if(tw<=240){
                    cthis.addClass('under-240');
                }
                if(tw<=400){
                    cthis.addClass('under-400');
                    if(_controlsVolume){
                        if(o.disable_volume=='on'){
                            _controlsVolume.hide();
                        }else{
                            _controlsVolume.hide();
                        }
                    }

                }else{

                    if(o.disable_volume=='on'){
                        _controlsVolume.hide();
                    }else{
                        _controlsVolume.show();
                    }
                }





                //console.info(_conPlayPause.outerWidth(), o.design_skin);

                var aux2 = 50;
                if(o.design_skin=='skin-wave'){
                    //console.info((o.design_thumbw + 20));
                    controls_left_pos = 0;
                    if(cthis.find('.the-thumb').length>0){
                        controls_left_pos += cthis.find('.the-thumb').width() + 20;
                    }

                    controls_left_pos +=  70;

                    var sh = _scrubbar.eq(0).height();


                    if(is_flashplayer && o.settings_backup_type=='full'){
                        sh = 140;
                        controls_left_pos = 280;

                        if(tw<=480){
                            controls_left_pos = 180;
                        }
                    }

                    if(o.skinwave_mode=='small'){
                        controls_left_pos-=80;
                        sh = 5;

                        controls_left_pos+=13;
                        _conPlayPause.css({
                            //'left' : controls_left_pos
                        })

                        controls_left_pos+=_conPlayPause.outerWidth() + 10;




                    }


                    if(o.skinwave_mode=='small' && is_flashplayer && o.settings_backup_type=='full'){
                        controls_left_pos = 140;
                        cthis.find('.meta-artist-con').hide();
                    }


                    //== adding the prev and next buttons
                    if(o.parentgallery && typeof(o.parentgallery)!='undefined' && o.disable_player_navigation!='on'){



                        //if(o.skinwave_mode!='small') {
                        //
                        //    if (cthis.find('.prev-btn').eq(0).css('display') != 'none') {
                        //
                        //        cthis.find('.prev-btn').eq(0).css({
                        //            'top': sh + 19
                        //            , 'left': controls_left_pos
                        //        })
                        //        controls_left_pos += 30;
                        //        cthis.find('.next-btn').eq(0).css({
                        //            'top': sh + 19
                        //            , 'left': controls_left_pos
                        //        })
                        //        controls_left_pos += 42;
                        //    }
                        //
                        //}
                    }


                    if(_metaArtistCon && _metaArtistCon.css('display')!='none'){
                        if(o.skinwave_mode=='small'){
                            controls_left_pos+=10;
                        }

                        if(!(o.design_skin=='skin-wave' && o.skinwave_mode=='small')) {
                            _metaArtistCon.css({
                                //'left': controls_left_pos
                            });

                            if(o.design_skin=='skin-wave' && o.skinwave_mode!='small'){
                                _metaArtistCon.css({
                                    //'width': tw - controls_left_pos - _apControlsRight.outerWidth()
                                });
                            }
                        }

                        controls_left_pos+=_metaArtistCon.outerWidth();

                        //console.info(_metaArtistCon, _metaArtistCon.outerWidth());
                    }





                    controls_right_pos = 0;

                    if(_controlsVolume && _controlsVolume.css('display')!='none'){
                        controls_right_pos+=55;
                    }

                    //cthis.find('.btn-menu-state').eq(0).css({
                    //    'right': controls_right_pos
                    //})
                    //
                    //if(cthis.find('.btn-menu-state').eq(0).css('display')!='none'){
                    //    controls_right_pos += cthis.find('.btn-menu-state').eq(0).outerWidth();
                    //}

                    //if(o.skinwave_mode!='small') {
                    //    //console.info('ceva',controls_right_pos,cthis.find('.btn-embed-code-con'),o.skinwave_mode);
                    //    cthis.find('.btn-embed-code-con').eq(0).css({
                    //        'right': controls_right_pos+'px'
                    //    })
                    //}
                    //
                    //if(cthis.find('.btn-menu-state').eq(0).css('display')!='none'){
                    //    controls_right_pos += cthis.find('.btn-menu-state').eq(0).outerWidth();
                    //}



                    // ---------- calculate dims small
                    if(o.skinwave_mode=='small'){
                        controls_left_pos+=10;
                        _scrubbar.css({
                            //'left' : controls_left_pos
                        })

                        cthis.find('.btn-menu-state').eq(0).css({
                            'bottom': 'auto'
                            ,'top' : 25
                        });

                        //sw =  ( tw - controls_left_pos - controls_right_pos );




                        if(o.scrubbar_tweak_overflow_hidden=='on'){
                            _scrubbar.css({
                                'left' : _apControlsLeft.width()
                                ,'width' : tw - _apControlsLeft.width() - _apControlsRight.outerWidth()
                            })
                        }

                        sw = _scrubbar.width();

                        if(o.scrubbar_tweak_overflow_hidden=='on'){
                            //sw = parseInt(_scrubbar.css('width'),10);
                            sw = tw - _apControlsLeft.width() - _apControlsRight.outerWidth();
                        }
                        //console.info(sw,controls_left_pos,controls_right_pos);


                        controls_right_pos+=10;
                        _scrubbar.css({
                            //'width' : sw
                        });



                        _scrubbar.find('.scrub-bg-img').eq(0).css({
                            'width' : sw
                        })
                        _scrubbar.find('.scrub-prog-img').eq(0).css({
                            'width' :  sw
                        })
                        //cthis.find('.comments-holder').eq(0).css({
                        //    'width' :  _scrubbar.width()
                        //    ,'left' : controls_left_pos
                        //});



                    }
                }

                if(o.design_skin=='skin-pro'){

                    controls_right_pos = 10;

                    if(_controlsVolume && _controlsVolume.css('display')!='none'){
                        controls_right_pos+=60;
                    }

                    _totalTime.css({
                        'left':'auto',
                        'right':controls_right_pos
                    })
                    controls_right_pos+=50;


                    _currTime.css({
                        'left':'auto',
                        'right':controls_right_pos
                    })
                }


                if(o.design_skin=='skin-default'){
                    if(_currTime){
                        //console.info(o.design_skin, parseInt(_metaArtistCon.css('left'),10) + _metaArtistCon.outerWidth() + 10);
                        _metaArtistCon_l = parseInt(_metaArtistCon.css('left'),10);
                        _metaArtistCon_w = _metaArtistCon.outerWidth();

                        if(_metaArtistCon.css('display')=='none'){
                            _metaArtistCon_w = 0;
                        }
                        if(isNaN(_metaArtistCon_l)){
                            _metaArtistCon_l = 20;
                        }
//                        console.info(o.design_skin, _currTime,  _metaArtistCon, _metaArtistCon.css('left'), parseInt(_metaArtistCon.css('left'),10), parseInt(_metaArtistCon.css('left'),10) + _metaArtistCon_w + 10);

                        _currTime.css({
                            //'left': _metaArtistCon_l + _metaArtistCon_w + 10
                        })
                        _totalTime.css({
                            //'left': _metaArtistCon_l + _metaArtistCon_w + 55
                        })
                        /*
                         */
                    }

                }

                if(o.design_skin=='skin-minion'){
                    //console.info();
                    aux2 = parseInt(_conControls.find('.con-playpause').eq(0).offset().left,10) - parseInt(_conControls.eq(0).offset().left,10) - 18;
                    _conControls.find('.prev-btn').eq(0).css({
                        'top':0
                        ,'left':aux2
                    })
                    aux2+=36;
                    _conControls.find('.next-btn').eq(0).css({
                        'top':0
                        ,'left':aux2
                    })
                }


                if(o.embedded=='on'){
                    //console.info(window.frameElement)
                    if(window.frameElement){
                        //window.frameElement.height = cthis.height();
                        //console.info(window.frameElement.height, cthis.outerHeight())


                        var args = {
                            height: cthis.outerHeight()
                        };


                        if(o.embedded_iframe_id){

                            args.embedded_iframe_id = o.embedded_iframe_id;
                        }


                        var message = {name: "resizeIframe", params: args};
                        window.parent.postMessage(message, '*');
                    }

                }

            }
            function mouse_volumebar(e){
                var _t = $(this);

                //var mx = e.clientX - _controlsVolume.offset().left;
                if(e.type=='mousemove'){

                    //console.info(volume_dragging, mx);


                    if(volume_dragging){
                        aux = (e.pageX - (_controlsVolume.find('.volume_static').eq(0).offset().left)) / (_controlsVolume.find('.volume_static').eq(0).width());

                        if(_t.parent().hasClass('volume-holder')){


                            aux = 1-( (e.pageY - (_controlsVolume.find('.volume_static').eq(0).offset().top)) / (_controlsVolume.find('.volume_static').eq(0).height()) );

                        }

                        if(o.design_skin == 'skin-redlights'){
                            aux*=10;

                            aux=Math.round(aux);

                            //console.info(aux);
                            aux/=10;
                        }


                        set_volume(aux);
                        muted=false;
                    }

                }
                if(e.type=='mouseleave'){

                }
                if(e.type=='click'){

                    //console.log(_t, _t.offset().left)

                    aux = (e.pageX - (_controlsVolume.find('.volume_static').eq(0).offset().left)) / (_controlsVolume.find('.volume_static').eq(0).width());

                    if(_t.parent().hasClass('volume-holder')){


                        aux = 1-( (e.pageY - (_controlsVolume.find('.volume_static').eq(0).offset().top)) / (_controlsVolume.find('.volume_static').eq(0).height()) );

                    }

                    //console.info(aux);

                    set_volume(aux);
                    muted=false;
                }

                if(e.type=='mousedown'){

                    volume_dragging= true;
                    cthis.addClass('volume-dragging');




                    aux = (e.pageX - (_controlsVolume.find('.volume_static').eq(0).offset().left)) / (_controlsVolume.find('.volume_static').eq(0).width());

                    if(_t.parent().hasClass('volume-holder')){


                        aux = 1-( (e.pageY - (_controlsVolume.find('.volume_static').eq(0).offset().top)) / (_controlsVolume.find('.volume_static').eq(0).height()) );

                    }

                    //console.info(aux);

                    set_volume(aux);
                    muted=false;
                }
                if(e.type=='mouseup'){

                    volume_dragging = false;
                    cthis.removeClass('volume-dragging');

                }

            }
            function mouse_scrubbar(e){
                var mousex = e.pageX;


                if($(e.target).hasClass('sample-block-start') || $(e.target).hasClass('sample-block-end')){
                    return false;
                }

                if(e.type=='mousemove'){
                    _scrubbar.children('.scrubBox-hover').css({
                        'left' : (mousex - _scrubbar.offset().left)
                    })
                }
                if(e.type=='mouseleave'){

                }
                if(e.type=='click'){


                    if(audioBuffer){
                        time_total = audioBuffer.duration;
                    }


                    var aux = ((e.pageX - (_scrubbar.offset().left)) / (sw) * time_total);
                    if(is_flashplayer==true){
                        aux = (e.pageX - (_scrubbar.offset().left)) / (sw);
                    }
                    //console.info(e.target,e.pageX, (_scrubbar.offset().left), (sw), time_total, aux);

                    if(sample_time_start>0){
                        aux-=sample_time_start;
                    }

                    if(o.fakeplayer){


                        var args = {
                            type : o.type_for_fake_feed
                            ,fakeplayer_is_feeder:'on'
                        }

                        //o.fakeplayer.get(0).api_change_media(cthis, args);
                        setTimeout(function(){

                            if(o.fakeplayer.get(0) && o.fakeplayer.get(0).api_pause_media){

                                o.fakeplayer.get(0).api_seek_to_perc(aux/time_total);
                            }
                        },50);
                    }

                    seek_to(aux);

                    if(playing==false){
                        play_media();
                    }
                }

            }
            function seek_to_perc(argperc){
                seek_to((argperc * time_total));
            }
            function seek_to(arg){
                //arg = nr seconds


                //console.info(_feed_fakePlayer);

                if(type=='youtube'){
                    _cmedia.seekTo(arg);
                }

                if(type=='audio'){
                    if(audioBuffer!=null){
                        lasttime_inseconds = arg;
                        audioCtx.currentTime = lasttime_inseconds;

                        if(inter_audiobuffer_workaround_id!=0){
                            time_curr=arg;
                        }

                        pause_media({'audioapi_setlasttime':false});
                        play_media();
                    }else{
                        if(is_flashplayer==true){

                            if(o.settings_backup_type=='light'){
                                if(str_ie8==''){
                                    eval("_cmedia.fn_seek_to"+cthisId+"("+arg+")");
                                }
                            }
                            play_media();
                        }else{

                            if(o.design_skin=='skin-pro'){
                                // var aux = parseInt(Math.easeOutQuad_rev(arg/totalDuration, 0, sw,1), 10);
                                //
                                // console.info(arg/totalDuration, aux/sw, arg, aux, sw)
                            }
                            _cmedia.currentTime = arg;
                        }
                    }

                }


            }

            function seek_to_onlyvisual(argperc){

                //if(debug_var){
                //    console.info('seek_to_onlyvisual()',argperc,cthis);
                //    debug_var = false;
                //}

                //console.info(time_total);
                if(time_total==0){


                    if(_cmedia && _cmedia.duration){
                        time_total = _cmedia.duration;
                    }
                    //
                    //if(debug_var){
                    //    //console.info('seek_to_onlyvisual()', o.type, argperc,time_curr, time_total,_cmedia, _cmedia.duration);
                    //    debug_var = false;
                    //}
                }

                time_curr = argperc * time_total;



                //console.info(time_curr,argperc,time_total);
                //check_time();
            }
            function set_playback_speed(arg) {
                //=== outputs a playback speed from 0.1 to 10

                if(type=='youtube') {
                    _cmedia.setPlaybackRate(arg);
                }
                if(type=='audio') {
                    if (is_flashplayer == false) {
                        _cmedia.playbackRate=arg;
                    }
                }

            }
            function set_volume(arg){
                //=== outputs a volume from 0 to 1
                if(type=='youtube'){
                    _cmedia.setVolume(arg*100);
                }
                if(type=='audio'){
                    if(is_flashplayer==true){


                        if(o.settings_backup_type=='light'){
                            if(str_ie8==''){
                                eval("_cmedia.fn_volumeset"+cthisId+"(arg)");
                            }
                        }
                        //play_cmedia();
                    }else{
                        _cmedia.volume = arg;
                    }
                }

                //console.log(_controlsVolume.children('.volume_active'));

                if(_controlsVolume.hasClass('controls-volume-vertical')){

                    //console.info('ceva');
                    _controlsVolume.find('.volume_active').eq(0).css({
                        'height':(_controlsVolume.find('.volume_static').eq(0).height() * arg)
                    });
                }else{

                    _controlsVolume.find('.volume_active').eq(0).css({
                        'width':(_controlsVolume.find('.volume_static').eq(0).width() * arg)
                    });
                }

                if(o.design_skin=='skin-wave' && o.skinwave_dynamicwaves=='on'){
                    //console.log(arg);
                    _scrubbar.find('.scrub-bg-img').eq(0).css({
                        'transform' : 'scaleY('+arg+')'
                    })
                    _scrubbar.find('.scrub-prog-img').eq(0).css({
                        'transform' : 'scaleY('+arg+')'
                    })

                    if(o.skinwave_enableReflect=='on'){

                        if(arg==0){
                            cthis.find('.scrub-bg-img-reflect').fadeOut('slow');
                        }else{
                            cthis.find('.scrub-bg-img-reflect').fadeIn('slow');
                        }
                    }
                }



                if (localStorage != null && the_player_id) {

                    //console.info(the_player_id);

                    localStorage.setItem('dzsap_last_volume_' + the_player_id, arg);

                }

                last_vol = arg;
            }
            function click_mute(){
                if(muted==false){
                    last_vol_before_mute = last_vol;
                    set_volume(0);
                    muted=true;
                }else{
                    set_volume(last_vol_before_mute);
                    muted=false;
                }
            }

            function pause_media_visual(){


                if(o.design_animateplaypause!='on'){
                    _conPlayPause.children('.playbtn').css({
                        'display' : 'block'
                    });
                    _conPlayPause.children('.pausebtn').css({
                        'display' : 'none'
                    });
                }else{

                    if(cthis.hasClass('is-playing')==false){
                        return false;
                    }


                    if(o.design_skin=='skin-redlights'||o.design_skin=='skin-steel'){

                        _conPlayPause.children('.pausebtn').css('opacity',1);
                        _conPlayPause.children('.pausebtn').animate({
                            'opacity':'0'
                        },{
                            queue:false
                            ,duration: 300
                        });


                        //console.info(_conPlayPause);


                        _conPlayPause.children('.playbtn').css({
                            'opacity' : 0
                            ,'visibility': 'visible'
                            ,'display' : 'block'
                        });
                        _conPlayPause.children('.playbtn').animate({
                            'opacity':'1'
                        },{
                            queue:false
                            ,duration: 300
                        });





                    }else{

                        _conPlayPause.children('.playbtn').stop().fadeIn('fast');
                        _conPlayPause.children('.pausebtn').stop().fadeOut('fast');
                    }
                }
                cthis.removeClass('is-playing');
                playing=false;

            }

            function pause_media(pargs){
                //console.log('pause_media()', cthis);

                if(_feed_fakePlayer){
                    //console.warn('has _feed_fakePlayer and will pause that too - ',_feed_fakePlayer);
                }

                var margs = {
                    'audioapi_setlasttime' : true
                    ,'donot_change_media' : false
                };

                if(destroyed){ return false; }

                if(pargs){
                    margs = $.extend(margs,pargs);
                }



                pause_media_visual();


                //console.info(margs.donot_change_media);
                if(margs.donot_change_media!=true){


                    //console.info(o.fakeplayer);
                    if(o.fakeplayer!=null){

                        var args = {
                            type : o.type_for_fake_feed
                            ,fakeplayer_is_feeder:'on'
                        }
                        //console.info(playing, args, o.fakeplayer);
                        // o.fakeplayer.get(0).api_change_media(cthis, args);
                        setTimeout(function(){

                            if(o.fakeplayer.get(0) && o.fakeplayer.get(0).api_pause_media){

                                o.fakeplayer.get(0).api_pause_media();
                            }
                        },100);

                        playing=false;
                        cthis.removeClass('is-playing');
                        return;
                    }



                }


                if(type=='youtube'){
                    _cmedia.pauseVideo();
                }
                if(type=='audio'){

                    if(audioBuffer!=null){
                        //console.log(audioCtx.currentTime, audioBuffer.duration);
                        //console.log(lasttime_inseconds);
                        ///==== on safari we need to wait a little for the sound to load
                        if(audioBuffer!='placeholder'){
                            if(margs.audioapi_setlasttime==true){
                                lasttime_inseconds = audioCtx.currentTime;
                            }
                            //console.log('trebuie doar la pauza', lasttime_inseconds);

                            webaudiosource.stop(0);
                        }
                    }else{
                        if(is_flashplayer==true && o.settings_backup_type=='light' && cthis.css('display')!='none'){
                            if(o.settings_backup_type=='light'){
                                eval("_cmedia.fn_pausemedia"+cthisId+"()");
                            }
                        }else{
                            if(_cmedia){
                                if(_cmedia.pause!=undefined){
                                    _cmedia.pause();
                                }
                            }
                        }
                    }


                }

                if(_feed_fakePlayer){

                    _feed_fakePlayer.get(0).api_pause_media_visual();
                }


                playing=false;
                cthis.removeClass('is-playing');

            }

            function play_media_visual(margs){

                if(o.design_animateplaypause!='on'){

                    _conPlayPause.children('.playbtn').css({
                        'display' : 'none'
                    });
                    _conPlayPause.children('.pausebtn').css({
                        'display' : 'block'
                    });
                }else{



                    if(o.design_skin=='skin-redlights'||o.design_skin=='skin-steel'){

                        _conPlayPause.children('.playbtn').css('opacity',1);
                        _conPlayPause.children('.playbtn').animate({
                            'opacity':'0'
                        },{
                            queue:false
                            ,duration: 600
                        });




                        _conPlayPause.children('.pausebtn').css({
                            'opacity' : 0
                            ,'visibility': 'visible'
                            ,'display' : 'block'
                        });
                        _conPlayPause.children('.pausebtn').animate({
                            'opacity':'1'
                        },{
                            queue:false
                            ,duration: 600
                        });





                    }else{

                        _conPlayPause.children('.playbtn').stop().fadeOut('fast');
                        _conPlayPause.children('.pausebtn').stop().fadeIn('fast');
                    }
                }




                playing=true;
                cthis.addClass('is-playing');
                cthis.addClass('first-played');


                //console.info(cthis, margs);

                if(action_audio_play){ action_audio_play(cthis);}
                if(action_audio_play2){  action_audio_play2(cthis); }


            }
            function play_media(pargs){
                // console.log('play_media()',pargs,cthis);

//                console.log(dzsap_list);




                var margs = {
                    'api_report_play_media' : true
                }

                if(pargs){
                    margs = $.extend(margs,pargs)
                }

                if(cthis.hasClass('media-setuped')==false){
                    console.info('warning: media not setuped, there might be issues')
                }



                //console.info(o.type);
                if(type!='fake'){

                    //return false;
                }
                for(i=0;i<dzsap_list.length;i++){

//                    console.info(!is_ie8(), dzsap_list[i].get(0), typeof dzsap_list[i].get(0)!="undefined", typeof dzsap_list[i].get(0).api_pause_media!="undefined")
                    if(!is_ie8() && typeof dzsap_list[i].get(0)!="undefined" && typeof dzsap_list[i].get(0).api_pause_media!="undefined" &&dzsap_list[i].get(0)!=cthis.get(0)){

                        //console.info('try to pause', dzsap_list[i].get(0),dzsap_list[i].data('type_audio_stop_buffer_on_unfocus'))
                        if(dzsap_list[i].data('type_audio_stop_buffer_on_unfocus') && dzsap_list[i].data('type_audio_stop_buffer_on_unfocus')=='on'){
                            dzsap_list[i].get(0).api_destroy_for_rebuffer();
                        }else{

                            dzsap_list[i].get(0).api_pause_media({'audioapi_setlasttime':false});
                        }
                    }
                }

                if(destroyed_for_rebuffer){

                    setup_media();


                    if(isInt(playfrom)){
                        seek_to(playfrom);
                    }

                    destroyed_for_rebuffer=false;
                }

                // console.info(o.google_analytics_send_play_event, window._gaq, google_analytics_sent_play_event);
                if(o.google_analytics_send_play_event=='on' && window._gaq && google_analytics_sent_play_event==false){
                    //if(window.console){ console.info( 'sent event'); }
                    window._gaq.push(['_trackEvent', 'ZoomSounds Play', 'Play', 'zoomsounds play - '+cthis.attr('data-source')]);
                    google_analytics_sent_play_event = true;
                }
                console.info(o.google_analytics_send_play_event, window.ga, google_analytics_sent_play_event);

                if(!window.ga){
                    if(window.__gaTracker){
                        window.ga = window.__gaTracker;
                    }
                }
                if(o.google_analytics_send_play_event=='on' && window.ga && google_analytics_sent_play_event==false){
                    if(window.console){ console.info( 'sent event'); }
                    google_analytics_sent_play_event = true;
                    window.ga('send', {
                        hitType: 'event',
                        eventCategory: 'zoomsounds play - '+cthis.attr('data-source'),
                        eventAction: 'play',
                        eventLabel: 'zoomsounds play - '+cthis.attr('data-source')
                    });
                }

                //===media functions

                if(_feed_fakePlayer){

                    //console.info(cthis, _feed_fakePlayer);
                    _feed_fakePlayer.get(0).api_play_media_visual({
                        'api_report_play_media' : false
                    });
                }

                // console.info("TYPE IS ",type, o.fakeplayer);

                if(o.fakeplayer!=null){

                    //console.info(o.fakeplayer);
                    var args = {
                        type : o.type_for_fake_feed
                        ,fakeplayer_is_feeder:'on'
                        ,call_from:'play_media audioplayer'
                    }
                    //console.info(playing, args, o.fakeplayer);
                    o.fakeplayer.get(0).api_change_media(cthis, args);
                    setTimeout(function(){

                        if(o.fakeplayer.get(0) && o.fakeplayer.get(0).api_play_media){

                            o.fakeplayer.get(0).api_play_media();
                        }
                    },100);

                    return;
                }



                if(type=='youtube'){
                    //console.info(_cmedia);
                    if(_cmedia && _cmedia.playVideo){

                        _cmedia.playVideo();
                    }
                }
                if(type=='audio'){


                    //console.log('ceva', type, audioBuffer, is_flashplayer);
                    if(audioBuffer!=null){
                        //console.log(audioBuffer);
                        ///==== on safari we need to wait a little for the sound to load
                        if(audioBuffer!='placeholder'){
                            webaudiosource = audioCtx.createBufferSource();
                            webaudiosource.buffer = audioBuffer;
                            //javascriptNode.connect(audioCtx.destination);
                            webaudiosource.connect(audioCtx.destination);

                            webaudiosource.connect(analyser)
                            //analyser.connect(audioCtx.destination);
                            //console.log("play ctx", lasttime_inseconds);
                            webaudiosource.start(0, lasttime_inseconds);
                        }else{
                            return;
                        }

                    }else{
                        if(is_flashplayer==true && cthis.css('display')!='none'){
                            //alert("_cmedia.fn_playMedia"+cthisId+"()");
                            //console.log(cthis);
                            if(o.settings_backup_type=='light'){
                                eval("_cmedia.fn_playmedia"+cthisId+"()");
                            }

                        }else{
                            if(_cmedia){
                                if(typeof _cmedia.play!= 'undefined'){
                                    _cmedia.play();
                                }
                            }
                        }
                    }

                }



                play_media_visual(margs);




                //console.info(ajax_view_submitted);

                if(ajax_view_submitted=='off'){
                    ajax_submit_views();
                }
            }

            function formatTime(arg) {
                //formats the time
                var s = Math.round(arg);
                var m = 0;
                if (s > 0) {
                    while (s > 59 && s<3000000 && isFinite(s)) {
                        m++;
                        s -= 60;
                    }
                    return String((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s);
                } else {
                    return "00:00";
                }
            }
            return this;
        })
    }

    window.dzsap_init = function(selector, settings) {

        //console.info(selector);
        if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
            var element_count = 0;
            for (e in settings) { element_count++; }
            if(element_count==1){
                settings = undefined;
            }

            $(selector).each(function(){
                var _t = $(this);
                _t.audioplayer(settings)
            });
        }else{
            $(selector).audioplayer(settings);
        }

    };











    //////=======
    // AUDIO GALLERY
    /////========

    $.fn.audiogallery = function(o) {
        var defaults = {
            design_skin: 'skin-default'
            ,cueFirstMedia : 'on'
            ,autoplay: 'off'
            ,autoplayNext: 'on'
            ,design_menu_position: 'bottom'
            ,design_menu_state: 'open' // -- options are "open" or "closed", this sets the initial state of the menu, even if the initial state is "closed", it can still be opened by a button if you set design_menu_show_player_state_button to "on"
            ,design_menu_show_player_state_button: 'off' // -- show a button that allows to hide or show the menu
            ,design_menu_width: 'default'
            ,design_menu_height: '200'
            ,design_menu_space: 'default'
            ,design_menuitem_width: 'default'
            ,design_menuitem_height: 'default'
            ,design_menuitem_space: 'default'
            ,disable_menu_navigation: 'off'
            ,enable_easing: 'off'// -- enable easing for menu animation
            ,settings_ap: {}
            ,transition: 'fade' //fade or direct
            ,embedded: 'off'
            ,settings_mode: 'mode-normal'

        }




        if(typeof o =='undefined'){
            if(typeof $(this).attr('data-options')!='undefined'  && $(this).attr('data-options')!=''){
                var aux = $(this).attr('data-options');
                aux = 'var aux_opts = ' + aux;
                eval(aux);
                o = aux_opts;
            }
        }



        Math.easeIn = function(t, b, c, d) {

            return -c *(t/=d)*(t-2) + b;

        };

        o = $.extend(defaults, o);
        this.each(function() {

            //console.info("INITED");
            var cthis = $(this);
            var cchildren = cthis.children()
                ,cthisId = 'ag1'
                ;
            var currNr = -1 // -- the current player that is playing
                ,currNr_2 = -1
                ,lastCurrNr = 0
                ,tempNr = 0
                ;
            var busy = true;
            var i = 0;
            var ww
                , wh
                , tw
                , th
                ,n_maindim // -- the navmain main dimension for scrolling
                ,nc_maindim
                ,sw = 0// -- scrubbar width
                ,sh
                ,spos = 0 // --  scrubbar prog pos
                ;
            var _sliderMain
                ,_sliderClipper
                ,_navMain
                ,_navClipper
                ,_cache
                ;
            var busy = false
                ,playing = false
                ,muted = false
                ,loaded=false
                ,first=true
                ,skin_redlight_give_controls_right_to_all_players  = false// -- if the mode is mode-showall and the skin of the player is redlights, then make all players with controls right
                ;
            var time_total = 0
                ,time_curr=0
                ;
            var last_vol = 1
                ,last_vol_before_mute = 1
                ;
            var inter_check
                ,inter_checkReady
                ;
            var skin_minimal_canvasplay
                ,skin_minimal_canvaspause
                ;
            var is_flashplayer = false
                ;
            var data_source
                ;

            var aux_error = 20;//==erroring for the menu scroll

            var res_thumbh = false;

            var str_ie8 = '';

            var arr_menuitems = [];

            var str_alertBeforeRate = 'You need to comment or rate before downloading.';



            var duration_viy = 20
                ;

            var target_viy = 0
                ;

            var begin_viy = 0
                ;

            var finish_viy = 0
                ;

            var change_viy = 0
                ;


            if(window.dzsap_settings && typeof( window.dzsap_settings.str_alertBeforeRate)!='undefined'){
                str_alertBeforeRate = window.dzsap_settings.str_alertBeforeRate;
            }

            cthis.get(0).currNr_2 = -1; // -- we use this as backup currNR for mode-showall ( hack )

            init();
            function init(){




                if(o.design_menu_width=='default'){
                    o.design_menu_width = '100%';
                }
                if(o.design_menu_height=='default'){
                    o.design_menu_height = '200';
                }



                cthis.addClass(o.settings_mode);


                cthis.append('<div class="slider-main"><div class="slider-clipper"></div></div>');

                cthis.addClass('menu-position-'+ o.design_menu_position);

                _sliderMain = cthis.find('.slider-main').eq(0);


                var auxlen = cthis.find('.items').children().length;

                // --- if there is a single audio player in the gallery - theres no point of a menu
                if(auxlen==0 || auxlen==1){
                    o.design_menu_position = 'none';
                    o.settings_ap.disable_player_navigation = 'on';
                }

                if(o.design_menu_position=='top'){
                    _sliderMain.before('<div class="nav-main"><div class="nav-clipper"></div></div>');
                }
                if(o.design_menu_position=='bottom'){
                    _sliderMain.after('<div class="nav-main"><div class="nav-clipper"></div></div>');
                }


                _sliderClipper = cthis.find('.slider-clipper').eq(0);
                _navMain = cthis.find('.nav-main').eq(0);
                _navClipper = cthis.find('.nav-clipper').eq(0);


                reinit();

                //console.info(arr_menuitems);

                for(i=0;i<arr_menuitems.length;i++){
                    var extra_class = '';
                    if(arr_menuitems[i] && arr_menuitems[i].indexOf('<div class="menu-item-thumb-con"><div class="menu-item-thumb" style="')==-1){
                        extra_class += ' no-thumb';
                    }
                    _navClipper.append('<div class="menu-item'+extra_class+'">'+arr_menuitems[i]+'</div>')
                }

                if(o.disable_menu_navigation=='on'){
                    _navMain.hide();
                }

//                console.info(o.design_menu_height, o.design_menu_state);
                _navMain.css({
                    'height' : o.design_menu_height
                })

                if(is_ios() || is_android()){
                    _navMain.css({
                        'overflow':'auto'
                    })
                }

                if(o.design_menu_state=='closed'){

                    _navMain.css({
                        'height' : 0
                    })
                }





                if(cthis.css('opacity')==0){
                    cthis.animate({
                        'opacity' : 1
                    }, 1000);
                }

                $(window).bind('resize', handleResize);
                handleResize();
                setTimeout(handleResize, 1000);



                cthis.get(0).api_skin_redlights_give_controls_right_to_all = function(){

                    // -- void f()

                    skin_redlight_give_controls_right_to_all_players = true;
                }

                if(o.settings_mode=='mode-normal'){

                    goto_item(tempNr);
                }else{

                    _sliderClipper.children().each(function(){
                        var _t = $(this);

                        //console.log(_t);

                        var ind = _t.parent().children('.audioplayer,.audioplayer-tobe').index(_t);

                        if(_t.hasClass('audioplayer-tobe')){
                            //console.info(o.settings_ap);
                            o.settings_ap.parentgallery = cthis;
                            o.settings_ap.action_audio_play = mode_showall_listen_for_play;
                            _t.audioplayer(o.settings_ap);

                            //console.info(ind);

                            ind = String(ind+1);

                            if(ind.length<2){
                                ind='0'+ind;
                            }

                            _t.before('<div class="number-wrapper"><span class="the-number">'+ind+'</span></div>')
                            _t.after('<div class="clear for-number-wrapper"></div>')
                        }

                    })
                    //console.info('dada2', skin_redlight_give_controls_right_to_all_players);


                    if(o.settings_mode=='mode-showall'){

                        if(skin_redlight_give_controls_right_to_all_players){

                            _sliderClipper.children('.audioplayer').each(function(){

                                var _t = $(this);

                                //console.info(_t);

                                if(_t.find('.ap-controls-right').eq(0).prev().hasClass('controls-right')==false){
                                    _t.find('.ap-controls-right').eq(0).before('<div class="controls-right"> </div>');
                                }
                            });
                        }
                    }
                }


                _navClipper.children().bind('click', click_menuitem);
                cthis.find('.download-after-rate').bind('click', click_downloadAfterRate);

                cthis.get(0).api_goto_next = goto_next;
                cthis.get(0).api_goto_prev = goto_prev;
                cthis.get(0).api_goto_item = goto_item;
                cthis.get(0).api_handle_end = handle_end;
                cthis.get(0).api_toggle_menu_state = toggle_menu_state;
                cthis.get(0).api_handleResize = handleResize;
                cthis.get(0).api_player_commentSubmitted = player_commentSubmitted;
                cthis.get(0).api_player_rateSubmitted = player_rateSubmitted;
                cthis.get(0).api_reinit = reinit;
                cthis.get(0).api_play_curr_media = play_curr_media;




                setTimeout(init_loaded, 700);



                if(o.enable_easing=='on'){

                    handle_frame();
                }
                //console.info(cthis);

                cthis.addClass('dzsag-inited');

                cthis.addClass('transition-'+ o.transition);
            }


            function reinit(){



                //console.info('reinit()', cthis.find('.items').eq(0).children(), cthis.find('.items').eq(0).children().length);

                var auxlen = cthis.find('.items').eq(0).children().length;

                for(i=0;i<auxlen;i++){
                    var _c = cthis.find('.items').children().eq(0);

                    //console.info(_c);
                    arr_menuitems.push(_c.find('.menu-description').html())
                    //cthis.find('.items').children().eq(0).find('.menu-description').remove();
                    _sliderClipper.append(_c);
                }
            }

            function init_loaded(){

                cthis.addClass('dzsag-loaded');
            }
            function click_downloadAfterRate(){
                var _t = $(this);


                if(_t.hasClass('active')==false){
                    alert(str_alertBeforeRate)
                    return false;
                }


            }


            function play_curr_media(){

                if(typeof(_sliderClipper.children().eq(currNr).get(0))!='undefined'){
                    if(typeof(_sliderClipper.children().eq(currNr).get(0).api_play_media)!='undefined'){
                        _sliderClipper.children().eq(currNr).get(0).api_play_media();
                    }

                }
            }

            function mode_showall_listen_for_play(arg){

                //console.info('mode_showall_listen_for_play()',currNr, arg);

                if(o.settings_mode=='mode-showall'){

                    var ind = _sliderClipper.children('.audioplayer,.audioplayer-tobe').index(arg);
                    //console.log(ind);
                    currNr = ind;
                    cthis.get(0).currNr_2 = ind;
                    //console.info(cthis,currNr)
                }
                //console.info('mode_showall_listen_for_play()',currNr,this, cthis.get(0).currNr_2);
            }

            function handle_frame(){


                if(isNaN(target_viy)){
                    target_viy=0;
                }

                if(duration_viy===0){
                    requestAnimFrame(handle_frame);
                    return false;
                }

                begin_viy = target_viy;
                change_viy = finish_viy - begin_viy;


                //console.info('handle_frame', finish_viy, duration_viy, target_viy);

                //console.log(duration_viy);
                target_viy = Number(Math.easeIn(1, begin_viy, change_viy, duration_viy).toFixed(4));;


                if(is_ios()==false && is_android()==false){
                    _navClipper.css({
                        'transform': 'translateY('+target_viy+'px)'
                    });
                }


                //console.info(_blackOverlay,target_bo);;

                requestAnimFrame(handle_frame);
            }


            function toggle_menu_state(){
                if(_navMain.height()==0){
                    _navMain.css({
                        'height' : o.design_menu_height
                    })
                }else{

                    _navMain.css({
                        'height' : 0
                    })
                }
                setTimeout(function(){
                    handleResize();
                }, 400); // -- animation delay
            }
            function handle_end(){
                goto_next();
            }

            function player_commentSubmitted(){
                _navClipper.children('.menu-item').eq(currNr).find('.download-after-rate').addClass('active');

            }
            function player_rateSubmitted(){
                _navClipper.children('.menu-item').eq(currNr).find('.download-after-rate').addClass('active');
            }

            function calculateDims(){
//                console.info('calculateDims');
                _sliderClipper.css('height', _sliderClipper.children().eq(currNr).height());
//                _navMain.show();
                n_maindim = _navMain.height();
                nc_maindim = _navClipper.outerHeight();

//                return;
//                console.info(nc_maindim, n_maindim)
                if(nc_maindim > n_maindim && n_maindim>0){
                    _navMain.unbind('mousemove', navMain_mousemove);
                    _navMain.bind('mousemove', navMain_mousemove);
                }else{
                    _navMain.unbind('mousemove', navMain_mousemove);
                }

                if(o.embedded=='on'){
                    //console.info(window.frameElement)
                    if(window.frameElement){
                        window.frameElement.height = cthis.height();
                        //console.info(window.frameElement.height, cthis.outerHeight())
                    }
                }
            }
            function navMain_mousemove(e){
                var _t = $(this);
                var mx = e.pageX - _t.offset().left;
                var my = e.pageY - _t.offset().top;

//                console.info(nc_maindim, n_maindim, nc_maindim <= n_maindim);
                if(nc_maindim <= n_maindim){
                    return;
                }

                n_maindim = _navMain.outerHeight();

                //console.log(mx);

                var vix = 0;
                var viy = 0;

                viy = (my / n_maindim) * -(nc_maindim - n_maindim+10 + aux_error*2) + aux_error;
                //console.log(viy);
                if(viy>0){
                    viy = 0;
                }
                if(viy < -(nc_maindim - n_maindim+10)){
                    viy = -(nc_maindim - n_maindim+10);
                }

                finish_viy = viy;

                //console.log(viy, nc_maindim, n_maindim, (my / n_maindim))

                if(is_ios()==false && is_android()==false){
                    if(o.enable_easing!='on'){
                        _navClipper.css({
                            'transform': 'translateY('+finish_viy+'px)'
                        });
                    }
                }


            }
            function click_menuitem(e){
                var _t = $(this);
                var ind = _t.parent().children().index(_t);

                goto_item(ind);
            }

            function handleResize(){

                setTimeout(function(){
                    //console.info(_sliderClipper.children().eq(currNr), _sliderClipper.children().eq(currNr).height())
                    _sliderClipper.css('height', _sliderClipper.children().eq(currNr).height());
                },500);

                calculateDims();

            }

            function transition_end(){

                //console.info(_sliderClipper.children().eq(lastCurrNr));

                //_sliderClipper.children().eq(lastCurrNr).hide();

                _sliderClipper.children().eq(lastCurrNr).removeClass('transitioning-out');
                _sliderClipper.children().eq(lastCurrNr).removeClass('active');

                _sliderClipper.children().eq(currNr).removeClass('transitioning-in');
                lastCurrNr = currNr;
                busy= false;
            }
            function transition_bg_end(){
                cthis.parent().children('.the-bg').eq(0).remove();
                busy= false;
            }
            function goto_prev(){
                tempNr = currNr;
                tempNr--;
                if(tempNr<0){
                    tempNr = _sliderClipper.children().length-1;
                }
                goto_item(tempNr);
            }
            function goto_next(){
                //console.info('goto_next()', currNr,cthis.get(0).currNr_2);
                tempNr = currNr;

                if(o.settings_mode=='mode-showall'){
                    tempNr = cthis.get(0).currNr_2;
                }
                tempNr++;
                if(tempNr>=_sliderClipper.children().length){
                    tempNr = 0;
                }
                goto_item(tempNr);
            }
            function goto_item(arg){

                //console.info('goto_item()', arg,busy);

                if(busy==true){
                    return;
                }

                if(arg=="last"){
                    arg=_sliderClipper.children().length-1;
                }

                //console.info('goto_item()', arg,busy, arg=="last");



                if(currNr==arg){

                    if(_sliderClipper && _sliderClipper.children().eq(currNr).get(0) && _sliderClipper.children().eq(currNr).get(0).api_play_media){
                        _sliderClipper.children().eq(currNr).get(0).api_play_media();
                    }
                    return;
                }

                _cache = _sliderClipper.children('.audioplayer,.audioplayer-tobe').eq(arg);

                if(currNr>-1){
                    if(typeof(_sliderClipper.children().eq(currNr).get(0))!='undefined'){
                        if(typeof(_sliderClipper.children().eq(currNr).get(0).api_pause_media)!='undefined'){
                            _sliderClipper.children().eq(currNr).get(0).api_pause_media();
                        }

                    }


                    if(o.settings_mode!='mode-showall'){

                        //console.info(o.transition);
                        if(o.transition=='fade'){
                            _sliderClipper.children().eq(currNr).removeClass('active');
                            _navClipper.children().eq(currNr).removeClass('active');
                            _sliderClipper.children().eq(currNr).addClass('transitioning-out');
                            _sliderClipper.children().eq(currNr).animate({

                            },{queue:false });


                            setTimeout(transition_end, 300);

                            busy=true;
                        }
                        if(o.transition=='direct'){
                            transition_end();
                        }
                    }
                }


                //============ setting settings
                if(o.settings_ap.design_skin == 'sameasgallery'){
                    o.settings_ap.design_skin = o.design_skin;
                }

                //===if this is  the first audio
                if(currNr == -1 && o.autoplay=='on'){
                    o.settings_ap.autoplay = 'on';
                }

                //===if this is not the first audio
                if(currNr > -1 && o.autoplayNext=='on'){
                    o.settings_ap.autoplay = 'on';
                }
                o.settings_ap.parentgallery = cthis;

                o.settings_ap.design_menu_show_player_state_button = o.design_menu_show_player_state_button;
                o.settings_ap.cue = 'on';
                if(first==true){
                    if(o.cueFirstMedia=='off'){
                        o.settings_ap.cue = 'off';
                    }

                    first = false;
                }

                //============ setting settings END


                if(_cache.hasClass('audioplayer-tobe')){
                    _cache.audioplayer(o.settings_ap);
                }

                if(o.autoplayNext=='on'){
                    if(o.settings_mode=='mode-showall'){
                        currNr = cthis.get(0).currNr_2;
                    }
                    if(currNr>-1 && _cache.get(0) && _cache.get(0).api_play){
                        _cache.get(0).api_play();
                    }
                }



                if(o.settings_mode!='mode-showall') {
                    if (o.transition == 'fade') {
                        _cache.css({
                        })
                        _cache.animate({}, {queue: false})

                    }
                    if (o.transition == 'direct') {

                    }

                    _cache.addClass('transitioning-in');
                }

                _cache.addClass('active');
                _navClipper.children().eq(arg).addClass('active');


                if(_cache.attr("data-bgimage")!=undefined && cthis.parent().hasClass('ap-wrapper') && cthis.parent().children('.the-bg').length>0){
                    cthis.parent().children('.the-bg').eq(0).after('<div class="the-bg" style="background-image: url('+_cache.attr("data-bgimage")+');"></div>')
                    cthis.parent().children('.the-bg').eq(0).css({
                        'opacity':1
                    })


                    cthis.parent().children('.the-bg').eq(1).css({
                        'opacity':0
                    })
                    cthis.parent().children('.the-bg').eq(1).animate({
                        'opacity':1
                    },{queue:false, duration:1000, complete:transition_bg_end, step:function(){
                        busy=true;
                    } })
                    busy=true;
                }


                //console.info('set currNr', currNr, o.settings_mode);

                if(o.settings_mode!='mode-showall'){

                    currNr = arg;
                }

                calculateDims();
            }
        });
    }

    window.dzsag_init = function(selector, settings) {


        if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
            var element_count = 0;
            for (e in settings) { element_count++; }
            if(element_count==1){
                settings = undefined;
            }

            $(selector).each(function(){
                var _t = $(this);
                _t.audiogallery(settings)
            });
        }else{
            $(selector).audiogallery(settings);
        }
    };

})(jQuery);



jQuery(document).ready(function($){


    //console.info('song changers -> ', $('.audioplayer-song-changer'));


    $('audio.zoomsounds-from-audio').each(function(){
        var _t = $(this);
        //console.info(_t);

        _t.after('<div class="audioplayer-tobe auto-init skin-silver" data-source="'+_t.attr('src')+'"></div>');

        _t.remove();
    })

    //console.info($('.zoomvideogallery.auto-init'));
    dzsap_init('.audioplayer-tobe.auto-init', {init_each: true});
    dzsag_init('.audiogallery.auto-init', {init_each: true});


    $(document).delegate('.audioplayer-song-changer','click', function(){
        var _t = $(this);


        //console.info(_t);
        var _c = $(_t.attr('data-target')).eq(0);
        //console.info(_t, _t.attr('data-target'), _c, _c.get(0));



        if(_c && _c.get(0) && _c.get(0).api_change_media){

            _c.get(0).api_change_media(_t);
        }

        return false;
    })

    $(document).delegate('.dzsap-sticktobottom .icon-hide','click', function(){
        var _t = $(this);

        $('.dzsap-sticktobottom .dzsap_footer').get(0).api_pause_media();

        _t.parent().parent().removeClass('audioplayer-loaded');
        _t.parent().parent().addClass('audioplayer-was-loaded');

        return false;
    })
    $(document).delegate('.dzsap-sticktobottom .icon-show','click', function(){
        var _t = $(this);


        _t.parent().parent().addClass('audioplayer-loaded');
        _t.parent().parent().removeClass('audioplayer-was-loaded');

        return false;
    })

    if($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver').length>0){
        setInterval(function(){

            //console.info($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver > .audioplayer').eq(0).hasClass('dzsap-loaded'));
            if($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver > .audioplayer').eq(0).hasClass('dzsap-loaded')){
                $('.dzsap-sticktobottom-placeholder').eq(0).addClass('active');

                if($('.dzsap-sticktobottom').hasClass('audioplayer-was-loaded')==false){

                    $('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-silver').addClass('audioplayer-loaded')
                }
            }
        },1000);
    }
    if($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave').length>0){
        setInterval(function(){

            if($('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave > .audioplayer').eq(0).hasClass('dzsap-loaded')){
                $('.dzsap-sticktobottom-placeholder').eq(0).addClass('active');

                if($('.dzsap-sticktobottom').hasClass('audioplayer-was-loaded')==false){

                    $('.dzsap-sticktobottom.dzsap-sticktobottom-for-skin-wave').addClass('audioplayer-loaded')
                }
            }



        },1000);
    }

});



function is_ios() {
    return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)
    );
}

function is_android() {
    //return false;
    //return true;
    var ua = navigator.userAgent.toLowerCase();
    return (ua.indexOf("android") > -1);
}

function is_ie() {
    if (navigator.appVersion.indexOf("MSIE") != -1) {
        return true;
    }
    ;
    return false;
}
;
function is_firefox() {
    if (navigator.userAgent.indexOf("Firefox") != -1) {
        return true;
    }
    ;
    return false;
}
;
function is_opera() {
    if (navigator.userAgent.indexOf("Opera") != -1) {
        return true;
    }
    ;
    return false;
}
;
function is_chrome() {
    return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}
;

function is_safari() {
    return Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0;
}

function version_ie() {
    return parseFloat(navigator.appVersion.split("MSIE")[1]);
}
;
function version_firefox() {
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var aversion = new Number(RegExp.$1);
        return(aversion);
    }
    ;
}
;
function version_opera() {
    if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var aversion = new Number(RegExp.$1);
        return(aversion);
    }
    ;
}
;
function is_ie8() {
    if (is_ie() && version_ie() < 9) {
        return true;
    }
    return false;
}
function is_ie9() {
    if (is_ie() && version_ie() == 9) {
        return true;
    }
    return false;
}
function can_play_mp3(){
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
function can_canvas(){
    // check if we have canvas support
    var oCanvas = document.createElement("canvas");
    if (oCanvas.getContext("2d")) {
        return true;
    }
    return false;
}
function onYouTubeIframeAPIReady() {


    for(i=0;i<dzsap_list.length;i++){
        //console.log(dzsap_list[i].get(0).fn_yt_ready);
        if(dzsap_list[i].get(0)!=undefined && typeof dzsap_list[i].get(0).fn_yt_ready!='undefined'){
            dzsap_list[i].get(0).fn_yt_ready();
        }
    }
}



jQuery.fn.textWidth = function(){
    var _t = jQuery(this);
    var html_org = _t.html();
    if(_t[0].nodeName=='INPUT'){
        html_org = _t.val();
    }
    var html_calcS = '<span class="forcalc">' + html_org + '</span>';
    jQuery('body').append(html_calcS);
    var _lastspan = jQuery('span.forcalc').last();
    //console.log(_lastspan, html_calc);
    _lastspan.css({
        'font-size' : _t.css('font-size')
        ,'font-family' : _t.css('font-family')
    })
    var width =_lastspan.width() ;
    //_t.html(html_org);
    _lastspan.remove();
    return width;
};

window.requestAnimFrame = (function() {
    //console.log(callback);
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(/* function */callback, /* DOMElement */element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();






var MD5 = function (string) {
    //==== snippet from http://css-tricks.com/ - author unknown
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }

    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }

    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }

    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };

    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };

    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };

    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";

        for (var n = 0; n < string.length; n++) {

            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }

        return utftext;
    };

    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;

    string = Utf8Encode(string);

    x = ConvertToWordArray(string);

    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;

    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }

    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);

    return temp.toLowerCase();
};



function formatTime(arg) {
    //formats the time
    var s = Math.round(arg);
    var m = 0;
    if (s > 0) {
        while (s > 59) {
            m++;
            s -= 60;
        }
        return String((m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s);
    } else {
        return "00:00";
    }
}