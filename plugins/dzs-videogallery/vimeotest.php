<?php

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
function get_videos($vimeo, $url) {
                    $vimeo_response = $vimeo->request($url);


                    if ($vimeo_response['status'] != 200) {
//                        throw new Exception($channel_videos['body']['message']);
                        echo 'vimeo error - enable debug to see error';
                        if ($this->mainoptions['debug_mode'] == 'on') {
                            echo '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . __('vimeo error ', 'dzsvg') . '</div>
<div class="toggle-content">';
                            echo(print_rr($vimeo_response, array('echo' => false, 'encode_html' => true)));
                            echo '</div></div>';
                        } else {
                            error_log(print_rr($vimeo_response, array('echo' => false, 'encode_html' => false)));
                        }
                    }
		return $vimeo_response;

}
					$ida = "";
                    if (!class_exists('VimeoAPIException')) {
                        require_once(dirname(__FILE__) . '/vimeoapi/vimeo.php');
                    }

	   	    $vimeo_maxvideos = 100;
                    $vimeo_id = "user57524599"; // Get from https://vimeo.com/settings, must be in the form of user123456
                    $consumer_key = "f636ee767b997315d7265fc9549e0840bb578640";
                    $consumer_secret = "PVTjhDJDwMOd8mpZonX0FVUHVzOdbNf1Rf7tXM9LoaOjWPtVsVKluLEtkcPydMep/xMXae4OY4Ygnf8ooFRbVQbFPjBCrRhLmdLNaGQfaaVGIzcss8IOOQgk1PBcWxBo";
                    $token = "1e672ed5029bac182e6f4efa95b24cd9";

                    // Do an authentication call
                    $vimeo = new Vimeo($consumer_key, $consumer_secret);
                    $vimeo->setToken($token); //,$token_secret
//                    $vimeo->user_id = $vimeo_id;
//                        echo $this->mainoptions['disable_api_caching'].'hmmdada/channels/' . $its['settings']['vimeofeed_channel'];

                    //$vimeo_response = $vimeo->request('/users/user57524599/videos?per_page=' . $vimeo_maxvideos);
                    $vimeo_response = get_videos($vimeo, '/users/user57524599/videos?per_page=' . $vimeo_maxvideos . '&page=1');
                            //print_r($vimeo_response);


                    if ($vimeo_response['status'] != 200) {
//                        throw new Exception($channel_videos['body']['message']);
                        echo 'vimeo error - enable debug to see error';
                        if ($this->mainoptions['debug_mode'] == 'on') {
                            echo '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . __('vimeo error ', 'dzsvg') . '</div>
<div class="toggle-content">';
                            echo(print_rr($vimeo_response, array('echo' => false, 'encode_html' => true)));
                            echo '</div></div>';
                        } else {
                            error_log(print_rr($vimeo_response, array('echo' => false, 'encode_html' => false)));
                        }
                    }
                    if (isset($vimeo_response['body']['data'])) {
                        $ida = $vimeo_response['body']['data'];
                    }
		    $total_videos = $vimeo_response['body']['total'];
		    for ($page = $vimeo_response['body']['page'] + 1; $page <= ceil($total_videos/$vimeo_maxvideos); $page++) {
			    $url = '/users/user57524599/videos?per_page=' . $vimeo_maxvideos . '&page=' . $page;
			    $vimeo_response = get_videos($vimeo, $url);
			    $ida = array_merge($ida, $vimeo_response['body']['data']);
			
		    }


                    print_r($ida);
