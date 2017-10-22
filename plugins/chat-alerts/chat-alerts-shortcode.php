<?php
//include_once('util.php');
function top_traders_top10_embed_shortcode() {
ob_start();
?>
<div class="chat-alerts">
	<div id="chat-alerts-innter">
        <h1 id="chat-alerts-header" class="chat-alerts-header centered">Chat Alerts</h1>
        <table id="chat-alerts-table">
		<thead id="top-traders-head">
		    <tr>
			<th>User</th>
			<th>Stars</th>
		    </tr>
		</thead>
                <tbody id="top-traders-streamer">
                </tbody>
        </table>
	</div>
</div>


<script type="text/javascript">

function add_top_trader(v) {
	jQuery("#top-traders-streamer").append(
		"<tr class='top-trader-item' id='top-trader-" + v['id'] + "'>" +
			"<th class='top-trader-username'>" + v['user_name']  + "</th>" +  
			"<th class='top-trader-stars'>" + v['stars']  + " x <img class='top-traders-star' src='/wp-content/plugins/top-traders/star.png'></img></th>" +  
			//"<th class='top-trader-stars'><img src='/wp-content/plugins/top-traders/star.png'></img> x "  + v['stars']  + "</th>" +  
		"</tr>"
	);

}
var top_trader_poll = function top_traders_top10_poll() {
    jQuery.ajax({
        url: "/wp-content/plugins/top-traders/api.php?action=top10",
        type: "GET",
        success: function(data) {
	    jQuery("#top-traders-streamer").empty();
	    jQuery.each(data, function(k, v) {
		add_top_trader(v);
	    });
        },
        dataType: "json",
        timeout: 20000
    })
};
top_trader_poll();
//poll();
setInterval(function(){ top_trader_poll(); }, 60000);
</script>
	

<?php
$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
