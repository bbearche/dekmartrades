<?php
        $application = "dekmartrades";
        $stream = "stream";
        $expire_time = 1480477515;
        $secret = "dEkMaRkEy10";
        $key = base64_encode(openssl_digest($secret . $application . "/" . $stream . $expire_time, "md5", true));
        $key = str_replace("/", "_", $key);
        $key = str_replace("=", "", $key);
        $key = str_replace("+", "-", $key);

	echo $expire_time . "\n";
	echo $key;
