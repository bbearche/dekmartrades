// ==DZS Advanced Tabs==
// @version 1.21 /// iMac version 1.22 remember to compare
// @this is not free software
// == DZS Advanced Tabs == copyright == http://digitalzoomstudio.net


if(window.jQuery==undefined){
    alert("dzstabs.js -> jQuery is not defined or improperly declared ( must be included at the start of the head tag ), you need jQuery for this plugin");
}
jQuery.fn.outerHTML = function(e) {
    return e
        ? this.before(e).remove()
        : jQuery("<p>").append(this.eq(0).clone()).html();
};

function is_ios() {
    //return true;
    return ((navigator.platform.indexOf("iPhone") != -1) || (navigator.platform.indexOf("iPod") != -1) || (navigator.platform.indexOf("iPad") != -1 || (navigator.userAgent.indexOf("Android") != -1)));

    //if (window.Touch){    return true;    }    else {    return false;    }

}

var settings_dzstabs = { animation_time: 300, animation_easing:'easeOutCirc' };
(function($) {
    $.fn.dzstabs = function(o) {

        //==default options
        var defaults = {
            settings_slideshowTime : '5' //in seconds
            , settings_autoHeight : 'on'
            , settings_contentHeight : '0'//set the fixed tab height
            , settings_startTab : '0'//==the start tab
            , design_skin : 'skin-default'
            , design_transition : 'default'
            , design_tabsstyle : 'static'
            , design_tabsposition : 'top'
            , design_tabswidth : 'auto'
            , design_tabsmenuwidth : 'auto'//=== for tabsposition left or right
            , design_enable_iphonesize : 'off'
            , design_maxwidth : '4000'
            ,settings_makeFunctional: false
        };

        o = $.extend(defaults, o);
        this.each( function(){
            var cthis = jQuery(this)
            var cclass = '';
            var cthisId = cthis.attr('id');
            var cchildren = cthis.children();
            var nrChildren = cchildren.length;
            var currNr=-1
                ,currNrEx=-1
                ;
            var mem_children = [];
            var _menu
                ,_content_inner
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
            var busy=true;
            var handled = false;//describes if all loaded function has been called

            //console.log(o);

            o.settings_startTab = parseInt(o.settings_startTab, 10);

            init();
            function init(){
                if(typeof(cthis.attr('class')) == 'string'){
                    cclass = cthis.attr('class');
                }else{
                    cclass=cthis.get(0).className;
                }
                //console.log(cclass);

                if(cclass.indexOf('skin-')==-1){
                    cthis.addClass(o.design_skin);
                }
                _c = 'skin-dome';
                if(cthis.hasClass(_c)){
                    o.design_skin = _c;
                }
                _c = 'skin-arrowbox';
                if(cthis.hasClass(_c)){
                    o.design_skin = _c;
                }
                o.settings_contentHeight = parseInt(o.settings_contentHeight, 10);
                if(o.settings_contentHeight!=0){
                    o.settings_autoHeight = 'off';
                }

                if(o.design_skin == 'skin-dome' && o.design_transition == 'default'){
                    o.design_transition = 'fullslide';
                }
                if(o.design_skin == 'skin-arrowbox' && o.design_transition == 'default'){
                    o.design_transition = 'fade';
                }
                if(o.design_skin == 'default'){
                    o.design_transition = 'slide';
                }
                if(o.design_transition == 'default'){
                    o.design_transition = 'slide';
                }
                if(jQuery.easing.easeInBack==undefined){
                    settings_dzstabs.animation_easing = 'swing';
                }
                if(is_ios()){
                    //alert(navigator.userAgent);
                    cthis.addClass('touch');
                }
                //console.log(cthis);

                for(i=0;i<nrChildren;i++){
                    mem_children[i] = cthis.children('.dzs-tab-tobe').eq(i);
                    //cthis.children('.dzs-tab-tobe').eq(0).remove();
                }
                cthis.addClass('tabs-'+ o.design_tabsposition);
                cthis.append('<div class="tabs-menu"></div>');
                cthis.append('<div class="tabs-content"><div class="content-inner"></div></div>');

                if((o.design_tabsposition=='left' || o.design_tabsposition=='right') && o.design_tabsmenuwidth !='auto'){
                    cthis.find('.tabs-menu').eq(0).css({
                        'width' : o.design_tabsmenuwidth
                    })
                }

                _menu = cthis.children('.tabs-menu');
                _content_inner = cthis.children('.tabs-content').children('.content-inner');
                if(o.settings_contentHeight != 0){
                    cthis.children('.tabs-content').height(o.settings_contentHeight);
                }
                //console.log(_menu);

                for(i=0;i<nrChildren;i++){
                    _menu.append(mem_children[i].children('.tab-menu').outerHTML());
                    //_menu.children().last().atrr('id', );
                    _menu.children().last().addClass(cthisId + '-tabmenu-' + i);
                    if(o.design_tabswidth!='auto'){
                        _menu.children().last().css({
                            'width' : o.design_tabswidth
                        });
                    }
                }
                for(i=0;i<nrChildren;i++){
                    _content_inner.append(mem_children[i].children('.tab-content'));
                    _content_inner.children().last().hide();
                }

                items = _content_inner.children();

                //gotoItem(0);



                if(cthis.find('.needs-loading').length>0){
                    cthis.find('.needs-loading').each(function(){
                        var _t = jQuery(this);

                        toload = _t.find('img').eq(0).get(0);

                        if(toload==undefined){
                            loadedImage();
                        }else{
                            if(toload.complete==true && toload.naturalWidth != 0){
                                loadedImage();
                            }else{
                                jQuery(toload).bind('load', loadedImage);
                            }
                        }
                    });
                }else{
                    handleLoaded();
                }

            }
            function loadedImage(){
                handleLoaded();
            }
            function handleLoaded(){
                if(handled==true){
                    return;
                }
                handled=true;



                //console.log('ceva');
                _menu.children().bind('click',handle_menuclick);
                //document.addEventListener("orientationChanged", updateOrientation); 
                $(window).resize(handleResize)
                handleResize();


                gotoItem(o.settings_startTab);

            }
            function updateOrientation(){
                //console.log('ceva');
            }
            function handleResize(){
                ww = $(window).width();
                tw = cthis.width();
                _carg = _content_inner.children().eq(currNr);



                var aux = currNr;
                if(aux==-1){ aux=0; };
                //console.log(ww, targeth);
                //console.log(ww, targeth);
                //console.log(o.design_maxwidth, tw);

                //console.info(tw);
                if(tw<361){
                    cthis.addClass('under-361');
                }else{
                    cthis.removeClass('under-361');

                }

                if(o.design_skin == 'skin-dome'){
                    if(ww>o.design_maxwidth){
                        tw = o.design_maxwidth;
                    }else{
                        tw = ww;
                    }
                }
                //console.log(cthis, o.design_skin);
                if(o.design_skin == 'skin-default'){
                };


                if(o.design_skin == 'skin-dome'){
                    cthis.width(ww);

                    //console.log(o.design_skin, items.eq(aux), tw, ww);
                    items.eq(aux).css({
                        'width' : tw
                        ,'left' : ww/2 - tw/2
                    })
                    var aux = cthis.parent().offset().left;
                    cthis.css({
                        'margin-left' : -aux
                    })
                }


                items.eq(currNr).css({
                    //'width' : tw
                });


                if(o.settings_autoHeight=='on'){

                    if(!is_ios()){
                        targeth = _carg.outerHeight();// + padding_content;
                    }
                    //console.log($.fn.jquery, parseFloat($.fn.jquery));
                    if(parseFloat($.fn.jquery) < 1.8){
                        cthis.children('.tabs-content').css({
                            'height' : (targeth)
                        });
                    }else{
                        cthis.children('.tabs-content').outerHeight(targeth);

                    }
                }

                if(o.design_enable_iphonesize=='on'){
                    if(ww<480){
                        cthis.addClass('iphone-size');
                        cthis.css({
                            'margin-left' : 0
                        })
                    }else{
                        cthis.removeClass('iphone-size');
                    }
                }

            }
            function handle_menuclick(){
                var ind = $(this).parent().children().index($(this));
                //console.log(ind);
                gotoItem(ind);

            }

            function gotoItem(arg){
                if(arg==currNr){
                    return;
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


                _carg = _content_inner.children().eq(arg);
                _carg.css({
                    'display': 'block'
                    //,'width' : tw
                });
                targeth = _carg.outerHeight();// + padding_content;
                //console.log(_carg, targeth);
                //console.log(o.settings_autoHeight);


                if(o.settings_autoHeight=='on'){


                    if(parseFloat($.fn.jquery) < 1.8){
                        cthis.children('.tabs-content').css({
                            'height' : (targeth)
                        });
                    }else{
                        cthis.children('.tabs-content').outerHeight(targeth);
                    }
                }
                //console.log(arg,currNr, _menu.children().eq(arg), targeth)
                if(currNr>-1){
                    _menu.children().eq(currNr).removeClass('active');
                }
                the_transition(arg);

                _menu.children().eq(arg).addClass('active');
                currNr = arg;
            }
            function the_transition(arg){
                //console.log(settings_dzstabs.animation_easing);
                if(o.design_transition=='slide'){
                    /*

                     || depcrecated, dunno why i used manual width

                     items.eq(currNr).css({
                     //'width' : tw
                     })
                     items.eq(arg).css({
                     //'width' : tw
                     });

                     */
                    if(arg>currNr){


                        if(currNr>-1){
                            items.eq(currNr).animate({
                                'left' : -tw
                                ,'opacity':0
                            }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing});

                        }

                        items.eq(arg).css({
                            'left' : tw
                        })

                    }else{

                        if(currNr>-1){
                            items.eq(currNr).animate({
                                'left' : tw
                                ,'opacity':0
                            }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing})
                        }


                        items.eq(arg).css({
                            'left' : -tw
                        })
                    }
                    items.eq(arg).animate({
                        'left' : 0
                        ,'opacity':1
                    }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing})
                }

                if(o.design_transition=='fullslide'){
                    items.eq(currNr).css({
                        'width' : tw
                    })
                    items.eq(arg).css({
                        'width' : tw
                    })
                    if(arg>currNr){


                        if(currNr>-1){
                            items.eq(currNr).animate({
                                'left' : -tw
                                ,'opacity' : 0
                            }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing})
                        }
                        //console.log(items.eq(arg), o.design_transition, tw);
                        items.eq(arg).css({
                            'left' : tw + 'px'
                        });
                        //console.log(items.eq(arg), o.design_transition, tw);
                    }else{

                        if(currNr>-1){
                            items.eq(currNr).animate({
                                'left' : ww
                                ,'opacity' : 0
                            }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing})
                        }
                        items.eq(arg).css({
                            'left' : -tw
                        })
                    }
                    items.eq(arg).animate({
                        'left' : (ww/2 - tw/2)
                        ,'opacity' : 1
                    }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing});
                    /*
                     */
                }

                /// ----- transition fade
                if(o.design_transition=='fade'){
                    items.eq(currNr).css({
                        'width' : tw
                    })
                    items.eq(arg).css({
                        'width' : tw
                    })
                    if(currNr>-1){
                        currNrEx = currNr;
                        items.eq(currNr).animate({
                            'opacity' : 0
                        }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing, complete:complete_out_fade})
                    }


                    items.eq(arg).css({
                        'opacity' : 0
                        ,'display' : 'block'
                    })
                    setTimeout(function(){
                        items.eq(arg).animate({
                            'opacity' : 1
                        }, {queue:false, duration:settings_dzstabs.animation_time, easing:settings_dzstabs.animation_easing})
                    },50);

                }
            }
            function complete_out_fade(){
                //console.log(e);
                items.eq(currNrEx).css({
                    'display' : 'none'
                })
            }

            return this;
        })
    }
    window.dzstabs_init = function(selector, settings) {
        $(selector).dzstabs(settings);
    };
})(jQuery);