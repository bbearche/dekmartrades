
/*
 * Author: Digital Zoom Studio
 * Website: http://digitalzoomstudio.net/
 * Portfolio: http://codecanyon.net/user/ZoomIt/portfolio
 *
 * Version: 0.9901
 */

"use strict";


window.dzszfl_self_options = {};

Math.easeIn = function(t, b, c, d) {

    return -c *(t/=d)*(t-2) + b;

};

function sory_by_sort(a, b){
    var nr1=0;
    var nr2 = 0;
    //console.log(a);

    if(a && a.attr){

    }
    nr1 = Number(jQuery(a).attr('data-sort'));
    nr2 = Number(jQuery(b).attr('data-sort'));


    return ((nr1 < nr2) ? -1 : ((nr1 > nr2) ? 1 : 0));
}


window.dzs_check_lazyloading_images_use_this_element_css_top_instead_of_window_scroll = null;


window.dzs_check_lazyloading_images_toberesized_arr = [];
window.dzs_check_lazyloading_images = function(){
    //console.info('dzs_check_lazyloading_images()');

    var st = jQuery(window).scrollTop();

    var wh = jQuery(window).height();

    //console.info(st,wh);

    if(window.dzs_check_lazyloading_images_use_this_element_css_top_instead_of_window_scroll){

        st = -(parseInt(window.dzs_check_lazyloading_images_use_this_element_css_top_instead_of_window_scroll.css('top'),10));
    }

    //console.info(st);



    jQuery('img[data-src],.divimage[data-src]').each(function(){
        var _t = jQuery(this);
        //console.info(_t,_t.offset().top,st+wh);

        if(_t.offset().top<=st+wh){


            var auximg = new Image();



            auximg.onload = function(){


                //console.info(this,_t,_t.attr('data-src'));

                if(_t.attr('data-src')){

                    var aux34 = _t.attr('data-src');


                    if(_t.hasClass('divimage')){
                        _t.css('background-image','url('+aux34+')');

                        window.dzs_check_lazyloading_images_toberesized_arr.push(_t);

                        _t.attr('data-responsive_ratio',this.naturalHeight / this.naturalWidth);

                        window.dzs_check_lazyloading_image_resize();
                    }else{
                        _t.attr('src', aux34);
                    }

                    _t.attr('data-src', '');
                    _t.addClass('loaded');
                }

                if(_t.hasClass('set-height-auto-after-load')){

                    _t.css('height','auto');
                }


                //console.info(_t.parent().parent().parent().parent().parent(), _t.parent().parent().parent().parent().parent().hasClass('.mode-isotope'))
                if(_t.parent().parent().parent().parent().parent().hasClass('mode-isotope')){
                    //console.info('ceva');

                    var _c = _t.parent().parent().parent().parent().parent();
                    if(_c.get(0) && _c.get(0).api_relayout_isotope){
                        _c.get(0).api_relayout_isotope();
                    }
                }



            }

            auximg.src=_t.attr('data-src');

        }
    })
}


window.dzs_check_lazyloading_image_resize = function(){
    //console.info("ceva");

    for(var i=0;i<window.dzs_check_lazyloading_images_toberesized_arr.length;i++){
        var _c = window.dzs_check_lazyloading_images_toberesized_arr[i];

        //console.info(_c);

        _c.height(Number(_c.attr('data-responsive_ratio')) * _c.width());
    }
}

if(!(window.dzs_check_lazyloading_images_inited)){

    window.dzs_check_lazyloading_images_inited = false;

    jQuery(window).bind('resize',window.dzs_check_lazyloading_image_resize)
}

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
    $.fn.zfolio = function(o) {
        var defaults = {
            design_item_thumb_just_use_img: "off" // -- just use images tags for auto width and height
            , settings_autoHeight: 'on'
            , settings_skin: 'skin-default'
            , settings_mode: 'isotope'// -- isotope or cols
            , settings_disableCats: 'off'
            , settings_clickaction: 'none'
            , title: ''
            ,design_total_height_full:'off'
            , design_item_width: '0'
            , design_item_height: '0'
            , design_item_height_same_as_width: 'off' // ==deprecated, use thumbh 1/1
            , design_sizecontain_forfeatureimage: 'off' // -- use size contain for feature image
            , design_thumbw: ''
            , design_item_thumb_height: ''// -- default thumbh, values like "2/3" ( of width )  are accepted or "proportional" to just calculate for each item individually
            , design_categories_pos: 'top' // top or bottom
            , design_categories_align: 'auto' //auto, alignleft, aligncenter or alignright
            ,design_specialgrid_chooser_align: 'auto' //auto, alignleft, aligncenter or alignright
            ,design_pageContent_pos: 'top'
            , design_categories_style: 'normal' // normal or dropdown
            ,design_waitalittleforallloaded: 'off' //wait for the items to arrange first before making the portfolio visible
            , use_scroll_lazyloading_for_images: 'off' // -- set images to lazy load on scroll
            , settings_ajax_enabled: 'off'
            , settings_ajax_loadmoremethod: 'scroll'// -- choose between scroll and button mode NEW pages
            , settings_ajax_pages: []
            , settings_lightboxlibrary: 'zoombox'
            , item_inner_addid: ''
            , settings_preloadall: 'off'
            , settings_add_loaded_on_images: 'off' // -- add a loaded class on the image items when laoded
            , settings_useLinksForCategories: 'off'
            , settings_useLinksForCategories_enableHistoryApi: 'off'
            , disable_itemmeta: "off"
            , disable_cats: "off" // -- disable the categories display
            ,wall_settings: {}
            ,settings_enableHistory : 'off' // history api for link type items
            ,audioplayer_swflocation: 'ap.swf'
            ,videoplayer_swflocation: 'preview.swf'
            ,settings_makeFunctional: true
            ,settings_defaultCat: '' // == default a category at start
            ,settings_forceCats: [] // == force categories in this order
            ,settings_categories_strall: 'All' // == the name of the all category select
            ,settings_categories_strselectcategory: 'Select Category'
            ,settings_mode_masonry_layout: 'masonry'
            ,settings_mode_masonry_column_width: 1
            ,settings_set_forced_width: "off" // -- set a javascript calculated width on the item
            ,settings_isotope_settings: {
                getSortData: {
                    number: function ($elem) {
                        return parseInt($($elem).attr('data-sort'), 10);
                    }
                }

                , itemSelector: '.isotope-item'
                , sortBy: 'number'
                ,layoutMode: 'packery'
                //,percentPosition: true
                ,masonry: {
                    // use outer width of grid-sizer for columnWidth
                    columnWidth: '.grid-sizer'
                }
                // -- packery does not sort whel percent Position
                ,packery: {
                    // use outer width of grid-sizer for columnWidth
                    columnWidth: 1
                }
            }
            ,zoombox_settings: {}
            ,settings_mode_masonry_layout_straightacross_setitemsoncenter:'off'
            ,item_extra_class:''
            ,excerpt_con_transition:'zoom' // -- wipe or zoom
            ,excerpt_con_resize_videos:'off' // -- resize videos in the excerpt con based on a responsive ratio.
            ,excerpt_con_responsive_ratio:'810' // -- the responsive width on which the height is based ( height should already be set on the element )
            ,outer_con_selector_con:null // -- select a selector con so the categories would be outside the zfolio


        };


        if(typeof o =='undefined'){
            if(typeof $(this).attr('data-options')!='undefined'  && $(this).attr('data-options')!=''){
                var aux = $(this).attr('data-options');

                var aux_opts = null;
                aux = ' window.dzszfl_self_options = ' + aux;
                eval(aux);
                o = $.extend({},window.dzszfl_self_options);


                window.dzszfl_self_options = $.extend({},{});

                //console.info(o);
            }
        }


        o = $.extend(defaults, o);
        this.each(function() {
            var cthis = $(this);
            var cclass = '';
            var cid = '';
            var cchildren = cthis.children()
                ,images
                ;
            var nr_children = cthis.find('.items').eq(0).children().length
                ;
            var currNr = -1;
            var i = 0;
            var ww
                , wh
                , tw
                , th
                ;
            var _pageCont
                ,_items = null
                , _theitems
                , _selectorCon = null
                ;
            var arr_cats = [] // =categories
                ,arr_itemhproportionals = [] // === proportional item heights for each item
                ,arr_thumbhproportionals = [] // === proportional thumb heights for each item
                ;
            var busy = false
                ,busy_ajax = false
                ,destroyed = false
                ;
            var sw = false;
            var the_skin = 'skin-default';
            var isotope_settings = o.settings_isotope_settings;
            var inter_calculate_dims = 0
                ,inter_reset_light = 0
                ,inter_relayout = 0

                ;
            var action_after_portfolio_expanded = null
                ;

            var ind_ajaxPage = 0
                ,mode_cols_nr_of_cols = 0
                ;


            var sw_mode_cols_nr_of_cols = 0
                ,i_dzscol_ind = 0;
            ;

            var animation_duration=300;

            //===thumbsize
            var st_tw = 0
                , st_th = 0
                ,design_item_thumb_height = 200
                ,design_item_thumb_height_dynamic = false
                , thumbh_dependent_on_w = false
                , itemh_dependent_on_w = false
                ,layout_margin = 0
                ,inter_relayout_allow = false
                ;


            var _excerptContentCon = null // - the excerpt con
                ,_excerptContent = null
                ,_excerptContent_initialPortItem = null
                ,_tcon_content = null
                ;

            var dzsp_translate_close = "Close"
                ;
            var arr_cats = [] // -- categories
                ;

            if(typeof window.dzsp_translate_close!='undefined'){
                dzsp_translate_close = window.dzsp_translate_close;
            }

//            console.info(window.dzsp_translate_close2);



            var is_already_inited="off"
                ,is_hard_defined_inittop = 'notsetyet'
                ;

            var categories_parent;


            //==loading vars
            var nrLoaded = 0
                ,started = false
                ,widthArray = []
                ,heightArray = []
                ,loadedArray = []
                ,startitems_html = ''
                ,$itemsArray = null
                ;

            //console.info(nr_children);

            cid = cthis.attr('id');


            if(typeof cid=='undefined' || cid==''){
                var auxnr = 0;
                var temps = 'zoomfolio'+auxnr;

                while($('#'+temps).length>0){
                    auxnr++;
                    temps = 'zoomfolio'+auxnr;
                }

                cid = temps;
                cthis.attr('id', cid);
            }



            init();

            function init(){
                //console.info(cthis, 'zoomfolio - init()', cthis.descendantOf($('body')), o);

                if(cthis.hasClass('dzszfl-inited')){
                    return false;
                }

                if(cthis.hasClass('skin-qcre')){
                    o.design_skin = 'skin-qcre';
                }
                if(cthis.hasClass('skin-melbourne')){
                    o.design_skin = 'skin-melbourne';
                }
                if(cthis.hasClass('skin-silver')){
                    o.design_skin = 'skin-silver';
                }
                if(cthis.hasClass('skin-gazelia')){
                    o.design_skin = 'skin-gazelia';
                }
                if(cthis.hasClass('skin-lazarus')){
                    o.design_skin = 'skin-lazarus';
                }
                if(cthis.hasClass('skin-alba')){
                    o.design_skin = 'skin-alba';
                }


                _items = cthis.find('.items').eq(0);

                cthis.addClass('mode-'+o.settings_mode);

                if(o.settings_mode=='cols'){
                    if(cthis.hasClass('layout-2-cols-10-margin')||cthis.hasClass('layout-2-cols-15-margin')){

                        for(i=0;i<2;i++){

                            _items.append('<div class="dzs-col"></div>');
                        }
                    }
                    if(cthis.hasClass('layout-3-cols-10-margin')||cthis.hasClass('layout-3-cols-15-margin')){

                        for(i=0;i<3;i++){

                            _items.append('<div class="dzs-col dzs-col-4"></div>');
                        }
                    }
                    if(cthis.hasClass('layout-4-cols-10-margin')||cthis.hasClass('layout-4-cols-15-margin')){

                        for(i=0;i<4;i++){

                            _items.append('<div class="dzs-col "></div>');
                        }
                    }

                    if(cthis.hasClass('layout-5-cols-10-margin')||cthis.hasClass('layout-5-cols-15-margin')){

                        for(i=0;i<5;i++){

                            _items.append('<div class="dzs-col dzs-col-1/5"></div>');
                        }
                    }


                }


                //console.log(Number(o.design_item_thumb_height));
                if(isNaN(Number(o.design_item_thumb_height))==false){
                    design_item_thumb_height = Number(o.design_item_thumb_height);
                    design_item_thumb_height_dynamic=false;

                    if(design_item_thumb_height<=1 && design_item_thumb_height>0){
                        design_item_thumb_height_dynamic=true;

                    }
                }else{

                }
                if(isNaN(Number(cthis.attr('data-margin')))==false){
                    layout_margin = Number(cthis.attr('data-margin'));
                }

                cthis.addClass('dzszfl-inited');

                reinit();

                init_ready();
            }

            function reinit(){

                var i=1;
                i_dzscol_ind = 0;
                sw_mode_cols_nr_of_cols = 0;


                _items.children('.zfolio-item:not(.inited)').each(function(){

                    var _t = $(this);

                    if(_t.children().eq(0).hasClass('zfolio-item--inner')){


                        if(o.settings_mode=='cols') {
                            if (_t.children('.zfolio-item--inner').hasClass('zoombox')) {

                                _t.children('.zfolio-item--inner').attr('data-zoombox-sort', i - 1);
                            }
                        }
                    }else{


                        if(_t.attr('data-link') && o.design_skin=='skin-melbourne'){

                            _t.wrapInner('<a href="'+_t.attr('data-link')+'" class="zfolio-item--inner"></a>');
                        }else{

                            _t.wrapInner('<div class="zfolio-item--inner"></div>');
                        }

                    }

                    var _ti = _t.children('.zfolio-item--inner');

                    //console.log("CEVA", o.item_inner_addid);
                    if(o.item_inner_addid){
                        var aux = '';

                        if(cthis.attr('id')){
                            aux+=cthis.attr('id')+'-';
                        }

                        aux+=o.item_inner_addid+String(i);

                        if(aux){
                            _ti.attr('id',aux);
                        }
                    }

                    //console.log(_t);

                    _ti.prependOnce('<div class="the-feature-con"></div>');

                    if(o.design_skin=='skin-alba'){
                        _ti.append('<figure class="line1"></figure><figure class="line1"></figure><figure class="line1"></figure><figure class="line1"></figure>')
                    }



                    if(o.design_item_thumb_just_use_img=='on'){





                        var aux = '<img class="the-feature';

                        if(o.use_scroll_lazyloading_for_images=='on'){

                            aux+=' lazyloading-transition-fade set-height-auto-after-load" data-src="'+_t.attr('data-thumbnail')+'"';
                            aux+='" style="height:300px; display:block;"';
                        }else{

                            aux+='" src="'+_t.attr('data-thumbnail')+'"';
                        }

                        aux+='/>';

                        _ti.find('.the-feature-con').eq(0).prependOnce(aux);

                        _ti.find('.the-feature-con').eq(0).addClass('auto-height');

                    }else{

                        _ti.find('.the-feature-con').eq(0).prependOnce('<div class="the-feature" style="background-image: url('+_t.attr('data-thumbnail')+');"></div>');
                    }


                    var overlay_extra_class='';

                    //console.log(_t.attr('data-overlay_extra_class'));
                    if(_t.attr('data-overlay_extra_class')){
                        overlay_extra_class+= ' '+_t.attr('data-overlay_extra_class');
                    }

                    var izlink=false;
                    var aux = '<div class="the-overlay'+overlay_extra_class+'" ';




                    if(_t.attr('data-link')){

                        if(o.design_skin=='skin-silver' || o.design_skin=='skin-qcre'){


                            aux='<a href="'+_t.attr('data-link')+'" class="the-overlay '+overlay_extra_class+'" ';

                            izlink=true;
                        }


                        if(o.design_skin=='skin-gazelia'){

                            izlink=false;
                            aux = '<div class="the-overlay" ';
                            aux+='>';
                            //console.info(_t);
                            aux+='<a href="'+_t.attr('data-link')+'" class="the-overlay-anchor '+overlay_extra_class+'"';

                            if(_t.attr('data-overlay_anchor_extra_attr')){
                                aux+=_t.attr('data-overlay_anchor_extra_attr');
                            }


                            aux+='>';


                            if(_t.children('.overlay-anchor-extra-html').length>0){
                                aux+=_t.children('.overlay-anchor-extra-html').eq(0).html();
                            }

                            aux+='</a';
                        }


                        if(o.design_skin=='skin-lazarus'){

                            izlink=false;
                            aux = '<div class="the-overlay" ';
                            aux+='>';
                            //console.info(_t);
                            aux+='<a href="'+_t.attr('data-link')+'" class="the-overlay-anchor '+overlay_extra_class+'"';

                            if(_t.attr('data-overlay_anchor_extra_attr')){
                                aux+=_t.attr('data-overlay_anchor_extra_attr');
                            }


                            aux+='>';


                            if(_t.children('.overlay-anchor-extra-html').length>0){
                                aux+=_t.children('.overlay-anchor-extra-html').eq(0).html();
                            }

                            aux+='</a';
                        }
                    }

                    if(_t.attr('data-overlay_extra_attr')){
                        aux+=_t.attr('data-overlay_extra_attr');
                    }

                    aux+='>';



                    if(izlink){

                        aux+='</a>';
                    }else{

                        aux+='</div>';
                    }




                    _ti.find('.the-feature-con').eq(0).appendOnce(aux);



                    if(o.design_skin=='skin-gazelia'){

                        //console.info('ceva',_t, cthis.children('.the-overlay-anchor').length)
                        if(_t.children('.the-overlay-anchor').length>0){
                            //console.info(ti.find('.the-overlay').eq(0));
                            _t.find('.the-overlay').eq(0).append(_t.children('.the-overlay-anchor').eq(0))
                        }
                    }

                    if(o.design_skin=='skin-lazarus'){

                        //console.info('ceva',_t, cthis.children('.the-overlay-anchor').length)
                        if(_t.children('.the-overlay-anchor').length>0){
                            //console.info(ti.find('.the-overlay').eq(0));
                            _t.find('.the-overlay').eq(0).append(_t.children('.the-overlay-anchor').eq(0))
                        }
                    }

                    if(design_item_thumb_height_dynamic==false && design_item_thumb_height>0){
                        _ti.find('.the-feature-con').height(design_item_thumb_height);





                    }

                    _t.addClass(o.item_extra_class);

                    _t.addClass('inited');

                    //console.info(i);
                    _t.attr('data-sort',i*10);



                    var the_cats = _t.attr('data-category');
                    if (the_cats != undefined && the_cats != '') {

                        the_cats = the_cats.split(';');
                        //console.log(the_cats);
                        for (var j = 0; j < the_cats.length; j++){
                            var the_cat = the_cats[j];
                            var the_cat_unsanatized = the_cats[j];
                            if (the_cat != undefined) {
                                the_cat = the_cat.replace(/ /gi, '-');

                                _t.addClass('cat-' + the_cat);

                            }
                            sw = false;
                            //console.log(the_cats, arr_cats, the_cat_unsanatized)
                            for (var k = 0; k < arr_cats.length; k++) {
                                if (arr_cats[k] == the_cat_unsanatized) {
                                    sw = true;
                                }
                            }
                            if (sw == false) {
                                arr_cats.push(the_cat_unsanatized);
                            }
                        }
                    }

                    i++;



                    if(o.settings_mode=='cols') {


                        if (cthis.hasClass('layout-2-cols-10-margin') || cthis.hasClass('layout-2-cols-15-margin')) {

                            if(i_dzscol_ind>=2){
                                i_dzscol_ind = 0 ;
                            }

                            mode_cols_nr_of_cols = 2;
                        }
                        if (cthis.hasClass('layout-3-cols-10-margin')||cthis.hasClass('layout-3-cols-15-margin')) {

                            if(i_dzscol_ind>=3){
                                i_dzscol_ind = 0 ;
                            }

                            mode_cols_nr_of_cols = 3;
                        }
                        if (cthis.hasClass('layout-4-cols-10-margin')||cthis.hasClass('layout-4-cols-15-margin')) {

                            if(i_dzscol_ind>=4){
                                i_dzscol_ind = 0 ;
                            }
                            mode_cols_nr_of_cols = 4;

                        }
                        if (cthis.hasClass('layout-5-cols-10-margin') || cthis.hasClass('layout-5-cols-15-margin')) {

                            if(i_dzscol_ind>=5){
                                i_dzscol_ind = 0 ;
                            }
                            mode_cols_nr_of_cols = 5;

                        }


                        //console.info(cthis.children('.dzs-col'));
                        _items.children('.dzs-col').eq(i_dzscol_ind).append(_t);

                        i_dzscol_ind++;
                    }

                })



            }

            function init_ready(){


                //console.info('init_ready()');

                if(o.settings_mode=='isotope'){
                    _items.children('*:not(.grid-sizer)').addClass('isotope-item');

                    if(cthis.hasClass('layout-5-cols-15-margin') || cthis.hasClass('layout-5-cols-10-margin')){
                        _items.prepend('<div class="grid-sizer"></div>');
                        //o.settings_isotope_settings.columnWidth = '.grid-sizer';

                        //o.settings_isotope_settings.columnWidth=(cthis.width()/5)
                        //o.settings_isotope_settings.isFitWidth=true;
                    }

                    //console.info(o.settings_isotope_settings);
                    if(o.settings_mode=='isotope'){

                        var args = {};
                        args = $.extend(args, o.settings_isotope_settings);


                        args.transitionDuration = '0s';
                        //console.info(args);

                        _items.isotope(args);

                        setTimeout(function(){
                            args.transitionDuration = '0.3s';
                            //console.info(args);
                            _items.isotope(args);

                            cthis.addClass('dzszfl-ready-for-transitions');
                        },2000);
                    }
                }



                images = _items.children();

                //console.log(arr_cats);
                if(arr_cats.length > 1 && cthis.find('.selector-con').length==0){

                    var aux = '<div class="selector-con"><div class="categories">';
                    aux+='</div></div>';


                    if(o.outer_con_selector_con){

                        _selectorCon=o.outer_con_selector_con;
                    }else{

                        _items.before(aux);
                        _selectorCon = cthis.find('.selector-con').eq(0);
                    }


                    categories_parent = _selectorCon.children('.categories');

                    if(o.settings_useLinksForCategories=='on'){
                        categories_parent.append('<a class="a-category allspark active" href="'+add_query_arg(window.location.href, 'dzsp_defCategory_'+cid, 0)+'">'+ o.settings_categories_strall+'</a>');

                    }else{
                        categories_parent.append('<div class="a-category allspark active">'+ o.settings_categories_strall+'</div>');
                    }

                    for (i = 0; i < arr_cats.length; i++) {
                        categories_parent.append('');

                        if(o.settings_useLinksForCategories=='on'){
                            categories_parent.append('<a class="a-category" href="'+add_query_arg(window.location.href, 'dzsp_defCategory_'+cid, (i+1))+'">'+arr_cats[i]+'</a>');

                        }else{
                            categories_parent.append('<div class="a-category">' + arr_cats[i] + '</div>');
                        }
                    }


                    _selectorCon.removeClass('empty-categories');

                }else{
                    if(o.outer_con_selector_con){

                        _selectorCon=o.outer_con_selector_con;
                        _selectorCon.addClass('empty-categories');
                    }
                }


                cthis.find('.content-opener').unbind('click');
                cthis.find('.content-opener').bind('click', click_contentOpener);
                if(_selectorCon){

                    _selectorCon.undelegate('.a-category', 'click');
                    _selectorCon.delegate('.a-category', 'click', handle_mouse);
                    //_selectorCon.delegate('.a-category.active', 'click', handle_mouse);
                    //_selectorCon.find('.a-category').bind('click', handle_mouse);
                }


                cthis.get(0).api_destroy = destroy;
                cthis.get(0).api_handle_resize = handle_resize;
                cthis.get(0).api_destroy_listeners = destroy_listeners;
                cthis.get(0).api_relayout_isotope = function(){

                    if(inter_relayout_allow){

                        clearTimeout(inter_relayout);
                        inter_relayout = setTimeout(calculate_dims_only_relayout, 500);
                    }

                };

                //console.info('INIT LAZYLOADING');
                if(window.dzs_check_lazyloading_images_inited==false){

                    window.dzs_check_lazyloading_images_inited = true;


                    $(window).bind('scroll',window.dzs_check_lazyloading_images);
                    window.dzs_check_lazyloading_images();
                    setTimeout(function(){
                        window.dzs_check_lazyloading_images();
                    },1500);
                    setTimeout(function(){
                        window.dzs_check_lazyloading_images();
                    },2500);
                }else{
                    if(window.dzs_check_lazyloading_images){
                        window.dzs_check_lazyloading_images();
                        setTimeout(function(){
                            if(window.dzs_check_lazyloading_images) {
                                window.dzs_check_lazyloading_images();
                            }
                        },1000);
                        setTimeout(function(){
                            if(window.dzs_check_lazyloading_images) {
                                window.dzs_check_lazyloading_images();
                            }
                        },2000);
                        setTimeout(function(){
                            if(window.dzs_check_lazyloading_images) {
                                window.dzs_check_lazyloading_images();
                            }
                        },3000);
                    }
                }

                setTimeout(function(){
                    inter_relayout_allow=true;
                },2500)


                handle_resize();
                $(window).bind('resize',handle_resize);


                setTimeout(function(){
                    var args={

                        'parse_items':false
                        ,'relayout_isotope':true
                        ,'disable_easing_on_isotope_transiton':false
                    };
                    //console.info('recalculate relayout isotope on init ... ');
                    calculate_dims(args);
                },2500);

                //console.info(o.settings_add_loaded_on_images);
                if(o.settings_add_loaded_on_images=='on'){

                    loadImage();


                    setTimeout(function(){
                        checkIfLoaded({
                            'force_all_loaded':true
                        });


                    },6700)
                }


                if(o.design_item_height==0){

                    setTimeout(function(){

                        init_allready();
                    },1200);

                }else{


                    setTimeout(function(){
                        init_allready();
                    },1200);
                }

            }

            function init_allready(){

                if(_items.css('opacity')=='0'){

                    _items.animate({
                        opacity:1
                    },{
                        duration: 500
                        ,queue:false
                    })
                }


                cthis.addClass('dzszfl-ready');
            }


            function loadImage(){
                //console.info('loadImage');
                var _t = images.eq(nrLoaded);

                if(1==1){
                    //console.log(_t.attr('data-thumbnail'))
                    var auxImage = new Image();
                    auxImage.src=_t.attr('data-thumbnail');
                    auxImage.onload=handleLoadedImage;
                }else{
                    handleLoadedNonImage();
                }



            }



            function imgLoadedEvent(e){

            }

            function handleLoadedImage(e, pargs){
                var _tar = (e.target);
                //console.log(_tar, $(_tar).css('display'),nrLoaded, images.eq(nrLoaded));


                var margs = {

                };


                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                //console.info(this);

                if(this && this.removeEventListener){
                    this.removeEventListener('load',handleLoadedImage);
                }

                images.eq(nrLoaded).addClass('image-loaded');
                loadedArray[nrLoaded]=true;
                widthArray[nrLoaded] = parseInt(_tar.naturalWidth,10);
                heightArray[nrLoaded] = parseInt(_tar.naturalHeight,10);
                //if(o.design_thumbh == 'proportional'){
                //    arr_thumbhproportionals[nrLoaded] = heightArray[nrLoaded] / widthArray[nrLoaded];
                //    thumbh_dependent_on_w = true;
                //}


                nrLoaded++;
                //console.log("==== CALL FROM IMAGE LOADED / works in chrome yes");
                checkIfLoaded();
            }
            function handleLoadedNonImage(e){
                loadedArray[nrLoaded]=true;
                //console.log(e);
                nrLoaded++;
                //console.log("==== CALL FROM NONIMAGE");
                checkIfLoaded();
            }
            function checkIfLoaded(pargs){
                //nrLoaded++;
                //console.info(nrLoaded,o.settings_preloadall,nr_children);


                var margs = {
                    'force_all_loaded' : false
                };



                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                if(margs.force_all_loaded){
                    nrLoaded = nr_children;
                    images.addClass('image-loaded');
                }

                if(o.settings_preloadall=='on'){
                    if(nrLoaded>=nr_children) {
                        setTimeout(init_allready, 1000);
                    }
                }
                if(o.settings_add_loaded_on_images=='on'){
                    if(nrLoaded>=nr_children) {
                        cthis.addClass('all-images-loaded');
                    }
                }
                if(nrLoaded<nr_children){
                    loadImage();
                }
            }

            function destroy_listeners(){

                cthis.find('.content-opener').unbind('click');
                $(window).unbind('resize',handle_resize);
                destroyed=true;

            }
            function destroy(){

                destroyed=true;

            }

            function handle_mouse(e){
                var _t = $(this);

                if(e.type=='click'){
                    if(_t.hasClass('a-category')){


                        if(_t.hasClass('active')){


                            _selectorCon.toggleClass('is-opened');
                            return false;
                        }

                        var ind = _t.parent().children().index(_t);

                        var cat = _t.html();


                        _selectorCon.removeClass('is-opened');

//                console.info(o.settings_useLinksForCategories, o.settings_useLinksForCategories_enableHistoryApi)

                        if(o.settings_useLinksForCategories=='on' && o.settings_useLinksForCategories_enableHistoryApi=='on' ){

                            var stateObj = { foo: "bar" };
                            history.pushState(stateObj, "ZoomFolio Category "+ind, add_query_arg(window.location.href, 'dzsp_defCategory_'+cid, (ind)));
                        }

                        if(o.settings_useLinksForCategories!='on' || o.settings_useLinksForCategories_enableHistoryApi =='on'){
                            goto_category(cat);
                            return false;
                        }
                    }
                }
            }
            function handle_resize(e,pargs){


                var margs={
                    calculate_dims_init: true
                    ,calculate_excerpt_con: true
                    ,excerpt_con_noanimation: true

                };


                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                ww = $(window).width();
                wh = $(window).height();
                tw = cthis.width();


                // console.info('zfolio', tw);
                if(tw<=520){
                    cthis.addClass('under-520');
                }else{

                    cthis.removeClass('under-520');
                }
                if(tw<=720){
                    cthis.addClass('under-720');

                    if(o.outer_con_selector_con){
                        o.outer_con_selector_con.addClass('under-720');
                    }
                }else{

                    cthis.removeClass('under-720');
                    if(o.outer_con_selector_con){

                        o.outer_con_selector_con.removeClass('under-720');
                    }
                }
                if(tw<=1000){
                    cthis.addClass('under-1000');

                    if(o.outer_con_selector_con){
                        o.outer_con_selector_con.addClass('under-1000');
                    }
                }else{

                    cthis.removeClass('under-1000');
                    if(o.outer_con_selector_con){

                        o.outer_con_selector_con.removeClass('under-1000');
                    }
                }

                if(margs.calculate_excerpt_con){


                    if(_excerptContent_initialPortItem){
                        if(o.excerpt_con_resize_videos=='on'){
                            if(_excerptContent && _excerptContent.find('.vplayer').length>0){

                                var _c = _excerptContent.find('.vplayer').eq(0);
                                var auxr = Number(o.excerpt_con_responsive_ratio);
                                var excerpt_width = _excerptContent.width();

                                if(_c.parent().hasClass('dzs-col-8')){
                                    auxr*=2/3;

                                    if(o.excerpt_con_responsive_ratio==810){
                                        auxr=580;
                                        excerpt_width = 580;


                                        //console.info('window width is ',ww);
                                        if(ww<=1000){
                                            excerpt_width = _excerptContent.width();
                                        }

                                    }

                                }

                                var auxih=0;

                                if(_c.data('initial-height-for-excerpt-content')){
                                    auxih = Number(_c.data('initial-height-for-excerpt-content'));
                                }else{

                                    auxih = _c.height();
                                    _c.data('initial-height-for-excerpt-content',auxih);
                                }




                                var aux_ratio = auxih/auxr;


                                //console.log(auxr);
                                //console.log(auxih,aux_ratio, excerpt_width, excerpt_width * aux_ratio);

                                _c.height(excerpt_width * aux_ratio);

                                //console.info(_c,auxr,auxih);
                            }
                        }
                    }

                    setTimeout(function(){
                        if(_excerptContent_initialPortItem){
                            _tcon_content.css({
                                'padding': _excerptContent.css('padding-top')
                                ,'width': cthis.outerWidth()
                            })




                            var auxh = 0;
                            if(o.excerpt_con_transition=='zoom'){
                                _excerptContentCon.css({
                                    //'height': _tcon_content.outerHeight()
                                });


                                _excerptContent.css({
                                    'height': _tcon_content.outerHeight()
                                });
                            }else{

                                //console.info(_tcon_content, _tcon_content.outerHeight());
                                auxh = _tcon_content.outerHeight();

                                if(margs.excerpt_con_noanimation){

                                    auxh = _excerptContent.children('.dzs-colcontainer').outerHeight();


                                    _excerptContent.css({
                                        'height': auxh
                                    });

                                    var ind = Number(_excerptContent_initialPortItem.attr('data-sort'));

                                    if(ind>0){
                                        //console.info(ind);
                                        _excerptContentCon.attr('data-sort', (ind)+1)
                                    }


                                    _excerptContentCon.css({
                                        'height': ''
                                    });
                                }






                            }

                            //console.info(_excerptContentCon);
                        }

                    },500)

                }


                if(margs.calculate_dims_init){

                    if(inter_calculate_dims){
                        clearTimeout(inter_calculate_dims);
                    }
                    inter_calculate_dims = setTimeout(calculate_dims, 500);
                }
            }

            function calculate_dims(pargs){

                var margs={

                    'parse_items':true
                    ,'relayout_isotope':true
                    ,'disable_easing_on_isotope_transiton':false
                };

                if(pargs){
                    margs = $.extend(margs,pargs);
                }

                //console.info('ceva');


                if(margs.parse_items){

                    i_dzscol_ind = 0;

                    sw_mode_cols_nr_of_cols = 0;

                    $itemsArray = _items.children('.zfolio-item');

                    if(o.settings_mode=='cols') {
                        $itemsArray = _items.find('.dzs-col > .zfolio-item')
                        $itemsArray.sort(sory_by_sort);
                    }

                    $itemsArray.each(function(){


                        var _t = $(this);
                        //console.info(_t);

                        var aux_iw = -1;

                        var aux_tw = cthis.width();

                        if(_items.css('margin-left')=='0px'){
                            aux_tw+=2;
                            _items.css('width', 'calc(100% + 10px)')
                        }
                        if(_items.css('margin-left')=='-1px'){
                            aux_tw+=2;
                            _items.css('width', 'calc(100% + 6px)')
                        }
                        if(_items.css('margin-left')=='-10px'){
                            aux_tw+=20;
                            _items.css('width', 'calc(100% + 26px)')
                        }
                        if(_items.css('margin-left')=='-15px'){
                            aux_tw+=30;
                            _items.css('width', 'calc(100% + 36px)')
                        }


                        if(cthis.hasClass('layout-5-cols-15-margin') || cthis.hasClass('layout-5-cols-10-margin')){



                            //console.info(cthis.width(), _items.css('margin-left'), aux_tw);
                            aux_iw = parseInt((aux_tw) / 5,10);



                            if(cthis.hasClass('layout-5-cols-10-margin')){

                                if(cthis.hasClass('under-1000')){

                                    aux_iw = parseInt((aux_tw) / 3,10);
                                }
                            }

                            if(cthis.hasClass('under-720')){

                                aux_iw = parseInt((aux_tw) / 2,10);
                            }
                            if(cthis.hasClass('under-520')){

                                aux_iw = parseInt((aux_tw),10);
                            }
                        }


                        if(cthis.hasClass('layout-4-cols-15-margin') || cthis.hasClass('layout-4-cols-10-margin')){



                            //console.info(cthis.width(), _items.css('margin-left'), aux_tw);
                            aux_iw = parseInt((aux_tw) / 4,10);




                            if(cthis.hasClass('under-720')){

                                aux_iw = parseInt((aux_tw) / 2,10);
                            }
                            if(cthis.hasClass('under-520')){

                                aux_iw = parseInt((aux_tw),10);
                            }
                        }

                        if(o.settings_mode=='cols') {


                            if (cthis.hasClass('layout-2-cols-10-margin')||cthis.hasClass('layout-2-cols-15-margin')) {


                                if(cthis.hasClass('under-720')){


                                    mode_cols_rearrange_cols(1,_t);

                                }else{
                                    if(mode_cols_nr_of_cols!=2){

                                        if(i_dzscol_ind>=2){
                                            i_dzscol_ind = 0 ;
                                        }


                                        _items.children('.dzs-col').eq(i_dzscol_ind).append(_t);

                                        i_dzscol_ind++;

                                        sw_mode_cols_nr_of_cols = 2;

                                    }

                                }


                            }


                            if (cthis.hasClass('layout-3-cols-10-margin')||cthis.hasClass('layout-3-cols-15-margin')) {


                                if(cthis.hasClass('under-720')){


                                    mode_cols_rearrange_cols(2,_t);

                                }else{
                                    if(mode_cols_nr_of_cols!=3){

                                        if(i_dzscol_ind>=3){
                                            i_dzscol_ind = 0 ;
                                        }


                                        _items.children('.dzs-col').eq(i_dzscol_ind).append(_t);

                                        i_dzscol_ind++;

                                        sw_mode_cols_nr_of_cols = 3;

                                    }

                                }


                            }

                            if (cthis.hasClass('layout-4-cols-10-margin') || cthis.hasClass('layout-4-cols-15-margin')) {


                                if(cthis.hasClass('under-1000')){


                                    if(cthis.hasClass('under-520')){

                                        mode_cols_rearrange_cols(1,_t);
                                    }else{

                                        if(cthis.hasClass('under-720')) {
                                            mode_cols_rearrange_cols(2, _t);
                                        }else{

                                            mode_cols_rearrange_cols(3, _t);
                                        }
                                    }


                                }else{
                                    if(mode_cols_nr_of_cols!=4){

                                        if(i_dzscol_ind>=4){
                                            i_dzscol_ind = 0 ;
                                        }


                                        _items.children('.dzs-col').eq(i_dzscol_ind).append(_t);

                                        i_dzscol_ind++;

                                        sw_mode_cols_nr_of_cols = 4;

                                    }

                                }


                            }

                            if (cthis.hasClass('layout-5-cols-10-margin') || cthis.hasClass('layout-5-cols-15-margin')) {


                                if(cthis.hasClass('under-1000')){

                                    if(cthis.hasClass('under-720')){

                                        mode_cols_rearrange_cols(2,_t);
                                    }else{

                                        mode_cols_rearrange_cols(3,_t);
                                    }
                                }else{
                                    if(mode_cols_nr_of_cols!=5){

                                        if(i_dzscol_ind>=5){
                                            i_dzscol_ind = 0 ;
                                        }


                                        _items.children('.dzs-col').eq(i_dzscol_ind).append(_t);

                                        i_dzscol_ind++;

                                        sw_mode_cols_nr_of_cols = 5;

                                    }

                                }


                            }
                        }



                        _t.css('width','');

                        if(o.settings_set_forced_width=='on'){
                            _t.outerWidth(aux_iw);

                        }

                        if(design_item_thumb_height_dynamic){

                            //console.log(cthis, cthis.width());
                            if(design_item_thumb_height<=1){

                                //console.info(aux_iw, layout_margin);

                                if(aux_iw%2 == 1 ) { aux_iw++; };
                                if(aux_iw>0){
                                    _t.outerWidth(aux_iw);
                                }
                                if(_t.hasClass('layout-wide') || _t.hasClass('layout-big')){
                                    //console.info('big/wide', aux_iw, _t.width());
                                    if(cthis.hasClass('under-720')==false) {
                                        _t.outerWidth(aux_iw * 2);
                                    }
                                    //_t.width(1);


                                    //console.info((aux_iw*2)+'px')
                                    //_t.css('width', (aux_iw*2)+'px');
                                    //console.info('big/wide', aux_iw, _t.width());
                                }

                                if(_t.width()<300){
                                    _t.addClass('under-300');
                                }else{

                                    _t.removeClass('under-300');
                                }

                                //console.info(aux_iw);

                                // console.info(_t.width(),_t.outerWidth(),_t.outerWidth(false));
                                _t.find('.the-feature-con').eq(0).height(design_item_thumb_height* _t.width());
                                // console.info(_t.outerWidth(),_t.outerHeight(), design_item_thumb_height)


                                if(_t.hasClass('layout-big')){

                                    if(cthis.hasClass('under-720')==false) {
                                        // _t.find('.the-feature-con').eq(0).height(design_item_thumb_height* _t.width());
                                        _t.find('.the-feature-con').eq(0).height(design_item_thumb_height* _t.width() );
                                    }
                                }



                                if(_t.hasClass('layout-tall')){

                                    //console.info(design_item_thumb_height* _t.width(), _t.width()*2)
                                    // _t.find('.the-feature-con').eq(0).height((2 * _t.width()) + (layout_margin));
                                    console.info(design_item_thumb_height, layout_margin);
                                    _t.find('.the-feature-con').eq(0).height(design_item_thumb_height* ((_t.width())*2)  +layout_margin);
                                }
                                if(_t.hasClass('layout-wide')){

                                    if(cthis.hasClass('under-720')==false) {
                                        _t.find('.the-feature-con').eq(0).height( parseInt(0.5* _t.width(), 10) - (layout_margin*0));
                                    }
                                }
                            }
                        }else{
                            //console.info(design_item_thumb_height);
                        }
                    })

                    if(sw_mode_cols_nr_of_cols){
                        mode_cols_nr_of_cols = sw_mode_cols_nr_of_cols;
                    }
                }

                ;


                if(margs.relayout_isotope){

                    if(margs.disable_easing_on_isotope_transiton){

                        var args = {};
                        args = $.extend(args, o.settings_isotope_settings);

                        args.transitionDuration = '0s';
                        //console.info(args);

                        _items.isotope(args);

                        setTimeout(function(){
                            //args.transitionDuration = '0.3s';
                            ////console.info(args);
                            //_items.isotope(args);

                        },500);
                    }else{

                        if(o.settings_mode=='isotope'){
                            //console.info('fromhere',_items);
                            if(_items && !destroyed){


                                _items.isotope('layout');
                            }
                        }

                    }

                    setTimeout(function(){
                        if(o.settings_mode=='isotope'){
                            if(_items && !destroyed) {
                                _items.isotope('layout');
                            }
                        }
                    },500);
                }

                if(window.dzs_check_lazyloading_images){
                    window.dzs_check_lazyloading_images();
                }
            }

            function calculate_dims_only_relayout(){

                var args = {

                    'parse_items':false
                    ,'relayout_isotope':true
                    ,'disable_easing_on_isotope_transiton':false
                };

                calculate_dims(args);
            }

            function mode_cols_rearrange_cols(arg, _argt){
                //console.info('mode_cols_rearrange_cols()', arg);

                var delay_time = Number(_argt.attr('data-sort'));
                //console.info(delay_time);
                setTimeout(function(){
                    // -- no need for delay time .. but maybe one time..
                },delay_time);



                if(mode_cols_nr_of_cols!=arg){


                    var sel_col = 0;

                    if(i_dzscol_ind>=arg){
                        i_dzscol_ind = 0 ;

                        //_items.children('.dzs-col').data('');
                    }



                    var min_col_ind = 0;
                    var min_col_height = 1000000;

                    _argt.css({
                        'height':'0px'
                    })

                    for(i=0;i<arg;i++){
                        if(_items.children('.dzs-col').eq(i).height() < min_col_height){
                            min_col_height = _items.children('.dzs-col').eq(i).height();
                            min_col_ind = i;
                        }


                    }

                    //console.info(_items.children('.dzs-col').eq(0).height(),_items.children('.dzs-col').eq(1).height(),_items.children('.dzs-col').eq(2).height())

                    //console.info(min_col_height, min_col_ind);




                    _items.children('.dzs-col').eq(min_col_ind).append(_argt);

                    i_dzscol_ind++;


                    _argt.css({
                        'height':''
                    })


                    sw_mode_cols_nr_of_cols = arg;

                }

            }


            function goto_category(arg){

                var options = {};
                var key = "filter";
                //console.log(arg);
                var value = '.cat-' + arg;
                if (!arg || arg == o.settings_categories_strall) {
                    value = "*";
                }
                if(categories_parent!=undefined){
                    categories_parent.children().removeClass('active');



                    categories_parent.children().each(function(){
                        var _t = $(this);
                        //console.info(_t);
                        if(_t.text()==arg){
                            _t.addClass('active');
                        }
                    })
                }

                value = value === "false" ? false : value;

                value = value.replace(/ /gi, '-');

//                console.log(key, value);
                if(o.settings_mode=='isotope'){
                    o.settings_isotope_settings[ key ] = value;
                    _items.isotope(o.settings_isotope_settings);
                }
                if(o.settings_mode=='simple'){
                    _items.children().fadeOut('fast');
                    _items.children(value).fadeIn('fast');
                }

                if($('.main-container').get(0) && $('.main-container').get(0).api_get_view_index_y) {
                    //console.log($('.main-container').get(0).api_get_view_index_y())
                }


            }

            function click_contentOpener(e){
                var _t = $(this);
                var ind = -1;
                _excerptContent_initialPortItem = null;

                //--trial and error
                if(_t.parent().hasClass('zfolio-item')){
                    _excerptContent_initialPortItem = _t.parent();
                }else{
                    if(_t.parent().parent().hasClass('zfolio-item')){
                        _excerptContent_initialPortItem = _t.parent().parent();
                    }else{
                        if(_t.parent().parent().parent().hasClass('zfolio-item')){
                            _excerptContent_initialPortItem = _t.parent().parent().parent();
                        }else{
                            if(_t.parent().parent().parent().parent().hasClass('zfolio-item')){
                                _excerptContent_initialPortItem = _t.parent().parent().parent().parent();
                            }
                        }
                    }
                }

                //console.info(_excerptContent_initialPortItem);
                //--no point in continuing if tcon is not found


                if(_excerptContent_initialPortItem==null ){
                    return false;
                }
                if(_excerptContent_initialPortItem.hasClass('active')){
                    contentOpener_close();
                    return false;
                }else{
                    if(_excerptContentCon){
                        contentOpener_close();
                        _excerptContent_initialPortItem.parent().children().removeClass('active');
                        setTimeout(function(){
                            _t.click();
                        },750)
                        return false;
                    }
                }


                var tcon_y = _excerptContent_initialPortItem.offset().top;

                var sw=false;
                var _tcon_next = null;

                while(sw==false){
                    if(_tcon_next){
                        _tcon_next = _tcon_next.next();;
                    }else{
                        _tcon_next = _excerptContent_initialPortItem.next();
                    }

//                    console.info(_tcon_next);

                    if(_tcon_next.hasClass('zfolio-item')){

                        if(_tcon_next.offset().top!=tcon_y){
                            sw=true;
                            ind = _tcon_next.parent().children('.isotope-item').index(_tcon_next);
                        }

                    }else{
                        sw=true;
                    }
                }

                //console.info();

                var excerptContent_extraClasses = '';
                var portclass = _excerptContent_initialPortItem.attr('class');
                portclass+=' ';

                //console.log(portclass);

                var aux_regex = /cat-\w+/gi;
                var aux_regex_a;
                while(aux_regex_a = aux_regex.exec(portclass)){
                    if(aux_regex_a){
                        excerptContent_extraClasses+=' '+aux_regex_a[0];
                    }

                }



                _tcon_content = _excerptContent_initialPortItem.find('.the-content');

                var aux = '<div class="isotope-item excerpt-content-con'+excerptContent_extraClasses+' transition-'+ o.excerpt_con_transition+' "><div class="'+_tcon_content.attr('class')+'" style="">'+_tcon_content.html()+'<div class="close-btn">x</div></div></div>';


                if(_tcon_next.length>0){
                    //--- even if the-content div is display: none, the height can still be calculated
//                    console.info(_tcon, _tcon_content.outerHeight());


                    _tcon_next.before(aux);

                }else{
                    _items.append(aux);
                }

                _excerptContentCon = cthis.find('.excerpt-content-con').eq(0);
                _excerptContent = _excerptContentCon.find('.excerpt-content').eq(0);

                //console.info(_excerptContent.find('.advancedscroller').length);


//console.info(_excerptContentCon,_excerptContent);

//                console.info(_tcon_content, _excerptContent.css('padding'), _excerptContent, _excerptContent_initialPortItem.offset().left, cthis.offset().left, _excerptContent_initialPortItem.outerWidth()/2);


                window.dzszfl_execute_target = _excerptContent;



                //console.info(_excerptContent,_excerptContent.find('.toexecute'));
                _excerptContent.find('.toexecute').each(function(){
                    var _t2 = $(this);
                    if(_t2.hasClass('executed')==false){
                        eval(_t2.text());
                        _t2.addClass('executed');
                    }
                });

                if(_excerptContent.find('.advancedscroller').length==0){
                    actually_open_it();
                }else{

                    //console.info(_excerptContent.find('.advancedscroller').eq(0).hasClass('loaded'));

                    var inter_aux = setInterval(function(){

                        //console.info(_excerptContent.find('.advancedscroller').eq(0).hasClass('loaded'));

                        if(_excerptContent.find('.advancedscroller').eq(0).hasClass('loaded')){
                            actually_open_it();
                            clearInterval(inter_aux);
                        }
                    },100)
                }


                function actually_open_it(){
                    var args={
                        calculate_dims_init: false
                        ,calculate_excerpt_con: true
                        ,excerpt_con_noanimation: false

                    };

                    //handle_resize(null,args);


                    _excerptContent.css({
                        'height': 0
                    });


                    var delaytime = 100;
                    if(o.excerpt_con_transition=='wipe') {
                        delaytime=100;
                    }
                    setTimeout(function(){
//                    return;

                        if(_excerptContent.find('.advancedscroller').length>0){

                            //console.info('CALL RESIZE');
                            _excerptContent.find('.advancedscroller').each(function(){
                                var _t = $(this);
                                //console.info(_t);

                                if(_t.get(0) && _t.get(0).api_force_resize){
                                    var args ={

                                    };

                                    if(_t.attr('data-defaultheight')){

                                        args.calculate_auto_height_default_h = Number(_t.attr('data-defaultheight'));
                                    }
                                    _t.get(0).api_force_resize(null, args);
                                }
                            })
                        }

                        //console.info(_excerptContent.children('.dzs-colcontainer').outerHeight());

                        var auxh = _excerptContent.children('.dzs-colcontainer').outerHeight();
                        if(_tcon_content.hasClass('skin-qcre')){

                            _excerptContent.css({
                                'height': auxh
                            });
                            _excerptContentCon.css({
                                'height': auxh
                            });

                            if(o.excerpt_con_transition=='zoom'){
                                _excerptContentCon.css({
                                    'height': auxh
                                });


                                _excerptContent.css({
                                    'height': auxh
                                });
                            }else{


                                _excerptContentCon.css({
                                    'height': auxh
                                });


                                _excerptContent.css({
                                    'height': auxh
                                });

                                setTimeout(function(){

                                    //_excerptContent.animate({
                                    //    'height': auxh
                                    //},{
                                    //    duration: 500
                                    //    ,queue:false
                                    //});


                                    if($('.scroller-con.type-scrollTop').get(0) && $('.scroller-con.type-scrollTop').get(0).api_scrolly_to){

                                        var aux = _excerptContent.offset().top-100;
                                        $('.scroller-con.type-scrollTop').get(0).api_scrolly_to(aux);
                                    }


                                },700)

                            }




                        }else{

                            _excerptContent.css({
                                'height':  _excerptContent.children('.dzs-colcontainer').outerHeight() + 40 * 2
                            });
                            _excerptContentCon.css({
                                'height':  _excerptContent.children('.dzs-colcontainer').outerHeight() + 40 * 2
                            });
                        }

                        var delaytime2 = 500;


                        if(_excerptContent.find('.advancedscroller').length>0){
                            //delaytime2 = 1500;
                        }

                        setTimeout(function(){
                            //console.log('placed');

                            _excerptContentCon.addClass('placed');


                            //_excerptContentCon.css({
                            //    'height':  ''
                            //});
                        },delaytime2);


                    },delaytime);

                    setTimeout(function(){

                        var args={
                            calculate_dims_init: true
                            ,calculate_excerpt_con: true

                        };

                        handle_resize(null,args);
                    },1000);
//                console.info(_excerptContent.outerHeight());

                    _excerptContent.prepend('<style>#'+cid+'.dzsportfolio .excerpt-content:before{ left:'+(_excerptContent_initialPortItem.offset().left - cthis.offset().left + _excerptContent_initialPortItem.outerWidth()/2 -8)+'px; }</style>')

                    _excerptContent_initialPortItem.addClass('active');


                    _excerptContent.find('.vplayer-tobe.auto-init-from-q').each(function(){
                        var _t2 = $(this);

                        if(window.dzsvp_init){

                            var args = {
                                settings_youtube_usecustomskin:"off"
                                ,init_each:true
                                ,controls_out_opacity: "1"
                                ,controls_normal_opacity: "1"
                                ,cueVideo: "off"
                            };


                            if(window.qcreative_options.video_player_settings){
                                args= $.extend(args, window.qcreative_options.video_player_settings);
                            }

                            //console.info(window.qcreative_options,args);
                            //console.info(args);

                            window.dzsvp_init(_t2,args)
                        }
                    })
                    //return false;

                    _excerptContent.find('.close-btn').bind('click', contentOpener_close);






                    if (o.settings_mode=='isotope' && $.fn.isotope != undefined) {
                        //isotope_settings.sortBy = 'name';
//                        ===== we let a little time for the items to settle their widths
//                    console.log(_items);
                        //_items.isotope(o.isotope_settings );
                        //console.info('isotope relayout');
                        //_theitems.isotope('layout');

                        delaytime = 300;
                        if(o.excerpt_con_transition=='wipe') {
                            delaytime=101;
                        }
                        //console.info(ind);
                        setTimeout(function(){
                            //_items.isotope(o.settings_isotope_settings).isotope('layout');
                            //_items.isotope('reloadItems').isotope('layout');
                            //_items.layoutItems(_excerptContentCon);
                            if(ind>0){
                                //console.info(ind);
                                _excerptContentCon.attr('data-sort', ((ind)*10)+1)
                            }else{

                                _excerptContentCon.attr('data-sort', 10000)
                            }
                            _items.isotope('insert',_excerptContentCon);

                            //_items.children().eq(ind).before(_excerptContentCon);
                            _items.isotope('layout');
                            //_theitems.isotope('layo ut');

                        }, delaytime);


                    }
//                console.info(_tcon, _tcon_next);

                    delaytime = 700;
                    if(o.excerpt_con_transition=='wipe') {
                        delaytime=100;
                    }

                    setTimeout(function(){
                        _excerptContent.addClass('placed');
                    }, delaytime);

                    setTimeout(function(){

                        // -- scroller resize
                        if($('.main-container').eq(0).get(0) && $('.main-container').eq(0).get(0).api_toggle_resize){
                            $('.main-container').eq(0).get(0).api_toggle_resize();
                        }
                    },300);
                }



                return false;
            }
            function contentOpener_close(){

//                console.info(_excerptContentCon);
                if(_excerptContentCon || _excerptContent){
                    _excerptContent.removeClass('placed');
                    _excerptContent_initialPortItem.removeClass('active');

                    if(o.excerpt_con_transition=='wipe'){

                        setTimeout(function(){

                            _excerptContentCon.css({
                                'height':0
                                ,'margin-bottom': 0
                            });

                            _items.isotope('layout');
                        },100)


                        _excerptContent.animate({
                            'height': 0
                        },{
                            duration: 400
                            ,queue:false
                        });

                    }

                    var delaytime = 700;

                    if(o.excerpt_con_transition=='wipe'){
                        delaytime=400;
                    }

                    setTimeout(function(){

                        if (o.settings_mode=='isotope' && $.fn.isotope != undefined) {

                            _items.isotope('remove',_excerptContentCon);
                        }

                        if(_excerptContentCon){

                            _excerptContentCon.remove();
                            _excerptContentCon = null;
                        }
                        _excerptContent_initialPortItem = null
                        _excerptContent = null;

                        handle_resize();
                    }, delaytime);
                }


                setTimeout(function(){

                    if($('.main-container').eq(0).get(0) && $('.main-container').eq(0).get(0).api_toggle_resize){
                        $('.main-container').eq(0).get(0).api_toggle_resize();
                    }
                },300);
            }




            return this;
        })
    }

    window.dzszfl_init = function(selector, settings) {
        if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
            var element_count = 0;
            for (var e in settings) { element_count++; }
            if(element_count==1){
                settings = undefined;
            }

            $(selector).each(function(){
                var _t = $(this);
                _t.zfolio(settings)
            });
        }else{
            $(selector).zfolio(settings);
        }
    };
})(jQuery);



jQuery(document).ready(function($){

    dzszfl_init('.zfolio.auto-init', {init_each: true});

});

function scrollableElement(els) {
    for (var i = 0, argLength = arguments.length; i < argLength; i++) {
        var el = arguments[i],
            $scrollElement = jQuery(el);
        if ($scrollElement.scrollTop() > 0) {
            return el;
        } else {
            $scrollElement.scrollTop(1);
            var isScrollable = $scrollElement.scrollTop() > 0;
            $scrollElement.scrollTop(0);
            if (isScrollable) {
                return el;
            }
        }
    }
    return [];
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

function is_touch_device() {
    return !!('ontouchstart' in window);
}



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


jQuery.fn.textWidth = function(){
    var _t = jQuery(this);
    var html_org = _t.html();
    if(_t[0].nodeName=='INPUT'){
        html_org = _t.val();
    }
    var html_calcS = '<span>' + html_org + '</span>';
    jQuery('body').append(html_calcS);
    var _lastspan = jQuery('span').last();
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




function can_history_api() {
    return !!(window.history && history.pushState);
}

function is_ios() {
    return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1)
    );
}

function is_android() {
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