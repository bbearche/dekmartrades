
(function() {
	tinymce.create('tinymce.plugins.ve_dzs_video', {

		init : function(ed, url) {
			var t = this;

			t.url = url;



			//replace shortcode before editor content set
			ed.onBeforeSetContent.add(function(ed, o) {
//                console.info(o.content);
				o.content = t.replace_wsi(o.content);
			});

			ed.onExecCommand.add(function(ed, cmd) {
//                console.info(cmd);
			    if (cmd ==='mceInsertContent'){
					tinyMCE.activeEditor.setContent( t.replace_wsi(tinyMCE.activeEditor.getContent()) );
				}
			});
			ed.onPostProcess.add(function(ed, o) {
				if (o.get){
					o.content = t.replace_sho(o.content);
                }
			});
		},

		replace_wsi : function(co) {
            if(co!=undefined){
                return co.replace(/\[dzs_video([^\]]*)\]/g, function(a,b){
//                    console.info(b);
//                    console.info(getAttr(b,'source'));
                    var aux = '<div class=\'ve_dzs_video mceItem mceNonEditable\' contentEditable="false" data-shortcodecontent=\'dzs_video'+tinymce.DOM.encode(b)+'\' >[ dzs_video'+jQuery('<div/>').text(b).html()+' ]</div>';

                    //<video width="100%" height="100%" style="position: absolute; top:0; left:0; width: 100%; height:100%;" controls><source src="'+getAttr(b,'source')+'" type="video/mp4"></video><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5426.619341494258!2d27.587286416297296!3d47.15178914111889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40cafb7cf639ddbb%3A0x7ccb80da5426f53c!2zSWHImWk!5e0!3m2!1sro!2s!4v1402421248549" width="400" height="300" frameborder="0" style="border:0"></iframe>
//                    console.info(aux);
                    return aux;
                    // return '<img src="'+dzsvg_settings.thepath+'tinymce/visualeditor/images/ve_dzs_video.png" class=\'ve_dzs_video mceItem\' data-shortcodecontent=\'dzs_video'+tinymce.DOM.encode(b)+'\' />';
                });
            }
//
            return co;
		},



		replace_sho : function(co) {


			co = co.replace(/<div.*?class="ve_dzs_video.*?<\/div>/g, function(a,b){
//                console.info(a,b);

                var aux = (getAttr(a, 'data-shortcodecontent'));
//                console.info(aux);
                aux = aux.replace(/&amp;/g, '');
                aux = aux.replace(/&quot;/g, '"');
//                console.info(aux);
                return '['+aux+']';
            });

            return co;
		}

	});

    //--better idea to have image and :before and / :after tags - with editor buttons
	tinymce.PluginManager.add('ve_dzs_video', tinymce.plugins.ve_dzs_video);
})();
function getAttr(s, n) {
    n = new RegExp(n + '=[\"|\'](.*?)[\"|\']', 'g').exec(s);
    if(n[1]){
        return n[1];
    }else{
        return null;
    }
};