<?php
//include_once('util.php');
function stocktwits_embed_shortcode() {
ob_start();
?>
<script type="text/javascript" src="https://stocktwits.com/addon/widget/2/widget-loader.min.js"></script>
<style type="text/css">
#stocktwits_container {

	margin-right: 1px;
	height: 600px;
}
#stocktwits_content {
	display: flex;
	flex-wrap: wrap;
	overflow: scroll;
	overflow-x: hidden;
	height: 576px;
	
}
.stocktwits_feed {
	/*flex: 1;
	width: 300px;*/
	position: relative;
}
.stocktwits_button_removefeed {
    position: absolute;
    right: 0px;
    margin-right: 0px;
    height: 39px;
}
</style>
<script type="text/javascript">
var stocktwits_feed_list = [];
function add_feed(feed, save = true) {
	console.log(feed);
	$("#stocktwits_content").append("<div class=\"stocktwits_feed\" ticker=\"" + feed + "\" id=\"stocktwits_feed_" + feed + "\"><button class=\"stocktwits_button_removefeed ui-button ui-widget ui-corner-all\">X</button></div>")
	STWT.Widget({
		container: 'stocktwits_feed_' + feed,
		symbol: feed,
		width: '329',
		height: '430',
		limit: '15',
		scrollbars: 'true',
		streaming: 'true',
		title: feed,
		style: {
			link_color: '4871a8',
			link_hover_color: '4871a8',
			header_text_color: '000000',
			border_color: 'cecece',
			divider_color: 'cecece',
			divider_color: 'cecece',
			divider_type: 'solid',
			box_color: 'f5f5f5',
			stream_color: 'ffffff',
			text_color: '000000',
			time_color: '999999'
		}
	});
	stocktwits_feed_list.push(feed);
	if (save) {
		save_feeds();
	}
}

function remove_feed(event) {
	parent = $(event.target).parent()
	console.log(parent);
	ticker = parent[0].getAttribute("ticker");
	stocktwits_feed_list.splice( $.inArray(ticker, stocktwits_feed_list), 1 );
	parent.remove();
	save_feeds();
}
function load_feeds() {
	jQuery.ajax({
		url: "/wp-content/plugins/stocktwits/api.php?action=load",
		type: "GET",
		success: function (data, status) {
			data = JSON.parse(data)
			$.each(data, function(key, val) {
				add_feed(val, false);
			});
		},
		timeout: 300000
	})
}
function save_feeds() {
	console.log("saving feeds");
	jQuery.ajax({
		url: "/wp-content/plugins/stocktwits/api.php",
		type: "POST",
		data: {action: "save", data: JSON.stringify(stocktwits_feed_list)},
		dataType: "json",
		timeout: 300000
	})
	
}

$( function() {
	$(document).on("click", "#stocktwits_button_addfeed", function(event) {
		event.preventDefault();
		var feed = prompt("Please enter ticker symbol of stock feed to track.", "AAPL");
		    if (feed === null || feed == "") {
        		return;
		    }
		if (stocktwits_feed_list.indexOf(feed) == -1) {
			add_feed(feed);
		}
	});
	$(document).on("click", ".stocktwits_button_removefeed", function(event) {
	console.log("button press remove");
		remove_feed(event);
		event.preventDefault();
	});
	load_feeds();
	//add_feed("GOOG");
	//add_feed("AAPL");
});
</script>
<div id="stocktwits_container">
<div id="stocktwits_header">
<button id="stocktwits_button_addfeed" class="ui-button ui-widget ui-corner-all">+ Add Stock</button>
</div>
<div id="stocktwits_content">
</div>
</div>

<?php
$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
