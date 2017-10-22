
var dzstlt_arr_tooltips = [];

(function($) {



    $.fn.dzstooltip = function(o) {

        var defaults = {
            settings_slideshowTime : '5' //in seconds
            , settings_autoHeight : 'on'
            , settings_skin : 'skin-default'
            ,settings_close_other_tooltips: 'off'
            ,settings_disable_include_in_tt_array: 'off'
            ,settings_show_active_in_parent: 'off'
        }

        o = $.extend(defaults, o);
        this.each( function(){
            var cthis = $(this)
                ,cchildren = cthis.children()
                ,cclass = '';
            ;
            var aux
                ,auxa
                ,auxb
                ;
            var ww = 0 // -- window width
                ,wh = 0 // -- window width
                ,st = 0 // -- scrolltop
                ,cthis_ot = 0 // -- offset top
                ;

            var _tooltip = $(this).find('.dzstooltip').eq(0);
            var currNr=-1;

            var original_align = '';
//            console.info(cthis);


            if(cthis.hasClass("dzstooltip")){
                _tooltip = cthis;
            }
            cclass = _tooltip.attr('class');


            if(o.settings_disable_include_in_tt_array!='on'){
                dzstlt_arr_tooltips.push(_tooltip);
            }

            //console.info(_tooltip);






            init();

            function init(){


                var reg_align = new RegExp('align-(?:\\w*)',"g");
                var reg_arrow = new RegExp('arrow-(?:\\w*)',"g");
                auxa = reg_align.exec(cclass);
                aux = '';

                //if(_tooltip.hasClass('debug-target')){ console.log(auxa); }

                if(auxa && auxa[0]){
                    aux = auxa[0]
                }else{
                    aux = 'align-left';
                }

                //cthis.data('original-align', aux);
                _tooltip.data('original-align', aux);
                original_align = aux;

                //console.log(cthis,original_align);
                $('body').addClass('js');




                auxa = reg_arrow.exec(cclass);
                aux = '';

                //console.log(auxa);


                if(auxa && auxa[0]){
                    aux = auxa[0]
                }else{
                    aux = 'arrow-top';
                }

                //cthis.data('original-arrow', aux);
                _tooltip.data('original-arrow', aux);

                //console.log(_tooltip.data('original-arrow'));

                //console.info(cthis.hasClass("for-click"));

                cthis.get(0).api_handle_resize = handle_resize;

                if(cthis.hasClass('for-click')){
                    cthis.on('click', click_cthis);
                }else{

                    if(o.settings_show_active_in_parent==='on'){
                        cthis.on('mouseover',handle_mouse);
                        cthis.on('mouseleave',handle_mouse);
                    };
                }

                $(window).on('resize', handle_resize);
                $(window).on('scroll', handle_scroll);
                handle_resize();
                handle_scroll();

                setTimeout(handle_resize, 1000);
                setTimeout(handle_resize, 2000);
            }

            function handle_scroll(e){

                st = $(window).scrollTop();
                cthis_ot = cthis.offset().top;

                calculate_dims({
                    call_from: 'handle_scroll'
                });

            }

            function handle_mouse(e){

                var _t = $(this);
                //console.info(e.type);
                if(e.type=='mouseover'){

                    if(o.settings_show_active_in_parent==='on'){
                        console.info(cthis);
                        cthis.addClass('tooltip-is-active');
                    }
                }
                if(e.type=='mouseleave'){

                    if(o.settings_show_active_in_parent==='on'){
                        cthis.removeClass('tooltip-is-active');
                    }

                }
            }


            function calculate_dims(pargs){


                var margs = {
                    call_from: 'default'
                };


                if(pargs){
                    margs = $.extend(margs,pargs);
                }
                console.log('calculate_dims()', margs);

                var isfullwidth = false;

                //(_tooltip.data('original-arrow')!='arrow-left' && _tooltip.data('original-arrow')!='arrow-right') &&
                //if(_tooltip.hasClass('debug-target')){ console.info(_tooltip.hasClass('arrow-top') || _tooltip.hasClass('arrow-bottom')) };


                if(  _tooltip.hasClass('arrow-top') || _tooltip.hasClass('arrow-bottom')){
                    _tooltip.removeClass('align-right');
                    _tooltip.addClass(_tooltip.data('original-align'));
                    if(_tooltip.data('original-align')=='align-left' || _tooltip.data('original-align')=='align-center'){
//                    console.info(cthis, _tooltip, _tooltip.offset().left, _tooltip.outerWidth(), ww)

                        if(ww<500){

                        }else{


                            if(_tooltip.offset().left + _tooltip.outerWidth() > ww - 50){
                                _tooltip.removeClass(_tooltip.data('original-align'));
                                _tooltip.addClass('align-right');
                            }else{
                                if(_tooltip.hasClass('align-right')){
                                    _tooltip.removeClass('align-right');
                                    _tooltip.addClass(_tooltip.data('original-align'));
                                }
                            }

                        }
                    }

                    if(_tooltip.hasClass('align-right')){

                    }
                }else{

                    _tooltip.removeClass('arrow-right');
                    _tooltip.addClass(_tooltip.data('original-arrow'));

                    //if(_tooltip.hasClass('debug-target')){ console.log(_tooltip.data('original-arrow')); };

                    if(!_tooltip.data('original-width')){
                        _tooltip.data('original-width', _tooltip.outerWidth());
                        //if(_tooltip.hasClass('debug-target')){ _tooltip.data('original-width') };
                    }else{
                        _tooltip.outerWidth(_tooltip.data('original-width'));
                    }


                    if(!_tooltip.data('has-no-arrow')){
                        _tooltip.data('has-no-arrow', _tooltip.hasClass('no-arrow'));
                    }

                    //if(_tooltip.hasClass('debug-target')){ console.info(_tooltip.data('has-no-arrow'))}


                    //_tooltip.addClass(_tooltip.data('original-align'));
                    if(_tooltip.hasClass('arrow-left')){




                        //if(_tooltip.hasClass('debug-target')){ console.info(_tooltip.hasClass('arrow-left'), _tooltip.offset().left + _tooltip.outerWidth() > ww - 30) };

                        if(_tooltip.offset().left + _tooltip.outerWidth() > ww - 30){
                            _tooltip.removeClass(_tooltip.data('original-arrow'));
                            _tooltip.addClass('arrow-right');


                            if(_tooltip.offset().left - Number(_tooltip.data('original-width')) < 20){

                                //if(_tooltip.hasClass('debug-target')){ console.info(_tooltip.data('original-width'), (_tooltip.offset().left - Number(_tooltip.data('original-width'))  ) , Number(_tooltip.data('original-width')) + (Number(_tooltip.data('original-width'))+(_tooltip.offset().left - Number(_tooltip.data('original-width')) ) - 30 ) ) };

                                var aux_w = Number(_tooltip.data('original-width')) + (Number(_tooltip.data('original-width'))+(_tooltip.offset().left - Number(_tooltip.data('original-width')) ) - 30 );

                                _tooltip.outerWidth(aux_w);

                                if(aux_w < 100){

                                    _tooltip.addClass(_tooltip.data('original-arrow'));
                                    _tooltip.removeClass('arrow-right');

                                    aux_w = ww - 100;
                                    _tooltip.outerWidth(aux_w);
                                }




                                //_tooltip.removeClass('arrow-right');
                                //_tooltip.addClass('arrow-top');

                            }
                        }


                        //console.info(_tooltip.data('original-arrow'))
                        //_tooltip.removeClass('align-right');
                    }
                }


                if(_tooltip.hasClass('align-center')){
                    //console.info(cthis, cthis.hasClass('arrow-left'));
                    if(_tooltip.hasClass('arrow-left') || _tooltip.hasClass('arrow-right')){
                        _tooltip.css('margin-top', -(_tooltip.outerHeight()/2) + ( cthis.outerHeight()/2))
                        _tooltip.css('margin-left', '');

                    }else{

                        _tooltip.css('margin-left', -(_tooltip.outerWidth()/2) + ( cthis.outerWidth()/2))
                        _tooltip.css('margin-top', '');
                    }



                }
                if(ww<500){

                    _tooltip.css('margin-left', '');
                    _tooltip.css('width', '');
                    _tooltip.css('margin-top', '');
                    var aux = cthis_ot - st - _tooltip.height() - 50;

                    if(aux<0){
                        aux = cthis_ot - st + _tooltip.parent().height() ;
                    }

                    _tooltip.css('top', aux);
                    _tooltip.addClass('no-arrow');
                }else{
                    if(_tooltip.data('original-arrow')){

                        _tooltip.removeClass('no-arrow');
                        _tooltip.css('top', '');
                        _tooltip.addClass(_tooltip.data('original-arrow'));

                        _tooltip.data('original-arrow','');
                    }
                    _tooltip.css('top', '');
                }

                if(original_align=='align-top'){


                    cthis.addClass(original_align);
                    cthis.removeClass('align-bottom');
                    //console.info(cthis.offset().top + _tooltip.outerHeight(),wh);

                    if(cthis.offset().top + _tooltip.outerHeight()>wh){
                        cthis.removeClass(original_align);
                        cthis.addClass('align-bottom');
                        //console.info(cthis);
                    }else{

                        cthis.addClass(original_align);
                        cthis.removeClass('align-bottom');
                    }
                }

            }

            function handle_resize(e,pargs){
                ww=$(window).width();
                wh=$(window).height();
                calculate_dims();
            }

            function click_cthis(e){

                var _c = cthis.find('.dzstooltip');
                if(_tooltip.hasClass('active')){
                    _tooltip.removeClass('active');


                    if(o.settings_show_active_in_parent==='on'){
                        cthis.removeClass('tooltip-is-active');
                    }

                }else{


                    if(o.settings_close_other_tooltips=='on'){
                        for(i3=0;i3<dzstlt_arr_tooltips.length;i3++){
                            if(dzstlt_arr_tooltips[i3]){
                                dzstlt_arr_tooltips[i3].removeClass('active');
                            }
                        }
                    }

                    _c.addClass('active');


                    if(o.settings_show_active_in_parent==='on'){
                        cthis.addClass('tooltip-is-active');
                    }


                    if(parseInt(cthis.offset().left, 10) + _c.width() > parseInt($(window).width(), 10) - 50){
                        _c.addClass('align-right');
                    }else{
                        _c.removeClass('align-right');
                    }




                }

                //console.info(cthis.offset().left);




            }
            return this;
        })
    }


    window.dzstt_init = function(arg, optargs){
        $(arg).dzstooltip(optargs);
    }
})(jQuery);



if(typeof jQuery!='undefined'){
    jQuery(document).ready(function($){
        var defsettings = {};

        if(window.dzstlt_init_settings){
            defsettings = window.dzstlt_init_settings;
        }
        dzstt_init('.dzstooltip-con.js',defsettings);
    })
}else{
    alert('dzstooltip.js - this plugin is based on jQuery -> please include jQuery')
}