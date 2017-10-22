<?php

    //$options = get_option('live_stream_options');
    //$online = $options['online'];
    //$rtmp_url = $options['embed_url'];
        $rtmp_url = "rtmp://104.243.43.186/dekmartrades/stream";
        $application = "dekmartrades";
        $stream = "stream";
        $expire_time = time() + (12 * 60 * 60); // 12 hours
        $secret = "dEkMaRkEy10";
        $key = base64_encode(openssl_digest($secret . $application . "/" . $stream . $expire_time, "md5", true));
        $key = str_replace("/", "_", $key);
        $key = str_replace("=", "", $key);
        $key = str_replace("+", "-", $key);


        echo '<script type="text/javascript" src="//dekmartrades.com/jwplayer/jwplayer.js"></script><script type="text/javascript">jwplayer.key="oXwph3hQfjk0hkLk19/hfhoYX461FycOFcPdHw==";</script><div id="live_container" style="margin: 0 auto; display: block; max-width: 1172px;"><div id="live_stream">Loading...</div></div><script type="text/javascript">    jwplayer("live_stream").setup({file: "' . $rtmp_url . '?e=' . $expire_time . '&st=' . $key .'", image: "//dekmartrades.com/logo.png", width: 1172, height: 659, autostart: true, rtmp: {bufferlength: 0.1,bufferTime: 0.1}});</script><br>';
        //return '<iframe style="margin: 0 auto; display: block;" width="600" height="338" src="https://www.youtube.com/embed/' . $video_code . '" frameborder="0" allowfullscreen></iframe>';

