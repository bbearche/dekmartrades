var coll_buffer=0;
var func_output='';
jQuery(document).ready(function($){
       //console.log('ceva');
       var i=0;
    var arr_septag = initer.split('$$;');
    
    for(i=0;i<arr_septag.length;i++){
        if(arr_septag[i]==''){
            continue;
        }
        add_tag();
        var arr_septagprop = arr_septag[i].split('$$');
        //console.info(arr_septagprop);
        var _t = $('.con-tags').children().last();
        _t.find('input[name=starttime]').val(arr_septagprop[0]);
        _t.find('input[name=endtime]').val(arr_septagprop[1]);
        _t.find('input[name=posleft]').val(arr_septagprop[2]);
        _t.find('input[name=postop]').val(arr_septagprop[3]);
        _t.find('input[name=width]').val(arr_septagprop[4]);
        _t.find('input[name=height]').val(arr_septagprop[5]);
        _t.find('input[name=link]').val(arr_septagprop[6]);
        _t.find('input[name=text]').val(arr_septagprop[7]);
    }
    //console.info(arr_septag);
    
       $('.add-tag').bind('click', click_addtag);
       $(document).on('click','.delete-tag',click_deletetag);
       $('.btn-submit').bind('click', click_submit);
       function click_addtag(){
           add_tag();
       }
       function add_tag(){
           $('.con-tags').append(struct_tag);
       }
       function click_deletetag(){
           var _t = $(this);
           //console.log(_t);
           _t.parent().parent().remove();
       }
       function click_submit(){
       //console.log('ceva');
       var fout = '';
           $('.con-tags .a-tag').each(function(){
               var _t = $(this);
               //console.log(_t);
               fout+=_t.find('input[name=starttime]').val();               fout+='$$';
               fout+=_t.find('input[name=endtime]').val();               fout+='$$';
               fout+=_t.find('input[name=posleft]').val();               fout+='$$';
               fout+=_t.find('input[name=postop]').val();               fout+='$$';
               fout+=_t.find('input[name=width]').val();               fout+='$$';
               fout+=_t.find('input[name=height]').val();               fout+='$$';
               fout+=_t.find('input[name=link]').val();               fout+='$$';
               fout+=_t.find('input[name=text]').val();               fout+='$$;';
           });
       //console.info(fout);
       
    if(typeof(top.extra_receiver_tagsreceived)=='function'){
        top.extra_receiver_tagsreceived(fout);
    }
       }
});
