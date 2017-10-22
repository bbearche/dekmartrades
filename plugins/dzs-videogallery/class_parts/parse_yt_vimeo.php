<?php


function dzsvg_parse_youtube_video($id, $pargs = array(), &$fout=null){

    global $dzsvg;

    $margs = array(
        'max_videos' => '5',
        'enable_outernav_video_author' => 'off',
        'striptags' => 'off',
        'get_full_description' => 'off',
        'type' => 'detect',
    );



    $response = '';


    $lab_cacher = 'dzsvg_cache_ytvideos';
    $cacher = get_option($lab_cacher);

    $cached = false;


    $foutarr = array();


    if ($cacher == false || is_array($cacher) == false || $dzsvg->mainoptions['disable_api_caching'] == 'on') {
        $cached = false;
    } else {



        $ik = -1;
        $i = 0;
        for ($i = 0; $i < count($cacher); $i++) {
            if ($cacher[$i]['id'] == $id) {
                if ($_SERVER['REQUEST_TIME'] - $cacher[$i]['time'] < 144000) {
                    $ik = $i;

//                                echo 'yabebe';
                    $cached = true;
                    break;
                }
            }
        }


        if($cached) {
            $response= $cacher[$ik]['response'];
        }

    }




    if ($dzsvg->mainoptions['debug_mode'] == 'on') {
        if($fout!=null){

        }
        $fout.= '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . __('video single youtube', 'dzsvg') . '</div>
<div class="toggle-content">';
        $fout.='cached - ( ' . $cached . ' )  cacher is...<br>';
        $fout.=(print_rr($cacher, array('echo' => false, 'encode_html' => true)));
        $fout.= '</div></div>';
    }


    if($response==''){

        $target_file = 'https://www.googleapis.com/youtube/v3/videos?part=snippet%2Cstatistics&id=' . $id . '&key=' . $dzsvg->mainoptions['youtube_api_key'] . '&type=channel&part=snippet';



        $response = DZSHelpers::get_contents($target_file, array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));




        $auxa34 = array('id' => $id, 'response' => $response, 'time' => $_SERVER['REQUEST_TIME']
        );

        $found_cached = false;

        if (!is_array($cacher)) {
            $cacher = array();
        } else {


            foreach ($cacher as $lab => $cach) {
                if ($cach['id'] == $id) {
                    $found_cached = true;

                    $cacher[$lab] = $auxa34;

                    update_option($lab_cacher, $cacher);

//                                        print_r($cacher);
                    break;
                }
            }


        }

        if ($found_cached == false) {

            array_push($cacher, $auxa34);

//                                            print_r($cacher);

            update_option($lab_cacher, $cacher);
        }


    }


    $obj = json_decode($response);


    if ($obj && is_object($obj)) {

        if(isset($obj->items) && isset($obj->items[0]) && isset($obj->items[0]->snippet) && isset($obj->items[0]->snippet->description)){

            $foutarr['description'] = $obj->items[0]->snippet->description;
            $foutarr['menuDescription'] = $obj->items[0]->snippet->description;
        }

        if(isset($obj->items) && isset($obj->items[0]) && isset($obj->items[0]->statistics) && isset($obj->items[0]->statistics->viewCount)){

            $foutarr['views'] = $obj->items[0]->statistics->viewCount;
        }
    }

//        print_r($obj);



    return $foutarr;




}

function dzsvg_parse_yt($link, $pargs = array(), &$fout=null){


    global $dzsvg;


    $margs = array(
        'max_videos' => '5',
        'enable_outernav_video_author' => 'off',
        'striptags' => 'off',
        'get_full_description' => 'off',
        'type' => 'detect',
        'subtype' => 'detect',
    );

    if (!is_array($pargs)) {
        $pargs = array();
    }

    $margs = array_merge($margs, $pargs);

    $its = array();


    $subtype = '';



    if($margs['subtype']!='detect'){
        $subtype = $margs['subtype'];
    }
    if(strpos($link,'youtube.com/c/')!==false){
//        echo 'whaaaaaa';
        $subtype='user_channel';
    }
    if(strpos($link,'youtube.com/channel/')!==false){
//        echo 'whaaaaaa';
        $subtype='user_channel';
    }
    if(strpos($link,'youtube.com/user/')!==false){
        $subtype='user_channel';
    }

    if(strpos($link,'youtube.com/playlist')!==false){
        $subtype='playlist';
    }
    if(strpos($link,'youtube.com/results')!==false){
        $subtype='search';
    }

    if($margs['max_videos']==''){
        $margs['max_videos'] = '30';
    }

    $targetfeed = '';

    if(strpos($link,'/')!==false){
        $q_strings = explode('/',$link);

//    print_r($q_strings);

        if($subtype=='user_channel'){

            $targetfeed = $q_strings[count($q_strings)-1];

//        echo $targetfeed;
        }
        if($subtype=='playlist'){

            $targetfeed = DZSHelpers::get_query_arg($link, 'list');

//        echo 'targetfeed - '.$targetfeed.' ||| ';
        }
        if($subtype=='search'){

            $targetfeed = DZSHelpers::get_query_arg($link, 'search_query');

//        echo $targetfeed;
        }

    }else{
        $targetfeed = $link;
    }



//    print_r($dzsvg->mainoptions);
    if ($dzsvg->mainoptions['debug_mode'] == 'on') {
        if($fout!=null){

        }
        $fout.= '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . __('first settings', 'dzsvg') . '</div>
<div class="toggle-content">';
        $fout.='debug mode: target file ( ' . '$link - '.$link . ' ) <br>';
        $fout.='debug mode: target file ( ' . 'feed type - '.$subtype . ' ) <br>';
        $fout.='debug mode: target file ( ' . '$targetfeed - '.$targetfeed . ' ) <br>';
        $fout.= '</div></div>';


    }




    $max_videos = $margs['max_videos'];


    if($max_videos=='all'){
        $max_videos = 50;
    }


    // --- user channel
    if($subtype=='user_channel') {





        $cacher = get_option('dzsvg_cache_ytuserchannel');

        $cached = false;


        if ($cacher == false || is_array($cacher) == false || $dzsvg->mainoptions['disable_api_caching'] == 'on') {
            $cached = false;
        } else {

//                print_r($cacher);


            $ik = -1;
            $i = 0;
            for ($i = 0; $i < count($cacher); $i++) {
                if ($cacher[$i]['id'] == $targetfeed) {
                    if ($_SERVER['REQUEST_TIME'] - $cacher[$i]['time'] < 7200) {
                        $ik = $i;

//                                echo 'yabebe';
                        $cached = true;
                        break;
                    }
                }
            }


            if($cached) {
                foreach ($cacher[$ik]['items'] as $lab => $item) {
                    if ($lab === 'settings') {
                        continue;
                    }

                    $its[$lab] = $item;
                }

                return $its;
            }

        }





        $target_file = 'https://www.googleapis.com/youtube/v3/search?q=' . $targetfeed . '&key=' . $dzsvg->mainoptions['youtube_api_key'] . '&type=channel&part=snippet';




        $ida = DZSHelpers::get_contents($target_file, array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));



        if ($dzsvg->mainoptions['debug_mode'] == 'on') {
            if($fout!=null){

            }
            $fout.= '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . __('first search for channel id', 'dzsvg') . '</div>
<div class="toggle-content">';
            $fout.='debug mode: target file ( ' . $target_file . ' )  ida is is...<br>';
            $fout.= '</div></div>';
            wp_enqueue_style('dzstoggle', $dzsvg->base_url . 'dzstoggle/dzstoggle.css');
            wp_enqueue_script('dzstoggle', $dzsvg->thepath . 'dzstoggle/dzstoggle.js');
        }


        $i = 0;

        if ($ida) {

            $obj = json_decode($ida);


            if ($dzsvg->mainoptions['debug_mode'] == 'on') {
//                echo 'debug mode: is not nicename is ON, obj is is...<br>';
//                print_r($obj);
//                echo '<br/>';
            }


            if ($obj && is_object($obj)) {


                if (isset($obj->items[0]->id->channelId)) {

//                        array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">'.__('This is dirty').'</div>');

                    $channel_id = $obj->items[0]->id->channelId;


                    $breaker = 0;
                    $nextPageToken = 'none';

                    while ($breaker < 10 || $nextPageToken !== '') {


                        $str_nextPageToken = '';

                        if ($nextPageToken && $nextPageToken != 'none') {
                            $str_nextPageToken = '&pageToken=' . $nextPageToken;
                        }


                        if ($dzsvg->mainoptions['youtube_api_key'] == '') {
                            $dzsvg->mainoptions['youtube_api_key'] = 'AIzaSyCtrnD7ll8wyyro5f1LitPggaSKvYFIvU4';
                        }

                        $target_file = 'https://www.googleapis.com/youtube/v3/search?key=' . $dzsvg->mainoptions['youtube_api_key'] . '&channelId=' . $channel_id . '&part=snippet&order=date&type=video' . $str_nextPageToken . '&maxResults=' . $max_videos;


//                        echo $target_file;

                        $ida = DZSHelpers::get_contents($target_file, array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));


                        if ($ida) {

                            $obj = json_decode($ida);

//print_r($obj);


                            if ($dzsvg->mainoptions['debug_mode'] == 'on') {
                                $fout.= 'fout on';
                                $fout.= '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . __('then we know the real query  ', 'dzsvg') . '</div>
<div class="toggle-content">';
                                $fout.=' youtube user channel - let us see the actual channel id targetfile - ' . $target_file . ' <br>';
                                $fout.=' channelId - <strong>' . $channel_id . '</strong> <br>';
                                $fout.='debug mode: $obj - ' . print_rr($obj, array('echo'=>false, 'encode_html'=>true) )  . '<br>';
                                $fout.= '</div></div>';
                            }


                            if($obj && is_object($obj) && isset($obj->error)  && isset($obj->error->message)){

                                echo '<div class="error">'.$obj->error->message.'</div>';
                            }

                            if ($obj && is_object($obj)) {

//                                        print_r($obj);

                                if (isset($obj->items[0]->id->videoId)) {


                                    foreach ($obj->items as $ytitem) {
//                    print_r($ytitem); echo $ytitem->id->videoId;


                                        if (isset($ytitem->id->videoId) == false) {
                                            echo 'this does not have id ? ';
                                            continue;
                                        }
                                        $its[$i]['source'] = $ytitem->id->videoId;
                                        $its[$i]['thumbnail'] = $ytitem->snippet->thumbnails->medium->url;
                                        $its[$i]['type'] = "youtube";
                                        $its[$i]['permalink'] = "https://www.youtube.com/watch?v=".$its[$i]['source'];

                                        $aux = $ytitem->snippet->title;
                                        $lb = array('"', "\r\n", "\n", "\r", "&", "-", "`", '???', "'", '-');
                                        $aux = str_replace($lb, ' ', $aux);
                                        $its[$i]['title'] = $aux;

                                        $aux = $ytitem->snippet->description;
                                        $lb = array("\r\n", "\n", "\r");
                                        $aux = str_replace($lb, '<br>', $aux);
                                        $lb = array('"');
                                        $aux = str_replace($lb, '&quot;', $aux);
                                        $lb = array("'");
                                        $aux = str_replace($lb, '&#39;', $aux);


                                        $auxcontent = '<p>' . str_replace(array("\r\n", "\n", "\r"), '</p><p>', $aux) . '</p>';

                                        $its[$i]['description'] = $auxcontent;
                                        $its[$i]['menuDescription'] = $auxcontent;

                                        if ($margs['enable_outernav_video_author'] == 'on') {
//                        echo 'ceva';
                                            $its[$i]['uploader'] = $ytitem->snippet->channelTitle;
                                        }



                                        if($margs['get_full_description']=='on'){
                                            $arr = dzsvg_parse_youtube_video($its[$i]['source'], $margs, $fout);


                                            if(is_array($arr)){
                                                $its[$i] = array_merge($its[$i], $arr);
                                            }
//                                            print_r($its[$i]);
                                        }

                                        $i++;

//                                            if ($i > $max_videos + 1){ break; }

                                    }


                                } else {

                                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No videos to be found - ') . $target_file . '</div>');
                                }
//                                print_r($obj);
                            } else {

                                array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('Object channel is not JSON...') . '</div>');
                            }
                        } else {

                            array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('Cannot get info from YouTube API about channel - ') . $target_file . '</div>');
                        }


                        if ($max_videos === 'all') {

                            if (isset($obj->nextPageToken) && $obj->nextPageToken) {
                                $nextPageToken = $obj->nextPageToken;
                            } else {

                                $nextPageToken = '';
                                break;
                            }

                        } else {
                            $nextPageToken = '';
                            break;
                        }

                        $breaker++;
                    }


                    $sw34 = false; // -- true if added to cache
                    $auxa34 = array('id' => $targetfeed, 'items' => $its, 'time' => $_SERVER['REQUEST_TIME']
                    , 'maxlen' => $max_videos

                    );


                    $cacher = false;
                    if (!is_array($cacher)) {
                        $cacher = array();
                    } else {


                        foreach ($cacher as $lab => $cach) {
                            if ($cach['id'] == $targetfeed) {
                                $sw34 = true;

                                $cacher[$lab] = $auxa34;

                                update_option('dzsvg_cache_ytuserchannel', $cacher);

//                                        print_r($cacher);
                                break;
                            }
                        }


                    }

                    if ($sw34 == false) {

                        array_push($cacher, $auxa34);

//                                            print_r($cacher);

                        update_option('dzsvg_cache_ytuserchannel', $cacher);
                    }


                } else {

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('Cannot access channel ID, this is feed - ') . $target_file . '</div>');
                    try {

                        if (isset($obj->error)) {
                            if ($obj->error->errors[0]) {


                                array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . $obj->error->errors[0]->message . '</div>');
                                if (strpos($obj->error->errors[0]->message, 'per-IP or per-Referer restriction') !== false) {

                                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __("Suggestion - go to Video Gallery > Settings and enter your YouTube API Key") . '</div>');
                                } else {

                                }
                            }
                        }

//                                    $arr = json_decode(DZSHelpers::($target_file));
//
//                                    print_r($arr);
                    } catch (Exception $err) {

                    }
                }
            } else {

                array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('Object is not JSON...') . '</div>');
            }
        }

    }
    // --- END user channel



    // --- youtube playlist
    if($subtype=='playlist') {


        $len = count($its) - 1;
        for ($i = 0; $i < $len; $i++) {
            unset($its[$i]);
        }



        $cacher = get_option('dzsvg_cache_ytplaylist');

        $cached = false;
        $found_for_cache = false;


        if ($cacher == false || is_array($cacher) == false || $dzsvg->mainoptions['disable_api_caching'] == 'on') {
            $cached = false;
        } else {

//                print_r($cacher);


            $ik = -1;
            $i = 0;
            for ($i = 0; $i < count($cacher); $i++) {
                if ($cacher[$i]['id'] == $targetfeed) {
                    if(isset($cacher[$i]['maxlen']) && $cacher[$i]['maxlen'] == $max_videos){
                        if ($_SERVER['REQUEST_TIME'] - $cacher[$i]['time'] < 7200) {
                            $ik = $i;

//                                echo 'yabebe';
                            $cached = true;
                            break;
                        }
                    }

                }
            }


            if($cached){

                foreach ($cacher[$ik]['items'] as $lab => $item) {
                    if ($lab === 'settings') {
                        continue;
                    }

                    $its[$lab] = $item;

//                        print_r($item);
//                        echo 'from cache';
                }

            }
        }



        if ($dzsvg->mainoptions['debug_mode'] == 'on') {
            echo 'is cached - '.$cached.' | ';
        }



        if(!$cached){
            if (isset($max_videos) == false || $max_videos == '') {
                $max_videos = 50;
            }
            $yf_maxi = $max_videos;

            if ($max_videos == 'all') {
                $yf_maxi = 50;
            }



            $breaker = 0;

            $i_for_its = 0;
            $nextPageToken = 'none';

            while ($breaker < 10 || $nextPageToken !== '') {


                $str_nextPageToken = '';

                if ($nextPageToken && $nextPageToken != 'none') {
                    $str_nextPageToken = '&pageToken=' . $nextPageToken;
                }

//                echo '$breaker is '.$breaker;

                if($dzsvg->mainoptions['youtube_api_key']==''){
                    $dzsvg->mainoptions['youtube_api_key'] = 'AIzaSyCtrnD7ll8wyyro5f1LitPggaSKvYFIvU4';
                }


                $target_file='https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' . $targetfeed . '&key=' . $dzsvg->mainoptions['youtube_api_key'] . '' . $str_nextPageToken . '&maxResults='.$yf_maxi;

//                    echo $target_file;


                if ($dzsvg->mainoptions['debug_mode'] == 'on') {
                    echo 'target file - '.$target_file;
                }
//                    echo 'target file - '.$target_file;


                $ida = DZSHelpers::get_contents($target_file, array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));

//            echo 'ceva'.$ida;

                if ($ida) {

                    $obj = json_decode($ida);


                    if ($obj && is_object($obj)) {
//                            print_r($obj);


                        if ($obj && is_object($obj)) {

//                                        print_r($obj);

                            if (isset($obj->items[0]->snippet->resourceId->videoId)) {


                                foreach ($obj->items as $ytitem) {
//                                echo 'yt item --- ';print_r($ytitem);


                                    if (isset($ytitem->snippet->resourceId->videoId) == false) {
                                        echo 'this does not have id ? ';
                                        continue;
                                    }



                                    $its[$i_for_its]['source'] = $ytitem->snippet->resourceId->videoId;

                                    if(isset($ytitem->snippet->thumbnails)){

                                        $its[$i_for_its]['thumbnail'] = $ytitem->snippet->thumbnails->medium->url;
                                    }
                                    $its[$i_for_its]['type'] = "youtube";
                                    $its[$i_for_its]['permalink'] = "https://www.youtube.com/watch?v=".$its[$i_for_its]['source'];

                                    $aux = $ytitem->snippet->title;
                                    $lb = array('"', "\r\n", "\n", "\r", "&", "-", "`", '???', "'", '-');
                                    $aux = str_replace($lb, ' ', $aux);
                                    $its[$i_for_its]['title'] = $aux;

                                    $aux = $ytitem->snippet->description;
                                    $lb = array("\r\n","\n","\r");
                                    $aux = str_replace($lb,'<br>',$aux);
                                    $lb = array('"');
                                    $aux = str_replace($lb,'&quot;',$aux);
                                    $lb = array("'");
                                    $aux = str_replace($lb,'&#39;',$aux);


                                    $auxcontent = '<p>' . str_replace(array("\r\n", "\n", "\r"), '</p><p>', $aux) . '</p>';

                                    $its[$i_for_its]['description'] = $auxcontent;
                                    $its[$i_for_its]['menuDescription'] = $auxcontent;

                                    if ($margs['enable_outernav_video_author'] == 'on') {
//                        echo 'ceva';
                                        $its[$i_for_its]['uploader'] = $ytitem->snippet->channelTitle;
                                    }

                                    $i_for_its++;


                                }

                                $found_for_cache=true;


                            } else {

                                array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No youtube playlist videos to be found - maybe API key not set ? This is the feed - '.$target_file) . '</div>');

                                try{

                                    if(isset($obj->error)){
                                        if($obj->error->errors[0]){


                                            array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' .$obj->error->errors[0]->message . '</div>');
                                            if(strpos($obj->error->errors[0]->message, 'per-IP or per-Referer restriction')!==false){

                                                array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __("Suggestion - go to Video Gallery > Settings and enter your YouTube API Key") . '</div>');
                                            }else{

                                            }
                                        }
                                    }

//                                    $arr = json_decode(DZSHelpers::($target_file));
//
//                                    print_r($arr);
                                }catch(Exception $err){

                                }
                            }
                        }
                    }






                    if ($max_videos === 'all') {

                        if (isset($obj->nextPageToken) && $obj->nextPageToken) {
                            $nextPageToken = $obj->nextPageToken;
                        } else {

                            $nextPageToken = '';
                            break;
                        }

                    } else {
                        $nextPageToken = '';
                        break;
                    }


                }
                $breaker++;
            }





            if($found_for_cache){

                $sw34 = false;
                $auxa34 = array(
                    'id' => $targetfeed
                , 'items' => $its
                , 'time' => $_SERVER['REQUEST_TIME']
                , 'maxlen' => $max_videos

                );

                if (!is_array($cacher)) {
                    $cacher = array();
                } else {


                    foreach ($cacher as $lab => $cach) {
                        if ($cach['id'] == $targetfeed) {
                            $sw34 = true;

                            $cacher[$lab] = $auxa34;

                            update_option('dzsvg_cache_ytplaylist', $cacher);

//                                        print_r($cacher);
                            break;
                        }
                    }


                }

                if ($sw34 == false) {

                    array_push($cacher, $auxa34);

//                                            print_r($cacher);

                    update_option('dzsvg_cache_ytplaylist', $cacher);
                }
            }
        }


    }
    // --- END youtube playlist



    // --- youtube search query
    if($subtype=='search') {




        $len = count($its) - 1;
        for ($i = 0; $i < $len; $i++) {
            unset($its[$i]);
        }





        $cacher = get_option('dzsvg_cache_ytkeywords');

        $cached = false;
        $found_for_cache = false;


        if ($cacher == false || is_array($cacher) == false || $dzsvg->mainoptions['disable_api_caching'] == 'on') {
            $cached = false;
        } else {

//                print_r($cacher);


            $ik = -1;
            $i = 0;
            for ($i = 0; $i < count($cacher); $i++) {
                if ($cacher[$i]['id'] == $targetfeed) {
                    if ($_SERVER['REQUEST_TIME'] - $cacher[$i]['time'] < 3600) {
                        $ik = $i;

//                                echo 'yabebe';
                        $cached = true;
                        break;
                    }
                }
            }


            if($cached){

                foreach ($cacher[$ik]['items'] as $lab => $item) {
                    if ($lab === 'settings') {
                        continue;
                    }

                    $its[$lab] = $item;

//                        print_r($item);
//                        echo 'from cache';
                }

            }
        }




        if(!$cached){
            if (isset($max_videos) == false || $max_videos == '') {
                $max_videos = 50;
            }
            $yf_maxi = $max_videos;

            if ($max_videos == 'all') {
                $yf_maxi = 50;
            }



            $breaker = 0;

            $i_for_its = 0;
            $nextPageToken = 'none';

            while ($breaker < 5 || $nextPageToken !== '') {


                $str_nextPageToken = '';

                if ($nextPageToken && $nextPageToken != 'none') {
                    $str_nextPageToken = '&pageToken=' . $nextPageToken;
                }

//                echo '$breaker is '.$breaker;


                $targetfeed = str_replace(' ','+',$targetfeed);


                if($dzsvg->mainoptions['youtube_api_key']==''){
                    $dzsvg->mainoptions['youtube_api_key'] = 'AIzaSyCtrnD7ll8wyyro5f1LitPggaSKvYFIvU4';
                }

                $target_file='https://www.googleapis.com/youtube/v3/search?part=snippet&q=' . $targetfeed . '&type=video&key=' . $dzsvg->mainoptions['youtube_api_key'] . $str_nextPageToken.'&maxResults='.$yf_maxi;


                $ida = DZSHelpers::get_contents($target_file, array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));

//            echo 'ceva'.$ida;

                if ($ida) {

                    $obj = json_decode($ida);


                    if ($obj && is_object($obj)) {
//                                print_r($obj);



                        if (isset($obj->items[0]->id->videoId)) {


                            foreach ($obj->items as $ytitem) {
//                                print_r($ytitem);


                                if (isset($ytitem->id->videoId) == false) {
                                    echo 'this does not have id ? ';
                                    continue;
                                }
                                $its[$i_for_its]['source'] = $ytitem->id->videoId;
                                $its[$i_for_its]['thethumb'] = $ytitem->snippet->thumbnails->medium->url;
                                $its[$i_for_its]['type'] = "youtube";
                                $its[$i_for_its]['permalink'] = "https://www.youtube.com/watch?v=".$its[$i_for_its]['source'];

                                $aux = $ytitem->snippet->title;
                                $lb = array('"', "\r\n", "\n", "\r", "&", "-", "`", '???', "'", '-');
                                $aux = str_replace($lb, ' ', $aux);
                                $its[$i_for_its]['title'] = $aux;

                                $aux = $ytitem->snippet->description;
                                $lb = array("\r\n","\n","\r");
                                $aux = str_replace($lb,'<br>',$aux);
                                $lb = array('"');
                                $aux = str_replace($lb,'&quot;',$aux);
                                $lb = array("'");
                                $aux = str_replace($lb,'&#39;',$aux);


                                $auxcontent = '<p>' . str_replace(array("\r\n", "\n", "\r"), '</p><p>', $aux) . '</p>';

                                $its[$i_for_its]['description'] = $auxcontent;
                                $its[$i_for_its]['menuDescription'] = $auxcontent;

                                if ($margs['enable_outernav_video_author'] == 'on') {
//                        echo 'ceva';
                                    $its[$i_for_its]['uploader'] = $ytitem->snippet->channelTitle;
                                }

                                $i_for_its++;

                                $found_for_cache = true;

                            }


                        } else {

                            array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No youtube keyboard videos to be found') . '</div>');
                        }

                    }






                    if ($max_videos === 'all') {

                        if (isset($obj->nextPageToken) && $obj->nextPageToken) {
                            $nextPageToken = $obj->nextPageToken;
                        } else {

                            $nextPageToken = '';
                            break;
                        }

                    } else {
                        $nextPageToken = '';
                        break;
                    }


                }else{

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No youtube keyboards ida found '.$target_file) . '</div>');
                }
                $breaker++;
            }



            if($found_for_cache){

                $sw34 = false;
                $auxa34 = array(
                    'id' => $targetfeed
                , 'items' => $its
                , 'time' => $_SERVER['REQUEST_TIME']
                , 'maxlen' => $max_videos

                );

                if (!is_array($cacher)) {
                    $cacher = array();
                } else {


                    foreach ($cacher as $lab => $cach) {
                        if ($cach['id'] == $targetfeed) {
                            $sw34 = true;

                            $cacher[$lab] = $auxa34;

                            update_option('dzsvg_cache_ytkeywords', $cacher);

//                                        print_r($cacher);
                            break;
                        }
                    }


                }


                if ($sw34 == false) {

                    array_push($cacher, $auxa34);

//                                            print_r($cacher);

                    update_option('dzsvg_cache_ytkeywords', $cacher);
                }
            }



        }

    }
    // --- END youtube search query





    return $its;
}


function dzsvg_parse_vimeo($link, $pargs = array(), &$fout=null){


    global $dzsvg;


    $margs = array(
        'max_videos' => '5',
        'enable_outernav_video_author' => 'off',
        'striptags' => 'off',
        'vimeo_sort' => 'default',
        'type' => 'detect',
    );

    if (!is_array($pargs)) {
        $pargs = array();
    }

    $margs = array_merge($margs, $pargs);

    $its = array();


    $type = '';
    $from_logged_in_api = false; // -- this will establish if the feed is from the logged in api


    if($margs['type']=='detect'){
        if(strpos($link,'vimeo.com/album')!==false){
            $type='album';
        }elseif(strpos($link,'vimeo.com/channels')!==false){

            $type='channel';
        }else{

            $type='user';
        }
    }else{
        $type = $margs['type'];
    }





    if($type==''){
        $type='user';
    }


//    echo 'type - '.$type;


//    echo $type;


    $targetfeed = '';
    $q_strings = explode('/',$link);

//    print_r($q_strings);

    if($type=='album'){

        $targetfeed = $q_strings[count($q_strings)-1];

//        echo $targetfeed;
    }
    if($type=='channel'){

        $targetfeed = $q_strings[count($q_strings)-1];

//        echo $targetfeed;
    }
    if($type=='user'){

        $targetfeed = $q_strings[count($q_strings)-1];


        if($targetfeed=='videos'){

            $targetfeed = $q_strings[count($q_strings)-2];
        }
//        echo 'targetfeed - '.$targetfeed;
    }



//    print_r($margs);
//    echo 'link - '.$link;
//    echo 'type - '.$type;

    $max_videos = $margs['max_videos'];



    // --- vimeo album
    if($type=='album') {





        $cacher = get_option('dzsvg_cache_vmalbum');

        $cached = false;


        if ($cacher == false || is_array($cacher) == false || $dzsvg->mainoptions['disable_api_caching'] == 'on') {
            $cached = false;
        } else {

//                print_r($cacher);


            $ik = -1;
            $i = 0;
            for ($i = 0; $i < count($cacher); $i++) {
                if ($cacher[$i]['id'] == $targetfeed) {
                    if ($_SERVER['REQUEST_TIME'] - $cacher[$i]['time'] < 7200) {
                        $ik = $i;

//                                echo 'yabebe';
                        $cached = true;
                        break;
                    }
                }
            }


            if($cached) {
                foreach ($cacher[$ik]['items'] as $lab => $item) {
                    if ($lab === 'settings') {
                        continue;
                    }

                    $its[$lab] = $item;
                }
            }

        }





        if($cached==false){
            $target_file = "http://vimeo.com/api/v2/album/".$targetfeed."/videos.json";

            $ida = '';
            if ($dzsvg->mainoptions['vimeo_api_client_id'] != '' && $dzsvg->mainoptions['vimeo_api_client_secret'] != '' && $dzsvg->mainoptions['vimeo_api_access_token'] != '' ) {



                if (!class_exists('Vimeo')) {
                    require_once(dirname(dirname(__FILE__)).'/vimeoapi/vimeo.php');
                }

                $vimeo_id = $dzsvg->mainoptions['vimeo_api_user_id']; // Get from https://vimeo.com/settings, must be in the form of user123456
                $consumer_key = $dzsvg->mainoptions['vimeo_api_client_id'];
                $consumer_secret = $dzsvg->mainoptions['vimeo_api_client_secret'];
                $token = $dzsvg->mainoptions['vimeo_api_access_token'];


                $sort_call = '';


                if($margs['vimeo_sort'] &&$margs['vimeo_sort']!='default'){
                    $sort_call.='&sort='.$margs['vimeo_sort'];
                }

                // Do an authentication call
                $vimeo = new Vimeo($consumer_key,$consumer_secret);
                $vimeo->setToken($token); // -- $token_secret
                $request = '/albums/'.$targetfeed.'/videos?per_page='.$max_videos.$sort_call;
                $vimeo_response = $vimeo->request($request);


                if ($dzsvg->mainoptions['debug_mode'] == 'on') {


                    echo '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . __('video response', 'dzsvg') . '</div>
<div class="toggle-content">';
                    echo'cached - ( ' . $cached . ' )  <br>';
                    echo'api call request - ( ' . $request . ' ) <br>';
                    echo (print_rr($vimeo_response, array('echo' => false, 'encode_html' => true)));
                    echo '</div></div>';
                }

                if ($vimeo_response['status'] != 200) {
                    error_log('dzsvg.php line 4023: '.$vimeo_response['body']['message']);
                }
                if (isset($vimeo_response['body']['data'])) {
                    $ida = $vimeo_response['body']['data'];
                }
                $from_logged_in_api = true;
            } else {
                $ida = DZSHelpers::get_contents($target_file,array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));
                $from_logged_in_api = false;
            }



            if ($dzsvg->mainoptions['debug_mode'] == 'on') {
                echo 'debug mode: mode vimeo album target file - '.$targetfeed
                    .'<br>cached - '.$cached.'<br>vimeo_response is:';
//                print_r($ida);
            }


            $jida = $ida;
//        if (is_array($ida)) {
//            $jida = json_encode($ida);
//        }

            if($from_logged_in_api){
                $idar = array_merge(array(), $ida);
//                print_r($idar);


                // -- authentificated CALL





                if(is_array($idar) && count($idar)){

                    $i=0;
                    foreach ($idar as $item){


                        if(is_object($item)){
//                        echo 'cev23a';
                            $item = (array) $item;
                        }
//                    print_r($item);

                        $auxa = array();
                        if(isset($item['uri'])){
                            $auxa = explode('/',$item['uri']);
                        }
                        if(isset($item['url'])){
                            $auxa = explode('/',$item['url']);
                        }
                        $its[$i]['source'] = $auxa[count($auxa) - 1];

//                    print_r($item['pictures']);





                        $vimeo_quality_ind = 2;

                        if($dzsvg->mainoptions['vimeo_thumb_quality']=='medium'){

                            $vimeo_quality_ind = 3;
                        }

                        if($dzsvg->mainoptions['vimeo_thumb_quality']=='high'){

                            $vimeo_quality_ind = 4;
                        }

                        if(is_object($item['pictures'])){
                            $item['pictures'] = (array) $item['pictures'];
                            if(is_object($item['pictures']['sizes'])){
                                $item['pictures']['sizes'] = (array) $item['pictures']['sizes'];
                            }

                            if(is_object($item['pictures']['sizes'][$vimeo_quality_ind])){
                                $item['pictures']['sizes'][$vimeo_quality_ind] = (array) $item['pictures']['sizes'][$vimeo_quality_ind];
                            }
                            $its[$i]['thumbnail'] = $item['pictures']['sizes'][$vimeo_quality_ind]['link'];
                        }else{

//                        if(isset($item['thumbnail_medium'])){
//
//                            $its[$i]['thethumb'] = $item['thumbnail_medium'];
//                        }
                            if(isset($item['thumbnail_large'])){

                                $its[$i]['thumbnail'] = $item['thumbnail_large'];
                            }
                            if(isset($item['pictures']['sizes'][$vimeo_quality_ind]['link'])){

                                $its[$i]['thumbnail'] = $item['pictures']['sizes'][$vimeo_quality_ind]['link'];
                            }

                            $its[$i]['thethumb'] = $its[$i]['thumbnail'];
//                        echo $its[$i]['thethumb'];
                        }
                        $its[$i]['type'] = "vimeo";


                        if(isset($item['name'])){
                            $aux = $item['name'];

                        }
                        if(isset($item['title'])){
                            $aux = $item['title'];
                        }




                        $lb = array('"',"\r\n","\n","\r","&","-","`",'???',"'",'-');
                        $aux = str_replace($lb,' ',$aux);
                        $its[$i]['title'] = $aux;


                        $aux = $item['description'];
                        if($margs['striptags']=='on'){
                            $aux = strip_tags($aux);
                        }
                        $lb = array("\r\n","\n","\r");
                        $aux = str_replace($lb,'<br>',$aux);
                        $lb = array('"');
                        $aux = str_replace($lb,'&quot;',$aux);
                        $lb = array("'");
                        $aux = str_replace($lb,'&#39;',$aux);
                        $its[$i]['description'] = $aux;
                        $its[$i]['menuDescription'] = $aux;
                        $i++;
                    }
                }else{

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No items found ? This is the feed - '.$target_file) . '</div>');

                }
            }else{

                if (!is_object($ida) && !is_array($ida)) {
                    $idar = json_decode($ida); // -- vmuser
                } else {
                    $idar = $ida;
                }



                if(is_array($idar) && count($idar)){

                    $i_for_its=0;
                    foreach ($idar as $item){


                        $its[$i_for_its]['source'] = $item->id;
                        $its[$i_for_its]['thumbnail'] = $item->thumbnail_medium;
                        $its[$i_for_its]['type'] = "vimeo";

                        $aux = $item->title;
                        $lb = array('"',"\r\n","\n","\r","&","-","`",'???',"'",'-');
                        $aux = str_replace($lb,' ',$aux);
                        $its[$i_for_its]['title'] = $aux;

                        $aux = $item->description;
                        $lb = array("\r\n","\n","\r","&",'???');
                        $aux = str_replace($lb,' ',$aux);
                        $lb = array('"');
                        $aux = str_replace($lb,'&quot;',$aux);
                        $lb = array("'");
                        $aux = str_replace($lb,'&#39;',$aux);
                        $its[$i_for_its]['menuDescription'] = $aux;


                        $i_for_its++;
                    }
                }else{

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No items found ? This is the feed - '.$target_file) . '</div>');

                }
            }
            if ($dzsvg->mainoptions['disable_api_caching'] != 'on') {
                $cache_mainaux = array();
                $cache_aux = array(
                    'items' => $its
                ,'id' => $targetfeed
                ,'time' => $_SERVER['REQUEST_TIME']
                ,'from_logged_in_api' => $from_logged_in_api
                ,'maxlen' => $max_videos
                );
                array_push($cache_mainaux,$cache_aux);
                update_option('dzsvg_cache_vmalbum',$cache_mainaux);
            }



        }
    }



    // --- END vimeo album




    // -- vimeo CHANNEL
    if($type=='channel') {



//        echo 'what';


        $cacher = get_option('dzsvg_cache_vmchannel');

        $cached = false;


        if ($cacher == false || is_array($cacher) == false || $dzsvg->mainoptions['disable_api_caching'] == 'on') {
            $cached = false;
        } else {

//                print_r($cacher);


            $ik = -1;
            $i = 0;
            for ($i = 0; $i < count($cacher); $i++) {
                if ($cacher[$i]['id'] == $targetfeed) {
                    if(isset($cacher[$i]['maxlen']) && $cacher[$i]['maxlen'] == $max_videos) {
                        if ($_SERVER['REQUEST_TIME'] - $cacher[$i]['time'] < 7200) {
                            $ik = $i;

//                                echo 'yabebe';
                            $cached = true;
                            break;
                        }
                    }
                }
            }


            if($cached) {
                foreach ($cacher[$ik]['items'] as $lab => $item) {
                    if ($lab === 'settings') {
                        continue;
                    }

                    $its[$lab] = $item;
                }
            }

        }

//        echo 'cached - '.$cached;

        //-- vimeo channel



        if($cached==false){
            $target_file = "http://vimeo.com/api/v2/channel/".$targetfeed."/videos.json";

            $ida = '';
            if ($dzsvg->mainoptions['vimeo_api_client_id'] != '' && $dzsvg->mainoptions['vimeo_api_client_secret'] != '' && $dzsvg->mainoptions['vimeo_api_access_token'] != '' ) {



                if (!class_exists('Vimeo')) {
                    require_once(dirname(dirname(__FILE__)).'/vimeoapi/vimeo.php');
                }

                $vimeo_id = $dzsvg->mainoptions['vimeo_api_user_id']; // Get from https://vimeo.com/settings, must be in the form of user123456
                $consumer_key = $dzsvg->mainoptions['vimeo_api_client_id'];
                $consumer_secret = $dzsvg->mainoptions['vimeo_api_client_secret'];
                $token = $dzsvg->mainoptions['vimeo_api_access_token'];

                // Do an authentication call
                $vimeo = new Vimeo($consumer_key,$consumer_secret);
                $vimeo->setToken($token); //,$token_secret
                $vimeo_response = $vimeo->request('/channels/'.$targetfeed.'/videos?per_page='.$max_videos);


                if ($dzsvg->mainoptions['debug_mode'] == 'on') {




                    $fout.= '<div class="dzstoggle toggle1" rel="">
<div class="toggle-title" style="">' . sprintf(__('mode vimeo %s - making autetificated call', 'dzsvg'),$type) . '</div>
<div class="toggle-content">';
                    $fout.='cached - ( ' . $cached . ' )  cacher is...<br>';
                    $fout.=(print_rr($vimeo_response, array('echo' => false, 'encode_html' => true)));
                    $fout.= '</div></div>';
                }

                if ($vimeo_response['status'] != 200) {
                    error_log('dzsvg.php line 4023: '.$vimeo_response['body']['message']);
                }
                if (isset($vimeo_response['body']['data'])) {
                    $ida = $vimeo_response['body']['data'];
                }
                $from_logged_in_api = true;
            } else {
                $ida = DZSHelpers::get_contents($target_file,array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));
                $from_logged_in_api = false;
            }



            if ($dzsvg->mainoptions['debug_mode'] == 'on') {
                echo 'debug mode: mode vimeo album target file - '.$targetfeed
                    .'<br>cached - '.$cached.'<br>vimeo_response is:';
//                print_r($ida);
            }


            $jida = $ida;
//        if (is_array($ida)) {
//            $jida = json_encode($ida);
//        }

            if($from_logged_in_api){

                $idar = array();
                if(is_array($ida)) {
                    $idar = array_merge(array(), $ida);
                }
//                print_r($idar);


                // -- authentificated CALL





                if(is_array($idar) && count($idar)){

                    $i=0;
                    foreach ($idar as $item){


                        if(is_object($item)){
//                        echo 'cev23a';
                            $item = (array) $item;
                        }
//                    print_r($item);

                        $auxa = array();
                        if(isset($item['uri'])){
                            $auxa = explode('/',$item['uri']);
                        }
                        if(isset($item['url'])){
                            $auxa = explode('/',$item['url']);
                        }
                        $its[$i]['source'] = $auxa[count($auxa) - 1];

//                    print_r($item['pictures']);





                        $vimeo_quality_ind = 2;

                        if($dzsvg->mainoptions['vimeo_thumb_quality']=='medium'){

                            $vimeo_quality_ind = 3;
                        }

                        if($dzsvg->mainoptions['vimeo_thumb_quality']=='high'){

                            $vimeo_quality_ind = 4;
                        }

                        if(is_object($item['pictures'])){
                            $item['pictures'] = (array) $item['pictures'];
                            if(is_object($item['pictures']['sizes'])){
                                $item['pictures']['sizes'] = (array) $item['pictures']['sizes'];
                            }

                            if(is_object($item['pictures']['sizes'][$vimeo_quality_ind])){
                                $item['pictures']['sizes'][$vimeo_quality_ind] = (array) $item['pictures']['sizes'][$vimeo_quality_ind];
                            }
                            $its[$i]['thumbnail'] = $item['pictures']['sizes'][$vimeo_quality_ind]['link'];
                        }else{

//                        if(isset($item['thumbnail_medium'])){
//
//                            $its[$i]['thethumb'] = $item['thumbnail_medium'];
//                        }
                            if(isset($item['thumbnail_large'])){

                                $its[$i]['thumbnail'] = $item['thumbnail_large'];
                            }
                            if(isset($item['pictures']['sizes'][$vimeo_quality_ind]['link'])){

                                $its[$i]['thumbnail'] = $item['pictures']['sizes'][$vimeo_quality_ind]['link'];
                            }


//                        echo $its[$i]['thethumb'];
                        }
                        $its[$i]['type'] = "vimeo";


                        if(isset($item['name'])){
                            $aux = $item['name'];

                        }
                        if(isset($item['title'])){
                            $aux = $item['title'];
                        }




                        $lb = array('"',"\r\n","\n","\r","&","-","`",'???',"'",'-');
                        $aux = str_replace($lb,' ',$aux);
                        $its[$i]['title'] = $aux;


                        $aux = $item['description'];
                        if($margs['striptags']=='on'){
                            $aux = strip_tags($aux);
                        }
                        $lb = array("\r\n","\n","\r");
                        $aux = str_replace($lb,'<br>',$aux);
                        $lb = array('"');
                        $aux = str_replace($lb,'&quot;',$aux);
                        $lb = array("'");
                        $aux = str_replace($lb,'&#39;',$aux);
                        $its[$i]['description'] = $aux;
                        $its[$i]['menuDescription'] = $aux;
                        $i++;
                    }
                }else{

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No items found ? This is the feed - '.$target_file) . '</div>');

                }
            }else{

                if (!is_object($ida) && !is_array($ida)) {
                    $idar = json_decode($ida); // -- vmuser
                } else {
                    $idar = $ida;
                }



                if(is_array($idar) && count($idar)){

                    $i_for_its=0;
                    foreach ($idar as $item){


                        $its[$i_for_its]['source'] = $item->id;
                        $its[$i_for_its]['thumbnail'] = $item->thumbnail_medium;
                        $its[$i_for_its]['type'] = "vimeo";

                        $aux = $item->title;
                        $lb = array('"',"\r\n","\n","\r","&","-","`",'???',"'",'-');
                        $aux = str_replace($lb,' ',$aux);
                        $its[$i_for_its]['title'] = $aux;

                        $aux = $item->description;
                        $lb = array("\r\n","\n","\r","&",'???');
                        $aux = str_replace($lb,' ',$aux);
                        $lb = array('"');
                        $aux = str_replace($lb,'&quot;',$aux);
                        $lb = array("'");
                        $aux = str_replace($lb,'&#39;',$aux);
                        $its[$i_for_its]['menuDescription'] = $aux;


                        $i_for_its++;
                    }
                }else{

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No items found ? This is the feed - '.$target_file) . '</div>');

                }
            }
            if ($dzsvg->mainoptions['disable_api_caching'] != 'on') {
                $cache_mainaux = array();
                $cache_aux = array(
                    'items' => $its
                ,'id' => $targetfeed
                ,'time' => $_SERVER['REQUEST_TIME']
                ,'from_logged_in_api' => $from_logged_in_api
                ,'maxlen' => $max_videos
                );
                array_push($cache_mainaux,$cache_aux);
                update_option('dzsvg_cache_vmchannel',$cache_mainaux);
            }



        }
    }



    // --- END vimeo channel












    // -- vimeo CHANNEL
    if($type=='user') {





        $cacher = get_option('dzsvg_cache_vmuser');

        $cached = false;


//        echo 'hmm';
        if ($cacher == false || is_array($cacher) == false || $dzsvg->mainoptions['disable_api_caching'] == 'on') {
            $cached = false;
        } else {

//                print_r($cacher);


            $ik = -1;
            $i = 0;
            for ($i = 0; $i < count($cacher); $i++) {
                if ($cacher[$i]['id'] == $targetfeed) {
                    if(isset($cacher[$i]['maxlen']) && $cacher[$i]['maxlen'] == $max_videos) {
                        if ($_SERVER['REQUEST_TIME'] - $cacher[$i]['time'] < 7200) {
                            $ik = $i;

//                                echo 'yabebe';
                            $cached = true;
                            break;
                        }
                    }
                }
            }


            if($cached) {
                foreach ($cacher[$ik]['items'] as $lab => $item) {
                    if ($lab === 'settings') {
                        continue;
                    }

                    $its[$lab] = $item;
                }
            }

        }

//        echo 'cached - '.$cached;
//        print_r($its);

        //-- vimeo channel



        if($cached==false){
            $target_file = "http://vimeo.com/api/v2/".$targetfeed."/videos.json";

//            echo 'target_file - '.$target_file;

            $ida = '';
            if ($dzsvg->mainoptions['vimeo_api_client_id'] != '' && $dzsvg->mainoptions['vimeo_api_client_secret'] != '' && $dzsvg->mainoptions['vimeo_api_access_token'] != '' ) {




                if (!class_exists('Vimeo')) {
                    require_once(dirname(dirname(__FILE__)).'/vimeoapi/vimeo.php');
                }



                $vimeo_id = $dzsvg->mainoptions['vimeo_api_user_id']; // Get from https://vimeo.com/settings, must be in the form of user123456
                $consumer_key = $dzsvg->mainoptions['vimeo_api_client_id'];
                $consumer_secret = $dzsvg->mainoptions['vimeo_api_client_secret'];
                $token = $dzsvg->mainoptions['vimeo_api_access_token'];

                // Do an authentication call
                $vimeo = new Vimeo($consumer_key,$consumer_secret);
                $vimeo->setToken($token); //,$token_secret

                if($max_videos==''){
                    $max_videos='25';
                }
                $vimeo_response = $vimeo->request('/users/'.$targetfeed.'/videos?per_page='.$max_videos);


                if ($dzsvg->mainoptions['debug_mode'] == 'on') {

                    echo '<pre>debug mode: mode vimeo user - making autetificated call - '
                        .'<br>targetfeed is - '.$targetfeed.' max_videos - '.$max_videos;
                        echo '<br>$vimeo_response is:';
                    print_r($vimeo_response);
                    echo '</pre>';
                }

                if ($vimeo_response['status'] != 200) {
//                    print_r($vimeo_response);
                    error_log('dzsvg.php line 4023: '.$vimeo_response['body']['message']);
                }
                if (isset($vimeo_response['body']['data'])) {
                    $ida = $vimeo_response['body']['data'];
                }



                $from_logged_in_api = true;
            } else {
                $ida = DZSHelpers::get_contents($target_file,array('force_file_get_contents' => $dzsvg->mainoptions['force_file_get_contents']));
                $from_logged_in_api = false;
            }



            if ($dzsvg->mainoptions['debug_mode'] == 'on') {
                echo 'debug mode: mode vimeo album target file - '.$targetfeed
                    .'<br>cached - '.$cached.'<br>vimeo_response is:';
//                print_r($ida);
            }


            $jida = $ida;
//        if (is_array($ida)) {
//            $jida = json_encode($ida);
//        }

            if($from_logged_in_api){

                $idar = array();
                if(is_array($ida)){

                    $idar = array_merge(array(), $ida);
                }
//                print_r($idar);


                // -- authentificated CALL





                if(is_array($idar) && count($idar)){

                    $i=0;
                    foreach ($idar as $item){


                        if(is_object($item)){
//                        echo 'cev23a';
                            $item = (array) $item;
                        }
//                    print_r($item);


                        $its[$i]['upload_date'] = $item['created_time'];
                        $its[$i]['author_display_name'] = $item['user']['name'];

                        $auxa = array();
                        if(isset($item['uri'])){
                            $auxa = explode('/',$item['uri']);
                        }
                        if(isset($item['url'])){
                            $auxa = explode('/',$item['url']);
                        }
                        $its[$i]['source'] = $auxa[count($auxa) - 1];

//                    print_r($item['pictures']);





                        $vimeo_quality_ind = 2;

                        if($dzsvg->mainoptions['vimeo_thumb_quality']=='medium'){

                            $vimeo_quality_ind = 3;
                        }

                        if($dzsvg->mainoptions['vimeo_thumb_quality']=='high'){

                            $vimeo_quality_ind = 4;
                        }

                        if(is_object($item['pictures'])){
                            $item['pictures'] = (array) $item['pictures'];
                            if(is_object($item['pictures']['sizes'])){
                                $item['pictures']['sizes'] = (array) $item['pictures']['sizes'];
                            }

                            if(is_object($item['pictures']['sizes'][$vimeo_quality_ind])){
                                $item['pictures']['sizes'][$vimeo_quality_ind] = (array) $item['pictures']['sizes'][$vimeo_quality_ind];
                            }
                            $its[$i]['thumbnail'] = $item['pictures']['sizes'][$vimeo_quality_ind]['link'];
                        }else{

//                        if(isset($item['thumbnail_medium'])){
//
//                            $its[$i]['thethumb'] = $item['thumbnail_medium'];
//                        }
                            if(isset($item['thumbnail_large'])){

                                $its[$i]['thumbnail'] = $item['thumbnail_large'];
                            }
                            if(isset($item['pictures']['sizes'][$vimeo_quality_ind]['link'])){

                                $its[$i]['thumbnail'] = $item['pictures']['sizes'][$vimeo_quality_ind]['link'];
                            }


//                        echo $its[$i]['thethumb'];
                        }
                        $its[$i]['type'] = "vimeo";


                        if(isset($item['name'])){
                            $aux = $item['name'];

                        }
                        if(isset($item['title'])){
                            $aux = $item['title'];
                        }




                        $lb = array('"',"\r\n","\n","\r","&","-","`",'???',"'",'-');
                        $aux = str_replace($lb,' ',$aux);
                        $its[$i]['title'] = $aux;


                        $aux = $item['description'];
                        if($margs['striptags']=='on'){
                            $aux = strip_tags($aux);
                        }
                        $lb = array("\r\n","\n","\r");
                        $aux = str_replace($lb,'<br>',$aux);
                        $lb = array('"');
                        $aux = str_replace($lb,'&quot;',$aux);
                        $lb = array("'");
                        $aux = str_replace($lb,'&#39;',$aux);

//                        echo $aux;
                        $its[$i]['description'] = $aux;
                        $its[$i]['menuDescription'] = $aux;
                        $i++;
                    }
                }else{

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No items found ? This is the feed - '.$target_file) . '</div>');

                }
            }else{

                if (!is_object($ida) && !is_array($ida)) {
                    $idar = json_decode($ida); // -- vmuser
                } else {
                    $idar = $ida;
                }


                // -- NOT authentificated CALL

                if(is_array($idar) && count($idar)){

                    $i_for_its=0;
                    foreach ($idar as $item){

//                        print_r($item);

                        $its[$i_for_its]['source'] = $item->id;
                        $its[$i_for_its]['thumbnail'] = $item->thumbnail_medium;
                        $its[$i_for_its]['type'] = "vimeo";
                        $its[$i_for_its]['author_display_name'] = $item->user_name;
                        $its[$i_for_its]['upload_date'] = $item->upload_date;

                        $aux = $item->title;
                        $lb = array('"',"\r\n","\n","\r","&","-","`",'???',"'",'-');
                        $aux = str_replace($lb,' ',$aux);
                        $its[$i_for_its]['title'] = $aux;

                        $aux = $item->description;
                        $lb = array("\r\n","\n","\r","&",'???');
                        $aux = str_replace($lb,' ',$aux);
                        $lb = array('"');
                        $aux = str_replace($lb,'&quot;',$aux);
                        $lb = array("'");
                        $aux = str_replace($lb,'&#39;',$aux);
                        $its[$i_for_its]['menuDescription'] = $aux;


                        $i_for_its++;
                    }
                }else{

                    array_push($dzsvg->arr_api_errors, '<div class="dzsvg-error">' . __('No items found ? This is the feed - '.$target_file) . '</div>');

                }
            }
            if ($dzsvg->mainoptions['disable_api_caching'] != 'on') {
                $cache_mainaux = array();
                $cache_aux = array(
                    'items' => $its
                ,'id' => $targetfeed
                ,'time' => $_SERVER['REQUEST_TIME']
                ,'from_logged_in_api' => $from_logged_in_api
                ,'maxlen' => $max_videos
                );
                array_push($cache_mainaux,$cache_aux);
                update_option('dzsvg_cache_vmuser',$cache_mainaux);
            }



        }
    }



    // --- END vimeo user






    return $its;
}