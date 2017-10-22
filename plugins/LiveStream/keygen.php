<?php
        $application = "dekmartrades";
        $stream = "test";
        $expire_time = time() + (12 * 60 * 60); // 12 hours
        $secret = "dEkMaRkEy10";
        $key = base64_encode(openssl_digest($secret . $application . "/" . $stream . $expire_time, "md5", true));
        $key = str_replace("/", "_", $key);
        $key = str_replace("=", "", $key);
        $key = str_replace("+", "-", $key);

	echo $expire_time . "\n";
	echo $key;
