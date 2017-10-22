<?php
require_once('../../../wp-load.php');
require_once('util.php');
require_once('functions.php');
if (!top_traders_check_chat_admin()) {
        die("Unauthorized access");
}

$user_list = top_traders_get_users();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>DekmarTrades Top Traders Admin</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
	$('#add_user_form').submit(function(event) {
		console.log(event)
		$.ajax({
			url:"api.php",
				type: "POST",
				data: {'action' : 'add', 'username' : $('input[name=username]', this).val()},
				success:function(result){
					location.reload();
				}
		});
		event.preventDefault();
	});
	$('.set_stars_form').submit(function(event) {
		var formData = {'action' : 'update', 'username' : $(event.target[0]).val(), 'stars' : $(event.target[1]).val()}
		$.ajax({
			url:"api.php",
				type: "POST",
				data: formData,
				success:function(result){
					location.reload();
					console.log(result);
				}
		});
		event.preventDefault();
	});
});
</script>
</head>
<body>

<h2>Add User</h2>
<form id='add_user_form'>
<input type='text' name='username'>
<input type="submit" value="Add">

</form> 

<h2>User List</h2>
  <table class="table table-striped">
        <thead>
          <tr>
                <th>Username</th>
                <th>Stars</th>
                <th>Save</th>
          </tr>
        </thead>
        <tbody>
          <tr>
<?php
foreach ($user_list as $user) {
        $username = $user->user_name;
        $stars = $user->stars;
?>
  	<tr>
	<form class='set_stars_form'>
          <td><input type="text" name="username" value="<?=$username?>" disabled></td>
          <td><input type='text' name='stars' value='<?=$stars?>'></td>
          <td><input type='submit' value='Save'></td>
	</form>
        </tr>
<?php
}
?>
        </tbody>
  </table>
</div>

</body>
</html>
