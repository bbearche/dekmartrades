<?php
//include_once('util.php');
include_once('functions.php');
function daily_poll_shortcode() {
ob_start();

$choice_names = array();
$choice_names[1] = daily_poll_get_choice_by_id(1);
$choice_names[2] = daily_poll_get_choice_by_id(2);
$choice_names[3] = daily_poll_get_choice_by_id(3);
$choice_names[4] = daily_poll_get_choice_by_id(4);
$choice_names[5] = daily_poll_get_choice_by_id(5);

$choices = daily_poll_get_choices(1); //First poll only
$js_choices = array();
foreach ($choices as $choice) {
	$js_choices[] = $choice['name'];
}
$js_choices = json_encode(array_filter($js_choices));

$votes = daily_poll_get_results(1);
$vote_counts = daily_poll_get_result_counts(1);
$js_vote_counts = array(1 => 0, 2 => 0, 3 => 0, 4 => 0, 5 => 0);
$js_pie_vote_counts = array($choice_names[1] => 0, $choice_names[2] => 0, $choice_names[3] => 0, $choice_names[4] => 0, $choice_names[5] => 0);
foreach ($vote_counts as $choice) {
	$js_vote_counts[$choice['choice']] = (int)$choice['count'];
	$js_pie_vote_counts[$choice_names[(int)$choice['choice']]] = (int)$choice['count'];
}
$js_vote_counts = json_encode(array_values($js_vote_counts));
$js_pie_vote_counts = json_encode($js_pie_vote_counts);
?>

<!--[if lt IE 9]><script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/excanvas.min.js"></script><![endif]-->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"></script>
<script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/jquery.jqplot.min.js"></script>
<script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.barRenderer.min.js"></script>
<script language="javascript" type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/plugins/jqplot.categoryAxisRenderer.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/jqPlot/1.0.8/jquery.jqplot.min.css" />
<style type="text/css">
.vote-box-container {
    width: 500px;
    display: block;
    margin: 0 auto;
    box-shadow: 0 0 2px 2px #BBB7B7;
    padding: 10px;
}
#vote-form {
    margin: 0px;
}
#reason-input {
    width: 95%;
}
table {
    border-collapse: collapse;
    width: 65%;
    margin: 0 auto;
}

th, td {
    text-align: left;
    padding: 8px;
}

tr:nth-child(even){background-color: #f2f2f2}

th {
    background-color: rgb(94, 169, 221);
    color: white;
}
input[type="radio"]{
    vertical-align: top;
}
</style>
<script type="text/javascript">
var poll_id = 1;
var choices = <?=$js_choices;?>;
jQuery(document).ready(function() {
    jQuery('#vote-form').submit(function(event) {
		jQuery.ajax({
			url:"/wp-content/plugins/daily-poll/api.php",
				type: "POST",
				data: {'action' : 'add_vote', 'poll_id' : poll_id, 'choice': jQuery('input[name=choice]:checked', '#vote-form').val(), 'reason': jQuery('input[name=reason]', '#vote-form').val()},
				success:function(result){
					location.reload();
				}
		});
		event.preventDefault();
    });
	$.jqplot.config.enablePlugins = true;
	var s1 = <?=$js_vote_counts;?>;
		
	plot1 = $.jqplot('chartdiv', [s1], {
		// Only animate if we're not using excanvas (not in IE 7 or IE 8)..
		animate: !$.jqplot.use_excanvas,
		seriesDefaults:{
			renderer:$.jqplot.BarRenderer,
			pointLabels: {
							show: true,
						 }
		},
		axes: {
			xaxis: {
				renderer: $.jqplot.CategoryAxisRenderer,
				ticks: choices
			}
		},
		highlighter: { show: false }
	});
	
});
</script>
<div class="vote-box-container">
<?php
if (allowed_to_vote(get_current_user_id())) {
?>
    <form id="vote-form">
    <?php 
    foreach ($choices as $key=>$value) {
        if (!empty($value['name'])) {
    ?>
        <label><input type="radio" name="choice" value="<?=$value['id']?>"> <a href="https://finance.yahoo.com/quote/<?=$value['name']?>" target="_blank"><?=$value['name']?></a></label>
    <?php
        }
    }
    ?>
    Reason:<br><input type="text" id="reason-input" name="reason"><br><br>
    <div style="text-align: center;">
        <input type="submit" value="Vote">
    </div>
    </form>
    </div>
<?php
} else {
?>
    <h3 style="margin: 5px;" class="centered">Thanks for your vote!</h3>
<?php
}
?>
</div>
    <br>
<div class="daily-poll centered">
	<div id="daily-poll-inner">
        <h1 id="daily-poll-header" class="daily-poll-header centered">Results</h1>
<?php
if (daily_poll_display_results(1)) {
?>
<div id="chartdiv" style="margin: 0 auto; height:400px;width:800px; "></div>
<br><br>
        <table style="margin: 0 auto;" id="daily-poll-table">
		<thead id="daily-poll-head">
		    <tr>
			<th>Vote</th>
			<th>Reason</th>
		    </tr>
		</thead>
                <tbody id="daily-poll-streamer">
<?php

foreach ($votes as $vote) {
?>
<tr>
<td><?=$choice_names[(int)$vote->choice]?></td>
<td><?=$vote->reason?></td>
</tr>
<?php
}
?>
                </tbody>
        </table>
<?php
} else {
?>
    <h4 class="centered">Sorry, results are not yet available.</h4>
<?php
}
?>
	</div>
</div>


<script type="text/javascript">

</script>
	

<?php
$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
