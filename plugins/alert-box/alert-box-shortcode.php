<?php
include_once('util.php');
function stock_alert_embed_shortcode() {
ob_start();
?>
<script src="//use.fontawesome.com/bcafdb41f8.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-with-data.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.13/moment-timezone-utils.js"></script>
<div class="alert-box">
	<div class="alert-box-inner">
        <h1 class="alert-stream-header centered">Alert Box <i title="Pop Out" style="cursor: pointer;" class="stock-alert-popout fa fa-clone fa-1 fa-flip-horizontal" aria-hidden="true"></i></h1>
        <table class="alert-table">
		<div class="expire-dialog">
		<thead class="alert-head">
		    <tr>
			<?php
			if(stockalert_check_chat_admin()) {
			?>
			<th class="alert-head-item" style="width: 4%;"></th>
			<th class="alert-head-item" style="width: 4%;"></th>
			<?php
			}
			?>
			<th class="alert-head-item">Time</th>
			<th class="alert-head-item">Position</th>
			<th class="alert-head-item">Stock</th>
			<th class="alert-head-item">Entry Price</th>
			<th class="alert-head-item">Stop Loss</th>
			<th class="alert-head-item">Sell Price</th>
		    </tr>
		</thead>
                <tbody class="alert-streamer">
                </tbody>
        </table>
	</div>
	<?php
	if(stockalert_check_chat_admin()) {
	?>
	<div class="alert_admin">
	<form style="" class="alert-add-form" method="post">
	    <input type="hidden" name="action" value="add">
	    <select style="width:19%; height:39px; margin-bottom: 0px;" name="position">
		<option value="Long">Long</option>
		<option value="Short">Short</option>
	    </select>
	    <input style="width:12%" placeholder="Stock" type="text" name="stock">
	    <input style="width:11%" placeholder="Entry" type="text" name="entry_price">
	    <input style="width:10%" placeholder="Stop Loss" type="text" name="stop_loss">
	    <input style="width:9%" placeholder="Exit" type="text" name="exit_price">
	    <br>
	    <!--<div style="text-align: center;" class="alert-submit-holder">
	    <input style="margin-top: 10px;" type="submit" value="Add">
	    </div>-->
	</form>
	</div>
	<?php
	}
	?>
</div>


<?php
$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
include_once('util.php');
function stock_alert_embed_shortcode_scripts() {
ob_start();
?>
<script type="text/javascript">
var alert_flash_timers_long = new Array();
var alert_flash_timers_short = new Array();

$(document).ready(function() {
	setInterval(function() {
		$(alert_flash_timers_long.join()).effect('highlight', {color:"#669966"}, 2000)
		$(alert_flash_timers_short.join()).effect('highlight', {color:"#ff1a1a"}, 2000)
	}, 2000);
});

function update_now() {
    jQuery.ajax({
        url: "/wp-content/plugins/alert-box/api.php?action=list",
        type: "GET",
        success: function(data) {
	    jQuery(".alert-streamer").empty();
	alert_flash_timers_long = []
	alert_flash_timers_short = []
	    jQuery.each(data, function(k, v) {
		add_alert(v);
	    });
        },
        dataType: "json"
    })

}
function add_alert_post(e) {
	    $.ajax({
		   type: "POST",
		   url: "/wp-content/plugins/alert-box/api.php",
		   data: $(e.target.form).serialize(),
		   success: function(data)
		   {
		    jQuery.ajax({
			url: "/wp-content/plugins/alert-box/api.php?action=list",
			type: "GET",
			success: function(data) {
			    jQuery(".alert-streamer").empty();
			    jQuery.each(data, function(k, v) {
				add_alert(v);
				jQuery(".alert-add-form")[0].reset()
			    });
			},
			dataType: "json"});
		   }
		 });
}

jQuery(".alert-add-form").keypress(function(event) {
	if (event.which == 13) {
	    add_alert_post(event);
	    return false;
}
});

function expire_alert_dialog(id) {
    var attr = $(".alert-box-"+id).attr('expired');
    if (typeof attr !== typeof undefined && attr !== false) {
	remove_alert(id);
	return;
    }
    $(".expire-dialog").dialog({
	appendTo: ".alert-stream-header",
	position: { my: "center", at: "center", of: ".alert-table" },
	draggable: false,
	resizable: false,
	title: "Expire alert",
	buttons: [
	    {
 	    	text: "Win",
		click: function() {
		    expire_alert(id, 1);
		    $(this).dialog("close");
		}
 	    },
	    {
 	    	text: "Loss",
		click: function() {
		    expire_alert(id, 0);
		    $(this).dialog("close");
		}
 	    }
	]
    });
}
function expire_alert(id, verdict) {
    stop_highlight_alert(id);
    jQuery.ajax({
        url: "/wp-content/plugins/alert-box/api.php",
        type: "POST",
	data: {'action': 'expire', 'id': id, 'verdict': verdict},
        success: function(data) {
		update_now();
        }
    })

}
function remove_alert(id) {
    stop_highlight_alert(id);
    jQuery.ajax({
        url: "/wp-content/plugins/alert-box/api.php",
        type: "POST",
	data: {'action': 'remove', 'id': id},
        success: function(data) {
		update_now();
        }
    })

}

function start_highlight_alert(id) {
    jQuery.ajax({
        url: "/wp-content/plugins/alert-box/api.php",
        type: "POST",
	data: {'action': 'highlight', 'id': id},
        success: function(data) {
		update_now();
        }
    })

}
function stop_highlight_alert(id) {
    jQuery.ajax({
        url: "/wp-content/plugins/alert-box/api.php",
        type: "POST",
	data: {'action': 'stop_highlight', 'id': id},
        success: function(data) {
		update_now();
        }
    })

}
function end_highlight_alert(id) {
	var name = ".alert-box-"+id
	var index = alert_flash_timers_long.indexOf(name)
	if (index != -1) {
		alert_flash_timers_long.splice(index, 1);
	}
	index = alert_flash_timers_short.indexOf(name)
	if (index != -1) {
		alert_flash_timers_short.splice(index, 1);
	}
}
function highlight_alert(alert) {
	id = alert.attr('alert-id');
	name = '.alert-box-' + alert.attr('alert-id')
	position = alert.children('.alert_position').text()

	if (position == "Long") {
	    if ($.inArray(name, alert_flash_timers_long) != -1) {
		stop_highlight_alert(id)
	    } else {
		start_highlight_alert(id);
		alert_flash_timers_long.push('.alert-box-'+id);
	    }
	} else if (position == "Short") {
	    if ($.inArray(name, alert_flash_timers_short) != -1) {
		stop_highlight_alert(id)
	    } else {
		start_highlight_alert(id);
		alert_flash_timers_short.push('.alert-box-'+id);
	    }
	}
}


jQuery('.alert-streamer').on('click', '.alert-remove-button', function(evt) {
	expire_alert_dialog(jQuery(this).parent().parent().attr('alert-id'))
});
jQuery('.alert-streamer').on('click', '.alert-highlight-button', function(evt) {
	highlight_alert(jQuery(this).parent().parent())
});

var alert_audio = document.createElement('audio');
alert_audio.setAttribute('src', '/wp-content/plugins/alert-box/chime.wav');
alert_audio.volume = 0.5;


var initial_alerts = true;
var previous_alerts = []
var current_alerts = []

function add_alert(v) {
	v['time'] = moment.utc(v['time'], 'Y-M-D hh:mm:ss').tz("America/New_York").format("h:mma");
	<?php
	if(stockalert_check_chat_admin()) {
	?>
	jQuery(".alert-streamer").append(
		"<tr style='//font-size: 1vw;' alert-id='" + v['id']  +"' class='alert-item alert-box-" + v['id'] + "'>" +
			"<td class='alert-remove'><span class='alert-remove-button' style='cursor: pointer;'>&#10006;</span></td>" +
			"<td class='alert-highlight'><span class='alert-highlight-button' style='cursor: pointer;'>&#9788;</span></td>" +
			"<td class='alert_time'>" + v['time'] +"</td>" +  
			"<td class='alert_position'>" + v['position']  + "</td>" +  
			"<td class='alert_stock'><a target='_blank' href='https://finance.yahoo.com/q?s=" + v['stock'] + "'>$" + v['stock']  + "</a></td>" +  
			"<td class='alert_entry_price'>$" + Number(v['entry_price']).toFixed(2)  + "</td>" +
			"<td class='alert_stop_loss'>$" + Number(v['stop_loss']).toFixed(2)  + "</td>" +
			"<td class='alert_exit_price'>$" + Number(v['exit_price']).toFixed(2)  + "</td>" +
		"</tr>"
	);
	
	<?php
	} else {
	?>
	jQuery(".alert-streamer").append(
		"<tr style='' class='alert-item alert-box-" + v['id'] + "'>" +
			"<td class='alert_time'>" + v['time']  + "</td>" +  
			"<td class='alert_position'>" + v['position']  + "</td>" +  
			"<td class='alert_stock'><a target='_blank' href='https://finance.yahoo.com/q?s=" + v['stock'] + "'>$" + v['stock']  + "</a></td>" +  
			"<td class='alert_entry_price'>$" + Number(v['entry_price']).toFixed(2)  + "</td>" +
			"<td class='alert_stop_loss'>$" + Number(v['stop_loss']).toFixed(2)  + "</td>" +
			"<td class='alert_exit_price'>$" + Number(v['exit_price']).toFixed(2)  + "</td>" +
		"</tr>"
	);
	<?php
	}
	?>
	current_alerts.push(v['id']);
	if (v['highlight'] == 1) {
	    if (v['position'] == 'Long') {
		alert_flash_timers_long.push('.alert-box-'+v['id'])
	    } else if (v['position'] == 'Short') {
		alert_flash_timers_short.push('.alert-box-'+v['id'])
	    }
	}
	if (v['expired'] == 1) {
	    var alert = $('.alert-box-' + v['id']);
	    alert.attr('expired', '1');
	    alert.fadeTo(0, 0.2);
	    alert.find("a").removeAttr('href');
	    if (v['verdict'] == 0) {
	        alert.children(".alert_position").toggleClass("loss");
	    } else if(v['verdict'] == 1) {
	        alert.children(".alert_position").toggleClass("win");
	    }
	}
	var dE = jQuery('.alert-box-inner');
	dE.scrollTop(dE.prop('scrollHeight'));
	if (!initial_alerts && $.inArray(v['id'], previous_alerts) == -1) {
	//if (!initial_alerts) {
	    alert_audio.play();
	}

}
var poll = function alert_box_poll() {
    jQuery.ajax({
        url: "/wp-content/plugins/alert-box/api.php?action=list",
        type: "GET",
        success: function(data) {
	    jQuery(".alert-streamer").empty();
	    previous_alerts = current_alerts;
	    current_alerts = [];
	    alert_flash_timers_long = [];
	    alert_flash_timers_short = [];

	    jQuery.each(data, function(k, v) {
		add_alert(v);
	    });
	    if (initial_alerts) {
		previous_alerts = current_alerts;
		initial_alerts = false;
	    }
        },
        dataType: "json",
       // complete: setTimeout(function() {alert_box_poll()}, 20000),
        timeout: 40000
    })
};
poll();
poll();
setInterval(function(){ poll(); }, 25000);
</script>
	

<?php
$sc = ob_get_contents();
ob_end_clean();
return $sc;

}
