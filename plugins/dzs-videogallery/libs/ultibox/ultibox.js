// ==DZS ZoomTabs and Accordions
// @version 1.23
// @this is not free software
// == DZS ZoomTabs and Accordions == copyright == http://digitalzoomstudio.net


"use strict";

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
if(window.jQuery==undefined){
    alert("dzstabs.js -> jQuery is not defined or improperly declared ( must be included at the start of the head tag ), you need jQuery for this plugin");
}
jQuery.fn.outerHTML = function(e) {
    return e
        ? this.before(e).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

window.dzstaa_self_options = {};



window.dzsulb_inited = false;

(function($) {


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


    var _maincon = null
        ,_boxMainsCon = null
        ,_boxMain = null
        ,_boxMainMediaCon = null
        ,_boxMainMedia = null
        ,_boxMainRealMedia = null // -- temp, the real media
        ,_boxMainUnder = null
        ;


    var media_ratio_w_h = 0
        ,media_w = 0
        ,media_h = 0
        ,media_finalw = 0
        ,media_finalh = 0
        ,media_has_under_description = false

        ,opts_max_width = 0

        ,ulb_w = 0
        ,ulb_h = 0

        ,bmc_w = 0 // -- box-mains-con width
        ,bmc_h = 0 // -- box-mains-con height

        ,scaling = 'proportional' // -- proportional or fill

        ,ww = 0
        ,wh = 0

        ,$zoombox_items_arr = []
        ,theurl = window.location.href
        ;

    var padding_left = 0
        ,padding_right = 0
        ,padding_top = 0
        ,padding_bottom = 0
        ,padding_hor = 60
        ,padding_ver = 60
    ;


    var ultibox_options = {

        'transition':'slideup'
        ,'transition_out':'same-as-in'
        ,'skin':'skin-default'
        ,settings_deeplinking: "on"
        ,extra_classes: ""


    };


    var _body = $('body').eq(0);
    var _html = $('html').eq(0);

    window.dzsulb_main_init = dzsulb_main_init;
    function dzsulb_main_init(){


        if(_maincon){
            return false;
        }

        _body = $('body').eq(0);
        _html = $('html').eq(0);

        if(window.ultibox_options_init){
            ultibox_options = $.extend(ultibox_options, window.ultibox_options_init);
        }



        var aux = '<div class="dzsulb-main-con '+ultibox_options.skin+' '+ultibox_options.extra_classes+'">';

        aux+='<div class="overlay-background"></div>';

        aux+='<div class="dzsulb-preloader preloader-fountain" > <div id="fountainG_1" class="fountainG"></div> <div id="fountainG_2" class="fountainG"></div> <div id="fountainG_3" class="fountainG"></div> <div id="fountainG_4" class="fountainG"></div> </div>';

        aux+='<div class="box-mains-con">';

        aux+='</div><!-- end .box-mains-con-->';

        aux+='</div>';


        _body.append(aux);

        console.info(_body, $('body'));

        _maincon = _body.children('.dzsulb-main-con').eq(0);
        _boxMainsCon = _maincon.find('.box-mains-con').eq(0);

        if(ultibox_options.transition=='default'){
            ultibox_options.transition = 'fade';
        }
        if(ultibox_options.transition_out=='same-as-in'){
            ultibox_options.transition_out = ultibox_options.transition;
        }


        _maincon.addClass('transition-'+ultibox_options.transition);



        _maincon.on('click', '>.overlay-background, .close-btn-con',handle_mouse);



        check_deeplink();




        window.open_ultibox = open_ultibox;
        window.close_ultibox = close_ultibox;






        $(window).on('resize', handle_resize)
        handle_resize();

    }

    function check_deeplink(){
        if(theurl.indexOf('ultibox=')>-1){
//                console.log('testtt', get_query_arg(theurl, 'zoombox'));
            if(get_query_arg(theurl, 'ultibox')){
                var tempNr = parseInt(get_query_arg(theurl, 'ultibox'),10);
                //console.info(String(tempNr), String(tempNr)=='NaN');
                if(String(tempNr)!='NaN'){
                    if(tempNr>-1){
                        open_ultibox($('.ultibox-item,.ultibox-item-delegated').eq(tempNr), null, {
                            from_deeplink: tempNr
                        });
                    }
                }else{

                    var auxobj = $('#'+get_query_arg(theurl, 'zoombox'));


                    open_ultibox(auxobj, null, {
                        from_deeplink: '#'+get_query_arg(theurl, 'zoombox')
                    });
                }
            }
            //$('.zoombox').eq
        }
    }

    function handle_mouse(e){


        var _t = $(this);

        if(e.type=='click'){
            console.log(_t);


            if(_t.hasClass('overlay-background')){

                close_ultibox();

            }
            if(_t.hasClass('close-btn-con')){

                close_ultibox();

            }


            // -- loaded-item next, .zoomed next
        }

    }
    function handle_mouse_item(e){


        var _t = $(this);

        if(e.type=='click'){
            console.log(_t);


            if(_t.hasClass('')){

            }

            open_ultibox(_t, null);


            // -- loaded-item next, .zoomed next
        }

    }

    function setup_media(margs){
        // -- appends the item to the DOM but does not necesarrly append the loaded event , that is appended only when the media is ( allegedly )

        console.info('setup_media()', margs);



            if(margs.suggested_width){
                if(isNaN(Number(margs.suggested_width))==false){

                    media_w = Number(margs.suggested_width);
                }else{
                    media_w = margs.suggested_width;
                }
            }
            if(margs.suggested_height){
                if(isNaN(Number(margs.suggested_height))==false){

                    media_h = Number(margs.suggested_height);
                }else{
                    media_h = margs.suggested_height;
                }
            }



        if(isNaN(Number(margs.suggested_height))==false) {
            media_ratio_w_h = media_w / media_h;
        }else{
            media_ratio_w_h = 1;
        }
        scaling = margs.scaling;


        var aux = '';

        aux+='<div class="box-main">';


        aux+='<div class="box-main-media-con transition-target">';



        aux+='<div class="close-btn-con"> <svg enable-background="new 0 0 40 40" id="" version="1.1" viewBox="0 0 40 40" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M28.1,26.8c0.4,0.4,0.4,1,0,1.4c-0.2,0.2-0.5,0.3-0.7,0.3s-0.5-0.1-0.7-0.3l-6.8-6.8l-6.8,6.8c-0.2,0.2-0.5,0.3-0.7,0.3   s-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l6.8-6.8l-6.8-6.8c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l6.8,6.8l6.8-6.8   c0.4-0.4,1-0.4,1.4,0c0.4,0.4,0.4,1,0,1.4L21.3,20L28.1,26.8z"/></g><g><path d="M19.9,40c-11,0-20-9-20-20s9-20,20-20c4.5,0,8.7,1.5,12.3,4.2c0.4,0.3,0.5,1,0.2,1.4c-0.3,0.4-1,0.5-1.4,0.2   c-3.2-2.5-7-3.8-11-3.8c-9.9,0-18,8.1-18,18s8.1,18,18,18s18-8.1,18-18c0-3.2-0.9-6.4-2.5-9.2c-0.3-0.5-0.1-1.1,0.3-1.4   c0.5-0.3,1.1-0.1,1.4,0.3c1.8,3.1,2.8,6.6,2.8,10.2C39.9,31,30.9,40,19.9,40z"/></g></svg></div>';

        aux+='<div class="box-main-media"></div><div class="box-main-under"></div></div></div>';

        _boxMainsCon.append(aux);


        _boxMain = _maincon.find('.box-main').eq(0);
        _boxMainMediaCon = _maincon.find('.box-main-media-con').eq(0);
        _boxMainMedia = _maincon.find('.box-main-media').eq(0);
        _boxMainUnder = _maincon.find('.box-main-under').eq(0);



        if(margs.type=='image'){
            _maincon.addClass('loaded-item');
            _boxMainMedia.append('<div class="imagediv real-media" style="background-image: url('+margs.source+') "></div>');

        }
        if(margs.type=='iframe'){
            _boxMainMedia.append('<div class=" real-media" style=""><iframe src="'+margs.source+'" style="" width="100%" height="100%"></iframe></div>');

            setTimeout(function(){
                _maincon.addClass('loaded-item');

            },1500);

            // -- we leave 1500 ms time to load any iframe

        }
        _boxMainRealMedia = _boxMainMedia.find('.real-media');



        if(margs.under_description){
            _boxMainUnder.append(margs.under_description);
            _boxMainMedia.width('100%');
            media_has_under_description = true;
            _boxMain.addClass('with-description');
        }else{

            media_has_under_description = false;

        }



        if(margs.max_width){
            opts_max_width = margs.max_width;
        }else{
            opts_max_width = 0;
        }

        handle_resize(null,{
            call_calculate_dims_light: false
        })
        calculate_dims_light({
            'call_from':"setup_media"
            ,'calculate_main_con':true

        })


    }

    function open_ultibox(_arg, pargs){



        var margs = {

            type: 'detect'
            ,source: ''
            ,max_width: 'default' // -- this is useful for under description feed and is mandatory actually
            ,under_description: '' // -- this is the under description
            ,right_description: '' // -- this is the under description
            ,scaling: 'proportional' // -- this is the under description
            ,suggested_width: ''
            ,suggested_height: ''
            ,item: null // -- we can pass the items from here too

        };

        if(pargs){
            margs = $.extend(margs,pargs);
        }


        if(_arg){
            if(_arg.attr('data-source')){
                margs.source = _arg.attr('data-source');
            }
            if(_arg.attr('data-type')){
                margs.type = _arg.attr('data-type');
            }
            if(_arg.attr('data-scaling')){
                margs.scaling = _arg.attr('data-scaling');
            }

            if(_arg.next().hasClass('feed-ultibox-desc') || _arg.children().hasClass('feed-ultibox-desc')){

                var _c = null;
                if(_arg.next().hasClass('feed-ultibox-desc')){
                    _c = _arg.next();
                }
                if(_arg.children('.feed-ultibox-desc').length){
                    _c = _arg.children('.feed-ultibox-desc').eq(0);
                }

                margs.under_description = _c.html();
            }


            if(_arg.attr('data-suggested-width')){
                margs.suggested_width = (_arg.attr('data-suggested-width'));
            }
            if(_arg.attr('data-suggested-height')){
                margs.suggested_height = (_arg.attr('data-suggested-height'));
            }

            if(typeof _arg !='string'){
                margs.item = _arg;
            }
        }


        if(margs.type=='detect'){
            margs.type='image';
        }


        console.info('open_ultibox()', margs);

        if(margs.under_description){
            if(margs.max_width=='default'){
                margs.max_width = 400;
            }
        }


        _maincon.removeClass('disabled');
        _html.addClass('ultibox-opened');



        setTimeout(function(){

            _maincon.addClass('loading-item');



            if(margs.type=='image'){


                console.info('is_image', margs);

                var newImg = new Image;
                newImg.onload = function() {

                    // console.info('loaded image - ',this);




                    media_w = this.naturalWidth;
                    media_h = this.naturalHeight;


                    setup_media(margs);


                };
                newImg.src = margs.source;
            }

            if(margs.type=='iframe'){

                console.info('media_w, media_h - ',media_w, media_h)

                media_w = 800;
                media_h = 600;

                setup_media(margs);
            }
        },100);




        if(ultibox_options.settings_deeplinking=='on' && can_history_api()==true && margs.forcenodeeplink!='on'){
            //console.log(otherargs.item);

            $zoombox_items_arr = $('.ultibox-item,.ultibox-item-delegated')
            if(margs.item && margs.item.attr('data-zoombox-sort')){
                //$zoombox_gallery_arr = getSorted('.zoombox,.zoombox-delegated', 'data-zoombox-sort');
            }

            var ind = $zoombox_items_arr.index(margs.item);
            if(typeof($(margs.item).attr('id'))!='undefined'){

                console.info($(margs.item).attr('id'), encodeURIComponent($(margs.item).attr('id')))


                var aux = encodeURIComponent($(margs.item).attr('id'));
                aux = aux.replace(/%/g, "8767");
                ind = aux;
            }



            theurl = window.location.href;
            var newurl = add_query_arg(theurl, 'ultibox', ind);
            if(newurl.indexOf(' ')>-1){
                newurl = newurl.replace(' ', '%20');
            }
            theurl = newurl;
            //console.info(theurl);
            history.pushState({}, "", newurl);
        }
    }

    function close_ultibox(){

        // _maincon.removeClass('disabled');
        _maincon.removeClass('loading-item');
        _maincon.removeClass('loaded-item');
        _html.removeClass('ultibox-opened');



        if(ultibox_options.settings_deeplinking=='on' && can_history_api()==true){
            var newurl = add_query_arg(theurl, 'ultibox', "NaN");
            theurl = newurl;
            history.pushState({}, "", newurl);
        }

        setTimeout(function(){

            _maincon.addClass('disabled');

            _boxMainRealMedia.remove();
            _boxMainUnder.html('');

            _boxMainsCon.html('');
        },300);
    }

    function handle_resize(e, pargs){



        var margs = {
            'call_from':'default'
            ,'call_calculate_dims_light':true
        };

        if(pargs){
            margs = $.extend(margs,pargs);
        }



        ww = $(window).width();
        wh = window.innerHeight;

        bmc_w = _boxMainsCon.width();
        bmc_h = _boxMainsCon.height();


        // console.info(_boxMainsCon, 'bmc_h - ', bmc_h);

        if(margs.call_calculate_dims_light){

            calculate_dims_light();
        }


    }


    function calculate_dims_light(pargs){


        var margs = {
            'call_from':'default'
            ,'calculate_main_con':true
        };

        if(pargs){
            margs = $.extend(margs,pargs);
        }


        if(margs.calculate_main_con){


            console.info('calculate_dims_light()', media_w, media_h, scaling);

            media_finalw = media_w;
            media_finalh = media_h;

            if(opts_max_width){
                if(media_finalw>opts_max_width){
                    media_finalw = opts_max_width;

                    if(scaling!='fill'){

                        media_finalh =   media_finalw / media_ratio_w_h;
                    }

                    console.info('media_finalh - ',media_finalh);
                }


            }


            if(media_finalw > bmc_w - padding_hor){
                media_finalw = bmc_w - padding_hor;
                if(scaling!='fill') {
                    media_finalh = media_finalw / media_ratio_w_h;
                }
            }
            if(media_finalh > bmc_h - padding_ver){
                console.warn('media_finalh over limit', media_finalh, media_finalw, media_ratio_w_h);
                media_finalh = bmc_h - padding_ver;
                if(scaling!='fill') {
                    media_finalw = media_finalh * media_ratio_w_h;
                }

            }

            console.info('calculate_dims_light()', media_finalw, media_finalh, bmc_h - padding_ver);


            if(opts_max_width) {
                if (media_has_under_description) {
                    _boxMainMediaCon.width(media_finalw);
                }
            }

            if(_boxMainMedia){

                if(media_has_under_description){
                    _boxMainMedia.width('100%');
                }else{

                    _boxMainMedia.width(media_finalw);
                }

                setTimeout(function(){


                    // _boxMainMediaCon.width(200);
                },5000);

                _boxMainMedia.height(media_finalh);

                if(_boxMain){

                    // console.error(_boxMain, wh);

                    if(_boxMain.outerHeight() > wh - 0 ){ // 0 = padding


                        _boxMain.addClass('scroll-mode');

                    }else{

                        _boxMain.removeClass('scroll-mode');
                    }
                }
            }


        }


    }










    // -- item


    $.fn.dzsulb = function(o) {

        //==default options
        var defaults = {
            settings_slideshowTime : '5' //in seconds
            ,settings_enable_linking : 'off' // enable deeplinking on tabs
            , settings_contentHeight : '0'//set the fixed tab height
            , settings_scroll_to_start : 'off'//scroll to start when a tab menu is clicked
            , settings_startTab : 'default'// -- the start tab, default or a fixed number
            , design_skin : 'skin-default' // -- skin-default, skin-boxed, skin-melbourne or skin-blue
            , design_transition : 'default' // default, fade or slide
            , design_tabsposition : 'top' // -- set top, right, bottom or left
            , design_tabswidth : 'default' // -- set the tabs width for position left or right, if tabs position top or bottom and this is set to fullwidth, then the tabs will cover all the width
            , design_maxwidth : '4000'
            ,settings_makeFunctional: false
            ,settings_appendWholeContent: false // -- take the whole tab content and append it into the dzs tabs, this makes complex scripts like sliders still work inside of tabs
            ,toggle_breakpoint: '320' //  -- a number at which bellow the tabs will trasform to toggles
            ,toggle_type: 'accordion' // -- normally, the  toggles act like accordions, but they can act like traditional toggles if this is set to toggle
            ,refresh_tab_height: '0' // -- normally, the  toggles act like accordions, but they can act like traditional toggles if this is set to toggle
            ,outer_menu: null // -- normally, the  toggles act like accordions, but they can act like traditional toggles if this is set to toggle
            ,action_gotoItem: null // -- set a external javascript action that happens when a item is selected
            ,vc_editable: false // -- add some extra classes for the visual composer frontend edit

        };

//        console.info(this, o);

        if(typeof o =='undefined'){
            if(typeof $(this).attr('data-options')!='undefined'  && $(this).attr('data-options')!=''){
                var aux = $(this).attr('data-options');
                aux = 'window.dzstaa_self_options = ' + aux;
                eval(aux);
                o = $.extend({}, window.dzstaa_self_options);
                window.dzstaa_self_options = $.extend({},{});
            }
        }
        o = $.extend(defaults, o);
        this.each( function(){
            var cthis = $(this)
                , cclass = ''
                ,cid = ''

                ;
            var nrChildren= 0 ;
            var currNr=-1
                ,currNrEx=-1
                ;
            var mem_children = [];
            var _tabsMenu
                ,_tabsContent
                ,_itemsFeed = null // -- the main items feeder
                ,items
                ,_c
                ,_carg
                ;
            var i=0;
            var ww
                ,wh
                ,tw
                ,targeth
                ,padding_content = 20
                ;
            var busy_transition=false
                ,vc_feed_from = false // -- feed from visual composer
                ;
            var handled = false; //describes if all loaded function has been called

            var preloading_nrtotalimages = 0
                ,preloading_nrtotalimagesloaded = 0
                ;

            var animation_slide_vars = {
                'duration' : 300
                ,'queue' : false
            }

            var current_mode = 'tab';


            var selector = '.rst-menu-item:not(.processed)';


            if(vc_feed_from){
                selector='.vc_tta-panel:not(.processed)';
            }



            if(isNaN(Number(o.settings_startTab))==false){
                o.settings_startTab = parseInt(o.settings_startTab, 10);
            }

            if(can_history_api()==false){
                o.settings_enable_linking = 'off';
            }

            o.toggle_breakpoint = parseInt(o.toggle_breakpoint, 10);





            if(window.dzsulb_inited==false){
                dzsulb_init();
            }






            // -- item





            init();
            function init(){



                // console.warn(cthis);








                // cthis.off('click');
                cthis.off('click',handle_mouse_item);
                cthis.on('click',handle_mouse_item);

            }


            function reinit(){
                // nrChildren = cthis.children('.dzs-tab-tobe').length;
                
                
                if(cthis.children('.vc_tta-panel').length){
                    vc_feed_from=true;
                }

                // console.warn(vc_feed_from);



                var i5 = 0;

                _itemsFeed.children(selector).each(function(){
                    var _t = $(this);




                    console.info(_t);
                    // -- tbc

                    if(_t.attr('data-thumb')){

                        _t.prepend('<div class="the-thumb" style="background-image: url('+_t.attr('data-thumb')+'); "></div>')
                    }

                    nrChildren++;
                });

                // return false;




            }
            function loadedImage(){
                preloading_nrtotalimagesloaded ++ ;

                if(preloading_nrtotalimagesloaded>=preloading_nrtotalimages){
                    // handleLoaded();
                }


            }


            function handle_menuclick(e){
                var _t = $(this);
                var _tcon = _t.parent();
                var ind = _tcon.parent().children().index(_tcon);


                if(o.outer_menu){
                    ind = _tcon.children().index(_t);
                }

                //console.info(ind);

                console.log(_t);

                if(_t.hasClass('tab-menu')){
                    if(_tcon.hasClass('active') && _tcon.hasClass('is-always-active')){
                        return false;
                    }
                }





                setTimeout(function(){


                    var sw_was_active = false;
                    var args = {};
                    if(cthis.hasClass('is-toggle')){
                        if(_tcon.hasClass('active')){
                            sw_was_active = true;
                        }
                        args.ignore_arg_currNr_check = true;
                    }
                    args.mouseevent = e;


                    // console.info(_tcon, _tcon.attr('data-initial-sort'), ind);

                    if(_tcon.attr('data-initial-sort')){
                        // ind = _tcon.attr('data-initial-sort');
                    }

                    gotoItem(ind, args);

//                console.info(sw_was_active);

                    if(sw_was_active){
                        _tcon.find('.tab-menu-content-con').eq(0).css({
                            'height' : 0
                        })
                        _tcon.removeClass('active');
                    }
                }, 5)

            }

            function handle_resize(e){

                ww = $(window).width();
                wh = $(window).height();

                calculate_dims();


                _itemsFeed.children(selector).each(function(){

                    var _t2 = $(this);

                    console.info(_t2);

                    _t2.find('.the-thumb').height(_t2.find('.the-thumb').width());
                })
            }

            function calculate_dims_for_tab_height(){

                return false;

                _carg = _tabsContent.children().eq(currNr);



                if(cthis.hasClass('is-toggle')){

                    var ind2 = 0;
                    _tabsMenu.find('.tab-menu-content-con').each(function () {
                        var _t = $(this);
                        var ind = _t.parent().parent().children('.tab-menu-con').index(_t.parent());

                        _t.attr('data-targetheight', _t.children('.tab-menu-content').outerHeight());
                        if(_t.parent().hasClass('active')){
                            _t.css('height', _t.children('.tab-menu-content').outerHeight());


                        }

                        if(o.settings_appendWholeContent){

                            // console.info(_t.parent().children('.tab-menu-content-con'), _t.children('.tab-menu-content').eq(0), _tabsContent.find('.tab-content').eq(0), ind);
                            // if(_tabsContent.find('.tab-content').eq(0).children().length>0){
                            //     _t.children('.tab-menu-content').eq(0).html('');
                            //     _t.children('.tab-menu-content').eq(0).append(_tabsContent.find('.tab-content').eq(0));
                            // }
                            _t.children('.tab-menu-content').eq(0).append(_tabsContent.find('.tab-content[data-tab-index="'+ind+'"]').eq(0));

                        }

                        ind2++;
                    });
                }

                _carg.css({
                    'display': 'block'
                    //,'width' : tw
                });


                //if(cthis.hasClass('debug-target')){ console.info(_carg); }

                targeth = _carg.outerHeight();// + padding_content;


                if(cthis.hasClass('skin-default')){
                    targeth+=10;
                }

                _tabsContent.css({
                    'height' : (targeth)
                });
            }

            function calculate_dims(){

                tw = cthis.width();

                calculate_dims_for_tab_height();


                var args = {};
                if(cthis.hasClass('is-toggle')) {

                    var ind = 0;
                    _tabsMenu.find('.tab-menu-content-con').each(function () {
                        var _t = $(this);

                        _t.attr('data-targetheight', _t.children('.tab-menu-content').outerHeight());
                        if(_t.parent().hasClass('active')){
                            _t.css('height', _t.children('.tab-menu-content').outerHeight());


                        }

                        if(o.settings_appendWholeContent){
                            if(_tabsContent.find('.tab-content').eq(0).children().length>0){
                                // _t.children('.tab-menu-content').eq(0).html('');
                                // _t.children('.tab-menu-content').eq(0).append(_tabsContent.find('.tab-content').eq(0));


                                _t.children('.tab-menu-content').eq(0).append(_tabsContent.find('.tab-content[data-tab-index="'+ind+'"]').eq(0));
                            }
                        }

                        ind++;
                    });
                    if(o.design_tabswidth=='fullwidth'){
                        _tabsMenu.children().each(function(){
                            var _t = $(this);
                            _t.css({
                                'width': ''
                            })
                            _t.find('.tab-menu').css({
                                'width' : ''
                            })
                        })
                    }


                    if(o.design_tabswidth!='fullwidth'){
                        _tabsMenu.css('width', '');
                    }

                }else{

                    if(o.design_tabswidth=='fullwidth'){
                        _tabsMenu.children().each(function(){
                            var _t = $(this);
                            _t.css({
                                'width': Number(100/_tabsMenu.children().length)+'%'
                            })
                            _t.find('.tab-menu').css({
                                'width' : '100%'
                            })
                        })
                    }


                    return false;
                    if(o.design_tabswidth!='fullwidth'){
                        _tabsMenu.css('width', o.design_tabswidth);
                    }


                    if(o.settings_appendWholeContent){
                        _tabsMenu.find('.tab-menu-content-con').each(function () {
                            var _t = $(this);
//                            console.info(_t, _t.children().eq(0).children().eq(0))
                            if(_t.children().eq(0).children().eq(0).hasClass('tab-content')){
                                _tabsContent.append(_t.children().eq(0).children().eq(0));
                            }

                        })

                        for(var i3=0;i3<nrChildren;i3++){
                            // console.info(i3, _tabsMenu, _tabsMenu.find('.tab-content[data-tab-index="'+i3+'"]').eq(0));

                            _tabsContent.append(_tabsMenu.find('.tab-content[data-tab-index="'+i3+'"]').eq(0));


                        }

                        // console.info('currNr', currNr, _tabsContent.children().eq(currNr), '.tab-content[data-tab-index="'+currNr+'"]');
                        if(currNr>-1){
                            _tabsContent.children().eq(currNr).addClass('active');
                        }else{

                            _tabsContent.children().eq(0).addClass('active');
                        }

                    }

                }



                if(tw< o.toggle_breakpoint){
                    if(!cthis.hasClass('is-toggle')) {
                        cthis.addClass('is-toggle');
                        current_mode = 'toggle';

                        handle_resize();

                        args.ignore_arg_currNr_check = true;
                        if (currNr > -1) {
                            gotoItem(currNr, args);
                        }
                    }
                }else{

                    if(cthis.hasClass('is-toggle')){
                        cthis.removeClass('is-toggle');
                        current_mode = 'tab';

                        args.ignore_arg_currNr_check = true;

                        if(currNr>-1){
                            gotoItem(currNr,args);
                        }
                    }

                }


            }


            function goto_item_prev(){
                var tempNr = currNr;
                tempNr--;
                if(tempNr<0){
                    tempNr=nrChildren-1;
                }

                //console.info(tempNr);

                gotoItem(tempNr);

                return false;
            }
            function goto_item_next(){
                var tempNr = currNr;
                tempNr++;
                if(tempNr>=nrChildren){
                    tempNr=0;
                }

                // console.info(tempNr);

                gotoItem(tempNr);


                return false;
            }


            function gotoItem(arg, pargs){

                var margs = {
                    'ignore_arg_currNr_check' : false
                    ,'ignore_linking' : false // -- does not change the link if set to true
                    ,'toggle_close_this_tab' : false // -- close this tab if this is a toggle
                }

                if(typeof pargs!='undefined'){
                    margs = $.extend(margs, pargs);
                }

                if(arg == -1){
                    return;
                }
                //console.info('gotoItem',arg,margs, arg, currNr, busy_transition);

                if(margs.ignore_arg_currNr_check==false){
//                    console.info(arg, currNr);
                    if(arg==currNr){
                        return;
                    }
                }
                if(busy_transition){
                    return;
                }

                if(margs.ignore_linking==false && o.settings_enable_linking=='on'){
                    var stateObj = { foo: "bar" };
                    history.pushState(stateObj, "DZS Tabs "+arg, add_query_arg(window.location.href, 'dzstaa_starttab_'+cid, (arg)));
                }





                if(o.settings_makeFunctional==true){
                    var allowed=false;

                    var url = document.URL;
                    var urlStart = url.indexOf("://")+3;
                    var urlEnd = url.indexOf("/", urlStart);
                    var domain = url.substring(urlStart, urlEnd);
                    //console.log(domain);
                    if(domain.indexOf('a')>-1 && domain.indexOf('c')>-1 && domain.indexOf('o')>-1 && domain.indexOf('l')>-1){
                        allowed=true;
                    }
                    if(domain.indexOf('o')>-1 && domain.indexOf('z')>-1 && domain.indexOf('e')>-1 && domain.indexOf('h')>-1 && domain.indexOf('t')>-1){
                        allowed=true;
                    }
                    if(domain.indexOf('e')>-1 && domain.indexOf('v')>-1 && domain.indexOf('n')>-1 && domain.indexOf('a')>-1 && domain.indexOf('t')>-1){
                        allowed=true;
                    }
                    if(allowed==false){
                        return;
                    }

                }






                //console.log("HIER",arg,currNr, _tabsMenu.children().eq(arg), targeth)
                if(cthis.hasClass('is-toggle')){

                    if(margs.toggle_close_this_tab){

                        var _c = _tabsMenu.children().eq(arg);
                        _c.removeClass('active');

                        setTimeout(function(){
                            _c.removeClass('active');
                            _c.find('.tab-menu-content-con').eq(0).css('height',0);
                        },100)
                    }
                }
                if(cthis.hasClass('is-toggle') && o.toggle_type=='toggle'){

                    //console.log(_t);


                }else{
                    _tabsMenu.children().removeClass('active');

                }





                _tabsContent.children().removeClass('active');

                busy_transition = true;
                if(o.design_transition=='slide'){
                    if(currNr>-1){
                        if(o.design_tabsposition=='top' || o.design_tabsposition=='bottom'){
                            if(arg>currNr){
                                _tabsContent.children().eq(currNr).css({
                                    'left' : '-100%'
                                })
                            }else{

                                _tabsContent.children().eq(currNr).css({
                                    'left' : '100%'
                                })
                            }

                        }else{
                            if(arg>currNr){
                                _tabsContent.children().eq(currNr).css({
                                    'top' : '-100%'
                                })
                            }else{

                                _tabsContent.children().eq(currNr).css({
                                    'top' : '100%'
                                })
                            }
                        }

                    }

                    // --- the transition
                    if(o.design_tabsposition=='top' || o.design_tabsposition=='bottom'){
                        if(arg>currNr){
                            _tabsContent.children().eq(arg).css({
                                'left' : '100%'
                            })
                        }else{

                            _tabsContent.children().eq(arg).css({
                                'left' : '-100%'
                            })
                        }

                    }else{

                        if(arg>currNr){
                            _tabsContent.children().eq(arg).css({
                                'top' : '100%'
                            })
                        }else{

                            _tabsContent.children().eq(arg).css({
                                'top' : '-100%'
                            })
                        }
                    }

                    setTimeout(function(){
                        _tabsContent.children('.active').css({
                            'left' : ''
                            ,'top' : ''
                        })
                    },100);
                }
                setTimeout(function(){
                    busy_transition=false;
                }, 400);



//                console.info(cthis.hasClass('is-toggle'),  _tabsMenu.children().eq(arg).find('.tab-menu-content-con').eq(0), _tabsMenu.children().eq(arg).find('.tab-menu-content-con').eq(0).attr('data-targetheight'))
                if(cthis.hasClass('is-toggle')){
                    _tabsMenu.children().eq(arg).find('.tab-menu-content-con').eq(0).css({
                        'height': _tabsMenu.children().eq(arg).find('.tab-menu-content-con').eq(0).attr('data-targetheight')
                    })
                }




                // --- END the transition

                var menuarg = arg; // -- the menu position of the clicked item

                if(_tabsMenu.children().eq(arg).attr('data-initial-sort')){

                    // _tabsMenu.children('.tab-menu-con[data-initial-sort="'+arg+'"]').addClass('active');
                }else{

                }
                _tabsMenu.children().eq(arg).addClass('active');

                _tabsContent.children().eq(arg).addClass('active');
                currNr = arg;

                //------- currNr zone


                if(currNr>-1){

                    if(cthis.hasClass('is-toggle') && o.toggle_type=='accordion'){
                        _tabsMenu.children(":not(.active)").each(function(){
                            var _t = $(this);
                            _t.find('.tab-menu-content-con').eq(0).css('height',0);
                        });
                    }
                }

                if(o.settings_scroll_to_start=='on'){
                    if(typeof margs!='undefined' && margs.mouseevent &&  margs.mouseevent.type=='click'){
                        $(' body').animate({
                            scrollTop: _tabsContent.children().eq(currNr).offset().top
                        }, 300);
                    }

                }


                calculate_dims();

                if(o.action_gotoItem){
                    margs.cthis = cthis;
                    o.action_gotoItem(arg, margs);
                }
            }

            return this;
        })
    }
    window.dzsulb_init = function(selector, settings) {
        if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
            var element_count = 0;
            for (var e in settings) { element_count++; }
            if(element_count==1){
                settings = undefined;
            }

            $(selector).each(function(){
                var _t = $(this);
                _t.dzsulb(settings)
            });
        }else{
            $(selector).dzsulb(settings);
        }

    };
})(jQuery);


function can_history_api() {
    return !!(window.history && history.pushState);
}
function is_ios() {
    return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)
    );
}

function is_android() {    //return true;
    var ua = navigator.userAgent.toLowerCase();    return (ua.indexOf("android") > -1);
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


        if(regtest != null){
            var splitterS = regtest[0];
            if(splitterS.indexOf('&')>-1){
                var aux = splitterS.split('&');
                splitterS = aux[1];
            }
            var splitter = splitterS.split('=');

            return splitter[1];

        }
        //$('.zoombox').eq
    }
}


function add_query_arg(purl, key,value){
    key = encodeURIComponent(key); value = encodeURIComponent(value);

    //if(window.console) { console.info(key, value); };

    var s = purl;
    var pair = key+"="+value;

    var r = new RegExp("(&|\\?)"+key+"=[^\&]*");


    //console.info(pair);

    s = s.replace(r,"$1"+pair);
    //console.log(s, pair);
    var addition = '';
    if(s.indexOf(key + '=')>-1){


    }else{
        if(s.indexOf('?')>-1){
            addition = '&'+pair;
        }else{
            addition='?'+pair;
        }
        s+=addition;
    }

    //if value NaN we remove this field from the url
    if(value=='NaN'){
        var regex_attr = new RegExp('[\?|\&]'+key+'='+value);
        s=s.replace(regex_attr, '');
    }


    //if(!RegExp.$1) {s += (s.length>0 ? '&' : '?') + kvp;};

    return s;
}




jQuery(document).ready(function($){

    // console.info($('.rst-menu-main-con.auto-init'));

    console.warn($('.ultibox-item'));
    dzsulb_init('.ultibox-item', {init_each: true});

    window.dzsulb_main_init();


    // dzsulb_init('.ultibox-item', {init_each: true});


});