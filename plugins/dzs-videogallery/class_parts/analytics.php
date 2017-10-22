<?php


function dzsvg_analytics_dashboard_content(){
    global $dzsvg;






    $dzsvg->analytics_get();
    if($dzsvg->analytics_views==false){
        $dzsvg->analytics_views = array();
    }
    if($dzsvg->analytics_minutes==false){
        $dzsvg->analytics_minutes = array();
    }

//    print_r($dzsvg->analytics_minutes);

    $str_views = '';
    $str_minutes = '';

//    print_r($dzsvg->analytics_views);

    $added_view = false;



    $videos_views = array();

    // -- sample data

//
//    for($i=30; $i>=2; $i--){
//
//        $date_aux = date("Y-m-d", time() - 60 * 60 * (24*$i));
//        $views = rand(500,1000);
//
//
//        $aux = array(
//            'video_title' => '',
//            'views' => $views,
//            'date' => $date_aux,
//            'country' => '',
//        );
//
//        $dzsvg->analytics_views[30-$i] = $aux;
//
//
//        update_option('dzsvg_analytics_views', $dzsvg->analytics_views);
//    }

//
//    for($i=30; $i>=2; $i--){
//
//        $date_aux = date("Y-m-d", time() - 60 * 60 * (24*$i));
//        $views = rand(0,1000);
//
//
//        array_push($dzsvg->analytics_minutes, array(
//            'video_title' => '',
//            'seconds' => $views,
//            'date' => $date_aux,
//            'country' => '',
//        ));
//
//
//        update_option('dzsvg_analytics_minutes', $dzsvg->analytics_minutes);
//    }




    $locs_array = array();


    if( (isset($_GET['action']) && $_GET['action']=='dzsvg_show_analytics_for_video') == false ){



    for($i=30; $i>=0; $i--){



        $date_aux = date("Y-m-d", time() - 60 * 60 * (24*$i));




        // -- @views
        $views = 0;


        foreach($dzsvg->analytics_views as $av){
//            print_r($av);

            if($date_aux == $av['date']){

                $views+=$av['views'];


                $sw_found = false;
                foreach($videos_views as $lab => $vv){
                    if($vv['video_title']==$av['video_title']){

                        $videos_views[$lab]['views']+=$av['views'];

                        $sw_found = true;
                        break;
                    }
                }

                if(!$sw_found){
                    array_push($videos_views, array(
                        'video_title' => $av['video_title'],
                        'views' => $av['views'],
                        'seconds' => '0',
                    ));
                }
            }


            if($dzsvg->mainoptions['analytics_enable_location']=='on'){

                if(isset($av['country'])){
                    if(isset($locs_array[$av['country']])){

                        $locs_array[$av['country']] += $av['views'];
                    }else{

                        $locs_array[$av['country']] = $av['views'];
                    }
                }

            }
        }

        if($views>0){
            $str_views.=',';

            $str_views.='["'.$date_aux.'", '.$views.']';

            $added_view = true;
        }


        // -- @minutes
        $views = 0;
        foreach($dzsvg->analytics_minutes as $av){

            if($date_aux == $av['date']){

                $views+=$av['seconds'];


                $sw_found = false;
                foreach($videos_views as $lab => $vv){
                    if($vv['video_title']==$av['video_title']){

                        $videos_views[$lab]['seconds']+=$av['seconds'];

                        $sw_found = true;
                        break;
                    }
                }

                if(!$sw_found){
                    array_push($videos_views, array(
                        'video_title' => $av['video_title'],
                        'views' => '0',
                        'seconds' => $av['seconds'],
                    ));
                }
            }
        }


//        echo $views;

//        echo ' views - '.$views;
        if($views>0){
            $str_minutes.=',';

            $str_minutes.='["'.$date_aux.'", '.intval($views/60).']';

            $added_view = true;
        }else{

            $str_minutes.=',';
            $str_minutes.='["'.$date_aux.'", '.'0'.']';
        }


        // -- tbc minutes will go here as well


    }

//    print_r($videos_views);
//        print_r($locs_array);

        $str_locs = '';

        if($dzsvg->mainoptions['analytics_enable_location']=='on'){
            foreach($locs_array as $lab => $val){

                if($val>0){
                    $str_locs.=',';

                    $str_locs.='["'.$lab.'", '.$val.']';

                    $added_view = true;
                }
            }
        }


    ?>
    <h4><?php echo ("Views"); ?></h4>
<div id="chart_div"></div>
    <br>
    <br>
    <h4><?php echo ("Minutes Viewed"); ?></h4>
<div id="chart_div2"></div>
        <?php if($dzsvg->mainoptions['analytics_enable_location']=='on'){
            ?>

    <br>
    <br>
        <h4><?php echo ("Geo Map"); ?></h4>
        <div id="regions_div"></div>
            <?php
        }
            ?>

    <br>
    <br>
    <h4><?php echo ("Video by Title"); ?></h4>
    <table class="pages-table">
        <thead>
        <tr>
            <th class="column-name">Video Title</th>
            <th class="column-author">Views</th>
            <th class="column-date">Minutes</th>

        </tr>
        </thead>
        <tbody>
        <?php foreach($videos_views as $vv){

            $title = __("Anonim");

            if($vv['video_title']){
                $title = $vv['video_title'];
            }

            echo '<tr>';
            echo '<td>';

            if($dzsvg->mainoptions['analytics_enable_user_track']=='on' && $vv['video_title']){
                echo '<a href="index.php?action=dzsvg_show_analytics_for_video&title='.urlencode($vv['video_title']).'">';
            }
            echo $title;
            if($dzsvg->mainoptions['analytics_enable_user_track']=='on' && $vv['video_title']){
                echo '</a>';
            }

            echo '</td>';
            echo '<td>'.$vv['views'].'</td>';
            echo '<td>'.intval($vv['seconds']/ 60).'</td>';
            echo '</tr>';
        }
        ?>

        </tbody>
    </table>

<script>
google.charts.load('current', {packages: ['corechart', 'bar','geochart']});
google.charts.setOnLoadCallback(drawAnnotations);

function drawAnnotations() {
    <?php

    if($str_minutes==''){
        $str_minutes=0;
    }

    ?>
var data = google.visualization.arrayToDataTable([
['Element', 'Views']
<?php echo $str_views; ?>
]);

var options = {
title: '',
annotations: {
alwaysOutside: true,
textStyle: {
fontSize: 10,
color: '#222',
auraColor: 'none'
}
},
hAxis: {
title: 'Date',
format: 'Y-m-d'
},
vAxis: {
title: 'Views'
}
};


var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
chart.draw(data, options);



//    console.log("minutes - "," <?php //echo $str_minutes; ?>//");
    var data2 = google.visualization.arrayToDataTable([
        ['Element', 'Minutes']
        <?php echo $str_minutes; ?>
    ]);

    options = {
        title: '',
        annotations: {
            alwaysOutside: true,
            textStyle: {
                fontSize: 14,
                color: '#222',
                auraColor: 'none'
            }
        },
        hAxis: {
            title: 'Date',
            format: 'Y-m-d'
        },
        vAxis: {
            title: 'Minutes'
        }
    };


    var chart2 = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
    chart2.draw(data2, options);




    <?php
    if($dzsvg->mainoptions['analytics_enable_location']=='on'){
    ?>


    var data = google.visualization.arrayToDataTable([
        ['Country', 'Views']
        <?php echo $str_locs; ?>
    ]);

    var options = {};

    var chart3 = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart3.draw(data, options);
    <?php
    }
    ?>


}
</script>
<?php
}else{

        $videos_views = array();



        $final_table_arr = array();



        foreach($dzsvg->analytics_users as $lab => $au){

            if($au['video_title']==$_GET['title']){
                $final_table_arr[$au['user_id']] = array(

                    'views'=>$au['views'],
                    'seconds'=>$au['seconds'],
                );
            }
        }

//        print_r($final_table_arr);

//        print_r($dzsvg->analytics_users);

?>

<a href="index.php"><?php echo __("Back to all data"); ?></a>
<br>
    <br>
    <h4><?php echo ("Users who watched"); ?></h4>
<table class="pages-table">
    <thead>
    <tr>
        <th class="column-name">Video Title</th>
        <th class="column-author">Views</th>
        <th class="column-date">Minutes</th>

    </tr>
    </thead>
    <tbody>
    <?php foreach($final_table_arr as $lab => $vv){

        $title = __("Anonim");

        if($lab>0){
            $user = get_userdata($lab);
//            print_r($user);
            $title = $user->display_name;
        }

        echo '<tr>';
        echo '<td>';

        echo $title;

        echo '</td>';
        echo '<td>'.$vv['views'].'</td>';
        echo '<td>'.intval($vv['seconds']/ 60).'</td>';
        echo '</tr>';
    }
    ?>

    </tbody>
</table>
<?php



    }

}