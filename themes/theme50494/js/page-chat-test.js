(function($){
    // Bind the function to global jQuery object.
    $.fn.reveal = function(){
        // Arguments is a variable which is available within all functions
        // and returns an object which holds the arguments passed.
        // It is not really an array, so by calling Array.prototype
        // he is actually casting it into an array.
        var args = Array.prototype.slice.call(arguments);

        // For each elements that matches the selector:
        return this.each(function(){
            // this is the dom element, so encapsulate the element with jQuery.
            var img = $(this),
                src = img.data("src");

            // If there is a data-src attribute, set the attribute
            // src to make load the image and bind an onload event.
            src && img.attr("src", src).load(function(){
                // Call the first argument passed (like fadeIn, slideIn, default is 'show').
                // This piece is like doing img.fadeIn(1000) but in a more dynamic way.
                img[args[0]||"show"].apply(img, args.splice(1));
            });
        });
    }
}(jQuery));
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
	//	stockChartInit(); //Load chart
	});
$(document).on("mouseover", ".stock_watchlist_link", function() {
        $("img", this).reveal();
});	
	
	//$("#stock-chart").load("//chart.yahoo.com/z?t=1d&q=l&l=on&z=m&p=m50,m200&s=KBIO");
	
	
	setInterval(function(){
		//console.warn("Updating stock watchlist");
		$("#stock-watchlist-outer").load("//dekmartrades.com/stock-watch #post-2532");

	}, 90 * 1000);
});
$(document).ready(function() {

	var $tabs = $('#tabs').tabs();
	var poppedOutTabs = [];
	//get selected tab
	function getSelectedTabIndex() {
	    return $tabs.tabs('option', 'active');
	}
	function getCurrentTab() {
		beginTabb = $("#tabs ul li:eq(" + getSelectedTabIndex() + ")").find("a");
		var curTabb = $(beginTabb).attr("href");
		return curTabb;

	}
	function getCurrentTabUrl() {
		beginTabb = $("#tabs ul li:eq(" + getSelectedTabIndex() + ")").find("a");
		var curTabb = $(beginTabb).attr("rel");
		return curTabb;

	}
	function popoutText() {
		return '<br><a id="popout_text" href="#">This chatbox is hidden. Click here to show.</a>';
	}
	//get tab contents
	beginTab = $("#tabs ul li:eq(" + getSelectedTabIndex() + ")").find("a");
	var curTab = $(beginTab).attr("href");
	var curTabUrl = $(beginTab).attr("rel");
	//loadTabFrame(curTab, curTabUrl);
	// Load tabs
	//$("#tabs ul li").find("a").each(function() {
	//	loadTabFrame($(this).attr("href"), $(this).attr("rel"));
	//})
	$("a.tabref").click(function() {
	   // unloadTabs();
	   // loadTabFrame($(this).attr("href"),$(this).attr("rel"));
	});
	$(document).on('click', '#chat_popout', function(e) {
	    popOutChatCurrent();
	    e.preventDefault();
	});
	$(document).on('click', "#popout_text", function(e) {
	    //remove from popout list
	    poppedOutTabs = $.unique(poppedOutTabs);
	    poppedOutTabs.splice($.inArray(getCurrentTab(), poppedOutTabs), 1);
	    //clear tab html
            $(getCurrentTab()).html("");
	    //reload tab
            loadTabFrame(getCurrentTab(), getCurrentTabUrl());
	    e.preventDefault();
	});
	//tab switching function
	function unloadTabs() {
		console.log("unlaading tab");
		//$(getCurrentTab()).empty();
		$("#tabs-2").html("");
		$("#tabs-3").html("");
		$("#tabs-4").html("");
		$("#tabs-5").html("");
		$("#tabs-6").html("");
		
	}

	function loadTabFrame(tab, url) {
	    if (($(tab).find("iframe").length == 0) && ($.inArray(tab, poppedOutTabs) ==-1)) {
		var html = [];
		html.push('<div class="tabIframeWrapper"><iframe class="iframetab" src="' + url + '">Load Failed?</iframe></div>');
		if (tab != "#tabs-5") {
			html.push('<a id="chat_popout" style="color: #0490db;" href="#">Pop out this chat</a>');
		}
		$(tab).append(html.join(""));
		$(tab).find("iframe").height("650px");
	    }
	    console.log("loading tab " + tab);
	    if (tab == "#tabs-6") {
		$("#top-traders-dropdown").hide();
	    } else {
		$("#top-traders-dropdown").show();
	        
	    }
	    return false;
	}
	function popOutChatCurrent() {
		var t = getCurrentTab();
		var tU = getCurrentTabUrl();;
		window.open(tU, t, 'width=800, height=650');
		$(t).html(popoutText());
		poppedOutTabs.push(t);	
		return false;
	}

$(".iframetab").on("load", function() {
	$(".drupalchat-embed-chatroom-container").attr("style", "height: 500px !important");
	$(".drupalchat-embed-chatroom-content").attr("style", "height: 500px !important");
	console.log(getCurrentTab());
});
});
$(document).ready(function() {
	$(document).on('click', '.stock-alert-popout', function(e) {
	console.log("stock alert popout");
	    popOutAlertBox();
	    e.preventDefault();
	});
	function popOutAlertBox() {
		window.open("//dekmartrades.com/alert-box-popout", "alert-box", 'width=400, height=600');
		$(".alert-box-inner").html("");
		$(".alert-box-js").html("");
		//$("#stock-alert-container").css("height", "40px");
		//$("#stock-alert-container-top").html("");
		//$("#stock-alert-container-top").css("height", "40px");

		return false;
	}
    
$("#top-traders-dropdown-button").click(function() {
	$("#top-traders-dropdown-content").toggle();
})
});
$(window).load(function() {
	$("#top-traders-dropdown").show();
});
