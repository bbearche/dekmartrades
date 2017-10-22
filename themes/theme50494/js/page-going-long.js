var stockChartImg = "#stock-chart-img"
var stockChartLink = "#stock-chart-link"

function stockChartSym($sym) {
	$(stockChartImg).attr("src", "//chart.yahoo.com/z?t=1d&q=l&l=on&z=m&p=m50,m200&s=" + $sym);
	$(stockChartLink).attr("href", "https://finance.yahoo.com/q?s=" + $sym);
	//$(stockChartImg).css("background", "url(//chart.yahoo.com/z?t=1d&q=l&l=on&z=m&p=m50,m200&s=" + $sym + ") 0% 0% no-repeat");
}

function stockChartInit() {
	// Grab first stock in watchlist chart
	$initStock = $(".stock_table").find(".stock_widget_row").eq(1).find(".stock_widget_element").first().text();
	//Set image to stock
	stockChartSym($initStock);
}

$.ajaxSetup(
{
	cache:false
});
$(function() {
	$("#stock-watchlist-outer").load("//dekmartrades.com/stock-watch #post-2532", function() {
		stockChartInit(); //Load chart
	});
	
	//$("#stock-chart").load("//chart.yahoo.com/z?t=1d&q=l&l=on&z=m&p=m50,m200&s=KBIO");
	
	
	setInterval(function(){
		//console.warn("Updating stock watchlist");
		$("#stock-watchlist-outer").load("//dekmartrades.com/stock-watch #post-2532");

	}, 10 * 1000);
});
