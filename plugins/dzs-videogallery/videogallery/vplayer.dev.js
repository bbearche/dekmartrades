/*
 * Author: Digital Zoom Studio
 * Website: http://digitalzoomstudio.net/
 * Portfolio: http://codecanyon.net/user/ZoomIt/portfolio?ref=ZoomIt
 * This is not free software.
 * Video Gallery Dev
 * Version: 9.64
 */

"use strict";

var vgsettings = {
    protocol: 'https'
    , vimeoprotocol: 'https:'
};

var youtubeid_array = []; // -- an array to hold inited youtube videos
var dzsvp_players_arr = []; // -- an array to hold video players
var dzsvp_yt_iframe_settoload = false;
var _global_youtubeIframeAPIReady  = false;


window.backup_onYouTubePlayerReady = null;


window.dzsvg_self_options = {};
window.dzsvp_self_options = {};

//VIDEO GALLERY
(function($) {



    Math.easeIn = function(t, b, c, d) {

        return -c *(t/=d)*(t-2) + b;

    };



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
//        console.info(_t, _t.children(argfind).length, argfind);
        if(_t.children(argfind).length<1){
            _t.append(arg);
            return true;
        }else{
            return false;
        }
    };
    $.fn.vGallery = function(o) {

        var defaults = {
            totalWidth: ""
            ,totalHeight: ""
            ,init_on: "init"
            ,totalHeightDifferenceOnParent: ""
            ,forceVideoWidth: ''
            ,forceVideoHeight: ''
            ,menuSpace: 0 //deprecated replaced by nav_space
            ,randomise: "off"
            ,autoplay: "off"
            ,autoplayNext: "on"
            ,autoplay_ad: "on"
            ,playorder: "normal" // -- normal or reverse
            ,menu_position: 'right'
            ,menuitem_width: "200"
            ,menuitem_height: "71"
            ,menuitem_space: "0"
            ,nav_type: "thumbs"//thumbs or thumbsandarrows or scroller
            ,nav_space: '0'
            ,transition_type: "slideup"
            ,design_skin: 'skin-default'
            ,videoplayersettings: {}
            ,embedCode: ''
            ,shareCode: ''
            ,php_media_data_retriever: '' // -- this can help get the video meta data for youtube and vimeo
            ,cueFirstVideo: 'on'
            ,design_navigationUseEasing: 'off'
            ,logo: ''
            ,logoLink: ''
            ,settings_enable_linking : 'off' // -- enable deeplinking on video gallery items
            ,settings_mode: 'normal' /// -- normal / wall / rotator / rotator3d / slider
            ,settings_disableVideo: 'off' //disable the video area
            ,settings_enableHistory : 'off' // html5 history api for link type items
            ,settings_enableHistory_fornormalitems : 'off' // html5 history api for normal items
            ,settings_ajax_extraDivs : '' // extra divs to pull in the ajax request
            ,startItem:'default'
            ,settings_separation_mode: 'normal' // === normal ( no pagination ) or pages or scroll or button
            ,settings_separation_pages: []
            ,settings_separation_pages_number: '5' //=== the number of items per 'page'
            ,nav_type_outer_grid: 'dzs-layout--4-cols' // -- four-per-row
            ,nav_type_outer_max_height: '' // -- enable a scroller if menu height bigger then max_height
            ,settings_menu_overlay: 'off' // -- an overlay to appear over the menu
            ,search_field: 'off' // an overlay to appear over the menu
            ,search_field_con: null // an overlay to appear over the menu
            ,disable_videoTitle: "off" // -- do not auto set the video title
            ,settings_trigger_resize: '0' // -- a force trigger resize every x ms
            ,settings_go_to_next_after_inactivity: '0' // -- go to next track if no action
            ,modewall_bigwidth: '800' // -- the mode wall video ( when opened ) dimensions
            ,modewall_bigheight: '500'
            ,settings_secondCon: null
            ,settings_outerNav: null
            ,extra_class_slider_con: ''
            ,menu_description_format: '' // -- use something like "{{number}}{{menuimage}}{{title}}{{desc}}"
            ,masonry_options:{}
        };



        if(typeof o =='undefined'){
            if(typeof $(this).attr('data-options')!='undefined' && $(this).attr('data-options')!=''){
                var aux = $(this).attr('data-options');
                aux = 'window.dzsvg_self_options = ' + aux;
                eval(aux);
                o = $.extend({},window.dzsvg_self_options);
                window.dzsvg_self_options = $.extend({},{});
            }
        }

        o = $.extend(defaults, o);

        this.each(function() {

            var cgallery = $(this)
                ,cid = ''
                ;
            var nrChildren = 0;
            var _sliderMain
                , _sliderCon
                , _navMain
                , _navCon
                , _adSpace
                , _mainNavigation
                , _searchField
                ;
            //gallery dimensions
            var videoWidth
                , videoHeight
                , totalWidth
                , totalHeight
                , last_totalWidth = 0 // -- so we can compare to the last values
                , last_totalHeight = 0
                , navWidth = 0 // the _navCon width
                , navHeight = 0
                , ww
                , wh
                ,last_height_for_videoheight = 0 // -- last responsive_ratio height known
                ;

            var inter_start_the_transition = null
                ,inter_mouse_move = null
                ,inter_relayout_masonry = null
                ,inter_try_to_init_scroller = null
                ;

            var nav_main_totalsize = 0 // the total size of the thumbs
                , nav_main_consize = 0 // the total size of the container
                , nav_page_size = 0 // the total size of a page of thumbs
                , nav_max_pages = 0 // max number of pages
                , nav_pages_visible = 0 // max number of pages
                , nav_excess_thumbs = 0 // the total size of the last page of thumbs
                , nav_arrow_size = 40
                ;
            var thumbs_thumb_var = 0
                , thumbs_thumb_var_sec = 0
                , thumbs_total_var = 0
                , thumbs_total_var_sec = 0
                , thumbs_css_main = "top"
                ,thumbs_per_page = 0
                ,ultra_responsive_last_layout = 'normal'
                ;

            var nav_thumbs_dir_ver = false
                ,nav_thumbs_dir_hor = false
                ;


            var backgroundY;
            var used = new Array();
            var content = new Array();
            var currNr = -1
                , nextNr = -1
                , prevNr = -1
                , currPage = 0
                , last_arg = 0
                ;
            var currVideo;
            var arr_inlinecontents = [];

            var _rparent
                , _con
                , ccon
                , currScale = 1
                ,initial_h = -1
                ;
            var conw = 0;
            var conh = 0;

            var wpos = 0
                , hpos = 0
                , nav_max_pages = 0
                ,navMain_mousex = 0
                ,navMain_mousey = 0
                ;
            var lastIndex = 99;

            var busy_transition = false
                ,sw_transition_started = false
                ,busy_ajax = false
                ,loaded = false//===gallery loaded sw, when dimensions are set, will take a while if wall
                ;
            var firsttime = true; // firsttime changed item
            var embed_opened = false
                , share_opened = false
                , ad_playing = false
                , search_added = false
                , first_played = false
                ;


            var i = 0;

            var aux = 0
                , aux1 = 0
                ;

            var down_x = 0
                , up_x = 0;


            var menuitem_width = 0
                ,menuitem_height = 0
                ,menuitem_space = 0;

            var menu_position = 'right';

            var settings_separation_nr_pages = 0;
            var ind_ajaxPage = 0;




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



            if(o.nav_type=='outer'){
                if(o.forceVideoHeight==''){
                    o.forceVideoHeight = '300';
                }
            }




            if(o.settings_mode=='slider'){

                o.menu_position = 'none';
                o.nav_type = 'none';
                // o.videoplayersettings.responsive_ratio = 'default';

            }

//            console.info(o.menuitem_width);
            if(isNaN(parseInt(o.menuitem_width, 10))==false && String(o.menuitem_width).indexOf('%')==-1){
                o.menuitem_width = parseInt(o.menuitem_width, 10);
            }
//            console.info(o.menuitem_width);

            o.menuitem_height = parseInt(o.menuitem_height, 10);
            o.settings_go_to_next_after_inactivity = parseInt(o.settings_go_to_next_after_inactivity, 10);
            //o.menuitem_space = ;

            if(isNaN(Number(o.menuitem_space))==false){
                menuitem_space = Number(o.menuitem_space);
                //console.log('ceva');
            }

            if(o.startItem!='default'){
                o.startItem = parseInt(o.startItem, 10);
            }

            o.settings_separation_pages_number = parseInt(o.settings_separation_pages_number, 10);
            o.settings_trigger_resize = parseInt(o.settings_trigger_resize, 10);

            menu_position = o.menu_position;

            if(!isNaN(parseInt(o.forceVideoWidth,10))){
                o.forceVideoWidth = parseInt(o.forceVideoWidth,10);
            }
            if(!isNaN(parseInt(o.forceVideoHeight,10))){
                o.forceVideoHeight = parseInt(o.forceVideoHeight,10);
            }

            nrChildren = cgallery.children('.vplayer,.vplayer-tobe').length;


            var masonry_options_default = {
                columnWidth: 1
                ,containerStyle: {position: 'relative'}
                ,isFitWidth: false
                ,isAnimated:true
            };

            //console.info(o.masonry_options);

            o.masonry_options = $.extend(masonry_options_default, o.masonry_options);


            if(can_history_api()==false){
                o.settings_enable_linking = 'off';
            }



            if(o.init_on=='init'){

                init();
            }
            if(o.init_on=='scroll'){


                $(window).on('scroll',handle_scroll);
                handle_scroll();
            }

            var _gbuttons = cgallery.children('.gallery-buttons');

            function init(){


                // console.info('init() -');




                ccon = cgallery.parent();
                _rparent = cgallery.parent();




                //console.log($.fn.urlParam(window.location.href, 'dzsvgpage'));


                // ==== separation - PAGES
                var elimi = 0;
                //console.info(o.settings_separation_mode)
                if(o.settings_separation_mode=='pages'){
                    //var dzsvg_page = $.fn.urlParam(window.location.href, 'dzsvgpage');
                    var dzsvg_page = get_query_arg(window.location.href, 'dzsvgpage');
                    //console.info(dzsvg_page, o.settings_separation_pages_number, nrChildren);

                    if(typeof dzsvg_page== "undefined"){
                        dzsvg_page=1;
                    }
                    dzsvg_page = parseInt(dzsvg_page,10);


                    if(dzsvg_page == 0 || isNaN(dzsvg_page)){
                        dzsvg_page = 1;
                    }

                    if(dzsvg_page > 0 && o.settings_separation_pages_number < nrChildren){
                        //console.log(cgallery.children());
                        var aux;
                        if(o.settings_separation_pages_number * dzsvg_page <= nrChildren){
                            for(elimi = o.settings_separation_pages_number * dzsvg_page - 1; elimi >= o.settings_separation_pages_number * (dzsvg_page-1);elimi--){
                                cgallery.children().eq(elimi).addClass('from-pagination-do-not-eliminate');
                            }
                        }else{
                            for(elimi = nrChildren - 1; elimi >= nrChildren - o.settings_separation_pages_number;elimi--){
                                cgallery.children().eq(elimi).addClass('from-pagination-do-not-eliminate');
                            }
                        }

                        cgallery.children().each(function(){
                            var _t = $(this);
                            if(!_t.hasClass('from-pagination-do-not-eliminate')){
                                _t.remove();
                            }
                        })

                        var str_pagination = '<div class="con-dzsvg-pagination">';
                        settings_separation_nr_pages = Math.ceil(nrChildren / o.settings_separation_pages_number);
                        //console.info(settings_separation_nr_pages)
                        nrChildren = cgallery.children().length;

                        for(i=0;i<settings_separation_nr_pages;i++){
                            var str_active = '';
                            if((i+1)==dzsvg_page){
                                str_active = ' active';
                            }
                            str_pagination+='<a class="pagination-number '+str_active+'" href="'+add_query_arg(window.location.href, 'dzsvgpage', (i+1))+'">'+(i+1)+'</a>'
                        }

                        str_pagination+='</div>';
                        cgallery.after(str_pagination);

                    }
                }



                if(is_touch_device()){
                    cgallery.addClass('is-touch');
                }

                cgallery.children().each(function(){
                    var _t = $(this);

                    //console.info(_t);

                    if (_t.attr('data-type')=='youtube' && _t.attr('data-thumb')==undefined){
                        _t.attr('data-thumb', '//img.youtube.com/vi/' + _t.attr('data-src') + '/0.jpg');
                    }

                    if (_t.attr('data-previewimg') == undefined) {
                        if (_t.attr('data-thumb') != undefined){
                            _t.attr('data-previewimg', _t.attr('data-thumb'));
                        }

                        if (_t.attr('data-img') != undefined){
                            _t.attr('data-previewimg', _t.attr('data-img'));
                        }
                    }
                    if (_t.attr('data-src') == undefined) {

                        if (_t.attr('data-source') != undefined){
                            _t.attr('data-src', _t.attr('data-source'));
                        }
                    }
                    if(o.settings_mode=='wall'){

                        if (_t.find('.videoDescription').length == 0) {
                            if (_t.find('.menuDescription').length > 0) {
                                _t.append('<div class="videoDescription">'+_t.find('.menuDescription').html()+'</div>')
                            }
                        }
                    }
                });

                if(o.settings_mode=='wall' || o.settings_mode=='videowall'){
                    o.design_shadow = 'off';
                    o.logo = '';

                }

                if(_rparent.hasClass("skin-laptop")){
                    o.totalWidth = '62%';
                    cgallery.height(_rparent.height() * 0.686)
                    o.totalHeightDifferenceOnParent = '-0.30';
                }


                //==some sanitizing of the videoWidth and videoHeight parameters








                if (o.totalWidth=='' || o.totalWidth == 0) {
                    totalWidth = cgallery.width();
                } else {
                    totalWidth = o.totalWidth;
                    cgallery.css('width', totalWidth);
                }

                if (o.totalHeight=='' || o.totalHeight == 0) {
                    totalHeight = cgallery.height();
                } else {
                    totalHeight = o.totalHeight;
                }
                //console.info(totalWidth);

                //=== some sanitizing
                if(isNaN(totalWidth)){
                    totalWidth = 800;
                }

                if(isNaN(totalHeight)){
                    totalHeight = 400;
                }


                cid = cgallery.attr('id');
                if(typeof cid=='undefined' || cid==''){
                    var auxnr = 0;
                    var temps = 'dzs-video'+auxnr;

                    while($('#'+temps).length>0){
                        auxnr++;
                        temps = 'dzs-video'+auxnr;
                    }

                    cid = temps;
                    cgallery.attr('id', cid);
                }

                //console.info(totalWidth);


                cgallery.get(0).var_scale = 1;

                backgroundY = o.backgroundY;

                cgallery.addClass('mode-' + o.settings_mode);
                cgallery.addClass('nav-' + o.nav_type);

                var mainClass = '';

                if (typeof(cgallery.attr('class')) == 'string') {
                    mainClass = cgallery.attr('class');
                } else {
                    mainClass = cgallery.get(0).className;
                }
                if (mainClass.indexOf('skin-') == -1) {
                    cgallery.addClass(o.design_skin);
                }

                if (o.videoplayersettings.design_skin == 'sameasgallery') {
                    o.videoplayersettings.design_skin = o.design_skin;
                }







                for (i = 0; i < nrChildren; i++) {

                    // console.info()
                    content[i] = cgallery.children().eq(i);
                    //_sliderCon.append(content[i]);
                    if (o.randomise == 'on'){
                        randomise(0, nrChildren);
                    }else{
                        used[i] = i;
                    }

                }


                if(o.search_field_con){
                    _searchField = o.search_field_con;
                    search_added=true;
                }

                var aux ='<div class="main-navigation"><div class="navMain"><div class="videogallery--navigation-container">';

                if(!search_added && o.search_field=='on'){

                    aux+='<div class="dzsvg-search-field"><input type="text" placeholder="search..."/><svg class="search-icon" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15px" viewBox="230.042 230.042 15 15" enable-background="new 230.042 230.042 15 15" xml:space="preserve"> <g> <path fill="#898383" d="M244.708,243.077l-3.092-3.092c0.746-1.076,1.118-2.275,1.118-3.597c0-0.859-0.167-1.681-0.501-2.465 c-0.333-0.784-0.783-1.46-1.352-2.028s-1.244-1.019-2.027-1.352c-0.785-0.333-1.607-0.5-2.466-0.5s-1.681,0.167-2.465,0.5 s-1.46,0.784-2.028,1.352s-1.019,1.244-1.352,2.028s-0.5,1.606-0.5,2.465s0.167,1.681,0.5,2.465s0.784,1.46,1.352,2.028 s1.244,1.019,2.028,1.352c0.784,0.334,1.606,0.501,2.465,0.501c1.322,0,2.521-0.373,3.597-1.118l3.092,3.083 c0.217,0.229,0.486,0.343,0.811,0.343c0.312,0,0.584-0.114,0.812-0.343c0.228-0.228,0.342-0.499,0.342-0.812 C245.042,243.569,244.931,243.3,244.708,243.077z M239.241,239.241c-0.79,0.79-1.741,1.186-2.853,1.186s-2.062-0.396-2.853-1.186 c-0.79-0.791-1.186-1.741-1.186-2.853s0.396-2.063,1.186-2.853c0.79-0.791,1.741-1.186,2.853-1.186s2.062,0.396,2.853,1.186 s1.186,1.741,1.186,2.853S240.032,238.45,239.241,239.241z"/> </g> </svg> </div>';


                }else{
                }
                aux+='</div></div></div>';
                if( menu_position!='bottom' ){



                    cgallery.append(aux);
                    cgallery.append('<div class="sliderMain"><div class="sliderCon"></div></div>');


                }else{
                    ////=== normal positioning -> video + navigation



                    cgallery.append('<div class="sliderMain"><div class="sliderCon"></div></div>');
                    cgallery.append(aux);

                }
                if(!search_added && o.search_field=='on') {
                    _searchField = cgallery.find('.dzsvg-search-field > input');
                }

                //console.info(cgallery);
                cgallery.append('<div class="gallery-buttons"></div>');
                cgallery.append('<div class="videogallery--adSpace" style="display:none;"></div>');
                if (o.design_shadow == 'on') {
                    cgallery.prepend('<div class="shadow"></div>');
                }

                _sliderMain = cgallery.find('.sliderMain');
                _sliderCon = cgallery.find('.sliderCon');
                _adSpace = cgallery.find('.videogallery--adSpace').eq(0);
                _mainNavigation = cgallery.find('.main-navigation');

                _sliderCon.addClass(o.extra_class_slider_con);

                if(o.settings_mode=='slider'){
                    _sliderMain.after(_mainNavigation);
                }

                //console.info(cgallery, _sliderCon, o.extra_class_slider_con);

                if(o.settings_disableVideo=='on'){
                    _sliderMain.remove();
                    //cgallery.children('.shadow').remove();

                }

                if (is_ie8()) {
                    $('html').addClass('ie8-or-lower');
                    cgallery.addClass('ie8-or-lower');
                    _sliderCon.addClass('sliderCon-ie8');
                }
                if (can_translate()) {
                    $('html').addClass('supports-translate');
                }

                _navMain = cgallery.find('.navMain');
                _navCon = cgallery.find('.videogallery--navigation-container').eq(0);


                if(o.design_navigationUseEasing=='on'){
//                _navCon.addClass('use-easing');
                }


                //console.info(nrChildren, cgallery.children().length);
                if (o.settings_mode == 'normal') {
                    reinit();
                }
                if (o.settings_mode == 'slider') {

                    _navMain.append('<div class="rotator-btn-gotoNext"><svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M24.291,14.276L14.705,4.69c-0.878-0.878-2.317-0.878-3.195,0l-0.8,0.8c-0.878,0.877-0.878,2.316,0,3.194  L18.024,16l-7.315,7.315c-0.878,0.878-0.878,2.317,0,3.194l0.8,0.8c0.878,0.879,2.317,0.879,3.195,0l9.586-9.587  c0.472-0.471,0.682-1.103,0.647-1.723C24.973,15.38,24.763,14.748,24.291,14.276z" fill="#515151"/></svg></div><div class="rotator-btn-gotoPrev"><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"                width="32px" height="32px" viewBox="0 0 32 32" enable-background="new 0 0 32 32" xml:space="preserve"><path fill="#515151" d="M7.927,17.729l9.619,9.619c0.881,0.881,2.325,0.881,3.206,0l0.803-0.804c0.881-0.88,0.881-2.323,0-3.204l-7.339-7.342l7.34-7.34c0.881-0.882,0.881-2.325,0-3.205l-0.803-0.803c-0.881-0.882-2.325-0.882-3.206,0l-9.619,9.619                C7.454,14.744,7.243,15.378,7.278,16C7.243,16.621,7.452,17.256,7.927,17.729z"/></svg>                </div>');
                }
                if (o.settings_mode == 'rotator') {
                    _navMain.append('<div class="rotator-btn-gotoNext"></div><div class="rotator-btn-gotoPrev"></div>');
                    _navMain.append('<div class="descriptionsCon"></div>');
                }



                for (i = 0; i < nrChildren; i++) {

                    // console.info('content[used[i]] - ',content[used[i]]);
                    _sliderCon.append(content[used[i]]);
                }


                for (i = 0; i < nrChildren; i++) {
                    var autoplaysw = 'off';
                    if (i == 0 && o.autoplay == 'on'){
                        autoplaysw = 'on';
                    }
                }

//            console.info(menu_position);


                _mainNavigation.addClass('menu-' + menu_position);

                if (o.nav_type == 'thumbsandarrows') {
                    _mainNavigation.append('<div class="thumbs-arrow-left inactive"></div>');
                    _mainNavigation.append('<div class="thumbs-arrow-right"></div>');


                    //_navCon.addClass('static');
                    _mainNavigation.find('.thumbs-arrow-left').bind('click', gotoPrevPage);
                    _mainNavigation.find('.thumbs-arrow-right').bind('click', gotoNextPage);
                }


                if(o.search_field=='on'){
                    //console.info(_searchField);
                    _searchField.bind('keyup', change_search_field);
                }


                //(o.menuitem_width + o.menuitem_space) * nrChildren
                //console.info('ceva', is_ios());
                if (is_ios() || is_android()){
                    // _navMain.css('overflow', 'auto');
                };

                var hpos = 0;


                //console.info(totalWidth, videoWidth);

                if (o.settings_mode == 'rotator3d') {

                    _sliderCon.children().each(function() {
                        var _t = $(this);
                        _t.addClass('rotator3d-item');
                        _t.css({'width': videoWidth, 'height': videoHeight})
                        _t.append('<div class="previewImg" style="background-image:url(' + _t.attr('data-previewimg') + ');"></div>');
                        _t.children('.previewImg').bind('click', mod_rotator3d_clickPreviewImg);

                    })
                }
                if (o.settings_mode == 'wall') {

                    //jQuery('body').zoomBox();

                    if (cgallery.parent().hasClass('videogallery-con')) {
                        cgallery.parent().css({'width': 'auto', 'height': 'auto'})
                    }
                    cgallery.css({'width': 'auto', 'height': 'auto'});
                    //return;
                    _sliderCon.children().each(function() {
                        //====each item
                        var _t = $(this);

                        _t.addClass('vgwall-item').addClass('clearfix');
                        _t.css({'width': o.menuitem_width, 'height': 'auto', 'position': 'relative', 'top': 'auto', 'left': 'auto'});
                        //console.log(totalWidth, totalHeight);
                        _t.attr('data-bigwidth', o.modewall_bigwidth);
                        _t.attr('data-bigheight', o.modewall_bigheight);
                        _t.attr('data-biggallery', cgallery.attr('id'));


                        _t.addClass('zoombox');


                        var desc = _t.find('.menuDescription').html();


                        if(desc){

                            if (desc.indexOf('{ytthumb}') > -1) {
                                desc = desc.split("{ytthumb}").join('<img src="//img.youtube.com/vi/' + _t.attr('data-src') + '/0.jpg" class="imgblock"/>');
                            }
                            if (desc.indexOf('{ytthumbimg}') > -1) {
                                desc = desc.split("{ytthumbimg}").join('//img.youtube.com/vi/' + _t.attr('data-src') + '/0.jpg');
                            }
                            _t.find('.menuDescription').html(desc);
                        }


                        _t.find('.menuDescription .imgblock').after(_t.children('.videoTitle').clone());


                        var str_menu_width = '';

                        if(String(o.menuitem_width).indexOf('%')>-1 || String(o.menuitem_width).indexOf('auto')>-1){
                            str_menu_width = ' width: '+ o.menuitem_width+';';
                        }else{
                            str_menu_width = ' width: '+ o.menuitem_width+'px;';
                        }

                        if (_t.attr('data-videoTitle') != undefined && _t.attr('data-videoTitle') != '') {
                            _t.prepend('<div class="videoTitle">' + _t.attr('data-videoTitle') + '</div>');
                        }
                        if (_t.attr('data-previewimg') != undefined) {
                            var aux2 = _t.attr('data-previewimg');

                            if (aux2 != undefined && aux2.indexOf('{ytthumbimg}') > -1) {
                                //console.log(_t.attr('data-src'));
                                aux2 = aux2.split("{ytthumbimg}").join('//img.youtube.com/vi/' + _t.attr('data-src') + '/0.jpg');
                            }


                            var aux7 = '';


                            if(String(o.menuitem_height)!=''){
                                aux7+='<div class="previewImg divimg" style="background-image:url(' + aux2 + '); width: 100%; ';
                                if(String(o.menuitem_height).indexOf('%')>-1 || String(o.menuitem_width).indexOf('auto')>-1){
                                    aux7+=' height:'+o.menuitem_height+';';
                                }else{
                                    aux7+=' height:'+o.menuitem_height+'px;';
                                }
                                aux7+='"></div>';
                            }else{
                                aux7+='<img class="previewImg" src="' + aux2 + '"';
                                aux7+= '/>';
                            }


                            _t.prepend(aux7);

                        }

                        //console.log(jQuery.fn.masonry);


                        var args = {};
                        if( window.init_zoombox_settings){
                            args = window.init_zoombox_settings;
                        }


                        _t.zoomBox(args);
                    });



                    setTimeout(function() {
                        if ($.fn.masonry != undefined) {
                            _sliderCon.masonry(o.masonry_options);
                            _sliderCon.addClass('masonry-inited');
                            cgallery.parent().children('.preloader').fadeOut('slow');

                        } else {
                            alert('vplayer.js - warning: masonry not included')
                        }
                        setTimeout(handleResize, 1000);
                        loaded = true;
                    }, 1500);
                }
                if (o.settings_mode == 'videowall') {

                    //jQuery('body').zoomBox();

                    if (cgallery.parent().hasClass('videogallery-con')) {
                        cgallery.parent().css({'width': 'auto', 'height': 'auto'})
                    }
                    cgallery.css({'width': 'auto', 'height': 'auto'});
                    //return;
                    _sliderCon.children().each(function() {
                        //====each item
                        var _t = $(this);

                        _t.wrap('<div class="dzs-layout-item"></div>');

                        // console.info(o.videoplayersettings);

                        o.videoplayersettings.responsive_ratio = 'detect';
                        o.videoplayersettings.cueVideo = 'off';

                        _t.vPlayer(o.videoplayersettings);

                        //console.log(jQuery.fn.masonry);

                        // _t.zoomBox();
                    });

                }

                // --- go to video 0 <<<< the start of the gallery
                cgallery.get(0).videoEnd = handleVideoEnd;
                cgallery.get(0).turnFullscreen = turnFullscreen;
                cgallery.get(0).external_handle_stopCurrVideo = handle_stopCurrVideo;
                cgallery.get(0).api_gotoNext = gotoNext;
                cgallery.get(0).api_gotoPrev = gotoPrev;
                cgallery.get(0).api_gotoItem = gotoItem;
                cgallery.get(0).api_responsive_ratio_resize_h = responsive_ratio_resize_h;
                cgallery.get(0).api_ad_block_navigation = ad_block_navigation;
                cgallery.get(0).api_ad_unblock_navigation = ad_unblock_navigation;


                if (o.logo != undefined && o.logo != '') {
                    cgallery.append('<img class="the-logo" src="' + o.logo + '"/>');
                    if (o.logoLink != undefined && o.logoLink != '') {
                        cgallery.children('.the-logo').css('cursor', 'pointer');
                        cgallery.children('.the-logo').click(function() {
                            window.open(o.logoLink);
                        });
                    }
                }

                _gbuttons = cgallery.children('.gallery-buttons');
                if (o.embedCode != '') {
                    _gbuttons.append('<div class="embed-button"><div class="handle"><svg width="32.00199890136719" height="32" viewBox="0 0 32.00199890136719 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g><path d="M 23.586,9.444c 0.88,0.666, 1.972,1.064, 3.16,1.064C 29.648,10.508, 32,8.156, 32,5.254 C 32,2.352, 29.648,0, 26.746,0c-2.9,0-5.254,2.352-5.254,5.254c0,0.002,0,0.004,0,0.004L 8.524,11.528 C 7.626,10.812, 6.49,10.38, 5.254,10.38C 2.352,10.38,0,12.734,0,15.634s 2.352,5.254, 5.254,5.254c 1.048,0, 2.024-0.312, 2.844-0.84 l 13.396,6.476c0,0.002,0,0.004,0,0.004c0,2.902, 2.352,5.254, 5.254,5.254c 2.902,0, 5.254-2.352, 5.254-5.254 c0-2.902-2.352-5.254-5.254-5.254c-1.188,0-2.28,0.398-3.16,1.064L 10.488,16.006c 0.006-0.080, 0.010-0.158, 0.012-0.238L 23.586,9.444z"></path></g></svg></div><div class="contentbox" style="display:none;"><textarea class="thetext">' + o.embedCode + '</textarea></div></div>');
                    _gbuttons.find('.embed-button .handle').click(click_embedhandle)
                    _gbuttons.find('.embed-button .contentbox').css({
                        'right': 50
                    })
                }
                if (o.shareCode != '') {
                    _gbuttons.append('<div class="share-button"><div class="handle"><svg width="32" height="33.762001037597656" viewBox="0 0 32 33.762001037597656" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g><path d="M 22,6c0-3.212-2.788-6-6-6S 10,2.788, 10,6c0,3.212, 2.788,6, 6,6S 22,9.212, 22,6zM 16,14c-5.256,0-10,5.67-10,12.716s 20,7.046, 20,0S 21.256,14, 16,14z"></path></g></svg></div><div class="contentbox" style="display:none;"><div class="thetext">' + o.shareCode + '</div></div></div>');
                    _gbuttons.find('.share-button .handle').click(click_sharehandle)
                    _gbuttons.find('.share-button .contentbox').css({
                        'right': 50
                    })
                }


                if(o.nav_type=='outer'){
                    _navCon.addClass(o.nav_type_outer_grid);


                    _navCon.children().addClass('dzs-layout-item');


                    if(o.menuitem_width){
                        o.menuitem_width ='';
                    }



                    if(o.nav_type_outer_max_height){
                        var nto_mh = Number(o.nav_type_outer_max_height);


                        _navMain.css('max-height', nto_mh+'px');
                        _navMain.addClass('scroller-con skin_apple inner-relative');
                        _navCon.addClass('inner');

                        _navMain.css({
                            'height' : 'auto'
                        })

                        try_to_init_scroller();
                    }
                }

                calculateDims({



                    'call_from':'init'
                });



                if (o.nav_type == 'scroller') {
                    _navMain.addClass('scroller-con skin_apple');
                    _navCon.addClass('inner');

                    if ((menu_position == 'right' || menu_position == 'left') && nrChildren > 1) {
                        //console.log((o.menuitem_height + o.menuitem_space) * nrChildren);
                        _navCon.css({
                            // 'width' : menuitem_width
                        })
                    }
                    if ((menu_position == 'bottom' || menu_position == 'top') && nrChildren > 1) {
                        _navCon.css({
                            'height' : (menuitem_height)
                        })
                    }

                    _navMain.css({
                        'height' : '100%'
                    })

                    _navMain.scroller({
                        'enable_easing':'on'
                    });
                }


                //====== NO FUNCTION HIER



                //console.log('hier');

                cgallery.on('click','.rotator-btn-gotoNext,.rotator-btn-gotoPrev', handle_mouse);


                window.addEventListener("orientationchange",handle_orientationchange);
                $(window).on('resize', handleResize);
                handleResize();

                setTimeout(function(){
                    calculateDims({

                        'call_from':'first_timeout'
                    })
                }, 3000);
                setTimeout(init_start,100);


                if(o.settings_trigger_resize>0){
                    setInterval(function(){

                        // console.info("HMM");
                        calculateDims({
                            'call_from':'recheck_sizes'
                        });
                    },o.settings_trigger_resize);
                };



                if(o.startItem=='default'){
                    o.startItem=0;
                    if(o.playorder=='reverse'){
                        o.startItem = nrChildren-1;
                    }
                }

                // --- gotoItem
                if (o.settings_mode != 'wall' && o.settings_mode != 'videowall') {

                    loaded = true;

                    //console.info(o.startItem, get_query_arg(window.location.href,'dzsvg_startitem_'+cid));



                    if(typeof get_query_arg(window.location.href,'dzsvg_startitem_'+cid)!='undefined'){
                        o.startItem = Number(get_query_arg(window.location.href, 'dzsvg_startitem_'+cid));
                    }

                    //console.log(_navMain, _sliderCon.children().eq(o.startItem).attr('data-type'));
                    // console.info('startItem - ',o.startItem);
                    if(_sliderCon.children().eq(o.startItem).attr('data-type')=='link'){
                        gotoItem(o.startItem, {donotopenlink: "on"});

                    }else{
                        gotoItem(o.startItem);
                    }
                    if(o.nav_type=='scroller'){
                        var aux = parseInt(_navCon.children().eq(o.startItem).css('top'),10);
                        if(typeof _navMain.get(0).fn_scrolly_to != 'undefined'){
                            console.info('focescroll to', aux);
                            _navMain.get(0).fn_scrolly_to(aux);
                        }

                    }


                    if(o.settings_go_to_next_after_inactivity){
                        setInterval(function(){
                            if(first_played==false){

                                gotoNext();
                            }
                        },o.settings_go_to_next_after_inactivity*1000);
                    }
                }

                if(o.settings_separation_mode=='scroll'){
                    $(window).bind('scroll', handle_scroll);
                }
                if(o.settings_separation_mode=='button'){
                    cgallery.append('<div class="btn_ajax_loadmore">Load More</div>');
                    cgallery.children('.btn_ajax_loadmore').bind('click', click_btn_ajax_loadmore);
                }


                // console.warn(cgallery);
                cgallery.get(0).api_handleResize = handleResize;
                cgallery.get(0).api_gotoItem = gotoItem;
                cgallery.get(0).api_handleResize_currVideo = handleResize_currVideo;
                cgallery.get(0).api_pause_currVideo = pause_currVideo;
                cgallery.get(0).api_currVideo_refresh_fsbutton = api_currVideo_refresh_fsbutton;
                cgallery.get(0).api_video_ready = the_transition;

                cgallery.get(0).api_setup_ad = setup_ad;
                cgallery.get(0).api_played_video = function(){
                    first_played = true;
                    console.info('first_played - ',first_played);
                };



            }

            function try_to_init_scroller(){

                if(window.dzsscr_init){


                    window.dzsscr_init(_navMain, {

                        'enable_easing':'on'
                        ,'settings_skin':'skin_apple'
                    });

                }else{




                    var baseUrl = '';
                    var baseUrl_arr = get_base_url_arr();
                    for(var i24=0;i24<baseUrl_arr.length-2; i24++){
                        baseUrl+=baseUrl_arr[i24]+'/';
                    }
                    //var src = scripts[scripts.length-1].src;


                    console.warn(baseUrl);


                    var url = baseUrl+'dzsscroller/scroller.js';
                    //console.warn(scripts[i23], baseUrl, url);

                    $('head').append('<link rel="stylesheet" type="text/css" href="'+baseUrl+'dzsscroller/scroller.css">');
                    $.ajax({
                        url: url,
                        dataType: "script",
                        success: function(arg){


                            try_to_init_scroller();



                        }
                    });
                }
            }

            function init_scroller(){

            }


            function ad_block_navigation(){

                // console.info('blocked');
                cgallery.addClass('ad-blocked-navigation');

            }
            function ad_unblock_navigation(){

                cgallery.removeClass('ad-blocked-navigation');
            }

            function init_start(){

                // console.info('init_start() - ');

                if(o.settings_mode=='wall'){

                    setTimeout(init_showit,1500);

                }else{

                    init_showit();
                }

                if(o.nav_type=='thumbs' && o.design_navigationUseEasing=='on'){
                    handle_frame();
                }


                if(o.settings_secondCon){
                    var xpos = 0;
                    $(o.settings_secondCon).find('.item').each(function(){
                        var _t = $(this);
                        _t.css('left', xpos+'%');
                        xpos+=100;
                    })
                }

                //console.info(o.settings_outerNav);
                if(o.settings_outerNav){

                    var xpos = 0;
                    o.settings_outerNav.find('.videogallery--navigation-outer--bigblock').each(function(){
                        var _t = $(this);
                        _t.css('left', xpos+'%');
                        xpos+=100;
                    })
                }

                setInterval(tick, 1000);

                handleResize();

                cgallery.addClass('inited');

                //setTimeout(handleResize,1000);
            }

            function handle_mouse(e){

                var _t = $(this);
                if(_t.hasClass('rotator-btn-gotoNext')){

                    gotoNext();
                }
                if(_t.hasClass('rotator-btn-gotoPrev')){

                    gotoPrev();
                }
            }

            function init_showit(){

                // console.error('init_showit()');

                cgallery.parent().children('.preloader').fadeOut('fast');
                cgallery.parent().children('.css-preloader').fadeOut('fast');


                if(o.init_on=='scroll'&& cgallery.hasClass('transition-slidein')){
                    setTimeout(function(){

                        cgallery.addClass('dzsvg-loaded');
                    },300);
                }else{

                    cgallery.addClass('dzsvg-loaded');
                }
            }
            function reinit(){
                //console.log('reinit()', cgallery.children('.vplayer-tobe').length);

                var len = cgallery.children('.vplayer-tobe').length;


                if (o.settings_mode == 'normal') {





                    for (i = 0; i < nrChildren; i++) {
                        var _c = cgallery.children('.vplayer-tobe').eq(used[i]);
                        var desc = _c.find('.menuDescription').html();

                        //console.info(desc, used[i], cgallery.children().eq(used[i]));
                        if( !(_c.attr('data-videoTitle')) ){
                            if(_c.find('.menuDescription').find('.the-title').html()){

                                if(o.disable_videoTitle!='on'){

                                    _c.attr('data-videoTitle',_c.find('.menuDescription').find('.the-title').html());
                                }

                            }
                        }
                        _c.find('.menuDescription').remove();
                        if (desc == null) {



                            if(o.menu_description_format){
                                //console.info(o.menu_description_format, _c.find('.feed-menu-number').html());

                                var aux = o.menu_description_format;


                                aux = aux.replace('{{number}}', '<div class="menu-number"><span class="the-number">'+_c.find('.feed-menu-number').html()+'</span></div>');
                                aux = aux.replace('{{menuimage}}', '<div class="divimage imgblock" style="background-image: url('+_c.find('.feed-menu-image').html()+')"></div>');
                                aux = aux.replace('{{menutitle}}', '<div class="menu-title" style="">'+_c.find('.feed-menu-title').html()+'</div>');
                                aux = aux.replace('{{menudesc}}', '<div class="menu-desc" style="">'+_c.find('.feed-menu-desc').html()+'</div>');
                                aux = aux.replace('{{menutime}}', '<div class="menu-time" style="">'+_c.find('.feed-menu-time').html()+'</div>');
                                desc = aux;
                            }else{

                                continue;
                            }

                        }

                        var _c2 = _c;


                        //console.info(_c2, o.videoplayersettings.responsive_ratio);
                        if(typeof _c2.attr('data-src')!='undefined'){
                            if(String(_c2.attr('data-src')).indexOf('youtube.com/watch')){

                                var dataSrc = _c2.attr('data-src');
                                var auxa = String(dataSrc).split('youtube.com/watch?v=');
//                            console.info(auxa);
                                if(auxa[1]){

                                    dataSrc = auxa[1];
                                    if(auxa[1].indexOf('&')>-1){
                                        var auxb = String(auxa[1]).split('&');
                                        dataSrc = auxb[0];
                                    }

                                    _c2.attr('data-src', dataSrc);
                                }
                            }
                        }
                        if (desc.indexOf('{ytthumb}') > -1) {
                            desc = desc.split("{ytthumb}").join('<img src="//img.youtube.com/vi/' + _c2.attr('data-src') + '/0.jpg" class="imgblock"/>');
                        }
                        if (desc.indexOf('{ytthumbimg}') > -1) {
                            desc = desc.split("{ytthumbimg}").join('//img.youtube.com/vi/' + _c2.attr('data-src') + '/0.jpg');
                        }



                        var aux = '';

                        //console.info(cgallery.children('.vplayer-tobe').eq(i));


                        var _ci = cgallery.children('.vplayer-tobe').eq(i);


                        //console.info(_ci.attr('data-type'));


                        // -- this is inside video gallery
                        if( (_ci.attr('data-type')=='youtube' || _ci.attr('data-type')=='vimeo') && o.videoplayersettings.responsive_ratio=='detect' && !(_ci.attr('data-responsive_ratio'))){


                            _ci.attr('data-responsive_ratio', '0.562');


                            _ci.attr('data-responsive_ratio-not-known-for-sure', 'on');  // -- we set this until we know the responsive ratio for sure , 0.562 is just 16/9 ratio so should fit to most videos


                            if(o.php_media_data_retriever){

                                //console.info(o.php_media_data_retriever);
                                setTimeout(function(arg){

                                    var _cach = _sliderCon.children().eq(arg);
                                    //console.info(arg, _cach);

                                    var src = _cach.attr('data-src');

                                    $.get( o.php_media_data_retriever+"?action=dzsvg_action_get_responsive_ratio&type="+_cach.attr('data-type')+"&source="+src, function( data ){

                                        //console.info(data);

                                        var json = JSON.parse(data);

                                        //console.info(json);


                                        var rr = 0;

                                        rr = json.height / json.width;

                                        //console.info(rr,rr.toFixed(3));

                                        if(rr.toFixed(3)!='0.563'){
                                            _cach.attr('data-responsive_ratio',rr.toFixed(3));
                                        }
                                        _cach.attr('data-responsive_ratio-not-known-for-sure', 'off');


                                        if(_cach.get(0) && _cach.get(0).api_get_responsive_ratio){
                                            _cach.get(0).api_get_responsive_ratio({
                                                'reset_responsive_ratio':true
                                            })

                                            setTimeout(function(){
                                                handleResize_currVideo();
                                            },100);
                                        }




                                        //_cach.attr('data-responsive_ratio')
                                    });
                                },100,i);
                            }

                        }

                        if(_ci.attr('data-type')=='link'){


                            aux+='<a class="navigationThumb"';

                            if(cgallery.children('.vplayer-tobe').eq(i).attr('data-source')){
                                aux+=' href="'+_ci.attr('data-source')+'"';
                            }
                            if(cgallery.children('.vplayer-tobe').eq(i).attr('data-target')){
                                aux+=' target="'+_ci.attr('data-target')+'"';
                            }

                            aux+='>';
                        }else{
                            aux+='<div class="navigationThumb">';
                        }


                        aux+='<div class="navigationThumb-content">';
                        if(o.settings_menu_overlay=='on'){
                            aux+='<div class="menuitem-overlay"></div>';
                        }

                        // console.warn(desc);

                        if(cgallery.hasClass('skin-boxy')){
                            desc = desc.replace(/\<img src=\"(.+?)".*?\/{0,1}>/g, '<div class="big-thumb" style=\'background-image:url("$1");\'></div>');
                        }
                        // console.info(desc);
                        aux+=desc + '</div>';




                        if(_ci.attr('data-type')=='link'){

                            aux+='</a>';
                        }else{

                            aux+='</div>';
                        }
                        _navCon.append(aux);
                        _navCon.children().last().find('.imgblock.divimage').addClass('big-thumb');
                    }


                    if(o.nav_type=='none'){
                        _mainNavigation.hide();
                    }



                    /*
                     var initnavConlen = _navCon.children().length;
                     wpos = 0;
                     hpos =0 ;
                     for (i = 0; i < len; i++) {
                     var _c = cgallery.children('.vplayer-tobe').eq(i);



                     var desc = _c.find('.menuDescription').html();


                     _c.find('.menuDescription').remove();
                     if (desc == null) {


                     if(o.menu_description_format){
                     console.info('ceva');
                     }else{

                     continue;
                     }


                     }else{

                     }
                     if (desc.indexOf('{ytthumb}') > -1) {
                     desc = desc.split("{ytthumb}").join('<img src="//img.youtube.com/vi/' + cgallery.children().eq(used[i]).attr('data-src') + '/0.jpg" class="imgblock"/>');
                     }
                     if (desc.indexOf('{ytthumbimg}') > -1) {
                     desc = desc.split("{ytthumbimg}").join('//img.youtube.com/vi/' + cgallery.children().eq(used[i]).attr('data-src') + '/0.jpg');
                     }


                     _navCon.append('<div><div class="navigationThumb-content">' + desc + '</div></div>')
                     _navCon.children().eq(initnavConlen + i).addClass("navigationThumb");
                     _navCon.children().eq(initnavConlen + i).css({
                     'width': o.menuitem_width,
                     'height': o.menuitem_height
                     });

                     _navCon.children('.navigationThumb').eq(initnavConlen + i).click(handleButton);




                     if (o.nav_type == 'scroller') {

                     }

                     hpos += o.menuitem_height + menuitem_space;
                     wpos += o.menuitem_width + menuitem_space;
                     }

                     */

                }

                for (i = 0; i < len; i++) {
                    var _t = cgallery.children('.vplayer-tobe').eq(0);
                    //console.log(_t)
                    _sliderCon.append(_t);
                }




                if (o.settings_mode == 'wall') {

                    _sliderCon.children().each(function() {
                        //====each item
                        var _t = $(this);



                        if (_t.find('.videoDescription').length == 0) {
                            if (_t.find('.menuDescription').length > 0) {
                                _t.append('<div class="videoDescription">'+_t.find('.menuDescription').html()+'</div>')
                            }
                        }


                        _t.addClass('vgwall-item').addClass('clearfix');
                        _t.css({'width': o.menuitem_width, 'height': 'auto', 'position': 'relative'});
                        //console.log(totalWidth, totalHeight);
                        _t.attr('data-bigwidth', o.modewall_bigwidth);
                        _t.attr('data-bigheight', o.modewall_bigheight);

                        if (_t.attr('data-videoTitle') != undefined && _t.attr('data-videoTitle') != '') {
                            _t.prependOnce('<div class="videoTitle">' + _t.attr('data-videoTitle') + '</div>', '.videoTitle');
                        }
                        if (_t.attr('data-previewimg') != undefined) {
                            var aux2 = _t.attr('data-previewimg');

                            if (aux2 != undefined && aux2.indexOf('{ytthumbimg}') > -1) {
                                //console.log(_t.attr('data-src'));
                                aux2 = aux2.split("{ytthumbimg}").join('//img.youtube.com/vi/' + _t.attr('data-src') + '/0.jpg');
                            }

                            _t.prependOnce('<img class="previewImg" style="" src="' + aux2 + '"/>', '.previewImg');

                        }

                        if (jQuery.fn.masonry != undefined) {

                            if(_sliderCon.hasClass('masonry-inited')){
                                _sliderCon.masonry('reload');
                            }
                            cgallery.parent().children('.preloader').fadeOut('slow');
                            setTimeout(handleResize, 1000);
                        }else{
                            alert('vplayer.js - warning: masonry not included')
                        }

                        _t.zoomBox();
                    });
                }



                //console.info('o.nav_type - ',o.nav_type);
                if(o.nav_type=='outer'){
                    _navCon.children().addClass('dzs-layout-item');
                }


                nrChildren = _sliderCon.children().length;

                if(nrChildren==1){
                    //console.info("one child");
                }
            }

            function gotoNextPage() {
                var tempPage = currPage;

                tempPage++;
                gotoPage(tempPage);

            }

            function gotoPrevPage() {
                if (currPage == 0)
                    return;

                currPage--;
                gotoPage(currPage);

            }

            function change_search_field(){
                var _t = $(this);

                // console.info(_t.val());

                if(o.settings_mode=='wall'){
                    _sliderCon.children().each(function() {
                        var _t2 = $(this);


                        if(_t.val() == '' || String(String(_t2.find('.menuDescription').eq(0).html()).toLowerCase()).indexOf(_t.val().toLowerCase())>-1){

                            _t2.show();
                        }else{

                            _t2.hide();
                        }

                        if(inter_relayout_masonry){
                            clearTimeout(inter_relayout_masonry);
                        }
                        inter_relayout_masonry = setTimeout(function(){

                            if (jQuery.fn.masonry != undefined) {


                                // console.warn("MASONRY LAYOUT");
                                if(_sliderCon.hasClass('masonry-inited')) {
                                    _sliderCon.masonry('layout');
                                }

                            }
                        },500);
                    });
                }

                _navCon.children().each(function(){
                    var _t2 = $(this);

                    // console.warn(_t2);

                    //console.info(_t2.find('.navigationThumb-content').eq(0).html(),_t.val());
                    if(_t.val() == '' || String(String(_t2.find('.navigationThumb-content').eq(0).html()).toLowerCase()).indexOf(_t.val().toLowerCase())>-1){

                        _t2.show();
                    }else{

                        if(_t2.hasClass('dzsvg-search-field')==false){

                            _t2.hide();
                        }
                    }
                });

                handleResize();
            }

            function responsive_ratio_resize_h(arg, pargs){

                // -- gallery
//                return false;
//                videoHeight = arg;


                var margs = {
                    caller: null
                    ,'call_from':'default'
                }

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                if(margs.caller==null){
                    return false;
                }

                //console.info('responsive_ratio_resize_h - ', arg, cgallery,  margs);

                if(initial_h===-1){
                    initial_h=_sliderMain.height();
                }else{
//                    console.info(initial_h);
                }
//                console.info(menu_position);

                //console.info(arg);
                // console.info('menu_position - ',menu_position)
                if(menu_position=='left'||menu_position=='right'||menu_position=='none'){
                    totalHeight = arg;
                    cgallery.height(arg);

                    if(o.settings_mode!='slider'){

                        _mainNavigation.height(arg);
                    }


                    if(menu_position=='none' || menu_position=='right' || menu_position=='left'){
                        currVideo.height(arg);
                    }

                    // console.info("LETS ASSIGN VIDEOHEIGHT",arg);
                    videoHeight = arg;
//                    console.info(arg, cgallery.height());
                }else{
                    cgallery.css('height', 'auto');
//                    console.info(arg, cgallery.height());

                    // totalHeight = arg;
                    videoHeight = arg;
                    currVideo.height(arg);

                }


                if(margs.caller){
                    margs.caller.data('height_for_videoheight',arg);
                    calculateDims({
                        call_from: 'height_for_videoheight'
                    });
                }

                if(o.nav_type=='scroller'){
                    setTimeout(function(){


                        if(_navMain.get(0) && _navMain.get(0).api_toggle_resize){
                            _navMain.get(0).api_toggle_resize();
                        }
                    },100)
                }


                //console.info(initial_h);

                // console.info('adjusting _sliderMain height',arg, videoHeight);
                // _sliderMain.height(arg);
//                console.info(arg, cgallery.height());
            }
            function gotoPage(arg) {
                if (arg > nav_max_pages || o.nav_type != 'thumbsandarrows'){
                    return;
                }


                console.info("gotoPage ..",arg, ' ... nav type ', o.nav_type, '... nav_max_pages', nav_max_pages);


                var thumbsSlider = _navCon;

                _mainNavigation.find('.thumbs-arrow-left').removeClass('inactive');
                _mainNavigation.find('.thumbs-arrow-right').removeClass('inactive');
                if (arg == 0) {
                    _mainNavigation.find('.thumbs-arrow-left').addClass('inactive');
                }
                if (arg == nav_max_pages ) {
                    _mainNavigation.find('.thumbs-arrow-right').addClass('inactive');
                }

                if (arg == nav_max_pages ) {

                    if (menu_position == "right" || menu_position == "left"){


                        thumbsSlider.animate({
                            'top': thumbs_thumb_var * -arg
                            ,'left': 0
                        }, {
                            duration: 400,
                            queue: false
                        });
                    }

                    if (menu_position == "bottom" || menu_position == "top"){
                        thumbsSlider.animate({
                            'left': thumbs_thumb_var * -arg
                            ,'top': 0
                        }, {
                            duration: 400,
                            queue: false
                        });
                    }

                } else {


                    if (menu_position == "right" || menu_position == "left"){
                        thumbsSlider.animate({
                            'top': thumbs_thumb_var * -arg
                            ,'left': 0
                        }, {
                            duration: 400,
                            queue: false
                        });

                        console.info('nav_page_size * -arg', nav_page_size * -arg, menuitem_height);
                    }

                    if (menu_position == "bottom" || menu_position == "top"){
                        thumbsSlider.animate({
                            'left': thumbs_thumb_var * -arg
                            ,'top': 0
                        }, {
                            duration: 400,
                            queue: false
                        });
                    }

                }

                currPage = arg;
            }

            function tick(){


            }
            function calculateDims(pargs){

                // -- gallery



                var margs = {
                    'call_from':'default'
                };
                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                // console.info(margs);


                totalWidth = cgallery.outerWidth();
                totalHeight = cgallery.height();

                //console.log('vgallery calculateDims()', margs, totalWidth, totalHeight);

                // console.info(margs);
                if(margs.call_from=='recheck_sizes'){

                    // console.info(Math.abs(last_totalWidth-totalWidth), Math.abs(last_totalHeight-totalHeight));
                    if(Math.abs(last_totalWidth-totalWidth)<4 && Math.abs(last_totalHeight-totalHeight)<4){


                        console.info("SAME SIZES");
                        return false;
                    }

                }

                // console.info('passed test');

                last_totalWidth = totalWidth;
                last_totalHeight = totalHeight;


                if(totalWidth<721){
                    cgallery.addClass('under-720');



                }else{
                    cgallery.removeClass('under-720');
                }


                if(totalWidth<601){
                    cgallery.addClass('under-600');
                }else{
                    cgallery.removeClass('under-600');
                }


                if( String(cgallery.get(0).style.height).indexOf('%')>-1){

                    totalHeight = cgallery.height();
                }else{

                    if(cgallery.data('init-height')){

                        totalHeight = cgallery.data('init-height');
                    }else{

                        totalHeight = cgallery.height();
                        //cgallery.data('init-height',totalHeight);

                        setTimeout(function(){
                            //console.log(cgallery.height(), cgallery.outerHeight());
                        })

                        //console.info(cgallery, totalHeight);
                    }
                }

                // console.log( 'checking total height',cgallery.outerHeight(), totalHeight, cgallery);

                if(o.totalHeightDifferenceOnParent!=''){
                    //console.info('ceva');
                    var aux = parseFloat(o.totalHeightDifferenceOnParent);
                    //console.log(aux);
                    var aux2 = 1 + aux;
                    //console.log(aux2);

                    totalHeight = aux2 * _rparent.outerHeight(false);
                    //console.info(totalHeight);
                }

//
//                if(cgallery.attr('id')=='vg1'){
//                }


                //return;

                // console.warn('totalHeight is', totalHeight);
//                console.info(cgallery.height(), totalHeight);

                videoWidth = totalWidth;
                videoHeight = totalHeight;


                console.info('videoHeight - ',videoHeight);

//                console.info(videoHeight);

                menuitem_width = o.menuitem_width;
                menuitem_height = o.menuitem_height;

                if(isNaN(menuitem_height)){ menuitem_height = 0; }

//                console.info(videoHeight);


                // -- ultra-responsive
                if (o.settings_disableVideo!='on'&& (o.menu_position == 'right' || o.menu_position == 'left') && nrChildren > 1) {
//                    console.info(menuitem_width, menuitem_space, totalWidth/2);
                    if(menuitem_width + menuitem_space > totalWidth/2){
                        ultra_responsive_last_layout = 'movedup';
                        //menu_position='top'

                        cgallery.addClass('ultra-responsive');

                        //console.warn('videoHeight - ',videoHeight, _sliderMain);



                    }else{
                        ultra_responsive_last_layout = 'normal';
                        //cgallery.removeClass('force-ultra-responsive-top');

                        cgallery.removeClass('ultra-responsive');
                    }

                }



                if(o.settings_mode=='normal'){


                    if(o.nav_type=='thumbs'){

                        if(menu_position == 'right'){

                            if(menuitem_space){



                                _navCon.children('.navigationThumb').css({
                                    'margin-bottom':menuitem_space
                                    ,'margin-top':''
                                });


                                if(cgallery.hasClass('skin-boxy--rounded')){

                                    _navCon.css({
                                        'padding-top':menuitem_space
                                        ,'padding-bottom':menuitem_space
                                    });

                                    cgallery.appendOnce(' <svg class="svg_rounded" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="1px" height="1px" viewBox="0 0 1 1" enable-background="new 0 0 1 1" xml:space="preserve"> <g id="Layer_1"> </g> <g id="Layer_2"> <g> <defs> <path id="SVGID_1_" d="M1,0.99C1,0.996,0.996,1,0.99,1H0.01C0.004,1,0,0.996,0,0.99V0.01C0,0.004,0.004,0,0.01,0h0.98 C0.996,0,1,0.004,1,0.01V0.99z"/> </defs> <clipPath id="SVGID_2_"  clipPathUnits="objectBoundingBox"> <use xlink:href="#SVGID_1_" overflow="visible"/> </clipPath> <path clip-path="url(#SVGID_2_)" fill="#2A2F3F" d="M3,1.967C3,1.985,2.984,2,2.965,2h-3.93C-0.984,2-1,1.985-1,1.967v-2.934 C-1-0.985-0.984-1-0.965-1h3.93C2.984-1,3-0.985,3-0.967V1.967z"/> </g> </g> </svg>  ')
                                }

                            }else{

                                _navCon.children('.navigationThumb').css({
                                    'margin-bottom':''
                                });
                            }
                        }
                    }
                }




                _mainNavigation.removeClass('menu-top menu-bottom menu-right menu-left');
                _mainNavigation.addClass('menu-'+menu_position);

                cgallery.removeClass('menu-top menu-bottom menu-right menu-left');
                cgallery.addClass('menu-'+menu_position);

                // console.info(menu_position, nrChildren);

                //console.info('menuitem_space - ',menuitem_space);

                if ((menu_position == 'right' || menu_position == 'left') && nrChildren > 1) {
                    videoWidth -= (menuitem_width + menuitem_space);


                }

                // console.info("TEMP VIDEO HEIGHT", videoHeight);
                if (o.nav_type!='outer' && (menu_position == 'bottom' || menu_position == 'top') && nrChildren > 1 && cgallery.get(0).style &&  cgallery.get(0).style.height!='auto') {
                    //console.info(videoHeight);
                    videoHeight -= (menuitem_height + menuitem_space );

                }


                // console.groupCollapsed('currVideo data height');

                //console.log('currVideo - ',currVideo, o.videoplayersettings.responsive_ratio);

                if(currVideo && currVideo.data('height_for_videoheight')){

                    // console.info("GET videoHeight from currVideo data", currVideo.data('height_for_videoheight'));
                    videoHeight = currVideo.data('height_for_videoheight');

                    last_height_for_videoheight = videoHeight;
                }else{
                    // -- lets try to get the last value known for responsive ratio if the height of the current video is now currently known
                    if(o.videoplayersettings.responsive_ratio && o.videoplayersettings.responsive_ratio == 'detect'){

                        if(last_height_for_videoheight){

                            videoHeight = last_height_for_videoheight;
                        }

                    }else{
                        if(menu_position=='left' || menu_position =='right'){

                            videoHeight = 300;
                        }
                        console.info("HMM menu_position - ",menu_position);
                    }
                }



                // console.groupEnd();

                console.info('o.forceVideoHeight - ',o.forceVideoHeight);
                if(o.forceVideoHeight!='' && (!o.videoplayersettings || o.videoplayersettings.responsive_ratio!='detect') ){
                    videoHeight = o.forceVideoHeight;
                }

                if (o.settings_mode == 'rotator3d') {
                    videoWidth = totalWidth / 2;
                    videoHeight = totalHeight * 0.8;
                    menuitem_width = 0;
                    menuitem_height = 0;
                    menuitem_space = 0;
                    o.transition_type = 'rotator3d';
                }

                //console.warn('videoHeight - ',videoHeight);

                cgallery.addClass('transition-'+ o.transition_type)



                // === if there is only one video we hide the nav
                if (nrChildren == 1) {
                    //totalWidth = videoWidth;
                    _mainNavigation.hide();
                }



                if(typeof(currVideo)!='undefined'){
                    /// === why ?
                    /*
                     currVideo.css({
                     'width': videoWidth
                     ,'height': videoHeight
                     })
                     */
                };

                hpos = 0;
                for (i = 0; i < nrChildren; i++) {
                    //if(is_ios())	break;

                    _sliderCon.children().eq(i).css({
                    })
                    hpos += totalHeight;
                }

                console.warn('videoHeight - ',videoHeight);
                // console.warn('menu_position - ',menu_position);
                if (o.settings_mode != 'wall' && o.settings_mode != 'videowall') {
                    // console.info(videoHeight);


                    // console.info('adjusting slidermain dims for !wall', videoHeight)
                    _sliderMain.css({
                        'width': videoWidth
                    })


                    if( (menu_position=='left' || menu_position == 'right')  && nrChildren>1){
                        _sliderMain.css('width','auto');

                        if(cgallery.hasClass('ultra-responsive')){

                            _sliderMain.css('height',videoHeight+'px');
                            //_navMain.css('height',(o.design_item_height * nrChildren)+'px');
                        }else{

                            _sliderMain.css({
                                'height': ''
                            })
                        }
                    }else{


                        // console.info("SLIDERMAIN videoHeight", videoHeight);
                        _sliderMain.css({
                            'height': videoHeight
                        })
                    }

                }

                if (o.settings_mode == 'rotator3d') {
                    _sliderMain.css({
                        'width': totalWidth,
                        'height': totalHeight
                    })
                    _sliderCon.children().css({
                        'width': videoWidth,
                        'height': videoHeight
                    })
                }
                if (menu_position == 'right') {

                    //console.info('o.nav_space - ',o.nav_space);
                    if(cgallery.hasClass('ultra-responsive')) {

                        _mainNavigation.css({

                            'margin-left': ''
                            , 'margin-right': ''
                            , 'height': '' // height is auto in ultra-responsive
                        });
                    }else{
                        _mainNavigation.css({
                            'width': menuitem_width
                            ,'height': totalHeight
                            ,'position':'relative'
                            ,'margin-left' : o.nav_space + 'px'
                            ,'margin-right' : 0
                            ,'margin-top' : 0
                            ,'margin-bottom' : 0
                        })
                    }

                }
                if (menu_position == 'left') {

                    //console.log(totalHeight);
                    if(cgallery.hasClass('ultra-responsive')) {

                        _mainNavigation.css({

                            'margin-left': ''
                            , 'margin-right': ''
                        });
                    }else {
                        _mainNavigation.css({
                            'width': menuitem_width,
                            'height': totalHeight,
                            'left': 0
                            , 'position': 'relative'
                            , 'margin-left': 0
                            , 'margin-right': o.nav_space
                            , 'margin-top': 0
                            , 'margin-bottom': 0
                        })
                        _sliderMain.css({
//                        'left': menuitem_width + o.nav_space
                        })
                    }
                }
                if (menu_position == 'bottom') {
                    _mainNavigation.css({
                        'width': totalWidth,
                        'height': menuitem_height
                        ,'margin-left' : 0
                        ,'margin-right' : 0
                        ,'margin-top' : o.nav_space
                        ,'margin-bottom' : 0
                    })
                }
                if (menu_position == 'top') {
                    _mainNavigation.css({
                        'width': totalWidth
                        ,'height': ''
                        ,'margin-left' : 0
                        ,'margin-right' : 0
                        ,'margin-top' : 0
                        ,'margin-bottom' : o.nav_space
                    })
                    _sliderMain.css({

                    })
                }





                //===calculate dims for navigation / mode-normal
                if (o.nav_type == 'thumbsandarrows') {

                    navWidth = (totalWidth - nav_arrow_size * 2);
                    navHeight = (totalHeight - nav_arrow_size * 2);




                    if (menu_position == 'bottom' || menu_position == 'top') {
                        thumbs_thumb_var = menuitem_width;
                        thumbs_thumb_var_sec = menuitem_height;
                        thumbs_total_var = totalWidth;
                        thumbs_total_var_sec = totalHeight;
                        thumbs_css_main = 'left';
                        _navMain.css({
                            'left': nav_arrow_size
                            ,'top': ''
                            , 'width': navWidth
                            , 'height': '100%'
                        });

                        var auxs = 0;
                        _navCon.children().each(function(){
                            var _t = $(this);
                            auxs+=_t.outerWidth();
                        })
                        _navCon.css('width', auxs);

                        _mainNavigation.children('.thumbs-arrow-left').css({
                            'left': nav_arrow_size / 2
                            ,'top': ''
                        });
                        _mainNavigation.children('.thumbs-arrow-right').css({
                            'left': navWidth + nav_arrow_size + nav_arrow_size / 2
                            ,'top': ''
                        });
                        nav_main_consize = navWidth;
                    }
                    if (menu_position == 'left' || menu_position == 'right') {
                        thumbs_thumb_var = menuitem_height;
                        thumbs_thumb_var_sec = menuitem_width;
                        thumbs_total_var = totalHeight;
                        thumbs_total_var_sec = totalWidth;
                        thumbs_css_main = 'top';
//                        console.info(navHeight);
                        _navMain.css({'top': nav_arrow_size
                            , 'height': navHeight, 'width': '100%'
                            , 'left': ''
                        });
                        _mainNavigation.children('.thumbs-arrow-left').css({
                            'top': nav_arrow_size / 2
                            ,'left': ''
                        });
                        _mainNavigation.children('.thumbs-arrow-right').css({
                            'top': 'auto'
                            , 'bottom': nav_arrow_size / 2 - 10
                            ,'left': ''
                        });
                        nav_main_consize = navHeight;
                    }


                    nav_main_totalsize = nrChildren * thumbs_thumb_var + (nrChildren - 1) * menuitem_space;
                    aux1 = (((((thumbs_total_var - nav_arrow_size * 2) / (thumbs_thumb_var + menuitem_space)) * (thumbs_thumb_var + menuitem_space)))) - ((((parseInt((thumbs_total_var - nav_arrow_size * 2) / (thumbs_thumb_var + menuitem_space))) * (thumbs_thumb_var + menuitem_space))));

                    nav_page_size = menuitem_width+menuitem_space ;
                    nav_max_pages = nav_main_totalsize / thumbs_thumb_var;

                    nav_pages_visible = Math.floor(nav_main_consize / thumbs_thumb_var) ;

                    thumbs_per_page = Math.floor(nav_page_size / (thumbs_thumb_var + menuitem_space));
                    nav_max_pages = (Math.ceil(nav_max_pages));
                    nav_max_pages = nav_max_pages - nav_pages_visible;
                    nav_excess_thumbs = (nav_main_totalsize - (nav_max_pages - 1) * nav_page_size);


                    // console.info(cgallery, 'nav_main_totalsize --- ',nav_main_totalsize, thumbs_thumb_var, 'nav_pages_visible - ',nav_pages_visible);
                    // console.info('nav_page_size vars - ', thumbs_total_var, nav_arrow_size, aux1);
                    // console.info('nav_max_pages - ',nav_max_pages);

                    if (nav_main_totalsize < nav_main_consize) {
                        _mainNavigation.children('.thumbs-arrow-left').hide();
                        _mainNavigation.children('.thumbs-arrow-right').hide();
                    }



                }


                if(o.nav_type=='thumbs'){
                    if (menu_position == 'bottom' || menu_position == 'top') {
                        //console.log(_navCon.width())
                        navWidth = 0;
                        _navCon.children().each(function(){
                            var _t = $(this);
                            navWidth+=_t.outerWidth(true);
                        });



                        if(navWidth > totalWidth){
                            _navMain.unbind('mousemove', handleMouse);
                            _navMain.bind('mousemove', handleMouse);

                        }else{

                            cgallery.addClass('navWidth-bigger-then-totalWidth')
                            _navCon.css({'left' : ''})
                            _navMain.unbind('mousemove', handleMouse);

                        }
                    }
                    if (menu_position == 'left' || menu_position == 'right') {




                        //console.log(_navCon.width())
                        navHeight = 0;
                        navHeight = _navCon.outerHeight();

                        //console.info('navHeight - ',navHeight);
//                        console.info(navHeight);
                        if(navHeight > totalHeight){
                            _navMain.unbind('mousemove', handleMouse);
                            _navMain.bind('mousemove', handleMouse);
                        }else{
                            _navCon.css({'top' : ''})
                            _navMain.unbind('mousemove', handleMouse);
                        }
                    }

                }
                //===END calculate dims for navigation / mode-normal


                if(o.nav_type=='outer'){
                    _mainNavigation.css({
                        'top':0,
                        'left':0,
                        'height':'auto'
                    });
                    _navMain.css({
                        //'height':'auto'
                    })
                    _sliderMain.css({
                        'top':0,
                        'left':0
                    })
                    cgallery.css({
                        'height':'auto'
                    })
                    _navCon.children().css({
                        'top' : 0,
                        'left' : 0,
                        'width' : '',
                        'height' : ''
                    });

                    if(menu_position=='right'){
                        _sliderMain.css({
                            'overflow':'hidden'
                        })
                    }
                    if(menu_position=='left'){
                        _sliderMain.css({
                            'overflow':'hidden'
                        })
                    }
                }




                if (o.settings_mode == 'normal') {
                    hpos = 0;
                    wpos =0 ;

                    _navCon.children('.navigationThumb').unbind('click', click_navCon_item);
                    _navCon.children('.navigationThumb').bind('click', click_navCon_item);


                    _navCon.children('.navigationThumb').css({
                        'width': menuitem_width,
                        'height': menuitem_height
                    });

                    //console.info('menuitem_height - ',menuitem_height);

                    if(menuitem_height==0){
                        _navCon.children('.navigationThumb').css({
                            'height':''
                        });
                    }

                    if(isNaN(menuitem_height) == false && menuitem_height>0){
                        if(cgallery.hasClass('skin-aurora')){
                            _navCon.find('.navigationThumb .menu-desc').css({
                                'max-height': menuitem_height
                            })
                        }
                    }
                }

                if(o.nav_type=='scroller'){

                    if(menu_position=='top' || menu_position=='bottom'){
                        navWidth = 0;
                        _navCon.children().each(function(){
                            var _t = $(this);
                            navWidth+=_t.outerWidth(true);
                        });
                        _navCon.width(navWidth);
                    }
                }


                if(o.settings_mode=='normal'){
                    if(menu_position=='right' || menu_position=='bottom' || menu_position=='left'){
                        cgallery.find('.gallery-buttons').css({
                            'top':0
                        });
                        cgallery.find('.the-logo').css({
                            'top':10
                        });
                    }
                    if(menu_position=='top' || menu_position=='bottom' || menu_position=='left'){
                        cgallery.find('.gallery-buttons').css({
                            'right':0
                        });
                        cgallery.find('.the-logo').css({
                            'right':50
                        });
                    }

                    //console.info(menu_position,  (Number(o.menuitem_width) + Number(o.nav_space)));

                    if (menu_position == 'right') {

                        _gbuttons.css({
                            'right': (Number(o.menuitem_width) + Number(o.nav_space)) + 'px'
                        });
                        if (cgallery.find('.the-logo').length > 0) {
                            cgallery.find('.the-logo').css({
                                'right': (Number(o.menuitem_width) + Number(o.nav_space) + 60) + 'px'
                            });
                        }
                    }
                    if (menu_position == 'top') {
                        _gbuttons.css({
                            'top': (Number(o.menuitem_height) + Number(o.nav_space)) + 'px'
                        });
                        if (cgallery.find('.the-logo').length > 0) {
                            cgallery.find('.the-logo').css({
                                'top': (Number(o.menuitem_height) + Number(o.nav_space) + 10) + 'px'
                                , 'right': (60) + 'px'
                            });
                        }
                    }
                }








                //====== calculateDims() END
            }

            function handle_orientationchange(){
                setTimeout(function(){
                    handleResize();
                },1000);
            }

            function handleResize(e,pargs) {
                ww = $(window).width();
                wh = $(window).height();

                conw = _rparent.width();






                if(cgallery.hasClass('try-breakout')){
                    cgallery.css('width',ww+'px');

                    cgallery.css('margin-left','0');

                    //console.info(cgallery, cgallery.get(0).offsetLeft, cgallery.offset().left, _theTarget.offset().left)

                    if(cgallery.offset().left>0){
                        cgallery.css('margin-left','-'+cgallery.offset().left+'px');
                    }
                }



                if(cgallery.hasClass('try-height-as-window-minus-offset')){

                    var aux = wh - cgallery.offset().top;

                    if(aux<300){

                        cgallery.css('height',aux+'px');
                    }else{
                        cgallery.css('height','90vh')
                    }
                    //console.info('ceva', aux);

                }

                // console.info('handleResize() gallery - ', cgallery);

                //console.log('ceva', ww, wh, conw, conh, totalWidth, totalHeight, (conw/totalWidth));
                //console.log(o.responsive_mode, totalWidth, totalHeight);
                calculateDims();


                if (o.settings_mode == 'wall') {

                    if($.fn.masonry){

                        if(_sliderCon.hasClass('masonry-inited')) {
                            _sliderCon.masonry('layout');
                        }
                        // _sliderCon.masonry("layout");
                    }
                }

                //alert(currVideo);
                if(currVideo){
                    handleResize_currVideo();
                }

            }

            function handleResize_currVideo(e, pargs){




                var margs = {
                    'force_resize_gallery' : true
                    ,'call_from' : 'default'
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                margs.call_from+='_handleResize_currVideo';

                // console.info(currVideo);
                if((currVideo) && currVideo.get(0) && (currVideo.get(0).api_handleResize)){


                    // console.info('call resize from vgallery');
                    currVideo.get(0).api_handleResize(null,margs);
                }
            }

            function pause_currVideo(e, pargs){




                var margs = {
                    'force_resize_gallery' : true
                    ,'call_from' : 'default'
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                margs.call_from+='_pause_currVideo';

                if((currVideo) && (currVideo.get(0).api_pauseMovie)){


                    // console.info('call resize from vgallery');
                    currVideo.get(0).api_pauseMovie(margs);
                }
            }


            function api_currVideo_refresh_fsbutton(argcol){
                if(typeof(currVideo)!="undefined" && typeof(currVideo.get(0))!="undefined" && typeof(currVideo.get(0).api_currVideo_refresh_fsbutton)!="undefined"){
                    currVideo.get(0).api_currVideo_refresh_fsbutton(argcol);
                }
            }


            function randomise(arg, max) {
                arg = parseInt(Math.random() * max);
                var sw = 0;
                for (var j = 0; j < used.length; j++) {
                    if (arg == used[j])
                        sw = 1;
                }
                if (sw == 1) {
                    randomise(0, max);
                    return;
                } else
                    used.push(arg);
                return arg;
            }


            function animate_menu_y(viewIndex){



                //console.info(finish_viy);

                if(is_ios()==false && is_android()==false){
                    if(o.design_navigationUseEasing!='on'){

                        if ($('html').hasClass('supports-translate')) {
                            _navCon.css({
                                '-webkit-transform': 'translate3d(0, '+finish_viy+'px, 0)'
                                ,'transform': 'translate3d(0, '+finish_viy+'px, 0)'
                            });
                        }else{
                            _navCon.css({
                                'top': finish_viy
                            });
                        }
                    }


                }
            }

            function handle_frame(){


                if(isNaN(target_viy)){
                    target_viy=0;
                }

                if(duration_viy===0){
                    requestAnimFrame(handle_frame);
                    return false;
                }

                if(nav_thumbs_dir_ver){
                    begin_viy = target_viy;
                    change_viy = finish_viy - begin_viy;


                    target_viy = Number(Math.easeIn(1, begin_viy, change_viy, duration_viy).toFixed(4));;


                    //console.info(finish_viy);

                    if(is_ios()==false && is_android()==false){
                        _navCon.css({
                            'transform': 'translate3d(0,'+target_viy+'px,0)'
                        });
                    }

                }

                //console.info(_blackOverlay,target_bo);;

                requestAnimFrame(handle_frame);
            }

            function handleMouse(e) {
                //handle mouse for the _navCon element
                var menuAnimationSw = true;
                var offsetBuffer = 70;
                navMain_mousey = (e.pageY - _navMain.offset().top)
                navMain_mousex = (e.pageX - _navMain.offset().left)
                var viewIndex = 0
                    , viewMaxH
                    ;
//                console.info(mouseX,mouseY, is_android())
                if (is_ios() == false && is_android() == false) {
                    if (menu_position == 'right' || menu_position == 'left') {
                        viewMaxH = (navHeight) - totalHeight;
                        finish_viy = (navMain_mousey / totalHeight) * -(viewMaxH + offsetBuffer * 2) + offsetBuffer;
                        //finish_viy = parseInt(viewIndex, 10);


                        //console.info(finish_viy);
                        if (finish_viy > 0)
                            finish_viy = 0;
                        if (finish_viy < -viewMaxH)
                            finish_viy = -viewMaxH;


                        if(o.design_navigationUseEasing=='on'){

                        }else{



                            animate_menu_y(viewIndex);
                        }

                        nav_thumbs_dir_ver = true;
                        nav_thumbs_dir_hor = false;



                    }
                    if (menu_position == 'bottom' || menu_position == 'top') {

                        viewMaxH = navWidth - totalWidth;
                        viewIndex = ((navMain_mousex / totalWidth) * -(viewMaxH + offsetBuffer * 2) + offsetBuffer) / currScale;
                        viewIndex = parseInt(viewIndex, 10);
                        if (viewIndex > 0)
                            viewIndex = 0;
                        if (viewIndex < -viewMaxH)
                            viewIndex = -viewMaxH;
                        var aux = {'-webkit-transform': ('translateX(' + viewIndex + 'px)'), '-moz-transform': ('translateX(' + viewIndex + 'px)')};
                        if ($('html').hasClass('supports-translate')) {
                            _navCon.css({
                            });
                        } else {
                        }
                        _navCon.css({
                            'left': viewIndex
                            ,'top' : ''
                            ,'transform' : ''
                        });



                        nav_thumbs_dir_hor = true;
                        nav_thumbs_dir_ver = false;
                        //_navCon.animate({'left' : -((e.pageX-_navMain.offset().left)/totalWidth * (((o.menuitem_width + o.menuitem_space)*nrChildren) - totalWidth))	}, {queue:false, duration:100});
                    }

                }else{
//                    console.info('ceva');
                    return false;
                }

            }

            function click_navCon_item(e) {
                //console.info('click_navCon_item')
                var _t = $(this);

                var cclass= '';

                if(_t.hasClass('navigationThumb')){
                    cclass='.navigationThumb';
                }

                if(_t.get(0) && _t.get(0).nodeName!="A"){
                    gotoItem(_navCon.children(cclass).index(_t));

                }else{
                    if(currVideo && currVideo.get(0) && typeof(currVideo.get(0).api_pauseMovie)!="undefined"){
                        currVideo.get(0).api_pauseMovie({
                            'call_from':'click_navCon_item()'
                        });
                    }

                }

            }

            function handle_scroll(){
                //console.log(loaded);
                if(loaded==false){




                    var st = $(window).scrollTop();
                    var cthis_ot = cgallery.offset().top;

                    var wh = window.innerHeight;


                    // console.info(cthis_ot, st+wh);


                    if(cthis_ot<st+wh+50){
                        init();
                    }


                    return;
                }else{

                    var _t = $(this);//==window
                    wh = $(window).height();
                    //console.log(_t.scrollTop(), wh, cgallery.offset().top, cgallery.height(), ind_ajaxPage, o.settings_separation_pages, _t.scrollTop() + wh, (cgallery.offset().top + cgallery.height() - 10), (_t.scrollTop() + wh) > (cgallery.offset().top + cgallery.height() - 10), ind_ajaxPage, o.settings_separation_pages.length ) ;

                    if(busy_ajax==true || ind_ajaxPage >= o.settings_separation_pages.length){
                        return;
                    }



                    if( (_t.scrollTop() + wh) > (cgallery.offset().top + cgallery.height() - 10) ){
                        //console.info('ALCEVA');
                        ajax_load_nextpage();
                    }
                }

            }
            function click_btn_ajax_loadmore(e){

                if(busy_ajax==true || ind_ajaxPage >= o.settings_separation_pages.length){
                    return;
                }
                ajax_load_nextpage();
            }

            function ajax_load_nextpage(){

                //console.log('ajax_load_nextpage');
                cgallery.parent().children('.preloader').fadeIn('slow');

                $.ajax({
                    url : o.settings_separation_pages[ind_ajaxPage],
                    success: function(response) {
                        if(window.console !=undefined ){ console.log('Got this from the server: ' + response); }
                        setTimeout(function(){

                            cgallery.append(response);
                            //setTimeout(reinit, 1000);
                            reinit();
                            setTimeout(function(){
                                busy_ajax = false ;
                                cgallery.parent().children('.preloader').fadeOut('slow');
                                ind_ajaxPage++;


                                if(ind_ajaxPage >= o.settings_separation_pages.length){
                                    cgallery.children('.btn_ajax_loadmore').fadeOut('slow');
                                }




                            }, 1000);
                        }, 1000);
                    },
                    error:function (xhr, ajaxOptions, thrownError){
                        if(window.console !=undefined ){ console.error('not found ' + ajaxOptions); }
                        ind_ajaxPage++;
                        cgallery.parent().children('.preloader').fadeOut('slow');

                    }
                });

                busy_ajax = true ;
            }

            function gotoItem(arg, pargs) {
//                console.log(_sliderCon.children().eq(arg), currNr, arg, busy_transition);
//                 console.log('gotoItem() - ', currNr, arg, busy_transition);





                var margs = {

                    'ignore_arg_currNr_check' : false
                    ,'ignore_linking' : false // -- does not change the link if set to true
                    ,donotopenlink : "off"
                }

                if(pargs){
                    margs = $.extend(margs,pargs);
                }



                if (currNr == arg || busy_transition == true || ad_playing){
                    return false;
                }
                var transformed = false; //if the video is already transformed there is no need to wait





                var _c = _sliderCon.children().eq(arg);
                currVideo = _c;
                var index = _c.parent().children().index(_c);


                // console.info(index, _c);




                if(_c.attr('data-type')=='link' && (margs.donotopenlink!='on')){


                    // --- history API ajax cool stuff
                    if(o.settings_enableHistory=='on' && can_history_api()){
                        var stateObj = { foo: "bar" };
                        history.pushState(stateObj, "Gallery Video", _c.attr('data-src'));

                        //jQuery('.history-video-element').load(_c.attr('data-src') + ' .history-video-element');

                        $.ajax({
                            url : _c.attr('data-src'),
                            success: function(response) {
                                if(window.console !=undefined ){ console.info('Got this from the server: ' + response); }
                                setTimeout(function(){
                                    //console.log(jQuery(response).find('.history-video-element').eq(0).get(0).innerHTML);

                                    $('.history-video-element').eq(0).html($(response).find('.history-video-element').eq(0).html());


                                    $('.toexecute').each(function(){
                                        var _t = $(this);
                                        if(_t.hasClass('executed')==false){
                                            eval(_t.text());
                                            _t.addClass('executed');
                                        }
                                    });


                                    if(o.settings_ajax_extraDivs!=''){
                                        var extradivs = String(o.settings_ajax_extraDivs).split(',');

                                        for(i=0;i<extradivs.length;i++){
                                            //console.log(extradivs[i], jQuery(response).find(extradivs[i]));
                                            $(extradivs[i]).eq(0).html(jQuery(response).find(extradivs[i]).eq(0).html());
                                        }
                                    }

                                    //console.log(jQuery(response)); console.log(jQuery('.toexecute'));
                                    //jQuery('.history-video-element').eq(0).get(0).innerHTML = jQuery(response).find('.history-video-element').eq(0).get(0).innerHTML;
                                    //eval(jQuery('.toexecute').text());
                                }, 100);
                            },
                            error:function (xhr, ajaxOptions, thrownError){
                                if(window.console !=undefined ){ console.error('not found ' + ajaxOptions); }
                                ind_ajaxPage++;
                                cgallery.children('.preloader').fadeOut('slow');

                            }
                        });
                        /*
                         */

                        return false;
                    }else{
                        //window.location = _c.attr('data-src');
                    }
//                    return;


                }

                if(_c.attr('data-type')!='link'){
                    if(margs.ignore_linking==false && o.settings_enable_linking=='on'){
                        var stateObj = { foo: "bar" };
                        history.pushState(stateObj, null, add_query_arg(window.location.href, 'dzsvg_startitem_'+cid, (arg)));
                    }
                }


                if (currNr > -1) {
                    var _c2 = _sliderCon.children().eq(currNr);
                    //console.log(_c2);

                    // --- if on iPad or iPhone, we disable the video as it had runed in a iframe and it wont pause otherwise

                    //console.log(_c2.attr('data-type'))
                    _c2.addClass('transitioning-out');

                    if (_c2.attr('data-type') == 'inline' || (_c2.attr('data-type') == 'youtube' && o.videoplayersettings['settings_youtube_usecustomskin']!='on')){

                    }
                    //console.log(_c2, arr_inlinecontents);

                    //console.log(o.videoplayersettings);


                    //console.info(o.videoplayersettings['settings_youtube_usecustomskin']);
                    if (o.settings_mode=='normal' && ( is_ios() || _c2.data('isflash') == 'on' || _c2.attr('data-type') == 'inline' || (_c2.attr('data-type') == 'youtube' && o.videoplayersettings['settings_youtube_usecustomskin']!='on')  || (_c2.attr('data-type') == 'youtube' && is_android() ) ) ) {
                        setTimeout(function() {
                            _c2.find('.video-description').remove();
                            arr_inlinecontents[currNr] = _c2.html();
                            _c2.html('');
                            _c2.removeClass('vplayer');
                            _c2.addClass('vplayer-tobe');

                        }, 1000);
                    }
                    ;
                }


                // console.info('o.autoplay_ad - ',o.autoplay_ad)
                if(o.autoplay_ad=='on'){

                    setup_ad(_c);

                    _c.data('adplayed','on');
                }else{

                    _c.data('adplayed','off');
                }




                if (_c.hasClass('vplayer')) {
                    transformed = true;
                }


                // console.info('_c - ',_c);
                _c.addClass('transitioning-in');
                if (_c.hasClass('vplayer-tobe')) {

                    //console.log(_c);
                    _c.addClass('in-vgallery');
                    o.videoplayersettings['videoWidth'] = videoWidth;
                    o.videoplayersettings['videoHeight'] = '';

                    if(o.logo){
                        _c.children('.vplayer-logo').remove();
                    }

                    //console.log(videoWidth, videoHeight);
                    //console.log(currNr, o.cueFirstVideo, o.autoplay);
                    if (currNr == -1 && o.cueFirstVideo == 'off') {
                        o.videoplayersettings.cueVideo = 'off';
                    } else {
                        o.videoplayersettings.cueVideo = 'on';
                    }
                    if (currNr == -1) {
                        if (o.autoplay == 'on') {
                            o.videoplayersettings['autoplay'] = 'on';
                        } else {
                            o.videoplayersettings['autoplay'] = 'off';
                        }

                    }
                    //-- if it's not the first video
                    if (currNr > -1) {
                        if (o.autoplayNext == 'on') {
                            o.videoplayersettings['autoplay'] = 'on';
                            o.videoplayersettings['cueVideo'] = 'on';
                        } else {
                            o.videoplayersettings['autoplay'] = 'off';
                        }
                    }
                    if (ad_playing == true) {
                        o.videoplayersettings['autoplay'] = 'off';
                    }


                    o.videoplayersettings['settings_disableControls'] = 'off';


                    if (typeof(arr_inlinecontents[arg]) != 'undefined' && arr_inlinecontents[arg] != '') {
                        //console.log(arr_inlinecontents, arr_inlinecontents[arg]);
                        o.videoplayersettings.htmlContent = arr_inlinecontents[arg];
                    } else {
                        o.videoplayersettings.htmlContent = '';
                    }

                    o.videoplayersettings.gallery_object = cgallery;

                    //console.log(o.videoplayersettings);

                    // console.info("CONVERT IT");
                    if(o.settings_disableVideo=='on'){
                    }else{
                        //console.log(o.videoplayersettings);

                        //console.info(_c);
                        _c.vPlayer(o.videoplayersettings);

                    }
                }else{

                    if (o.autoplayNext == 'on') {
                        if(typeof _c.get(0)!='undefined' && typeof _c.get(0).externalPlayMovie!='undefined'){
                            _c.get(0).externalPlayMovie({
                                'call_from':'autoplayNext'
                            });
                        }

                    }

                    // -- we force a resize on the player just in case it has an responsive ratio


                    setTimeout(function(){
                        if(typeof _c.get(0)!='undefined' && _c.get(0).api_handleResize){

                            _c.get(0).api_handleResize(null,{
                                force_resize_gallery : true
                            })
                        }
                    },250)

                }









                prevNr = arg - 1;
                if (prevNr < 0) {
                    prevNr = _sliderCon.children().length - 1;
                }
                nextNr = arg + 1;
                if (nextNr > _sliderCon.children().length - 1) {
                    nextNr = 0;
                }


                if (o.nav_type == 'thumbsandarrows') {

                }
                if (o.settings_mode == 'normal') {
                    _c.css('display','');
                }
                if (o.settings_mode == 'rotator3d') {
                    _sliderCon.children().removeClass('nextItem').removeClass('prevItem');
                    _sliderCon.children().eq(nextNr).addClass('nextItem');
                    _sliderCon.children().eq(prevNr).addClass('prevItem');
                }
                if (o.settings_mode == 'rotator') {

                    if (currNr > -1) {

                    }
                    var _descCon = _navMain.children('.descriptionsCon');
                    _descCon.children('.currDesc').removeClass('currDesc').addClass('pastDesc');
                    _descCon.append('<div class="desc">' + _c.find('.menuDescription').html() + '</div>');
                    setTimeout(function() {
                        _descCon.children('.desc').addClass('currDesc');
                    }, 20)

                    //console.log(_c);
                }




//                console.info(currNr, transformed);

                last_arg = arg;
                if (currNr == -1 || transformed) {
                    the_transition();
                } else {
                    cgallery.parent().children('.preloader').fadeIn('fast');
//                    the_transition();
                    inter_start_the_transition = setTimeout(the_transition, 1000, arg);
                }


                if(o.settings_secondCon){
//                    console.info($(o.settings_secondCon).find('.item').eq(arg).outerHeight(false));
                    $(o.settings_secondCon).find('.item').removeClass('active');
                    $(o.settings_secondCon).find('.item').eq(arg).addClass('active');
                    $(o.settings_secondCon).find('.dzsas-second-con--clip').css(
                        {
                            'height': $(o.settings_secondCon).find('.item').eq(arg).outerHeight(false)
                            ,'left' : -(arg*100)+'%'
                        }
                    );
                }
                if(o.settings_outerNav){
                    $(o.settings_outerNav).find('.videogallery--navigation-outer--block ').removeClass('active');
                    $(o.settings_outerNav).find('.videogallery--navigation-outer--block ').eq(arg).addClass('active');
                }

                if(cgallery.hasClass('responsive-ratio-smooth')){
                    if(!_c.attr('data-responsive_ratio')){
                        responsive_ratio_resize_h(initial_h);
                    }else{
                        $(window).trigger('resize');
                    }
//                    responsive_ratio_resize_h(initial_h);
                }


                /*
                 if(is_ios()){
                 //	console.log(currNr, arg);

                 }else{
                 if(currNr>-1) {




                 }
                 */

                cgallery.removeClass('hide-players-not-visible-on-screen');
                setTimeout(function(){

                    cgallery.addClass('hide-players-not-visible-on-screen');
                    _sliderCon.find('.transitioning-in').removeClass('transitioning-in');
                    _sliderCon.find('.transitioning-out').removeClass('transitioning-out');
                },400);
                firsttime = false;
                busy_transition = true;

                return true;
            }

            function hide_all_videos_but_curr(){
                if(o.settings_mode=='normal'){

                    _sliderCon.children().each(function(){
                        var _t = $(this);

                        if(_t.hasClass('currItem')==false){
                            _t.hide();
                        }
                    })
                }
            }


            function setup_ad(arg){
                // -- challery

                // console.info("SETUP_AD()");

                var _c = arg;

                // console.info('adding ad - ',_c.attr('data-adsource'), _c.find('.adSource').length>0,(_c.attr('data-adsource') ||  _c.find('.adSource').length>0 ), ( is_ios() && o.videoplayersettings.settings_ios_usecustomskin=='on' ) );


                //!is_ios() ||

                if ( (_c.attr('data-adsource') ||  _c.find('.adSource').length>0 ) && !( is_ios() && o.videoplayersettings.settings_ios_usecustomskin!='on' )) {
                    // console.info('adding ad');
                    //advertisment
                    var aux = '<div class="vplayer-tobe"';

                    //data-source="video/test.m4v"
                    if (_c.attr('data-adsource') != undefined) {
                        aux += ' data-src="' + _c.attr('data-adsource') + '"';
                    }
                    if (_c.attr('data-adsource_ogg') != undefined) {
                        aux += ' data-sourceogg="' + _c.attr('data-adsource_ogg') + '"';
                    }
                    if (_c.attr('data-adtype') != undefined) {
                        aux += ' data-type="' + _c.attr('data-adtype') + '"';
                    }
                    if (_c.attr('data-adlink') != undefined) {
                        aux += ' data-adlink="' + _c.attr('data-adlink') + '"';
                    }
                    if (_c.attr('data-adtitle') != undefined) {
                        aux += ' data-videoTitle="' + _c.attr('data-adtitle') + '"';
                    }
                    if (_c.attr('data-adskip_delay') != undefined) {
                        aux += ' data-adskip_delay="' + _c.attr('data-adskip_delay') + '"';
                    }


                    aux += '>';


                    if (_c.attr('data-adtype') == 'inline') {

                        if(_c.find('.adSource').length>0){
                            aux+= _c.find('.adSource').eq(0).html();
                        }else{
                            aux+= _c.attr('data-adsource');
                        }
                    }

                    aux+='</div>';
                    _adSpace.show();
                    _adSpace.append(aux);
//                    console.info(aux);


                    var auxoptions = $.extend(true,{},o.videoplayersettings);;
                    auxoptions['videoWidth'] = totalWidth;
                    auxoptions['videoHeight'] = totalHeight;
                    auxoptions['is_ad'] = 'on';


                    auxoptions.autoplay= 'on';
                    auxoptions.settings_disableControls = 'on';
                    auxoptions.gallery_object = cgallery;



                    ad_playing = true;
//                    console.info(auxoptions);

                    if(is_android()){
                        auxoptions['autoplay']='off';
                    }


                    _adSpace.children('.vplayer-tobe').addClass('is-ad');
                    _adSpace.children('.vplayer-tobe').vPlayer(auxoptions);

//                    console.info(_adSpace);
//                    return;
                }
            }



            function the_transition() {
                if(sw_transition_started){
                    return;
                }

                var arg = last_arg;


                var _c = _sliderCon.children().eq(arg);

                sw_transition_started = true;
                clearTimeout(inter_start_the_transition);
                cgallery.parent().children('.preloader').fadeOut('fast');


                _sliderCon.children().removeClass('currItem');
                if(currNr==-1){
                    _c.addClass('currItem');
                    _c.addClass('no-transition');
                    setTimeout(function(){
                        _sliderCon.children().eq(currNr).removeClass('no-transition')
                    })
                }else{

                    if(currNr!=arg){

                        _sliderCon.children().eq(currNr).addClass('transition-slideup-gotoTop')
                    }else{

                        _sliderCon.children().eq(currNr).addClass('currItem');
                    }


                }

                setTimeout(setCurrVideoClass, 100);
                _navCon.children().removeClass('active');
                _navCon.children().eq(arg).addClass('active');

                if(o.nav_type=='thumbs' || o.nav_type=='scroller' || o.nav_type=='thumbsandarrows'){

                    _navCon.children('.navigationThumb').removeClass('active');
                    _navCon.children('.navigationThumb').eq(arg).addClass('active');
                }


//                console.info(arg, _navCon.children().eq(arg));

                setTimeout(function(){
                    $('window').trigger('resize');
                    _sliderCon.children().removeClass('transition-slideup-gotoTop');
                },1000);

                if (is_ios() && currNr > -1) {
                    if (_sliderCon.children().eq(currNr).children().eq(0).length > 0 && _sliderCon.children().eq(currNr).children().eq(0)[0] != undefined) {
                        if (_sliderCon.children().eq(currNr).children().eq(0)[0].tagName == 'VIDEO') {
                            _sliderCon.children().eq(currNr).children().eq(0).get(0).pause();
                        }
                    }
                }


                handle_stopCurrVideo();
                currNr = arg;

                setTimeout(function(){

                    busy_transition = false;
                    sw_transition_started = false;
                    hide_all_videos_but_curr();
                }, 400);
            } // end the_transition()

            function setCurrVideoClass(){
                currVideo.addClass('currItem');
            }
            function handle_stopCurrVideo() {
                if (!is_ios() && !is_ie8() && currNr > -1) {
                    if (_sliderCon.children().eq(currNr).get(0) && _sliderCon.children().eq(currNr).get(0).externalPauseMovie){
                        _sliderCon.children().eq(currNr).get(0).externalPauseMovie({
                            'call_from':'external_handle_stopCurrVideo()'
                        });
                    }
                }
            }
            function click_embedhandle() {
                if (embed_opened == false) {
                    _gbuttons.find('.embed-button .contentbox').animate({
                        'right': 60
                    }, {queue: false, duration: 300});

                    _gbuttons.find('.embed-button .contentbox').fadeIn('fast');
                    embed_opened = true;
                } else {
                    _gbuttons.find('.embed-button .contentbox').animate({
                        'right': 50
                    }, {queue: false, duration: 300});

                    _gbuttons.find('.embed-button .contentbox').fadeOut('fast');
                    embed_opened = false;
                }
            }
            function click_sharehandle() {
                if (share_opened == false) {
                    _gbuttons.find('.share-button .contentbox').animate({
                        'right': 60
                    }, {queue: false, duration: 300});

                    _gbuttons.find('.share-button .contentbox').fadeIn('fast');
                    share_opened = true;
                } else {
                    _gbuttons.find('.share-button .contentbox').animate({
                        'right': 50
                    }, {queue: false, duration: 300});

                    _gbuttons.find('.share-button .contentbox').fadeOut('fast');
                    share_opened = false;
                }
            }
            function gotoPrev() {
                //console.log(cgallery);

                if(o.playorder=='reverse'){
                    gotoNext();
                    return;
                }

                var tempNr = currNr - 1;
                if (tempNr < 0) {
                    tempNr = _sliderCon.children().length - 1;
                }
                gotoItem(tempNr);


                if (o.nav_type == 'thumbsandarrows') {
                    if (Math.floor((tempNr) / thumbs_per_page) != currPage) {
                        gotoPage(Math.floor((tempNr) / thumbs_per_page))
                    }

                }

            }
            function gotoNext() {
                //console.log(cgallery);

                if(o.playorder=='reverse'){
                    gotoPrev();
                    return;
                }

                var tempNr = currNr + 1;
                if (tempNr >= _sliderCon.children().length) {
                    tempNr = 0;
                }
                gotoItem(tempNr);


                if (o.nav_type == 'thumbsandarrows') {
                    if (Math.floor((tempNr) / thumbs_per_page) != currPage) {
                        gotoPage(Math.floor((tempNr) / thumbs_per_page))
                    }


                }
            }
            function handleVideoEnd() {
                // -- cgallery
                //console.info(ad_playing);

                console.info('video end', ad_playing);
                if (ad_playing == true) {
                    _adSpace.children().animate({opacity: 0}, 300);
                    setTimeout(function() {
                        _adSpace.html('');
                        _adSpace.hide();
                    }, 400)
                    ad_playing = false;

//                    console.info(currVideo);
                    if(currVideo && typeof currVideo.get(0).externalPlayMovie!='undefined' && o.autoplayNext=='on' && is_ios()==false && is_android()==false){
                        currVideo.get(0).externalPlayMovie({
                            'call_from':'gallery - video end()'
                        });
                    }
                } else {

                    if(o.autoplayNext=='on'){

                        gotoNext();
                    }
                }


            }

            function turnFullscreen() {
                var _t = jQuery(this);
                //console.log(_t);
                return;
                _t.css({
                    'position': 'static'
                })
                _sliderMain.css({
                    'position': 'static'
                })
            }

            function mod_rotator3d_clickPreviewImg() {
                var _t = $(this);
                var ind = _t.parent().parent().children().index(_t.parent());
                //console.log(_t, ind);
                gotoItem(ind);
            }
            $.fn.turnNormalscreen = function() {
                $(this).css({
                    'position': 'relative'
                })
                _sliderMain.css({
                    'position': 'relative'
                })
                for (i = 0; i < nrChildren; i++) {
                    _sliderCon.children().eq(i).css({
                        'position': 'absolute'
                    })
                }
            }
            $.fn.vGallery.gotoItem = function(arg) {
//                gotoItem(arg);
            }
            return this;

        }); // end each
    }
    window.dzsvg_init = function(selector, settings) {

        if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
            var element_count = 0;
            for (var e in settings) { element_count++; }
            if(element_count==1){
                settings = undefined;
            }

            $(selector).each(function(){
                var _t = $(this);
                _t.vGallery(settings)
            });
        }else{
            $(selector).vGallery(settings);
        }
    };
    //==== deprecated
    window.zsvg_init = function(selector, settings) {
        $(selector).vGallery(settings);
    };

})(jQuery);



function vgcategories(arg){
    var carg = jQuery(arg);
    var currCatNr = -1;
    //console.log(carg);
    carg.find('.gallery-precon').each(function(){
        var _t = jQuery(this);
        //console.log(_t);
        _t.css({'display' : 'none'});
        carg.find('.the-categories-con').append('<span class="a-category">'+_t.attr('data-category')+'</span>')
    });

    carg.find('.the-categories-con').find('.a-category').eq(0).addClass('active');
    carg.find('.the-categories-con').find('.a-category').bind('click', click_category);
    function click_category(){
        var _t = jQuery(this);
        var ind = _t.parent().children('.a-category').index(_t);
        gotoCategory(ind);
        setTimeout(function(){
            jQuery(window).trigger('resize');
        },100);
    }

    //console.info(carg);

    var i2 = 0;

    carg.find('.gallery-precon').each(function(){
        var _t = jQuery(this);

        //console.info(_t);

        _t.find('.pagination-number').each(function(){
            var _t2 = jQuery(this);
            //console.log(_t2);

            var auxurl = _t2.attr('href');

            //console.log(auxurl);

            auxurl = add_query_arg(auxurl, carg.attr('id')+'_cat', NaN);

            //console.log(auxurl);

            auxurl = add_query_arg(auxurl, carg.attr('id')+'_cat', i2);

            _t2.attr('href', auxurl);
        })

        i2++;
    })

    var tempCat = 0;

    //console.info(window.location.href, carg.attr('id')+'_cat', get_query_arg(window.location.href, carg.attr('id')+'_cat'))

    if(get_query_arg(window.location.href, carg.attr('id')+'_cat')){
        tempCat = Number(get_query_arg(window.location.href, carg.attr('id')+'_cat'));
    }

    gotoCategory(tempCat);
    function gotoCategory(arg){
        if(currCatNr>-1 && carg.find('.gallery-precon').eq(currCatNr).find('.videogallery').eq(0).get(0)!=undefined && carg.find('.gallery-precon').eq(currCatNr).find('.videogallery').eq(0).get(0).external_handle_stopCurrVideo!=undefined ){
            carg.find('.gallery-precon').eq(currCatNr).find('.videogallery').eq(0).get(0).external_handle_stopCurrVideo();
        }
        carg.find('.gallery-precon').removeClass('curr-gallery');
        carg.find('.the-categories-con').find('.a-category').removeClass('active');
        carg.find('.the-categories-con').find('.a-category').eq(arg).addClass('active');
        carg.find('.gallery-precon').addClass('disabled');
        carg.find('.gallery-precon').eq(arg).css('display','').removeClass('disabled');

        setTimeout(function(){
            carg.children('.dzsas-second-con').hide();
            carg.children('.dzsas-second-con').eq(arg).show();


            //console.info(carg.find('.gallery-precon').eq(arg));

            carg.find('.gallery-precon').eq(arg).addClass('curr-gallery');

            currCatNr = arg;

            //console.log(carg.find('.gallery-precon').eq(arg).find('.videogallery').eq(0));
            if(typeof carg.find('.gallery-precon').eq(arg).find('.videogallery').eq(0).get(0) != 'undefined' && typeof carg.find('.gallery-precon').eq(arg).find('.videogallery').eq(0).get(0).api_handleResize != 'undefined'){
                carg.find('.gallery-precon').eq(arg).find('.videogallery').eq(0).get(0).api_handleResize();
                carg.find('.gallery-precon').eq(arg).find('.videogallery').eq(0).get(0).api_handleResize_currVideo();
            }
            setTimeout(function(){

                jQuery(window).trigger('resize');
            },1500);


        },50);





    }
}




//-------VIDEO PLAYER
var ytplayer;
(function($) {
    $.fn.vPlayer = function(o) {

        var defaults = {
            type: 'normal'
            ,autoplay: "off"
            ,autoplay_on_mobile_too_with_video_muted: "off" // -- will attempt to autoplay on mobile too, but with no sound
            ,videoWidth: 0
            ,videoHeight: 0
            ,design_scrubbarWidth: 'default'
            ,gallery_object: null // -- the gallery which invoked this
            ,parent_player: null // -- the player which invoked this
            ,design_skin: 'skin_default'
            , design_background_offsetw: 0
            , settings_youtube_usecustomskin: 'on'
            , settings_ios_usecustomskin: 'on'
            , cueVideo: 'on'
            , settings_disableControls: 'off'
            , is_ad: 'off'
            , settings_hideControls: 'off'
            , ad_link: ''
            , ad_show_markers: 'off' // -- show markers on the scrubbar
            , settings_suggestedQuality: 'hd720'
            , design_enableProgScrubBox: 'default'
            , settings_enableTags: 'on'
            , settings_disableVideoArray: 'off'
            , settings_makeFunctional: false
            ,settings_video_overlay: "off" //-- an overlay over the video that you can press for pause / unpause
            ,settings_big_play_btn: "off" // -- show a big play button centered on video paused
            ,video_description_style: "none" // -- choose how Video Description text shows
            , htmlContent: ''
            , settings_swfPath: 'preview.swf'
            ,settings_disable_mouse_out:'off'  // -- disable the normal mouse-is-out behaviour when mouse leaves the player
            ,settings_disable_mouse_out_for_fullscreen:'off'  // -- disable the normal mouse-is-out behaviour when mouse is in the player / fullscreen
            , controls_fscanvas_bg: '#aaa'
            , controls_fscanvas_hover_bg: '#ddd'
            , touch_play_inline: 'on'
            , google_analytics_send_play_event: 'off'
            , settings_video_end_reset_time: 'on' // -- when the video has ended, reset the time to 0
            ,settings_trigger_resize: '0' // -- a force trigger resize every x ms
            ,settings_mouse_out_delay: 100
            ,settings_mouse_out_delay_for_fullscreen: 1100
            ,rtmp_streamServer : '' // -- only for rtmp use ( advanced ) if you have a rtmp server
            ,playfrom : 'default' // play from a index , default means that this will be decided by the data-playfrom
            ,settings_subtitle_file : '' // -- set a subtitle file
            ,responsive_ratio : 'default' // -- set a responsive ratio height/ratio 0.5 means that the player height will resize to 0.5 of the gallery width
            ,action_video_play: null
            ,action_video_view: null // -- an external function that you can set to record a view of the video - will be only cast once on play
            ,action_video_contor_5secs: null // -- apply a function which fires once per second
            ,action_video_contor_10secs: null
            ,try_to_pause_zoomsounds_players: 'off'
        }


        if(typeof o =='undefined'){
            if(typeof $(this).attr('data-options')!='undefined' && $(this).attr('data-options')!=''){
                var aux = $(this).attr('data-options');
                aux = 'window.dzsvp_self_options = ' + aux;
                eval(aux);
                o = $.extend({},window.dzsvp_self_options);
                window.dzsvp_self_options = $.extend({},{});
            }
        }


        o = $.extend(defaults, o);
        //console.info(o);

        /*
         * the way the plugin works is.
         * first the markup is analyzed
         * then the init function
         * then the init_readyVideo function
         *
         */
        this.each(function() {

            var cthis
                ,cid = ''
                ,_cmedia
                ;
            var the_player_id = ''; // -- this is set only if the player actually has an id

            var controlsDiv;
            var videoWidth
                ,videoHeight
                ,last_videoWidth = 0
                ,last_videoHeight = 0
                , totalWidth
                , totalHeight;
            var video;
            var aux = 0;
            var aux2 = 0;
            var is_fullscreen = 0;
            var inter_videoReadyState // interval to check for time
                ,inter_checkytadend // interval to check on when the youtube video ad has ended
                ,inter_removeFsControls // interval to remove fullscreen controls when no action is detected
                ,inter_mousedownscrubbing = 0 // interval to apply mouse down scrubbing on the video
                ;
            var lastVolume;
            var defaultVolume;
            var infoPosX;
            var infoPosY;
            var wasPlaying = false;
            var autoplay = "off";
            var fScreenControls
                , playcontrols
                , _volumeControls
                , _volumeControls_real
                , info
                , infotext
                , scrubbar
                , _scrubBg
                , _timetext
                , _vpInner = null
                , _btnhd
                , _adSkipCon = null
                , _controlsBackground = null
                , _muteControls = null
                , _adContainer = null

                ;
            var paused = true
                ,played = false
                ,ad_playing = false
                ,mouseover = false // -- the mouse is over the vplayer
                ,initial_played = false
                ,google_analytics_sent_play_event = false
                ,volume_mouse_down = false
                ,scrub_mouse_down = false
                ,controls_are_hovered = false
                ,view_sent = false
                ,fullscreen_just_pressed = false
                ,has_ad_to_play = false
                ,loop = 'off'
                ,suspend_state_2_for_loop = false
                ;

            var scrubbar_moving_x = 0
                ,scrubbar_moving = false // -- touch
                ;

            var ie8paused = true;
            var totalDuration = 0;
            var time_curr = 0;
            var dataType = '';
            var dataFlash = '';
            var dataSrc = '';
            var dataVideoDesc = '';

            var video_title = '';

            var dash_player = null
                ,dash_context = null
                ,dash_inter_check_sizes = 0
                ;
            //responsive vars
            var conw
                , conh
                , newconh
                , _rparent
                , _vgparent
                , currScale = 1
                ;
            var ww
                , wh
                ;
            var yt_qualArray = []
                , yt_qualCurr
                , hasHD = false
                ;

            var arrTags = [];

            var ad_array = [];

            var bufferedLength = -1
                , bufferedWidthOffset = 0
                , volumeLength = 0
                , volumeWidthOffset = 0
                ,scrubbg_width = 0
                ;
            var time_counter_skipad = 0
                ,ad_status = 'undefined'
                ,inter_time_counter_skipad = 0
                ,inter_check_yt_iframe_ready = 0
                ,inter_clear_playpause_mistake = 0
                ;


            var busy_playpause_mistake = false
                ;

            var _controls_fs_canvas;

            var vimeo_data, vimeo_url;


            var dzsvg_translate_youcanskipto = 'you can skip to video in ';
            var translate_skipad = 'Skip Ad';

            var inter_10_secs_contor = 0
                ,inter_5_secs_contor = 0
                ;



            var svg_aurora_play_btn = '<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 13.75 12.982" enable-background="new 0 0 13.75 12.982" xml:space="preserve"> <path d="M11.889,5.71L3.491,0.108C3.389,0.041,3.284,0,3.163,0C2.834,0,2.565,0.304,2.565,0.676H2.562v11.63h0.003 c0,0.372,0.269,0.676,0.597,0.676c0.124,0,0.227-0.047,0.338-0.115l8.389-5.595c0.199-0.186,0.326-0.467,0.326-0.781 S12.088,5.899,11.889,5.71z"/> </svg>';



            var original_scrubwidth = 0;


            if(window.dzsvg_translate_youcanskipto!=undefined){ dzsvg_translate_youcanskipto = window.dzsvg_translate_youcanskipto;  }
            if(window.dzsvg_translate_skipad){ translate_skipad = window.dzsvg_translate_skipad; }

            cthis = $(this);


            if(typeof(cthis.attr('id'))!='undefined'){
                the_player_id = cthis.attr('id');
            }

            if(typeof cthis.attr('id')!='undefined' && cthis.attr('id')!=''){
                cid = cthis.attr('id');
            }else{
                cid = 'dzsvp'+parseInt(Math.random()*1000,10)
            }




            if (cthis.parent().parent().parent().hasClass('videogallery')) {
                _vgparent = cthis.parent().parent().parent();
            }


            //console.log(cthis, cthis.css('width'));

            autoplay = o.autoplay;

            //console.log(o);

            //==some sanitizing of the videoWidth and videoHeight parameters





            if (o.videoWidth == 0) {
                videoWidth = cthis.width();
            } else {
                videoWidth = o.videoWidth;
            }

            if (o.videoHeight == 0) {
                videoHeight = cthis.height();
            } else {
                videoHeight = o.videoHeight;
            }

            if(o.autoplay=='on'){
                autoplay = 'on';
            }

            if(is_mobile()){


                if(o.autoplay_on_mobile_too_with_video_muted=='on'){

                }else{

                    autoplay = 'off';
                }
                // o.autoplay='off';

            }


            //console.info(cthis, o.responsive_ratio);

//            console.info(Number(o.playfrom));
            if(o.playfrom=='default'){
                if(typeof cthis.attr('data-playfrom')!='undefined' && cthis.attr('data-playfrom')!=''){
                    o.playfrom = cthis.attr('data-playfrom');
                }
            }
            if(isNaN(Number(o.playfrom))==false){
                o.playfrom = Number(o.playfrom);
            }

            if(o.is_ad=='on'){
//                console.info(cthis);

                if(o.type=='youtube'){

                }
            }


            init();
            function init() {
                //console.info('init()', cthis);

                if (cthis.hasClass('vplayer-tobe')) {

                    //alert('ceva');
                    var _c = cthis;
                    _c.removeClass('vplayer-tobe');
                    _c.addClass('vplayer');

                    //console.log(autoplay, cthis);


                    if(o.settings_disableVideoArray!='on'){
                        dzsvp_players_arr.push(cthis);
                    }


                    var mainClass = '';
                    if (typeof(cthis.attr('class')) == 'string') {
                        mainClass = cthis.attr('class');
                    } else {
                        mainClass = cthis.get(0).className;
                    }

                    if (mainClass.indexOf('skin_') == -1) {
                        cthis.addClass(o.design_skin);
                        mainClass += ' ' + o.design_skin;
                    }


                    //console.info('scrubbar width - ',cthis, o.design_scrubbarWidth);
                    //-setting skin specific vars
                    if (mainClass.indexOf('skin_aurora') > -1) {
                        o.design_skin = 'skin_aurora';
                        bufferedWidthOffset = -2;
                        volumeWidthOffset = -2;
                        if (o.design_enableProgScrubBox == 'default') {
                            o.design_enableProgScrubBox = 'on';
                        }
                        if (o.design_scrubbarWidth == 'default') {
                            o.design_scrubbarWidth = -113;
                        }
                    }
                    if (mainClass.indexOf('skin_pro') > -1) {
                        o.design_skin = 'skin_pro';
                        bufferedWidthOffset = 0;
                        volumeWidthOffset = -2;
                        if (o.design_enableProgScrubBox == 'default') {
                            o.design_enableProgScrubBox = 'off';
                        }
                        if (o.design_scrubbarWidth == 'default') {
                            o.design_scrubbarWidth = 0;
                        }
                    }
                    if (mainClass.indexOf('skin_bigplay') > -1) {
                        o.design_skin = 'skin_bigplay';
                    }
                    if (mainClass.indexOf('skin_bigplay_pro') > -1) {
                        o.design_skin = 'skin_bigplay_pro';
                    }
                    if (mainClass.indexOf('skin_bluescrubtop') > -1) {
                        o.design_skin = 'skin_bluescrubtop';

                        if (o.design_scrubbarWidth == 'default') {
                            o.design_scrubbarWidth = 0;
                        }
                    }
                    if (mainClass.indexOf('skin_avanti') > -1) {
                        o.design_skin = 'skin_avanti';

                        if (o.design_scrubbarWidth == 'default') {
                            o.design_scrubbarWidth = -125;
                        }
                    }
                    if (mainClass.indexOf('skin_noskin') > -1) {
                        o.design_skin = 'skin_noskin';
                    }



                    if(cthis.hasClass('skin_white')){
                        o.design_skin='skin_white';
                    }
                    if(cthis.hasClass('skin_reborn')){
                        o.design_skin='skin_reborn';
                        if (o.design_scrubbarWidth == 'default') {
                            o.design_scrubbarWidth = -312;

                        }
                    }

//                    console.info(o.design_scrubbarWidth);
                    if (o.design_scrubbarWidth == 'default') {
                        o.design_scrubbarWidth = -201;
                    }

                    if(is_mobile()){
                        cthis.addClass('disable-volume');

                        if(o.design_skin=='skin_aurora'){
                            o.design_scrubbarWidth+=50;
                        }
                        if(o.design_skin=='skin_reborn'){
                            o.design_scrubbarWidth+=65;
                        }
                    }

                    original_scrubwidth = o.design_scrubbarWidth;




                    if (typeof _c.attr('data-src') == 'undefined' && typeof _c.attr('data-source') != 'undefined' && _c.attr('data-source') != '') {
                        _c.attr('data-src', _c.attr('data-source'));
                    }

                    var aux = '';
                    if(cthis.attr('data-ad-array')){
                        aux = cthis.attr('data-ad-array')
                        try{


                            // temp - try to remove slashes manually
                            aux = aux.replace(/{\\"/g,'{"');
                            aux = aux.replace(/\\":/g,'":');
                            aux = aux.replace(/:\\"/g,':"');
                            aux = aux.replace(/\\",/g,'",');
                            aux = aux.replace(/\\"}/g,'"}');
                            aux = aux.replace(/,\\"/g,',"');
                            ad_array = JSON.parse(aux);
                        }catch(err){
                            console.log('ad array parse error', aux);
                        }
                    }

                    //console.info('ad_array - ', aux);



                    if(typeof _c.attr('data-type')=='undefined' || _c.attr('data-type')=='' || _c.attr('data-type')=='detect'){
                        if(typeof _c.attr('data-src')){
                            if(String(_c.attr('data-src')).indexOf('youtube.com/watch?')>-1){
                                _c.attr('data-type','youtube');



                            }

                            if(String(_c.attr('data-src')).indexOf('youtube.com/embed')>-1){
                                _c.attr('data-type','youtube');



                            }
                            if(String(_c.attr('data-src')).indexOf('vimeo.com/')>-1){
                                _c.attr('data-type','vimeo');



                            }


                            if(String(_c.attr('data-src')).indexOf('.mp4')>-1){
                                _c.attr('data-type','normal');

                            }
                            if(String(_c.attr('data-src')).indexOf('.mpd')>String(_c.attr('data-src')).length-5){
                                _c.attr('data-type','dash');

                            }

                        }
                    }



                    //console.info('type is ',_c.attr('data-type'));

                    if (_c.attr('data-type') == 'youtube') {
                        o.type = 'youtube';
                    }
                    if (_c.attr('data-type') == 'video') {
                        o.type = 'normal';
                    }
                    if (_c.attr('data-type') == 'dash') {
                        o.type = 'dash';
                    }
                    if (_c.attr('data-type') == 'vimeo') {
                        o.type = 'vimeo';
                    }
                    if (_c.attr('data-type') == 'image') {
                        o.type = 'image';
                    }
                    if (_c.attr('data-type') == 'audio') {
                        o.type = 'audio';
                    }
                    if (_c.attr('data-type') == 'inline') {
                        o.type = 'inline';
                    }
                    // console.log('ad_link1 - ' ,o.ad_link);
                    if (_c.attr('data-adlink')) {



                        o.ad_link = _c.attr('data-adlink');
                    }
                    _rparent = cthis.parent();

                    // console.log('ad_link2 - ' ,o.ad_link);


                    if(cthis.attr('data-type')=='youtube'){

                        if(_global_youtubeIframeAPIReady==false && dzsvp_yt_iframe_settoload==false){
                            var head= document.getElementsByTagName('head')[0];
                            var script= document.createElement('script');
                            script.type= 'text/javascript';
                            script.src= 'https://www.youtube.com/iframe_api';
                            head.appendChild(script);
                            dzsvp_yt_iframe_settoload=true;
                        }
                    }

//                    console.info(cthis, o, o.settings_disableControls);

                    if (o.type == 'inline') {

                        //console.info(o);
                        if (o.htmlContent != '') {
                            cthis.html(o.htmlContent);
                        }

                        if (cthis.children().length > 0) {
                            var _cach = cthis.children().eq(0);
                            if (_cach.get(0) != undefined) {
                                if (_cach.get(0).nodeName == 'IFRAME') {
                                    _cach.attr('width', '100%');
                                    _cach.attr('height', '100%');
                                }
                            }
                        }
                    }


                    if(o.is_ad=='on'){
//                console.info(cthis);

                        if(o.type=='youtube' && is_touch_device() && $(window).width()<700){

                            cthis.addClass('is-touch-device type-youtube');

                        }
                        o.settings_video_overlay= 'on';
                    }





                    if(_c.children('.vp-inner').length){

                    }else{

                        //&& o.type != 'vimeo'
                        if (o.type != 'inline' ) {

                            _c.append('<div class="vp-inner"></div>');

                            _vpInner = _c.children('.vp-inner').eq(0);
                        }
                    }
                    if (_c.attr('data-type') != undefined) {
                        dataType = _c.attr('data-type');
                    }
                    if (_c.attr('data-src') != undefined) {
                        dataSrc = _c.attr('data-src');
                    } else {

                        if(o.type=='normal'){
                            if (_c.attr('data-sourcemp4')) {
                                dataSrc = _c.attr('data-sourcemp4');
                            }else{
                                if (_c.attr('data-sourcem')) {
                                    dataSrc = _c.attr('data-source');
                                }
                            }
                        }


                    }






                    var aux33= '<div class="controls"></div>';

                    if(cthis.children('.cover-image').length>0){
                        //console.info('ceva',aux33);
                        cthis.children('.cover-image').eq(0).before(aux33);
                    }else{

                        if(_vpInner){

                            _vpInner.append(aux33);
                        }
                    }
                    setTimeout(function(){
                        cthis.addClass('cover-image-loaded');
                    },600);

                    controlsDiv = cthis.find('.controls');




                    if(o.design_skin == 'skin_aurora'){
                        //console.info('ceva');


                        if(is_touch_device()){

                            //cthis.append('<div class="touch-play-btn"></div>');
                        }

                    }

                    //console.log('ceva');



                    //console.log(videoWidth);
                    totalWidth = videoWidth;
                    totalHeight = videoHeight;

                    //console.log(cthis, videoWidth);
                    cthis.css({
                        //'width': videoWidth,
                        //'height': videoHeight
                    })

                    if(videoWidth=='100%'){

                    }

                    if (cthis.attr('data-videoTitle')) {
                        if(_vpInner) {
                            _vpInner.append('<div class="video-description"></div>')

                        }
                        cthis.find('.video-description').eq(0).append('<div class="video-title">' + cthis.attr('data-videoTitle') + '</div>');
                        if (dataVideoDesc != '') {
                            cthis.find('.video-description').eq(0).append('<div class="video-subdescription">' + dataVideoDesc + '</div>');
                        }
                        cthis.find('.video-subdescription').eq(0).css('width', (0.7 * videoWidth));
                        video_title = cthis.attr('data-videoTitle');
                    }

                    if(video_title==''){

                        //console.warn(cthis.children());
                    }

                    //console.warn(video_title);

                    //if (cthis.css('position') != 'absolute' && cthis.css('position') != 'fixed') {
                    //    cthis.css('position', 'relative')
                    //}

                    //console.log(o.type);


                    if (o.type != 'vimeo' && o.type != 'image' && o.type != 'inline') {
                        var aux34 = '<div class="background"></div><div class="playcontrols"></div><div class="scrubbar"></div><div class="timetext"><span class="curr-timetext"></span><span class="total-timetext"></span></div><div class="volumecontrols"></div><div class="fscreencontrols"></div>';
                        controlsDiv.append(aux34);

                        if(o.design_skin=='skin_avanti'){
                            controlsDiv.append('<div class="mutecontrols-con"><div class="btn-mute"></div><div class="btn-mute-hover"></div><div class="btn-unmute"></div><div class="btn-unmute-hover"></div></div>');

                            _muteControls = controlsDiv.find('.mutecontrols-con').eq(0);
                        }
                    }


                    _controlsBackground = controlsDiv.find('.background').eq(0);

                    if (o.type == 'image') {
                        cthis.attr('data-img', cthis.attr('data-src'));


                    }

                    if(cthis.children('.vplayer-logo')){
                        cthis.append(cthis.children('.vplayer-logo'));
                    }
                    if(cthis.children('.extra-controls')){
                        if(o.design_skin=='skin_aurora'){
                            cthis.children('.extra-controls').children().each(function(){
                                var _t = $(this);

                                cthis.find('.timetext').eq(0).after(_t);
                            });

                        }
                    }


                    if (typeof cthis.attr('data-img') != 'undefined' && cthis.attr('data-img')!='') {
                        _vpInner.prepend('<div class="cover-image from-type-'+o.type+'"><div class="the-div-image" style="background-image:url(' + cthis.attr('data-img') + ');"/></div>');
                    }

                    if(cthis.attr('data-loop')=='on'){
                        loop = 'on';
                    }


                    if (o.type == 'image') {

                        cthis.addClass('dzsvp-loaded');


                        if (o.ad_link) {

                            var _c = cthis.children().eq(0);
                            _c.css({'cursor': 'pointer'})
                            _c.bind('click', function() {
                                if(cthis.find('.controls').eq(0).css('pointer-events')!='none'){

                                    window.open(o.ad_link);
                                }
                            })
                        }
                        setup_skipad();
                        return;
                    }


                    if (o.type == 'inline') {

                        // if (o.settings_disableControls == 'on') {
                        //     if (o.ad_link != '') {
                        //
                        //         var _c = cthis.children().eq(0);
                        //         _c.css({'cursor': 'pointer'})
                        //         _c.bind('click', function() {
                        //             window.open(o.ad_link);
                        //         })
                        //     }
                        //
                        // }
                        cthis.find('.cover-image').bind('click',function(){


                            $(this).fadeOut('slow');
                        });
                        setup_skipad();

                        var aux_preloader = '<div class="dzsvg-preloader preloader-fountain" > <div id="fountainG_1" class="fountainG"></div> <div id="fountainG_2" class="fountainG"></div> <div id="fountainG_3" class="fountainG"></div> <div id="fountainG_4" class="fountainG"></div> </div>';

                        if(cthis.find('.cover-image').length){
                            cthis.find('.cover-image').before(aux_preloader);
                        }else{
                            cthis.append(aux_preloader);
                        }

                        cthis.addClass('dzsvp-loaded');

                        setTimeout(function(){

                            cthis.addClass('dzsvp-really-loaded');


                        },2000);

                        return;
                    }



                    if (o.type == 'video') {

                        if (o.settings_disableControls == 'on') {
                            // -- for youtube ads we force enable the custom skin because we need to know when the video ended
                            o.cueVideo = 'on';
                            o.settings_youtube_usecustomskin='on';
                            autoplay='off';
                        }


                        // && isNaN(Number(cthis.attr('data-adskip_delay')))==false  && Number(cthis.attr('data-adskip_delay'))>0
                        if(o.is_ad=='on' && is_mobile() && cthis.attr('data-adskip_delay')){

                            // console.info(cthis);


                            // -- TBC - skip ad notice on mobile
                            cthis.appendOnce('<div class="skipad-con"></div>', '.skinad-con');
                            _adSkipCon = cthis.find('.skipad-con').eq(0);
                            _adSkipCon.html("Play the ad for the skip ad counter to appear");

                            ad_status = 'waiting_for_play';
                        }else{

                            setup_skipad();
                        }
                    }

                    if (o.type == 'vimeo') {

                        setup_skipad();
                    }
                    if (o.type == 'youtube') {
                        if (o.settings_disableControls == 'on') {
                            // -- for youtube ads we force enable the custom skin because we need to know when the video ended
                            o.cueVideo = 'on';
                            o.settings_youtube_usecustomskin='on';
                            autoplay='off';
                        }


                        if (o.ad_link != '') {

//                             if(cthis.parent().hasClass('videogallery--adSpace')){
//                                 cthis.parent().css({'cursor': 'pointer'});
//                                 cthis.parent().unbind('click');
// //                                console.info(cthis.parent());
//                                 cthis.parent().bind('click', function(e) {
//                                     if(cthis.find('.controls').eq(0).css('pointer-events')!='none') {
//                                         if($(e.target).hasClass('skipad')){
//
//                                             return ;
//
//                                         }
//
//                                         if($(e.target).parent().hasClass('volumecontrols')){
//                                             return;
//                                         }
//
//                                         //console.log(e.target);
//                                         window.open(o.ad_link);
//                                     }
//                                 })
//                             }

                        }


                        if(o.is_ad=='on' && is_mobile()  && (cthis.attr('data-adskip_delay') || videoplayersettings.settings_youtube_usecustomskin!='on') ){

                            // console.info(cthis);

                            cthis.appendOnce('<div class="skipad-con"></div>', '.skinad-con');
                            _adSkipCon = cthis.find('.skipad-con').eq(0);
                            _adSkipCon.html("Play the ad for the skip ad counter to appear");
                            ad_status = 'waiting_for_play';
                        }else{

                            setup_skipad();
                        }
                        // console.info("SETTING UP SKIP AD");
                    }
                    info = cthis.find('.info');
                    infotext = cthis.find('.infoText');

                    ////info



                    var aux = '';


                    playcontrols = cthis.find('.playcontrols');



                    aux = '<div class="playSimple">';



                    if(o.design_skin=='skin_bigplay_pro'){

                        aux+='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="120px" height="120px" viewBox="0 0 120 120" enable-background="new 0 0 120 120" xml:space="preserve"> <path fill-rule="evenodd" clip-rule="evenodd" fill="#D0ECF3" d="M79.295,56.914c2.45,1.705,2.45,4.468,0,6.172l-24.58,17.103 c-2.45,1.704-4.436,0.667-4.436-2.317V42.129c0-2.984,1.986-4.022,4.436-2.318L79.295,56.914z M0.199,54.604 c-0.265,2.971-0.265,7.821,0,10.792c2.57,28.854,25.551,51.835,54.405,54.405c2.971,0.265,7.821,0.265,10.792,0 c28.854-2.57,51.835-25.551,54.405-54.405c0.265-2.971,0.265-7.821,0-10.792C117.231,25.75,94.25,2.769,65.396,0.198 c-2.971-0.265-7.821-0.265-10.792,0C25.75,2.769,2.769,25.75,0.199,54.604z M8.816,65.394c-0.309-2.967-0.309-7.82,0-10.787 c2.512-24.115,21.675-43.279,45.79-45.791c2.967-0.309,7.821-0.309,10.788,0c24.115,2.512,43.278,21.675,45.79,45.79 c0.309,2.967,0.309,7.821,0,10.788c-2.512,24.115-21.675,43.279-45.79,45.791c-2.967,0.309-7.821,0.309-10.788,0 C30.491,108.672,11.328,89.508,8.816,65.394z"/> </svg>';
                    }
                    if(o.design_skin=='skin_aurora' || o.design_skin=='skin_bigplay'){

                        aux+=svg_aurora_play_btn;
                    }




                    aux+='</div><div class="playHover"></div><div class="pauseSimple">';


                    if(o.design_skin=='skin_aurora' || o.design_skin=='skin_bigplay'){

                        aux+='<svg version="1.1" id="Layer_2" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="13.75px" height="12.982px" viewBox="0 0 13.75 12.982" enable-background="new 0 0 13.75 12.982" xml:space="preserve"> <g> <path d="M5.208,11.982c0,0.55-0.45,1-1,1H3c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h1.208c0.55,0,1,0.45,1,1V11.982z"/> </g> <g> <path d="M12.208,11.982c0,0.55-0.45,1-1,1H10c-0.55,0-1-0.45-1-1V1c0-0.55,0.45-1,1-1h1.208c0.55,0,1,0.45,1,1V11.982z"/> </g> </svg> ';
                    }


                    aux+='</div><div class="pauseHover"></div>';

                    playcontrols.append(aux);




                    var aux_scrub = '<div class="scrub-bg"></div><div class="scrub-buffer"></div><div class="scrub">';


                    if(o.design_skin=='skin_aurora'){

                        ;
                    }


                    aux_scrub+='</div><div class="scrubBox"></div><div class="scrubBox-prog"></div>';


                    scrubbar = cthis.find('.scrubbar');
                    scrubbar.append(aux_scrub);

                    _scrubBg = scrubbar.children('.scrub-bg');
//                    console.info(scrubbar, _scrubBg);

                    _timetext = cthis.find('.timetext').eq(0);




                    _volumeControls = cthis.find('.volumecontrols');
                    _volumeControls_real = cthis.find('.volumecontrols');

                    aux = '<div class="volumeicon">';



                    if(o.design_skin=='skin_aurora'){
                        aux+='<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="10px" height="12px" viewBox="0 0 10 12" enable-background="new 0 0 10 12" xml:space="preserve"> <path fill-rule="evenodd" clip-rule="evenodd" fill="#200C34" d="M8.475,0H7.876L5.323,1.959c0,0-0.399,0.667-1.157,0.667H1.454 c0,0-1.237,0.083-1.237,1.334v3.962c0,0-0.159,1.334,1.277,1.334h2.553c0,0,0.877,0.167,1.316,0.667l2.513,1.959l0.638,0.083 c0,0,0.678,0,0.678-0.667V0.667C9.193,0.667,9.153,0,8.475,0z"/> </svg>';
                    }


                    aux+='</div><div class="volume_static">';


                    if(o.design_skin=='skin_reborn'){
                        for(var i2=0;i2<10;i2++){
                            aux+='<div class="volbar"></div>';
                        }
                    }


                    aux+='</div><div class="volume_active">';



                    if(o.design_skin=='skin_aurora'){
                        ;
                    }


                    aux+='</div><div class="volume_cut"></div>';


                    if(o.design_skin=='skin_reborn') {
                        aux+='<div class="volume-tooltip">VOLUME: 100</div>';
                    }

                    _volumeControls.append(aux);

                    fScreenControls = cthis.find('.fscreencontrols');

                    aux = '<div class="full">';



                    if(o.design_skin=='skin_rebornTRYDIFFERENT') {
                        aux += '<svg class="for-fullscreen-inactive" version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" overflow="auto" xml:space="preserve"> <path fill-rule="evenodd" fill="none" d="M14,14V9h-1v4H9v1H14z M0,14h5v-1H1V9H0V14z M14,0H9v1h4v4h1V0z M0,0v5h1V1h4V0H0z"/> </svg>';

                        aux+='<svg class="for-fullscreen-active" version="1.1" baseProfile="tiny" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 14 14" xml:space="preserve"> <path fill-rule="evenodd" fill="none" d="M5,5V0H4v4H0v1H5z M9,5h5V4h-4V0H9V5z M5,9H0v1h4v4h1V9z M9,9v5h1v-4h4V9H9z"/> </svg>';
                    }

                    if(o.design_skin=='skin_aurora') {
                        aux += '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enable-background="new 0 0 16 16" xml:space="preserve"> <g id="Layer_3"> <polygon fill="#FFFFFF" points="2.404,2.404 0.057,4.809 0.057,0 4.751,0 "/> <polygon fill="#FFFFFF" points="13.435,2.404 11.03,0.057 15.839,0.057 15.839,4.751 "/> <polygon fill="#FFFFFF" points="2.404,13.446 4.809,15.794 0,15.794 0,11.1 "/> <polygon fill="#FFFFFF" points="13.435,13.446 15.781,11.042 15.781,15.851 11.087,15.851 "/> </g> <g id="Layer_2"> <rect x="4.255" y="4.274" fill="#FFFFFF" width="7.366" height="7.442"/> </g> </svg>';

                    }


                    aux+='</div><div class="fullHover"></div>';



                    if(o.design_skin=='skin_reborn') {
                        aux+='<div class="full-tooltip">FULLSCREEN</div>';
                    }


                    fScreenControls.append(aux);


                    if (o.design_skin == 'skin_pro' || o.design_skin == 'skin_bigplay') {
                        playcontrols.find('.pauseSimple').eq(0).append('<div class="pause-part-1"></div><div class="pause-part-2"></div>');
                        fScreenControls.find('.full').eq(0).append('<canvas width="15" height="15" class="fullscreen-button"></canvas>');


                        //console.log(fScreenControls.find('.full').eq(0));

                        _controls_fs_canvas=fScreenControls.find('.full').eq(0).find('canvas.fullscreen-button').eq(0)[0];
                        if( (!is_ie() || (is_ie() && version_ie()>8)) && _controls_fs_canvas!=undefined){
//                            console.info(o.controls_fscanvas_bg);
                            draw_fs_canvas(o.controls_fscanvas_bg);
                            $(_controls_fs_canvas).bind('mouseover', handleMouseover);
                            $(_controls_fs_canvas).bind('mouseout', handleMouseout);
                        }
                    }




                    if (_c.find('.videoDescription').length > 0) {
                        dataVideoDesc = _c.find('.videoDescription').html();
                        _c.find('.videoDescription').remove();
                    }

                    if (is_ie8() || o.type=='vimeo') {
                        o.cueVideo='on';
                    }


                    if(cthis.get(0)){
                        //cthis.get(0).fn_change_mainColor = fn_change_mainColor; cthis.get(0).fn_change_mainColor('#aaa');
                        cthis.get(0).fn_change_color_highlight = fn_change_color_highlight; //cthis.get(0).fn_change_mainColor('#aaa');

                        cthis.get(0).api_handleResize = handleResize;
                        cthis.get(0).api_seek_to_perc = seek_to_perc;

                        cthis.get(0).api_currVideo_refresh_fsbutton = draw_fs_canvas;
                        cthis.get(0).api_reinit_cover_image = reinit_cover_image;
                        cthis.get(0).api_restart_video = restart_video;



                        cthis.get(0).api_ad_end = ad_end;

                        //console.log('ceva');
                    }









                    //===setup player colors





                    //console.log(cthis, o.cueVideo, o.type);

                    //===if cueVideo is not on then, init_readyControls on click


                    //console.log("FIREFOX YOU BASTARD");
                    if(o.cueVideo=='on' || (!is_ie8() && ( !is_ios() || o.settings_ios_usecustomskin=='on') && (o.type=='normal'||o.type=='youtube') )){

                        if(o.type=='youtube'){
                            inter_check_yt_iframe_ready = setInterval(check_if_yt_iframe_ready, 100);
                        }else{
                            init_readyControls();
                        }
                    }else{

                        resizePlayer(videoWidth, videoHeight);
                        cthis.bind('click', init_readyControls);

                        cthis.addClass('dzsvp-loaded');

                    }

                    if (o.cueVideo != 'on') {


                        //--------------normal
                        if (!is_ie8() && ( !is_ios() || o.settings_ios_usecustomskin=='on')) {
                        }


                    } else {
                        //console.log(o.type);

                    }



                    if (o.settings_enableTags == 'on') {
                    }

                    setInterval(check_one_sec, 1000);
                    check_one_sec();


                    handleResize();
                }

                if(inter_10_secs_contor==0 && o.action_video_contor_10secs){
                    inter_10_secs_contor = setInterval(count_10secs, 10000);
                }

                console.info(o,inter_5_secs_contor,o.action_video_contor_5secs);
                if(inter_5_secs_contor==0 && o.action_video_contor_5secs){
                    inter_5_secs_contor = setInterval(count_5secs, 3000);
                    setTimeout(function(){

                        count_5secs();
                    },500)
                }


                //console.info(cthis, autoplay, o.autoplay);
            }


            function check_one_sec(){

                // console.info('check_on_sec',ad_playing,paused,ad_array, ad_array.length, typeof ad_array);

                if(ad_playing==false && paused==false){
                    // console.info('ad_array - ',ad_array);

                    if(typeof ad_array =='object' && ad_array.length>0){

                        for(var i2 in ad_array){
                            // console.info('ad vars - ',time_curr, ad_array[i2].time, totalDuration);
                            if(totalDuration && time_curr >= ad_array[i2].time * totalDuration){

                                ad_setup(i2);

                            }
                        }
                    }

                }

                if (o.settings_enableTags == 'on') {
                    check_tags();
                }

            }

            function ad_setup(arg){

                var source = ad_array[arg].source;
                var type = ad_array[arg].type;
                var skip_delay = ad_array[arg].skip_delay;
                var ad_link = ad_array[arg].ad_link;


                ad_array.splice(arg, 1);

                cthis.appendOnce('<div class="ad-container"></div>');

                _adContainer = cthis.find('.ad-container').eq(0);


                // console.info('adding ad');
                //advertisment
                var aux = '<div class="vplayer-tobe"';

                //data-source="video/test.m4v"
                if(type!='inline'){

                    aux += ' data-src="' + source + '"';
                }

                if (type) {
                    aux += ' data-type="' + type + '"';
                }

                if (ad_link) {
                    aux += ' data-adlink="' + ad_link + '"';
                }

                if (skip_delay) {
                    aux += ' data-adskip_delay="' + skip_delay + '"';
                }
                aux += '>';


                if(type=='inline'){
                    // aux+='<div class="adSource">' + source + '</div>';
                    aux+=source;
                }



                aux+='</div>';
                _adContainer.show();
                _adContainer.append(aux);
//                    console.info(aux);


                var auxoptions = {};


                auxoptions.design_skin= o.design_skin;
                auxoptions.autoplay= 'on';
                auxoptions.settings_disableControls = 'on';
                auxoptions.is_ad = 'on';
                auxoptions.parent_player = cthis;



                ad_playing = true;


                _adContainer.children('.vplayer-tobe').addClass('is-ad');
                _adContainer.children('.vplayer-tobe').vPlayer(auxoptions);


                if(o.gallery_object){
                    if(o.gallery_object.get(0) && o.gallery_object.get(0).api_ad_block_navigation){

                        o.gallery_object.get(0).api_ad_block_navigation();

                    }
                }



//                    console.info(_adSpace);
//                    return;


                setTimeout(function(){

                    cthis.addClass('ad-playing');
                },100);
                ad_playing=true;
                pauseMovie();
            }

            function ad_end(){

                if(_adContainer.children().get(0) && _adContainer.children().get(0).api_destroy_listeners){

                    _adContainer.children().get(0).api_destroy_listeners();
                }

                playMovie();
                cthis.addClass('ad-transitioning-out');



                if(o.gallery_object){
                    if(o.gallery_object.get(0) && o.gallery_object.get(0).api_ad_unblock_navigation){

                        o.gallery_object.get(0).api_ad_unblock_navigation();

                    }
                }

                setTimeout(function(){

                    cthis.removeClass('ad-playing');
                    cthis.removeClass('ad-transitioning-out');
                    _adContainer.children().remove();
                    ad_playing=false;
                },300)
            }

            function count_10secs(){
                if(o.action_video_contor_10secs && cthis.hasClass('is-playing')){
                    o.action_video_contor_10secs(cthis,video_title);
                }
            }
            function count_5secs(){
                if(o.action_video_contor_5secs){
                    o.action_video_contor_5secs(cthis,video_title);
                }
            }

            function restart_video(){


                //console.info(o.type);
                if(o.type=='video'){
                    seek_to_perc(0);
                }
                if(o.type=='vimeo'){

                    seek_to_perc(0);
                }
                if(o.type=='youtube'){



                    if (video && video.pauseVideo) {
                        //console.info(dataSrc);
                    }

                }

                reinit_cover_image();
            }

            function check_if_yt_iframe_ready(){

//                console.info(o.type);
                if( (window.YT && window.YT.Player ) || _global_youtubeIframeAPIReady){
                    init_readyControls();
                    clearInterval(inter_check_yt_iframe_ready);
                }
            }

            function setup_skipad(pargs){


                var margs = {
                    'call_from': 'default'
                }

                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                if(ad_status=='first_played'){
                    return false;
                }
                //console.info('setup_skipad()');
                if (o.settings_disableControls == 'on') {
                    var skipad_timer = 0;

                    if(o.type=='image' || o.type=='inline'){
                        skipad_timer=0;
                    }
                    if(o.type=='normal' || o.type=='youtube'){
                        skipad_timer=1001;
                    }

                    cthis.appendOnce('<div class="skipad-con"></div>', '.skipad-con');
                    _adSkipCon = cthis.find('.skipad-con').eq(0);

                    if(typeof cthis.attr('data-adskip_delay')!='undefined'){
                        skipad_timer = Number(cthis.attr('data-adskip_delay')) ;
                    }
                    //console.info(skipad_timer);

//                    console.info(cthis, cthis.attr('data-adskip_delay'), skipad_timer);
                    time_counter_skipad = skipad_timer;
//                    console.info(cthis, time_counter_skipad);
                    if(skipad_timer!=1001){
                        setTimeout(function(){
//                            console.info(cthis.find('.skipad-con').eq(0))
                            time_counter_skipad=0;
                            _adSkipCon.html('<div class="skipad">'+translate_skipad+'</div>');
                            _adSkipCon.children('.skipad').bind('click', function() {
                                handleVideoEnd();
                            })
                        }, skipad_timer*1000);

                        if(skipad_timer>0){
                            inter_time_counter_skipad = setInterval(tick_counter_skipad, 1000);
                        }
                    }


                }

                ad_status = 'first_played';
            }
            function tick_counter_skipad(){

//                console.info(cthis, time_counter_skipad);
                if(time_counter_skipad>0){
                    time_counter_skipad= time_counter_skipad-1;
                    if(_adSkipCon){
                        _adSkipCon.html(dzsvg_translate_youcanskipto + time_counter_skipad);
                    }

                }else{
                    clearInterval(inter_time_counter_skipad);
                }
            }
            function draw_fs_canvas(argcol){

//                console.info(o.design_skin, argcol);
                if(o.design_skin!='skin_pro'){
                    return;
                }
                var ctx=_controls_fs_canvas.getContext("2d");
                var ctx_w = _controls_fs_canvas.width;
                var ctx_h = _controls_fs_canvas.height;
                var ctx_pw = ctx_w/100;
                var ctx_ph = ctx_w/100;
                //console.log(ctx_pw, c.width);
                ctx.fillStyle= argcol;
                var borderw = 30;
                ctx.fillRect(25*ctx_pw,25*ctx_ph,50*ctx_pw,50*ctx_ph);
                ctx.beginPath();
                ctx.moveTo(0*ctx_pw,0*ctx_ph);
                ctx.lineTo(0*ctx_pw,borderw*ctx_ph);
                ctx.lineTo(borderw*ctx_pw,0*ctx_ph);
                ctx.fill();
                ctx.moveTo(0*ctx_pw,100*ctx_ph);
                ctx.lineTo(0*ctx_pw,(100-borderw)*ctx_ph);
                ctx.lineTo(borderw*ctx_pw,100*ctx_ph);
                ctx.fill();
                ctx.moveTo((100)*ctx_pw,(100)*ctx_ph);
                ctx.lineTo((100-borderw)*ctx_pw,(100)*ctx_ph);
                ctx.lineTo((100)*ctx_pw,(100-borderw)*ctx_ph);
                ctx.fill();
                ctx.moveTo((100)*ctx_pw,(0)*ctx_ph);
                ctx.lineTo((100-borderw)*ctx_pw,(0)*ctx_ph);
                ctx.lineTo((100)*ctx_pw,(borderw)*ctx_ph);
                ctx.fill();
            }
            function fn_change_color_highlight(arg){
                cthis.find('.scrub').eq(0).css({
                    'background' : arg
                })
                cthis.find('.volume_active').eq(0).css({
                    'background' : arg
                })
                cthis.find('.hdbutton-hover').eq(0).css({
                    'color' : arg
                })
            }
            function check_tags() {
                var roundTime = Number(time_curr);


                //console.log(arrTags.length);
                if (arrTags.length == 0) {
                    return;
                }

                arrTags.removeClass('active');
                arrTags.each(function() {
                    var _t = $(this);
                    //console.log(_t);
                    if (Number(_t.attr('data-starttime')) <= roundTime && Number(_t.attr('data-endtime')) >= roundTime) {
                        _t.addClass('active');
                    }
                })
                //jQuery('.dzstag[data-starttime=' + roundTime + ']').addClass('active');
            }


            function init_readyControls() {
                //console.warn('init_readyControls()', cthis);



                var _c = cthis;
                _c.unbind();

                if(_c.attr('data-type')=='youtube' && String(dataSrc).indexOf('youtube.com/watch?') > -1){
                    var auxa = String(dataSrc).split('youtube.com/watch?v=');
                    //console.info(auxa);
                    dataSrc = auxa[1];
                    if(auxa[1].indexOf('&')>-1){
                        var auxb = String(auxa[1]).split('&');
                        dataSrc = auxb[0];
                    }
                }
                if(_c.attr('data-type')=='youtube' && String(dataSrc).indexOf('youtube.com/embed') > -1){
                    var auxa = String(dataSrc).split('youtube.com/embed/');
                    //console.info(auxa);
                    dataSrc = auxa[1];
                }


                if(_c.attr('data-type')=='vimeo' && String(dataSrc).indexOf('vimeo.com/') > -1){
                    var auxa = String(dataSrc).split('vimeo.com/');
                    //console.info(auxa);
                    dataSrc = auxa[1];
                }


                if (_c.attr('data-sourceflash') != undefined) {
                    dataFlash = _c.attr('data-sourceflash');
                }

                //console.log(cthis.find('.preview'))



                if (_c.attr('data-sourceflash') == undefined) {
                    dataFlash = _c.attr('data-sourcemp4');
                    _c.attr('data-sourceflash', dataSrc);
                }

                if (o.type == 'audio' && _c.attr('data-sourcemp3') != undefined && _c.attr('data-sourceflash') == undefined) {
                    dataFlash = _c.attr('data-sourcemp3');
                }



                //--------------ie8
                if (is_ie8()) {
                    _c.find('.controls').remove();
                    _c.addClass('vplayer-ie8');
                    //_c.html('<div class="vplayer"></div>')
                    if (o.type == 'normal') {
                        _c.prepend('<div><object type="application/x-shockwave-flash" data="'+o.settings_swfPath+'" width="' + videoWidth + '" height="' + videoHeight + '" id="flashcontent" style="visibility: visible;"><param name="movie" value="'+o.settings_swfPath+'"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="flashvars" value="video='+dataFlash+ '"></object></div>');

                    }
                    if (o.type == 'audio') {
                        _c.prepend('<div><object type="application/x-shockwave-flash" data="'+o.settings_swfPath+'" width="' + videoWidth + '" height="' + videoHeight + '" id="flashcontent" style="visibility: visible;"><param name="movie" value="'+o.settings_swfPath+'"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="flashvars" value="video=' + dataFlash + '&types=audio"></object></div>');

                    }
                    if (o.type == 'vimeo') {
                        var src = dataSrc;
                        _c.append('<iframe scrolling="no" width="100%" height="100%" src="//player.vimeo.com/video/' + src + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen style=""></iframe>');
                        //_c.attr('data-ytid', aux);
                    }
                    if (o.type == 'youtube') {
                        o.type = 'youtube';
                        _c.children().remove();
                        var aux = 'ytplayer' + dataSrc;
                        _c.append('<iframe type="text/html" style="position:relative; top:0; left:0; width:100%; height:100%;" width="100%" height="100%" src="//www.youtube.com/embed/' + dataSrc + '?rel=0&showinfo=0" frameborder="0" allowfullscreen></iframe>');
                        _c.attr('data-ytid', aux);
                    }

                    return;
                }



                //console.info('type is ', o.type, dataSrc);



                // -- ios video setup

                //console.info(o.settings_ios_usecustomskin!='on',is_ios() )
                if (o.settings_ios_usecustomskin!='on' && is_ios()) {
                    var str_poster = '';


                    if (cthis.attr('data-img')) {
                        str_poster = ' poster="'+cthis.attr('data-img')+'"';
                    }

                    if (o.type == 'normal') {

                        console.warn("HERE we will setup ios not custom skin");
                        // _c.prepend('<video class="the-video" width="100%" height="100%" controls preload="metadata" '+str_poster+'></video>');
                        _vpInner.prepend('<video class="the-video" width="100%" height="100%" controls preload="metadata" '+str_poster+'></video>');
                        //_c.children().eq(0).attr('width', videoWidth);
                        //_c.children().eq(0).attr('height', videoHeight);
                        if (dataSrc) {
                            _c.find('video.the-video').eq(0).append('<source src="' + dataSrc + '"/>');
                        }
                    }
                    if (o.type == 'audio') {
                        _c.prepend('<audio controls preload '+str_poster+'></audio>');
                        _c.children().eq(0).attr('width', videoWidth);
                        _c.children().eq(0).attr('height', videoHeight);
                        if (_c.attr('data-sourcemp3') != undefined) {
                            _c.children().eq(0).append('<source src="' + _c.attr('data-src') + '" type="audio/mp3" style="width:100%; height:100%;"/>');
                        }
                    }
                    if (o.type == 'youtube') {
                        o.type = 'youtube';
                        _c.children().remove();
                        _c.append('<iframe src="//www.youtube.com/embed/' + dataSrc + '?rel=0&showinfo=0" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen style="width:100%; height:100%;"></iframe>');
                        //_c.attr('data-ytid', aux);
                    }
                    if (o.type == 'vimeo') {
                        _c.children().remove();
                        var src = dataSrc;
                        _c.append('<iframe width="100%" height="100%" src="//player.vimeo.com/video/' + src + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen style=""></iframe>');

                    }



                    _vpInner.find('.controls').remove();

                    cthis.find('.cover-image').remove();
                    //console.log(cthis, cthis.find('.cover-image'));
                    //cthis.find('.cover-image').fadeOut('slow');
                    /*
                     if(typeof cthis.find('.cover-image').get(0)!='undefined'){
                     cthis.find('.cover-image').get(0).addEventListener('touchstart', function(){
                     console.log('ceva');
                     }, false);
                     }
                     */

                    // console.info("iOS so we dont medley", o.responsive_ratio);

                    if(o.responsive_ratio=='default'){
                        // console.info("YES");
                        get_responsive_ratio();
                        o.responsive_ratio=0.562;
                    }

                    cthis.addClass('dzsvp-loaded');

                    handleResize();
                    //return;//our job on the iphone / ipad has been done, we exit the function.
                }



                // -- normal
                if (!is_ie8() && ( !is_ios() || o.settings_ios_usecustomskin=='on')) {

                    //--normal video on modern browsers
                    if (o.settings_enableTags == 'on') {
                        cthis.find('.dzstag-tobe').each(function() {
                            var _t = $(this);
                            var auxhtml = _t.html();
                            var w = 100;
                            var h = 100;
                            var acomlink = '';
                            if (_t.attr('data-width') != undefined) {
                                w = _t.attr('data-width');
                            }
                            if (_t.attr('data-height') != undefined) {
                                h = _t.attr('data-height');
                            }
                            if (_t.attr('data-link') != undefined) {
                                acomlink = '<a href="' + _t.attr('data-link') + '"></a>';
                            }

                            _t.html('');
                            _t.css({'left': (_t.attr('data-left') + 'px'), 'top': (_t.attr('data-top') + 'px')});
                            //console.log(_t);
                            _t.append('<div class="tag-box" style="width:' + w + 'px; height:' + h + 'px;">' + acomlink + '</div>');
                            _t.append('<span class="tag-content">' + auxhtml + '</span>');
                            _t.removeClass('dzstag-tobe').addClass('dzstag');
                            //_t.remove();
                        })
                        arrTags = cthis.find('.dzstag');
                    }
                    aux = '';
                    if (o.type == 'audio') {
                        if (_c.attr('data-audioimg') != undefined) {
                            aux = '<div style="background-image:url(' + _c.attr('data-audioimg') + ')" class="div-full-image"/>';
                            _c.prepend(aux);
                        }
                    }
                    //console.log(_c);
                    if (o.type == 'normal') {

                        //console.info(o.cueVideo);
                        //setup_local_video();



                        // console.info(o);
                        //console.info("SETUP VIDEO")
                        if(o.cueVideo!='on'){
                            // o.autoplay = 'off';
                            autoplay = 'off';


                            setup_local_video({
                                'preload':'metadata'
                            })
                        }else{

                            setup_local_video();
                        }
                    }



                    if (o.type == 'rtmp') {

                        //- --- setup the type
                        var str_type = '';


                        var aux = '<object type="application/x-shockwave-flash" data="'+o.settings_swfPath+'" width="100%" height="100%" id="flashcontent" style="visibility: visible;"><param name="movie" value="'+o.settings_swfPath+'"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="flashvars" value="video='+_c.attr('data-source')+'&types=rtmp&streamServer='+ o.rtmp_streamServer+'"></object>';

//                            console.info(can_play_mp4());

                        _c.html(aux);
                        _c.data('isflash', 'on')


                    }

                    // ---type audio
                    if (o.type == 'audio') {
                        var aux = '<audio class="the-video" controls';
                        if (videoWidth != 0) {
                            aux += ' width="' + videoWidth + '"';
                            aux += ' height="' + videoHeight + '"';
                        }
                        aux += '></audio>';
                        _c.prepend(aux);
                        if (_c.attr('data-src')) {
                            //console.log(_c.attr('data-sourcemp4'));
                            _c.children().eq(0).append('<source src="' + _c.attr('data-src') + '" type="audio/mp3"/>');
                            if (is_ie9()) {
                                _c.html('<audio><source src="' + _c.attr('data-src') + '" type="audio/mp3"/></audio>');
                                //_c.children().eq(0).attr('src', _c.attr('data-sourcemp4'));
                                //_c.children().eq(0).append('<source src="'+_c.attr('data-sourcemp4')+'"/>');
                            }
                        }
                        if (_c.attr('data-sourceogg') != undefined) {
                            _c.children().eq(0).append('<source src="' + _c.attr('data-sourceogg') + '" type="audio/ogg"/>');
                        }
                        if (_c.attr('data-sourcewav') != undefined) {
                            _c.children().eq(0).append('<source src="' + _c.attr('data-sourcewav') + '" type="audio/wav"/>');
                        }
                        if (_c.attr('data-sourceflash') != undefined && !(is_ie() && version_ie() > 8)) {
                            dataFlash = _c.attr('data-sourcemp3');
                            var aux = ('<object type="application/x-shockwave-flash" data="'+o.settings_swfPath+'" width="100%" height="100%" id="flashcontent" style="visibility: visible;"><param name="movie" value="'+o.settings_swfPath+'"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="flashvars" value="video=' + dataFlash + '&types=audio"></object>');


                            //===if opera or firefox and no ogg defined, we force flash
                            if ((_c.attr('data-sourcewav') == undefined && _c.attr('data-sourceogg') == undefined && (!can_play_mp3() || is_opera()))) {
                                _c.html(aux);
                            } else {
                                _c.children().eq(0).append(aux);
                            }
                        }
                    }
                    //console.info(o.type,o.settings_youtube_usecustomskin)



                    // --- type youtube
                    if (o.type == 'youtube') {
                        o.type = 'youtube';
                        //console.log(o.settings_youtube_usecustomskin)

                        //console.info(is_android(), o.settings_youtube_usecustomskin)



                        // ---- no skin youtube
                        if (o.settings_youtube_usecustomskin != 'on' || o.settings_ios_usecustomskin!='on') {

                            _vpInner.children(':not(.cover-image)').remove();
                            var aux = 'ytplayer' + dataSrc;
                            var param_autoplay = 0;
                            //console.log(o);
                            if(o.autoplay=='on'){
                                param_autoplay = 1
                            }

                            //_c.append('<iframe type="text/html" style="position:relative; top:0; left:0; width:100%; height:100%;" src="//www.youtube.com/embed/' + dataSrc + '?modestbranding=1&rel=0&showinfo=0'+param_autoplay+'" frameborder="0" allowfullscreen></iframe>');
                            _c.attr('data-ytid', aux);


                            _vpInner.prepend('<span class="cmedia-con"><span id="the-media-'+cid+'"></span></span>');

                            //console.info(param_autoplay, o.autoplay, o);
                            if(o.cueVideo=='off'){
                                // o.autoplay='off';
                                autoplay = 'off';
                            }



                            // default yt skin
                            video = new YT.Player('the-media-'+cid, {
                                height: '100%',
                                width: '100%',
                                playerVars: { 'autoplay': param_autoplay, controls: 1, 'showinfo': 0, 'playsinline' : 1, rel:0, autohide: 0, wmode: 'transparent', iv_load_policy: '3'},//, 'playsinline' : 0, enablejsapi : 1
                                videoId: dataSrc,

                                suggestedQuality: o.settings_suggestedQuality,
                                events: {
                                    'onReady': yt_onPlayerReady,
                                    'onStateChange': yt_onPlayerStateChange
                                }
                            });
                            _cmedia = video;

                        } else {

                            //ytplayer= document.getElementById("flashcontent");
                            //ytplayer.loadVideoById('L7ANahx7aF0')

                            _vpInner.prepend('<span class="cmedia-con"><span id="the-media-'+cid+'"></span></span>');


                            if(o.cueVideo=='off'){
                                // o.autoplay='off';
                                autoplay = 'off';
                            }
                            //console.info(o.settings_suggestedQuality);



                            var playfrom = '';


                            if(o.playfrom!='default') {

//                    console.info(the_player_id, o.playfrom);

                                if (o.playfrom == 'last' && the_player_id != '') {
                                    if (typeof Storage != 'undefined') {

                                        if (typeof localStorage['dzsvp_' + the_player_id + '_lastpos'] != 'undefined') {

                                            playfrom = (Number(localStorage['dzsvp_' + the_player_id + '_lastpos']))
                                        }
                                    }
                                }

                                if (isNaN(Number(o.playfrom)) == false) {

                                    playfrom = Number(o.playfrom);
                                }
                            }

                            // console.info(playfrom);



                            // console.info('quality - ',o.settings_suggestedQuality);
                            video = new YT.Player('the-media-'+cid, {
                                height: '100%',
                                width: '100%',
                                playerVars: { 'autoplay': 0, controls: 0, 'showinfo': 0, 'playsinline' : 1, rel:0, autohide: 1, start: playfrom,wmode: 'transparent', iv_load_policy: '3', modestbranding: 1},//, 'playsinline' : 0, enablejsapi : 1
                                videoId: dataSrc,
                                suggestedQuality: o.settings_suggestedQuality,
                                events: {
                                    'onReady': yt_onPlayerReady,
                                    'onStateChange': yt_onPlayerStateChange
                                }
                            });

                            setTimeout(function(){
                                // console.info('captions - ', video.captions);
                            },5000);

                            _cmedia = video;


                            // console.info(cthis.find('#the-media-'+cid));
                            cthis.find('#the-media-'+cid).bind('mousemove', handle_mousemove);
                        }
                    }
                    if (o.type == 'vimeo') {
                        //_c.children().remove();
                        var src = dataSrc;
                        var str_autoplay = '';


                        if(autoplay=='on'){
                            str_autoplay = '&autoplay=1';
                        }
                        if(_vpInner) {
                            _vpInner.children('.controls').remove();
                        }
                        //console.info(autoplay, o.autoplay);
                        _vpInner.prepend('<iframe scrolling="no" src="'+vgsettings.vimeoprotocol+'//player.vimeo.com/video/' + src + '?api=1&player_id=vimeoplayer' + src +str_autoplay+ '" width="100%" height="100%" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen style=""></iframe>');


                        //ytplayer= document.getElementById("flashcontent");
                        //ytplayer.loadVideoById('L7ANahx7aF0')
                    }




                    if (o.type == 'dash') {


                        console.warn("Reading from source ", dataSrc);






                        setup_local_video();
                        video = cthis.find('.the-video').eq(0).get(0);



                        if(window.Webm){
                            dash_context = new Webm.di.WebmContext();
                            dash_player = new MediaPlayer(dash_context);
                            dash_player.startup();
                            dash_player.attachView(video);

                            if(autoplay=='on'){
                                dash_player.setAutoPlay(true);
                            }else{

                                dash_player.setAutoPlay(false);
                            }

                            dash_player.attachSource(dataSrc);


                            //console.info(video.naturalWidth);
                        }else{


                            var baseUrl = '';
                            var baseUrl_arr = get_base_url_arr();
                            for(var i24=0;i24<baseUrl_arr.length-1; i24++){
                                baseUrl+=baseUrl_arr[i24]+'/';
                            }
                            //var src = scripts[scripts.length-1].src;


                            var url = baseUrl+'dash.js';
                            //console.warn(scripts[i23], baseUrl, url);
                            $.ajax({
                                url: url,
                                dataType: "script",
                                success: function(arg){
                                    //console.info(arg);

                                    dash_context = new Webm.di.WebmContext();
                                    dash_player = new MediaPlayer(dash_context);
                                    dash_player.startup();
                                    dash_player.attachView(video);
                                    if(autoplay=='on'){
                                        dash_player.setAutoPlay(true);
                                    }else{

                                        dash_player.setAutoPlay(false);
                                    }
                                    dash_player.attachSource(dataSrc);


                                }
                            });
                        }

                    }



                }

                if (o.type == 'normal') {
                    video = cthis.find('.the-video').eq(0)[0];

                    // console.info(video);
                    if (video != undefined) {
                        video.controls = false;
                    }
                }
                if (o.type == 'audio') {
                    video = cthis.find('.the-video').eq(0)[0];
                    if(video!=undefined){
                        video.controls = false;
                    }
                }
                if (o.type == 'youtube') {
//                    video = cthis.children('object')[0];

//                    console.info(video);
                }

                if (o.type == 'vimeo') {
                    video = cthis.find('iframe')[0];
                    //console.log(video);
                    //

                    if (window.addEventListener) {
                        window.addEventListener('message', vimeo_windowMessage, false);
                    }

                }

                if (o.type == 'normal') {
                    $(video).css({
                        'position': 'absolute',
                        'background-color': '#000000'
                    })
                }

                if (autoplay == 'on') {
                    wasPlaying = true;
                }else{

                }


                if(cthis.attr('data-adsource') &&  cthis.data('adplayed')!='on'){
                    has_ad_to_play = true;
                }

                // console.info('has_ad_to_play - ',has_ad_to_play, cthis.attr('data-adsource'), cthis.data('adplayed'));


                get_responsive_ratio();

                // cthis.find('.cover-image').bind('click',click_coverImage);

                cthis.on('click','.cover-image:not(.from-type-image)', click_coverImage);

                cthis.addClass('dzsvp-loaded');

                // console.info("type -", o.type);


                inter_videoReadyState = setInterval(check_videoReadyState, 50);
                cthis.get(0).externalPauseMovie = pauseMovie;
                cthis.get(0).externalPlayMovie = playMovie;
                cthis.get(0).api_pauseMovie = pauseMovie;
                cthis.get(0).api_playMovie = playMovie;
                cthis.get(0).api_get_responsive_ratio = get_responsive_ratio;


                //console.info(cthis, o.type, o.responsive_ratio, cthis.attr('data-responsive_ratio'));


                $(window).on('resize', handleResize);




                var _scrubbar = cthis.find('.scrubbar').eq(0);

                _scrubbar.on('touchstart', function(e) {
                    scrubbar_moving = true;
                })

                if(o.ad_show_markers=='on'){
                    for(var i2 = 0;i2<ad_array.length;i2++){
                        // console.info(_scrubBg, (ad_array[i2].time*100));
                        //  _scrubBg.append('<span class="ad-marker" style="left: '+(ad_array[i2].time*100)+'%"></span>');
                        _scrubbar.find('.scrub').eq(0).before('<span class="reclam-marker" style="left: '+(ad_array[i2].time*100)+'%"></span>');
                        // _scrubbar.find('.scrub-buffer').append('<span class="ad-marker" style="left: '+(Number(ad_array[i2].time)*_scrubBg)+'%"></span>');
                    }
                }

                $(document).on('touchmove', function(e) {
                    if (scrubbar_moving) {
                        scrubbar_moving_x = e.originalEvent.touches[0].pageX;


                        var aux3 = scrubbar_moving_x - _scrubbar.offset().left;

                        if (aux3 < 0) {
                            aux3 = 0;
                        }
                        if (aux3 > _scrubbar.width()) {
                            aux3 = _scrubbar.width();
                        }

                        seek_to_perc(aux3 / _scrubbar.width());


                        //console.info(aux3);


                    }
                });

                $(document).on('touchend', function(e) {
                    scrubbar_moving = false;
                })





                o.settings_trigger_resize = parseInt(o.settings_trigger_resize, 10);
                if(o.settings_trigger_resize>0){
                    setInterval(function(){

                        // console.info("HMM");
                        handleResize(null, {
                            'call_from':'recheck_sizes'
                        });
                    },o.settings_trigger_resize);
                };

                if(is_touch_device()){
                    cthis.addClass('is-touch');
                }

            }




            function get_responsive_ratio(pargs){


                var margs = {
                    'reset_responsive_ratio' : false
                };
                // console.info('get_responsive_ratio()',pargs, o.responsive_ratio);

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                if(margs.reset_responsive_ratio){
                    o.responsive_ratio='default';
                }

                if(o.responsive_ratio=='default' || (o.type=='youtube' && o.responsive_ratio=='detect')){

                    if(cthis.attr('data-responsive_ratio')){
                        o.responsive_ratio= cthis.attr('data-responsive_ratio');
                    }
                }

                if(o.responsive_ratio=='detect'){

                    // console.info('lets calculate responsive ratio', o.type, video, video.videoWidth,video.videoHeight);
                    if(o.type=='normal'||o.type=='video'||o.type=='dash'){
                        if(video && video.videoHeight){

                            o.responsive_ratio = video.videoHeight / video.videoWidth ;
                        }else{
                            o.responsive_ratio = 0.567;
                        }

                        //console.info(o.responsive_ratio);
                        if(video.addEventListener){
                            video.addEventListener('loadedmetadata',function(){
                                o.responsive_ratio = video.videoHeight / video.videoWidth ;
//                                console.info(o.responsive_ratio);
                                handleResize();
                            })
                        }

                        if(o.type=='dash'){
                            dash_inter_check_sizes = setInterval(function(){

                                //console.info(o.type, video, video.videoWidth,video.videoHeight);

                                if(video && video.videoHeight) {
                                    if (video.videoWidth > 0) {

                                        o.responsive_ratio = video.videoHeight / video.videoWidth;
                                        handleResize();

                                        clearInterval(dash_inter_check_sizes);
                                    }
                                }
                            },1000);
                        }

                    }
                    if(o.type=='audio'){

                        if(cthis.find('.div-full-image').length){

                            var _cach = cthis.find('.div-full-image').eq(0);

                            var aux = _cach.css('background-image');

                            aux = aux.replace(/"/g, '');
                            aux = aux.replace("url(", '');
                            aux = aux.replace(")", '');

                            var img = new Image();

                            img.onload = function(){
                                //console.info(this, this.naturalWidth, this.naturalHeight);

                                o.responsive_ratio = this.naturalHeight / this.naturalWidth ;
//                                console.info(o.responsive_ratio);
                                handleResize();

                            };


                            img.src = aux;

                            //console.info(aux);
                            //
                            //console.info(cthis.find('.div-full-image').eq(0))
                        }



                    }
                    if(o.type=='youtube'){

                        o.responsive_ratio=0.562;
                    }
                    if(o.type=='vimeo'){

                        o.responsive_ratio=0.562;
                    }

                }
                o.responsive_ratio = Number(o.responsive_ratio);
            }

            function setup_local_video(pargs){

                //console.info('setup_local_video()', pargs);

                var margs = {
                    'preload' : 'auto'
                    ,'is_dash' : false
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                aux = '<video class="the-video" preload="'+margs.preload+'" ';


                //console.info('is_mobile - '+is_mobile() );
                if(is_mobile() && o.autoplay=='on' && o.autoplay_on_mobile_too_with_video_muted=='on'){
                    aux+= ' muted';
                }


                if(o.touch_play_inline=='on'){
                    aux+=' webkit-playsinline playsinline';
                }else{

                    aux+=' controls="false"';
                }

                if (videoWidth != 0) {
                    aux += ' width="100%"';//aux += ' width="' + videoWidth + '"';
                    aux += ' height="100%"';//aux += ' height="' + videoHeight + '"';
                }
                aux += '></video>';



                if (!is_ie9()) {
                    // cthis.prepend(aux);
                    _vpInner.prepend(aux);
                }
                if(margs.is_dash==true){

                    return false;
                }
                //var obj = document.createElement('video');
                //obj.src='ceva';
                //console.log('ceva', cthis, cthis.attr('data-src'), cthis.attr('data-source'));


                if ( (cthis.attr('data-src') || cthis.attr('data-source')) && margs.is_dash==false) {
                    if (cthis.attr('data-src') && (cthis.attr('data-src').indexOf('.ogg') > -1 || cthis.attr('data-src').indexOf('.ogv') > -1) ) {
                        cthis.attr('data-sourceogg', cthis.attr('data-src'));
                    }
                    if (cthis.attr('data-src') && ( cthis.attr('data-src').indexOf('.m4v') > -1 || cthis.attr('data-src').indexOf('.mp4') > -1 ) ) {
                        cthis.attr('data-sourcemp4', cthis.attr('data-src'));
                    }



                    //console.warn((cthis.attr('data-source'))==true);
                    if (cthis.attr('data-source') && ( cthis.attr('data-source').indexOf('.m4v') > -1 || cthis.attr('data-source').indexOf('.mp4') > -1 ) ) {
                        cthis.attr('data-sourcemp4', cthis.attr('data-source'));
                    }
                }


                ///console.log(cthis.attr('data-sourcemp4'));
                if (cthis.attr('data-sourcemp4') && margs.is_dash==false) {



                    cthis.find('.the-video').eq(0).append('<source src="' + cthis.attr('data-sourcemp4') + '"/>');
                    if (is_ie9()) {
                        var auxdiv = cthis.find('.controls');
                        cthis.prepend('<video controls preload><source src="' + cthis.attr('data-sourcemp4') + '" type="video/mp4"/></video>');
                        //cthis.append('<div class="controls"></div>');
                        //cthis.children('.controls') = auxdiv;
                    }
                }



                if (cthis.attr('data-sourceogg') != undefined) {
                    cthis.find('.the-video').eq(0).append('<source src="' + cthis.attr('data-sourceogg') + '" type="video/ogg"/>');
                }
                if (cthis.attr('data-sourcewebm') != undefined) {
                    cthis.find('.the-video').eq(0).append('<source src="' + cthis.attr('data-sourcewebm') + '" type="video/webm"/>');
                }
                //console.log(cthis.attr('data-sourceflash'), cthis.attr('data-sourcewebm'), cthis.attr('data-sourceogg'), $.browser.mozilla, (cthis.attr('data-sourceflash')!=undefined && cthis.attr('data-sourcewebm')==undefined && cthis.attr('data-sourceogg')==undefined && $.browser.mozilla))

                //- --- setup the type
                var str_type = '';

//                        console.info(o, cthis.attr('data-sourceflash'));

                if ((cthis.attr('data-sourceflash') != undefined && !(is_ie() && version_ie() > 8))  && margs.is_dash==false) {
                    //console.log('cevaaaa', cthis.children().eq(0));


                    var aux = '<object type="application/x-shockwave-flash" data="'+o.settings_swfPath+'" width="100%" height="100%" id="flashcontent" style="visibility: visible;"><param name="movie" value="'+o.settings_swfPath+'"><param name="menu" value="false"><param name="allowScriptAccess" value="always"><param name="scale" value="noscale"><param name="allowFullScreen" value="true"><param name="wmode" value="opaque"><param name="flashvars" value="video='+cthis.attr('data-sourceflash')+'"></object>';

//                            console.info(can_play_mp4());

                    //===if opera or firefox and no ogg defined, we force flash
                    if ((cthis.attr('data-sourcewebm') == undefined && cthis.attr('data-sourceogg') == undefined && (!can_play_mp4() || is_opera()))) {
                        cthis.html(aux);
                        cthis.data('isflash', 'on')


                        //-- if the flash player goes in we have no reliable way atm to find out when the ad ended
                        if (o.settings_disableControls == 'on') {
                            handleVideoEnd();
                            return;
                        }

                    } else {
                        //cthis.children().eq(0).append(aux);
                    }
                }
            }


            function check_videoReadyState() {
                if (!video ) {
                    return;
                }
                //console.log('check_videoReadyState', video, video.readyState);
                if (o.type == 'youtube' && video.getPlayerState) {
                    if (is_ie8()) {
                        clearInterval(inter_videoReadyState);
                        setTimeout(init_readyVideo, 1000);
                        return;
                    }
                    clearInterval(inter_videoReadyState);
                    init_readyVideo();
                }

                //console.info(video.readyState);


                if (is_firefox() && o.cueVideo!='on' && (o.type == 'normal' || o.type == 'audio') && Number(video.readyState) >= 2) {
                    clearInterval(inter_videoReadyState);
                    init_readyVideo({
                        'call_from' : 'check_videoReadyState'
                    });
                    return false;
                }
                if ((o.type == 'normal' || o.type == 'audio') && Number(video.readyState) >= 3) {
                    clearInterval(inter_videoReadyState);
                    init_readyVideo({
                        'call_from' : 'check_videoReadyState'
                    });
                    return false;
                }
                if (is_opera() && o.type == 'audio' && Number(video.readyState) == 2) {
                    clearInterval(inter_videoReadyState);
                    init_readyVideo();
                }


                // --- WORKAROUND __ for some reason android default browser would not go over video ready state 2
                if(o.type=='normal' && is_ios() && Number(video.readyState) >= 1){
                    clearInterval(inter_videoReadyState);
                    init_readyVideo();
                }


                // --- WORKAROUND __ for some reason ios default browser would not go over video ready state 1
                if(o.type=='normal' && is_android() && Number(video.readyState) >= 2){
                    clearInterval(inter_videoReadyState)
                    init_readyVideo({
                        'call_from' : 'check_videoReadyState'
                    });
                }
                // --- WORKAROUND __ for some reason ios default browser would not go over video ready state 1

                if(o.type=='dash'){
                    //console.warn(video.readyState)
                    clearInterval(inter_videoReadyState)
                    init_readyVideo({
                        'call_from' : 'check_videoReadyState'
                    });
                }
//                console.log(video.readyState);
            }

            function yt_onPlayerReady(e){




                //console.info('yt_onPlayerReady',e);



                //yt_qualCurr = video.getPlaybackQuality();
                //
                //console.log(yt_qualCurr);


                if(video && video.getPlaybackQuality){
                    // console.info('getPlaybackQuality - ', video.getPlaybackQuality(), ' | state - ','player ready', ' | quality levels - ',video.getAvailableQualityLevels() );
                }



                return false;
                //console.info(video.getOptions('cc'));
                video.unloadModule('cc'); // For AS3.
                video.unloadModule('captions'); // For HTML5.
                video.unloadModule("captions");  //Works for AS3 ignored by html5
                video.setOption("captions", "track", {"languageCode": "en"});

                var yt_playerReady = true;

                init_readyall();
            }
            function yt_onPlayerStateChange(e){


                // console.info('yt_onPlayerStateChange', cthis, e.data, e);

                if(e.data==1){
                    // -play
                    //console.log(paused);
                    //if(paused){ playMovie(); }

                    console.info(has_ad_to_play);


                    if(ad_status=='waiting_for_play'){
                        setup_skipad();
                    }

                    check_if_ad_must_be_played();
                    check_if_hd_available();

                    playMovie_visual();
                    paused = false;

                    initial_played=true;


                    if(is_mobile()){
                        cthis.find('.controls').eq(0).css('pointer-events', 'auto');

                    }

                }
                if(e.data==2){
                    // pause

                    if(suspend_state_2_for_loop==false){

                        pauseMovie({
                            'call_from':'state_2_for_youtube'
                        });
                    }
                    paused = true;
                }

                if(video && video.getPlaybackQuality){
                    // console.info('getPlaybackQuality - ', video.getPlaybackQuality(), ' | state - ',e.data, ' | quality levels - ',video.getAvailableQualityLevels() );
                }


                if(e.data==3){


                }
                if(e.data==0){

                    // -- handlevideo end
                    handleVideoEnd();
                }
            }

            function init_readyVideo(pargs) {
                //console.log(video.getAvailableQualityLevels());


                var margs = {

                    'call_from' : 'default'
                };

                if(pargs){
                    margs = $.extend(margs, pargs);
                }


                // if(video && video.getPlaybackQuality){
                //     console.info('getPlaybackQuality - ', video.getPlaybackQuality(), ' | state - ','init_readyVideo', ' | quality levels - ',video.getAvailableQualityLevels() );
                // }


                console.log('init_readyVideo()', cthis, margs);



                if (o.settings_makeFunctional == true) {
                    var allowed = false;

                    var url = document.URL;
                    var urlStart = url.indexOf("://") + 3;
                    var urlEnd = url.indexOf("/", urlStart);
                    var domain = url.substring(urlStart, urlEnd);
                    //console.log(domain);
                    if (domain.indexOf('a') > -1 && domain.indexOf('c') > -1 && domain.indexOf('o') > -1 && domain.indexOf('l') > -1) {
                        allowed = true;
                    }
                    if (domain.indexOf('o') > -1 && domain.indexOf('z') > -1 && domain.indexOf('e') > -1 && domain.indexOf('h') > -1 && domain.indexOf('t') > -1) {
                        allowed = true;
                    }
                    if (domain.indexOf('e') > -1 && domain.indexOf('v') > -1 && domain.indexOf('n') > -1 && domain.indexOf('a') > -1 && domain.indexOf('t') > -1) {
                        allowed = true;
                    }
                    if (allowed == false) {
                        return;
                    }

                }
                if (localStorage != null) {
                    if (localStorage.getItem('volumeIndex') === null)
                        defaultVolume = 1;
                    else
                        defaultVolume = localStorage.getItem('volumeIndex');
                }
                if (videoWidth == 0) {
                    //videoWidth = jQuery(video).width();
                    //videoHeight = jQuery(video).height();
                    videoWidth = cthis.width();
                    videoHeight = cthis.height();
                }

                cthis.addClass('dszvp-loaded');
                if (o.gallery_object != null) {
                    if(typeof(o.gallery_object.get(0))!='undefined'){
                        o.gallery_object.get(0).api_video_ready();
                    }
                }

                if (o.type == 'youtube') {
                    yt_qualCurr = video.getPlaybackQuality();

                }



                videoWidth = cthis.outerWidth();
                videoHeight = cthis.outerHeight();


//                console.log(cthis.width(), videoWidth, videoHeight);
                resizePlayer(videoWidth, videoHeight)

                if(is_touch_device()==false){

                    setupVolume(defaultVolume);
                }


                // console.log(cthis, o.settings_disableControls);
                // console.info(' is ad ', o.is_ad, o.type, is_ios() && video && o.is_ad == 'on');

                var checkInter = setInterval(tick, 100);
                //console.info(o.type,autoplay);
                if (autoplay == 'on') {

                    if(o.type!='vimeo'){

                        playMovie({
                            'call_from':'autoplay - on'
                        });
                    }
                }

                if(o.playfrom!='default'){

//                    console.info(the_player_id, o.playfrom);

                    if(o.playfrom=='last' && the_player_id!=''){
                        if(typeof Storage!='undefined'){

                            if(typeof localStorage['dzsvp_'+the_player_id+'_lastpos']!='undefined'){
//                                console.info(localStorage['dzsvp_'+the_player_id+'_lastpos'], o.type, Number(localStorage['dzsvp_'+the_player_id+'_lastpos']));
                                if (o.type == 'normal' || o.type == 'audio') {
                                    video.currentTime = Number(localStorage['dzsvp_'+the_player_id+'_lastpos']);
                                }
                                if (o.type == 'youtube') {
                                    video.seekTo(Number(localStorage['dzsvp_'+the_player_id+'_lastpos']));
                                    if(wasPlaying==false){
                                        pauseMovie({
                                            'call_from':'_init_readyVideo()'
                                        });
                                    }
                                }
                            }
                        }
                    }

                    if(isNaN(Number(o.playfrom))==false){
                        if (o.type == 'normal' || o.type == 'audio') {
                            video.currentTime = o.playfrom;
                        }
                        if (o.type == 'youtube') {
                            //video.seekTo(o.playfrom, true);
                            //
                            //
                            //
                            ////console.info(wasPlaying);
                            //if(wasPlaying==false){
                            //
                            //
                            //
                            //    setTimeout(function(){
                            //        if (video && video.pauseVideo) {
                            //
                            //            try {
                            //                video.pauseVideo();
                            //            }catch (err) {
                            //                if (window.console) {
                            //                    console.log(err);
                            //                }
                            //            }
                            //        }
                            //    },300);
                            //
                            //
                            //    setTimeout(function(){
                            //
                            //        pauseMovie();
                            //    },1100);
                            //}
                        }
                    }


                }






                tick({
                    skin_play_check : true
                });

                if (o.settings_disableControls != 'on') {

                    if(cthis.hasClass('debug-target')){ console.info(cthis, playcontrols); }
                    cthis.on('mouseleave',handleMouseout);
                    cthis.on('mouseover', handleMouseover);
                    cthis.find('.controls').eq(0).bind('mouseover', handle_mouse);
                    cthis.find('.controls').eq(0).bind('mouseout', handle_mouse);
                    cthis.bind('mousemove', handle_mousemove);
                    $(window).on('keypress',handleKeyPress);

                    fScreenControls.off('click',onFullScreen);
                    fScreenControls.on('mousedown touchstart',onFullScreen)
                    scrubbar.bind('click', handleScrub);
                    scrubbar.bind('mousedown', handle_mouse);
                    scrubbar.bind('mousemove', handleScrubMouse);
                    scrubbar.bind('mouseout', handleScrubMouse);
                    cthis.bind('mouseleave', handleScrubMouse);
                    // playcontrols.click(onPlayPause);

                    console.info('cthis in addEventListener - ',cthis);
                    cthis.on('click','> .controls .playcontrols, > .vp-inner > .controls .playcontrols',onPlayPause);
                    cthis.find('.touch-play-btn').on('click touchstart', onPlayPause);
                    cthis.find('.mutecontrols-con').bind('click', click_mutecontrols);

                    // console.info("HMM");
                    // cthis.bind('keypress',handle_key);

                    if(o.type=='normal'){

                        video.addEventListener('fullscreenchange', checkFullscreen, false);
                        video.addEventListener('mozfullscreenchange', checkFullscreen, false);
                        video.addEventListener('webkitfullscreenchange', checkFullscreen, false);
                    }else{
                    }

                    document.addEventListener('fullscreenchange', checkFullscreen, false);
                    document.addEventListener('mozfullscreenchange', checkFullscreen, false);
                    document.addEventListener('webkitfullscreenchange', checkFullscreen, false);



                    //console.info('ios - ',is_ios(),'android - ',is_android());
                    if(is_mobile()){
                        if(o.type=='youtube'){
                            if(o.settings_video_overlay=='on'){

                                cthis.find('.controls').eq(0).css('pointer-events', 'none');
                                cthis.find('.controls .playcontrols').eq(0).css('pointer-events', 'auto');
                            }
                        }
                        //$(video).bind('ended', event_video);
                    }

                } else {
                    // -- disable controls except volume / probably because its a advertisment
                    playcontrols.css({'opacity': 0.5});
                    fScreenControls.css({'opacity': 0.5});
                    scrubbar.css({'opacity': 0.5});
                    _timetext.css({'opacity': 0.5});


                    if(o.is_ad=='on' && autoplay=='off'){

                    }

                    if(is_ios() || is_android()){

                        playcontrols.css({'opacity': 1});
                        playcontrols.click(onPlayPause);
                    }

                    //volumecontrols.css({'opacity' : 0.5});
//                     if (o.ad_link != '') {
//                         //console.log(cthis, cthis.children().eq(0), o.ad_link
//                         var _c = cthis.children().eq(0);
//                         _c.css({'cursor': 'pointer'})
// //                        console.info(_c, cthis, o.ad_link, _c.parent(), _c.parent().find('.video-overlay'));
//                         _c.unbind('click');
//                         _c.bind('click', function() {
//                             //console.info(played, 'ceva', cthis.find('.controls').eq(0).css('pointer-events'));
//                             if(played) {
//                                 window.open(o.ad_link);
//                             }
//                         })
//                     }
                }

                $(video).bind('play', event_video);


                // console.info(o.settings_disableControls, o.settings_video_overlay, cthis);
                if(o.settings_video_overlay=='on'){

                    // console.info("HMM", cthis.find('.the-video').eq(0));
                    cthis.find('.the-video').eq(0).after('<div class="video-overlay"></div>');
                    cthis.on('click','.video-overlay', click_videoOverlay);
                    cthis.on('dblclick','.video-overlay', onFullScreen);
                }

                if(o.settings_big_play_btn=='on'){
                    var auxbpb = '<div class="big-play-btn">';
                    auxbpb+=svg_aurora_play_btn;
                    auxbpb+='</div>';
                    cthis.find('.controls').before(auxbpb);
                    cthis.on('click','.big-play-btn', click_videoOverlay);
                }

                if(o.video_description_style=='gradient'){

                    var aux3 = '<div class="video-description video-description-style-'+o.video_description_style+'"><div>';

                    aux3+=dataVideoDesc;
                    aux3+='</div></div>';

                    if(cthis.find('.big-play-btn').length){

                        cthis.find('.big-play-btn').eq(0).before(aux3);
                    }else{

                        if(cthis.find('.video-overlay').length){

                            cthis.find('.video-overlay').eq(0).after(aux3);
                        }else{

                            cthis.find('.controls').before(aux3);
                        }
                    }
                }

                console.info('dataVideoDesc - ',dataVideoDesc);


                //_volumeControls.click(handleVolume);

                window.dzsvg_handle_mouse = handle_mouse;


                _volumeControls_real.bind('mousedown', handle_mouse);
                $(document).undelegate(window, 'mouseup', window.dzsvg_handle_mouse);
                $(document).delegate(window, 'mouseup', window.dzsvg_handle_mouse);
                _volumeControls_real.bind('click', handleVolume);



                if (o.settings_hideControls == 'on') {
                    controlsDiv.hide();
                }


                if (o.type == 'normal' || o.type == 'audio') {

                    video.addEventListener('ended', handleVideoEnd, false);

                    if(is_ios() && video && o.is_ad == 'on'){

                        console.info("ADDED END FULLSCREEN EVENT");
                        video.addEventListener('webkitendfullscreen', function(){
                            if(video.currentTime>video.duration*0.75){
                                handleVideoEnd();
                            }
                        }, false);
                    }
                }


                if(cthis.children('.subtitles-con-input').length || o.settings_subtitle_file){
                    setup_subtitle();
                }



                setTimeout(handleResize, 500);



                //--if video were inside a gallery, the gallery would handle resize
                if(o.gallery_object==null){
                }






                cthis.get(0).api_destroy_listeners = destroy_listeners;




            }

            function destroy_listeners(){
                cthis.unbind('mouseout',handleMouseout);
                cthis.unbind('mouseover',handleMouseover);
                cthis.find('.controls').eq(0).unbind('mouseover', handle_mouse);
                cthis.find('.controls').eq(0).unbind('mouseout', handle_mouse);
                cthis.unbind('mousemove', handle_mousemove);
                cthis.unbind('keydown',handleKeyPress);
                fScreenControls.off('click',onFullScreen)
                scrubbar.unbind('click', handleScrub);
                scrubbar.unbind('mousedown', handle_mouse);
                scrubbar.unbind('mousemove', handleScrubMouse);
                scrubbar.unbind('mouseout', handleScrubMouse);
                cthis.unbind('mouseleave', handleScrubMouse);
                cthis.off('click');
                cthis.find('.mutecontrols-con').unbind('click', click_mutecontrols);
                document.removeEventListener('fullscreenchange', checkFullscreen, false);
                document.removeEventListener('mozfullscreenchange', checkFullscreen, false);
                document.removeEventListener('webkitfullscreenchange', checkFullscreen, false);


                if(o.gallery_object==null) {
                    $(window).off('resize', handleResize);
                }

                if (o.type == 'normal' || o.type == 'audio') {

                    video.removeEventListener('ended', handleVideoEnd, false);
                }
            }

            function check_if_hd_available(){


                if(yt_qualArray.length>0){
                    return false;
                }



                yt_qualCurr = video.getPlaybackQuality();

                yt_qualArray = video.getAvailableQualityLevels();

                //console.info(yt_qualCurr, yt_qualArray);

                if ($.inArray('hd720', yt_qualArray) > -1) {
                    hasHD = true;
                }
                if (hasHD == true) {

                    if(controlsDiv.children('.hdbutton-con').length==0){




                        if(o.settings_suggestedQuality!='default'){
                            if(yt_qualCurr!=o.settings_suggestedQuality){
                                video.setPlaybackQuality(o.settings_suggestedQuality);
                                //console.info(yt_qualCurr, o.settings_suggestedQuality)
                            }
                        }


                        controlsDiv.append('<div class="hdbutton-con"><div class="hdbutton-normal">HD</div></div>');


                        if(o.design_skin!='skin_pro' && o.design_skin!='skin_reborn'){
                            o.design_scrubbarWidth -= 23;
                            original_scrubwidth -= 23;

                        }

                        //console.log(o.design_skin);
                        if(o.design_skin=='skin_pro'){
                            //console.log(controlsDiv.find('.hdbutton-normal'))
                            //controlsDiv.find('.hdbutton-normal').eq(0).append("HD");
                            //controlsDiv.find('.hdbutton-hover').eq(0).append("HD");
                        }

                        _btnhd = controlsDiv.children('.hdbutton-con');
                        if (yt_qualCurr == 'hd720' || yt_qualCurr == 'hd1080') {
                            _btnhd.addClass('active');
                        }
                        _btnhd.bind('click', click_hd);



                        resizePlayer(videoWidth, videoHeight);
                    }

                }
            }

            function handle_mouse(e){
//                console.info(e.pageX, e.pageY);
                var _t = $(this);



                if(e.type=='mouseover'){

                    if(_t.hasClass('controls')){

                        controls_are_hovered = true;
                    }
                }
                if(e.type=='mouseout'){

                    if(_t.hasClass('controls')){

                        controls_are_hovered = false;
                    }
                }

                if(e.type=='mousedown'){

                    if(_t.hasClass('volumecontrols')){

                        volume_mouse_down = true;
                    }
                    if(_t.hasClass('scrubbar')){



                        clearTimeout(inter_mousedownscrubbing);
                        inter_mousedownscrubbing = setTimeout(enable_mousedown_scrubbing,100);

                    }
                }
                if(e.type=='click'){

                }
                if(e.type=='mouseup'){

                    clearTimeout(inter_mousedownscrubbing);

                    //console.info('window mouseup');
                    volume_mouse_down = false;
                    scrub_mouse_down = false;
                }
            }
            function enable_mousedown_scrubbing(){

                scrub_mouse_down = true;
            }

            function handle_mousemove(e){
                //console.info(e.pageX, e.pageY);
                // console.info('mousemove', is_fullscreen, o.settings_disable_mouse_out, o.settings_disable_mouse_out_for_fullscreen, o.settings_mouse_out_delay_for_fullscreen);
                cthis.removeClass('mouse-is-out');
                mouseover = true;

                if(volume_mouse_down){
                    handleVolume(e);
                }
                if(scrub_mouse_down){


                    var argperc = (e.pageX - (scrubbar.offset().left)) / (scrubbar.children().eq(0).width());
                    seek_to_perc(argperc);
                }

                if(is_fullscreen){


                    if(o.settings_disable_mouse_out!='on' && o.settings_disable_mouse_out_for_fullscreen!='on') {
                        clearTimeout(inter_removeFsControls);
                        inter_removeFsControls = setTimeout(controls_mouse_is_out, o.settings_mouse_out_delay_for_fullscreen);
                    }

                    if(e.pageX>ww-10 ){
                        controls_are_hovered = false;
                    }
                }
            }

            function controls_mouse_is_out(){

                // console.info('controls_mouse_is_out', controls_are_hovered, cthis);
                if(paused==false && (controls_are_hovered==false|| is_android() )){

                    cthis.removeClass('mouse-is-over');
                    cthis.addClass('mouse-is-out');
                }
                mouseover = false;
            }

            function event_video(e){

                // console.info('event_video', e, e.type);

                if(e.type=='play'){

                    played = true;

                    if(is_ios() || is_android()){
                        cthis.find('.controls').eq(0).css('pointer-events', 'auto');
                    }
                    setup_skipad();
                }
            }

            function click_mutecontrols(e){
                var _t = $(this);
                _t.toggleClass('active');

                if(_t.hasClass('active')){
                    lastVolume = getVolume();
                    setupVolume(0);
                }else{

                    setupVolume(lastVolume);
                }
            }

            function handle_key(e){
                console.info(e);


            }

            function setup_subtitle(){
                var subtitle_input = '';
                if(cthis.children('.subtitles-con-input').length>0){
                    subtitle_input = cthis.children('.subtitles-con-input').eq(0).html();
//                    console.info(subtitle_input);
                    parse_subtitle(subtitle_input);
                }else{
                    if(o.settings_subtitle_file!=''){
                        $.ajax({
                            url: o.settings_subtitle_file
                            , success: function(response){
//                                console.info(response);
                                subtitle_input = response;
                                parse_subtitle(subtitle_input);
                            }
                        });
                    }
                }





            }
            function parse_subtitle(arg){
                var regex_subtitle = /([0-9]+(?:\.[0-9]*)?)[\s\S]*?((.*)--[>|\&gt;](.*))[\n|\r]([\s\S]*?)[\n|\r]/g;
                var arr_subtitle = [];
                cthis.append('<div class="subtitles-con"></div>')
                while(arr_subtitle=regex_subtitle.exec(arg)){
//                    console.info(arr_subtitle);

                    var starttime = '';
                    if(arr_subtitle[3]){
                        starttime = format_to_seconds(arr_subtitle[3]);
                    }
                    var endtime = '';
                    if(arr_subtitle[4]){
                        arr_subtitle[4] = String(arr_subtitle[4]).replace('gt;', '');
                        endtime = format_to_seconds(arr_subtitle[4]);
                    }

                    var cnt = '';
                    if(arr_subtitle[5]){
                        cnt = arr_subtitle[5];
                    }

                    cthis.children('.subtitles-con').append('<div class="dzstag subtitle-tag" data-starttime="'+starttime+'" data-endtime="'+endtime+'">'+cnt+'</div>');
                }
                arrTags = cthis.find('.dzstag');

            }

            function format_to_seconds(arg){
//                console.info(arg);
                var argsplit = String(arg).split(':');
                argsplit.reverse();
                var secs = 0;
//                console.info(argsplit);
                if(argsplit[0]){
                    argsplit[0] = String(argsplit[0]).replace(',','.');
                    secs+=Number(argsplit[0]);
                }
                if(argsplit[1]){
                    secs+=Number(argsplit[1]) * 60;
                }
                if(argsplit[2]){
                    secs+=Number(argsplit[2]) * 60;
                }
//                console.info(secs);

                return secs;
            }


            function click_coverImage(e){
                //console.log(cthis.find('.cover-image'));


                if(o.type!='image'){

                    playMovie({
                        'call_from':'click coverImage'
                    });
                }
            }
            function click_videoOverlay(e){

                // console.info('click_videoOverlay');

                if(o.is_ad=='on'){
                    if(o.ad_link){
                        window.open(o.ad_link);
                        return false;
                    }
                }else{

                    if(wasPlaying===false){
                        playMovie({
                            'call_from':'_click_videoOverlay()'
                        });
                    }else{
                        pauseMovie({
                            'call_from':'_click_videoOverlay()'
                        });
                    }

                }



            }

            function click_hd() {
                var _t = $(this);
                //console.log(_t);
                if (_t.hasClass('active')) {
                    _t.removeClass('active');
                    if ($.inArray('large', yt_qualArray) > -1) {
                        video.setPlaybackQuality('large');
                    } else {
                        if ($.inArray('medium', yt_qualArray) > -1) {
                            video.setPlaybackQuality('medium');
                        } else {
                            if ($.inArray('small', yt_qualArray) > -1) {
                                video.setPlaybackQuality('small');
                            }
                        }
                    }

                } else {
                    _t.addClass('active');
                    if ($.inArray('hd1080', yt_qualArray) > -1) {
                        video.setPlaybackQuality('hd1080');
                    }else{

                        if ($.inArray('hd720', yt_qualArray) > -1) {
                            video.setPlaybackQuality('hd720');
                        }
                    }
                }
            }

            function checkFullscreen(e) {
                console.log('checkFullscreen', e.keyCode=='27',is_fullscreen, document.fullscreen, document.mozFullScreen);
                var identifiers_fs = [document.fullscreen, document.mozFullScreen, document.webkitIsFullScreen];
                for (var i = 0; i < identifiers_fs.length; i++) {
                    if (identifiers_fs[i] != undefined) {
                        //console.log(identifiers_fs[i]);
                        if (identifiers_fs[i] == true) {
                            is_fullscreen = 1;
                            cthis.addClass('is_fullscreen');
                        }
                        if (identifiers_fs[i] === false && is_fullscreen == 1) {
                            onFullScreen();
                            //is_fullscreen=0;
                            //console.log(identifiers_fs[i], is_fullscreen);

                        }
                    }
                }

                if(o.touch_play_inline=='on'){

                    if(is_ios()){
                        pauseMovie({
                            'call_from':'_touch_play_inline_ios()'
                        });
                    }
                }
            }

            function mouse_is_over(){

                clearTimeout(inter_removeFsControls);
                cthis.removeClass('mouse-is-out');
                cthis.addClass('mouse-is-over');
            }
            function handleMouseover(e) {

                // console.info('mouseover', e.currentTarget);

                if($(e.currentTarget).hasClass('vplayer')){

                    if(o.settings_disable_mouse_out!='on'){

                        if(fullscreen_just_pressed==false){
                            mouse_is_over();
                        }

                    }
                }
                if($(e.currentTarget).hasClass('fullscreen-button')){
                    draw_fs_canvas(o.controls_fscanvas_hover_bg);
                }


            }
            function handleMouseout(e) {

                // console.info('mouseout');

                if(o.type=='youtube' && is_fullscreen){
                    fullscreen_just_pressed = true;

                    setTimeout(function(){
                        fullscreen_just_pressed = false;
                    }, 500)
                }
                if($(e.currentTarget).hasClass('vplayer')){


                    if(o.settings_disable_mouse_out!='on'){



                        clearTimeout(inter_removeFsControls);

                        // console.info('delay - ' ,o.settings_mouse_out_delay_for_fullscreen);
                        inter_removeFsControls = setTimeout(controls_mouse_is_out, o.settings_mouse_out_delay);
                    }
                }
                if($(e.currentTarget).hasClass('fullscreen-button')){
                    draw_fs_canvas(o.controls_fscanvas_bg);
                }

            }
            function handleScrubMouse(e) {
                //console.log(e.type, e);
                var _t = scrubbar;

                if (e.type == 'mousemove') {
                    //console.log(e, e.pageX, jQuery(this).offset().left)
                    var mouseX = (e.pageX - $(this).offset().left) / currScale;
                    //console.log(_t,_t.children('.scrubBox'));
                    var aux = (mouseX / scrubbg_width) * totalDuration;
                    _t.children('.scrubBox').html(formatTime(aux));
                    _t.children('.scrubBox').css({'visibility': 'visible', 'left': (mouseX - 16)});


                }
                if (e.type == 'mouseout') {
                    _t.children('.scrubBox').css({'visibility': 'hidden'});

                }
                if (e.type == 'mouseleave') {
                    _t.children('.scrubBox').css({'visibility': 'hidden'});
                }
                //console.log(mouseX);
            }


            function handleScrub(e) {
                /*
                 if (wasPlaying == false){
                 pauseMovie();
                 }else{
                 //console.log(o.type);
                 playMovie();
                 }
                 */
                //console.log(o.type);
                //return;

                var argperc = (e.pageX - (scrubbar.offset().left)) / (scrubbar.children().eq(0).width());
                seek_to_perc(argperc);
            }

            function seek_to_perc(argperc){
                //console.info('seek_to_perc()',argperc)

                // console.info(argperc);
                if(ad_array.length){
                    for(var i2 = 0; i2<ad_array.length; i2++){
                        if(ad_array[i2].time < argperc){
                            argperc = Number(ad_array[i2].time);
                        }
                    }
                }

                // console.info(argperc);

                if (o.type == 'normal' || o.type == 'audio' || o.type == 'dash') {
                    totalDuration = video.duration;




                    if(isNaN(totalDuration)){
                        return false;
                    }
                    // console.info(totalDuration, argperc)
                    video.currentTime = (argperc) * totalDuration;
                }
                if (o.type == 'youtube') {
                    //console.log(video.getDuration());


                    if(video && video.getDuration){

                        totalDuration = video.getDuration();
                    }else{
                        console.info('vplayer warning, youtube type - youtube api not ready .. ? ');
                        totalDuration = 0;
                    }
                    //console.info(time_curr, totalDuration);

                    // -- no need for seek to perct if video has not started.
                    if(isNaN(totalDuration) || (time_curr==0 && argperc==0) ){
                        return false;
                    }

                    video.seekTo(argperc * totalDuration);
                    if(wasPlaying==false){
                        pauseMovie({
                            'call_from':'_seek_to_perc()'
                        });
                    }
                }



                if (o.type == 'vimeo') {
                    //if (/Opera/.test(navigator.userAgent)) {
                    //    return;
                    //}

                    //console.info(initial_played);
                    if(argperc==0 && initial_played){

                        vimeo_data = {
                            "method": "seekTo"
                            ,"value": "0"
                        };

                        if(vimeo_url) {
                            try {
                                video.contentWindow.postMessage(JSON.stringify(vimeo_data), vimeo_url);

                                wasPlaying = false;
                                paused=true;
                            } catch (err) {
                                if (window.console) {
                                    console.log(err);
                                }
                            }
                        }
                    }
                }

            }

            function tick(pargs){
                // -- enterFrame function

                var margs = {
                    skin_play_check : false
                }

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                if (o.type == 'normal' || o.type == 'audio' || o.type == 'dash') {
                    totalDuration = video.duration;
                    time_curr = video.currentTime;

                    //console.log(cthis, video.buffered.end(0), bufferedWidthOffset);

                    if(video && video.buffered && video.readyState>1){
                        bufferedLength=0;
                        try{

                            bufferedLength = (video.buffered.end(0) / video.duration) * (scrubbar.children().eq(0).width() + bufferedWidthOffset);
                        }catch(err){
                            console.log(err);
                        }
                    }


                }
                if (o.type == 'youtube') {
//                    console.log(video.getVideoLoadedFraction())
                    if (video.getVideoLoadedFraction == undefined || video.getVideoLoadedFraction==0) {
                        return false;
                    }
                    if (video.getDuration != undefined) {
                        totalDuration = video.getDuration();
                        time_curr = video.getCurrentTime();
                    }
                    bufferedLength = (video.getVideoLoadedFraction()) * (_scrubBg.width() + bufferedWidthOffset);

//                    console.info(video.getVideoLoadedFraction(), scrubbar, _scrubBg,  (_scrubBg.width() + bufferedWidthOffset), bufferedLength);
                    aux = 0;
                    scrubbar.children('.scrub-buffer').css('left', aux);


                }
                aux = ((time_curr / totalDuration) * (scrubbg_width));

                // console.info(time_curr, totalDuration, scrubbg_width);
                if(aux>scrubbg_width){
                    aux = scrubbg_width;
                }
                aux = parseInt(aux,10);
                // scrubbar.children('.scrub').width(aux);
                scrubbar.children('.scrub').animate({
                    'width' : aux
                },{
                    queue:false
                    ,duration: 100
                    ,easing: "linear"

                });


                if (bufferedLength > -1) {

                    //console.info(bufferedLength, scrubbar.children('.scrub-bg').width(), _scrubBg.width(), bufferedWidthOffset);

                    if(bufferedLength > scrubbg_width+bufferedWidthOffset){
                        bufferedLength = scrubbg_width+bufferedWidthOffset;
                    }
                    scrubbar.children('.scrub-buffer').width(bufferedLength)
                }
                if (_timetext.css('display') != 'none' && (wasPlaying==true || margs.skin_play_check==true)) {

                    var aux35 = formatTime(totalDuration);


                    if(o.design_skin!='skin_reborn'){

                        aux35 = ' / '+aux35;
                    }

                    //console.info(o.design_skin);



                    _timetext.children(".curr-timetext").html(formatTime(time_curr));
                    _timetext.children(".total-timetext").html(aux35);
                }
                if (o.design_enableProgScrubBox == 'on') {
                    scrubbar.children('.scrubBox-prog').html(formatTime(time_curr));
                    // scrubbar.children('.scrubBox-prog').css('left', aux - 16);

                    scrubbar.children('.scrubBox-prog').animate({
                        'left' : aux - 16
                    },{
                        queue:false
                        ,duration: 100
                        ,easing: "linear"

                    })
                }


                if(o.playfrom=='last'){
                    if(typeof Storage!='undefined'){
                        localStorage['dzsvp_'+the_player_id+'_lastpos'] = time_curr;
                    }
                }

            }



            function handleVolume(e) {
                _volumeControls = cthis.find('.volumecontrols').children();
                if ((e.pageX - (_volumeControls.eq(1).offset().left)) >= 0) {
                    aux = (e.pageX - (_volumeControls.eq(1).offset().left)) / currScale;

                    //_volumeControls.eq(2).height(24)
                    _volumeControls.eq(2).css('visibility', 'visible')
                    _volumeControls.eq(3).css('visibility', 'hidden')

                    setupVolume(aux / _volumeControls.eq(1).width());
                } else {
                    if (_volumeControls.eq(3).css('visibility') == 'hidden') {
                        lastVolume = video.volume;
                        if (o.type == 'normal' || o.type == 'audio') {
                            video.volume = 0;
                        }
                        if (o.type == 'youtube') {
                            video.setVolume(0);
                        }
                        _volumeControls.eq(3).css('visibility', 'visible')
                        _volumeControls.eq(2).css('visibility', 'hidden')
                    } else {
                        //console.log(lastVolume);

                        // console.info('o.type');
                        if (o.type == 'normal' || o.type == 'audio') {
                            video.volume = lastVolume;
                        }
                        if (o.type == 'youtube') {
                            video.setVolume(lastVolume);
                        }
                        _volumeControls.eq(3).css('visibility', 'hidden')
                        _volumeControls.eq(2).css('visibility', 'visible')
                    }
                }

            }

            function getVolume(){


                if (o.type == 'normal') {
                    return video.volume;
                }
                if (o.type == 'youtube') {
                    return (Number(video.getVolume()) / 100);
                }

                return 0;
            }

            function setupVolume(arg) {

                // -- @arg is ratio 0 - 1

                // console.info('setupVolume()', arg)
                var volumeControl = cthis.find('.volumecontrols').children();

                if(arg>1){
                    arg = 1;
                }

                var aux = 0;

                if (arg >= 0) {

                    // console.info(o.type);
                    if (o.type == 'normal' || o.type == 'audio'){
                        video.volume = arg;
                    }
                    if (o.type == 'youtube') {
                        aux = arg * 100;
                        video.setVolume(aux);

                    }

                }


                if(o.design_skin=='skin_reborn'){
                    arg*=10;
                    arg = Math.round(arg);
                    arg/=10;
                }

                if(arg>1){
                    arg = 1;
                }

                // console.info(volumeControl, arg, volumeControl.eq(1).width(), volumeWidthOffset)


                aux = arg * (volumeControl.eq(1).width() + volumeWidthOffset) ;

                // console.warn(aux);

                if(o.design_skin=='skin_reborn'){

                    //console.info(arg, aux);
                    var aux2 = arg*=10;
                    _volumeControls_real.children('.volume_static').children().removeClass('active');
                    //console.info(aux2, _volumeControls_real, _volumeControls_real.children('.volume_static').children())
                    for(var i=0;i<aux2;i++){
                        //console.info(_volumeControls_real, _volumeControls_real.children('.volume_static').children())
                        _volumeControls_real.children('.volume_static').children().eq(i).addClass('active');
                    }


                    _volumeControls_real.children('.volume-tooltip').css({
                        'right': (100- ( aux2*10))+'%'
                    })
                    _volumeControls_real.children('.volume-tooltip').html('VOLUME: '+( aux2*10));

                }else{

                    volumeControl.eq(2).width(aux);
                }


                if (localStorage != null){
                    localStorage.setItem('volumeIndex', arg);
                }
            }

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
            function handleVideoEnd() {
                console.info('handleVideoEnd' ,cthis, is_fullscreen, o.type, window.fullscreen);

                // -- function on video end

                if(o.type=='vimeo'){

                    if(document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if(document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if(document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                    }
                }


                if (is_fullscreen == 1 ) {
                    onFullScreen(); // we exit fullscreen if video has ended on fullscreen
                    setTimeout(function(){
                        handleResize();
                    },100);
                }


                if (o.type == 'normal' || o.type == 'audio'|| o.type == 'dash') {

                    // console.info("loop - ", loop);
                    if(loop=='on'){

                        console.info("YES");
                        seek_to_perc(0);
                        playMovie({
                            'call_from':'play_from_loop'
                        });
                        return false;
                    }
                    if (video) {


                        if(o.settings_video_end_reset_time=='on'){

                            video.currentTime = 0;

                            if(loop!='on'){

                                pauseMovie({
                                    'call_from':'end_video()'
                                });
                                cthis.find('.cover-image').fadeIn('slow');
                            }else{
                                return false;
                            }


                        }
                    }
                }
                if (o.type == 'youtube') {
                    if(loop=='on'){

                        // console.info("YES");
                        seek_to_perc(0);
                        setTimeout(function(){

                            playMovie({
                                'call_from':'play_from_loop'
                            });
                        },1000);

                        suspend_state_2_for_loop = true;
                        setTimeout(function(){
                            suspend_state_2_for_loop = false;
                        },1500);
                        return false;
                    }
                    //console.log(video.getDuration())
                    if (video) {
                        if (video && video.pauseVideo) {
                            wasPlaying = false;
                            if(o.settings_video_end_reset_time=='on'){

                                // -- youtube already shows cover photo and replay button - maybe no need

                                //seek_to_perc(0);
                                //
                                //video.pauseVideo();
                            }
                        }
                    }
                }


                console.log("PASS EVENT TO GALLERY", cthis, o.gallery_object);
                if (o.gallery_object != null) {
                    if(typeof(o.gallery_object.get(0))!='undefined'){
                        o.gallery_object.get(0).videoEnd();
                    }

                }
                if (o.parent_player) {
                    if(o.parent_player.get(0)){

                        console.info(o.parent_player.get(0));
                        o.parent_player.get(0).api_ad_end();
                    }

                }

            }
            function handleResize(e, pargs) {
                // console.log('vplayer triggered resize',e,pargs);
                //return;



                var margs = {
                    'force_resize_gallery' : false
                    ,'call_from' : 'default'
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }





                videoWidth = cthis.width();
                videoHeight = cthis.height();




                if(margs.call_from=='recheck_sizes'){

                    // console.info('recheck_sizes player', Math.abs(last_videoHeight-videoHeight), Math.abs(last_videoWidth-videoWidth));
                    if(Math.abs(last_videoHeight-videoHeight)<4 && Math.abs(last_videoWidth-videoWidth)<4){


                        return false;
                    }

                }

                last_videoWidth = videoWidth;
                last_videoHeight = videoHeight;


                //console.info(cthis, o.responsive_ratio, isNaN(o.responsive_ratio), videoWidth, videoHeight);

                //console.info(cthis, o.is_ad);
                // console.info('responsive_ratio', o.responsive_ratio, auxh);
                if(isNaN(o.responsive_ratio)===false && o.responsive_ratio>0){
                    var auxh = o.responsive_ratio * videoWidth;


                    // console.warn(o.gallery_object, (cthis.hasClass('currItem') && o.is_ad!='on'), margs.force_resize_gallery)
                    if(o.gallery_object && ( (cthis.hasClass('currItem') && o.is_ad!='on') || margs.force_resize_gallery)  ){
                        //console.warn("RESIZE IT!",cthis, auxh , o.responsive_ratio, videoWidth, videoHeight);
                        if(o.gallery_object.get(0) && o.gallery_object.get(0).api_responsive_ratio_resize_h){
                            o.gallery_object.addClass('responsive-ratio-smooth');
                            o.gallery_object.get(0).api_responsive_ratio_resize_h(auxh, {
                                caller: cthis
                            });
                        }
                    }else{
                        //console.info('single player', o.responsive_ratio);

                        //console.warn(o);

                        if(o.is_ad!='on'){

                            cthis.height(o.responsive_ratio * cthis.width());
                        }
                    }
                }
                if (is_ios()) {
                    //ios has a nasty bug wbhen the parent is scaled - iframes scale too
                    if (undefined != _vgparent) {
                        var aux = (_vgparent.get(0).var_scale);
                        //console.log(cthis);
                        //cthis.children('iframe').width((1/aux) * videoWidth); cthis.children('iframe').height((1/aux) * videoHeight);

                    }
                }




                if(videoWidth<600){
                    cthis.addClass('under-600');

                    if(o.design_skin=='skin_aurora'){
                        o.design_scrubbarWidth = original_scrubwidth - 10;
                    }



                    if(videoWidth<421){
                        cthis.addClass('under-420');

                        if(o.design_skin=='skin_aurora'){
                            o.design_scrubbarWidth = original_scrubwidth - 10;
                        }
                    }else{
                        cthis.removeClass('under-420');
                        if(o.design_skin=='skin_aurora'){
                            o.design_scrubbarWidth = original_scrubwidth ;
                        }
                    }
                }else{
                    cthis.removeClass('under-600');
                    if(o.design_skin=='skin_aurora'){
                        o.design_scrubbarWidth = original_scrubwidth ;
                    }
                }



                if (is_fullscreen === 1) {
                    ww = $(window).width();
                    wh = window.innerHeight;
                    resizePlayer(ww, wh);


                    cthis.css('transform', '');
                    currScale = 1;
                } else {

                    //console.info(cthis, videoWidth,videoHeight);
                    resizePlayer(videoWidth, videoHeight);
                }

            }
            function handleKeyPress(e) {
                //-check if space is pressed for pause

                console.info(e, e.which, e.charCode);

                if (mouseover ){
                    if(e.charCode==27){
                        setTimeout(function(){
                            console.info("ESC KEY");
                            calculateDims();
                        },100);
                    }
                    if(e.charCode == 32) {
                        onPlayPause();

                        e.stopPropagation();
                        e.preventDefault();
                    }
                }
            }

            function vimeo_windowMessage(e) {
                //--- we receive iframe messages from vimeo here
                var data, method;
                //console.log(e);

                if (e.origin != 'https://player.vimeo.com' && e.origin != 'http://player.vimeo.com') {
                    return;
                }
                vimeo_url = '';
                vimeo_url = $(video).attr('src').split('?')[0];

                if(String(vimeo_url).indexOf('http')!=0){
                    vimeo_url = 'https:'+vimeo_url;
                }

                //console.info('vimeo_url',vimeo_url);
                try {
                    data = JSON.parse(e.data);
                    method = data.event || data.method;
                }
                catch (e) {
                    //fail silently... like a ninja!
                }


                //if(cthis.attr)
                if (data.player_id && dataSrc != data.player_id.substr(11)) {
                    return;
                }

                if (data != undefined) {
                    if (data.event == 'ready') {
                        //console.log(cthis);
                        if (autoplay == 'on') {
                            // -- we don't force play Movie because we already set autoplay to 1 on the iframe
                            //playMovie();
                        }
                        vimeo_data = {
                            "method": "addEventListener",
                            "value": "finish"
                        };

                        //console.info(vimeo_url);
                        if(video && video.contentWindow&&vimeo_url){

                            video.contentWindow.postMessage(JSON.stringify(vimeo_data), vimeo_url);
                        }
                        vimeo_data = {
                            "method": "addEventListener",
                            "value": "playProgress"
                        };

                        //console.info(vimeo_url);
                        if(video && video.contentWindow&&vimeo_url){

                            video.contentWindow.postMessage(JSON.stringify(vimeo_data), vimeo_url);
                        }

                        //if(video){
                        //
                        //    video.addEvent('pause', function(){
                        //        console.info('paUSE!!!');
                        //    });
                        //}


                        cthis.addClass('dzsvp-loaded');
                        if (o.gallery_object != null) {
                            if (typeof(o.gallery_object.get(0)) != 'undefined') {
                                o.gallery_object.get(0).api_video_ready();
                            }
                        }


                    }
                    if (data.event == 'playProgress') {
                        initial_played = true;


                    }
                    if (data.event == 'finish') {
                        handleVideoEnd();
                    }
                }
            }
            function onPlayPause() {

                //console.log(busy_playpause_mistake, 'onPlayPause', paused);
                if(busy_playpause_mistake){
                    return false;
                }


                busy_playpause_mistake=true;

                if(inter_clear_playpause_mistake){
                    clearTimeout(inter_clear_playpause_mistake);
                }
                inter_clear_playpause_mistake = setTimeout(function(){
                    busy_playpause_mistake = false;
                }, 300);
                //return;

                if (o.type == 'youtube' && video.getPlayerState && (video.getPlayerState() == 2||video.getPlayerState() == -1)) {
                    paused = true;
                }

//                    console.info('playpause', paused);
                if (paused) {
                    playMovie({
                        'call_from':'onPlayPause'
                    });
                } else {
                    pauseMovie({
                        'call_from':'onPlayPause'
                    });
                }


            }



            function onFullScreen(e) {
                // -- is_fullscreenscreen trigger event
                // console.info('click fullscreen');


                var aux = cthis.get(0);
                var _t = $(this);
                //totalWidth= $(window).width()
                //totalHeight= $(window).height()

                videoWidth = cthis.outerWidth();
                videoHeight = cthis.outerHeight();

                // console.info(e, is_fullscreen);
                //console.log(_t, _t.parent().parent().parent().parent().parent())

                // console.info(is_fullscreen, document.fullscreenEnabled, document.msFullscreenEnabled);
                // if (document.fullscreenEnabled) {
                //     is_fullscreen = 1;
                // } else if (document.mozFullscreenEnabled) {
                //     is_fullscreen = 1;
                // } else if (document.webkitFullscreenEnabled) {
                //     is_fullscreen = 1;
                // }else if (document.msFullscreenEnabled) {
                //     is_fullscreen = 1;
                // }

                // console.info(is_fullscreen);

                if(is_ios() && o.touch_play_inline=='off'){
                    playMovie({
                        'call_from':'onfullscreen ios'
                    });
                    return false;
                }

                if (is_fullscreen == 0) {

                    is_fullscreen = 1;

                    cthis.addClass('is_fullscreen');
                    cthis.addClass('is-fullscreen');

                    if(is_ios() && video.webkitEnterFullscreen){

                        video.webkitEnterFullscreen();
                        return false;
                    }

                    var elem = aux;
                    // console.info(elem, elem.requestFullScreen, elem.msRequestFullscreen);
                    if (elem.requestFullScreen) {
                        elem.requestFullScreen();
                    } else if (elem.mozRequestFullScreen) {
                        elem.mozRequestFullScreen();
                    } else if (elem.webkitRequestFullScreen) {
                        elem.webkitRequestFullScreen();
                    }else if (elem.msRequestFullscreen) {
                        elem.msRequestFullscreen();
                    } else {
                        if(o.gallery_object){
                            o.gallery_object.find('.the-logo').hide();
                            o.gallery_object.find('.gallery-buttons').hide();
                        }

                    }

                    //jQuery('body').css('overflow', 'hidden');
                    totalWidth= window.screen.width;
                    totalHeight= window.screen.height;
                    //console.log(totalWidth, totalHeight);

                    resizePlayer(totalWidth,totalHeight);
                    /*
                     cthis.css({
                     'position' : 'fixed',
                     'z-index' : 9999,
                     'left' : '0px',
                     'top' : '0px'
                     //,'width': totalWidth
                     //,'height': totalHeight
                     })
                     if(cthis.find('.audioImg').length>0){
                     cthis.find('.audioImg').css({
                     'width' : totalWidth
                     ,'height' : totalHeight
                     })
                     }
                     */

                    if(is_ie()){
                        setTimeout(handleResize, 300);
                    }



                    if(o.design_skin=='skin_reborn') {
                        cthis.find('.full-tooltip').eq(0).html('EXIT FULLSCREEN');
                    }




                    fullscreen_just_pressed = true;

                    setTimeout(function(){
                        fullscreen_just_pressed = false
                    },700)

                    // console.info(o.settings_disable_mouse_out, o.settings_disable_mouse_out_for_fullscreen, o.settings_mouse_out_delay_for_fullscreen)
                    if(o.settings_disable_mouse_out!='on' && o.settings_disable_mouse_out_for_fullscreen!='on') {

                        clearTimeout(inter_removeFsControls);
                        inter_removeFsControls = setTimeout(controls_mouse_is_out, o.settings_mouse_out_delay_for_fullscreen);
                    }

                    if (o.gallery_object) {
                        //dispatchEvent('goFullscreen');
                        //_t.parent().parent().parent().parent().parent().turnFullscreen();

                        if (o.gallery_object != null) {
                            //o.videoGalleryCon.turnFullscreen();
                        }
                    }

                } else {

                    //console.info('ceva');
                    is_fullscreen = 0;
                    cthis.addClass('remove_fullscreen');
                    cthis.removeClass('is_fullscreen');
                    cthis.removeClass('is-fullscreen');
                    var elem = document;
                    if (elem.cancelFullScreen) {
                        elem.cancelFullScreen();
                    } else if (elem.exitFullscreen) {
                        elem.exitFullscreen();
                    }else if (elem.mozCancelFullScreen) {
                        elem.mozCancelFullScreen();
                    } else if (elem.webkitCancelFullScreen) {
                        elem.webkitCancelFullScreen();
                    } else if (elem.msExitFullscreen) {
                        elem.msExitFullscreen();
                    }

                    if(o.design_skin=='skin_reborn') {
                        cthis.find('.full-tooltip').eq(0).html('FULLSCREEN');
                    }



                    //console.info(cthis, videoWidth,videoHeight);
                    resizePlayer(videoWidth, videoHeight);


                    if(is_ie() || is_firefox()){
                        setTimeout(handleResize, 300);
                    }
                    if(is_ie() ){
                        setTimeout(handleResize, 1000);
                    }


                }
            }

            function resizePlayer(warg, harg) {
                //console.log(cthis);


                calculateDims(warg, harg);

                //console.log(warg);

//                console.log(_scrubBg, warg, o.design_scrubbarWidth, (warg + o.design_scrubbarWidth));

                if(the_player_id=='debug-video'){

                    //console.info(cthis, the_player_id, warg, o.design_scrubbarWidth);
                }

                //console.info(cthis, warg, o.design_scrubbarWidth);
                _scrubBg.css({
                    'width' : (warg + o.design_scrubbarWidth)
                });

                if(o.design_skin=='skin_aurora'){
                    _scrubBg.css({
                        'width' : '100%'
                    });
                }

                scrubbg_width = _scrubBg.width();


                infoPosX = parseInt(controlsDiv.find('.infoText').css('left'));
                infoPosY = parseInt(controlsDiv.find('.infoText').css('top'));
            }


            function calculateDims(warg, harg){

                // console.info('vplayer calculateDims()', warg, harg, o.design_skin);
                if(o.design_skin!='skin_bigplay'){
                    /*
                     controlsDiv.find('.background').css({
                     'width': warg + parseInt(o.design_background_offsetw)
                     })
                     */
                }

                if(o.design_skin=='skin_white'){
                    cthis.find('.controls .background').css({
                        'width' : (warg - 95)
                    })
                }

                /*
                 controlsDiv.css({
                 'width': warg
                 });
                 */
            }

            function check_if_ad_must_be_played(){

                console.info('check_if_ad_must_be_played()', o.gallery_object, cthis.attr('data-adsource'), cthis.data('adplayed'));
                if(cthis.attr('data-adsource') && cthis.data('adplayed')!='on'){



                    if(is_ios()){
                        setTimeout(function(){
                            console.info("PAUSE VIDEO FOR AD")
                            pauseMovie({
                                'call_from':'check_if_ad_must_be_played'
                            });

                            if(o.type=='youtube'){
                                video.stopVideo();
                            }

                            seek_to_perc(0);
                            // if(video && video.webkitExitFullScreen){
                            //
                            //     video.webkitExitFullScreen();
                            //     document.webkitExitFullscreen();
                            // }
                        },1000);
                    }


                    if(o.gallery_object && o.gallery_object.get(0) && o.gallery_object.get(0).api_setup_ad){

                        o.gallery_object.get(0).api_setup_ad(cthis);

                        cthis.data('adplayed','on');

                        has_ad_to_play = false;

                        return false;
                    }

                }

            }

            function playMovie(pargs) {
                console.info('playMovie()',pargs);
                //console.info(o.type);


                var margs = {
                    'call_from': 'default'
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                if(margs.call_from=='play_only_on_desktop'){
                    if(is_mobile()){
                        return false;
                    }
                }



                cthis.find('.cover-image').fadeOut('fast');



                // console.warn('playMovie()', cthis, o.type,paused, initial_played, margs);

                if(o.settings_disableVideoArray!='on'){
                    for(var i=0;i< dzsvp_players_arr.length;i++){
//                        console.info(dzsvp_players_arr);
                        if(dzsvp_players_arr[i].get(0).externalPauseMovie!=undefined){
                            dzsvp_players_arr[i].get(0).externalPauseMovie({
                                'call_from':'external_pauseMovie()'
                            });
                        }
                    }
                }

                // check_if_ad_must_be_played();




                if (o.type == 'vimeo') {
                    vimeo_data = {
                        "method": "play"
                    };
                    //console.info('ceva',vimeo_url);

                    if(video&&video.contentWindow&&vimeo_url){

                        video.contentWindow.postMessage(JSON.stringify(vimeo_data), vimeo_url);
                    }


                }
                //return;



                if(o.try_to_pause_zoomsounds_players=='on'){
                    //console.info(dzsap_list);
                    for (i = 0; i < dzsap_list.length; i++) {

                        //                    console.info(!is_ie8(), dzsap_list[i].get(0), typeof dzsap_list[i].get(0)!="undefined", typeof dzsap_list[i].get(0).api_pause_media!="undefined")
                        if (!is_ie8() && typeof dzsap_list[i].get(0) != "undefined" && typeof dzsap_list[i].get(0).api_pause_media != "undefined" && dzsap_list[i].get(0) != cthis.get(0)) {

                            //console.info('try to pause', dzsap_list[i].get(0),dzsap_list[i].data('type_audio_stop_buffer_on_unfocus'))
                            if (dzsap_list[i].data('type_audio_stop_buffer_on_unfocus') && dzsap_list[i].data('type_audio_stop_buffer_on_unfocus') == 'on') {
                                dzsap_list[i].get(0).api_destroy_for_rebuffer();
                            } else {

                                dzsap_list[i].get(0).api_pause_media({
                                    'audioapi_setlasttime': false
                                });
                            }
                            window.dzsap_player_interrupted_by_dzsvg = dzsap_list[i].get(0);
                        }
                    }
                }

                playMovie_visual();
//                console.info(cthis, 'playmovie', video, o.type);;

                if (o.type == 'normal' || o.type == 'audio'|| o.type == 'dash'){
                    video.play();
                }
                if (o.type == 'youtube'){



                    //yt_qualCurr = video.getPlaybackQuality();
                    //
                    //console.info(yt_qualCurr);


                    if(paused==false){
                        return false;
                    }

                    if(video.playVideo!=undefined && video.getPlayerState && video.getPlayerState!=1){
                        video.playVideo();
                    }
                }



                wasPlaying = true;
                paused=false;
                initial_played=true;
                //console.log(wasPlaying);

                cthis.trigger('videoPlay');


                check_one_sec();


                //console.info(o.action_video_view);
                if(o.action_video_view){
                    if(view_sent == false){
                        o.action_video_view(cthis,video_title);
                        view_sent = true;
                    }
                }


                if(o.gallery_object && o.gallery_object.get(0) && o.gallery_object.get(0).api_played_video){
                    o.gallery_object.get(0).api_played_video();
                }


            }

            function playMovie_visual(){

                //console.warn("playMovie_visual()");


                // playcontrols.children().eq(0).fadeOut('fast');
                // playcontrols.children().eq(2).fadeIn('fast');
                //
                // if(cthis.hasClass('skin_aurora')==false && cthis.hasClass('skin_bigplay')==false && cthis.hasClass('skin_pro')==false){
                //
                //     playcontrols.children().eq(1).fadeOut('fast');
                //     playcontrols.children().eq(3).fadeIn('fast');
                // }


                cthis.addClass('first-played');



                if (o.settings_disableControls != 'on') {
                }

                if(o.google_analytics_send_play_event=='on' && window._gaq && google_analytics_sent_play_event==false){
                    //if(window.console){ console.info( 'sent event'); }
                    window._gaq.push(['_trackEvent', 'Video Gallery Play', 'Play', 'video gallery play - '+cthis.attr('data-source')]);
                    google_analytics_sent_play_event = true;
                }


                if(o.settings_disable_mouse_out!='on'){



                    if(is_android()){
                        clearTimeout(inter_removeFsControls);
                        inter_removeFsControls = setTimeout(controls_mouse_is_out, o.settings_mouse_out_delay_for_fullscreen);
                    }

                }


                cthis.addClass('is-playing');
            }

            function pauseMovie_visual(){

                //
                // if(cthis.hasClass('skin_aurora')==false && cthis.hasClass('skin_bigplay')==false && cthis.hasClass('skin_pro')==false){
                //
                //     playcontrols.children().eq(1).fadeIn('fast');
                //     playcontrols.children().eq(3).fadeOut('fast');
                // }
                //
                // playcontrols.children().eq(2).fadeOut('fast');
                // playcontrols.children().eq(0).fadeIn('fast');






            }

            function pauseMovie(pargs) {

                //console.info(o.type, paused);
                //if(o.type!='vimeo' && paused==true){
                //    return;
                //}

                //console.info('initial_played', initial_played);

                var margs = {
                    'call_from': 'default'
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }


                if(o.try_to_pause_zoomsounds_players=='on'){
                    if(window.dzsap_player_interrupted_by_dzsvg){

                        window.dzsap_player_interrupted_by_dzsvg.api_play_media({
                            'audioapi_setlasttime': false
                        });
                        window.dzsap_player_interrupted_by_dzsvg = null;
                    }
                }

                // console.warn('pauseMovie()', cthis, o.type,paused, initial_played, margs);

                if(initial_played==false){
                    return false;
                }
                suspend_state_2_for_loop = true;
                setTimeout(function(){
                    suspend_state_2_for_loop = false;
                },1500);

                //console.info(initial_played);

                pauseMovie_visual();

                if (o.type == 'normal' || o.type == 'audio' || o.type=='dash') {
                    if(video!=undefined){
                        video.pause();
                    }else{
                        if(window.console != undefined){ console.info('warning: video undefined') };
                    }
                }
                if (o.type == 'youtube') {
                    //return false;

                    //console.info('pause YOUTUBE',video ,video.pauseVideo);

                    if (video && video.pauseVideo) {

                        try {
                            video.pauseVideo();
                        } catch (err) {
                            if (window.console) {
                                console.log(err);
                            }
                        }
//                        console.info('pauseMovie',video, video.pauseVideo, paused);
                    }
                }

                if (o.type == 'vimeo') {
                    //if (/Opera/.test(navigator.userAgent)) {
                    //    return;
                    //}
                    vimeo_data = {
                        "method": "pause"
                    };

                    if(vimeo_url) {
                        try {
                            video.contentWindow.postMessage(JSON.stringify(vimeo_data), vimeo_url);

                            //console.info(vimeo_data, vimeo_url);
                            wasPlaying = false;
                            paused=true;
                        } catch (err) {
                            if (window.console) {
                                console.log(err);
                            }
                        }
                    }
                    return;
                }


                wasPlaying = false;
                paused=true;

                mouse_is_over();

                cthis.removeClass('is-playing');
            }

            function reinit_cover_image(){

                cthis.find('.cover-image').fadeIn('fast');
            }

            //console.log(cthis);
            try {
                cthis.get(0).checkYoutubeState = function() {
                    if (o.type == 'youtube' && video.getPlayerState != undefined) {
                        //console.log("ceva", cthis, video.getPlayerState());
                        if (video.getPlayerState && video.getPlayerState() == 0) {
                            handleVideoEnd();
                        }
                    }
                }

            } catch (err) {
                if (window.console)
                    console.log(err);
            }
            /*
             window.checkYoutubeState=function(){
             // - we check if video youtube has ended so we can go to the next one

             }
             */

        }); // end each

    }


    window.dzsvp_init = function(selector, settings) {
        //console.info($(selector), settings);


        if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
            var element_count = 0;
            for (var e in settings) { element_count++; }
            if(element_count==1){
                settings = undefined;
            }

            $(selector).each(function(){
                var _t = $(this);
                _t.vPlayer(settings)
            });
        }else{
            $(selector).vPlayer(settings);
        }


    };


})(jQuery);




if(typeof window.onYouTubePlayerReady=='function'){
    window.backup_onYouTubePlayerReady = window.onYouTubePlayerReady;
}
window.onYouTubePlayerReady = function onYouTubePlayerReady(playerId) {
    //alert('ytready')
    //alert(playerId)




//    console.info('ytready', playerId);

    var aux_objectid = playerId;
    var aux_videoid = playerId.substr(8);

//        console.info(youtubeid_array);

//        console.info(auxerid, document.getElementById(aux_objectid), aux_videoid);
    for(var i=0;i<youtubeid_array.length;i++){
        if(youtubeid_array[i].id == aux_videoid){
            if(youtubeid_array[i].nrtimes>0){
                aux_objectid+='_clone'+youtubeid_array[i].nrtimes;
            }
        }
    }

//        console.info(aux_objectid, document.getElementById(aux_objectid))


    ytplayer = document.getElementById(aux_objectid);


    var _t = jQuery(ytplayer);
    if(_t.hasClass('treated')){
        return;
    }
    _t.addClass('treated');

    //console.log(ytplayer);
    ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
    var aux2 = _t.attr('data-suggestedquality');
    //console.log(aux2);
    ytplayer.loadVideoById(aux_videoid, 0, aux2);
    ytplayer.pauseVideo();




};


window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();


jQuery(document).ready(function($){
//    --- mega conflict with mediaelement.js, well workaround by treating untreated flash items

    var inter_check_treat = 0;

    clearTimeout(inter_check_treat);
    inter_check_treat = setTimeout(workaround_treatuntretreadItems, 2000);

    function workaround_treatuntretreadItems(){


        jQuery('.js-api-player:not(.treated)').each(function(){
            var _t = jQuery(this);
            var __t = _t.get(0);
//            console.info(_t, __t);

            var playerId = _t.attr('id');

            var aux = playerId.substr(8);
            var aux2 = _t.attr('data-suggestedquality');
            //console.log(aux2);

            if(typeof __t.loadVideoById !='undefined'){
                __t.loadVideoById(aux, 0, aux2);
                __t.pauseVideo();
            }else{

                inter_check_treat = setTimeout(workaround_treatuntretreadItems, 2000);
            }


        })

    }

    if(typeof window.onYouTubePlayerReady=='function' && typeof backup_onYouTubePlayerReady == 'undefined'){
        window.backup_onYouTubePlayerReady = window.onYouTubePlayerReady;
    }

    window.onYouTubePlayerReady = function onYouTubePlayerReady(playerId) {
        //alert('ytready')
        //alert(playerId)


        //console.info('ytready', playerId);

        var aux_objectid = playerId;
        var aux_videoid = playerId.substr(8);

//        console.info(youtubeid_array);

//        console.info(auxerid, document.getElementById(aux_objectid), aux_videoid);
        for(var i=0;i<youtubeid_array.length;i++){
            if(youtubeid_array[i].id == aux_videoid){
                if(youtubeid_array[i].nrtimes>0){
                    aux_objectid+='_clone'+youtubeid_array[i].nrtimes;
                }
            }
        }

//        console.info(aux_objectid, document.getElementById(aux_objectid))


        ytplayer = document.getElementById(aux_objectid);


        var _t = jQuery(ytplayer);

        if(_t.hasClass('treated')){
            return;
        }
        _t.addClass('treated');

        //console.log(ytplayer);
        ytplayer.addEventListener("onStateChange", "onytplayerStateChange");
        var aux2 = _t.attr('data-suggestedquality');
//        console.log(aux2, ytplayer);
        ytplayer.loadVideoById(aux_videoid, 0, aux2);
        ytplayer.pauseVideo();

        if(typeof backup_onYouTubePlayerReady=='function'){
            backup_onYouTubePlayerReady(playerId);
        }

    };


    $('.videogallery--navigation-outer').each(function(){
        var _t = $(this);
        var _tar = $(_t.attr('data-vgtarget')).eq(0);
        var _clip =_t.find('.videogallery--navigation-outer--clip').eq(0);
        var _clipmover =_t.find('.videogallery--navigation-outer--clipmover').eq(0);

        var currPage = 0;
        var _block_active = _t.find('.videogallery--navigation-outer--bigblock.active').eq(0);
//        console.info(_tar);

        var _navOuterBullets = _t.find('.navigation-outer--bullet');
        var _navOuterBlocks = _t.find('.videogallery--navigation-outer--block');

        setTimeout(function(){
            _t.addClass('active');
            _block_active = _t.find('.videogallery--navigation-outer--bigblock.active').eq(0);
            _clip.height(_block_active.height());
        },500)

        _navOuterBlocks.bind('click', function(){
            var _t2 = $(this);
            var ind = _navOuterBlocks.index(_t2);


//            console.info(ind);

            if(_tar.get(0) && _tar.get(0).api_gotoItem){
                if(_tar.get(0).api_gotoItem(ind)){
                }
            }
        });

        _navOuterBullets.bind('click',function(){
            var _t2 = $(this);
            var ind = _navOuterBullets.index(_t2);

            gotoPage(ind);

        })

        function gotoPage(arg){
            var auxl = -(Number(arg)*100) + '%';

            _navOuterBullets.removeClass('active');
            _navOuterBullets.eq(arg).addClass('active');

            _t.find('.videogallery--navigation-outer--bigblock.active').removeClass('active');
            _t.find('.videogallery--navigation-outer--bigblock').eq(arg).addClass('active');


            _clip.height(_t.find('.videogallery--navigation-outer--bigblock').eq(arg).height());

            _clipmover.css('left',auxl);

        }


    })
});




jQuery(document).ready(function($){
    //console.info($('.zoomvideogallery.auto-init'));
    dzsvp_init('.vplayer-tobe.auto-init', {init_each: true});
    dzsvg_init('.videogallery.auto-init', {init_each: true});

    //if (typeof window.onYouTubeIframeAPIReady!='undefined' && typeof backup_yt_iframe_ready=='undefined'){
    //    backup_yt_iframe_ready = window.onYouTubeIframeAPIReady;
    //}
    //
    //window.onYouTubeIframeAPIReady = function() {
    //
    //    dzszvp_yt_iframe_ready();
    //    if(backup_yt_iframe_ready){
    //        backup_yt_iframe_ready();
    //    }
    //}


    $(document).undelegate('.dzsas-second-con .read-more-label', 'click');
    $(document).delegate('.dzsas-second-con .read-more-label', 'click',function(e){
        // console.log(e);

        var _t = $(this);
        var _con = _t.parent();

        var _content = _con.children('.read-more-content').eq(0);

        if(_con.hasClass('active')){

            _content.animate({
                'height' : 0
            },{
                queue:false
                ,duration:300
                ,complete: function(e){
                    //console.info(this);

                }
            })

            _con.removeClass('active');
        }else{
            _content.css('height', 'auto');

            var auxh = (_content.outerHeight());

            _content.css('height', 0);
            _content.animate({
                'height' : auxh
            },{
                queue:false
                ,duration:300
                ,complete: function(e){
                    //console.info(this);

                    $(this).css('height', 'auto');
                }
            })

            _con.addClass('active');

        }


        return false;
    })
});


function onytplayerStateChange(newState) {
//    console.log(jQuery(ytplayer).parent().get(0), "Player's new state: " + newState, ytplayer.getAvailableQualityLevels());
    if(typeof(jQuery(ytplayer).parent().get(0))!='undefined'){
        try {
            jQuery(ytplayer).parent().get(0).checkYoutubeState();
        } catch (err) {
            if (window.console){
                console.log(err);
            }
        }
    }

    //console.log(newState);
    //window.checkYoutubeState();
    //- we send the on end event to the gallery if it has one
    newState = parseInt(newState, 10);
    if (newState == 0) {
        //console.log(jQuery(ytplayer))
        //jQuery(ytplayer).parent().get(0).handleVideoEnd();
    }

    window.onYouTubeIframeAPIReady = function() {
        dzsvp_yt_iframe_ready();
    }
}

function dzsvp_yt_iframe_ready(){

    _global_youtubeIframeAPIReady = true;
}

window.onYouTubeIframeAPIReady = function() {
    dzsvp_yt_iframe_ready();
}

function onYouTubeIframeAPIReady() {
}


function can_translate() {
    if (is_chrome() || is_safari()) {
        return true;
    }
    if (is_firefox() && version_firefox() > 10) {
        return true;
    }
    return false;
}

function can_history_api() {
    return !!(window.history && history.pushState);
}
function is_ios() {
    //return true;
    return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)
    );
}

function is_android() {
    //return true;


    var ua = navigator.userAgent.toLowerCase();
    // console.info(ua);
    return (ua.indexOf("android") > -1);
}

function is_ie() {
    if (navigator.appVersion.indexOf("MSIE") != -1) {
        return true;    }; return false;
}
;
function is_firefox() {
    if (navigator.userAgent.indexOf("Firefox") != -1) {        return true;    };
    return false;
}
;
function is_opera() {
    if (navigator.userAgent.indexOf("Opera") != -1) {        return true;    };
    return false;
}
;
function is_chrome() {
    return navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
}
;
function is_safari() {
    return navigator.userAgent.toLowerCase().indexOf('safari') > -1;
}
;
function version_ie() {
    return parseFloat(navigator.appVersion.split("MSIE")[1]);
}
;
function version_firefox() {
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var aversion = new Number(RegExp.$1); return(aversion);
    }
    ;
}
;
function version_opera() {
    if (/Opera[\/\s](\d+\.\d+)/.test(navigator.userAgent)) {
        var aversion = new Number(RegExp.$1); return(aversion);
    }
    ;
}
;
function is_ie8() {
    if (is_ie() && version_ie() < 9) {  return true;  };
    return false;
}
function is_ie9() {
    if (is_ie() && version_ie() == 9) {
        return true;
    }
    return false;
}

function get_query_arg(purl, key){
    if(purl.indexOf(key+'=')>-1){
        //faconsole.log('testtt');
        var regexS = "[?&]"+key + "=.+";
        var regex = new RegExp(regexS);
        var regtest = regex.exec(purl);
        //console.info(regtest);

        if(regtest != null){
            var splitterS = regtest[0];
            if(splitterS.indexOf('&')>-1){
                var aux = splitterS.split('&');
                splitterS = aux[1];
            }
            //console.log(splitterS);
            var splitter = splitterS.split('=');
            //console.log(splitter[1]);
            //var tempNr = ;

            return splitter[1];

        }
        //$('.zoombox').eq
    }
}

function add_query_arg(purl, key,value){
    key = encodeURIComponent(key); value = encodeURIComponent(value);

    var s = purl;
    var pair = key+"="+value;

    var r = new RegExp("(&|\\?)"+key+"=[^\&]*");

    s = s.replace(r,"$1"+pair);
    //console.log(s, pair);
    if(s.indexOf(key + '=')>-1){


    }else{
        if(s.indexOf('?')>-1){
            s+='&'+pair;
        }else{
            s+='?'+pair;
        }
    }
    //if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;};


    //if value NaN we remove this field from the url
    if(value=='NaN'){
        var regex_attr = new RegExp('[\?|\&]'+key+'='+value);
        s=s.replace(regex_attr, '');
    }

    return s;
}

function can_play_mp3(){
    var a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}
function can_play_mp4(){
    var a = document.createElement('video');
    return !!(a.canPlayType && a.canPlayType('video/mp4;').replace(/no/, ''));
}


//time, begin, change( f-b ), duration
function global_ease_in(t, b, c, d) {

    return -c *(t/=d)*(t-2) + b;

};
function is_mobile() {
    //return true;
    return is_ios() || is_android();
}

function is_touch_device() {
    //return true;
    return !!('ontouchstart' in window);
}


jQuery.fn.urlParam = function (arg, name) {
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(arg);
    return (results !== null) ? results[1] : 0;
}


window.dzsvg_wp_send_view = function(argcthis, argtitle){
    //console.info(argcthis, argtitle);



    var data = {
        video_title: argtitle
        ,dzsvg_curr_user: window.dzsvg_curr_user
    };

    var theajaxurl = 'index.php?action=ajax_dzsvg_submit_view';

    if(window.dzsvg_site_url){

        theajaxurl = dzsvg_settings.dzsvg_site_url + theajaxurl;
    }


    jQuery.ajax({
        type: "POST",
        url: theajaxurl,
        data: data,
        success: function(response) {
            if(typeof window.console != "undefined" ){ console.log('Ajax - submit view - ' + response); }



        },
        error:function(arg){
            if(typeof window.console != "undefined" ){ console.warn('Got this from the server: ' + arg); };
        }
    });


}
window.dzsvg_wp_send_contor_10_secs = function(argcthis, argtitle){

    var data = {
        video_title: argtitle
        ,dzsvg_curr_user: window.dzsvg_curr_user
    };
    var theajaxurl = 'index.php?action=ajax_dzsvg_submit_contor_10_secs';

    if(window.dzsvg_site_url){

        theajaxurl = dzsvg_settings.dzsvg_site_url + theajaxurl;
    }



    jQuery.ajax({
        type: "POST",
        url: theajaxurl,
        data: data,
        success: function(response) {
            if(typeof window.console != "undefined" ){ console.log('Ajax - submit view - ' + response); }



        },
        error:function(arg){
            if(typeof window.console != "undefined" ){ console.warn('Got this from the server: ' + arg); };
        }
    });
}


window.dzsvg_open_social_link = function(arg){
    var leftPosition, topPosition;
    var w = 500, h= 500;

    arg = arg.replace("{{replacewithcurrurl}}",encodeURIComponent(window.location.href));
    //Allow for borders.
    leftPosition = (window.screen.width / 2) - ((w / 2) + 10);
    //Allow for title and status bars.
    topPosition = (window.screen.height / 2) - ((h / 2) + 50);
    var windowFeatures = "status=no,height=" + h + ",width=" + w + ",resizable=yes,left=" + leftPosition + ",top=" + topPosition + ",screenX=" + leftPosition + ",screenY=" + topPosition + ",toolbar=no,menubar=no,scrollbars=no,location=no,directories=no";
    window.open(arg,"sharer", windowFeatures);
}


function get_base_url_arr(){



    var scripts = document.getElementsByTagName("script");


    for(var i23 in scripts){
        if(scripts[i23] && scripts[i23].src && String(scripts[i23].src).indexOf('vplayer.js')>-1){

            break;
        }
    }
    var baseUrl_arr = String(scripts[i23].src).split('/');

    return baseUrl_arr;
}
