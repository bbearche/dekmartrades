<?php
	$rtmp_url = "rtmp://104.243.43.186/dekmartrades/test";
        $application = "dekmartrades";
        $stream = "test";
        $expire_time = time() + (12 * 60 * 60); // 12 hours
        $secret = "dEkMaRkEy10";
        $key = base64_encode(openssl_digest($secret . $application . "/" . $stream . $expire_time, "md5", true));
        $key = str_replace("/", "_", $key);
        $key = str_replace("=", "", $key);
        $key = str_replace("+", "-", $key);
	//$complete_url = $rtmp_url . "?e=" . $expire_time . "&st=" . $key;
	$complete_url = "hello";

	//echo $complete_url;
	//echo $expire_time . "\n";
	//echo $key;
echo '
<script type="text/javascript" src="//dekmartrades.com/jwplayer/jwplayer.js"></script>
<script type="text/javascript">
    jwplayer.key = "oXwph3hQfjk0hkLk19/hfhoYX461FycOFcPdHw==";
</script>
<div id="live_container" style="display: block; width: 74%;padding-right:11px; float: left;">
    <div id="live_stream">Loading...</div>
    <div id="live_commentary_container" style="height:30px;">
        <div id="live_commentary" style="display:none; width: 150px; background-color: rgba(44, 220, 0, 0.43); padding: 5px;">
            <img style="width:15%" src="/wp-content/plugins/LiveStream/mic_icon.png">Live Commentary</div>
    </div>
</div>
<script type="text/javascript">
    jwplayer("live_stream").setup({
        //file: "rtmp://104.243.43.186/dekmartrades/test?e=1480504976&st=LJEA_bbCappprENFfLwrHA",
        //file: "' . $rtmp_url . '?e=' . $expire_time . '&st=' . $key .'",
        file: "http://dekmartrades.com:9999/hls/test.m3u8",
        image: "//dekmartrades.com/logo.png",
        width: "100%",
        aspectratio: "16:9",
        autostart: true,
        //rtmp: {
            //bufferlength: 0.1,
            //bufferTime: 0.1
        //}
	primary: "html5",
	hlshtml: true
    });
    jwplayer("live_stream").onPause(function() {
	console.log("paused");
    });
    jwplayer("live_stream").onError(function() {
        theTimeout = setTimeout(function() {
	    jwplayer("live_stream").stop();
            jwplayer("live_stream").play();
        }, 5000);
    });
    jwplayer("live_stream").onBuffer(function() {
		console.log("bufferr");
        theTimeout = setTimeout(function() {
			console.log("boop")
			jwplayer("live_stream").stop();
            jwplayer("live_stream").play();
        }, 5000);
    });
    jwplayer("live_stream").onPlay(function() {
        clearTimeout(theTimeout);
    });
</script>';
