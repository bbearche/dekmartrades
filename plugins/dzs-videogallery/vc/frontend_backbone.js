window.InlineShortcodeView_zoomtimeline = window.InlineShortcodeView.extend({
    render: function() {
        window.InlineShortcodeView_zoomtimeline.__super__.render.call(this);
//        console.info(jQuery('.dzs-progress-bar'));

        var _tel = this.$el;

        //console.info(_tel, this);

        _tel.find('.zoomtimeline').each(function(){
            var _t = jQuery(this);
//            console.info(_t);

            if(_t.hasClass('inited')){
                //if(typeof(_t.get(0))!='undefined' && typeof(_t.get(0).api_restart_and_reinit)!='undefined'){
                //    _t.get(0).api_restart_and_reinit();
                //}

            }else{
                if(jQuery.fn.zoomtimeline){

                    _t.zoomtimeline();
                }else{
                    console.log('zoomtimeline not definied');
                }
            }



        });
//
//
//        setTimeout(function(){
//            jQuery(window).trigger('resize');
//        },50);
        return this;
    }
});


