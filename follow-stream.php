<?php
function follow_stream(){
	ob_start();
?>
<div class="follow-stream">
	<h1 class="stream-header centered">Chat Alerts</h1>
	<table>
		<tbody id="streamer">
		</tbody>
	</table>
</div>


<?php
			
	// Variables
		$current_user_id = get_current_user_id();
		$followers = bp_get_following_ids( 'user_id=' . $current_user_id );	
		$follower_exp = explode(",", $followers);
		$n = count($follower_exp);
		$s = '';
		$follow_wrap = '"';
			
?>

<!--<div class="follow-information">	
	<input id="current-user" value="<?php echo $current_user_id; ?>" class="hide" disabled />
	<input id="followers" value="<?php echo $followers; ?>" class="hide" disabled />
</div>-->

	<script type="text/javascript">
			var chatAlertInsertListener = function(event){
				if (event.animationName == "nodeInserted") {
					// This is the debug for knowing our listener worked!
					// event.target is the new node!
	 				console.warn("Another node has been inserted! ", event, event.target);
					elm = event.target;
					cln = elm.cloneNode(true);
					var userF = $(cln).find('.drupalchat-embed-chatroom-content-user a').text()
					postedClass = $(cln).find('.drupalchat-embed-chatroom-content-user a').attr('class');				
					postedBy = $(cln).find('.drupalchat-embed-chatroom-content-user a').text().replace("Profile | Public Message | Private Message", "");
					alertMessage = $(cln).find('.drupalchat-embed-chatroom-content-msg p')
					console.log(alertMessage);
					textOnly = $(alertMessage).text()
					console.log(textOnly);


					$(cln).find('.drupalchat-embed-chatroom-content-user a').text(postedBy)

					console.log("chat alert");
					console.log(postedBy);
					
					if(postedClass != 'drupalchat-you'){
						postedIDbreak = postedClass.split('_').pop();
						postedID = postedIDbreak;
						
					}else {
						postedID = 'NaN';
					}
					
					// Date Time Condition Data to decide append vs. prepend since the initial chat log posts to follow stream backwards
						var dt = new Date();
						var time = dt.getHours() + ":" + dt.getMinutes();
						var postedTime = $(cln).find('.chatboxtime').text();
						
	// 					alert('Posted Time: ' + postedTime + ' Current Time: ' + time);
					
					
					if (textOnly.startsWith('/alert') == true) {
						elm.remove();
						if (postedBy == "DekmarTrades") {
							console.log("chatAlerts: dekmar match");
							if(postedTime != time){
								$("#streamer").prepend(cln);
							}else {
								$("#streamer").append(cln);
							}
						}
					}
					/*if( followersData.indexOf(postedID) !== -1 ){				
						if(postedTime != time){
							$("#streamer").append(cln);
						}else {
							$("#streamer").prepend(cln);
						}
					}*/
				}
	// 				console.log(elm);
					
			}
		
$("body").on('DOMNodeInserted', '#tabs', function(e) {
		console.log("iframe insert");
		console.log(e);
		var iframe = $(this).find(".iframetab");
		$(iframe).load(function(){
		console.log("iframe loaded");
		console.log(iframe[0].contentDocument);
		iframe[0].contentDocument.addEventListener("animationstart", chatAlertInsertListener, false); // standard + firefox
		iframe[0].contentDocument.addEventListener("MSAnimationStart", chatAlertInsertListener, false); // IE
		iframe[0].contentDocument.addEventListener("webkitAnimationStart", chatAlertInsertListener, false); // Chrome + Safari
		});
});
//$(".iframetab").load(function(){
		
		//document.getElementByClassName("iframetab").contentDocument.addEventListener("animationstart", chatAlertInsertListener, false); // standard + firefox
		//document.getElementByClassName("iframetab").contentDocument.addEventListener("MSAnimationStart", chatAlertInsertListener, false); // IE
		//document.getElementByClassName("iframetab").contentDocument.addEventListener("webkitAnimationStart", chatAlertInsertListener, false); // Chrome + Safari
//});
		
	</script>

<?php
	$sc = ob_get_contents();

	ob_end_clean();

	return $sc;
}// End some_random_code()

?>
