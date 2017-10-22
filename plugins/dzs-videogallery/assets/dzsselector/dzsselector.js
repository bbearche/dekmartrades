



function dzs_slide_up(_arg, pargs){


    var margs = {
        duration: 300
        ,queue:false
        ,complete: function(){

        }
    };


    if(pargs){
        margs = jQuery.extend(margs,pargs);
    }

    _arg.css('height', _arg.outerHeight());


    // console.info()

        _arg.animate({
            'height': 0
        },margs)
}


function dzs_slide_down(_arg, pargs){


    var margs = {
        duration: 300
        ,queue:false
        ,complete: function(){

        }
    };


    if(pargs){
        margs = jQuery.extend(margs,pargs);
    }

    _arg.css('height', 'auto');


    var realh = _arg.outerHeight();

    _arg.css('height', '0px');

    if(realh){
        _arg.animate({
            'height': realh
        },margs)
    }
}



(function($) {


    $.fn.dzsselector = function(o) {

        //==default options
        var defaults = {
            'opener': ''

        };

//        console.info(this, o);

        if (typeof o == 'undefined') {
            if (typeof $(this).attr('data-options') != 'undefined' && $(this).attr('data-options') != '') {
                var aux = $(this).attr('data-options');
                aux = 'var aux_opts = ' + aux;
                eval(aux);
                o = aux_opts;
            }
        }
        o = $.extend(defaults, o);


        this.each(function () {
            var _t = $(this);
            var _t_class = String(_t.attr('class'));
            var _theSelect = null;
            var _feeder = null

            var _wrapper = null;

            var cthis = null;

            var _opener_wrap = null;
            var _opener_main = null;





            init();

            function init(){
                _t_class = _t_class.replace('dzs-style-me', '');

                if(_t.hasClass('opener-listbuttons')){
                    o.opener = 'opener-listbuttons';
                }
                if(_t.hasClass('opener-bigoptions')){
                    o.opener = 'opener-bigoptions';
                }
                if(_t.hasClass('opener-radio')){
                    o.opener = 'opener-radio';
                }
                if(_t.hasClass('opener-list')){
                    o.opener = 'opener-list';
                }


                //console.info(o);


                if(_t.next().hasClass('dzs-style-me-feeder')){
                    _feeder = _t.next();
                }
                //console.info(_t);

                if(_t.hasClass('treated') || _t.parent().hasClass('dzs-select-wrapper')){

                    if(_t.hasClass('skin-justvisible')){

                        _wrapper = _t.parent();
                        _theSelect = _wrapper.find('select').eq(0);

                        if(_wrapper){
                            _wrapper.find('.dzs-select-wrapper-head').unbind('click');
                            _wrapper.find('.dzs-select-wrapper-head').bind('click', function(){
                                //console.info(_theSelect);
                                //_theSelect.click(function(){
                                //    //do stuff here
                                //});
                                //_theSelect.click();

                                openSelect(_theSelect);
                            })
                        }
                    }

                    return false;
                }
                //console.info(_t);
                //_t.addClass('treated');

                var str_w = '';

                if(_t.get(0).style && _t.get(0).style.width!='' && !isNaN(parseInt(_t.get(0).style.width,10))){
                    str_w = 'width: '+parseInt(_t.get(0).style.width,10)+'px';
                }

                _t.wrap('<div class="dzs-select-wrapper '+_t_class+'" style="'+str_w+'"></div>');

                _wrapper = _t.parent();
                cthis = _wrapper;


                 var aux2 = '<div class="dzs-select-wrapper-head"><span class="the-text">'+_t.val()+'</span>';



                if(cthis.hasClass('skin-charm')){
                    aux2+='<span class="plus-sign"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="12px" height="12px" viewBox="0 0 12 12" enable-background="new 0 0 12 12" xml:space="preserve"> <circle fill="#999999" cx="6" cy="6" r="6"/><rect class="rect1" x="5" y="2" fill="#FFFFFF" width="2" height="8"/><rect class="rect2" x="2" y="5" fill="#FFFFFF" width="8" height="2"/></svg></span>';
                }

                aux2+='</div>';

                _wrapper.prepend(aux2);

                if(_t.get(0) && _t.get(0).nodeName=='UL'){
                    var aux3 = '<select name="'+_t.attr('data-name')+'">';

                    for(i=0;i<_t.children().length;i++){
                        aux3+='<option value="'+_t.children().eq(i).attr('data-value')+'">'+_t.children().eq(i).attr('data-value')+'</option>';
                    }

                    aux3+='</select>';
                    _t.after(aux3);
                }

                _theSelect = _t.parent().find('select').eq(0);

                _theSelect.on('change', function(){

                    if(_theSelect.attr('name')=='type'){

                        console.info('_theSelect changed', _theSelect, _theSelect.attr('name'), _theSelect.val());
                    }

                    //console.info(_t.parent().find('.dzs-select-wrapper-head .the-text'));
                    _t.parent().find('.dzs-select-wrapper-head .the-text').html($(this).find(':selected').html());

                    var curr_sel_ind = 0;

                    for(var i in _theSelect.children()){
                        if(_theSelect.val() == _theSelect.children().eq(i).html()){

                            if(_theSelect.attr('name')=='type'){

                                console.info('found i ' ,i);
                            }

                            curr_sel_ind = i;
                        }
                    }


                    if(String(_t_class).indexOf('opener-')>-1){

                    }

                })

                _theSelect.trigger('change');

                _theSelect.bind('focus', function(){

                    if(_wrapper.hasClass('skin-beige')){
                        _wrapper.addClass('select-focused');
                    }
                })

                _theSelect.bind('focusout', function(){
                    _wrapper.removeClass('select-focused');

                })



                if(String(_t_class).indexOf('opener-')>-1){
                    _t.parent().bind('click',function(e){
                        var _t2 = $(this);
                        // console.info(_t2);

                        // console.info(e, $(e.target), $(e.target).hasClass('search-field'));


                        if($(e.target).hasClass('search-field')) {


                        }else{
                            if(_t2.hasClass('active-animation')){

                                close_opener();

                            }else{
                                open_opener();
                            }

                        }


                        setTimeout(function(){

                            var auxoptions = {
                                columnWidth: 1,
                                itemSelector: '.masonry-gallery--item'
                            };

                            //console.log( _t.parent().find('.dzslayouter .items-con'));
                            if($.fn.masonry){

                                _t.parent().find('.dzslayouter .items-con').masonry(auxoptions);
                            }
                        },500)

                    })
                }else{

                    //console.info(_wrapper);
                    if(_wrapper){
                        _wrapper.find('.dzs-select-wrapper-head').bind('click', function(){
                            //console.info(_theSelect);
                            //_theSelect.click(function(){
                            //    //do stuff here
                            //});
                            //_theSelect.click();

                            openSelect(_theSelect);
                        })
                    }
                }


                //console.log(_wrapper);
                _wrapper.addClass('init-readyall')

                if(_t.parent().hasClass('opener-bigoptions') || o.opener == ('opener-listbuttons') || o.opener == ('opener-radio') ||  o.opener == ('opener-list')){

                    var aux = '<div class="'+ String(o.opener)+'-wrap">';

                    if(o.opener=='opener-list' || o.opener=='opener-bigoptions'){
                        if(o.opener=='opener-list') {
                            aux += '<input class="search-field"/>';
                        }
                        aux+='<div class="'+ String(o.opener)+'">';
                    }
                    //console.info(o, o.opener,aux);





                    var selectedind = 0;
                    for(i=0;i<_t.children().length;i++){
                        var _c = _t.children().eq(i);
                        if(_c.prop('selected')==true){
                            selectedind = i;
                        }
                    }



                    if(o.opener=='opener-bigoptions'){
                        aux+='</div>';
                    }

                    aux+='</div>';





                    _t.parent().append(aux);


                    if(o.opener=='opener-bigoptions' || o.opener=='opener-list'){
                        _opener_wrap = cthis.find('.'+o.opener+'-wrap');
                        _opener_main = cthis.find('div.'+o.opener+'');

                    }


                    if(o.opener=='opener-listbuttons' || o.opener=='opener-radio'){
                        _opener_wrap = cthis.find('.'+o.opener+'-wrap');
                        _opener_main = cthis.find('div.'+o.opener+'-wrap');

                    }
                    // console.info('selectedind - ',selectedind, _t.parent(), _t.parent().find('.select-option'), _opener_main);

                    _t.parent().on('click','.select-option', handle_mouse);


                    reinit();



                    if(_opener_main){

                        _opener_main.find('.select-option').eq(selectedind).addClass('active');

                        // console.info(_opener_main, _opener_main.children(), _opener_main.find('.select-option').eq(selectedind));
                    }
                }




                _theSelect.get(0).api_reinit = reinit;

                _wrapper.on('keyup', '.search-field', handle_change);



            }

            function close_opener(){
                var delay = 300;

                cthis.removeClass('active-animation');
                if(o.opener=='opener-list'){
                    delay = 0;
                }
                setTimeout(function(){
                    cthis.removeClass('active');
                },delay);


                if(String(_t_class).indexOf('opener-bigoptions')>-1){


                    dzs_slide_up(_opener_wrap, {
                        duration: delay
                        ,queue:false
                        ,complete: function(){

                        }

                    })

                    ;
                }

                cthis.find('.search-field').val('').trigger('keyup');
            }

            function open_opener(){
                cthis.addClass('active');
                setTimeout(function(){
                    cthis.addClass('active-animation');
                },50);


                // console.info(_t_class);
                if(String(_t_class).indexOf('opener-bigoptions')>-1){


                    dzs_slide_down(_opener_wrap, {
                        duration: 300
                        ,queue:false
                        ,complete: function(){

                        }
                    })
                }

                if(o.opener=='opener-list'){

                }
            }


            function reinit(){


                // console.info(_feeder);


                _opener_main.html('');
                if(_feeder){
                    for(i=0;i<_feeder.children().length;i++){


                        var aux ='';
                        //console.log(_t.children().eq(i));
                        aux+='<div class="bigoption select-option">'+_feeder.children().eq(i).html();

                        if(o.opener=='opener-radio'){
                            aux+='<div class="small-bubble"></div>';
                        }

                        aux+='</div>';



                        if(_opener_main){
                            _opener_main.append(aux);
                        }else{
                            _opener_wrap.append(aux);
                        }
                    }
                }else{
                    for(i=0;i<_t.children().length;i++){
                        var aux ='';
                        //console.log(_t.children().eq(i));
                        aux+='<div class="bigoption select-option">'+_t.children().eq(i).html()+'</div>';


                        if(_opener_main){
                            _opener_main.append(aux);
                        }else{
                            _opener_wrap.append(aux);
                        }
                    }


                }

                setTimeout(function(){
                    _theSelect.trigger('change');
                    cthis.find('.search-field').trigger('keyup');
                },100);
            }



            function handle_mouse(e){
                var _t = $(this);

                if(e.type=='click'){
                    if(_t.hasClass('select-option')){

                        var _t2 = $(this);

                        //console.log(_t2);

                        _t2.parent().children().removeClass('active');
                        _t2.addClass('active');

                        var ind = _t2.parent().children('.select-option').index(_t2);

                        _theSelect.children().eq(ind).prop('selected',true);

                        _theSelect.trigger('change');
                    }
                }
            }



            function handle_change(e){
                var _t = $(this);

                if(e.type=='keyup'){
                    if(_t.hasClass('search-field')){
                        // console.info(_opener_main);


                        _opener_main.children().each(function(){
                            var _t2 = $(this);

                            // console.info(_t2.text());

                            if(String(_t2.text()).toLowerCase().indexOf( String(_t.val()).toLowerCase() ) > -1){
                                _t2.show();
                            }else{
                                _t2.hide();
                            }

                            if(_t.val()==''){
                                _t2.show();
                            }
                        })
                    }
                }
            }




        });



    };



    window.dzssel_init = function(selector, settings) {
        if(typeof(settings)!="undefined" && typeof(settings.init_each)!="undefined" && settings.init_each==true ){
            var element_count = 0;
            for (var e in settings) { element_count++; }
            if(element_count==1){
                settings = undefined;
            }

            $(selector).each(function(){
                var _t = $(this);
                _t.dzsselector(settings)
            });
        }else{
            $(selector).dzsselector(settings);
        }

    };
})(jQuery);

jQuery(document).ready(function($){

    //console.info($('select.dzs-style-me'));
    dzssel_init('select.dzs-style-me', {init_each: true});
});

var openSelect = function(selector){
    var element = jQuery(selector)[0],
        worked = false
        ;
    if (document.createEvent) { // all browsers
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        worked = element.dispatchEvent(e);
    } else if (element.fireEvent) { // ie
        worked = element.fireEvent("onmousedown");
    }
    if (!worked) { // unknown browser / error
        alert("It didn't worked in your browser.");
    }
}