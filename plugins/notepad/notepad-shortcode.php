<?php
include_once('util.php');
function notepad_embed_shortcode() {
ob_start();
?>
<script type="text/javascript">
</script>

<style type="text/css">
	.notepad-wrapper {
	  border-top-left-radius: 5px;
	  border-top-right-radius: 5px;
	  font:normal normal 16px/1.4 Tahoma,Verdana,Sans-Serif;
	  font-family: "Helvetica Neue",Arial,Helvetica,Geneva,sans-serif;
	  font-size: 14px;
	  min-width:200px; /* Chatbox width */
	  border:1px solid #5ba0d0;
	  border-bottom:none;
	  background-color:white;
	  margin-left: 20px; 
	  position:fixed;
	  bottom:0;
	  z-index:9999;
	  -webkit-box-shadow:1px 1px 5px rgba(0,0,0,.2);
	  -moz-box-shadow:1px 1px 5px rgba(0,0,0,.2);
	  box-shadow:1px 1px 5px rgba(0,0,0,.2);
	}

	.notepad-content {
	  width: 600px;
	  height: 500px;
	}

	.notepad-wrapper > input[type="checkbox"] {
	  display:block;
	  margin:0 0;
	  padding:0 0;
	  position:absolute;
	  top:0;
	  right:0;
	  left:0;
	  width:100%;
	  height:35px;
	  z-index:4;
	  cursor:pointer;
	  opacity:0;
	  filter:alpha(opacity=0);
	}

	.notepad-wrapper > label {
	  display:block;
	  height:35px;
	  line-height:35px;
	  background: #5ba0d0 none repeat scroll 0 0;
	  color:white;
	  padding:0 1em 1px;
	  margin: 0;
	}

	.notepad-wrapper > label:before {content:attr(data-collapsed)}

	.notepad-wrapper .notepad-content {
	  display:none;
	}

	#notepad_embed, #notepad_embed_admin {
		border: 0px;
	}
	.notepad-wrapper > input[type="checkbox"]:checked + label:before {content:attr(data-expanded)}
	.notepad-wrapper > input[type="checkbox"]:checked ~ .notepad-content {display:block}
</style>

<div class="notepad-wrapper" onClick="document.getElementById('notepad_embed').src=document.getElementById('notepad_embed').getAttribute('src_data')">
	<input type="checkbox" />
	<label data-expanded="Notepad" data-collapsed="Notepad"></label>
    <div class="notepad-content">
	<?php
		if (notepad_check_chat_admin()) {
		?>
		<iframe id="notepad_embed_admin" name="embed_readwrite" src="https://dekmartrades.com:8888/p/RUtql2T3LB?showControls=true&showChat=false&showLineNumbers=false&useMonospaceFont=false&noColors=true" width=600 height=500></iframe>
		<?php
		} else {
		?>
		<iframe id="notepad_embed" name="embed_readonly" src_data="https://dekmartrades.com:8888/p/r.6862913267c11e167d134c2e0d5a4407?showControls=false&showChat=false&showLineNumbers=false&useMonospaceFont=false&noColors=true" width=600 height=500></iframe>
		<?php } ?> 
	</div>
</div>

<?php
$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
