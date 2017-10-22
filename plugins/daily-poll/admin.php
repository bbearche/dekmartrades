<?php
require_once('../../../wp-load.php');
require_once('util.php');
require_once('functions.php');
if (!top_traders_check_chat_admin()) {
        die("Unauthorized access");
}
$result_list = daily_poll_get_results_admin(1);

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <title>DekmarTrades Daily Poll Admin</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script type="text/javascript">
$(document).ready(function() {
    var poll_id = 1;
    //Get display results status
    $.ajax({
        url:"api.php",
            type: "GET",
            data: {'action' : 'get_display_results', 'poll_id' : poll_id},
            success:function(result){
                if (result == false) {
                    $("#display_results_status").text("No");
                } else {
                    $("#display_results_status").text("Yes");
                }
            }
    });
    //Get choices
    $.ajax({
        url:"api.php",
            type: "GET",
            data: {'action' : 'get_choices', 'poll_id' : poll_id},
            success:function(result){
                $(result).each(function(i) {
                    $("#choice" + this['id']).val(this['name']);
                });
            }
    });
    $('#toggle_display_button').click(function(event) {
		$.ajax({
			url:"api.php",
				type: "POST",
				data: {'action' : 'toggle_display_results', 'poll_id' : poll_id},
				success:function(result){
					location.reload();
				}
		});
		event.preventDefault();
    });
    $('#reset_results_button').click(function(event) {
        if(confirm("Are you sure you want to reset all results?")) {
		$.ajax({
			url:"api.php",
				type: "POST",
				data: {'action' : 'reset_results', 'poll_id' : poll_id},
				success:function(result){
					location.reload();
				}
		});
        } else {
            return false;
        }
		event.preventDefault();
    });
	$('#set_choices_form').submit(function(event) {
        var fd = JSON.stringify($('#set_choices_form').serializeArray())
		console.log(event)
		$.ajax({
			url:"api.php",
				type: "POST",
				data: {'action' : 'set_choices', 'poll_id': poll_id, '1' : $(event.target[0]).val(), 'data': fd},
				success:function(result){
					//location.reload();
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
					//location.reload();
					console.log(result);
				}
		});
		event.preventDefault();
	});
});
</script>
</head>
<body>

<br>
<h2>Display Results: <span id="display_results_status"></span></h2> <input type="button" id="toggle_display_button" value="Toggle Display Results">
<br>
<br>
<h2>Set Choices</h2>
<form id="toggle_display_results">
</form>
<form id='set_choices_form'>
Choice 1: <input type='text' id="choice1" name='1'><br>
Choice 2: <input type='text' id="choice2" name='2'><br>

Choice 3: <input type='text id="choice3"' name='3'>
<br>
Choice 4: <input type='text id="choice4"' name='4'>
<br>
Choice 5: <input type='text id="choice5"' name='5'>
<br>
<input type="submit" value="Set">

</form> 

<h2>Results</h2>
<input type="button" id="reset_results_button" value="Reset Results">
  <table class="table table-striped">
        <thead>
          <tr>
                <th>Username</th>
                <th>Choice</th>
                <th>Reason</th>
          </tr>
        </thead>
        <tbody>
          <tr>
<?php
foreach ($result_list as $result) {
        $username = get_user_by('id', (int)$result->user_id)->display_name;
        $choice = daily_poll_get_choice_by_id((int)$result->choice);
        $reason = $result->reason;
?>
  	<tr>
          <td><?=$username?></td>
          <td><?=$choice?></td>
          <td><?=$reason?></td>
        </tr>
<?php
}
?>
        </tbody>
  </table>
</div>

</body>
</html>
