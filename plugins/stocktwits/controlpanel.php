<?php
require_once('../../../wp-load.php');
require_once('util.php');
require_once('functions.php');

if (!chatmute_check_chat_admin()) {
	die("Unauthorized access");
}

$mute_list = chatmute_get_mutes();

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>DekmarTrades Mute Control Panel</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script type="text/javascript">
function api_unmute (user) {
	$.ajax({
	url:"api.php?action=unmute", //the page containing php script
		type: "GET", //request type
		data: {username : user},
		success:function(result){
			location.reload();
		}
});
}
</script>
</head>
<body>

<div class="container">
  <h2>DekmarTrades Mute Control Panel</h2>
  <table class="table table-striped">
	<thead>
	  <tr>
		<th>Username</th>
		<th>Time</th>
		<!--<th>Expire</th>-->
		<th>Actions</th>
	  </tr>
	</thead>
	<tbody>
	  <tr>
<?php
foreach ($mute_list as $user) {
	$username = $user->user_name;
	$mute_time = $user->time;
	$expire = ($user->type == 0 ? "Never" : $user->timeout);
?>
	  <tr>
	  <td><?=$username?></td>
	  <td><?=$mute_time?></td>
	  <!--<td><?=$expire?></td>-->
	  <td><a id="unmute" onclick="api_unmute('<?=$username?>')" class="btn btn-info" role="button">Unmute</a></td>
	</tr>
<?php
}
?>
	</tbody>
  </table>
</div>

</body>
</html>


