<?php
/*
Plugin Name: Live Stream Embed
Description: A plugin to allow embedding of an RTMP stream via a shortcode
Author: Evan Graham
Version: 0.1
 */
add_action('admin_init', 'live_stream_init');
add_action('admin_menu', 'live_stream_setup_menu');

add_shortcode('live_stream_embed', 'live_stream_embed_shortcode');

function live_stream_setup_menu() {
    add_menu_page( 'Live Stream Options', 'Live Stream', 'manage_options', 'live-stream', 'live_stream_options_page' );

}

function live_stream_embed_shortcode() {
    $options = get_option('live_stream_options');
    $online = $options['online'];
    $live_commentary = $options['live_commentary'];
    $rtmp_url = $options['embed_url'];
    if ($online == '1') {
        $application = "dekmartrades";
        $stream = "stream";
        $expire_time = time() + (12 * 60 * 60); // 12 hours
        $secret = "dEkMaRkEy10";
        $key = base64_encode(openssl_digest($secret . $application . "/" . $stream . $expire_time, "md5", true));
        $key = str_replace("/", "_", $key);
        $key = str_replace("=", "", $key);
	$key = str_replace("+", "-", $key);

        
	$ret = "";
	$ret .= '<div id="live-container">';
	//$ret .= '<div class="chatrooms-left-bar" style="margin-bottom: 30px; display: flex;"><iframe scrolling="no" style="border: 1px; width: 100%;" src="//dekmartrades.com/trader-chat-only"></iframe></div>';
        //$ret .= '<script type="text/javascript" src="//dekmartrades.com/jwplayer/jwplayer.js"></script><script type="text/javascript">jwplayer.key="oXwph3hQfjk0hkLk19/hfhoYX461FycOFcPdHw==";</script><div id="live_container" style="display: block; width: 74%;padding-right:11px; float: left;"><div id="live_stream">Loading...</div><div id="live_commentary_container" style="height:30px;"><div id="live_commentary" style="display:none; width: 150px; background-color: rgba(44, 220, 0, 0.43); padding: 5px;"><img style="width:15%" src="/wp-content/plugins/LiveStream/mic_icon.png">Live Commentary</div></div></div><script type="text/javascript">    jwplayer("live_stream").setup({file: "' . $rtmp_url . '?e=' . $expire_time . '&st=' . $key .'", image: "//dekmartrades.com/logo.png", width: "100%", aspectratio: "16:9", autostart: true, rtmp: {bufferlength: 0.1,bufferTime: 0.1}}); jwplayer("live_stream").onError(function() { jwplayer("live_stream").play() });</script>';

/*$ret .= '
<link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.13.2/alt/video-js-cdn.min.css" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.13.2/video.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.13.2/ie8/videojs-ie8.min.js"></script>
';

$ret .= '
<div id="live_container" style="display: block; width: 74%;padding-right:11px; float: left;">
      <video id="live_stream" class="video-js vjs-default-skin vjs-16-9 vjs-big-play-centered" poster="//dekmartrades.com/logo.png" sourceOrder controls autoplay preload="auto" width="640" height="300"
  data-setup="{}">
	<source src="' . $rtmp_url . '?e=' . $expire_time . '&st=' . $key .'" type="rtmp/mp4">
  </video>
    <div id="live_commentary_container" style="height:30px;">
        <div id="live_commentary" style="display:none; width: 150px; background-color: rgba(44, 220, 0, 0.43); padding: 5px;"><img style="width:15%" src="/wp-content/plugins/LiveStream/mic_icon.png">Live Commentary</div>
    </div>
</div>
<script type="text/javascript">
  videojs("live_stream").ready(function(){
	  player = this;
	  player.on("pause", function () {
	  });
	  player.on("play", function () {
	  });
	  player.on("ended", function(){
		player.hasStarted(false)
	  });
	  player.on("error", function(e) {
	  });

  });
 </script>
';
*/

$ret .= '
<style type="text/css">
#live_container {
	display: table-cell;
	width: 71%;
	position: relative;
	padding-bottom: 36%;
	padding-top: 25px;
	height: 0;
}
#llive_container_padding {
	padding-bottom: 39.25%;
}
#live_container iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}
</style>';
$ret .= '
<div id="live_container" style="">
	<div class="mobileShow">
	<a href="//dekmartrades.com/wp-content/plugins/LiveStream/webinato.php" target="_parent">Click here to watch on your Phone or Tablet!</a>
	</div>
	<iframe id="webinato_live" src="//dekmartrades.com/wp-content/plugins/LiveStream/webinato.php" width="100%" height="100%" frameBorder="0"></iframe>
</div>';
/*$ret .= '<script type="text/javascript" src="//dekmartrades.com/jwplayer/jwplayer.js"></script><script type="text/javascript">jwplayer.key="oXwph3hQfjk0hkLk19/hfhoYX461FycOFcPdHw==";</script><div id="live_container" style="display: block; width: 74%;padding-right:11px; float: left;"><div id="live_stream">Loading...</div><div id="live_commentary_container" style="height:30px;"><div id="live_commentary" style="display:none; width: 150px; background-color: rgba(44, 220, 0, 0.43); padding: 5px;"><img style="width:15%" src="/wp-content/plugins/LiveStream/mic_icon.png">Live Commentary</div></div></div>
<script type="text/javascript">jwplayer("live_stream").setup({file: "' . $rtmp_url . '?e=' . $expire_time . '&st=' . $key .'", image: "//dekmartrades.com/logo.png", width: "100%", aspectratio: "16:9", autostart: true, rtmp: {bufferlength: 0.1,bufferTime: 0.1}});
jwplayer("live_stream").onError(function() {live_stream_timeout =  setTimeout(function() { jwplayer("live_stream").stop(); jwplayer("live_stream").play()}, 10000) });
jwplayer("live_stream").onBuffer(function(){live_stream_timeout =  setTimeout(function() { jwplayer("live_stream").stop(); jwplayer("live_stream").play()}, 10000);});
jwplayer("live_stream").onPlay(function(){clearTimeout(live_stream_timeout);});</script>';
*/

	//$ret .= '<div class="chatrooms-right-bar" style="margin-bottom: 30px;"><div id="stock-alert-container-top">' . do_shortcode("[stock_alert]") . '</div></div>';
	//$ret .= '<div class="chatrooms-right-bar" style="margin-bottom: 0px; display: flex;"><iframe scrolling="no" style="border: 1px; width: 100%;" src="//dekmartrades.com/trader-chat-only-right"></iframe></div>';
	//$ret .= '<div class="chatrooms-right-bar" style="display: table-cell; height: 100%; padding-left: 20px; width: 100%; float: none;"><iframe scrolling="no" style="border: 1px; width: 100%; height: 100%;" src="//dekmartrades.com/trader-chat-only-right"></iframe></div>';
	$ret .= '<div class="chatrooms-right-bar" style="display: table-cell; height: 100%; padding-left: 20px; width: 100%; float: none;"><div class="iflychat-embed" data-height="100%" data-width="100%" data-room-id="2"></div></div>';
	$ret .= '<br><div style="clear: both;"></div>';
        $ret .= '</div>';

	/*$ret .= '<script type="text/javascript">(function live_stream_commentary_poll() {
    jQuery.ajax({
        url: "/wp-content/plugins/LiveStream/api.php?action=commentary",
        type: "GET",
        success: function(data) {
	//console.log(data);
		if (data == 1) {
		    $("#live_commentary").show();
		} else {
		    $("#live_commentary").hide();
		}
        },
        dataType: "json",
        //complete: setTimeout(function() {live_stream_commentary_poll()}, 120000),
        timeout: 1200000
    })
})();</script>';*/
	return $ret;
    } else {
        return "";
    }
}
function live_stream_init() {
    register_setting( 'live_stream_options', 'live_stream_options', 'live_stream_options_validate' );
    add_settings_section('live_stream_main', 'Main Settings', 'live_stream_section_text', 'live_stream');
    add_settings_field('live_stream_online', 'Online', 'live_stream_setting_online', 'live_stream', 'live_stream_main');
    add_settings_field('live_stream_live_commentary', 'Live Commentary', 'live_stream_setting_live_commentary', 'live_stream', 'live_stream_main');
    add_settings_field('live_stream_embed_url', 'RTMP URL', 'live_stream_setting_embed_url', 'live_stream', 'live_stream_main');
}

function live_stream_section_text() {
    $options = get_option('live_stream_options');
    echo "<p>Enter online status and RTMP URL.</p>";
    //echo "<p>Currently: " . $options['online'] . "</p>";
    //echo "<p>URL: http://youtu.be/" . $options['embed_url'] . "</p>";
}

function live_stream_setting_online() {
    $options = get_option('live_stream_options');
?>
    <input id='live_stream_online' name='live_stream_options[online]' type='checkbox' value='1' <?php checked( 1 == $options['online'] );?> />
<?php

}
function live_stream_setting_live_commentary() {
    $options = get_option('live_stream_options');
?>
    <input id='live_stream_live_commentary' name='live_stream_options[live_commentary]' type='checkbox' value='1' <?php checked( 1 == $options['live_commentary'] );?> />
<?php

}
function live_stream_setting_embed_url() {
    $options = get_option('live_stream_options');
    echo "<input id='live_stream_embed_url' name='live_stream_options[embed_url]' size='40' type='text' value='{$options['embed_url']}' />";
}

function live_stream_options_validate($input) {
    $options = get_option('live_stream_options');
    $options['embed_url'] = trim($input['embed_url']);
    $options['online'] = trim($input['online']);
    $options['live_commentary'] = trim($input['live_commentary']);
    if(!preg_match('/^rtmp/i', $options['embed_url'])) {
        $options['embed_url'] = '';
        $options['online'] = null;
        $options['live_commentary'] = null;
    }
    return $options;
}
function live_stream_options_page() {
?>
<div>
<h2>Live Stream Options</h2>
<form action="options.php" method="post">
<?php settings_fields('live_stream_options'); ?>
<?php do_settings_sections('live_stream'); ?>

<input name="Submit" type="submit" value="<?php esc_attr_e('Save Changes'); ?>" />
</form></div>
<?php
}

?>
