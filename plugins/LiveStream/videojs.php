<?php
	$rtmp_url = "rtmp://104.243.43.186/dekmartrades/stream";
        $application = "dekmartrades";
        $stream = "stream";
        $expire_time = time() + (12 * 60 * 60); // 12 hours
        $secret = "dEkMaRkEy10";
        $key = base64_encode(openssl_digest($secret . $application . "/" . $stream . $expire_time, "md5", true));
        $key = str_replace("/", "_", $key);
        $key = str_replace("=", "", $key);
        $key = str_replace("+", "-", $key);

?>
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
  <link href="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.13.2/alt/video-js-cdn.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.13.2/video.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/video.js/5.13.2/ie8/videojs-ie8.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/videojs-contrib-hls/3.0.2/videojs-contrib-hls.js"></script>
  
</head>
<style text="text/css">
.vjds-poster {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
}
</style>
<body>
<div id="live_container" style="display: block; width: 74%;padding-right:11px; float: left;">
      <video id="live_stream" class="video-js vjs-default-skin vjs-16-9" poster="//dekmartrades.com/logo.png" controls autoplay preload="auto" width="640" height="300"
  data-setup='{}'>

	<!--<source src="rtmp://104.243.43.186/dekmartrades/test?e=1480607360&st=cugctRYdFngKZvdmyNCQ5g" type="rtmp/mp4">-->
<!--<source src="<?=$rtmp_url . '?e=' . $expire_time . '&st=' . $key ?>" type="rtmp/mp4">-->
<source src="<?=$rtmp_url . '?e=' . $expire_time . '&st=' . $key ?>" type="rtmp/mp4">
    <!--<source src="http://dekmartrades.com:9999/hls/test.m3u8" type="application/x-mpegURL">-->
  </video>
  
    <div id="live_commentary_container" style="height:30px;">
        <div id="live_commentary" style="display:none; width: 150px; background-color: rgba(44, 220, 0, 0.43); padding: 5px;"><img style="width:15%" src="/wp-content/plugins/LiveStream/mic_icon.png">Live Commentary</div>
    </div>
</div>

  <script>
  videojs("live_stream").ready(function(){
	  player = this;
	  //player.play();
	  player.on("pause", function () {
		console.log("pause");
	  });
	  player.on("play", function () {
		console.log("play");
		//player.seekable().end(0)
	  });
	  player.on("ended", function(){
		console.log("Ended");
		player.hasStarted(false)
	  });
  });
  </script>
  
</body>
</html>
