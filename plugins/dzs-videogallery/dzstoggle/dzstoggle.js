jQuery(document).ready(function($){
    //console.log('ceva', $('.dzstoggle'));
    dzstoggle_initalltoggles();
});
function dzstoggle_initalltoggles(){
    jQuery('.dzstoggle').each(function(){
        var _t = jQuery(this);
        //console.log(_t);
        if(_t.hasClass('inited')){
            return;
        }else{
            dzstoggle_inittoggle(_t);
        }
    });
}
function dzstoggle_inittoggle(arg){
    arg.addClass('inited');
    arg.children('.toggle-title').bind('click', click_toggletitle);
    //console.log(arg.prop('class'))
    if(arg.prop('class').indexOf('skin-') == -1){
        arg.addClass('skin-default');
    }
    if(arg.prop('class').indexOf('transition-') == -1){
        //arg.addClass('transition-default');
    }
    function click_toggletitle(){
        var _t = jQuery(this);
        var cthis = _t.parent();
        var cont = cthis.children('.toggle-content');
        
        var conth = cont.outerHeight();
        //console.log(cont, cont.outerHeight());
        if(cthis.hasClass('active')){
            cthis.removeClass('active');
            if(cthis.hasClass('skin-default')){
                cont.css({'height': conth, 'display': 'block'}); setTimeout( function(){ cont.css({'height': 0}); }, 20);
                
                }
        }else{
            cthis.addClass('active');
            conth = cont.outerHeight();
            if(cthis.hasClass('skin-default')){
                cont.css({'height': 'auto'});
                conth = cont.outerHeight();
                cont.css({'height': 0, 'display': 'block'}); setTimeout( function(){ cont.css({'height': conth}); }, 20);

                setTimeout( function(){ cont.css({'height': 'auto'}); }, 500);
            }
        }
        //console.log(_t);
    }
}